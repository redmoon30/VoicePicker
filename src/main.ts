import WaveSurfer from 'wavesurfer.js';
import './style.css';

const AUDIO_EXT = new Set(['wav', 'mp3', 'm4a', 'aac', 'ogg', 'flac', 'wma', 'opus']);

interface AudioEntry {
  name: string;
  handle: FileSystemFileHandle;
}

let entries: AudioEntry[] = [];
let currentIndex = -1;
let currentUrl: string | null = null;

const pickBtn = document.getElementById('pick') as HTMLButtonElement;
const fileListEl = document.getElementById('filelist') as HTMLUListElement;
const nowPlayingEl = document.getElementById('nowplaying') as HTMLHeadingElement;
const statusEl = document.getElementById('status') as HTMLDivElement;

const ws = WaveSurfer.create({
  container: '#waveform',
  waveColor: '#7a8ba6',
  progressColor: '#3b82f6',
  cursorColor: '#ef4444',
  height: 120,
});

ws.on('ready', () => {
  statusEl.textContent = `時長 ${formatTime(ws.getDuration())}`;
});
ws.on('timeupdate', (t: number) => {
  statusEl.textContent = `${formatTime(t)} / ${formatTime(ws.getDuration())}`;
});

function formatTime(s: number): string {
  if (!isFinite(s)) return '0:00';
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60).toString().padStart(2, '0');
  return `${m}:${sec}`;
}

pickBtn.addEventListener('click', async () => {
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
    return; // 使用者取消
  }

  entries = [];
  // @ts-expect-error - entries() 為 File System Access API，TS DOM lib 尚未涵蓋
  for await (const [name, handle] of dirHandle.entries()) {
    if (handle.kind !== 'file') continue;
    const ext = name.split('.').pop()?.toLowerCase() ?? '';
    if (AUDIO_EXT.has(ext)) entries.push({ name, handle });
  }
  entries.sort((a, b) => a.name.localeCompare(b.name, 'zh-Hant', { numeric: true }));

  renderList();
  if (entries.length > 0) {
    void selectIndex(0);
  } else {
    nowPlayingEl.textContent = '此資料夾沒有音檔';
  }
});

function renderList(): void {
  fileListEl.innerHTML = '';
  entries.forEach((e, i) => {
    const li = document.createElement('li');
    li.textContent = e.name;
    if (i === currentIndex) li.className = 'active';
    li.addEventListener('click', () => void selectIndex(i));
    fileListEl.appendChild(li);
  });
}

async function selectIndex(i: number): Promise<void> {
  if (i < 0 || i >= entries.length) return;
  currentIndex = i;
  renderList();

  const entry = entries[i];
  nowPlayingEl.textContent = entry.name;
  statusEl.textContent = '載入中…';

  const file = await entry.handle.getFile();
  if (currentUrl) URL.revokeObjectURL(currentUrl);
  currentUrl = URL.createObjectURL(file);

  await ws.load(currentUrl);
  void ws.play();
}

document.addEventListener('keydown', (ev) => {
  if (ev.code === 'Space') {
    ev.preventDefault();
    void ws.playPause();
  }
});
