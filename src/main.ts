import WaveSurfer from 'wavesurfer.js';
import RegionsPlugin from 'wavesurfer.js/dist/plugins/regions.esm.js';
import './style.css';
import { type Character, ROLE_COLORS, ROLE_LABELS, colorByName } from './characters';
import { type Comment, type ViewMode } from './types';
import {
  loadAuthor, saveAuthor,
  loadComments, saveComments, normalizeComment,
  loadCharacters, saveCharacters,
} from './storage';

const AUDIO_EXT = new Set(['wav', 'mp3', 'm4a', 'aac', 'ogg', 'flac', 'wma', 'opus']);
const GRID_COLS = 4;
const PREV_SKIP = 1.5;
const NEXT_SKIP = 0.25;
const PROJECT_FILE = 'voicepicker.json';

interface AudioEntry {
  name: string;
  handle: FileSystemFileHandle;
}

// ---- 狀態 ----
let entries: AudioEntry[] = [];
let currentIndex = -1;
let currentUrl: string | null = null;
let view: ViewMode = 'single';
let gridIndex = 0;
let projectDir: FileSystemDirectoryHandle | null = null;
let saveTimer: number | undefined;

let author = loadAuthor();
let comments = loadComments();
let characters = loadCharacters();

let pendingTime = 0;
let composerAttachTime = true;
let composerChars: string[] = [];
let composerFocus: 'text' | 'toggle' | number = 'text';
let editingCharId: string | null = null;
let replyingId: string | null = null;
let nameCallback: (() => void) | null = null;

// 角色視圖
let roleCards: Comment[] = []; // 角色視圖中卡片的扁平順序（鍵盤巡覽用）
let roleFocusIndex = 0;
let inlinePlayingId: string | null = null; // 角色視圖中就地播放的留言 id

// ---- DOM ----
const $ = <T extends HTMLElement>(id: string): T => document.getElementById(id) as T;
const pickBtn = $<HTMLButtonElement>('pick');
const editCharsBtn = $<HTMLButtonElement>('editChars');
const roleViewBtn = $<HTMLButtonElement>('roleViewBtn');
const fileListEl = $<HTMLUListElement>('filelist');
const nowPlayingEl = $<HTMLHeadingElement>('nowplaying');
const statusEl = $<HTMLDivElement>('status');
const playBtn = $<HTMLButtonElement>('playBtn');
const appVerEl = $<HTMLSpanElement>('appVer');
const sidebarEl = $<HTMLElement>('sidebar');
const playerEl = $<HTMLElement>('player');
const gridEl = $<HTMLDivElement>('grid');
const roleviewEl = $<HTMLDivElement>('roleview');
const commentsAsideEl = $<HTMLElement>('comments');
const commentsHeadEl = $<HTMLHeadingElement>('commentsHead');
const commentListEl = $<HTMLUListElement>('commentlist');

const composerEl = $<HTMLDivElement>('composer');
const composerToggle = $<HTMLButtonElement>('composerToggle');
const composerText = $<HTMLTextAreaElement>('composerText');
const composerCharsEl = $<HTMLDivElement>('composerChars');

const nameModalEl = $<HTMLDivElement>('nameModal');
const nameInput = $<HTMLInputElement>('nameInput');

const charModalEl = $<HTMLDivElement>('charModal');
const charEditListEl = $<HTMLUListElement>('charEditList');
const newCharName = $<HTMLInputElement>('newCharName');
const newCharRole = $<HTMLSelectElement>('newCharRole');
const addCharBtn = $<HTMLButtonElement>('addCharBtn');
const closeCharBtn = $<HTMLButtonElement>('closeCharBtn');

// ---- WaveSurfer ----
const ws = WaveSurfer.create({
  container: '#waveform',
  waveColor: '#7a8ba6',
  progressColor: '#3b82f6',
  cursorColor: '#ef4444',
  height: 120,
});
const regions = ws.registerPlugin(RegionsPlugin.create());

ws.on('ready', () => {
  statusEl.textContent = `${formatTimeMs(0)} / ${formatTimeMs(ws.getDuration())}`;
});
ws.on('timeupdate', (t: number) => {
  statusEl.textContent = `${formatTimeMs(t)} / ${formatTimeMs(ws.getDuration())}`;
});
ws.on('play', () => { playBtn.textContent = '⏸ 暫停'; if (view === 'role') updateRolePlayButtons(); });
ws.on('pause', () => { playBtn.textContent = '▶ 播放'; if (view === 'role') updateRolePlayButtons(); });
ws.on('finish', () => {
  if (view === 'single' && currentIndex < entries.length - 1) void selectIndex(currentIndex + 1);
  else if (view === 'role') { inlinePlayingId = null; updateRolePlayButtons(); }
});
regions.on('region-clicked', (region, e) => {
  e.stopPropagation();
  ws.setTime(region.start);
  void ws.play();
});
playBtn.addEventListener('click', () => { playBtn.blur(); void ws.playPause(); });

