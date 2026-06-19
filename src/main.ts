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

// 評分
let composerRating = 0;

// 角色視圖
let roleCards: Comment[] = []; // 角色視圖中卡片的扁平順序（鍵盤巡覽用）
let roleFocusIndex = 0;
let inlinePlayingId: string | null = null; // 角色視圖中就地播放的留言 id

// ---- DOM ----
const $ = <T extends HTMLElement>(id: string): T => document.getElementById(id) as T;
const pickBtn = $<HTMLButtonElement>('pick');
const exportBtn = $<HTMLButtonElement>('exportBtn');
const importBtn = $<HTMLButtonElement>('importBtn');
const importFile = $<HTMLInputElement>('importFile');
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
// 合併：以 id 去重，傳入的留言覆蓋同 id；保留本地獨有（避免轉換時遺失）
function mergeComments(incoming: Comment[]): void {
  const byId = new Map(comments.map((c) => [c.id, c]));
  incoming.forEach((c) => byId.set(c.id, c));
  comments = [...byId.values()];
}
async function loadProjectFromDir(): Promise<void> {
  if (!projectDir) return;
  try {
    const fh = await projectDir.getFileHandle(PROJECT_FILE);
    const file = await fh.getFile();
    const data = JSON.parse(await file.text());
    if (Array.isArray(data?.comments)) {
      mergeComments((data.comments as unknown[]).map(normalizeComment)); // 合併，不覆蓋本地既有
      saveComments(comments);
    }
  } catch {
    // 沒檔案 → 沿用現有資料（首次存檔時建立）
  }
}

