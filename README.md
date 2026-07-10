# 中華民國競技飛鏢總會官方網站

本專案為中華民國競技飛鏢總會（Chinese Taipei Dart Federation, CTDF）官方網站建置專案，目標是建立一個可長期維護的數位服務平台，整合硬式飛鏢與電子飛鏢的公告、賽事、排名、選手資料、會員服務、文件下載與後台管理。

目前規劃版本依據：`競技飛鏢總會_網站建置計畫書_v11_AB代管方案比較版.docx`。

## 專案目標

- 建立總會官方品牌形象與對外資訊窗口。
- 提供會員、選手、家長與一般民眾查詢公告、賽事、排名與文件。
- 對接 WDF 國際資訊需求，整理總會沿革、國際交流與代表隊資料。
- 建立後台 CMS，讓秘書處與授權管理者可維護新聞、賽事、選手、排名、文件與會員資料。
- 支援硬式飛鏢與電子飛鏢雙項目，以單一資料庫搭配項目標籤管理。
- 採 Mobile First，自手機體驗開始設計，兼顧平板與桌機。

## 目前狀態

此 repository 目前可作為網站 demo / 設計審閱用途。現階段可先用 GitHub Pages 或 Vercel Free 提供預覽連結，供會長與總會審閱視覺方向、資訊架構與首頁內容優先順序。

正式開發時，建議轉為 Next.js 專案，並依計畫書採用 Vercel + Supabase 作為低維運優先方案。

## 功能範圍

### MVP 建議啟用

- 首頁：置頂公告、最新消息、近期賽事、快速連結。
- 新聞公告：列表、詳細頁、分類標籤、置頂公告、後台 CMS。
- 賽事資訊：賽事行事曆、賽事列表、賽事詳細頁、成績公告。
- 排名成績：選手積分排名、青少年排名。
- 選手資料庫：選手列表、選手個人頁、搜尋。
- 會員系統：註冊、登入、個人資料、會員審核管理。
- 關於總會：簡介、組織架構、章程規則、聯絡我們、隱私權政策。
- 文件下載：申請表格、競賽規程。
- 反禁藥 / 公平競技：政策聲明與外部教育資源連結。
- 後台管理：管理員登入、角色權限、功能開關、操作紀錄、內容更新。

### 第二階段候選

- 歷史成績查詢。
- 分區排名。
- 會費繳納狀態。
- 媒體中心：活動相簿、影片專區、媒體報導。
- 年報 / 大會手冊。
- 全民運推動專區與佐證資料管理。

## 建議技術架構

| 層級 | 建議技術 | 用途 |
|---|---|---|
| 前端 / 後台 | Next.js / React | 官方網站、會員專區、後台管理 |
| 部署 | Vercel | CI/CD、Preview、HTTPS、CDN、正式部署 |
| 資料庫 | Supabase PostgreSQL | 公告、賽事、排名、選手、會員、權限資料 |
| 身分驗證 | Supabase Auth | 會員登入、管理員登入、密碼重設 |
| 檔案儲存 | Supabase Storage | 文件、圖片、附件 |
| 影片 | YouTube | 賽事影片、教學影片、精華影片嵌入 |
| DNS / 防護 | 既有 DNS 或 Cloudflare | DNS、SSL、DNSSEC、轉址與防護 |

## 代管方案

### A 案：台灣固網 / 台灣大哥大運算雲

符合「台灣固網機房」偏好的合規穩健方案。網站與資料庫可部署於 Linux VM，正式架構可拆為網站 VM 與資料庫 VM。

年度成本粗估：

- 單 VM 正式 MVP：約 NT$35,000-45,000。
- 雙 VM 較正式架構：約 NT$55,000-70,000+。

主要優點是機房要求較容易對齊；主要代價是維運責任較高，需要自行管理 Linux、資料庫、備份、更新與監控。

### B 案：Vercel + Supabase

低維運、開發效率高，延續計畫書主要技術方向。Vercel 負責網站部署，Supabase 負責 PostgreSQL、Auth、Storage 與權限控管。

年度成本粗估：

- Vercel Pro：約 US$240 / 年，約 NT$7,680。
- Supabase Pro：約 US$300 / 年，約 NT$9,600。
- 合計：約 NT$17,000-20,000 / 年，不含超額流量、進階備份或額外儲存。

建議階段：

- 開發測試：Vercel Free + Supabase Free。
- 試營運：Vercel Pro + Supabase Free。
- 正式營運：Vercel Pro + Supabase Pro。

## 網域規劃

主網域已規劃並申請：

```text
ctdf.org.tw
```

A/B 兩案皆可使用此網域。

B 案若採 Vercel，DNS 需由網域管理者設定：

- `ctdf.org.tw`：A record，指向 Vercel 指定 IP。
- `www.ctdf.org.tw`：CNAME，指向 Vercel 指定目標。
- TXT record：若 Vercel 要求網域驗證時使用。