// ---- 工具 ----
function formatTime(s: number): string {
  if (!isFinite(s)) return '0:00';
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60).toString().padStart(2, '0');
  return `${m}:${sec}`;
}
function formatTimeMs(s: number): string {
  if (!isFinite(s)) return '0:00.00';
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  const cs = Math.floor((s - Math.floor(s)) * 100);
  return `${m}:${sec.toString().padStart(2, '0')}.${cs.toString().padStart(2, '0')}`;
}
function uid(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}
function isEnter(ev: KeyboardEvent): boolean {
  return ev.code === 'Enter' || ev.code === 'NumpadEnter';
}
function toggleName(arr: string[], name: string): void {
  const k = arr.indexOf(name);
  if (k >= 0) arr.splice(k, 1);
  else arr.push(name);
}
function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (m) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[m]!,
  );
}
function currentFileName(): string | null {
  return currentIndex >= 0 && currentIndex < entries.length ? entries[currentIndex].name : null;
}
function focusedFileName(): string | null {
  if (view === 'grid') {
    return gridIndex >= 0 && gridIndex < entries.length ? entries[gridIndex].name : null;
  }
  return currentFileName();
}
function commentsForFile(name: string | null): Comment[] {
  return name
    ? comments.filter((c) => c.file === name).sort((a, b) => (a.time ?? -Infinity) - (b.time ?? -Infinity))
    : [];
}
function countComments(file: string): number {
  return comments.filter((c) => c.file === file).length;
}
function charColor(names: string[]): string {
  return (names.length ? colorByName(names[0], characters) : null) ?? '#3b82f6';
}

// 任何留言/回覆/角色變更後的統一刷新
function afterChange(): void {
  persist();
  renderMarkers();
  renderFileList();
  renderComments();
  if (view === 'role') renderRoleView();
}
// 僅重繪當前可見的留言視圖（用於開關編輯狀態，並把焦點還給回覆輸入框）
function rerenderActive(): void {
  renderComments();
  if (view === 'role') renderRoleView();
  if (replyingId) {
    const container = view === 'role' ? roleviewEl : commentListEl;
    (container.querySelector('.creply-input input') as HTMLInputElement | null)?.focus();
  }
}

// ---- 持久化（localStorage 鏡像 + NAS 資料夾 json）----
function persist(): void {
  saveComments(comments);
  if (!projectDir) return;
  window.clearTimeout(saveTimer);
  saveTimer = window.setTimeout(() => void writeProject(), 300);
}
async function writeProject(): Promise<void> {
  if (!projectDir) return;
  try {
    const fh = await projectDir.getFileHandle(PROJECT_FILE, { create: true });
    const w = await fh.createWritable();
    await w.write(JSON.stringify({ version: 1, updated: new Date().toISOString(), comments }, null, 2));
    await w.close();
  } catch {
    // 權限不足/唯讀 → 略過
  }
}
async function loadProjectFromDir(): Promise<void> {
  if (!projectDir) return;
  try {
    const fh = await projectDir.getFileHandle(PROJECT_FILE);
    const file = await fh.getFile();
    const data = JSON.parse(await file.text());
    if (Array.isArray(data?.comments)) {
      comments = (data.comments as unknown[]).map(normalizeComment);
      saveComments(comments);
    }
  } catch {
    // 沒檔案 → 沿用現有資料
  }
}

// ---- 選資料夾 ----
pickBtn.addEventListener('click', async () => {
  pickBtn.blur();
  const picker = (window as unknown as {
    showDirectoryPicker?: (opts?: { mode?: string }) => Promise<FileSystemDirectoryHandle>;
  }).showDirectoryPicker;
  if (!picker) {
    alert('此瀏覽器不支援資料夾選取，請改用 Chrome / Edge。');
    return;
  }
  try {
    projectDir = await picker({ mode: 'readwrite' });
  } catch {
    return;
  }

  entries = [];
  // @ts-expect-error - entries() 為 File System Access API，TS DOM lib 尚未涵蓋
  for await (const [name, handle] of projectDir.entries()) {
    if (handle.kind !== 'file') continue;
    const ext = name.split('.').pop()?.toLowerCase() ?? '';
    if (AUDIO_EXT.has(ext)) entries.push({ name, handle });
  }
  entries.sort((a, b) => a.name.localeCompare(b.name, 'zh-Hant', { numeric: true }));

  await loadProjectFromDir();
  renderFileList();
  if (entries.length > 0) {
    gridIndex = 0;
    void selectIndex(0);
  } else {
    nowPlayingEl.textContent = '此資料夾沒有音檔';
  }
});

