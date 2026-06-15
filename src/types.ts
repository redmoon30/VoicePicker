// 一則 timecode 留言。
export interface Comment {
  id: string;
  file: string; // 所屬音檔檔名（目前以檔名為 key）
  time: number | null; // 秒數；null = 整體留言（不對應秒數）
  text: string;
  author: string; // 留言者名字
  character: string[]; // 掛的角色名（可複選，空陣列＝未掛）
}

export type ViewMode = 'single' | 'grid';
