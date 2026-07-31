import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const routes = [
  { path: "news", title: "最新公告", group: "公開資訊", status: "MVP", summary: "彙整總會公告、賽事通知、國際參賽消息與會務更新，讓訪客第一時間理解網站上線後的資訊樣貌。", items: ["公告列表", "公告詳情", "來源連結"] },
  { path: "news/demo-announcement", title: "公告詳情範例", group: "公開資訊", status: "MVP", summary: "示範單一公告頁面，包含公告日期、活動重點、報名資訊、附件與來源連結。", items: ["公告標題", "發布日期", "附件下載"] },
  { path: "events", title: "賽事資訊", group: "公開資訊", status: "MVP", summary: "集中呈現近期與歷年公開賽事、學校賽事、報名資訊與成果整理。", items: ["近期賽事", "報名資訊", "賽果入口"] },
  { path: "events/calendar", title: "賽事行事曆", group: "公開資訊", status: "MVP", summary: "以月份或清單方式查詢賽事日期，未來可串接後台資料庫與報名狀態。", items: ["月份切換", "賽事標籤", "報名截止"] },
  { path: "events/list", title: "賽事列表", group: "公開資訊", status: "MVP", summary: "依年度、組別、賽事類型篩選公開賽事，支援詳情頁與附件下載。", items: ["年度篩選", "學生組 / 公開組", "報名 / 成績"] },
  { path: "events/results", title: "賽事成績", group: "公開資訊", status: "MVP", summary: "放置賽事名次、組別成績與歷年紀錄，正式版可由後台匯入。", items: ["名次列表", "組別分類", "附件下載"] },
  { path: "events/demo-event", title: "賽事詳情範例", group: "公開資訊", status: "MVP", summary: "示範賽事詳情頁，包含日期、地點、報名截止、規程與聯絡方式。", items: ["賽事資訊", "報名期限", "規程附件"] },
  { path: "rankings", title: "排名成績", group: "公開資訊", status: "MVP", summary: "呈現國際賽事成果、學生組亮點與正式積分排名預留區。", items: ["排名摘要", "組別篩選", "歷史成績"] },
  { path: "rankings/main", title: "成人組排名", group: "公開資訊", status: "MVP", summary: "預留成人組積分排名，正式資料可依總會賽制與積分規則匯入。", items: ["年度積分", "組別", "更新時間"] },
  { path: "rankings/youth", title: "青少年排名", group: "公開資訊", status: "MVP", summary: "預留青少年排名與學校賽事成果，方便會長檢視未來網站架構。", items: ["青少年組", "學校賽事", "年度成績"] },
  { path: "rankings/history", title: "歷年成績查詢", group: "第二階段", status: "Later", summary: "正式版可建立歷年賽事與排名資料庫，Demo 先展示資料呈現方式。", items: ["歷年查詢", "賽事成績", "匯出資料"] },
  { path: "rankings/region", title: "縣市排名", group: "第二階段", status: "Later", summary: "預留縣市或區域排名，可支援地方協會與基層推廣成果呈現。", items: ["縣市篩選", "區域成績", "統計資料"] },
  { path: "players", title: "選手資料庫", group: "公開資訊", status: "MVP", summary: "示範選手資料呈現方式，正式版需與會員權限與個資規範一起設計。", items: ["選手列表", "組別篩選", "選手頁面"] },
  { path: "players/demo-player", title: "選手個人頁範例", group: "公開資訊", status: "MVP", summary: "示範選手個人頁，正式資料上線前不放置未授權個資。", items: ["基本資料", "排名紀錄", "賽事履歷"] },
  { path: "about", title: "關於總會", group: "公開資訊", status: "MVP", summary: "介紹總會定位、網站建置目的、國際接軌與全民運推動方向。", items: ["總會簡介", "組織架構", "聯絡資訊"] },
  { path: "about/organization", title: "組織架構", group: "公開資訊", status: "MVP", summary: "預留理監事、委員會、秘書處與工作小組介紹。", items: ["理監事", "委員會", "秘書處"] },
  { path: "about/rules", title: "章程與規章", group: "公開資訊", status: "MVP", summary: "集中管理章程、賽務規章、申訴辦法與其他治理文件。", items: ["章程", "賽務規章", "下載附件"] },
  { path: "about/contact", title: "聯絡我們", group: "公開資訊", status: "MVP", summary: "提供正式聯絡方式、會務信箱與詢問入口。", items: ["Email", "地址", "聯絡表單"] },
  { path: "about/privacy", title: "隱私權政策", group: "公開資訊", status: "MVP", summary: "說明資料蒐集、使用目的、會員資料保護與權利行使方式。", items: ["個資蒐集", "資料使用", "權利說明"] },
  { path: "about/citizens-sports-games", title: "全民運推動專區", group: "第二階段", status: "Later", summary: "說明全民運動會相關觀察與未來推動策略，避免誤稱飛鏢已為正式項目。", items: ["官方項目", "推動資料", "進度追蹤"] },
  { path: "about/development", title: "發展沿革", group: "第二階段", status: "Later", summary: "正式版可由總會提供沿革、重要里程碑與推廣成果。", items: ["發展年表", "推廣成果", "國際交流"] },
  { path: "downloads", title: "文件下載", group: "公開資訊", status: "MVP", summary: "提供規程、報名表、申請文件與公告附件下載。", items: ["報名表", "賽務規章", "年度文件"] },
  { path: "downloads/forms", title: "表單下載", group: "公開資訊", status: "MVP", summary: "整理會員、賽事與行政相關表單。", items: ["會員表單", "賽事表單", "行政表單"] },
  { path: "downloads/rules", title: "規章下載", group: "公開資訊", status: "MVP", summary: "集中放置賽制規程與相關辦法，方便公開查閱。", items: ["競賽規程", "報名辦法", "申訴規則"] },
  { path: "downloads/annual", title: "年度計畫 / 報告", group: "第二階段", status: "Later", summary: "預留年度計畫、成果報告與公開資訊下載。", items: ["年度計畫", "成果報告", "預算摘要"] },
  { path: "downloads/reports", title: "會務報告下載", group: "第二階段", status: "Later", summary: "預留會務、推廣、教育訓練與賽事統計報告。", items: ["會務報告", "推廣成果", "統計資料"] },
  { path: "fairplay", title: "公平競賽 / 反禁藥", group: "公開資訊", status: "MVP", summary: "整理公平競賽、反禁藥與運動員保護資訊。", items: ["教育資訊", "申訴管道", "重要連結"] },
  { path: "media/photos", title: "照片花絮", group: "第二階段", status: "Later", summary: "預留賽事照片與活動花絮，正式版需確認肖像權與授權。", items: ["照片相簿", "活動分類", "授權註記"] },
  { path: "media/videos", title: "影音專區", group: "第二階段", status: "Later", summary: "預留 YouTube、直播回放與宣傳影片入口。", items: ["YouTube", "賽事影片", "宣傳影片"] },
  { path: "media/press", title: "媒體報導", group: "第二階段", status: "Later", summary: "彙整媒體報導與國際參賽新聞，提升網站公信力。", items: ["媒體連結", "報導分類", "發布時間"] },
  { path: "member/login", title: "會員登入 / 註冊", group: "會員", status: "MVP", summary: "示範會員登入入口，正式版建議串接 Supabase Auth 與權限控管。", items: ["登入入口", "註冊入口", "資料保護"] },
  { path: "member/profile", title: "會員資料", group: "會員", status: "MVP", summary: "會員可維護基本資料、選手資料與報名紀錄。", items: ["基本資料", "選手資訊", "會員狀態"] },
  { path: "member/fee", title: "會費繳納", group: "第二階段", status: "Later", summary: "預留會費狀態與繳費紀錄，正式版再評估金流串接。", items: ["繳費狀態", "年度紀錄", "收據"] },
  { path: "admin", title: "後台管理", group: "後台", status: "MVP", summary: "示範管理介面入口，正式版需權限控管、操作紀錄與資料審核流程。", items: ["內容管理", "賽事管理", "權限設定"] },
  { path: "admin/news", title: "公告管理", group: "後台", status: "MVP", summary: "後台可新增、編輯、發布與下架公告。", items: ["新增公告", "草稿", "發布"] },
  { path: "admin/pages", title: "頁面管理", group: "後台", status: "MVP", summary: "管理關於總會、規章、聯絡資訊與固定頁。", items: ["頁面編輯", "版本草稿", "發布"] },
  { path: "admin/events", title: "賽事管理", group: "後台", status: "MVP", summary: "建立賽事資料、上傳規程、管理報名與賽果。", items: ["賽事資料", "報名期限", "成績"] },
  { path: "admin/rankings", title: "排名管理", group: "後台", status: "MVP", summary: "匯入排名資料、檢核欄位並發布更新。", items: ["匯入", "檢核", "發布"] },
  { path: "admin/players", title: "選手管理", group: "後台", status: "MVP", summary: "維護選手資料與公開欄位，避免未授權個資外流。", items: ["選手資料", "公開欄位", "組別"] },
  { path: "admin/members", title: "會員管理", group: "後台", status: "MVP", summary: "管理會員狀態、權限與資料審核。", items: ["會員審核", "角色", "匯出"] },
  { path: "admin/downloads", title: "文件管理", group: "後台", status: "MVP", summary: "上傳文件、管理版本、設定公開狀態與分類。", items: ["檔案上傳", "版本", "分類"] },
  { path: "admin/media", title: "媒體管理", group: "第二階段", status: "Later", summary: "預留照片、影片與媒體連結管理。", items: ["照片", "影片", "分類"] },
  { path: "admin/citizens-sports-games", title: "全民運推動管理", group: "第二階段", status: "Later", summary: "預留全民運相關資料與推動進度的後台維護功能。", items: ["推動紀錄", "官方資料", "報告"] },
  { path: "admin/settings/features", title: "功能開關設定", group: "後台", status: "MVP", summary: "透過功能開關控制尚未上線的模組，便於分階段開發。", items: ["功能狀態", "公開設定", "測試模式"] },
  { path: "admin/settings/roles", title: "角色權限設定", group: "後台", status: "MVP", summary: "管理管理員、編輯者與審核者的權限範圍。", items: ["角色", "權限", "審核"] },
  { path: "admin/settings/admins", title: "管理員帳號設定", group: "後台", status: "MVP", summary: "管理後台帳號、登入方式與操作紀錄。", items: ["帳號", "啟用狀態", "操作紀錄"] },
  { path: "admin/settings/site", title: "網站基本設定", group: "後台", status: "MVP", summary: "管理網站名稱、Logo、SEO metadata 與聯絡資訊。", items: ["Logo", "聯絡資訊", "SEO"] },
  { path: "admin/logs", title: "操作紀錄", group: "後台", status: "MVP", summary: "記錄後台重要操作，供稽核與問題追蹤使用。", items: ["操作時間", "操作人員", "異動內容"] }
];

