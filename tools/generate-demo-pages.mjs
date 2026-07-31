import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const sources = {
  penghu114: "https://www.penghu.gov.tw/edu/home.jsp?act=view&dataserno=202602110004&id=94",
  hualien114: "https://news.hlc.edu.tw/index.php?id=125506&page=department",
  taichung113League: "https://www.tc.edu.tw/page/6ea0d0a0-c3e7-4485-9925-ac95271ad618/news-content?id=225671",
  bjps114: "https://www.bjps.tp.edu.tw/p/406-1000-2613%2Cr16.php",
  cnaWorldCup: "https://www.cna.com.tw/news/aspt/202509220180.aspx",
  cnaGold: "https://www.cna.com.tw/news/aspt/202509260296.aspx",
  citizensSports: "https://sport115.tycg.gov.tw/",
  facebook: "https://www.facebook.com/CTDFTW/?locale=zh_TW",
  notes: "/docs/DEMO_REAL_DATA_NOTES.md",
  frd: "/docs/FRD.md",
  prd: "/docs/PRD.md",
  srd: "/docs/SRD.md"
};

const nav = [
  ["首頁", "/"],
  ["公告", "/news/"],
  ["賽事", "/events/"],
  ["排名", "/rankings/"],
  ["選手", "/players/"],
  ["下載", "/downloads/"],
  ["關於", "/about/"]
];

const routeGroups = {
  news: [
    ["news", "最新公告", "公開資訊", "MVP", "以公告清單方式呈現總會消息、賽事通知與國際參賽新聞。"],
    ["news/demo-announcement", "公告詳情範例", "公開資訊", "MVP", "示範單一公告的日期、分類、附件與來源連結。"]
  ],
  events: [
    ["events", "賽事資訊", "公開資訊", "MVP", "以賽程清單呈現賽事日期、地點、報名期限與規程來源。"],
    ["events/calendar", "賽事行事曆", "公開資訊", "MVP", "未來可改為月曆檢視，目前以近期賽程示範。"],
    ["events/list", "賽事列表", "公開資訊", "MVP", "依年度、組別與賽事狀態查詢。"],
    ["events/results", "賽事成績", "公開資訊", "MVP", "集中放置賽果、名次與成績附件。"],
    ["events/demo-event", "賽事詳情範例", "公開資訊", "MVP", "示範單一賽事的完整資訊頁。"]
  ],
  rankings: [
    ["rankings", "排名成績", "公開資訊", "MVP", "以表格方式呈現國際成果與正式積分排名預留欄位。"],
    ["rankings/main", "成人組排名", "公開資訊", "MVP", "預留成人組年度積分榜。"],
    ["rankings/youth", "青少年排名", "公開資訊", "MVP", "預留青少年組與學生賽事成果。"],
    ["rankings/history", "歷年成績查詢", "第二階段", "Later", "正式版可建立歷年賽事與排名資料庫。"],
    ["rankings/region", "縣市排名", "第二階段", "Later", "預留縣市或區域推廣成果呈現。"]
  ],
  players: [
    ["players", "選手資料庫", "公開資訊", "MVP", "以選手資料庫樣式呈現，Demo 不放未授權個資。"],
    ["players/demo-player", "選手個人頁範例", "公開資訊", "MVP", "示範個人頁版型，正式資料需總會授權。"]
  ],
  downloads: [
    ["downloads", "文件下載", "公開資訊", "MVP", "以文件清單呈現規程、報名表與公告附件。"],
    ["downloads/forms", "表單下載", "公開資訊", "MVP", "整理會員、賽事與行政表單。"],
    ["downloads/rules", "規章下載", "公開資訊", "MVP", "集中放置賽制規程與相關辦法。"],
    ["downloads/annual", "年度計畫 / 報告", "第二階段", "Later", "預留年度計畫、成果報告與公開資訊。"],
    ["downloads/reports", "會務報告下載", "第二階段", "Later", "預留會務、推廣與賽事統計報告。"]
  ],
  about: [
    ["about", "關於總會", "公開資訊", "MVP", "以資訊區塊呈現總會定位、國際接軌、聯絡資訊與推動方向。"],
    ["about/organization", "組織架構", "公開資訊", "MVP", "預留理監事、委員會、秘書處與工作小組介紹。"],
    ["about/rules", "章程與規章", "公開資訊", "MVP", "集中管理章程、賽務規章與治理文件。"],
    ["about/contact", "聯絡我們", "公開資訊", "MVP", "提供正式聯絡方式與詢問入口。"],
    ["about/privacy", "隱私權政策", "公開資訊", "MVP", "說明資料蒐集、使用與保護方式。"],
    ["about/citizens-sports-games", "全民運推動專區", "第二階段", "Later", "說明全民運動會相關觀察與未來推動策略。"],
    ["about/development", "發展沿革", "第二階段", "Later", "正式版可由總會提供沿革與里程碑。"]
  ],
  fairplay: [["fairplay", "公平競賽 / 反禁藥", "公開資訊", "MVP", "整理公平競賽、反禁藥與運動員保護資訊。"]],
  media: [
    ["media/photos", "照片花絮", "第二階段", "Later", "預留賽事照片與活動花絮。"],
    ["media/videos", "影音專區", "第二階段", "Later", "預留 YouTube、直播回放與宣傳影片入口。"],
    ["media/press", "媒體報導", "第二階段", "Later", "彙整媒體報導與國際參賽新聞。"]
  ],
  member: [
    ["member/login", "會員登入 / 註冊", "會員", "MVP", "示範會員登入入口。"],
    ["member/profile", "會員資料", "會員", "MVP", "會員可維護基本資料、選手資料與報名紀錄。"],
    ["member/fee", "會費繳納", "第二階段", "Later", "預留會費狀態與繳費紀錄。"]
  ],
  admin: [
    ["admin", "後台管理", "後台", "MVP", "示範管理介面入口。"],
    ["admin/news", "公告管理", "後台", "MVP", "新增、編輯、發布與下架公告。"],
    ["admin/pages", "頁面管理", "後台", "MVP", "管理關於總會、規章與固定頁。"],
    ["admin/events", "賽事管理", "後台", "MVP", "建立賽事資料、規程、報名與賽果。"],
    ["admin/rankings", "排名管理", "後台", "MVP", "匯入排名資料並發布更新。"],
    ["admin/players", "選手管理", "後台", "MVP", "維護選手資料與公開欄位。"],
    ["admin/members", "會員管理", "後台", "MVP", "管理會員狀態、權限與審核。"],
    ["admin/downloads", "文件管理", "後台", "MVP", "上傳文件、管理版本與分類。"],
    ["admin/settings/site", "網站基本設定", "後台", "MVP", "管理網站名稱、Logo、SEO 與聯絡資訊。"]
  ]
};