// ---- 檔案列 ----
function renderFileList(): void {
  fileListEl.innerHTML = '';
  entries.forEach((e, i) => {
    const li = document.createElement('li');
    if (i === currentIndex) li.className = 'active';
    const name = document.createElement('span');
    name.textContent = e.name;
    name.style.overflow = 'hidden';
    name.style.textOverflow = 'ellipsis';
    li.appendChild(name);
    const n = countComments(e.name);
    if (n > 0) {
      const b = document.createElement('span');
      b.className = 'badge';
      b.textContent = String(n);
      li.appendChild(b);
    }
    li.addEventListener('click', () => void selectIndex(i));
    fileListEl.appendChild(li);
  });
}

async function selectIndex(i: number): Promise<void> {
  if (i < 0 || i >= entries.length) return;
  currentIndex = i;
  gridIndex = i;
  renderFileList();

  const entry = entries[i];
  nowPlayingEl.textContent = entry.name;
  statusEl.textContent = '載入中…';

  const file = await entry.handle.getFile();
  if (currentUrl) URL.revokeObjectURL(currentUrl);
  currentUrl = URL.createObjectURL(file);

  await ws.load(currentUrl);
  renderMarkers();
  renderComments();
  void ws.play();
}

// ---- 波型標記 ----
function renderMarkers(): void {
  regions.clearRegions();
  const timed = commentsForFile(currentFileName()).filter((c) => c.time !== null);
  timed.forEach((c, idx) => {
    regions.addRegion({
      start: c.time as number,
      content: String(idx + 1),
      color: charColor(c.character),
      drag: false,
      resize: false,
    });
  });
}

// ---- 共用：建一張留言卡 ----
function buildCommentCard(
  c: Comment,
  opts: { role?: boolean; ridx?: number; focused?: boolean } = {},
): HTMLDivElement {
  const card = document.createElement('div');
  card.className = 'citem' + (opts.role ? ' role' : '') + (opts.focused ? ' rolefocus' : '');
  if (opts.role && opts.ridx !== undefined) card.dataset.ridx = String(opts.ridx);

  const row = document.createElement('div');
  row.className = 'crow';

  if (opts.role) {
    const play = document.createElement('button');
    play.className = 'cplay';
    play.dataset.cid = c.id;
    play.textContent = inlinePlayingId === c.id && ws.isPlaying() ? '⏸' : '▶';
    play.addEventListener('click', (e) => { e.stopPropagation(); toggleInline(c); });
    row.appendChild(play);
  }

  const time = document.createElement('span');
  if (c.time === null) {
    time.className = 'ctime general';
    time.textContent = '整體';
  } else {
    time.className = 'ctime';
    time.textContent = formatTime(c.time);
    time.addEventListener('click', (e) => { e.stopPropagation(); void openSingleFromComment(c); });
  }
  row.appendChild(time);

  if (opts.role) {
    const f = document.createElement('span');
    f.className = 'cfile';
    f.textContent = c.file;
    row.appendChild(f);
  }

  const auth = document.createElement('span');
  auth.className = 'cauthor';
  auth.textContent = c.author;
  row.appendChild(auth);

  const del = document.createElement('button');
  del.className = 'cdel';
  del.textContent = '×';
  del.title = '刪除';
  del.addEventListener('click', (e) => {
    e.stopPropagation();
    comments = comments.filter((x) => x.id !== c.id);
    afterChange();
  });
  row.appendChild(del);
  card.appendChild(row);

  const text = document.createElement('div');
  text.className = 'ctext';
  text.textContent = c.text;
  text.addEventListener('dblclick', (e) => {
    e.stopPropagation();
    text.contentEditable = 'true';
    text.focus();
  });
  text.addEventListener('keydown', (e) => {
    if (e.isComposing) return;
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); text.blur(); }
  });
  text.addEventListener('blur', () => {
    text.contentEditable = 'false';
    const v = (text.innerText ?? '').trim();
    if (v) { c.text = v; afterChange(); }
    else { text.textContent = c.text; }
  });
  card.appendChild(text);

  const tagRow = document.createElement('div');
  tagRow.className = 'ctag-row';
  buildTagRow(c, tagRow);
  card.appendChild(tagRow);

  // 回覆（討論串）
  if (c.replies.length) {
    const rep = document.createElement('div');
    rep.className = 'creplies';
    c.replies.forEach((r) => {
      const rr = document.createElement('div');
      rr.className = 'creply';
      const ra = document.createElement('span');
      ra.className = 'crauthor';
      ra.textContent = r.author + '：';
      const rt = document.createElement('span');
      rt.textContent = r.text;
      const rd = document.createElement('button');
      rd.className = 'crdel';
      rd.textContent = '×';
      rd.addEventListener('click', (e) => {
        e.stopPropagation();
        c.replies = c.replies.filter((x) => x.id !== r.id);
        afterChange();
      });
      rr.append(ra, rt, rd);
      rep.appendChild(rr);
    });
    card.appendChild(rep);
  }

  const ri = document.createElement('div');
  ri.className = 'creply-input';
  if (replyingId === c.id) {
    const inp = document.createElement('input');
    inp.type = 'text';
    inp.placeholder = '回覆…（Enter 送出 / Esc 取消）';
    inp.addEventListener('keydown', (e) => {
      e.stopPropagation();
      if (e.isComposing) return;
      if (e.key === 'Enter') { e.preventDefault(); submitReply(c, inp.value); }
      else if (e.key === 'Escape') { e.preventDefault(); replyingId = null; rerenderActive(); }
    });
    const sb = document.createElement('button');
    sb.textContent = '送出';
    sb.addEventListener('click', (e) => { e.stopPropagation(); submitReply(c, inp.value); });
    ri.append(inp, sb);
  } else {
    const tg = document.createElement('button');
    tg.className = 'creply-toggle';
    tg.textContent = '＋ 回覆';
    tg.addEventListener('click', (e) => {
      e.stopPropagation();
      if (!author) { openNameModal(() => { replyingId = c.id; rerenderActive(); }); return; }
      replyingId = c.id;
      rerenderActive();
    });
    ri.appendChild(tg);
  }
  card.appendChild(ri);

  // 角色視圖：點卡片其他位置 → 進單檔
  if (opts.role) {
    card.addEventListener('click', (e) => {
      const t = e.target as HTMLElement;
      if (t.closest('button, input, textarea, .ctag, .charchip')) return;
      if (t.classList.contains('ctime')) return;
      if (t.isContentEditable) return;
      void openSingleFromComment(c);
    });
  }

  return card;
}

