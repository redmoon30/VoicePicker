import WaveSurfer from 'wavesurfer.js';
import RegionsPlugin from 'wavesurfer.js/dist/plugins/regions.esm.js';
import './style.css';
import { type Character, ROLE_COLORS, ROLE_LABELS, colorByName } from './characters';
import { type Comment, type ViewMode } from './types';
import {
  loadAuthor, saveAuthor,
  loadComments, saveComments,
  loadCharacters, saveCharacters,
} from './storage';

const AUDIO_EXT = new Set(['wav', 'mp3', 'm4a', 'aac', 'ogg', 'flac', 'wma', 'opus']);
const GRID_COLS = 4;

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

let author = loadAuthor();
let comments = loadComments();
let characters = loadCharacters();

let pendingTime = 0; // 撰寫中留言的秒數
let composerChar: string | null = null;
let editingCharId: string | null = null; // 側欄中正在改角色的留言 id
let nameCallback: (() => void) | null = null;

// ---- DOM ----
const $ = <T extends HTMLElement>(id: string): T => document.getElementById(id) as T;
const pickBtn = $<HTMLButtonElement>('pick');
const editCharsBtn = $<HTMLButtonElement>('editChars');
const fileListEl = $<HTMLUListElement>('filelist');
const nowPlayingEl = $<HTMLHeadingElement>('nowplaying');
const statusEl = $<HTMLDivElement>('status');
const appEl = $<HTMLDivElement>('app');
const gridEl = $<HTMLDivElement>('grid');
const commentListEl = $<HTMLUListElement>('commentlist');

const composerEl = $<HTMLDivElement>('composer');
const composerTimeEl = $<HTMLSpanElement>('composerTime');
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
  statusEl.textContent = `時長 ${formatTime(ws.getDuration())}`;
});
ws.on('timeupdate', (t: number) => {
  statusEl.textContent = `${formatTime(t)} / ${formatTime(ws.getDuration())}`;
});
ws.on('finish', () => {
  if (currentIndex < entries.length - 1) void selectIndex(currentIndex + 1);
});
regions.on('region-clicked', (region, e) => {
  e.stopPropagation();
  ws.setTime(region.start);
  void ws.play();
});

// ---- 工具函式 ----
function formatTime(s: number): string {
  if (!isFinite(s)) return '0:00';
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60).toString().padStart(2, '0');
  return `${m}:${sec}`;
}

function uid(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (m) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[m]!,
  );
}

function currentFileName(): string | null {
  return currentIndex >= 0 && currentIndex < entries.length ? entries[currentIndex].name : null;
}

function commentsForCurrentFile(): Comment[] {
  const f = currentFileName();
  return f ? comments.filter((c) => c.file === f).sort((a, b) => a.time - b.time) : [];
}

function countComments(file: string): number {
  return comments.filter((c) => c.file === file).length;
}