const routes = Object.values(routeGroups).flat().map(([path, title, group, status, summary]) => ({
  path,
  title,
  group,
  status,
  summary
}));

const data = {
  news: [
    { date: "2026-02-11", category: "賽事公告", title: "114學年師生盃全國各級學校飛鏢錦標賽公告", desc: "澎湖縣政府教育處轉知總會辦理師生盃，賽事地點為桃園市中壢國中活動中心。", source: sources.penghu114 },
    { date: "2025-09-22", category: "國際參賽", title: "台灣競技飛鏢代表隊首度參加 WDF 世界盃", desc: "台灣代表隊首度登上 WDF 世界盃舞台，總會派出 8 名選手參賽。", source: sources.cnaWorldCup },
    { date: "2025-09-26", category: "國際成績", title: "蔡詠恩、楊奕晴於 WDF 世界盃 U18 女雙摘金", desc: "Demo 可作為青少年培育、國際參賽與成績專區的展示亮點。", source: sources.cnaGold }
  ],
  events: [
    { date: "2026-03-14 至 2026-03-15", status: "報名截止 2026-03-02", title: "114學年師生盃全國各級學校飛鏢錦標賽", place: "桃園市中壢國中活動中心", desc: "以學校為單位報名，可示範報名期限、場地、規程附件與聯絡方式。", source: sources.hualien114 },
    { date: "2025-06-14 至 2025-06-15", status: "歷史賽事", title: "113學年度國民中學暨高級中學飛鏢隊際聯賽", place: "學生隊際賽", desc: "臺中市政府教育局公告列有國中與高中學生聯賽規程、報名表與總會聯絡資訊。", source: sources.taichung113League },
    { date: "2026-03-14 至 2026-03-15", status: "規程摘要", title: "114學年師生盃賽事規程摘要", place: "學校公告轉知", desc: "公告列出賽事目的、日期、報名日期、地點與參加單位，適合做為詳情頁資料。", source: sources.bjps114 }
  ],
  rankings: [
    ["U18 女子雙打", "蔡詠恩、楊奕晴", "WDF 世界盃金牌", "2025-09-26", sources.cnaGold],
    ["代表隊", "中華台北代表隊", "首度參加 WDF 世界盃", "2025-09-22 至 2025-09-28", sources.cnaWorldCup],
    ["正式積分排名", "待總會提供", "成人組、青少年組、縣市排名預留", "Demo 註記", sources.notes]
  ],
  players: [
    { name: "正式選手資料待總會授權", group: "Demo 預留", region: "不揭露未授權個資", status: "建議正式版由後台維護公開欄位", source: sources.frd },
    { name: "國際賽事成果可建立選手頁", group: "U18 / 代表隊", region: "依總會核定資料", status: "可連結排名成績與賽事成績", source: sources.cnaGold }
  ],
  downloads: [
    { type: "競賽規程", title: "113學年度國中暨高中飛鏢隊際聯賽規程", owner: "臺中市政府教育局公告附件", updated: "2025-04-24", source: sources.taichung113League },
    { type: "報名資訊", title: "114學年師生盃報名與規程來源", owner: "總會 FB 與各縣市教育單位公告", updated: "2026-02", source: sources.hualien114 },
    { type: "Demo 文件", title: "實際資料使用說明", owner: "專案文件", updated: "Demo", source: sources.notes }
  ],
  about: [
    ["網站識別", "中華民國競技飛鏢總會 / Chinese Taipei Dart Federation，Demo 使用使用者提供之 CTDF Logo。", sources.facebook],
    ["聯絡資訊", "臺北市南港區松河街384號5樓；+886 2 2732 1422；ctdf0306@gmail.com。", sources.facebook],
    ["國際接軌", "以 WDF 世界盃參賽與 U18 女雙成果作為網站公信力與推廣成果展示。", sources.cnaWorldCup],
    ["全民運推動", "以 115年全民運官方網站為準，Demo 僅作推動觀察，不誤稱飛鏢已列正式項目。", sources.citizensSports]
  ]
};

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

