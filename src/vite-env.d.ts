/// <reference types="vite/client" />

// WaveSurfer Regions plugin 的 ESM 進入點沒有附帶型別，從已附型別的路徑借型別。
declare module 'wavesurfer.js/dist/plugins/regions.esm.js' {
  import RegionsPlugin from 'wavesurfer.js/dist/plugins/regions';
  export default RegionsPlugin;
}
