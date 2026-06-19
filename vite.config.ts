import { defineConfig } from 'vite';
import pkg from './package.json';

// 把版本號從 package.json 注入成編譯期常數，UI 顯示用。
export default defineConfig({
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
  },
});