function sourceLink(url) {
  return `<a href="${htmlEscape(url)}" target="_blank" rel="noopener noreferrer">查看來源</a>`;
}

function heroVariant(root) {
  const variants = {
    news: { icon: "M34 24h68v72H34z M48 44h40 M48 60h32 M48 76h36", accent: "#ffd166" },
    events: { icon: "M28 30h80v72H28z M28 50h80 M48 20v24 M88 20v24 M46 68h12 M72 68h12 M46 88h12 M72 88h12", accent: "#4ade80" },
    rankings: { icon: "M28 104h22V68h30v36h22V48h30v56 M20 104h120", accent: "#fbbf24" },
    players: { icon: "M76 28a24 24 0 1 0 0 48a24 24 0 0 0 0-48z M32 116c8-26 26-40 44-40s36 14 44 40", accent: "#93c5fd" },
    downloads: { icon: "M40 20h52l28 28v76H40z M92 20v28h28 M76 58v38 M58 80l18 18l18-18", accent: "#fca5a5" },
    about: { icon: "M32 108V48l44-24l44 24v60 M52 108V72h48v36 M22 108h108 M62 52h10 M84 52h10", accent: "#67e8f9" }
  };
  return variants[root] || variants.news;
}

function titleIcon(root) {
  const variant = heroVariant(root);
  return `<span class="title-icon" aria-hidden="true"><svg viewBox="0 0 150 140"><path d="${variant.icon}" fill="none" stroke="${variant.accent}" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/></svg></span>`;
}

