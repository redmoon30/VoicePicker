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
import viewerTemplate from './viewer-template.html?raw';
import externalViewerTemplate from './external-viewer-template.html?raw';

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

// ---- 協作輪詢 ----
let pollTimer: number | undefined;
let lastSyncTime: number | null = null;

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
type RoleSortMode = 'rating' | 'file' | 'user';
type RoleZeroFilter = 'all' | 'hide' | 'solo';
let roleCards: Comment[] = []; // 角色視圖中卡片的扁平順序（鍵盤巡覽用）
let roleFocusIndex = 0;
let inlinePlayingId: string | null = null; // 角色視圖中就地播放的留言 id
let roleSortMode: RoleSortMode = 'rating';
let roleCompact = false;
let roleZeroFilter: RoleZeroFilter = 'all';

// 評分
let composerRating = 0;

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
const composerRatingEl = $<HTMLDivElement>('composerRatingEl');

const nameModalEl = $<HTMLDivElement>('nameModal');
const nameInput = $<HTMLInputElement>('nameInput');

const charModalEl = $<HTMLDivElement>('charModal');
const charEditListEl = $<HTMLUListElement>('charEditList');
const newCharName = $<HTMLInputElement>('newCharName');
const newCharRole = $<HTMLSelectElement>('newCharRole');
const addCharBtn = $<HTMLButtonElement>('addCharBtn');
const closeCharBtn = $<HTMLButtonElement>('closeCharBtn');
const ratingsBtn = $<HTMLButtonElement>('ratingsBtn');
const shareBtn = $<HTMLButtonElement>('shareBtn');
const shareModalEl = $<HTMLDivElement>('shareModal');
const shareCancelBtn = $<HTMLButtonElement>('shareCancelBtn');
const shareConfirmBtn = $<HTMLButtonElement>('shareConfirmBtn');

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
  lastSyncTime = Date.now();
  startSyncPolling();
  renderSyncStatus();
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
function buildRatingRow(c: Comment, container: HTMLElement): void {
  const el = document.createElement('div');
  el.className = 'c-rating';
  for (let i = 1; i <= 5; i++) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'c-star' + (i <= c.rating ? ' filled' : '');
    btn.textContent = '★';
    btn.title = `${i} 分${c.rating === i ? '（再按清除）' : ''}`;
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      c.rating = (c.rating === i) ? 0 : i;
      afterChange();
    });
    el.appendChild(btn);
  }
  container.appendChild(el);
}

