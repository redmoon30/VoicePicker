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
const PREV_SKIP = 1.5; // 按 W：游標在 1.5s 內的留言點視為「已在此」，跳更前一個
const NEXT_SKIP = 0.25;
const PROJECT_FILE = 'voicepicker.json'; // 寫進 NAS 資料夾，供同資料夾的人共享留言

interface AudioEntry {
  name: string;
  handle: FileSystemFileHandle;
}

// ---- 狀態 ----
let entries: AudioEntry[] = [];
let currentIndex = -1; // 目前載入播放的檔
let currentUrl: string | null = null;
let view: ViewMode = 'single';
let gridIndex = 0; // 網格中高亮的檔
let projectDir: FileSystemDirectoryHandle | null = null; // 所選 NAS 資料夾
let saveTimer: number | undefined;

let author = loadAuthor();
let comments = loadComments();
let characters = loadCharacters();

let pendingTime = 0;
let composerAttachTime = true; // 留言是否對應秒數（toggle）
let composerChars: string[] = []; // 撰寫中留言掛的角色（複選）
let composerFocus: 'text' | 'toggle' | number = 'text'; // 留言框焦點
let editingCharId: string | null = null;
let nameCallback: (() => void) | null = null;

// ---- DOM ----
const $ = <T extends HTMLElement>(id: string): T => document.getElementById(id) as T;
const pickBtn = $<HTMLButtonElement>('pick');
const editCharsBtn = $<HTMLButtonElement>('editChars');
const fileListEl = $<HTMLUListElement>('filelist');
const nowPlayingEl = $<HTMLHeadingElement>('nowplaying');
const statusEl = $<HTMLDivElement>('status');
const playBtn = $<HTMLButtonElement>('playBtn');
const appVerEl = $<HTMLSpanElement>('appVer');
const sidebarEl = $<HTMLElement>('sidebar');
const playerEl = $<HTMLElement>('player');
const gridEl = $<HTMLDivElement>('grid');
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
ws.on('play', () => { playBtn.textContent = '⏸ 暫停'; });
ws.on('pause', () => { playBtn.textContent = '▶ 播放'; });
ws.on('finish', () => {
  if (currentIndex < entries.length - 1) void selectIndex(currentIndex + 1);
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
// 播放器狀態用：精準到 1/100 秒（M:SS.cc）
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
// 留言區「焦點檔」：單檔=載入中的檔；網格=高亮的檔
function focusedFileName(): string | null {
  if (view === 'grid') {
    return gridIndex >= 0 && gridIndex < entries.length ? entries[gridIndex].name : null;
  }
  return currentFileName();
}
function commentsForFile(name: string | null): Comment[] {
  // 整體留言（time=null）置頂，其餘依秒數遞增
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

// ---- 持久化（localStorage 鏡像 + NAS 資料夾 json）----
function persist(): void {
  saveComments(comments); // 離線備援
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
    // 權限不足/唯讀 → 略過（localStorage 仍有備份）
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
    // 沒檔案或讀不到 → 沿用現有資料，首次存檔時自動建立
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

  await loadProjectFromDir(); // 讀資料夾內的共享留言
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

// ---- 波型標記（永遠是載入中的檔）----
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

// ---- 留言列（顯示「焦點檔」，不受 Tab 影響）----
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

  list.forEach((c) => {
    const li = document.createElement('li');
    li.className = 'citem';

    const row = document.createElement('div');
    row.className = 'crow';
    const time = document.createElement('span');
    if (c.time === null) {
      time.className = 'ctime general';
      time.textContent = '整體';
    } else {
      time.className = 'ctime';
      time.textContent = formatTime(c.time);
      time.addEventListener('click', () => void openCommentAt(c));
    }
    const auth = document.createElement('span');
    auth.className = 'cauthor';
    auth.textContent = c.author;
    const del = document.createElement('button');
    del.className = 'cdel';
    del.textContent = '×';
    del.title = '刪除';
    del.addEventListener('click', () => {
      comments = comments.filter((x) => x.id !== c.id);
      persist();
      renderMarkers();
      renderComments();
      renderFileList();
    });
    row.append(time, auth, del);

    const text = document.createElement('div');
    text.className = 'ctext';
    text.textContent = c.text;
    text.addEventListener('dblclick', () => {
      text.contentEditable = 'true';
      text.focus();
    });
    text.addEventListener('keydown', (e) => {
      if (e.isComposing) return; // 注音選字中不攔截
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); text.blur(); } // Shift+Enter 換行
    });
    text.addEventListener('blur', () => {
      text.contentEditable = 'false';
      const v = (text.innerText ?? '').trim(); // innerText 保留換行
      if (v) { c.text = v; persist(); }
      else { text.textContent = c.text; }
    });

    const tagRow = document.createElement('div');
    tagRow.className = 'ctag-row';
    if (editingCharId === c.id) {
      const picker = document.createElement('div');
      picker.className = 'char-picker';
      renderCharChips(picker, c.character, (name) => {
        toggleName(c.character, name);
        persist();
        renderMarkers();
        renderComments();
      });
      const done = document.createElement('button');
      done.type = 'button';
      done.className = 'charchip done';
      done.textContent = '完成';
      done.addEventListener('click', () => { editingCharId = null; renderComments(); });
      picker.appendChild(done);
      tagRow.appendChild(picker);
    } else if (c.character.length > 0) {
      c.character.forEach((nm) => {
        const tag = document.createElement('span');
        tag.className = 'ctag';
        tag.style.background = colorByName(nm, characters) ?? '#3b82f6';
        tag.textContent = nm;
        tag.addEventListener('click', () => { editingCharId = c.id; renderComments(); });
        tagRow.appendChild(tag);
      });
    } else {
      const tag = document.createElement('span');
      tag.className = 'ctag empty';
      tag.textContent = '＋ 角色';
      tag.addEventListener('click', () => { editingCharId = c.id; renderComments(); });
      tagRow.appendChild(tag);
    }

    li.append(row, text, tagRow);
    commentListEl.appendChild(li);
  });
}

// 點留言秒數：必要時切到該檔再跳播（網格中也能用）
async function openCommentAt(c: Comment): Promise<void> {
  if (c.time === null) return;
  const idx = entries.findIndex((e) => e.name === c.file);
  if (idx < 0) return;
  if (view === 'grid') setView('single');
  if (idx !== currentIndex) await selectIndex(idx);
  ws.setTime(c.time);
  void ws.play();
}

// 角色 chips（共用）。selected 為已選名單（複選），focusedIndex 用於鍵盤巡覽。
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
    chip.addEventListener('click', () => onToggle(ch.name));
    container.appendChild(chip);
  });
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
  });
  persist();
  renderMarkers();
  renderComments();
  renderFileList();
}