function heroArt() {
  return `<div class="hero-art" aria-hidden="true">
    <svg viewBox="0 0 420 260" role="img">
      <defs>
        <linearGradient id="dartShaft" x1="0" x2="1">
          <stop offset="0" stop-color="#f6fbff"/>
          <stop offset="1" stop-color="#9fb7d4"/>
        </linearGradient>
        <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="14" stdDeviation="12" flood-color="#020b18" flood-opacity=".35"/>
        </filter>
      </defs>
      <path d="M84 204 C146 236 252 232 336 196" fill="none" stroke="#dbe7f6" stroke-width="2" opacity=".38"/>
      <path d="M112 62 C174 26 276 28 352 66" fill="none" stroke="#dbe7f6" stroke-width="2" opacity=".32"/>
      <circle cx="282" cy="126" r="88" fill="#0b1320" filter="url(#softShadow)"/>
      <circle cx="282" cy="126" r="76" fill="#f8fafc"/>
      <circle cx="282" cy="126" r="64" fill="#c92c35"/>
      <circle cx="282" cy="126" r="51" fill="#187a58"/>
      <circle cx="282" cy="126" r="38" fill="#111827"/>
      <circle cx="282" cy="126" r="24" fill="#f8fafc"/>
      <circle cx="282" cy="126" r="12" fill="#c92c35"/>
      <path d="M54 188 L244 132" stroke="url(#dartShaft)" stroke-width="12" stroke-linecap="round"/>
      <path d="M236 129 L280 121 L247 148 Z" fill="#f8fafc"/>
      <path d="M44 194 L80 154 L100 176 L65 210 Z" fill="#c92c35"/>
      <path d="M69 172 L98 137 L122 158 L92 192 Z" fill="#153a6b"/>
      <path d="M38 198 L18 204 L44 180 Z" fill="#ffd166"/>
    </svg>
  </div>`;
}

function renderNews(items = data.news) {
  return `<div class="news-list">${items.map((item) => `
    <article class="news-item">
      <time>${htmlEscape(item.date)}</time>
      <div>
        <span class="tag">${htmlEscape(item.category)}</span>
        <h3>${htmlEscape(item.title)}</h3>
        <p>${htmlEscape(item.desc)}</p>
      </div>
      ${sourceLink(item.source)}
    </article>`).join("")}
  </div>`;
}

function renderEvents(items = data.events) {
  return `<div class="event-list">${items.map((item) => `
    <article class="event-item">
      <div class="event-date">${htmlEscape(item.date)}</div>
      <div class="event-body">
        <span class="tag">${htmlEscape(item.status)}</span>
        <h3>${htmlEscape(item.title)}</h3>
        <p><b>地點：</b>${htmlEscape(item.place)}</p>
        <p>${htmlEscape(item.desc)}</p>
      </div>
      ${sourceLink(item.source)}
    </article>`).join("")}
  </div>`;
}

function renderRankings(items = data.rankings) {
  return `<div class="table-wrap"><table class="ranking-table">
    <thead><tr><th>組別</th><th>對象</th><th>成績 / 狀態</th><th>日期</th><th>來源</th></tr></thead>
    <tbody>${items.map(([group, name, result, date, source]) => `
      <tr><td>${htmlEscape(group)}</td><td>${htmlEscape(name)}</td><td>${htmlEscape(result)}</td><td>${htmlEscape(date)}</td><td>${sourceLink(source)}</td></tr>`).join("")}
    </tbody>
  </table></div>`;
}

function renderPlayers(items = data.players) {
  return `<div class="player-list">${items.map((item) => `
    <article class="player-row">
      <div class="avatar">CTDF</div>
      <div><h3>${htmlEscape(item.name)}</h3><p>${htmlEscape(item.status)}</p></div>
      <dl><div><dt>組別</dt><dd>${htmlEscape(item.group)}</dd></div><div><dt>地區 / 備註</dt><dd>${htmlEscape(item.region)}</dd></div></dl>
      ${sourceLink(item.source)}
    </article>`).join("")}
  </div>`;
}

function renderDownloads(items = data.downloads) {
  return `<div class="download-list">${items.map((item) => `
    <article class="download-row">
      <span class="file-badge">${htmlEscape(item.type)}</span>
      <div><h3>${htmlEscape(item.title)}</h3><p>${htmlEscape(item.owner)} / 更新：${htmlEscape(item.updated)}</p></div>
      ${sourceLink(item.source)}
    </article>`).join("")}
  </div>`;
}