const sources = {
  penghu114: "https://www.penghu.gov.tw/edu/home.jsp?act=view&dataserno=202602110004&id=94",
  hualien114: "https://news.hlc.edu.tw/index.php?id=125506&page=department",
  taichung113League: "https://www.tc.edu.tw/page/6ea0d0a0-c3e7-4485-9925-ac95271ad618/news-content?id=225671",
  bjps114: "https://www.bjps.tp.edu.tw/p/406-1000-2613%2Cr16.php",
  cnaWorldCup: "https://www.cna.com.tw/news/aspt/202509220180.aspx",
  cnaGold: "https://www.cna.com.tw/news/aspt/202509260296.aspx",
  citizensSports: "https://sport115.tycg.gov.tw/",
  facebook: "https://www.facebook.com/CTDFTW/?locale=zh_TW",
  readme: "/README.md",
  notes: "/docs/DEMO_REAL_DATA_NOTES.md",
  frd: "/docs/FRD.md",
  prd: "/docs/PRD.md",
  srd: "/docs/SRD.md"
};

const realDataByRoot = {
  news: [
    {
      title: "114學年師生盃全國各級學校飛鏢錦標賽公告",
      meta: "發布：2026-02-11 / 賽期：2026-03-14 至 2026-03-15",
      desc: "澎湖縣政府教育處轉知總會辦理師生盃，賽事地點為桃園市中壢國中活動中心，並提醒競賽規程與報名表可至總會 FB 下載。",
      source: sources.penghu114
    },
    {
      title: "台灣競技飛鏢代表隊首度參加 WDF 世界盃",
      meta: "中央社：2025-09-22 / 韓國 KINTEX 10A Hall",
      desc: "台灣代表隊首度登上 WDF 世界盃舞台，總會派出 8 名選手參賽，與包含台灣在內的 47 個國家同場競技。",
      source: sources.cnaWorldCup
    },
    {
      title: "蔡詠恩、楊奕晴於 WDF 世界盃 U18 女雙摘金",
      meta: "中央社：2025-09-26 / 國際賽事成果",
      desc: "Demo 首頁可用此作為國際成績亮點，呈現青少年培育、國際參賽與排名成績專區未來能承載的成果內容。",
      source: sources.cnaGold
    }
  ],
  events: [
    {
      title: "114學年師生盃全國各級學校飛鏢錦標賽",
      meta: "2026-03-14 至 2026-03-15 / 桃園市中壢國中活動中心",
      desc: "報名至 2026-03-02 截止，活動以學校為單位報名。Demo 可呈現報名期限、場地、規程附件與聯絡方式。",
      source: sources.hualien114
    },
    {
      title: "113學年度國民中學暨高級中學飛鏢隊際聯賽",
      meta: "2025-06-14 至 2025-06-15 / 學生隊際賽",
      desc: "臺中市政府教育局公告列有國中與高中學生聯賽規程、報名表與總會聯絡資訊，適合放在賽事列表與文件下載範例。",
      source: sources.taichung113League
    },
    {
      title: "114學年師生盃賽事規程摘要",
      meta: "2026-03-14 至 2026-03-15 / 臺北市學校公告轉知",
      desc: "公告內容清楚列出賽事目的、比賽日期、報名日期、比賽地點與參加單位，適合做為賽事詳情頁的 Demo 版型資料。",
      source: sources.bjps114
    }
  ],
  rankings: [
    {
      title: "U18 女子雙打：蔡詠恩、楊奕晴 WDF 世界盃金牌",
      meta: "2025-09-26 / WDF 世界盃飛鏢錦標賽",
      desc: "排名成績頁以此示範『國際賽事成果』卡片，可放置組別、選手、賽事、獎項與來源，正式版再串接總會核定成績。",
      source: sources.cnaGold
    },
    {
      title: "台灣代表隊首度參加 WDF 世界盃",
      meta: "2025-09-22 至 2025-09-28 / 韓國",
      desc: "中央社報導指出總會派出 8 名選手參賽，Demo 可呈現代表隊參賽紀錄、賽事層級與國際交流成果。",
      source: sources.cnaWorldCup
    },
    {
      title: "正式積分排名待總會提供核定資料",
      meta: "Demo 註記 / 未放置未授權個資",
      desc: "成人組、青少年組與縣市排名目前先以版型展示。正式版建議由總會提供核定排名檔或後台匯入資料，再對外發布。",
      source: sources.notes
    }
  ],
  about: [
    {
      title: "網站名稱與定位：Chinese Taipei Dart Federation",
      meta: "Facebook About / Logo 素材",
      desc: "Demo 採用中華民國競技飛鏢總會與 Chinese Taipei Dart Federation 作為網站識別，並使用粉專提供的 CTDF Logo 與封面視覺作為示範素材。",
      source: sources.facebook
    },
    {
      title: "國際接軌：WDF 世界盃參賽與青少年成果",
      meta: "2025 年公開新聞資料",
      desc: "關於總會頁可把國際參賽、代表隊出賽與青少年成果整理為重要里程碑，讓會長更直觀看到網站完成後的公信力呈現方式。",
      source: sources.cnaWorldCup
    },
    {
      title: "全民運推動：以官方項目清單為準",
      meta: "115年全民運官方網站 / 謹慎註記",
      desc: "115年全民運官方網站目前競賽資訊列示多項運動，Demo 以『推動觀察』呈現，不誤稱飛鏢已列為正式項目。",
      source: sources.citizensSports
    },
    {
      title: "聯絡資訊",
      meta: "Facebook About / Public contact info",
      desc: "地址：臺北市南港區松河街384號5樓；電話：+886 2 2732 1422；Email：ctdf0306@gmail.com；分類：Nonprofit organization。",
      source: sources.facebook
    }
  ],
  downloads: [
    {
      title: "賽事規程與報名表下載範例",
      meta: "學生聯賽與師生盃公告來源",
      desc: "正式版可把競賽規程、報名表、補充公告集中放在文件下載區，並在賽事頁交叉連結。",
      source: sources.taichung113League
    }
  ],
  fairplay: [
    {
      title: "公平競賽與反禁藥資料入口",
      meta: "MVP 文件規劃",
      desc: "Demo 先展示專區結構，正式版可補入運動部、WDF、WADA 等官方教育資源與總會規範。",
      source: sources.frd
    }
  ],
  media: [
    {
      title: "媒體報導可串接新聞來源",
      meta: "2025 國際參賽報導",
      desc: "媒體專區可彙整中央社等公開新聞，並以外部連結方式保留原始來源，避免複製全文造成授權疑慮。",
      source: sources.cnaWorldCup
    }
  ],
  players: [
    {
      title: "選手資料 Demo 採去識別化呈現",
      meta: "MVP 個資保護原則",
      desc: "正式版上線前，未取得授權的選手個資不放入公開頁。Demo 以賽事成果與代表隊資訊示範未來資料結構。",
      source: sources.frd
    }
  ],
  member: [
    {
      title: "會員系統規劃",
      meta: "SRD / Supabase Auth",
      desc: "正式版可使用 Supabase Auth 做會員登入與資料權限控管，Demo 先保留入口與流程示意。",
      source: sources.srd
    }
  ],
  admin: [
    {
      title: "後台管理規劃",
      meta: "PRD / SRD",
      desc: "後台需支援公告、賽事、排名、文件與權限管理，並保留操作紀錄供稽核與追蹤。",
      source: sources.prd
    }
  ]
};