function buildTagRow(c: Comment, tagRow: HTMLElement): void {
  if (editingCharId === c.id) {
    const picker = document.createElement('div');
    picker.className = 'char-picker';
    renderCharChips(picker, c.character, (name) => {
      toggleName(c.character, name);
      afterChange();
    });
    const done = document.createElement('button');
    done.type = 'button';
    done.className = 'charchip done';
    done.textContent = '完成';
    done.addEventListener('click', (e) => { e.stopPropagation(); editingCharId = null; rerenderActive(); });
    picker.appendChild(done);
    tagRow.appendChild(picker);
  } else if (c.character.length > 0) {
    c.character.forEach((nm) => {
      const tag = document.createElement('span');
      tag.className = 'ctag';
      tag.style.background = colorByName(nm, characters) ?? '#3b82f6';
      tag.textContent = nm;
      tag.addEventListener('click', (e) => { e.stopPropagation(); editingCharId = c.id; rerenderActive(); });
      tagRow.appendChild(tag);
    });
  } else {
    const tag = document.createElement('span');
    tag.className = 'ctag empty';
    tag.textContent = '＋ 角色';
    tag.addEventListener('click', (e) => { e.stopPropagation(); editingCharId = c.id; rerenderActive(); });
    tagRow.appendChild(tag);
  }
}

// ---- 留言列（右側，焦點檔）----
function renderComments(): void {
  const fname = focusedFileName();
  commentsHeadEl.textContent = fname ? `留言 · ${fname}` : '留言';
  commentListEl.innerHTML = '';
  const list = commentsForFile(fname);
  if (list.length === 0) {
    const empty = document.createElement('li');
    empty.style.color = 'var(--muted)';
    empty.style.fontSize = '13px';
    empty.textContent = fname ? '尚無留言。播放時按 C 新增。' : '尚未選擇檔案。';
    commentListEl.appendChild(empty);
    return;
  }
  list.forEach((c) => commentListEl.appendChild(buildCommentCard(c)));
}

// ---- 角色視圖 ----
function commentsForCharacter(name: string): Comment[] {
  return comments
    .filter((c) => c.character.includes(name))
    .sort((a, b) => a.file.localeCompare(b.file, 'zh-Hant', { numeric: true }) || (a.time ?? -Infinity) - (b.time ?? -Infinity));
}

