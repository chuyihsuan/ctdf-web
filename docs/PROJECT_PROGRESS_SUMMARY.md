# 專案開發進度整理

專案：中華民國競技飛鏢總會官方網站  
整理日期：2026-08-01  
目前計畫基準：`競技飛鏢總會_網站建置計畫書_v11_AB代管方案比較版.docx`  
GitHub repository：`chuyihsuan/ctdf-web`  
目前 Git 最新 commit：`62269b2 Build full static demo sitemap`

## 1. 專案目標

本專案目標為建置中華民國競技飛鏢總會（CTDF）官方網站，作為公告、賽事、排名、選手資料、會員服務、文件下載、反禁藥資訊、全民運推動與後台管理的統一數位平台。

網站需同時支援硬式飛鏢與電子飛鏢，並以 Mobile First 方式設計，正式上線目標為 2026 年 10 月中。

## 2. 已完成事項

### 2.1 計畫書與時程

- 已讀取並整理原建置計畫書與 Action Item 追蹤表。
- 已依總會要求，將原先較緊的網站建置時程調整至 2026 年 10 月中。
- 已產出 `v10_202610中旬版` 計畫書與對應 Action Item 追蹤表。
- 已產出 `v11_AB代管方案比較版` 計畫書，納入：
  - 已申請主網域 `ctdf.org.tw`
  - A/B 代管方案比較
  - 年度費用估算
  - DNS 適配分析
  - 每一版計畫書新增 / 變更 / 刪除內容說明

### 2.2 代管方案與網域決策

- 已確認目前主網域為 `ctdf.org.tw`。
- 已分析 A/B 兩案皆可適配該網域。
- A 案為台灣固網 / 台灣大哥大運算雲，較符合台灣固網機房偏好，但維運成本與責任較高。
- B 案為 Vercel + Supabase，低維運、開發速度快，適合先做 demo 與後續正式上線。
- 已確認 B 案關鍵條件為：網域管理者需可設定 Vercel 要求的 DNS records。
- 已確認 B 案可先使用 Vercel Free 建立 demo，Supabase Free 可先用於開發測試。
- 正式營運建議狀態為 Vercel Pro + Supabase Pro。

### 2.3 GitHub 專案與文件

- 已建立 GitHub 專案資料夾 `ctdf-web-github`。
- 已更新 `README.md`，內容包含：
  - 專案目標
  - MVP 與第二階段範圍
  - 技術架構
  - A/B 代管方案
  - 網域規劃
  - 路由建議
  - 資料表初步方向
  - 部署與安全原則
- 已撰寫並更新為繁體中文：
  - `docs/FRD.md`
  - `docs/PRD.md`
  - `docs/SRD.md`
- 已新增文件對照檢查：
  - `docs/PLAN_ALIGNMENT_CHECK.md`
- 已新增第一階段 demo 交付說明：
  - `docs/PHASE_1_DEMO.md`

### 2.4 文件與計畫書比對

- 已比對 README、FRD、PRD、SRD、Action Item 追蹤表與 v11 計畫書。
- 已修正 README 路由清單，補齊計畫書 Sitemap 主要前台、會員、後台與第二階段路由。
- 已修正 FRD / PRD / SRD 階段文字，避免與 v11 四階段時程混淆。
- 已修正 Action Item 追蹤表中 AI-020、AI-023 殘留的舊版 8 月上線 / v9 對外版本文字。

### 2.5 靜態 Demo

- 已建立靜態首頁 `index.html`。
- 已建立完整靜態 sitemap demo，包含主要公開頁、會員頁與後台示意頁。
- 已加入公開資料版 demo 內容，包含 WDF / 國際、師生盃、隊際聯賽、媒體報導、文件下載與全民運推動等資料線索。
- 已新增 `docs/DEMO_REAL_DATA_NOTES.md`，說明 demo 實際資料使用原則與待確認事項。
- 已建立 `DEMO_SITEMAP.txt`，列出目前 demo 路由。
- 已建立 `vercel.json`，支援 Vercel 靜態部署與基本安全 header。
- 已建立 `assets/demo.css` 與各路由資料夾下的 `index.html`。
- 已確認第一階段 demo 不需要 Supabase 環境變數。

### 2.6 GitHub 與 Vercel

- 已完成 GitHub commit 與 push。
- GitHub 目前最新 commit：
  - `62269b2 Build full static demo sitemap`
- 曾發生 GitHub push 驗證與 fetch-first 問題，已透過瀏覽器登入、rebase、解衝突後完成推送。
- Vercel 已成功部署 demo。
- Vercel 畫面已顯示部署完成，建議目前先使用 `*.vercel.app` demo 網址審閱，不急著綁定正式網域。

