# VoicePicker

聲音版 SyncSketch — 配音員試音檔審閱工具。

## 是什麼

把一整包試音檔丟進去，用鍵盤快速試聽、在 timecode 上記 feedback、掛 WTP 角色標籤，匯出可交付的標註包與 comment PDF。

## 技術

純前端 Web App：Vite + TypeScript + WaveSurfer.js v7。檔案存取走 Chrome File System Access API（拖入 NAS 資料夾），無後端、不上雲。

## 狀態

Planning — P0 待啟動。開發紀錄見 LAWA wiki `Active_Tasks/有時限/VoicePicker/`。

## 鍵盤

- Space：播放/暫停
- Tab：單檔 / Grid 切換
- 單檔：W/S 跳上下標註點，A/D 後退/前進 5 秒
- Grid：方向鍵切換檔案
- C：在當前秒數寫 comment
