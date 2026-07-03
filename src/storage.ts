// localStorage 持久層。
// 注意：這是「session 便利存檔」，不是 P4 的可攜專案檔（project.json）。
// 留言/角色/名字存在本機瀏覽器，避免測試時 refresh 全失。

import { type Character, DEFAULT_CHARACTERS } from './characters';
import { type Comment, type Reply } from './types';

const K_AUTHOR = 'voicepicker.author';
const K_COMMENTS = 'voicepicker.comments';
const K_CHARS = 'voicepicker.characters';
const K_DELETED = 'voicepicker.deleted_ids';

export function loadDeletedIds(): string[] {
  try { return JSON.parse(localStorage.getItem(K_DELETED) ?? '[]'); } catch { return []; }
}
export function saveDeletedIds(ids: string[]): void {
  localStorage.setItem(K_DELETED, JSON.stringify(ids));
}

export function loadAuthor(): string {
  return localStorage.getItem(K_AUTHOR) ?? '';
}

export function saveAuthor(name: string): void {
  localStorage.setItem(K_AUTHOR, name);
}

function normalizeReply(r: unknown): Reply {
  const o = (r ?? {}) as Record<string, unknown>;
  return {
    id: typeof o.id === 'string' ? o.id : Math.random().toString(36).slice(2),
    author: typeof o.author === 'string' ? o.author : '',
    text: typeof o.text === 'string' ? o.text : '',
    created: typeof o.created === 'number' ? o.created : Date.now(),
  };
}

// 把任意來源（舊格式 / NAS json）的留言正規化。相容舊的 character: string|null、無 replies。
export function normalizeComment(c: unknown): Comment {
  const o = (c ?? {}) as Record<string, unknown>;
  const ch = o.character;
  let character: string[];
  if (Array.isArray(ch)) character = ch.filter((x): x is string => typeof x === 'string');
  else if (typeof ch === 'string') character = [ch];
  else character = [];
  const replies = Array.isArray(o.replies) ? (o.replies as unknown[]).map(normalizeReply) : [];
  return {
    id: typeof o.id === 'string' ? o.id : Math.random().toString(36).slice(2),
    file: typeof o.file === 'string' ? o.file : '',
    time: typeof o.time === 'number' ? o.time : null,
    text: typeof o.text === 'string' ? o.text : '',
    author: typeof o.author === 'string' ? o.author : '',
    character,
    replies,
    rating: typeof o.rating === 'number' ? Math.min(5, Math.max(0, Math.round(o.rating))) : 0,
  };
}

export function loadComments(): Comment[] {
  try {
    const raw = localStorage.getItem(K_COMMENTS);
    return raw ? (JSON.parse(raw) as unknown[]).map(normalizeComment) : [];
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