function renderRoleView(): void {
  roleviewEl.innerHTML = '';
  roleCards = [];

  const head = document.createElement('div');
  head.className = 'role-head';
  const h2 = document.createElement('h2');
  h2.textContent = '角色視圖';
  const back = document.createElement('button');
  back.className = 'ghost';
  back.textContent = '返回單檔';
  back.addEventListener('click', () => setView('single'));
  const hint = document.createElement('span');
  hint.className = 'role-hint';
  hint.textContent = '↑↓ 移動 · 空白鍵 就地播放 · Enter 進單檔 · Tab/Esc 返回';
  head.append(h2, back, hint);
  roleviewEl.appendChild(head);

  // 統計列（含 0 則的角色，方便掌握全局）
  const stats = document.createElement('div');
  stats.className = 'role-stats';
  characters.forEach((ch) => {
    const n = comments.filter((c) => c.character.includes(ch.name)).length;
    const s = document.createElement('span');
    s.className = 'role-stat' + (n === 0 ? ' zero' : '');
    s.style.background = ROLE_COLORS[ch.role];
    s.textContent = `${ch.name} ${n}`;
    stats.appendChild(s);
  });
  const noneCount = comments.filter((c) => c.character.length === 0).length;
  if (noneCount > 0) {
    const s = document.createElement('span');
    s.className = 'role-stat';
    s.style.background = '#64748b';
    s.textContent = `未指定 ${noneCount}`;
    stats.appendChild(s);
  }
  roleviewEl.appendChild(stats);

  // 各角色分組
  const renderGroup = (label: string, color: string, list: Comment[]): void => {
    if (list.length === 0) return;
    const group = document.createElement('div');
    group.className = 'role-group';
    const gh = document.createElement('div');
    gh.className = 'role-group-head';
    const chip = document.createElement('span');
    chip.className = 'role-group-chip';
    chip.style.background = color;
    chip.textContent = `${label}（${list.length}）`;
    gh.appendChild(chip);
    group.appendChild(gh);
    const cards = document.createElement('div');
    cards.className = 'role-cards';
    list.forEach((c) => {
      const ridx = roleCards.length;
      cards.appendChild(buildCommentCard(c, { role: true, ridx, focused: ridx === roleFocusIndex }));
      roleCards.push(c);
    });
    group.appendChild(cards);
    roleviewEl.appendChild(group);
  };

  characters.forEach((ch) => renderGroup(ch.name, ROLE_COLORS[ch.role], commentsForCharacter(ch.name)));
  renderGroup('未指定角色', '#64748b', comments.filter((c) => c.character.length === 0)
    .sort((a, b) => a.file.localeCompare(b.file, 'zh-Hant', { numeric: true })));

  if (roleCards.length === 0) {
    const empty = document.createElement('div');
    empty.style.color = 'var(--muted)';
    empty.textContent = '尚無留言。';
    roleviewEl.appendChild(empty);
  }
  if (roleFocusIndex >= roleCards.length) roleFocusIndex = Math.max(0, roleCards.length - 1);
}

function updateRolePlayButtons(): void {
  roleviewEl.querySelectorAll<HTMLElement>('.cplay').forEach((btn) => {
    btn.textContent = inlinePlayingId === btn.dataset.cid && ws.isPlaying() ? '⏸' : '▶';
  });
}
function updateRoleFocusHighlight(): void {
  roleviewEl.querySelectorAll<HTMLElement>('.citem').forEach((el) => {
    const on = el.dataset.ridx === String(roleFocusIndex);
    el.classList.toggle('rolefocus', on);
    if (on) el.scrollIntoView({ block: 'nearest' });
  });
}
function moveRoleFocus(d: number): void {
  if (roleCards.length === 0) return;
  roleFocusIndex = Math.min(Math.max(0, roleFocusIndex + d), roleCards.length - 1);
  updateRoleFocusHighlight();
}

// 就地播放：載入該檔音訊並跳至秒數，但留在角色視圖
async function playInline(c: Comment): Promise<void> {
  const idx = entries.findIndex((e) => e.name === c.file);
  if (idx < 0) return;
  if (idx !== currentIndex) await selectIndex(idx);
  ws.setTime(c.time ?? 0);
  void ws.play();
  inlinePlayingId = c.id;
  updateRolePlayButtons();
}
function toggleInline(c: Comment): void {
  if (inlinePlayingId === c.id && ws.isPlaying()) { ws.pause(); updateRolePlayButtons(); return; }
  void playInline(c);
}
// 進單檔模式並跳至該留言
async function openSingleFromComment(c: Comment): Promise<void> {
  const idx = entries.findIndex((e) => e.name === c.file);
  if (idx < 0) return;
  if (view !== 'single') setView('single');
  if (idx !== currentIndex) await selectIndex(idx);
  if (c.time !== null) ws.setTime(c.time);
  void ws.play();
}

// 角色 chips（複選）
function renderCharChips(
  container: HTMLElement,
  selected: string[],
  onToggle: (name: string) => void,
  focusedIndex?: number,
): void {
  container.innerHTML = '';
  characters.forEach((ch, i) => {
    const chip = document.createElement('button');
    chip.type = 'button';
    chip.className = 'charchip' + (i === focusedIndex ? ' focused' : '');
    chip.textContent = ch.name;
    chip.style.borderColor = ROLE_COLORS[ch.role];
    if (selected.includes(ch.name)) {
      chip.style.background = ROLE_COLORS[ch.role];
      chip.style.color = '#fff';
    }
    chip.addEventListener('click', (e) => { e.stopPropagation(); onToggle(ch.name); });
    container.appendChild(chip);
  });
}

