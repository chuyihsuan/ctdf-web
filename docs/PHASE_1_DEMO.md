# Phase 1 Demo Delivery

本文件對應 FRD / PRD / SRD 的第一階段：Development Environment and Demo。

## 交付內容

| 項目 | 狀態 | 說明 |
|---|---|---|
| GitHub project structure | Done | 專案包含 `README.md`、`docs/FRD.md`、`docs/PRD.md`、`docs/SRD.md` 與靜態首頁。 |
| Static homepage demo | Done | `index.html` 可直接開啟，使用示意公告、示意賽事與示意排名。 |
| Full static sitemap demo | Done | 已依文件路由建立各資料夾與 demo 頁，首頁 Sitemap 可連至對應頁面。 |
| No sensitive data | Done | Demo 不含正式會員個資、真實選手個人資料、API key、密碼或 Service Role key。 |
| Mobile review | Done | 首頁採 responsive layout，支援手機導覽與主要審閱區塊。 |
| Vercel static deployment config | Done | `vercel.json` 提供靜態部署與基本安全 header。 |

## 本機預覽

可直接開啟：

```text
index.html
```

若需要用本機伺服器預覽，可在專案根目錄執行：

```bash
npx serve .
```

## Vercel Free 部署流程

1. 將 `ctdf-web-github` 專案推送到 GitHub repository。
2. 登入 Vercel，選擇 Import Git Repository。
3. Framework Preset 選擇 Other。
4. Build Command 保持空白。
5. Output Directory 保持空白或使用專案根目錄。
6. Deploy 後取得 `*.vercel.app` 預覽網址。

第一階段 demo 不需要 Supabase 環境變數。

## GitHub Pages 備用部署流程

1. 將專案推送到 GitHub。
2. Repository Settings > Pages。
3. Source 選擇 Deploy from a branch。
4. Branch 選擇 `main`，資料夾選擇 `/root`。
5. 儲存後等待 GitHub Pages 產生預覽網址。

## 審閱重點

- 首頁第一屏是否能清楚辨識 CTDF 官方身分。
- 公告、賽事、排名、文件下載、關於總會的優先順序是否符合總會需求。
- 首頁下方完整 Sitemap 的路由階層是否符合總會預期。
- 手機版是否容易閱讀與操作。
- 第二階段前台 MVP 的路由與內容模組是否需要調整。

## 第一階段驗收對照

| Requirement | Status |
|---|---|
| FRD-1.1 / SRD-1.1 Repository contains README, source files, and docs | Done |
| FRD-1.2 / PRD-1.1 Public demo can be deployed to Vercel Free or GitHub Pages | Ready |
| FRD-1.3 Static homepage demo with placeholder data | Done |
| FRD-1.4 / PRD-1.2 No real member personal data | Done |
| FRD-1.5 Deployment and review workflow documented | Done |
| PRD-1.4 Mobile review without horizontal scrolling | Ready for QA |
| SRD-1.5 No environment variables required for static demo | Done |

## Demo 路由產生方式

完整靜態路由由 `tools/generate-demo-pages.mjs` 產生。若調整 Sitemap 或頁面說明，可更新該檔後重新執行：

```bash
node tools/generate-demo-pages.mjs
```

產生結果包含：

- `assets/demo.css`
- 各路由資料夾下的 `index.html`
- `DEMO_SITEMAP.txt`