function renderAbout(items = data.about) {
  return `<div class="about-grid">${items.map(([title, body, source]) => `
    <article class="about-block">
      <h3>${htmlEscape(title)}</h3>
      <p>${htmlEscape(body)}</p>
      ${sourceLink(source)}
    </article>`).join("")}
  </div>`;
}

function renderDefault(root) {
  if (root === "fairplay") return renderDownloads([{ type: "政策資料", title: "公平競賽與反禁藥資料入口", owner: "MVP 文件規劃", updated: "Demo", source: sources.frd }]);
  if (root === "member") return renderPlayers([{ name: "會員系統規劃", group: "Supabase Auth", region: "登入與權限控管", status: "Demo 先保留入口與流程示意。", source: sources.srd }]);
  if (root === "admin") return renderDownloads([{ type: "後台模組", title: "公告、賽事、排名、文件與權限管理", owner: "PRD / SRD", updated: "Demo", source: sources.prd }]);
  if (root === "media") return renderNews([{ date: "2025-09-22", category: "媒體報導", title: "媒體報導可串接新聞來源", desc: "媒體專區可彙整中央社等公開新聞，並以外部連結保留原始來源。", source: sources.cnaWorldCup }]);
  return renderDownloads([{ type: "Demo", title: "待總會提供正式資料", owner: "專案文件", updated: "Demo", source: sources.notes }]);
}

function renderContent(root) {
  const renderers = {
    news: renderNews,
    events: renderEvents,
    rankings: renderRankings,
    players: renderPlayers,
    downloads: renderDownloads,
    about: renderAbout
  };
  return (renderers[root] || (() => renderDefault(root)))();
}

function childLinks(route) {
  const root = route.path.split("/")[0];
  return routes
    .filter((item) => item.path.split("/")[0] === root)
    .map((item) => `<a class="link-card${item.path === route.path ? " current" : ""}" href="/${item.path}/"><b>/${item.path}</b><span>${htmlEscape(item.title)}</span></a>`)
    .join("");
}

function pageHtml(route) {
  const root = route.path.split("/")[0];
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
        <div>
          <p class="eyebrow">${htmlEscape(route.group)} / ${htmlEscape(route.status)}</p>
          <h1>${titleIcon(root)}<span>${htmlEscape(route.title)}</span></h1>
          <p>${htmlEscape(route.summary)}</p>
        </div>
        ${heroArt()}
      </div>
    </section>
    <section class="section real-data">
      <div class="section-inner">
        <div class="section-head">
          <h2>${htmlEscape(route.title)} Demo</h2>
          <p>此區依資料性質採用不同排版。正式上線前，內容仍需由總會確認。</p>
        </div>
        ${renderContent(root)}
      </div>
    </section>
    <section class="section alt">
      <div class="section-inner">
        <div class="section-head">
          <h2>同區頁面</h2>
          <p>查看同一功能區的其他頁面。</p>
        </div>
        <div class="link-grid">${childLinks(route)}</div>
      </div>
    </section>
  </main>
  ${footerHtml()}
</body>
</html>`;
}

function homeSection(title, href, body) {
  return `<section class="section">
    <div class="section-inner">
      <div class="section-head">
        <h2>${title}</h2>
        <a class="text-link" href="${href}">前往頁面</a>
      </div>
      ${body}
    </div>
  </section>`;
}

function homeHtml() {
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
          <p>以實際公開資料示範公告、賽事、排名、選手資料、文件下載與總會資訊，並依內容性質使用不同版型。</p>
          <div class="actions">
            <a class="button" href="/news/">看最新公告</a>
            <a class="button secondary" href="/events/">看賽事資訊</a>
          </div>
        </div>
        <div class="target-panel" aria-label="CTDF 視覺識別">
          <img class="hero-logo" src="/assets/ctdf-logo.png" alt="CTDF Logo">
          <div class="stat-row">
            <span><b>公告</b>列表</span>
            <span><b>賽事</b>賽程</span>
            <span><b>排名</b>表格</span>
          </div>
        </div>
      </div>
    </section>
    ${homeSection("最新公告", "/news/", renderNews())}
    ${homeSection("賽事資訊", "/events/", renderEvents())}
    ${homeSection("排名成績", "/rankings/", renderRankings())}
    ${homeSection("選手資料庫", "/players/", renderPlayers())}
    ${homeSection("文件下載", "/downloads/", renderDownloads())}
    ${homeSection("關於總會", "/about/", renderAbout())}
  </main>
  ${footerHtml()}
</body>
</html>`;
}

