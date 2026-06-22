# VoicePicker — 迭代評審記錄

> 記錄每次重大版本的功能評估、Bug 清單、設計反思，供下一輪開發決策用。

---

## v0.7.0 評審｜2026-06-19

**開發者：** Hermes Agent（DeepSeek-chat）  
**分支：** `hermes/v0.7`  
**評審者：** Claude Code（Redic）

### 新功能清單

| 功能 | 說明 |
|------|------|
| 0-5 星評分 | Comment 型別加 `rating: number` 欄位；composer 加星星 UI；留言卡顯示已評星數 |
| Shift+1~5 快速評分 | 播放中按 Shift+數字鍵，在當前 timecode 快速打分 |
| 角色 Dashboard（role view） | 新 ViewMode `'role'`，以角色名單分組顯示所有跨檔留言，含分類 tab 快速跳轉 |
| 就地播放（角色視圖） | Dashboard 中直接播放不切換單檔，`▶/⏸` 按鈕同步 |
| 匯出報告 PDF | 生成評分摘要表 + 留言詳情 HTML，呼叫 `window.print()` |

---

### Bug 清單

#### 🔴 Bug 1 — 角色 Dashboard 分類 tab 錨點失效（`src/main.ts:675`）

```typescript
// 錯誤：同一分類所有角色都用相同 groupId
renderGroup(ch.name, ROLE_COLORS[ch.role], ..., 'role-group-' + cat.role);

// 應為：每個角色獨立 ID
renderGroup(ch.name, ROLE_COLORS[ch.role], ..., 'role-group-' + ch.name);
```

**影響：** Tab 按鈕 `scrollIntoView` 只找到第一個重複 ID 的 div，無法跳至個別角色區塊。分類 tab 功能完全失效。

---

#### 🔴 Bug 2 — Shift+1~5 快速評分會建立空留言（`src/main.ts:1137`）

```typescript
// 當前時間點無留言時，直接 push 空文字留言
comments.push({ ..., text: '', rating });
```

**影響：**
- 大量 `text: ''` 空留言污染資料
- W/S 跳 marker 時跳至空白點，UX 混亂
- 備份檔案會保留這些空留言

**建議修法：** 快速評分不建立新留言；若需建立，至少補一個預設文字（如 `'[評分]'`）或彈出 composer。

---

#### 🟡 Bug 3 — Shift+1~5 不要求填寫 author（`src/main.ts:1126`）

快速評分路徑跳過 `author` 檢查，可能存入 `author: ''` 的留言。

**建議修法：** 在快速評分 handler 開頭加入 `if (!author) { openNameModal(...); return; }`。

---

#### 🟡 Bug 4 — PDF 匯出使用 `window.open` + `document.write`（`src/main.ts:1209`）

Chrome 在某些安全設定下會 block popup（無互動觸發）。這是 internal tool 可接受的風險，但需留意。

**建議修法（低優先）：** 改用 `Blob` URL + `<a download>` 觸發下載，或加 `noopener` 屬性規避 popup 阻擋。

---

### 值得保留的好實作

**`normalizeComment` / `normalizeReply`（`src/storage.ts`）**
向下相容處理很紮實：`character: string | null → string[]`、缺欄位補預設值、`replies` 陣列防呆。此模式在未來格式更新時繼續沿用。

**`mergeComments` 去重邏輯（`src/main.ts:204`）**
`Map<id, Comment>` 合併、後者覆蓋同 id，正確處理 import 時不覆蓋本地留言。繼續保留。

**`navChip` 2D 鍵盤導覽（`src/main.ts:861`）**
用 `getBoundingClientRect` 做方向感知導覽，正確支援多行 wrap 的 chip 排列。比單純 index±1 更健壯，繼續保留。

---

### 下一輪迭代優先順序

| 優先 | 項目 | 說明 |
|------|------|------|
| P0 | 修 Bug 1 | groupId 改為 `ch.name`，tab 功能才可用 |
| P0 | 修 Bug 2 | 快速評分不建立空留言 |
| P1 | 修 Bug 3 | 快速評分要求 author |
| P2 | 角色視圖鍵盤操作完整化 | 目前 role view 不能新增留言（C/X 無效） |
| P2 | PDF 改 Blob 下載 | 規避 popup 阻擋 |
| P3 | 評分統計視圖 | Dashboard 加上整體評分分布圖表 |

---

### 版本說明

- `master` — Claude Code 維護的主線（目前 v0.6.0）
- `hermes/v0.7` — Hermes Agent（DeepSeek）提交的版本，已評審

v0.7 功能方向正確，評分 + Dashboard 是核心需求，但 Bug 1 和 Bug 2 阻礙正式 merge。修完後可在 master 上直接繼續迭代。

---

## v0.8.0 評審｜2026-06-22

**開發者：** Claude Code（Sonnet 4.6）
**分支：** `master`

### 新功能與修正清單

#### UX 修正

| 項目 | 說明 |
|------|------|
| 焦點跳轉 Bug 修正 | 多標籤留言（同時掛泰泰＋吵鬧菇）在角色 Dashboard 點播放，焦點框跳到第一個群組的問題。根因：`roleCards.indexOf(c)` 對同一 Comment 物件找到第一次出現位置。修法：播放鈕與 Space 鍵傳入 `ridx`（卡片在 roleCards 中的確切索引），不再用 indexOf。 |
| Dashboard 按鈕位置 | 從右欄底部 `.panel-foot` 移到頂部，與「留言」標題並排；移除 `ghost` class 改為藍色填充，更醒目 |
| 未指定標籤位置 | 原本在「配角」快捷列下方另起一行，改為附在配角那行末尾 |
| 留言排序 | 角色 Dashboard 各群組改為分數高到低 → 同分依音檔名 → timecode |
| 角色重命名 | 編輯名單中角色名稱雙擊 → input → Enter/blur 確認，同步更新所有 comments 的 character 陣列 |
| 回覆功能隱藏 | `.creplies` / `.creply-input` CSS `display:none`，功能保留、UI 隱藏 |

#### 功能改版

| 項目 | 說明 |
|------|------|
| PDF 評語報告 | 原「評分摘要」改為「評語報告」：依角色 Dashboard 分組，每則留言顯示 timecode、音檔名、評語、評分星星、留言者 |
| 唯讀分享版匯出 | 新增「匯出分享版」按鈕，生成自包含 HTML。同事用 Chrome/Edge 開啟，選擇 NAS 同一音檔資料夾即可試聽；無法刪除、編輯、打分數 |

#### 架構

| 項目 | 說明 |
|------|------|
| `viewer-template.html` | 新增唯讀 viewer 的 HTML 範本，由 Vite `?raw` import 嵌入打包 |
| `generateShareHTML()` | 將 comments + characters + roleColors 序列化嵌入 viewer，safe-embed 防 XSS |
| GitHub Pages 部署 | 設定 `vite.config.ts` conditional base + `.github/workflows/deploy.yml` 自動部署，URL：`https://redmoon30.github.io/VoicePicker/` |

### 下一輪迭代優先順序

| 優先 | 項目 | 說明 |
|------|------|------|
| P0 | 輪詢協作（v0.8 進行中）| 每 30 秒讀 voicepicker.json 並 merge，讓多人可非同步協作 |
| P1 | 恢復回覆 UI | 待輪詢穩定後，css `display:none` 改回來 |
| P2 | 評分統計視圖 | Dashboard 加整體評分分布 |