// ---- 回覆 ----
function submitReply(c: Comment, raw: string): void {
  const text = raw.trim();
  if (!text) { replyingId = null; rerenderActive(); return; }
  const doIt = (): void => {
    c.replies.push({ id: uid(), author, text, created: Date.now() });
    replyingId = null;
    afterChange();
  };
  if (!author) openNameModal(doIt);
  else doIt();
}

// ---- 寫留言 ----
function startComment(): void {
  if (currentIndex < 0) return;
  if (!author) { openNameModal(() => openComposer()); return; }
  openComposer();
}
function openComposer(): void {
  ws.pause();
  pendingTime = ws.getCurrentTime();
  composerAttachTime = true;
  composerText.value = '';
  composerChars = [];
  composerFocus = 'text';
  drawComposer();
  composerEl.classList.remove('hidden');
  composerText.focus();
}
function closeComposer(): void {
  composerEl.classList.add('hidden');
  composerFocus = 'text';
}
function drawComposer(): void {
  drawToggle();
  drawComposerChars();
}
function drawToggle(): void {
  if (composerAttachTime) {
    composerToggle.textContent = `對應秒數 ${formatTime(pendingTime)}`;
    composerToggle.classList.remove('off');
  } else {
    composerToggle.textContent = '整體留言（不對應秒數）';
    composerToggle.classList.add('off');
  }
  composerToggle.classList.toggle('focused', composerFocus === 'toggle');
}
function drawComposerChars(): void {
  const focusIdx = typeof composerFocus === 'number' ? composerFocus : undefined;
  renderCharChips(composerCharsEl, composerChars, (name) => {
    toggleName(composerChars, name);
    drawComposerChars();
  }, focusIdx);
}
function saveComposer(): void {
  const text = composerText.value.trim();
  closeComposer();
  if (!text) return;
  const f = currentFileName();
  if (!f) return;
  comments.push({
    id: uid(),
    file: f,
    time: composerAttachTime ? pendingTime : null,
    text,
    author,
    character: [...composerChars],
    replies: [],
  });
  afterChange();
}

function goToggle(): void { composerFocus = 'toggle'; composerText.blur(); drawComposer(); }
function backToText(): void { composerFocus = 'text'; drawComposer(); composerText.focus(); }
function enterChips(): void {
  if (characters.length === 0) return;
  const sel = composerChars.length ? characters.findIndex((c) => c.name === composerChars[0]) : -1;
  composerFocus = sel >= 0 ? sel : 0;
  composerText.blur();
  drawComposer();
}
function toggleChip(idx: number): void {
  toggleName(composerChars, characters[idx].name);
  drawComposer();
}
function navChip(cur: number, dir: 'up' | 'down' | 'left' | 'right'): number | 'toggle' {
  const els = Array.from(composerCharsEl.children) as HTMLElement[];
  if (els.length === 0) return cur;
  const r = els.map((el) => el.getBoundingClientRect());
  const c = r[cur];
  const cx = c.left + c.width / 2;
  const cy = c.top + c.height / 2;
  const rowTol = c.height / 2;
  if (dir === 'left' || dir === 'right') {
    let best = -1, bestDist = Infinity;
    r.forEach((rect, i) => {
      if (i === cur) return;
      if (Math.abs(rect.top + rect.height / 2 - cy) > rowTol) return;
      const rx = rect.left + rect.width / 2;
      if (dir === 'left' && rx < cx && cx - rx < bestDist) { bestDist = cx - rx; best = i; }
      if (dir === 'right' && rx > cx && rx - cx < bestDist) { bestDist = rx - cx; best = i; }
    });
    return best >= 0 ? best : cur;
  }
  let best = -1, bestScore = Infinity;
  r.forEach((rect, i) => {
    if (i === cur) return;
    const ry = rect.top + rect.height / 2;
    const ok = dir === 'up' ? ry < cy - rowTol : ry > cy + rowTol;
    if (!ok) return;
    const score = Math.abs(ry - cy) * 1000 + Math.abs(rect.left + rect.width / 2 - cx);
    if (score < bestScore) { bestScore = score; best = i; }
  });
  if (dir === 'up' && best < 0) return 'toggle';
  return best >= 0 ? best : cur;
}
function handleComposerKey(ev: KeyboardEvent): void {
  if (ev.isComposing) return;
  if (ev.code === 'Escape') { ev.preventDefault(); closeComposer(); return; }
  if (composerFocus === 'text') {
    if (isEnter(ev) && !ev.shiftKey) { ev.preventDefault(); saveComposer(); return; }
    if (ev.code === 'ArrowDown' || ev.code === 'Tab') { ev.preventDefault(); goToggle(); return; }
    return;
  }
  if (isEnter(ev)) { ev.preventDefault(); saveComposer(); return; }
  if (composerFocus === 'toggle') {
    switch (ev.code) {
      case 'Space': ev.preventDefault(); composerAttachTime = !composerAttachTime; drawComposer(); break;
      case 'ArrowUp': ev.preventDefault(); backToText(); break;
      case 'ArrowDown': case 'Tab': ev.preventDefault(); enterChips(); break;
    }
    return;
  }
  const idx = composerFocus;
  switch (ev.code) {
    case 'Space': ev.preventDefault(); toggleChip(idx); break;
    case 'ArrowRight': { ev.preventDefault(); const t = navChip(idx, 'right'); if (typeof t === 'number') { composerFocus = t; drawComposer(); } break; }
    case 'ArrowLeft': { ev.preventDefault(); const t = navChip(idx, 'left'); if (typeof t === 'number') { composerFocus = t; drawComposer(); } break; }
    case 'ArrowDown': { ev.preventDefault(); const t = navChip(idx, 'down'); if (typeof t === 'number') { composerFocus = t; drawComposer(); } break; }
    case 'ArrowUp': { ev.preventDefault(); const t = navChip(idx, 'up'); if (t === 'toggle') goToggle(); else { composerFocus = t; drawComposer(); } break; }
    case 'Tab': ev.preventDefault(); backToText(); break;
  }
}
composerToggle.addEventListener('click', () => { composerAttachTime = !composerAttachTime; drawComposer(); });