const css = `:root{--ink:#142033;--muted:#667085;--line:#d9e1ec;--paper:#fff;--wash:#f4f7fb;--navy:#153a6b;--red:#c92c35;--green:#187a58;--gold:#ffd166;font-family:"Noto Sans TC","Microsoft JhengHei","PingFang TC",system-ui,sans-serif}*{box-sizing:border-box}body{margin:0;color:var(--ink);background:var(--wash);letter-spacing:0}a{color:inherit;text-decoration:none}.site-header{position:sticky;top:0;z-index:5;border-bottom:1px solid var(--line);background:rgba(255,255,255,.94);backdrop-filter:blur(14px)}.nav{display:flex;align-items:center;justify-content:space-between;gap:18px;width:min(1180px,calc(100% - 32px));min-height:72px;margin:0 auto}.brand{display:flex;align-items:center;gap:12px;min-width:0}.brand-logo{width:74px;height:44px;object-fit:contain;border-radius:6px;background:#fff}.brand b,.brand small{display:block}.brand small{color:var(--muted);font-size:12px}.nav-links{display:flex;gap:16px;color:#344054;font-size:14px;font-weight:800}.home-hero,.page-hero{color:#fff;background:linear-gradient(105deg,rgba(10,23,43,.96),rgba(21,58,107,.88)),linear-gradient(135deg,#0a172b,#153a6b 60%,#c92c35 130%)}.home-hero-inner,.page-hero-inner,.section-inner{width:min(1180px,calc(100% - 32px));margin:0 auto}.home-hero-inner,.page-hero-inner{display:grid;grid-template-columns:minmax(0,1fr) minmax(300px,430px);gap:34px;align-items:center}.home-hero-inner{padding:76px 0}.page-hero-inner{padding:66px 0}.hero-art{justify-self:end;width:min(430px,100%);opacity:.98}.hero-art svg{display:block;width:100%;height:auto}.title-icon{display:inline-grid;place-items:center;flex:0 0 auto;width:76px;height:76px;margin-right:16px;border:1px solid rgba(255,255,255,.22);border-radius:8px;background:rgba(255,255,255,.1)}.title-icon svg{width:62px;height:58px}.eyebrow{margin:0 0 14px;color:var(--gold);font-weight:900}.home-hero h1,.page-hero h1{max-width:860px;margin:0 0 18px;font-size:clamp(36px,6vw,72px);line-height:1.06}.page-hero h1{display:flex;align-items:center}.home-hero p,.page-hero p{max-width:720px;color:#dbe7f6;font-size:18px;line-height:1.75}.actions{display:flex;flex-wrap:wrap;gap:10px;margin-top:24px}.button{display:inline-flex;align-items:center;justify-content:center;min-height:44px;padding:0 15px;border-radius:8px;background:#c92c35;color:#fff;font-weight:900}.button.secondary{border:1px solid rgba(255,255,255,.3);background:rgba(255,255,255,.1)}.target-panel{padding:0;background:transparent}.hero-logo{display:block;width:min(360px,100%);margin:0 auto 18px;border-radius:8px;background:#fff;box-shadow:0 12px 30px rgba(0,0,0,.22)}.stat-row{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}.stat-row span{border-radius:8px;background:rgba(255,255,255,.13);padding:12px;color:#dbe7f6;font-size:12px}.stat-row b{display:block;color:var(--gold);font-size:18px}.section{padding:52px 0}.section.alt{background:#fff}.section.real-data{background:#eef4fb}.section-head{display:flex;align-items:end;justify-content:space-between;gap:18px;margin-bottom:20px}.section-head h2{margin:0;font-size:28px}.section-head p{max-width:720px;margin:0;color:var(--muted);line-height:1.7}.text-link,.news-item a,.event-item a,.ranking-table a,.player-row a,.download-row a,.about-block a{color:var(--navy);font-weight:900;text-decoration:underline;text-underline-offset:3px}.news-list,.event-list,.player-list,.download-list{display:grid;gap:12px}.news-item,.event-item,.player-row,.download-row{display:grid;grid-template-columns:minmax(150px,.25fr) minmax(0,1fr) auto;gap:14px 22px;align-items:center;border:1px solid var(--line);border-radius:8px;background:#fff;padding:18px;box-shadow:0 10px 28px rgba(20,32,51,.06)}.news-item time,.event-date{color:var(--red);font-weight:900}.tag,.file-badge{display:inline-flex;width:max-content;margin-bottom:8px;border-radius:999px;background:#eef4fb;color:var(--navy);padding:5px 9px;font-size:12px;font-weight:900}.news-item h3,.event-item h3,.player-row h3,.download-row h3,.about-block h3{margin:0 0 8px;font-size:20px;line-height:1.35}.news-item p,.event-item p,.player-row p,.download-row p,.about-block p{margin:0;color:var(--muted);line-height:1.65}.table-wrap{overflow:auto;border:1px solid var(--line);border-radius:8px;background:#fff;box-shadow:0 10px 28px rgba(20,32,51,.06)}.ranking-table{width:100%;border-collapse:collapse;min-width:780px}.ranking-table th,.ranking-table td{padding:16px;border-bottom:1px solid var(--line);text-align:left;vertical-align:top}.ranking-table th{background:#f8fafc;color:var(--navy);font-size:13px}.ranking-table tr:last-child td{border-bottom:0}.player-row{grid-template-columns:auto minmax(0,1fr) minmax(240px,.35fr) auto}.avatar{display:grid;place-items:center;width:56px;height:56px;border-radius:50%;background:#153a6b;color:#fff;font-size:12px;font-weight:900}.player-row dl{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:0}.player-row dt{color:var(--muted);font-size:12px;font-weight:900}.player-row dd{margin:3px 0 0}.download-row{grid-template-columns:auto minmax(0,1fr) auto}.about-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.about-block{border:1px solid var(--line);border-radius:8px;background:#fff;padding:20px;box-shadow:0 10px 28px rgba(20,32,51,.06)}.link-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}.link-card{display:grid;gap:7px;min-height:88px;padding:15px;border:1px solid var(--line);border-radius:8px;background:#fff;box-shadow:0 10px 28px rgba(20,32,51,.06)}.link-card.current{border-color:rgba(201,44,53,.45);box-shadow:0 12px 28px rgba(201,44,53,.12)}.link-card b{color:var(--navy);font-size:14px}.link-card span{color:var(--muted);font-size:14px;line-height:1.45}.footer{padding:28px 16px;color:#dbe7f6;background:#0a172b;font-size:14px}.footer-inner{display:flex;align-items:center;justify-content:center;flex-wrap:wrap;gap:10px 18px;width:min(1180px,calc(100% - 32px));margin:0 auto;text-align:center}.footer b{color:#fff}.footer a{color:#fff;text-decoration:underline;text-underline-offset:3px}.footer-note{color:#98a8bd}@media (max-width:900px){.nav{align-items:flex-start;flex-direction:column;padding:14px 0}.nav-links{width:100%;overflow-x:auto;padding-bottom:4px}.home-hero-inner,.page-hero-inner,.about-grid,.link-grid{grid-template-columns:1fr}.hero-art{justify-self:start;width:min(360px,100%)}.page-hero h1{align-items:flex-start}.title-icon{width:58px;height:58px;margin-right:12px}.title-icon svg{width:46px;height:44px}.news-item,.event-item,.player-row,.download-row{grid-template-columns:1fr;align-items:start}.player-row dl{grid-template-columns:1fr}.section-head{align-items:start;flex-direction:column}.home-hero-inner,.page-hero-inner{padding:52px 0}.home-hero h1,.page-hero h1{font-size:clamp(34px,10vw,52px)}.footer-inner{align-items:flex-start;flex-direction:column;text-align:left}}`;

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
