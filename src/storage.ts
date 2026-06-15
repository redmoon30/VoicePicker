// localStorage 持久層。
// 注意：這是「session 便利存檔」，不是 P4 的可攜專案檔（project.json）。
// 留言/角色/名字存在本機瀏覽器，避免測試時 refresh 全失。

import { type Character, DEFAULT_CHARACTERS } from './characters';
import { type Comment } from './types';

const K_AUTHOR = 'voicepicker.author';
const K_COMMENTS = 'voicepicker.comments';
const K_CHARS = 'voicepicker.characters';

export function loadAuthor(): string {
  return localStorage.getItem(K_AUTHOR) ?? '';
}

export function saveAuthor(name: string): void {
  localStorage.setItem(K_AUTHOR, name);
}

export function loadComments(): Comment[] {
  try {
    const raw = localStorage.getItem(K_COMMENTS);
    return raw ? (JSON.parse(raw) as Comment[]) : [];
  } catch {
    return [];
  }
}

export function saveComments(comments: Comment[]): void {
  localStorage.setItem(K_COMMENTS, JSON.stringify(comments));
}

export function loadCharacters(): Character[] {
  try {
    const raw = localStorage.getItem(K_CHARS);
    return raw ? (JSON.parse(raw) as Character[]) : [...DEFAULT_CHARACTERS];
  } catch {
    return [...DEFAULT_CHARACTERS];
  }
}

export function saveCharacters(chars: Character[]): void {
  localStorage.setItem(K_CHARS, JSON.stringify(chars));
}
