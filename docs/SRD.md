# 系統需求文件（SRD）

專案：中華民國競技飛鏢總會官方網站  
版本：1.0  
依據計畫書：競技飛鏢總會_網站建置計畫書_v11_AB代管方案比較版  
目標上線時間：2026 年 10 月中

## 1. 系統概述

本網站規劃為現代化 Web 應用程式，包含前台公開頁面、會員功能與後台管理系統。

建議 B 案架構：

```text
使用者瀏覽器
  ↓
ctdf.org.tw / Vercel / Next.js
  ↓
Supabase API
  ↓
PostgreSQL + Auth + Storage + RLS
```

替代 A 案架構：

```text
使用者瀏覽器
  ↓
ctdf.org.tw
  ↓
台灣大哥大 / 台灣固網 VM
  ↓
Next.js + Node.js + PostgreSQL + Nginx
```

本 SRD 以建議 B 案為主要系統規格，並於必要處註明 A 案差異。

v11 計畫書以四個時程階段推進。本 SRD 以五個系統工作流整理需求，並對應至計畫書時程：

| SRD 工作流 | 對應 v11 計畫書時程 |
|---|---|
| 開發環境與展示網站 | 第一階段：7 月決策與基礎準備 |
| 前台 MVP | 第一至第二階段：7 月基礎建置、8 月核心前後台開發 |
| Supabase 資料庫 | 第一至第三階段：7 月 Schema、8 月核心資料、9 月內容與資料整備 |
| 後台管理 | 第一至第二階段：7 月後台基礎、8 月核心管理流程 |
| 正式上線準備 | 第四階段：10 月驗收、訓練、DNS 與正式上線 |

## 2. 技術架構

| 層級 | B 案需求 | 說明 |
|---|---|---|
| 前端框架 | Next.js / React | 建議使用 App Router。 |
| 樣式 | CSS Modules、Tailwind 或既有設計系統 | 必須支援 Mobile First 響應式版面。 |
| 網站代管 | Vercel | Demo 可用 Free；正式上線建議 Pro。 |
| 資料庫 | Supabase PostgreSQL | 開發可用 Free；正式會員資料上線前建議 Pro。 |
| 身分驗證 | Supabase Auth | 支援會員與管理員登入。 |
| 權限控管 | Supabase Row Level Security + 應用層角色檢查 | 正式上線前必要。 |
| 檔案儲存 | Supabase Storage | 文件與公開圖片。 |
| 影片 | YouTube embed | 不建議把大型影片存在 Supabase。 |
| DNS | 既有 DNS 管理者或 Cloudflare | 必須可設定 A、CNAME、TXT 紀錄。 |
| 版本控管 | GitHub | Vercel 從 GitHub 部署。 |

## 3. 工作流一：開發環境與展示網站

### 3.1 Repository 需求

| ID | 需求 | 驗收條件 |
|---|---|---|
| SRD-1.1 | Repository 需包含 README 與需求文件。 | `README.md`、`docs/FRD.md`、`docs/PRD.md`、`docs/SRD.md` 存在。 |
| SRD-1.2 | Repository 不得包含秘密資訊。 | 不得提交 API key、密碼、正式會員個資。 |
| SRD-1.3 | Demo 部署需能由 GitHub 接至 Vercel 或等效平台。 | push 後可觸發部署，或可手動匯入部署。 |

### 3.2 Vercel Demo 需求

| ID | 需求 | 驗收條件 |
|---|---|---|
| SRD-1.4 | Demo 階段可使用 Vercel Free。 | 可取得 Demo 網址。 |
| SRD-1.5 | 靜態 Demo 不應依賴 Supabase 環境變數。 | 沒有 Supabase key 也能部署。 |
| SRD-1.6 | Demo 使用示意資料。 | 不含正式會員個資。 |

### 3.3 本機開發需求

未來轉為 Next.js 後，建議使用：

```bash
npm install
npm run dev
```

預設本機網址：

```text
http://localhost:3000
```

## 4. 工作流二：前台 MVP

### 4.1 應用程式結構

建議 Next.js 路由結構：

```text
app/
  page.tsx
  news/
  events/
  rankings/
  players/
  about/
  downloads/
  fairplay/
  member/
  admin/
components/
lib/
styles/
```

### 4.2 路由需求

