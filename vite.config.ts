import { defineConfig } from 'vite';
import pkg from './package.json';

// GITHUB_ACTIONS env var 由 GitHub Actions runner 自動設定。
// 本地 dev / build 維持 base: '/'，GitHub Pages build 使用 '/VoicePicker/'。
export default defineConfig({
  base: process.env.GITHUB_ACTIONS ? '/VoicePicker/' : '/',
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
  },
});