function buildCommentCard(
  c: Comment,
  opts: { role?: boolean; ridx?: number; focused?: boolean; badge?: '🏆' | '👎' } = {},
): HTMLDivElement {
  const card = document.createElement('div');
  const ratingHighlight = c.rating === 5 ? ' trophy' : c.rating === 0 ? ' bad' : '';
  card.className = 'citem' + (opts.role ? ' role' : '') + (opts.focused ? ' rolefocus' : '') + ratingHighlight;
  if (opts.role && opts.ridx !== undefined) card.dataset.ridx = String(opts.ridx);

  // 角色視圖：兩欄佈局（左：內容 / 右：播放鈕）
  let contentEl: HTMLElement = card;
  if (opts.role) {
    const inner = document.createElement('div');
    inner.className = 'card-inner';
    const main = document.createElement('div');
    main.className = 'card-main';
    const play = document.createElement('button');
    play.className = 'cplay';
    play.dataset.cid = c.id;
    play.textContent = inlinePlayingId === c.id && ws.isPlaying() ? '⏸' : '▶';
    play.addEventListener('click', (e) => { e.stopPropagation(); toggleInline(c, opts.ridx); });
    inner.append(main, play);
    card.appendChild(inner);
    contentEl = main;
  }

  const row = document.createElement('div');
  row.className = 'crow';

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
    if (opts.badge) {
      const badge = document.createElement('span');
      badge.className = 'cfile-badge';
      badge.textContent = opts.badge;
      f.appendChild(badge);
    }
    f.addEventListener('click', (e) => { e.stopPropagation(); void openSingleFromComment(c); });
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
  contentEl.appendChild(row);

  buildRatingRow(c, contentEl);

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
  contentEl.appendChild(text);

  const tagRow = document.createElement('div');
  tagRow.className = 'ctag-row';
  buildTagRow(c, tagRow);
  contentEl.appendChild(tagRow);

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
    contentEl.appendChild(rep);
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
  contentEl.appendChild(ri);

  // 角色視圖：點卡片空白處無反應；點檔名(.cfile)進單檔（由 .cfile 的 listener 處理）

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

// ---- 角色 Dashboard ----
function sortComments(list: Comment[], mode: RoleSortMode): Comment[] {
  const sorted = [...list];
  if (mode === 'rating') {
    sorted.sort((a, b) =>
      (b.rating - a.rating) ||
      a.file.localeCompare(b.file, 'zh-Hant', { numeric: true }) ||
      (a.time ?? -Infinity) - (b.time ?? -Infinity));
  } else if (mode === 'file') {
    sorted.sort((a, b) =>
      a.file.localeCompare(b.file, 'zh-Hant', { numeric: true }) ||
      (a.time ?? -Infinity) - (b.time ?? -Infinity));
  } else {
    sorted.sort((a, b) =>
      a.author.localeCompare(b.author, 'zh-Hant') ||
      a.file.localeCompare(b.file, 'zh-Hant', { numeric: true }) ||
      (a.time ?? -Infinity) - (b.time ?? -Infinity));
  }
  return sorted;
}

function commentsForCharacter(name: string): Comment[] {
  let list = comments.filter((c) => c.character.includes(name));
  if (roleZeroFilter === 'hide') list = list.filter((c) => c.rating > 0);
  else if (roleZeroFilter === 'solo') list = list.filter((c) => c.rating === 0);
  return sortComments(list, roleSortMode);
}

function renderRoleView(): void {
  roleviewEl.innerHTML = '';
  roleCards = [];
  roleviewEl.classList.toggle('role-compact', roleCompact);

  // ── 標題列 ──
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

  const sortWrap = document.createElement('div');
  sortWrap.className = 'role-sort-toggle';
  (['rating', 'file', 'user'] as RoleSortMode[]).forEach((key) => {
    const label = key === 'rating' ? '評分' : key === 'file' ? '檔案' : '使用者';
    const btn = document.createElement('button');
    btn.className = 'role-sort-btn' + (roleSortMode === key ? ' active' : '');
    btn.textContent = label;
    btn.addEventListener('click', () => { roleSortMode = key; renderRoleView(); });
    sortWrap.appendChild(btn);
  });

  const compactBtn = document.createElement('button');
  compactBtn.className = 'role-compact-btn' + (roleCompact ? ' active' : '');
  compactBtn.textContent = '簡潔';
  compactBtn.title = '隱藏回覆與角色標籤，雙欄顯示';
  compactBtn.addEventListener('click', () => {
    roleCompact = !roleCompact;
    roleviewEl.classList.toggle('role-compact', roleCompact);
    compactBtn.classList.toggle('active', roleCompact);
  });

  const ZERO_NEXT: Record<RoleZeroFilter, RoleZeroFilter> = { all: 'hide', hide: 'solo', solo: 'all' };
  const ZERO_LABELS: Record<RoleZeroFilter, string> = { all: '全部留言', hide: '隱藏 👎', solo: 'solo 👎' };
  const zeroFilterBtn = document.createElement('button');
  zeroFilterBtn.className = 'role-zero-btn' + (roleZeroFilter !== 'all' ? ' ' + roleZeroFilter : '');
  zeroFilterBtn.textContent = ZERO_LABELS[roleZeroFilter];
  zeroFilterBtn.addEventListener('click', () => {
    roleZeroFilter = ZERO_NEXT[roleZeroFilter];
    renderRoleView();
  });

  head.append(h2, back, hint, sortWrap, compactBtn, zeroFilterBtn);

  // ── sticky 容器：header + 角色快捷列 ──
  const stickyHead = document.createElement('div');
  stickyHead.className = 'role-sticky';
  stickyHead.appendChild(head);

  // ── 角色快捷列（依分類分行，可點擊跳轉）──
  const ROLE_ORDER = ['lead', 'mascot', 'supporting'] as const;
  const noneCount = comments.filter((c) => c.character.length === 0).length;
  const statsWrap = document.createElement('div');
  statsWrap.className = 'role-stats-wrap';
  let supportingRowEl: HTMLDivElement | null = null;
  ROLE_ORDER.forEach((role) => {
    const charsOfRole = characters.filter((ch) => ch.role === role);
    if (charsOfRole.length === 0) return;
    const rowEl = document.createElement('div');
    rowEl.className = 'role-stats-row';
    if (role === 'supporting') supportingRowEl = rowEl;
    const typeLabel = document.createElement('span');
    typeLabel.className = 'role-stats-type';
    typeLabel.textContent = ROLE_LABELS[role];
    typeLabel.style.color = ROLE_COLORS[role];
    rowEl.appendChild(typeLabel);
    charsOfRole.forEach((ch) => {
      const n = comments.filter((c) => c.character.includes(ch.name)).length;
      const s = document.createElement('button');
      s.className = 'role-stat' + (n === 0 ? ' zero' : '');
      s.style.background = ROLE_COLORS[ch.role];
      s.textContent = `${ch.name} ${n}`;
      s.addEventListener('click', () => {
        roleviewEl.querySelector<HTMLElement>(`[data-char="${ch.name}"]`)
          ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
      rowEl.appendChild(s);
    });
    statsWrap.appendChild(rowEl);
  });
  // 未指定附在配角同行末尾；若無配角群組則單獨成行
  if (noneCount > 0) {
    const s = document.createElement('button');
    s.className = 'role-stat';
    s.style.background = '#64748b';
    s.textContent = `未指定 ${noneCount}`;
    s.addEventListener('click', () => {
      roleviewEl.querySelector<HTMLElement>('[data-char="__none__"]')
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    if (supportingRowEl) {
      (supportingRowEl as HTMLDivElement).appendChild(s);
    } else {
      const rowEl = document.createElement('div');
      rowEl.className = 'role-stats-row';
      rowEl.appendChild(s);
      statsWrap.appendChild(rowEl);
    }
  }
  stickyHead.appendChild(statsWrap);
  roleviewEl.appendChild(stickyHead);

  // ── 各角色群組（左側色塊 Label + 右側卡片）──
  const renderGroup = (charName: string, color: string, list: Comment[]): void => {
    if (list.length === 0) return;
    const group = document.createElement('div');
    group.className = 'role-group';
    group.dataset.char = charName;

    const label = document.createElement('div');
    label.className = 'role-group-label';
    label.style.background = color;
    label.textContent = charName === '__none__' ? '未指定' : charName;
    group.appendChild(label);

    const cardsWrap = document.createElement('div');
    cardsWrap.className = 'role-group-cards-wrap';
    const maxRating = list.reduce((m, c) => Math.max(m, c.rating), 0);
    list.forEach((c) => {
      const ridx = roleCards.length;
      const badge: '🏆' | '👎' | undefined =
        c.rating === 0 ? '👎' : c.rating === maxRating ? '🏆' : undefined;
      cardsWrap.appendChild(buildCommentCard(c, { role: true, ridx, focused: ridx === roleFocusIndex, badge }));
      roleCards.push(c);
    });
    group.appendChild(cardsWrap);
    roleviewEl.appendChild(group);
  };

  characters.forEach((ch) => renderGroup(ch.name, ROLE_COLORS[ch.role], commentsForCharacter(ch.name)));
  let noneList = comments.filter((c) => c.character.length === 0);
  if (roleZeroFilter === 'hide') noneList = noneList.filter((c) => c.rating > 0);
  else if (roleZeroFilter === 'solo') noneList = noneList.filter((c) => c.rating === 0);
  renderGroup('__none__', '#64748b', sortComments(noneList, roleSortMode));

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
async function playInline(c: Comment, ridx?: number): Promise<void> {
  const idx = entries.findIndex((e) => e.name === c.file);
  if (idx < 0) return;
  if (idx !== currentIndex) await selectIndex(idx);
  ws.setTime(c.time ?? 0);
  void ws.play();
  inlinePlayingId = c.id;
  // 用傳入的 ridx 避免同一留言出現在多個角色群組時焦點跳到第一個群組
  const cardIdx = ridx !== undefined ? ridx : roleCards.indexOf(c);
  if (cardIdx >= 0) { roleFocusIndex = cardIdx; updateRoleFocusHighlight(); }
  updateRolePlayButtons();
}
function toggleInline(c: Comment, ridx?: number): void {
  if (inlinePlayingId === c.id && ws.isPlaying()) { ws.pause(); updateRolePlayButtons(); return; }
  void playInline(c, ridx);
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
function drawComposerRating(): void {
  composerRatingEl.innerHTML = '';
  for (let i = 1; i <= 5; i++) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'c-star' + (i <= composerRating ? ' filled' : '');
    btn.textContent = '★';
    btn.title = `${i} 分`;
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      composerRating = composerRating === i ? 0 : i;
      drawComposerRating();
    });
    composerRatingEl.appendChild(btn);
  }
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
  // Shift+0–5 設定評分（任何 focus 狀態均有效）
  if (ev.shiftKey && /^Digit[0-5]$/.test(ev.code)) {
    ev.preventDefault();
    const v = parseInt(ev.code[5]);
    composerRating = composerRating === v ? 0 : v;
    drawComposerRating();
    return;
  }
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
    name.title = '雙擊重命名';
    name.style.cursor = 'pointer';
    name.addEventListener('dblclick', () => {
      const inp = document.createElement('input');
      inp.type = 'text';
      inp.value = ch.name;
      inp.style.cssText = 'font-size:13px;width:120px;padding:2px 6px';
      li.replaceChild(inp, name);
      inp.focus();
      inp.select();
      const commit = () => {
        const newName = inp.value.trim();
        if (newName && newName !== ch.name) {
          const oldName = ch.name;
          ch.name = newName;
          comments.forEach((c) => {
            const k = c.character.indexOf(oldName);
            if (k >= 0) c.character[k] = newName;
          });
          saveCharacters(characters);
          persist();
        }
        renderCharEditList();
      };
      inp.addEventListener('keydown', (e) => {
        e.stopPropagation();
        if (e.key === 'Enter') { e.preventDefault(); commit(); }
        else if (e.key === 'Escape') { e.preventDefault(); renderCharEditList(); }
      });
      inp.addEventListener('blur', commit);
    });
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
    if (ev.shiftKey && /^Digit[0-5]$/.test(ev.code)) {
      ev.preventDefault();
      const v = parseInt(ev.code[5]);
      const c = roleCards[roleFocusIndex];
      if (c) { c.rating = c.rating === v ? 0 : v; afterChange(); }
      return;
    }
    if (ev.code === 'Tab' || ev.code === 'Escape') { ev.preventDefault(); setView('single'); return; }
    switch (ev.code) {
      case 'ArrowUp': case 'KeyW': ev.preventDefault(); moveRoleFocus(-1); break;
      case 'ArrowDown': case 'KeyS': ev.preventDefault(); moveRoleFocus(1); break;
      case 'Space': ev.preventDefault(); if (roleCards[roleFocusIndex]) toggleInline(roleCards[roleFocusIndex], roleFocusIndex); break;
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
    case 'KeyC': case 'KeyX':
      if (!ev.ctrlKey && !ev.metaKey) { ev.preventDefault(); startComment(); }
      break;
    case 'Tab': ev.preventDefault(); if (entries.length) setView('grid'); break;
  }
});

// ---- 評語報告 PDF（依角色 Dashboard 版面，按分數高到低）----
function exportCommentsPDF(): void {
  let sectionsHtml = '';

  const sortByRating = (a: Comment, b: Comment): number =>
    (b.rating - a.rating) || a.file.localeCompare(b.file, 'zh-Hant', { numeric: true }) || (a.time ?? -Infinity) - (b.time ?? -Infinity);

  const buildSection = (charName: string, color: string, list: Comment[]): void => {
    if (list.length === 0) return;
    const rows = list.map((c) => {
      const stars = c.rating > 0 ? '★'.repeat(c.rating) + '☆'.repeat(5 - c.rating) : '';
      const time = c.time !== null ? formatTime(c.time) : '整體';
      return `<tr>
        <td class="tc">${escapeHtml(time)}</td>
        <td class="fn">${escapeHtml(c.file)}</td>
        <td class="cm">${escapeHtml(c.text)}</td>
        <td class="sr">${stars}</td>
        <td class="au">${escapeHtml(c.author)}</td>
      </tr>`;
    }).join('');
    sectionsHtml += `<div class="section">
  <div class="slabel" style="background:${color}">${escapeHtml(charName === '__none__' ? '未指定' : charName)}</div>
  <table><thead><tr>
    <th class="tc">時間</th><th class="fn">音檔</th><th class="cm">評語</th><th class="sr">評分</th><th class="au">留言者</th>
  </tr></thead><tbody>${rows}</tbody></table>
</div>`;
  };

  characters.forEach((ch) =>
    buildSection(ch.name, ROLE_COLORS[ch.role],
      comments.filter((c) => c.character.includes(ch.name)).sort(sortByRating)));
  buildSection('__none__', '#64748b',
    comments.filter((c) => c.character.length === 0).sort(sortByRating));

  const html = `<!DOCTYPE html>
<html lang="zh-Hant">
<head>
<meta charset="UTF-8">
<title>VoicePicker 評語報告</title>
<style>
  body{font-family:system-ui,"Microsoft JhengHei",sans-serif;padding:40px;color:#111;max-width:1000px;margin:0 auto}
  h1{font-size:22px;margin-bottom:4px}
  .sub{color:#6b7280;font-size:13px;margin-bottom:28px}
  .section{margin-bottom:32px}
  .slabel{display:inline-block;padding:3px 14px;border-radius:999px;color:#fff;font-size:13px;font-weight:600;margin-bottom:8px}
  table{width:100%;border-collapse:collapse;font-size:13px}
  th{text-align:left;font-size:11px;color:#6b7280;padding:5px 8px;border-bottom:2px solid #e5e7eb}
  td{padding:8px;border-bottom:1px solid #f3f4f6;vertical-align:top}
  td.tc{white-space:nowrap;color:#3b82f6;font-variant-numeric:tabular-nums;width:54px}
  td.fn{color:#6b7280;width:200px;word-break:break-all;font-size:11px}
  td.cm{white-space:pre-wrap;line-height:1.5}
  td.sr{color:#d97706;white-space:nowrap;width:68px;font-size:12px}
  td.au{color:#9ca3af;white-space:nowrap;width:60px;font-size:11px}
  tr:last-child td{border-bottom:none}
  @media print{body{padding:20px}}
</style>
</head>
<body>
<h1>VoicePicker — 評語報告</h1>
<div class="sub">產出時間：${new Date().toLocaleString('zh-Hant')} · 共 ${comments.length} 則留言</div>
${sectionsHtml || '<p style="color:#9ca3af">尚無留言</p>'}
</body></html>`;

  const w = window.open('', '_blank', 'width=900,height=800');
  if (!w) { alert('請允許開啟新分頁（檢查彈出視窗封鎖設定）'); return; }
  w.document.write(html);
  w.document.close();
  setTimeout(() => w.print(), 600);
}
ratingsBtn.addEventListener('click', () => { ratingsBtn.blur(); exportCommentsPDF(); });

// ---- 協作輪詢實作 ----
const POLL_INTERVAL = 10_000;

// 只加入本地沒有的新 ID，不覆蓋本地已有的留言（保護進行中的編輯）
function pollMerge(incoming: unknown[]): number {
  const localIds = new Set(comments.map((c) => c.id));
  const newOnes = incoming
    .map(normalizeComment)
    .filter((c) => !localIds.has(c.id));
  if (newOnes.length === 0) return 0;
  comments = [...comments, ...newOnes];
  return newOnes.length;
}

function startSyncPolling(): void {
  stopSyncPolling();
  pollTimer = window.setInterval(async () => {
    if (!projectDir) { stopSyncPolling(); return; }
    try {
      const fh = await projectDir.getFileHandle(PROJECT_FILE);
      const file = await fh.getFile();
      const data = JSON.parse(await file.text()) as { comments?: unknown[] };
      if (!Array.isArray(data?.comments)) return;
      const added = pollMerge(data.comments);
      lastSyncTime = Date.now();
      renderSyncStatus();
      if (added > 0) {
        saveComments(comments);
        renderMarkers();
        renderFileList();
        renderComments();
        if (view === 'role') renderRoleView();
        showSyncToast(`已同步 ${added} 則新留言`);
      }
    } catch {
      // NAS 暫時無法讀取 → 靜默跳過
    }
  }, POLL_INTERVAL);
}

function stopSyncPolling(): void {
  if (pollTimer !== undefined) { window.clearInterval(pollTimer); pollTimer = undefined; }
}

function renderSyncStatus(): void {
  const el = document.getElementById('syncStatus');
  if (!el) return;
  if (!projectDir) { el.textContent = ''; return; }
  const t = lastSyncTime
    ? new Date(lastSyncTime).toLocaleTimeString('zh-Hant', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    : '—';
  el.textContent = `↺ 協作同步中 · ${t}`;
}

let syncToastTimer: number | undefined;
function showSyncToast(msg: string): void {
  const toast = document.getElementById('syncToast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.remove('hidden');
  window.clearTimeout(syncToastTimer);
  syncToastTimer = window.setTimeout(() => toast.classList.add('hidden'), 3000);
}

// ---- 唯讀分享版匯出 ----
function generateShareHTML(): void {
  const safeEmbed = (v: unknown): string =>
    JSON.stringify(v)
      .replace(/</g, '\\u003c')
      .replace(/>/g, '\\u003e')
      .replace(/&/g, '\\u0026');

  const html = viewerTemplate
    .replace('{{DATA_JSON}}', () => safeEmbed({ comments, characters, roleColors: ROLE_COLORS }));

  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const blobUrl = URL.createObjectURL(blob);
  const d = new Date();
  const p = (n: number): string => String(n).padStart(2, '0');
  const stamp = `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}-${p(d.getHours())}${p(d.getMinutes())}`;
  const a = document.createElement('a');
  a.href = blobUrl;
  a.download = `voicepicker-share-${stamp}.html`;
  a.click();
  URL.revokeObjectURL(blobUrl);
}

// ---- 外部分享版匯出（音訊內嵌）----
async function generateExternalShareHTML(): Promise<void> {
  if (entries.length === 0) {
    alert('請先選擇音檔資料夾後再匯出外部分享版。');
    return;
  }

  // 只包含有留言的音檔
  const filesWithComments = new Set(comments.map((c) => c.file));
  const relevant = entries.filter((e) => filesWithComments.has(e.name));

  if (relevant.length === 0) {
    alert('目前沒有任何留言，無法產生分享版。');
    return;
  }

  shareConfirmBtn.disabled = true;
  shareConfirmBtn.textContent = `處理中 0/${relevant.length}…`;

  const audioMap: Record<string, string> = {};
  for (let i = 0; i < relevant.length; i++) {
    const entry = relevant[i];
    shareConfirmBtn.textContent = `處理中 ${i + 1}/${relevant.length}…`;
    try {
      const file = await entry.handle.getFile();
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      audioMap[entry.name] = dataUrl;
    } catch {
      // 無法讀取的檔案跳過，播放時顯示警告
    }
  }

  shareConfirmBtn.disabled = false;
  shareConfirmBtn.textContent = '匯出';

  const safeEmbed = (v: unknown): string =>
    JSON.stringify(v)
      .replace(/</g, '\\u003c')
      .replace(/>/g, '\\u003e')
      .replace(/&/g, '\\u0026');

  const html = externalViewerTemplate
    .replace('{{DATA_JSON}}', () => safeEmbed({ comments, characters, roleColors: ROLE_COLORS }))
    .replace('{{AUDIO_JSON}}', () => safeEmbed(audioMap));

  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const blobUrl = URL.createObjectURL(blob);
  const d = new Date();
  const p = (n: number): string => String(n).padStart(2, '0');
  const stamp = `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}-${p(d.getHours())}${p(d.getMinutes())}`;
  const a = document.createElement('a');
  a.href = blobUrl;
  a.download = `voicepicker-external-${stamp}.html`;
  a.click();
  URL.revokeObjectURL(blobUrl);
}

shareBtn.addEventListener('click', () => {
  shareBtn.blur();
  shareModalEl.classList.remove('hidden');
});
shareCancelBtn.addEventListener('click', () => shareModalEl.classList.add('hidden'));
shareConfirmBtn.addEventListener('click', () => {
  const mode = (shareModalEl.querySelector<HTMLInputElement>('input[name="shareMode"]:checked'))?.value;
  shareModalEl.classList.add('hidden');
  if (mode === 'external') {
    generateExternalShareHTML();
  } else {
    generateShareHTML();
  }
});

// ---- 角色視圖按鈕 ----
roleViewBtn.addEventListener('click', () => { roleViewBtn.blur(); setView('role'); });

// ---- 啟動 ----
appVerEl.textContent = 'v' + __APP_VERSION__;
if (!author) openNameModal(null);
