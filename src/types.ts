// 一則 timecode 留言。
export interface Comment {
  id: string;
  file: string; // 所屬音檔檔名（目前以檔名為 key）
  time: number; // 秒數
  text: string;
  author: string; // 留言者名字
  character: string | null; // 掛的角色名（無則 null）
}

export type ViewMode = 'single' | 'grid';