const nav = [
  ["首頁", "/"],
  ["公告", "/news/"],
  ["賽事", "/events/"],
  ["排名", "/rankings/"],
  ["選手", "/players/"],
  ["下載", "/downloads/"],
  ["關於", "/about/"],
  ["後台", "/admin/"]
];

function htmlEscape(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function navHtml() {
  return nav.map(([label, href]) => `<a href="${href}">${label}</a>`).join("");
}

function footerHtml() {
  return `<footer class="footer">
    <div class="footer-inner">
      <b>中華民國競技飛鏢總會 CTDF</b>
      <span>地址：臺北市南港區松河街384號5樓</span>
      <span>電話：+886 2 2732 1422</span>
      <span>Email：<a href="mailto:ctdf0306@gmail.com">ctdf0306@gmail.com</a></span>
      <span class="footer-note">Demo 用途 / 正式上線前需由總會確認公開資料</span>
    </div>
  </footer>`;
}

function dataCards(items) {
  return items
    .map((item) => `<article class="data-card">
            <p class="data-meta">${htmlEscape(item.meta)}</p>
            <h3>${htmlEscape(item.title)}</h3>
            <p>${htmlEscape(item.desc)}</p>
            <a href="${htmlEscape(item.source)}" target="_blank" rel="noopener noreferrer">查看來源或對應文件</a>
          </article>`)
    .join("\n          ");
}

function pageHtml(route) {
  const siblings = routes.filter((item) => item.path.split("/")[0] === route.path.split("/")[0]);
  const root = route.path.split("/")[0];
  const realData = realDataByRoot[root] || [];
  const childLinks = siblings
    .map((item) => `<a class="link-card${item.path === route.path ? " current" : ""}" href="/${item.path}/"><b>/${item.path}</b><span>${htmlEscape(item.title)}</span></a>`)
    .join("\n          ");
  const itemList = route.items.map((item) => `<li>${htmlEscape(item)}</li>`).join("");

  return `<!doctype html>
<html lang="zh-Hant">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${htmlEscape(route.title)} | CTDF Demo</title>
  <meta name="robots" content="noindex, nofollow">
  <link rel="stylesheet" href="/assets/demo.css">
</head>
<body>
  <header class="site-header">
    <nav class="nav" aria-label="主要導覽">
      <a class="brand" href="/"><img class="brand-logo" src="/assets/ctdf-logo.png" alt="CTDF Logo"><span><b>中華民國競技飛鏢總會</b><small>Demo Website</small></span></a>
      <div class="nav-links">${navHtml()}</div>
    </nav>
  </header>

  <main>
    <section class="page-hero">
      <div class="page-hero-inner">
        <p class="eyebrow">${htmlEscape(route.group)} / ${htmlEscape(route.status)}</p>
        <h1>${htmlEscape(route.title)}</h1>
        <p>${htmlEscape(route.summary)}</p>
        <div class="actions">
          <a class="button" href="/">回首頁</a>
          <a class="button secondary" href="/${route.path}/">目前路徑：/${route.path}/</a>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="section-inner two-col">
        <article class="panel">
          <h2>Demo 功能範圍</h2>
          <p>此頁用來示範正式網站完成後的內容承載方式。資料以公開來源與專案文件整理，後續可改由後台與資料庫維護。</p>
          <ul class="check-list">${itemList}</ul>
        </article>
        <aside class="panel">
          <h2>頁面狀態</h2>
          <p>MVP 代表第一階段建議優先開發；Later 代表可排入第二階段。Demo 內容不含未授權個資與機敏資料。</p>
          <dl class="meta">
            <div><dt>Route</dt><dd>/${route.path}/</dd></div>
            <div><dt>Source</dt><dd>README / FRD / PRD / SRD / public web sources</dd></div>
            <div><dt>Data</dt><dd>Public-source demo data</dd></div>
          </dl>
        </aside>
      </div>
    </section>

    <section class="section real-data">
      <div class="section-inner">
        <div class="section-head">
          <h2>實際資料 Demo</h2>
          <p>以下資料用來讓會長更容易想像正式網站樣貌。正式上線前仍建議由總會確認文字、日期、名單與附件版本。</p>
        </div>
        <div class="data-grid">
          ${dataCards(realData.length ? realData : [{ title: "待總會提供正式資料", meta: "Demo 預留", desc: "此頁目前以版型示範為主，正式資料確認後可直接替換。", source: sources.notes }])}
        </div>
      </div>
    </section>

    <section class="section alt">
      <div class="section-inner">
        <div class="section-head">
          <h2>同區頁面</h2>
          <p>點選可查看同一功能區的其他頁面。</p>
        </div>
        <div class="link-grid">
          ${childLinks}
        </div>
      </div>
    </section>
  </main>

  ${footerHtml()}
</body>
</html>
`;
}

function homeHtml() {
  const featuredNews = realDataByRoot.news;
  const featuredEvents = realDataByRoot.events;
  const featuredRankings = realDataByRoot.rankings;
  const featuredAbout = realDataByRoot.about;

  return `<!doctype html>
<html lang="zh-Hant">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>中華民國競技飛鏢總會 Demo</title>
  <meta name="robots" content="noindex, nofollow">
  <link rel="stylesheet" href="/assets/demo.css">
</head>
<body>
  <header class="site-header">
    <nav class="nav" aria-label="主要導覽">
      <a class="brand" href="/"><img class="brand-logo" src="/assets/ctdf-logo.png" alt="CTDF Logo"><span><b>中華民國競技飛鏢總會</b><small>Official Website Demo</small></span></a>
      <div class="nav-links">${navHtml()}</div>
    </nav>
  </header>

  <main>
    <section class="home-hero">
      <div class="home-hero-inner">
        <div>
          <p class="eyebrow">Official Website Demo</p>
          <h1>中華民國競技飛鏢總會</h1>
          <p>以實際公開資料示範最新公告、賽事資訊、排名成績與關於總會頁面，方便會長直接理解網站建置完成後的呈現效果。</p>
          <div class="actions">
            <a class="button" href="/news/">看最新公告</a>
            <a class="button secondary" href="/events/">看賽事資訊</a>
          </div>
        </div>
        <div class="target-panel" aria-label="CTDF 視覺識別">
          <img class="hero-logo" src="/assets/ctdf-logo.png" alt="CTDF Logo">
          <div class="stat-row">
            <span><b>5</b>FRD / PRD / SRD</span>
            <span><b>8</b>MVP 模組</span>
            <span><b>4</b>重點 Demo 頁</span>
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="section-inner">
        <div class="section-head">
          <h2>最新公告</h2>
          <a class="text-link" href="/news/">前往公告頁</a>
        </div>
        <div class="data-grid">${dataCards(featuredNews)}</div>
      </div>
    </section>

    <section class="section alt">
      <div class="section-inner">
        <div class="section-head">
          <h2>賽事資訊</h2>
          <a class="text-link" href="/events/">前往賽事頁</a>
        </div>
        <div class="data-grid">${dataCards(featuredEvents)}</div>
      </div>
    </section>

    <section class="section real-data">
      <div class="section-inner">
        <div class="section-head">
          <h2>排名成績</h2>
          <a class="text-link" href="/rankings/">前往排名頁</a>
        </div>
        <div class="data-grid">${dataCards(featuredRankings)}</div>
      </div>
    </section>

    <section class="section alt">
      <div class="section-inner">
        <div class="section-head">
          <h2>關於總會</h2>
          <a class="text-link" href="/about/">前往關於總會</a>
        </div>
        <div class="data-grid">${dataCards(featuredAbout)}</div>
      </div>
    </section>
  </main>

  ${footerHtml()}
</body>
</html>
`;
}

const css = `:root{--ink:#142033;--muted:#667085;--line:#d9e1ec;--paper:#fff;--wash:#f4f7fb;--navy:#153a6b;--red:#c92c35;--green:#187a58;font-family:"Noto Sans TC","Microsoft JhengHei","PingFang TC",system-ui,sans-serif}*{box-sizing:border-box}body{margin:0;color:var(--ink);background:var(--wash);letter-spacing:0}a{color:inherit;text-decoration:none}.site-header{position:sticky;top:0;z-index:5;border-bottom:1px solid var(--line);background:rgba(255,255,255,.94);backdrop-filter:blur(14px)}.nav{display:flex;align-items:center;justify-content:space-between;gap:18px;width:min(1180px,calc(100% - 32px));min-height:72px;margin:0 auto}.brand{display:flex;align-items:center;gap:12px;min-width:0}.brand-logo{width:74px;height:44px;object-fit:contain;border-radius:6px;background:#fff}.brand b,.brand small{display:block}.brand small{color:var(--muted);font-size:12px}.nav-links{display:flex;gap:16px;color:#344054;font-size:14px;font-weight:800}.home-hero,.page-hero{color:#fff;background:linear-gradient(105deg,rgba(10,23,43,.96),rgba(21,58,107,.88)),linear-gradient(135deg,#0a172b,#153a6b 60%,#c92c35 130%)}.home-hero-inner,.page-hero-inner{width:min(1180px,calc(100% - 32px));margin:0 auto}.home-hero-inner{display:grid;grid-template-columns:minmax(0,1fr) minmax(280px,420px);gap:34px;align-items:center;padding:76px 0}.page-hero-inner{padding:72px 0}.eyebrow{margin:0 0 14px;color:#ffd166;font-weight:900}.home-hero h1,.page-hero h1{max-width:860px;margin:0 0 18px;font-size:clamp(36px,6vw,72px);line-height:1.06}.home-hero p,.page-hero p{max-width:720px;color:#dbe7f6;font-size:18px;line-height:1.75}.actions{display:flex;flex-wrap:wrap;gap:10px;margin-top:24px}.button{display:inline-flex;align-items:center;justify-content:center;min-height:44px;padding:0 15px;border-radius:8px;background:#c92c35;color:#fff;font-weight:900}.button.secondary{border:1px solid rgba(255,255,255,.3);background:rgba(255,255,255,.1)}.target-panel{padding:0;background:transparent;box-shadow:none}.hero-logo{display:block;width:min(360px,100%);margin:0 auto 18px;border-radius:8px;background:#fff;box-shadow:0 12px 30px rgba(0,0,0,.22)}.stat-row{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}.stat-row span{border-radius:8px;background:rgba(255,255,255,.13);padding:12px;color:#dbe7f6;font-size:12px}.stat-row b{display:block;color:#ffd166;font-size:22px}.section{padding:54px 0}.section.alt{background:#fff}.section.real-data{background:#eef4fb}.section-inner{width:min(1180px,calc(100% - 32px));margin:0 auto}.two-col{display:grid;grid-template-columns:minmax(0,1fr) minmax(300px,.75fr);gap:18px;align-items:start}.panel,.link-card,.data-card{border:1px solid var(--line);border-radius:8px;background:#fff;box-shadow:0 10px 28px rgba(20,32,51,.06)}.panel{padding:22px}.panel h2,.section-head h2{margin:0 0 12px;font-size:26px}.panel p,.section-head p{color:var(--muted);line-height:1.7}.check-list{display:grid;gap:10px;margin:18px 0 0;padding-left:22px}.check-list li{line-height:1.55}.meta{display:grid;gap:12px;margin:18px 0 0}.meta div{display:grid;gap:4px}.meta dt{color:var(--muted);font-size:13px;font-weight:800}.meta dd{margin:0;font-weight:800;word-break:break-word}.section-head{display:flex;align-items:end;justify-content:space-between;gap:18px;margin-bottom:20px}.text-link{color:var(--navy);font-weight:900;text-decoration:underline;text-underline-offset:3px}.data-grid,.link-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}.data-card{display:grid;gap:10px;min-height:236px;padding:18px}.data-card h3{margin:0;font-size:20px;line-height:1.35}.data-card p{margin:0;color:var(--muted);line-height:1.62}.data-card a{align-self:end;color:var(--navy);font-weight:900;text-decoration:underline;text-underline-offset:3px}.data-meta{color:var(--red)!important;font-size:13px;font-weight:900}.link-card{display:grid;gap:7px;min-height:88px;padding:15px}.link-card.current{border-color:rgba(201,44,53,.45);box-shadow:0 12px 28px rgba(201,44,53,.12)}.link-card b{color:var(--navy);font-size:14px}.link-card span{color:var(--muted);font-size:14px;line-height:1.45}.footer{padding:28px 16px;color:#dbe7f6;background:#0a172b;font-size:14px}.footer-inner{display:flex;align-items:center;justify-content:center;flex-wrap:wrap;gap:10px 18px;width:min(1180px,calc(100% - 32px));margin:0 auto;text-align:center}.footer b{color:#fff}.footer a{color:#fff;text-decoration:underline;text-underline-offset:3px}.footer-note{color:#98a8bd}@media (max-width:900px){.nav{align-items:flex-start;flex-direction:column;padding:14px 0}.nav-links{width:100%;overflow-x:auto;padding-bottom:4px}.home-hero-inner,.two-col,.data-grid,.link-grid{grid-template-columns:1fr}.section-head{align-items:start;flex-direction:column}.home-hero-inner,.page-hero-inner{padding:54px 0}.home-hero h1,.page-hero h1{font-size:clamp(34px,10vw,52px)}.footer-inner{align-items:flex-start;flex-direction:column;text-align:left}}`;

mkdirSync("assets", { recursive: true });
writeFileSync(join("assets", "demo.css"), css, "utf8");
writeFileSync("index.html", homeHtml(), "utf8");

for (const route of routes) {
  const filePath = join(route.path, "index.html");
  mkdirSync(dirname(filePath), { recursive: true });
  writeFileSync(filePath, pageHtml(route), "utf8");
}

const sitemap = routes.map((route) => `/${route.path}/ ${route.title}`).join("\n");
writeFileSync("DEMO_SITEMAP.txt", `CTDF Demo route list\n\n/\n${sitemap}\n`, "utf8");

console.log(`Generated ${routes.length} demo pages plus homepage.`);
