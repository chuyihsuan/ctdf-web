# 文件與計畫書對照檢查報告

Project: 中華民國競技飛鏢總會官方網站  
Check date: 2026-07-11  
Plan baseline: `競技飛鏢總會_網站建置計畫書_v11_AB代管方案比較版.docx`

## 1. Checked Documents

| Document | Result |
|---|---|
| `README.md` | 符合，已補齊與 v11 Sitemap 對應的路由清單。 |
| `docs/FRD.md` | 符合，已標明五個開發工作流與 v11 四階段時程的對應關係。 |
| `docs/PRD.md` | 符合，已標明五個產品交付階段與 v11 四階段時程的對應關係。 |
| `docs/SRD.md` | 符合，已標明五個系統工作流與 v11 四階段時程的對應關係，並補齊主要路由。 |
| `CTDF_網站建置_Action_Item追蹤表_202610中旬版.xlsx` | 符合，已將舊版 8 月上線與 v9 對外版本文字修正為 2026 年 10 月中與 v11。 |

## 2. Scope Alignment

| v11 Plan Area | README | FRD | PRD | SRD | Result |
|---|---|---|---|---|---|
| 10 大功能模組 / 31 項前台功能 | Covered | Covered | Covered | Covered | 符合 |
| MVP / 第二階段功能註記 | Covered | Covered | Covered | Covered | 符合 |
| 後台角色、權限、操作紀錄 | Covered | Covered | Covered | Covered | 符合 |
| Next.js / Vercel / Supabase 架構 | Covered | Covered | Covered | Covered | 符合 |
| `ctdf.org.tw` 主網域與 DNS 需求 | Covered | Covered | Covered | Covered | 符合 |
| A/B 代管方案與年度費用 | Covered | Not required | Covered | Covered | 符合 |
| Mobile First 與驗收尺寸 | Covered | Covered | Covered | Covered | 符合 |
| WDF / 國際資料 | Covered | Covered | Covered | Schema-ready | 符合 |
| 全民運推動專區 | Covered | Covered | Covered | Covered | 符合 |
| 資安、備份、RLS、個資告知 | Covered | Covered | Covered | Covered | 符合 |

## 3. Timeline Alignment

The v11 plan uses four calendar stages:

| v11 Stage | Time | Main Focus |
|---|---|---|
| Stage 1 | 2026 年 7 月 | 決策、網域、設計方向、技術架構、資料庫與後台基礎。 |
| Stage 2 | 2026 年 8 月 | 會員、靜態頁、文件、新聞 CMS、賽事資料與核心前後台。 |
| Stage 3 | 2026 年 9 月 | 排名、選手資料庫、WDF / 國際資料、全民運資料、RWD 測試。 |
| Stage 4 | 2026 年 10 月上旬至中旬 | SEO、效能、資安、備份、DNS、教育訓練與正式上線。 |

FRD / PRD / SRD use five development workstreams for implementation tracking:

| Workstream | Related v11 Stage |
|---|---|
| Development environment and demo | Stage 1 |
| Frontend MVP | Stage 1-2 |
| Supabase database | Stage 1-3 |
| Admin management | Stage 1-2 |
| Production readiness | Stage 4 |

Result: 符合。五個工作流是開發管理切分，並非取代 v11 的四階段時程。

## 4. Corrections Made

| Item | Before | After |
|---|---|---|
| README route list | 部分路由僅列摘要。 | 補齊計畫書 Sitemap 中主要前台、會員、後台與第二階段路由。 |
| FRD / PRD / SRD phase wording | 可能讓人誤解為五個時程階段。 | 改為五個 workstreams / delivery phases，並加入與 v11 四階段時程的對照表。 |
| Action Item AI-020 | 仍有「2026 年 8 月」舊版上線目標文字。 | 改為確認「2026 年 10 月中」與四階段開發節奏。 |
| Action Item AI-023 | 仍有「v9 是否作為對外審閱版本」文字。 | 改為確認 v11 是否作為目前對外審閱版本。 |

## 5. Remaining Decisions

These are not conflicts, but should remain open decisions:

- A 案或 B 案正式採用。
- 若採 B 案，Vercel Pro 與 Supabase Pro 的升級時間點。
- DNS 管理者、備援 Email、付款責任與交接方式。
- 會員個資、選手公開欄位、照片授權與隱私權文字。
- 排名規則、匯入格式與更新責任。

## 6. Conclusion

目前 README、FRD、PRD、SRD、Action Item 追蹤表與 v11 計畫書已完成一致性檢查。主要需求範圍、時程原則、技術架構、網域規劃、A/B 代管方案、資安要求與正式上線目標皆已對齊。