| 路由 | 需求 |
|---|---|
| `/` | 首頁 |
| `/news` | 新聞公告列表 |
| `/news/[slug]` | 新聞公告詳細頁 |
| `/events` | 賽事列表 |
| `/events/calendar` | 賽事行事曆 |
| `/events/[id]` 或 `/events/[slug]` | 賽事詳細頁 |
| `/events/results` | 成績公告 |
| `/rankings` | 排名總覽 |
| `/rankings/youth` | 青少年排名 |
| `/rankings/history` | 歷史成績查詢，第二階段功能 |
| `/rankings/region` | 分區排名，第二階段功能 |
| `/players` | 選手列表 / 搜尋 |
| `/players/[id]` | 選手個人頁 |
| `/about` | 總會簡介 |
| `/about/organization` | 組織架構 |
| `/about/rules` | 章程規則 |
| `/about/contact` | 聯絡我們 |
| `/about/privacy` | 隱私權政策 |
| `/downloads` | 文件下載 |
| `/downloads/forms` | 申請表格 |
| `/downloads/rules` | 競賽規程 |
| `/downloads/annual` | 年報 / 大會手冊，第二階段功能 |
| `/fairplay` | 反禁藥 / 公平競技 |
| `/member/login` | 會員登入 |
| `/member/profile` | 會員資料 |
| `/member/fee` | 會費繳納狀態，第二階段功能 |
| `/admin` | 後台儀表板 |
| `/admin/news` | 新聞公告管理 |
| `/admin/pages` | 靜態頁面管理 |
| `/admin/events` | 賽事管理 |
| `/admin/rankings` | 排名管理 |
| `/admin/players` | 選手管理 |
| `/admin/members` | 會員管理 |
| `/admin/downloads` | 文件管理 |
| `/admin/media` | 媒體管理，第二階段功能 |
| `/admin/settings/features` | 功能開關 |
| `/admin/settings/roles` | 角色權限設定 |
| `/admin/settings/admins` | 管理員帳號設定 |
| `/admin/settings/site` | 網站基本設定 |
| `/admin/logs` | 操作紀錄 |

### 4.3 響應式需求

目標測試寬度：

```text
360px, 390px, 430px, 768px, 1024px, 1280px, 1440px
```

必要行為：

- MVP 頁面不得出現非預期水平捲動。
- 排名與賽事表格於手機上需使用卡片式呈現或受控的水平容器。
- 觸控目標建議至少 44px。
- 手機導覽需可正常操作。

### 4.4 SEO 需求

每一類公開頁面需支援：

- 頁面標題
- 頁面描述
- Open Graph title
- Open Graph description
- Open Graph image（若有）
- Canonical URL

正式上線需提供：

- `sitemap.xml`
- `robots.txt`

## 5. 工作流三：Supabase 資料庫

### 5.1 環境變數

前端可公開使用的 Supabase 變數：

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

僅限伺服器端使用的變數：

```env
SUPABASE_SERVICE_ROLE_KEY=
```

規則：

- `SUPABASE_SERVICE_ROLE_KEY` 不得暴露於瀏覽器程式碼。
- 伺服器端金鑰不得提交至 GitHub。
- 正式與開發環境建議使用不同 Supabase project 與 key。

### 5.2 初始資料表

| 資料表 | 用途 | 公開讀取 | 後台寫入 |
|---|---|---:|---:|
| `news` | 公告與文章 | 僅已發布 | 是 |
| `events` | 賽事資料 | 僅已發布 | 是 |
| `event_results` | 成績與名次 | 僅已發布 | 是 |
| `rankings` | 排名資料 | 僅已發布 | 是 |
| `players` | 選手公開資料 | 僅已核准公開 | 是 |
| `profiles` | Auth 使用者個人資料 | 本人 / 私有 | 受控 |
| `members` | 會員管理資料 | 否 | 是 |
| `documents` | 下載文件 metadata | 僅已發布 | 是 |
| `media_items` | 照片、影片、媒體報導 | 僅已發布 | 是 |
| `feature_flags` | 功能啟用狀態 | 部分公開 | 超級管理員 |
| `admin_roles` | 後台角色 | 否 | 超級管理員 |
| `admin_permissions` | 權限設定 | 否 | 超級管理員 |
| `audit_logs` | 後台操作紀錄 | 否 | 系統寫入 |

### 5.3 共用欄位

可發布內容建議包含：

```text
id
title/name
slug
status
published_at
created_at
updated_at
created_by
updated_by
```

需要來源管理的內容建議包含：

```text
source_type
source_url
source_date
verified_status
usage_rights
publish_status
```

硬式 / 電子飛鏢分類：

```text
type = hard | electronic
```

### 5.4 Row Level Security

正式上線前必須啟用 RLS。

最低政策：

- 一般訪客只能讀取已發布且可公開的內容。
- 已登入會員只能讀取或更新自己的個人資料。
- 管理員依角色讀取後台資料。
- 管理員寫入需檢查權限。
- 會員私有資料不得經由公開 API 讀取。

### 5.5 Storage Buckets

| Bucket | 權限 | 用途 |
|---|---|---|
| `public-images` | 公開讀取 | 已授權公開圖片 |
| `documents` | 公開或受控讀取 | 表格、規程、報告 |
| `member-private` | 限制讀取 | 未來若需要保存敏感會員文件 |

正式儲存規則：

- 未確認授權圖片不得上傳公開。
- 青少年照片需特別注意授權與公開範圍。
- 大型影片應放置於 YouTube。

## 6. 工作流四：後台管理

### 6.1 後台存取

後台路由需受到保護：

```text
/admin/**
```

存取邏輯：

1. 使用者必須已登入。
2. 使用者必須具備管理員角色。
3. 使用者必須具備該模組與操作的權限。

### 6.2 角色