// ---- 選資料夾 ----
pickBtn.addEventListener('click', async () => {
  pickBtn.blur();
  const picker = (window as unknown as {
    showDirectoryPicker?: () => Promise<FileSystemDirectoryHandle>;
  }).showDirectoryPicker;
  if (!picker) {
    alert('此瀏覽器不支援資料夾選取，請改用 Chrome / Edge。');
    return;
  }
  let dirHandle: FileSystemDirectoryHandle;
  try {
    dirHandle = await picker();
  } catch {
    return;
  }

  entries = [];
  // @ts-expect-error - entries() 為 File System Access API，TS DOM lib 尚未涵蓋
  for await (const [name, handle] of dirHandle.entries()) {
    if (handle.kind !== 'file') continue;
    const ext = name.split('.').pop()?.toLowerCase() ?? '';
    if (AUDIO_EXT.has(ext)) entries.push({ name, handle });
  }
  entries.sort((a, b) => a.name.localeCompare(b.name, 'zh-Hant', { numeric: true }));

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
  commentsForCurrentFile().forEach((c, idx) => {
    regions.addRegion({
      start: c.time,
      content: String(idx + 1),
      color: colorByName(c.character, characters) ?? '#3b82f6',
      drag: false,
      resize: false,
    });
  });
}

// ---- 留言列（右側）----
function renderComments(): void {
  commentListEl.innerHTML = '';
  const list = commentsForCurrentFile();
  if (list.length === 0) {
    const empty = document.createElement('li');
    empty.style.color = 'var(--muted)';
    empty.style.fontSize = '13px';
    empty.textContent = '尚無留言。播放時按 C 新增。';
    commentListEl.appendChild(empty);
    return;
  }

  list.forEach((c) => {
    const li = document.createElement('li');
    li.className = 'citem';

    // 第一列：秒數 / 作者 / 刪除
    const row = document.createElement('div');
    row.className = 'crow';
    const time = document.createElement('span');
    time.className = 'ctime';
    time.textContent = formatTime(c.time);
    time.addEventListener('click', () => { ws.setTime(c.time); void ws.play(); });
    const auth = document.createElement('span');
    auth.className = 'cauthor';
    auth.textContent = c.author;
    const del = document.createElement('button');
    del.className = 'cdel';
    del.textContent = '×';
    del.title = '刪除';
    del.addEventListener('click', () => {
      comments = comments.filter((x) => x.id !== c.id);
      saveComments(comments);
      renderMarkers();
      renderComments();
      renderFileList();
    });
    row.append(time, auth, del);

    // 內文（雙擊編輯）
    const text = document.createElement('div');
    text.className = 'ctext';
    text.textContent = c.text;
    text.addEventListener('dblclick', () => {
      text.contentEditable = 'true';
      text.focus();
    });
    text.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') { e.preventDefault(); text.blur(); }
    });
    text.addEventListener('blur', () => {
      text.contentEditable = 'false';
      const v = (text.textContent ?? '').trim();
      if (v) { c.text = v; saveComments(comments); }
      else { text.textContent = c.text; }
    });

    // 角色標籤列
    const tagRow = document.createElement('div');
    tagRow.className = 'ctag-row';
    if (editingCharId === c.id) {
      const picker = document.createElement('div');
      picker.className = 'char-picker';
      renderCharChips(picker, c.character, (name) => {
        c.character = name;
        saveComments(comments);
        editingCharId = null;
        renderMarkers();
        renderComments();
      });
      tagRow.appendChild(picker);
    } else {
      const tag = document.createElement('span');
      const color = colorByName(c.character, characters);
      if (c.character && color) {
        tag.className = 'ctag';
        tag.style.background = color;
        tag.textContent = c.character;
      } else {
        tag.className = 'ctag empty';
        tag.textContent = '＋ 角色';
      }
      tag.addEventListener('click', () => { editingCharId = c.id; renderComments(); });
      tagRow.appendChild(tag);
    }

    li.append(row, text, tagRow);
    commentListEl.appendChild(li);
  });
}

// 角色 chips（composer 與 inline 共用）
function renderCharChips(
  container: HTMLElement,
  selected: string | null,
  onSelect: (name: string | null) => void,
): void {
  container.innerHTML = '';
  characters.forEach((ch) => {
    const chip = document.createElement('button');
    chip.type = 'button';
    chip.className = 'charchip';
    chip.textContent = ch.name;
    chip.style.borderColor = ROLE_COLORS[ch.role];
    if (selected === ch.name) {
      chip.style.background = ROLE_COLORS[ch.role];
      chip.style.color = '#fff';
    }
    chip.addEventListener('click', () => onSelect(selected === ch.name ? null : ch.name));
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
  composerTimeEl.textContent = formatTime(pendingTime);
  composerText.value = '';
  composerChar = null;
  drawComposerChars();
  composerEl.classList.remove('hidden');
  composerText.focus();
}

function drawComposerChars(): void {
  renderCharChips(composerCharsEl, composerChar, (name) => {
    composerChar = name;
    drawComposerChars();
  });
}

function saveComposer(): void {
  const text = composerText.value.trim();
  composerEl.classList.add('hidden');
  if (!text) return;
  const f = currentFileName();
  if (!f) return;
  comments.push({ id: uid(), file: f, time: pendingTime, text, author, character: composerChar });
  saveComments(comments);
  renderMarkers();
  renderComments();
  renderFileList();
}

composerText.addEventListener('keydown', (e) => {
  e.stopPropagation();
  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); saveComposer(); }
  else if (e.key === 'Escape') { e.preventDefault(); composerEl.classList.add('hidden'); }
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
  const role = newCharRole.value as Character['role'];
  characters.push({ name, role });
  saveCharacters(characters);
  newCharName.value = '';
  renderCharEditList();
});
newCharName.addEventListener('keydown', (e) => {
  e.stopPropagation();
  if (e.key === 'Enter') { e.preventDefault(); addCharBtn.click(); }
});
closeCharBtn.addEventListener('click', () => {
  charModalEl.classList.add('hidden');
  renderMarkers();
  renderComments();
});