## 3. 目前專案檔案狀態

### 3.1 計畫與管理文件

- `建置計畫書/競技飛鏢總會_網站建置計畫書_v11_AB代管方案比較版.docx`
- `建置計畫書/競技飛鏢總會_網站建置計畫書_v11_AB代管方案比較版.pdf`
- `工作項目追蹤表/CTDF_網站建置_Action_Item追蹤表_202610中旬版.xlsx`

### 3.2 GitHub 專案核心文件

- `ctdf-web-github/README.md`
- `ctdf-web-github/docs/FRD.md`
- `ctdf-web-github/docs/PRD.md`
- `ctdf-web-github/docs/SRD.md`
- `ctdf-web-github/docs/PLAN_ALIGNMENT_CHECK.md`
- `ctdf-web-github/docs/PHASE_1_DEMO.md`
- `ctdf-web-github/docs/DEMO_REAL_DATA_NOTES.md`
- `ctdf-web-github/docs/PROJECT_PROGRESS_SUMMARY.md`

### 3.3 Demo 網站

- `ctdf-web-github/index.html`
- `ctdf-web-github/DEMO_SITEMAP.txt`
- `ctdf-web-github/vercel.json`
- `ctdf-web-github/assets/demo.css`
- `ctdf-web-github/news/`
- `ctdf-web-github/events/`
- `ctdf-web-github/rankings/`
- `ctdf-web-github/players/`
- `ctdf-web-github/about/`
- `ctdf-web-github/downloads/`
- `ctdf-web-github/fairplay/`
- `ctdf-web-github/media/`
- `ctdf-web-github/member/`
- `ctdf-web-github/admin/`

## 4. 重要決策紀錄

| 主題 | 目前結論 |
|---|---|
| 正式上線目標 | 2026 年 10 月中 |
| 主網域 | `ctdf.org.tw` |
| Demo 方案 | Vercel Free 可先使用 |
| 正式 B 案 | Vercel Pro + Supabase Pro |
| Supabase 開發期 | 可先用 Free，正式會員個資上線前再升級 |
| DNS | 網域管理者需可設定 A / CNAME / TXT records |
| 網域密碼與敏感資料 | 不應放入 README、GitHub 或公開文件 |
| 文件語言 | FRD / PRD / SRD 已改為繁體中文 |

## 5. 尚待決策與確認事項

- 最終正式代管採 A 案或 B 案。
- 若採 B 案，Vercel Pro 與 Supabase Pro 的升級時間點。
- 正式 Vercel、Supabase 帳號是否由總會信箱建立。
- DNS 管理者、備援 Email 與付款責任。
- 會員個資欄位、選手公開欄位與隱私權文字。
- 排名規則、匯入格式與更新責任。
- 照片、影片、媒體素材的授權與肖像權確認。
- Vercel demo 網址需記錄並提供給總會審閱。

## 6. 目前 Git 狀態

截至本整理時，`ctdf-web-github` 的 `main` 與 `origin/main` 已同步於：

```text
62269b2 Build full static demo sitemap
```

目前本地尚有未追蹤的 OpenSpec / Codex skill 相關資料夾：

```text
.codex/
openspec/
```

這些看起來是規格管理或 Codex 輔助資料，尚未納入 Git 追蹤。是否要整理後提交，需另行決定。

## 7. 建議下一步

### 7.1 立即下一步

1. 從 Vercel Dashboard 取得 demo 網址。
2. 開啟 demo 網站，檢查首頁與 sitemap 各路由是否可正常瀏覽。
3. 檢查公開資料版 demo 的文字是否適合作為對外官網方向。
4. 將 demo 網址提供給會長與總會窗口審閱。
5. 收集首頁視覺、資訊架構、MVP 範圍、路由命名與資料正確性意見。

### 7.2 第一階段收尾

1. 記錄 Vercel demo 網址於 README 或 `docs/PHASE_1_DEMO.md`。
2. 確認是否要把 `docs/PROJECT_PROGRESS_SUMMARY.md` 提交到 GitHub。
3. 決定 `.codex/` 與 `openspec/` 是否保留於本地、加入 `.gitignore`，或正式提交。

### 7.3 第二階段開發方向

1. 將靜態 demo 逐步轉為 Next.js 專案。
2. 建立 Supabase 開發用 project。
3. 先建立核心資料表：
   - `news`
   - `events`
   - `event_results`
   - `rankings`
   - `players`
   - `members`
   - `profiles`
   - `documents`
   - `feature_flags`
   - `admin_roles`
   - `admin_permissions`
   - `audit_logs`
4. 先做新聞、賽事、文件下載與排名資料的資料化。
5. 再接會員登入與後台管理。