| 角色 | 權限 |
|---|---|
| 超級管理員 | 所有模組、角色、功能開關與網站設定 |
| 秘書處管理員 | 會員、文件、靜態頁、公告與聯絡資訊 |
| 賽事管理員 | 賽事、成績、排名與選手資料 |
| 內容編輯 | 新聞、媒體與文件下載 |
| 排名管理員 | 排名與成績紀錄 |
| 技術管理員 | 系統設定、備份 / 匯出與功能開關 |
| 只讀帳號 | 僅可查看後台資料 |

### 6.3 操作紀錄

系統需記錄：

- 新增
- 修改
- 刪除
- 發布
- 下架
- 封存
- 匯出
- 角色或權限變更

建議欄位：

```text
id
actor_user_id
actor_role
action
target_table
target_id
before_json
after_json
created_at
ip_address
user_agent
```

### 6.4 後台 UI 需求

- 資料表需視需要支援搜尋與篩選。
- 表單需顯示驗證錯誤。
- 刪除或重大操作需二次確認。
- 發布操作需顯示目前狀態。
- 匯出操作需權限控管。

## 7. 工作流五：正式上線準備

### 7.1 Vercel 需求

正式環境建議狀態：

- Vercel Team 由 CTDF 帳號擁有。
- Project 連接 GitHub repository。
- Production branch 設為 `main`。
- Pull Request 可產生 Preview deployment。
- Production 環境變數設定完成。
- 正式網域設定完成：

```text
ctdf.org.tw
www.ctdf.org.tw
```

### 7.2 Supabase 需求

正式環境建議狀態：

- Supabase Organization 由 CTDF 帳號擁有。
- 建立獨立 production project。
- RLS 已啟用並測試。
- 備份機制已確認。
- Storage policy 已確認。
- Service role key 僅存於 Vercel server-side environment variables。
- 至少兩位 CTDF 可控管理員帳號。

### 7.3 DNS 需求

DNS 管理者需可設定：

- 根網域 A record（若 Vercel 要求）。
- `www` 的 CNAME。
- Vercel 驗證用 TXT record（若需要）。
- 不可誤刪既有 MX 或 Email 相關紀錄。

### 7.4 資安需求

| 需求 | 正式環境標準 |
|---|---|
| HTTPS | 必要 |
| RLS | 必要 |
| 後台角色檢查 | 必要 |
| 機密管理 | 僅使用環境變數 |
| 備份 | 正式資料上線前必要 |
| 操作紀錄 | 後台重要操作必要 |
| 隱私權政策 | 會員註冊前必要 |
| 個資告知 | 蒐集個資前必要 |

### 7.5 升級觸發條件

當出現下列情況時，應由免費 / 測試階段升級至付費 / 正式階段：

- 正式網域已綁定。
- 正式後台作業開始。
- 儲存正式會員個資。
- 排名或成績成為正式公開紀錄。
- 儲存或資料庫接近免費額度限制。
- 總會需要穩定帳號歸屬、付款與支援。

B 案正式建議狀態：

```text
Vercel Pro + Supabase Pro
```

## 8. 非功能需求

### 8.1 效能

- 公開頁面需在手機上快速載入。
- 圖片需最佳化並延遲載入。
- 大型影片應由 YouTube 嵌入。
- 大量排名資料需避免完全依賴前端一次性渲染。

### 8.2 可用性

- Vercel 與 Supabase 提供基礎可用性。
- 關鍵內容不可只依賴單一管理員帳號。
- 正式會員資料上線前需建立匯出與備份流程。

### 8.3 可維護性

- 元件需可重用。
- 路由命名需與網站地圖一致。
- Schema 命名需清楚並可文件化。
- 後台流程需讓非技術總會使用者能日常操作。

### 8.4 隱私

- 僅蒐集必要會員資料。
- 選手公開欄位需明確定義並經同意或核准。
- 聯絡表單與註冊頁需顯示個資告知。
- 私有會員資料不得由公開 API 回傳。

## 9. 部署環境

| 環境 | 用途 | 建議設定 |
|---|---|---|
| Local | 開發者本機測試 | 本機 Next.js + 開發用 Supabase project |
| Preview | 利害關係人審閱 | Vercel Preview deployment |
| Staging | 上線前 QA | 可選用獨立 Vercel project / branch + staging Supabase |
| Production | 正式網站 | Vercel Pro + Supabase Pro |

## 10. 正式上線檢查表

- [ ] CTDF 可控 Vercel account / team 已建立。
- [ ] CTDF 可控 Supabase organization 已建立。
- [ ] GitHub repository 權限歸屬已確認。
- [ ] DNS 管理權限已確認。
- [ ] 根網域與 `www` 已設定。
- [ ] HTTPS 已啟用。
- [ ] Supabase RLS 已測試。
- [ ] 後台角色權限已測試。
- [ ] 備份流程已確認。
- [ ] 隱私權政策已核准。
- [ ] 會員資料蒐集告知已核准。
- [ ] 響應式 QA 已完成。
- [ ] 後台教育訓練已完成。
- [ ] 上線核准已記錄。