正式操作前應確認：

- 誰保管網域帳號。
- 誰能修改 DNS。
- 是否有備用管理 Email。
- 是否已將網域密碼移出 Excel，改用密碼管理工具或指定保管人。

## 預計時程

| 階段 | 時間 | 重點 |
|---|---|---|
| 第一階段 | 2026 年 7 月 | 主網域、技術方案、設計方向、資料庫 Schema、後台基礎 |
| 第二階段 | 2026 年 8 月 | 會員、靜態頁、文件下載、新聞 CMS、賽事資料 |
| 第三階段 | 2026 年 9 月 | 排名、選手資料庫、WDF / 國際資料、全民運推動資料、RWD 測試 |
| 第四階段 | 2026 年 10 月上旬至中旬 | SEO、效能、資安、備份、DNS 切換、教育訓練、正式上線 |

目標正式上線時間：2026 年 10 月中。

## 建議路由

```text
/                         首頁
/news                     新聞公告
/events                   賽事資訊
/events/calendar          賽事行事曆
/events/list              賽事列表
/events/results           成績公告
/rankings                 排名成績
/rankings/main            選手積分排名
/rankings/youth           青少年排名
/rankings/history         歷史成績查詢（第二階段）
/rankings/region          分區排名（第二階段）
/players                  選手資料庫
/about                    關於總會
/about/organization       組織架構
/about/rules              章程規則
/about/contact            聯絡我們
/about/privacy            隱私權政策
/about/citizens-sports-games 全民運推動專區（第二階段）
/about/development        推廣成果頁（第二階段）
/downloads                文件下載
/downloads/forms          申請表格下載
/downloads/rules          競賽規程下載
/downloads/annual         年報 / 大會手冊（第二階段）
/downloads/reports        成果報告下載（第二階段）
/fairplay                 反禁藥 / 公平競技
/media/photos             活動相簿（第二階段）
/media/videos             影片專區（第二階段）
/media/press              媒體報導（第二階段）
/member/login             會員登入 / 註冊
/member/profile           會員資料
/member/fee               會費繳納狀態（第二階段）
/admin                    後台首頁
/admin/news               新聞公告管理
/admin/pages              靜態頁面管理
/admin/events             賽事管理
/admin/rankings           排名管理
/admin/players            選手管理
/admin/members            會員管理
/admin/downloads          文件管理
/admin/media              媒體管理（第二階段）
/admin/citizens-sports-games 全民運推動資料管理（第二階段）
/admin/settings/features  功能啟用設定
/admin/settings/roles     角色權限設定
/admin/settings/admins    管理員帳號管理
/admin/settings/site      網站基本設定
/admin/logs               操作紀錄
```

## 資料表初步方向

正式開發時可依下列概念建立 Supabase / PostgreSQL schema：

- `news`
- `events`
- `event_results`
- `rankings`
- `players`
- `members`
- `profiles`
- `documents`
- `media_items`
- `admin_roles`
- `admin_permissions`
- `feature_flags`
- `audit_logs`

所有涉及硬式 / 電子飛鏢的資料，建議使用 `type` 或類似欄位區分：

```text
hard
electronic
```

## 開發方式

正式轉為 Next.js 專案後，建議使用：

```bash
npm install
npm run dev
```

常見環境變數：

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

注意：`SUPABASE_SERVICE_ROLE_KEY` 不可暴露到前端，也不可提交到 GitHub。

## 部署方式

### Demo 階段

- 可使用 Vercel Free 或 GitHub Pages。
- 先提供 `*.vercel.app` 或 GitHub Pages 連結供審閱。
- 不放正式會員個資或敏感資料。

### 正式階段

- 建議使用 Vercel Pro。
- 若保存正式會員個資，建議 Supabase 升級 Pro。
- 綁定 `ctdf.org.tw` 與 `www.ctdf.org.tw`。
- 上線前完成 DNS、SSL、RLS、備份、操作紀錄與個資告知檢查。

## 資料與安全原則

- 會員個資需符合個資法與隱私權政策。
- 後台角色權限需分級，不應所有管理員都擁有最高權限。
- 重要操作需寫入 `audit_logs`。
- Supabase Row Level Security 必須在正式上線前完成設定與測試。
- 網域密碼、API key、Service Role key 不得放在 Excel、README 或公開 repository。
- 青少年照片、選手照片與活動照片需確認授權與肖像權。

## 相關文件

- `建置計畫書/競技飛鏢總會_網站建置計畫書_v11_AB代管方案比較版.docx`
- `工作項目追蹤表/CTDF_網站建置_Action_Item追蹤表_202610中旬版.xlsx`
- `網站內容素材庫/`

## 授權與保密

本專案文件與內容素材僅供中華民國競技飛鏢總會網站建置與內部審閱使用。未經授權，請勿對外流通含個資、帳號、密碼、申請資料或內部決策資訊的文件。