// 焦點移動：文字 → 時間軸開關 → 角色 chips（垂直三段）
function goToggle(): void {
  composerFocus = 'toggle';
  composerText.blur();
  drawComposer();
}
function backToText(): void {
  composerFocus = 'text';
  drawComposer();
  composerText.focus();
}
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

// 依實際座標在 chips 間做 2D 方向移動（flex-wrap 每排數量不固定）
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
      if (Math.abs(rect.top + rect.height / 2 - cy) > rowTol) return; // 非同排
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
  if (dir === 'up' && best < 0) return 'toggle'; // 沒有上一排 → 回時間軸開關
  return best >= 0 ? best : cur;
}

function handleComposerKey(ev: KeyboardEvent): void {
  if (ev.isComposing) return; // 注音/IME 選字中，完全不攔截（修選字誤觸發儲存/切角色）
  if (ev.code === 'Escape') { ev.preventDefault(); closeComposer(); return; }

  if (composerFocus === 'text') {
    if (isEnter(ev) && !ev.shiftKey) { ev.preventDefault(); saveComposer(); return; }
    if (ev.code === 'ArrowDown' || ev.code === 'Tab') { ev.preventDefault(); goToggle(); return; }
    return; // 其餘交給 textarea（打字、Shift+Enter 換行、文字內游標移動）
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

  // 角色 chip 模式
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
composerToggle.addEventListener('click', () => {
  composerAttachTime = !composerAttachTime;
  drawComposer();
});

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

// ---- 網格視圖 ----
function setView(v: ViewMode): void {
  view = v;
  if (v === 'grid') {
    ws.pause();
    renderGrid();
    sidebarEl.classList.add('hidden');
    playerEl.classList.add('hidden');
    gridEl.classList.remove('hidden');
  } else {
    gridEl.classList.add('hidden');
    sidebarEl.classList.remove('hidden');
    playerEl.classList.remove('hidden');
  }
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
  // 留言框開啟時，鍵盤全交給它
  if (!composerEl.classList.contains('hidden')) { handleComposerKey(ev); return; }
  if (ev.isComposing) return;
  // 側欄角色選取中，Esc 取消回上一步
  if (editingCharId !== null && ev.code === 'Escape') {
    ev.preventDefault();
    editingCharId = null;
    renderComments();
    return;
  }
  if (anyModalOpen() || isTyping()) return;

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

  // 單檔模式（方向鍵與 WASD 等價）
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

// ---- 啟動 ----
appVerEl.textContent = 'v' + __APP_VERSION__;
if (!author) openNameModal(null); // 首次開啟先問名字