// ---- 名字 ----
function openNameModal(cb: (() => void) | null): void {
  nameCallback = cb;
  nameInput.value = author;
  nameModalEl.classList.remove('hidden');
  nameInput.focus();
}
function confirmName(): void {
  const v = nameInput.value.trim();
  if (!v) return;
  author = v;
  saveAuthor(v);
  nameModalEl.classList.add('hidden');
  const cb = nameCallback;
  nameCallback = null;
  if (cb) cb();
}
nameInput.addEventListener('keydown', (e) => {
  e.stopPropagation();
  if (e.isComposing) return;
  if (e.key === 'Enter') { e.preventDefault(); confirmName(); }
  else if (e.key === 'Escape') { e.preventDefault(); nameModalEl.classList.add('hidden'); nameCallback = null; }
});

// ---- 編輯角色名單 ----
editCharsBtn.addEventListener('click', () => {
  editCharsBtn.blur();
  renderCharEditList();
  charModalEl.classList.remove('hidden');
});
function renderCharEditList(): void {
  charEditListEl.innerHTML = '';
  characters.forEach((ch, i) => {
    const li = document.createElement('li');
    const dot = document.createElement('span');
    dot.className = 'dot';
    dot.style.background = ROLE_COLORS[ch.role];
    const name = document.createElement('span');
    name.textContent = ch.name;
    const role = document.createElement('span');
    role.className = 'role';
    role.textContent = ROLE_LABELS[ch.role];
    const rm = document.createElement('button');
    rm.className = 'rm';
    rm.textContent = '刪除';
    rm.addEventListener('click', () => {
      characters.splice(i, 1);
      saveCharacters(characters);
      renderCharEditList();
    });
    li.append(dot, name, role, rm);
    charEditListEl.appendChild(li);
  });
}
addCharBtn.addEventListener('click', () => {
  const name = newCharName.value.trim();
  if (!name) return;
  characters.push({ name, role: newCharRole.value as Character['role'] });
  saveCharacters(characters);
  newCharName.value = '';
  renderCharEditList();
});
newCharName.addEventListener('keydown', (e) => {
  e.stopPropagation();
  if (e.isComposing) return;
  if (e.key === 'Enter') { e.preventDefault(); addCharBtn.click(); }
});
closeCharBtn.addEventListener('click', () => {
  charModalEl.classList.add('hidden');
  renderMarkers();
  renderComments();
  if (view === 'role') renderRoleView();
});

// ---- 播放控制 ----
function seekBy(delta: number): void {
  const dur = ws.getDuration();
  if (!isFinite(dur) || dur === 0) return;
  ws.setTime(Math.min(Math.max(0, ws.getCurrentTime() + delta), dur));
}
function jumpMarker(dir: number): void {
  const times = commentsForFile(currentFileName())
    .filter((c) => c.time !== null)
    .map((c) => c.time as number);
  if (times.length === 0) return;
  const t = ws.getCurrentTime();
  let target: number | undefined;
  if (dir < 0) {
    for (let k = times.length - 1; k >= 0; k--) {
      if (times[k] < t - PREV_SKIP) { target = times[k]; break; }
    }
    target ??= times[0];
  } else {
    for (let k = 0; k < times.length; k++) {
      if (times[k] > t + NEXT_SKIP) { target = times[k]; break; }
    }
    target ??= times[times.length - 1];
  }
  ws.setTime(target);
}