// ---- 匯出 / 匯入 備份 ----
function exportBackup(): void {
  const payload = JSON.stringify(
    { version: 1, exported: new Date().toISOString(), comments, characters },
    null,
    2,
  );
  const blob = new Blob([payload], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const d = new Date();
  const p = (n: number): string => String(n).padStart(2, '0');
  const stamp = `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}-${p(d.getHours())}${p(d.getMinutes())}`;
  const a = document.createElement('a');
  a.href = url;
  a.download = `voicepicker-backup-${stamp}.json`;
  a.click();
  URL.revokeObjectURL(url);
}
async function importBackup(file: File): Promise<void> {
  try {
    const data = JSON.parse(await file.text());
    if (Array.isArray(data?.comments)) {
      mergeComments((data.comments as unknown[]).map(normalizeComment));
    }
    if (Array.isArray(data?.characters) && data.characters.length > 0) {
      characters = data.characters as Character[];
      saveCharacters(characters);
    }
    afterChange();
    alert(`匯入完成：目前共 ${comments.length} 則留言。`);
  } catch {
    alert('匯入失敗：檔案不是有效的 VoicePicker 備份。');
  }
}
exportBtn.addEventListener('click', () => { exportBtn.blur(); exportBackup(); });
importBtn.addEventListener('click', () => { importBtn.blur(); importFile.click(); });
importFile.addEventListener('change', () => {
  const f = importFile.files?.[0];
  if (f) void importBackup(f);
  importFile.value = '';
});

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
    // 移除原有 play 按鈕（已移至 row 最右邊）
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

  // 播放鍵放在 row 最右邊（角色視圖）
  if (opts.role) {
    const play = document.createElement('button');
    play.className = 'cplay';
    play.dataset.cid = c.id;
    play.textContent = inlinePlayingId === c.id && ws.isPlaying() ? '⏸' : '▶';
    play.addEventListener('click', (e) => { e.stopPropagation(); toggleInline(c); });
    row.appendChild(play);
  }

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

  // 評分星星
  if (c.rating > 0) {
    const ratingRow = document.createElement('div');
    ratingRow.style.cssText = 'margin-top: 6px; display: flex; align-items: center; gap: 2px;';
    for (let i = 1; i <= 5; i++) {
      const star = document.createElement('span');
      star.className = 'cstar' + (i <= c.rating ? ' on' : ' off');
      star.textContent = '★';
      star.style.fontSize = '14px';
      star.addEventListener('click', (e) => { e.stopPropagation(); c.rating = i; afterChange(); });
      ratingRow.appendChild(star);
    }
    card.appendChild(ratingRow);
  }

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
  h2.textContent = '角色 Dashboard';
  const back = document.createElement('button');
  back.className = 'ghost';
  back.textContent = '返回單檔';
  back.addEventListener('click', () => setView('single'));
  const hint = document.createElement('span');
  hint.className = 'role-hint';
  hint.textContent = '↑↓ 移動 · 空白鍵 就地播放 · Enter 進單檔 · Tab/Esc 返回';
  head.append(h2, back, hint);
  roleviewEl.appendChild(head);

  // 角色分類標籤列（主角 / 吉祥物 / 配角）
  const roleOrder: Array<{ label: string; role: CharacterRole }> = [
    { label: '主角', role: 'lead' },
    { label: '吉祥物', role: 'mascot' },
    { label: '配角', role: 'supporting' },
  ];
  const tabs = document.createElement('div');
  tabs.className = 'role-category-tabs';
  roleOrder.forEach((cat) => {
    const tab = document.createElement('button');
    tab.className = 'role-cat-tab';
    tab.style.borderColor = ROLE_COLORS[cat.role];
    const count = characters.filter((c) => c.role === cat.role).length;
    tab.innerHTML = `${cat.label} <span class="count">${count}</span>`;
    tab.addEventListener('click', () => {
      const target = document.getElementById('role-group-' + cat.role);
      target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    tabs.appendChild(tab);
  });
  // 未指定
  const noneCount = comments.filter((c) => c.character.length === 0).length;
  if (noneCount > 0) {
    const tab = document.createElement('button');
    tab.className = 'role-cat-tab';
    tab.style.borderColor = '#64748b';
    tab.innerHTML = `未指定 <span class="count">${noneCount}</span>`;
    tab.addEventListener('click', () => {
      document.getElementById('role-group-none')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    tabs.appendChild(tab);
  }
  roleviewEl.appendChild(tabs);

  // 角色分組 — 每角色一個區塊
  const renderGroup = (label: string, color: string, list: Comment[], groupId: string): void => {
    if (list.length === 0 && groupId !== 'role-group-none') return;
    const group = document.createElement('div');
    group.className = 'role-group';
    group.id = groupId;

    const gh = document.createElement('div');
    gh.className = 'role-group-head';
    const chip = document.createElement('span');
    chip.className = 'role-group-chip';
    chip.style.background = color;
    chip.textContent = label;
    const count = document.createElement('span');
    count.className = 'role-group-count';
    count.textContent = `${list.length} 則留言`;
    gh.append(chip, count);
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

  // 依角色分類順序渲染
  roleOrder.forEach((cat) => {
    const chars = characters.filter((c) => c.role === cat.role);
    chars.forEach((ch) => {
      renderGroup(ch.name, ROLE_COLORS[ch.role], commentsForCharacter(ch.name), 'role-group-' + cat.role);
    });
  });
  renderGroup('未指定角色', '#64748b', comments.filter((c) => c.character.length === 0)
    .sort((a, b) => a.file.localeCompare(b.file, 'zh-Hant', { numeric: true })), 'role-group-none');

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
  composerRating = 0;
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
  drawComposerRating();
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
function drawComposerRating(): void {
  const el = $<HTMLElement>('composerRating');
  el.innerHTML = '';
  for (let i = 1; i <= 5; i++) {
    const star = document.createElement('span');
    star.className = 'cstar' + (i <= composerRating ? ' on' : ' off');
    star.textContent = '★';
    star.addEventListener('click', () => { composerRating = i; drawComposerRating(); });
    star.addEventListener('mouseenter', () => {
      el.querySelectorAll('.cstar').forEach((s, idx) => s.classList.toggle('on', idx < i));
    });
    star.addEventListener('mouseleave', () => {
      el.querySelectorAll('.cstar').forEach((s, idx) => s.classList.toggle('on', idx < composerRating));
    });
    el.appendChild(star);
  }
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
    rating: composerRating,
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
  // Shift+1~5：快速評分（在當前時間點建立或更新留言）
  if (ev.shiftKey && ['Digit1','Digit2','Digit3','Digit4','Digit5'].includes(ev.code)) {
    ev.preventDefault();
    const rating = parseInt(ev.code.slice(-1));
    const f = currentFileName();
    if (!f || currentIndex < 0) return;
    // 檢查當前位置是否已有留言
    const t = ws.getCurrentTime();
    const existing = comments.filter((c) => c.file === f && Math.abs((c.time ?? -1) - t) < 0.5);
    if (existing.length > 0) {
      existing[0].rating = rating;
    } else {
      comments.push({ id: uid(), file: f, time: t, text: '', author, character: [], replies: [], rating });
    }
    afterChange();
  }
});

// ---- 角色視圖按鈕 ----
roleViewBtn.addEventListener('click', () => { roleViewBtn.blur(); setView('role'); });

// ---- 啟動 ----
appVerEl.textContent = 'v' + __APP_VERSION__;
if (!author) openNameModal(null);

// ---- 匯出報告 PDF ----
const reportBtn = $<HTMLButtonElement>('reportBtn');
reportBtn.addEventListener('click', () => {
  reportBtn.blur();
  const d = new Date();
  const p = (n: number): string => String(n).padStart(2, '0');
  const stamp = `${d.getFullYear()}${p(d.getMonth()+1)}${p(d.getDate())}`;

  let report = `<html lang="zh-Hant"><head><meta charset="utf-8">
<style>
  body { font-family: system-ui, "Microsoft JhengHei", sans-serif; padding: 32px; color: #222; max-width: 900px; margin: auto; }
  h1 { font-size: 22px; border-bottom: 2px solid #333; padding-bottom: 8px; }
  h2 { font-size: 16px; margin-top: 28px; }
  .file { background: #f5f5f5; border: 1px solid #ddd; border-radius: 6px; padding: 12px; margin-bottom: 12px; page-break-inside: avoid; }
  .file h3 { margin: 0 0 6px; font-size: 15px; }
  .meta { font-size: 12px; color: #666; }
  .stars { color: #f59e0b; font-size: 14px; }
  .comment { margin: 6px 0; font-size: 13px; padding-left: 10px; border-left: 3px solid #ddd; }
  .comment .t { color: #2563eb; font-family: monospace; }
  table { width: 100%; border-collapse: collapse; margin: 12px 0; }
  th, td { text-align: left; padding: 6px 8px; border-bottom: 1px solid #eee; font-size: 13px; }
  th { background: #f5f5f5; }
</style></head><body>
<h1>VoicePicker 評分報告</h1>
<p style="color:#666;font-size:13px">${stamp} · ${author ? '審閱者：' + author : ''}</p>`;

  // 各檔案評分摘要表
  report += '<h2>評分摘要</h2><table><tr><th>檔案</th><th>評分</th><th>留言數</th></tr>';
  entries.forEach((e) => {
    const cs = comments.filter((c) => c.file === e.name);
    const maxRating = cs.length > 0 ? Math.max(...cs.map((c) => c.rating ?? 0)) : 0;
    const stars = maxRating > 0 ? '★'.repeat(maxRating) + '☆'.repeat(5 - maxRating) : '—';
    report += `<tr><td>${escapeHtml(e.name)}</td><td class="stars">${stars}</td><td>${cs.length}</td></tr>`;
  });
  report += '</table>';

  // 各檔案詳細留言
  report += '<h2>留言詳情</h2>';
  entries.forEach((e) => {
    const cs = comments.filter((c) => c.file === e.name);
    if (cs.length === 0) return;
    report += `<div class="file"><h3>${escapeHtml(e.name)}</h3>`;
    cs.forEach((c) => {
      const stars = c.rating > 0 ? '★'.repeat(c.rating) + '☆'.repeat(5 - c.rating) : '';
      const timeStr = c.time !== null ? ` <span class="t">${formatTime(c.time)}</span>` : '';
      const chars = c.character.length ? ' [' + c.character.join(', ') + ']' : '';
      report += `<div class="comment">${timeStr} ${stars}${chars}<br>${escapeHtml(c.text || '（無文字）')}`;
      if (c.replies.length) {
        c.replies.forEach((r) => {
          report += `<div style="font-size:12px;color:#666;margin-top:3px">↳ ${escapeHtml(r.author)}：${escapeHtml(r.text)}</div>`;
        });
      }
      report += '</div>';
    });
    report += '</div>';
  });

  report += '</body></html>';

  const win = window.open('', '_blank');
  if (win) {
    win.document.write(report);
    win.document.close();
    setTimeout(() => { win.focus(); win.print(); }, 300);
  }
});
