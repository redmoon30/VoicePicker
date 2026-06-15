// WTP 角色名單 — comment 角色標籤的預設值（P3 使用）。
//
// 顏色規則：標籤顏色由「分類（role）」決定，共三種。新增角色時只需從
// 三類選一種，不需逐角色配色。
//   - lead       主角
//   - supporting 配角
//   - mascot     吉祥物
//
// 可編輯性：此檔為「種子預設」。P3 會加入工具內編輯 UI，將清單存入
// localStorage（以本檔為初始值），屆時可在介面增刪角色、改分類。
// 在那之前，要調整名單直接改本檔即可。

export type CharacterRole = 'lead' | 'supporting' | 'mascot';

export const ROLE_LABELS: Record<CharacterRole, string> = {
  lead: '主角',
  supporting: '配角',
  mascot: '吉祥物',
};

export const ROLE_COLORS: Record<CharacterRole, string> = {
  lead: '#3b82f6', // 藍 — 主角
  supporting: '#64748b', // 灰 — 配角
  mascot: '#ec4899', // 粉 — 吉祥物
};

export interface Character {
  name: string;
  role: CharacterRole;
}

export const DEFAULT_CHARACTERS: Character[] = [
  // —— 主角 ——
  { name: '迪迪', role: 'lead' },
  { name: '克克', role: 'lead' },
  { name: '林林', role: 'lead' },
  { name: '泰泰', role: 'lead' },

  // —— 吉祥物 ——
  { name: '怪氣流', role: 'mascot' },
  { name: '田鼠先生', role: 'mascot' },
  { name: '田鼠太太', role: 'mascot' },
  { name: '吵鬧菇', role: 'mascot' },

  // —— 配角 ——
  { name: '穿山甲大叔', role: 'supporting' },
  { name: '花福導遊', role: 'supporting' },
  { name: '達東爸', role: 'supporting' },
  { name: '達東媽', role: 'supporting' },
  { name: '村長', role: 'supporting' },
  { name: '卡爾博士', role: 'supporting' },
  { name: '小達東', role: 'supporting' },
  { name: '阿桂', role: 'supporting' },
];

// 取得某角色的標籤顏色。
export function colorOf(c: Character): string {
  return ROLE_COLORS[c.role];
}