// ---- 視圖切換 ----
function setView(v: ViewMode): void {
  view = v;
  const single = v === 'single', grid = v === 'grid', role = v === 'role';
  if (grid || role) ws.pause();
  sidebarEl.classList.toggle('hidden', !single);
  playerEl.classList.toggle('hidden', !single);
  gridEl.classList.toggle('hidden', !grid);
  roleviewEl.classList.toggle('hidden', !role);
  commentsAsideEl.classList.toggle('hidden', role); // 角色視圖自己就是留言介面，隱藏右欄
  if (grid) renderGrid();
  if (role) { roleFocusIndex = 0; renderRoleView(); }
  renderComments();
}
function renderGrid(): void {
  gridEl.innerHTML = '';
  const hint = document.createElement('div');
  hint.className = 'gridhint';
  hint.textContent = 'WASD／方向鍵 移動 · 空白鍵或 Enter 開啟 · Tab 返回單檔';
  gridEl.appendChild(hint);
  entries.forEach((e, i) => {
    const card = document.createElement('div');
    card.className = 'gridcard' + (i === gridIndex ? ' selected' : '');
    card.innerHTML =
      `<div class="gc-name">${escapeHtml(e.name)}</div>` +
      `<div class="gc-meta">${countComments(e.name)} 則留言</div>`;
    card.addEventListener('click', () => {
      gridIndex = i;
      setView('single');
      void selectIndex(i);
    });
    gridEl.appendChild(card);
  });
}
function moveGrid(delta: number): void {
  const n = entries.length;
  if (n === 0) return;
  gridIndex = Math.min(Math.max(0, gridIndex + delta), n - 1);
  renderGrid();
  renderComments();
}

// ---- 全域鍵盤 ----
function isTyping(): boolean {
  const el = document.activeElement as HTMLElement | null;
  if (!el) return false;
  return el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable;
}
function anyModalOpen(): boolean {
  return !nameModalEl.classList.contains('hidden') || !charModalEl.classList.contains('hidden');
}

document.addEventListener('keydown', (ev) => {
  if (!composerEl.classList.contains('hidden')) { handleComposerKey(ev); return; }
  if (ev.isComposing) return;
  if (editingCharId !== null && ev.code === 'Escape') {
    ev.preventDefault();
    editingCharId = null;
    rerenderActive();
    return;
  }
  if (replyingId !== null && ev.code === 'Escape') {
    ev.preventDefault();
    replyingId = null;
    rerenderActive();
    return;
  }
  if (anyModalOpen() || isTyping()) return;

  if (view === 'role') {
    if (ev.code === 'Tab' || ev.code === 'Escape') { ev.preventDefault(); setView('single'); return; }
    switch (ev.code) {
      case 'ArrowUp': case 'KeyW': ev.preventDefault(); moveRoleFocus(-1); break;
      case 'ArrowDown': case 'KeyS': ev.preventDefault(); moveRoleFocus(1); break;
      case 'Space': ev.preventDefault(); if (roleCards[roleFocusIndex]) toggleInline(roleCards[roleFocusIndex]); break;
      case 'Enter': case 'NumpadEnter': ev.preventDefault(); if (roleCards[roleFocusIndex]) void openSingleFromComment(roleCards[roleFocusIndex]); break;
    }
    return;
  }

  if (view === 'grid') {
    if (isEnter(ev)) { ev.preventDefault(); setView('single'); void selectIndex(gridIndex); return; }
    switch (ev.code) {
      case 'KeyA': case 'ArrowLeft': ev.preventDefault(); moveGrid(-1); break;
      case 'KeyD': case 'ArrowRight': ev.preventDefault(); moveGrid(1); break;
      case 'KeyW': case 'ArrowUp': ev.preventDefault(); moveGrid(-GRID_COLS); break;
      case 'KeyS': case 'ArrowDown': ev.preventDefault(); moveGrid(GRID_COLS); break;
      case 'Space': ev.preventDefault(); setView('single'); void selectIndex(gridIndex); break;
      case 'Tab': ev.preventDefault(); setView('single'); break;
    }
    return;
  }

  // 單檔模式
  switch (ev.code) {
    case 'Space': ev.preventDefault(); void ws.playPause(); break;
    case 'KeyA': case 'ArrowLeft': ev.preventDefault(); seekBy(-5); break;
    case 'KeyD': case 'ArrowRight': ev.preventDefault(); seekBy(5); break;
    case 'KeyW': case 'ArrowUp': ev.preventDefault(); jumpMarker(-1); break;
    case 'KeyS': case 'ArrowDown': ev.preventDefault(); jumpMarker(1); break;
    case 'KeyC': case 'KeyX': ev.preventDefault(); startComment(); break;
    case 'Tab': ev.preventDefault(); if (entries.length) setView('grid'); break;
  }
});

// ---- 角色視圖按鈕 ----
roleViewBtn.addEventListener('click', () => { roleViewBtn.blur(); setView('role'); });

// ---- 啟動 ----
appVerEl.textContent = 'v' + __APP_VERSION__;
if (!author) openNameModal(null);
