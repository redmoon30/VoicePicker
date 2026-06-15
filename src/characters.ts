// WTP 角色名單 — comment 角色標籤的預設值（P3 使用）。
//
// 可編輯性：此檔為「種子預設」。P3 會加入工具內編輯 UI，將清單存入
// localStorage（以本檔為初始值），屆時使用者可在介面增刪/改色，不需動程式碼。
// 在那之前，要調整名單直接改本檔即可。

export type CharacterRole = 'lead' | 'supporting';

export interface Character {
  name: string;
  role: CharacterRole; // lead = 主角, supporting = 配角
  color: string; // 標籤顏色（主角用飽和色、配角用較柔和色，視覺上區分兩群）
}

export const DEFAULT_CHARACTERS: Character[] = [
  // —— 主角 ——
  { name: '迪迪', role: 'lead', color: '#ef4444' },
  { name: '克克', role: 'lead', color: '#f59e0b' },
  { name: '林林', role: 'lead', color: '#22c55e' },
  { name: '泰泰', role: 'lead', color: '#3b82f6' },

  // —— 配角 ——
  { name: '怪氣流', role: 'supporting', color: '#8b5cf6' },
  { name: '穿山甲大叔', role: 'supporting', color: '#b45309' },
  { name: '花福導遊', role: 'supporting', color: '#ec4899' },
  { name: '田鼠先生', role: 'supporting', color: '#0891b2' },
  { name: '田鼠太太', role: 'supporting', color: '#06b6d4' },
  { name: '達東爸', role: 'supporting', color: '#65a30d' },
  { name: '達東媽', role: 'supporting', color: '#16a34a' },
  { name: '村長', role: 'supporting', color: '#78716c' },
  { name: '卡爾博士', role: 'supporting', color: '#6366f1' },
  { name: '小達東', role: 'supporting', color: '#84cc16' },
  { name: '吵鬧菇', role: 'supporting', color: '#d946ef' },
  { name: '阿桂', role: 'supporting', color: '#14b8a6' },
];