// ---- 播放器控制 ----
function seekBy(delta: number): void {
  const dur = ws.getDuration();
  if (!isFinite(dur) || dur === 0) return;
  const t = Math.min(Math.max(0, ws.getCurrentTime() + delta), dur);
  ws.setTime(t);
}

// dir < 0：上一個留言點；dir > 0：下一個
function jumpMarker(dir: number): void {
  const times = commentsForCurrentFile().map((c) => c.time);
  if (times.length === 0) return;
  const t = ws.getCurrentTime();
  let target: number | undefined;
  if (dir < 0) {
    for (let k = times.length - 1; k >= 0; k--) {
      if (times[k] < t - 0.25) { target = times[k]; break; }
    }
    target ??= times[0];
  } else {
    for (let k = 0; k < times.length; k++) {
      if (times[k] > t + 0.25) { target = times[k]; break; }
    }
    target ??= times[times.length - 1];
  }
  ws.setTime(target);
}

// ---- 網格視圖 ----
function setView(v: ViewMode): void {
  view = v;
  if (v === 'grid') {
    renderGrid();
    appEl.classList.add('hidden');
    gridEl.classList.remove('hidden');
  } else {
    gridEl.classList.add('hidden');
    appEl.classList.remove('hidden');
  }
}

function renderGrid(): void {
  gridEl.innerHTML = '';
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
}

// ---- 全域鍵盤 ----
function isTyping(): boolean {
  const el = document.activeElement as HTMLElement | null;
  if (!el) return false;
  return el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable;
}

function anyModalOpen(): boolean {
  return [composerEl, nameModalEl, charModalEl].some((e) => !e.classList.contains('hidden'));
}

document.addEventListener('keydown', (ev) => {
  if (anyModalOpen() || isTyping()) return;

  if (view === 'grid') {
    switch (ev.code) {
      case 'Tab': ev.preventDefault(); setView('single'); break;
      case 'Enter': ev.preventDefault(); setView('single'); void selectIndex(gridIndex); break;
      case 'ArrowLeft': ev.preventDefault(); moveGrid(-1); break;
      case 'ArrowRight': ev.preventDefault(); moveGrid(1); break;
      case 'ArrowUp': ev.preventDefault(); moveGrid(-GRID_COLS); break;
      case 'ArrowDown': ev.preventDefault(); moveGrid(GRID_COLS); break;
    }
    return;
  }

  // 單檔模式
  switch (ev.code) {
    case 'Space': ev.preventDefault(); void ws.playPause(); break;
    case 'KeyA': ev.preventDefault(); seekBy(-5); break;
    case 'KeyD': ev.preventDefault(); seekBy(5); break;
    case 'KeyW': ev.preventDefault(); jumpMarker(-1); break;
    case 'KeyS': ev.preventDefault(); jumpMarker(1); break;
    case 'KeyC': ev.preventDefault(); startComment(); break;
    case 'Tab': ev.preventDefault(); if (entries.length) setView('grid'); break;
  }
});

// ---- 啟動：首次開啟若沒名字就先問 ----
if (!author) openNameModal(null);
