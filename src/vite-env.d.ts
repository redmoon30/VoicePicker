/// <reference types="vite/client" />

// 由 vite.config.ts 的 define 注入（來源：package.json version）
declare const __APP_VERSION__: string;

// WaveSurfer Regions plugin 的 ESM 進入點沒有附帶型別，從已附型別的路徑借型別。
declare module 'wavesurfer.js/dist/plugins/regions.esm.js' {
  import RegionsPlugin from 'wavesurfer.js/dist/plugins/regions';
  export default RegionsPlugin;
}
