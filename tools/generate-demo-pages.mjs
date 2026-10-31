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
  asiaPacificCupBrief: "https://reurl.cc/RRbWrD",
  notes: "/docs/PUBLIC_DATA_NOTES.md",
  wdfMembers: "https://dartswdf.com/members",
  frd: "/docs/FRD.md",
  prd: "/docs/PRD.md",
  srd: "/docs/SRD.md"
};

const nav = [
  ["首頁", "/"],
  ["公告", "/news/"],
  ["賽事", "/events/"],
  ["影音專區", "/media/videos/"],
  ["文件連結", "/downloads/"],
  ["關於", "/about/"]
];

const routeGroups = {
  news: [
    ["news", "最新公告", "公開資訊", "MVP", "以公告清單方式呈現總會消息、賽事通知與國際參賽新聞。"],
    ["news/demo-announcement", "公告詳情", "公開資訊", "MVP", "呈現單一公告的日期、分類、附件與來源連結。"]
  ],
  events: [
    ["events", "賽事資訊", "公開資訊", "MVP", "以賽程清單呈現賽事日期、地點、報名期限與規程來源。"],
    ["events/calendar", "賽事行事曆", "公開資訊", "MVP", "彙整近期賽程，並保留月曆檢視的擴充空間。"],
    ["events/list", "賽事列表", "公開資訊", "MVP", "依年度、組別與賽事狀態查詢。"],
    ["events/results", "賽事成績", "公開資訊", "MVP", "集中放置賽果、名次與成績附件。"],
    ["events/demo-event", "賽事詳情", "公開資訊", "MVP", "呈現單一賽事的完整資訊。"]
  ],
  rankings: [
    ["rankings", "排名成績", "公開資訊", "MVP", "以表格方式呈現國際成果與正式積分排名預留欄位。"],
    ["rankings/main", "成人組排名", "公開資訊", "MVP", "預留成人組年度積分榜。"],
    ["rankings/youth", "青少年排名", "公開資訊", "MVP", "預留青少年組與學生賽事成果。"],
    ["rankings/history", "歷年成績查詢", "第二階段", "Later", "正式版可建立歷年賽事與排名資料庫。"],
    ["rankings/region", "縣市排名", "第二階段", "Later", "預留縣市或區域推廣成果呈現。"]
  ],
  players: [
    ["players", "選手資料庫", "公開資訊", "MVP", "呈現經總會授權公開的選手資料與參賽成果。"],
    ["players/demo-player", "選手個人頁", "公開資訊", "MVP", "呈現經總會授權公開的選手個人資料。"]
  ],
  downloads: [
    ["downloads", "文件連結", "公開資訊", "MVP", "以外部連結提供規程、報名資訊與公告文件來源。"],
    ["downloads/forms", "表單連結", "公開資訊", "MVP", "整理會員、賽事與行政表單的外部連結。"],
    ["downloads/rules", "規章連結", "公開資訊", "MVP", "集中提供賽制規程與相關辦法的外部連結。"],
    ["downloads/annual", "年度計畫 / 報告", "第二階段", "Later", "預留年度計畫、成果報告與公開資訊連結。"],
    ["downloads/reports", "會務報告連結", "第二階段", "Later", "預留會務、推廣與賽事統計報告連結。"]
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
    ["member/login", "會員登入 / 註冊", "會員", "MVP", "會員登入與註冊入口。"],
    ["member/profile", "會員資料", "會員", "MVP", "會員可維護基本資料、選手資料與報名紀錄。"],
    ["member/fee", "會費繳納", "第二階段", "Later", "預留會費狀態與繳費紀錄。"]
  ],
  admin: [
    ["admin/login", "後台登入", "後台", "Demo", "後台操作介面的獨立登入入口。"],
    ["admin", "後台管理", "後台", "MVP", "網站內容管理介面入口。"],
    ["admin/news", "公告管理", "後台", "MVP", "新增、編輯、發布與下架公告。"],
    ["admin/pages", "頁面管理", "後台", "MVP", "管理關於總會、規章與固定頁。"],
    ["admin/events", "賽事管理", "後台", "MVP", "建立賽事資料、規程、報名與賽果。"],
    ["admin/rankings", "排名管理", "後台", "MVP", "匯入排名資料並發布更新。"],
    ["admin/players", "選手管理", "後台", "MVP", "維護選手資料與公開欄位。"],
    ["admin/members", "會員管理", "後台", "MVP", "管理會員狀態、權限與審核。"],
    ["admin/downloads", "文件連結管理", "後台", "MVP", "管理外部文件連結、版本與分類。"],
    ["admin/media", "影音管理", "後台", "Demo", "管理影音網址、縮圖、說明與發布狀態。"],
    ["admin/settings/site", "網站基本設定", "後台", "MVP", "管理網站名稱、Logo、SEO 與聯絡資訊。"],
    ["admin/logs", "操作紀錄", "後台", "Demo", "查看內容建立、修改、送審與發布紀錄。"]
  ]
};

const routes = Object.values(routeGroups).flat().map(([path, title, group, status, summary]) => ({
  path,
  title,
  group,
  status: status === "MVP" ? "正式服務" : status === "Demo" ? "管理功能" : status === "Later" ? "規劃中" : status,
  summary
}));

// Keep these pages available for future phases, but hide them from the current demo navigation and sitemap.
const hiddenRoutePaths = new Set([
  "news/demo-announcement",
  "events/calendar",
  "events/list",
  "events/demo-event",
  "rankings",
  "rankings/main",
  "rankings/youth",
  "rankings/history",
  "rankings/region",
  "admin/rankings",
  "players",
  "players/demo-player",
  "admin/players",
  "admin/members",
  "downloads/forms",
  "downloads/rules"
]);

const visibleRoutes = routes.filter((route) => !hiddenRoutePaths.has(route.path));

const data = {
  news: [
    { date: "2026-08-01", category: "代表隊選拔", title: "2026 WDF 亞太盃中華台北代表隊選拔賽開放報名", desc: "兩年一次的國家代表隊選拔機會，賽事將於 2026 年 8 月 15 日、8 月 16 日在臺中市立向上國民中學舉行，報名至 2026 年 8 月 7 日截止。", source: sources.asiaPacificCupBrief, image: "/assets/wdf-asia-pacific-cup-2026-selection.png" },
    { date: "2026-02-11", category: "賽事公告", title: "114學年師生盃全國各級學校飛鏢錦標賽公告", desc: "澎湖縣政府教育處轉知總會辦理師生盃，賽事地點為桃園市中壢國中活動中心。", source: sources.penghu114 },
    { date: "2025-09-22", category: "國際參賽", title: "台灣競技飛鏢代表隊首度參加 WDF 世界盃", desc: "台灣代表隊首度登上 WDF 世界盃舞台，總會派出 8 名選手參賽。", source: sources.cnaWorldCup },
    { date: "2025-09-26", category: "國際成績", title: "蔡詠恩、楊奕晴於 WDF 世界盃 U18 女雙摘金", desc: "此成果為青少年培育、國際參賽與成績專區的重要紀錄。", source: sources.cnaGold }
  ],
  events: [
    { date: "2026-08-15 至 2026-08-16", status: "報名截止 2026-08-07", title: "2026 WDF 亞太盃中華台北代表隊選拔賽", place: "臺中市立向上國民中學", desc: "選拔中華台北代表隊參加 2026 WDF Asia Pacific Cup 亞太盃飛鏢錦標賽，入選選手將有機會代表台灣遠征蒙古烏蘭巴托。", source: sources.asiaPacificCupBrief, image: "/assets/wdf-asia-pacific-cup-2026-selection.png" },
    { date: "2026-03-14 至 2026-03-15", status: "報名截止 2026-03-02", title: "114學年師生盃全國各級學校飛鏢錦標賽", place: "桃園市中壢國中活動中心", desc: "以學校為單位報名，可示範報名期限、場地、規程附件與聯絡方式。", source: sources.hualien114 },
    { date: "2025-06-14 至 2025-06-15", status: "歷史賽事", title: "113學年度國民中學暨高級中學飛鏢隊際聯賽", place: "學生隊際賽", desc: "臺中市政府教育局公告列有國中與高中學生聯賽規程、報名表與總會聯絡資訊。", source: sources.taichung113League },
    { date: "2026-03-14 至 2026-03-15", status: "規程摘要", title: "114學年師生盃賽事規程摘要", place: "學校公告轉知", desc: "公告列出賽事目的、日期、報名日期、地點與參加單位，適合做為詳情頁資料。", source: sources.bjps114 }
  ],
  rankings: [
    ["U18 女子雙打", "蔡詠恩、楊奕晴", "WDF 世界盃金牌", "2025-09-26", sources.cnaGold],
    ["代表隊", "中華台北代表隊", "首度參加 WDF 世界盃", "2025-09-22 至 2025-09-28", sources.cnaWorldCup],
    ["正式積分排名", "待總會提供", "成人組、青少年組、縣市排名預留", "資料待更新", sources.notes]
  ],
  players: [
    { name: "正式選手資料待總會授權", group: "資料待更新", region: "不揭露未授權個資", status: "取得授權後由管理平台維護公開欄位", source: sources.frd },
    { name: "國際賽事成果可建立選手頁", group: "U18 / 代表隊", region: "依總會核定資料", status: "可連結賽事成績", source: sources.cnaGold }
  ],
  downloads: [
    { type: "競賽規程", title: "113學年度國中暨高中飛鏢隊際聯賽規程", owner: "臺中市政府教育局公告附件", updated: "2025-04-24", source: sources.taichung113League },
    { type: "報名資訊", title: "114學年師生盃報名與規程來源", owner: "總會 FB 與各縣市教育單位公告", updated: "2026-02", source: sources.hualien114 },
    { type: "資料說明", title: "公開資料使用說明", owner: "網站維護文件", updated: "2026-10-31", source: sources.notes }
  ],
  videos: [
    { category: "國際賽事", date: "2026-10-07", title: "WDF Asia-Pacific Cup 2026, Mongolia - Official Welcome Video", desc: "From October 7th to October 10th, 2026, top-tier national teams from the entire Asia-Pacific region will battle for international glory. As the reigning trophy holders, Team Mongolia enjoys ultimate home-court advantage. They are locked, loaded, and fully prepared to defend their championship title against the region's absolute best!🏆\n\nWill the home crowd carry Team Mongolia to back-to-back victories, or will another Asia-Pacific powerhouse take the trophy home?", image: "/media/photos/2026_APC.png", source: "https://www.youtube.com/watch?v=wWRWQvpGyv4" },
    { category: "代表隊", date: "2026-08", title: "2026 WDF 亞太盃代表隊選拔賽", desc: "代表隊選拔、賽事花絮與相關影音可集中於此，正式影片將由總會確認後上架。", image: "/assets/wdf-asia-pacific-cup-2026-selection.png", source: sources.facebook },
    { category: "國際賽事", date: "2025-09", title: "WDF 世界盃中華台北代表隊紀錄", desc: "彙整國際參賽紀錄、代表隊訪談與賽事精華，建立具公信力的影音資料入口。", image: "/assets/ctdf-world-cup-2025.jpg", source: sources.facebook },
    { category: "總會影音", date: "持續更新", title: "CTDF 活動與賽事影音", desc: "集中呈現活動紀錄、賽事轉播與推廣內容，影片經總會確認後公開。", image: "/assets/ctdf-facebook-cover.png", source: sources.facebook }
  ],
  about: [
    ["網站識別", "中華民國競技飛鏢總會 / Chinese Taipei Dart Federation，使用總會提供之 CTDF Logo。", sources.facebook],
    ["聯絡資訊", "臺北市南港區松河街384號5樓；+886 2 2732 1422；ctdf0306@gmail.com。", sources.facebook],
    ["國際接軌", "以 WDF 世界盃參賽與 U18 女雙成果作為網站公信力與推廣成果展示。", sources.cnaWorldCup],
    ["全民運推動", "以 115年全民運官方網站為準，本區記錄推動觀察，不誤稱飛鏢已列正式項目。", sources.citizensSports]
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
  return nav.map(([label, href]) => {
    const root = href === "/" ? "" : href.replaceAll("/", "");
    const children = root
      ? visibleRoutes.filter((item) => item.path.split("/")[0] === root)
      : [];
    if (children.length <= 1) return `<a class="nav-trigger" href="${href}">${label}</a>`;
    return `<div class="nav-item">
      <a class="nav-trigger" href="${href}">${label}</a>
      <div class="nav-menu">
        ${children.map((item) => `<a href="/${item.path}/">${htmlEscape(item.title)}</a>`).join("")}
      </div>
    </div>`;
  }).join("");
}

function footerHtml() {
  return `<footer class="footer">
    <div class="footer-inner">
      <b>中華民國競技飛鏢總會 CTDF</b>
      <span>地址：臺北市南港區松河街384號5樓</span>
      <span>電話：+886 2 2732 1422</span>
      <span>Email：<a href="mailto:ctdf0306@gmail.com">ctdf0306@gmail.com</a></span>
      <span class="footer-note">網站公開資料以總會最新公告為準</span>
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
  return `<div class="news-list">${items.map((item) => {
    const imageHtml = item.image ? `      <img class="item-thumb" src="${htmlEscape(item.image)}" alt="${htmlEscape(item.title)}">
` : "";
    return `
    <article class="news-item${item.image ? " has-thumb" : ""}">
${imageHtml}      <time>${htmlEscape(item.date)}</time>
      <div>
        <div class="item-title-row"><span class="tag">${htmlEscape(item.category)}</span><h3>${htmlEscape(item.title)}</h3></div>
        <p>${htmlEscape(item.desc)}</p>
      </div>
      ${sourceLink(item.source)}
    </article>`;
  }).join("")}
  </div>`;
}

function renderEvents(items = data.events) {
  return `<div class="event-list">${items.map((item) => {
    const imageHtml = item.image ? `      <img class="item-thumb" src="${htmlEscape(item.image)}" alt="${htmlEscape(item.title)}">
` : "";
    return `
    <article class="event-item${item.image ? " has-thumb" : ""}">
${imageHtml}      <div class="event-date">${htmlEscape(item.date)}</div>
      <div class="event-body">
        <div class="item-title-row"><span class="tag">${htmlEscape(item.status)}</span><h3>${htmlEscape(item.title)}</h3></div>
        <p><b>地點：</b>${htmlEscape(item.place)}</p>
        <p>${htmlEscape(item.desc)}</p>
      </div>
      ${sourceLink(item.source)}
    </article>`;
  }).join("")}
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
      <a href="${htmlEscape(item.source)}" target="_blank" rel="noopener noreferrer">開啟文件連結</a>
    </article>`).join("")}
  </div>`;
}

function renderVideos(items = data.videos) {
  return `<div class="video-grid">${items.map((item) => `
    <a class="video-card" href="${htmlEscape(item.source)}" target="_blank" rel="noopener noreferrer">
      <div class="video-thumb">
        <img src="${htmlEscape(item.image)}" alt="${htmlEscape(item.title)}">
        <span class="video-play" aria-hidden="true"></span>
      </div>
      <div class="video-meta"><span>${htmlEscape(item.category)}</span><time>${htmlEscape(item.date)}</time></div>
      <h3>${htmlEscape(item.title)}</h3>
      <p>${htmlEscape(item.desc).replaceAll("\n", "<br>")}</p>
      <b class="video-link">前往影音來源</b>
    </a>`).join("")}
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
  if (root === "fairplay") return renderDownloads([{ type: "政策資料", title: "公平競賽與反禁藥資料入口", owner: "政策文件", updated: "持續更新", source: sources.frd }]);
  if (root === "member") return renderPlayers([{ name: "會員系統規劃", group: "Supabase Auth", region: "登入與權限控管", status: "會員服務將依總會公告逐步開放。", source: sources.srd }]);
  if (root === "admin") return renderDownloads([{ type: "後台模組", title: "公告、賽事、文件與權限管理", owner: "PRD / SRD", updated: "持續維護", source: sources.prd }]);
  if (root === "media") return renderNews([{ date: "2025-09-22", category: "媒體報導", title: "媒體報導可串接新聞來源", desc: "媒體專區可彙整中央社等公開新聞，並以外部連結保留原始來源。", source: sources.cnaWorldCup }]);
  return renderDownloads([{ type: "資料狀態", title: "待總會提供正式資料", owner: "網站維護文件", updated: "待更新", source: sources.notes }]);
}

function renderContent(root, path) {
  if (path === "media/videos") return renderVideos();
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

const adminModules = {
  "admin/news": {
    label: "公告管理",
    singular: "公告",
    description: "建立公告草稿、預覽內容並模擬送審或發布。",
    rows: [
      { title: "2026 WDF 亞太盃代表隊選拔賽開放報名", category: "代表隊選拔", date: "2026-08-01", status: "published", updated: "今天 10:24" },
      { title: "114學年師生盃全國各級學校飛鏢錦標賽公告", category: "賽事公告", date: "2026-02-11", status: "review", updated: "昨天 16:40" },
      { title: "中華台北代表隊國際參賽消息", category: "國際參賽", date: "2025-09-22", status: "draft", updated: "9月25日" }
    ],
    fields: [
      ["title", "公告標題", "text", "請輸入清楚的公告標題"],
      ["category", "公告分類", "select", ["賽事公告", "代表隊選拔", "國際參賽", "總會消息"]],
      ["date", "發布日期", "date", ""],
      ["summary", "公告摘要", "textarea", "顯示於公告列表的簡短說明"],
      ["body", "公告內文", "textarea", "請輸入完整公告內容"],
      ["cover", "封面圖片", "file", "image/*"],
      ["attachment", "附件", "file", ".pdf,.doc,.docx,.xls,.xlsx"]
    ]
  },
  "admin/events": {
    label: "賽事管理",
    singular: "賽事",
    description: "集中維護賽事日期、地點、規程、報名與成績資料。",
    rows: [
      { title: "2026 WDF 亞太盃中華台北代表隊選拔賽", category: "硬式飛鏢", date: "2026-08-15", status: "published", updated: "今天 09:15" },
      { title: "114學年師生盃全國各級學校飛鏢錦標賽", category: "電子飛鏢", date: "2026-03-14", status: "review", updated: "昨天 14:08" },
      { title: "全國青少年飛鏢交流賽", category: "硬式飛鏢", date: "2026-11-08", status: "scheduled", updated: "9月23日" }
    ],
    fields: [
      ["title", "賽事名稱", "text", "請輸入賽事完整名稱"],
      ["category", "賽事項目", "select", ["硬式飛鏢", "電子飛鏢", "綜合賽事"]],
      ["date", "開始日期", "date", ""],
      ["end_date", "結束日期", "date", ""],
      ["venue", "賽事地點", "text", "場館與地址"],
      ["registration_url", "報名網址", "url", "https://"],
      ["summary", "賽事說明", "textarea", "賽事對象、組別與重要時程"],
      ["attachment", "競賽規程", "file", ".pdf,.doc,.docx"]
    ]
  },
  "admin/media": {
    label: "影音管理",
    singular: "影音",
    description: "管理 YouTube 或 Facebook 影音連結及前台縮圖。",
    rows: [
      { title: "2026 WDF 亞太盃代表隊選拔賽", category: "代表隊", date: "2026-08-15", status: "published", updated: "今天 11:02" },
      { title: "WDF 世界盃中華台北代表隊紀錄", category: "國際賽事", date: "2025-09-26", status: "published", updated: "9月24日" },
      { title: "CTDF 活動與賽事影音", category: "總會影音", date: "2026-09-20", status: "draft", updated: "9月20日" }
    ],
    fields: [
      ["title", "影音標題", "text", "請輸入影片標題"],
      ["category", "影音分類", "select", ["代表隊", "國際賽事", "總會影音", "活動紀錄"]],
      ["date", "影音日期", "date", ""],
      ["media_url", "影音網址", "url", "YouTube 或 Facebook 網址"],
      ["summary", "影音說明", "textarea", "顯示於影音卡片的簡短說明"],
      ["thumbnail_url", "YouTube 自動縮圖", "thumbnail", ""],
      ["cover", "自訂縮圖", "file", "image/*"]
    ]
  },
  "admin/downloads": {
    label: "文件連結管理",
    singular: "文件連結",
    description: "管理外部文件網址、版本與分類，不在網站內儲存檔案。",
    rows: [
      { title: "113學年度國中暨高中飛鏢隊際聯賽規程", category: "競賽規程", date: "2025-04-24", status: "published", updated: "8月18日" },
      { title: "114學年師生盃報名與規程", category: "報名資訊", date: "2026-02-01", status: "review", updated: "8月12日" },
      { title: "年度會務報告", category: "會務報告", date: "2026-09-01", status: "draft", updated: "8月08日" }
    ],
    fields: [
      ["title", "文件名稱", "text", "請輸入對外顯示名稱"],
      ["category", "文件分類", "select", ["競賽規程", "報名資訊", "年度計畫", "會務報告"]],
      ["version", "文件版本", "text", "例如：v1.0"],
      ["date", "更新日期", "date", ""],
      ["summary", "文件說明", "textarea", "說明文件用途與適用對象"],
      ["document_url", "文件連結", "url", "https://"]
    ]
  },
  "admin/pages": {
    label: "頁面管理",
    singular: "頁面",
    description: "修改固定頁面的文字與圖片，版型仍由網站統一處理。",
    rows: [
      { title: "關於總會", category: "關於本會", date: "固定頁面", status: "published", updated: "8月30日" },
      { title: "組織架構", category: "關於本會", date: "固定頁面", status: "published", updated: "8月28日" },
      { title: "聯絡我們", category: "關於本會", date: "固定頁面", status: "review", updated: "8月27日" },
      { title: "隱私權政策", category: "網站政策", date: "固定頁面", status: "draft", updated: "8月22日" }
    ],
    fields: [
      ["title", "頁面標題", "text", "頁面標題"],
      ["category", "頁面位置", "select", ["關於本會", "網站政策", "聯絡資訊"]],
      ["summary", "頁面摘要", "textarea", "顯示於頁首的簡短說明"],
      ["body", "頁面內容", "textarea", "網站會自動套用固定版型"],
      ["cover", "頁面圖片", "file", "image/*"]
    ]
  }
};

const adminNav = [
  ["總覽", "/admin/", "admin"],
  ["公告", "/admin/news/", "admin/news"],
  ["賽事", "/admin/events/", "admin/events"],
  ["影音", "/admin/media/", "admin/media"],
  ["文件連結", "/admin/downloads/", "admin/downloads"],
  ["頁面", "/admin/pages/", "admin/pages"],
  ["網站設定", "/admin/settings/site/", "admin/settings/site"],
  ["操作紀錄", "/admin/logs/", "admin/logs"]
];

function adminSidebar(path) {
  return `<aside class="admin-sidebar" aria-label="後台功能">
    <div class="admin-sidebar-title">內容管理</div>
    <nav>${adminNav.map(([label, href, key]) => `<a href="${href}"${path === key ? ' class="active" aria-current="page"' : ""}>${label}</a>`).join("")}</nav>
    <div class="admin-user"><span>秘書處管理員</span><small>授權帳號</small></div>
  </aside>`;
}

function adminStatus(status) {
  const labels = { draft: "草稿", review: "待審核", approved: "已核准匯出", scheduled: "已排程", published: "已發布", archived: "已封存" };
  return `<span class="status-badge status-${status}" data-status-label>${labels[status] || status}</span>`;
}

function adminField([name, label, type, option]) {
  if (type === "select") {
    return `<label class="admin-field"><span>${label}</span><select name="${name}" required><option value="">請選擇</option>${option.map((value) => `<option>${value}</option>`).join("")}</select></label>`;
  }
  if (type === "textarea") {
    return `<label class="admin-field admin-field-wide"><span>${label}</span><textarea name="${name}" rows="${name === "body" ? 8 : 4}" placeholder="${option}"></textarea></label>`;
  }
  if (type === "file") {
    const hint = name === "cover" ? "圖片會保存於瀏覽器草稿，匯出時一併放入 ZIP。" : "附件會保存於瀏覽器草稿，匯出時一併放入 ZIP。";
    return `<label class="admin-field admin-field-wide"><span>${label}</span><input name="${name}" type="file" accept="${option}"><small>${hint}</small></label>`;
  }
  if (type === "thumbnail") {
    return `<div class="admin-field admin-field-wide"><span>${label}</span><input name="${name}" type="hidden"><div class="admin-thumbnail-preview" data-thumbnail-preview><div class="admin-thumbnail-frame"><img data-thumbnail-image alt="YouTube 影片縮圖" hidden><span data-thumbnail-placeholder>貼上 YouTube 網址後自動顯示縮圖</span></div><small data-thumbnail-status>Facebook 影片請使用下方的自訂縮圖。</small></div></div>`;
  }
  return `<label class="admin-field"><span>${label}</span><input name="${name}" type="${type}" placeholder="${option}"${name === "title" || name === "document_url" || name === "media_url" ? " required" : ""}></label>`;
}

function adminEditor(config) {
  return `<dialog class="admin-dialog" data-editor-dialog>
    <form class="admin-editor" data-editor-form>
      <div class="admin-dialog-head"><div><small>內容編輯</small><h2 data-editor-heading>新增${config.singular}</h2></div><button class="icon-button" type="button" data-close-editor aria-label="關閉">×</button></div>
      <div class="admin-form-grid">${config.fields.map(adminField).join("")}
        <label class="admin-field"><span>內容狀態</span><select name="status"><option value="draft">草稿</option><option value="review">待審核</option><option value="approved">已核准匯出</option><option value="scheduled">已排程</option><option value="published">已發布</option></select></label>
      </div>
      <div class="admin-form-actions"><button class="admin-button secondary" type="button" data-preview>預覽</button><span class="action-spacer"></span><button class="admin-button secondary" type="button" data-save-draft>儲存草稿</button><button class="admin-button" type="button" data-submit-review>送交審核</button><button class="admin-button publish" type="submit">核准並匯出 ZIP</button></div>
    </form>
  </dialog>
  <dialog class="admin-dialog preview-dialog" data-preview-dialog>
    <div class="admin-dialog-head"><div><small>前台版型預覽</small><h2 data-preview-title>內容預覽</h2></div><button class="icon-button" type="button" data-close-preview aria-label="關閉">×</button></div>
    <div class="preview-surface"><img class="admin-preview-thumbnail" data-preview-thumbnail alt="影音縮圖預覽" hidden><span class="tag" data-preview-category>分類</span><h1 data-preview-heading>尚未輸入標題</h1><p data-preview-summary>填寫內容後即可在此確認前台呈現方式。</p><div class="preview-body" data-preview-body></div></div>
  </dialog>`;
}

function adminModuleContent(path, config) {
  return `<div class="admin-page-head"><div><p class="admin-kicker">內容管理</p><h1>${config.label}</h1><p>${config.description}</p></div><div class="admin-head-actions"><label class="admin-button secondary import-button">匯入 ZIP<input type="file" accept=".zip,application/zip" data-import-package></label><button class="admin-button" type="button" data-new>＋ 新增${config.singular}</button></div></div>
    <section class="admin-panel">
      <div class="admin-toolbar"><label class="admin-search"><span class="sr-only">搜尋</span><input type="search" placeholder="搜尋標題或分類" data-search></label><label><span class="sr-only">狀態篩選</span><select data-status-filter><option value="">全部狀態</option><option value="draft">草稿</option><option value="review">待審核</option><option value="approved">已核准匯出</option><option value="scheduled">已排程</option><option value="published">已發布</option></select></label><span class="admin-count" data-count>${config.rows.length} 筆內容</span></div>
      <div class="admin-table-wrap"><table class="admin-table"><thead><tr><th>標題</th><th>分類</th><th>日期</th><th>狀態</th><th>最後更新</th><th><span class="sr-only">操作</span></th></tr></thead><tbody data-content-rows>${config.rows.map((row, index) => `<tr data-row data-id="seed-${path.replaceAll("/", "-")}-${index + 1}" data-status="${row.status}"><td><b>${htmlEscape(row.title)}</b></td><td>${htmlEscape(row.category)}</td><td>${htmlEscape(row.date)}</td><td>${adminStatus(row.status)}</td><td>${htmlEscape(row.updated)}</td><td><button class="table-action" type="button" data-edit>編輯</button></td></tr>`).join("")}</tbody></table></div>
      <div class="admin-empty" data-empty hidden>找不到符合條件的內容。</div>
    </section>${adminEditor(config)}`;
}

function adminDashboardContent() {
  return `<div class="admin-page-head"><div><p class="admin-kicker">內容管理</p><h1>後台總覽</h1><p>查看待辦內容、草稿與近期發布狀態。核准匯出的內容仍須依發布流程上線。</p></div><a class="admin-button" href="/admin/news/">＋ 新增公告</a></div>
    <div class="admin-metrics"><article><span>待審核</span><b>3</b><small>公告、賽事與文件連結</small></article><article><span>草稿</span><b>5</b><small>尚未送審內容</small></article><article><span>已排程</span><b>1</b><small>未來七日發布</small></article><article><span>本月發布</span><b>8</b><small>公開內容更新</small></article></div>
    <div class="admin-dashboard-grid"><section class="admin-panel"><div class="admin-panel-head"><h2>待辦事項</h2><span>依優先順序</span></div><div class="task-list"><a href="/admin/news/"><span class="task-dot red"></span><span><b>師生盃公告等待審核</b><small>公告管理 · 昨天 16:40</small></span><strong>審核</strong></a><a href="/admin/events/"><span class="task-dot green"></span><span><b>確認賽事報名截止日期</b><small>賽事管理 · 昨天 14:08</small></span><strong>處理</strong></a><a href="/admin/downloads/"><span class="task-dot gold"></span><span><b>規程連結等待發布</b><small>文件連結管理 · 8月12日</small></span><strong>檢視</strong></a></div></section><section class="admin-panel"><div class="admin-panel-head"><h2>快速新增</h2><span>選擇內容類型</span></div><div class="admin-quick-grid"><a href="/admin/news/">公告</a><a href="/admin/events/">賽事</a><a href="/admin/media/">影音</a><a href="/admin/downloads/">文件連結</a></div></section></div>`;
}

function adminSettingsContent() {
  return `<div class="admin-page-head"><div><p class="admin-kicker">系統設定</p><h1>網站基本設定</h1><p>管理全站共用的名稱、聯絡方式與社群連結。</p></div></div><form class="admin-panel admin-settings" data-settings-form><div class="admin-panel-head"><h2>基本資料</h2><span>套用於頁首、頁尾與聯絡頁</span></div><div class="admin-form-grid"><label class="admin-field admin-field-wide"><span>網站名稱</span><input name="site_name" value="中華民國競技飛鏢總會"></label><label class="admin-field"><span>電話</span><input name="phone" value="+886 2 2732 1422"></label><label class="admin-field"><span>Email</span><input name="email" type="email" value="ctdf0306@gmail.com"></label><label class="admin-field admin-field-wide"><span>地址</span><input name="address" value="臺北市南港區松河街384號5樓"></label><label class="admin-field admin-field-wide"><span>Facebook 網址</span><input name="facebook" type="url" value="https://www.facebook.com/CTDFTW/"></label></div><div class="admin-form-actions"><span class="action-spacer"></span><button class="admin-button" type="submit">儲存設定</button></div></form>`;
}

function adminLogsContent() {
  const logs = [["今天 11:02", "秘書處管理員", "發布", "影音：2026 WDF 亞太盃代表隊選拔賽"], ["今天 10:24", "秘書處管理員", "修改", "公告：代表隊選拔賽開放報名"], ["昨天 16:40", "內容編輯", "送審", "公告：114學年師生盃錦標賽"], ["昨天 14:08", "賽事管理員", "修改", "賽事：114學年師生盃錦標賽"]];
  return `<div class="admin-page-head"><div><p class="admin-kicker">系統紀錄</p><h1>操作紀錄</h1><p>重要新增、修改、送審與發布動作會保留於此。</p></div></div><section class="admin-panel"><div class="admin-table-wrap"><table class="admin-table"><thead><tr><th>時間</th><th>管理者</th><th>動作</th><th>內容</th></tr></thead><tbody>${logs.map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join("")}</tr>`).join("")}</tbody></table></div></section>`;
}

function adminLoginHtml(route) {
  return `<!doctype html><html lang="zh-Hant"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${htmlEscape(route.title)} | CTDF Admin</title><meta name="robots" content="noindex, nofollow"><link rel="stylesheet" href="/assets/demo.css"></head><body class="admin-login-page" data-admin-path="admin/login" data-admin-login><main class="login-shell"><section class="login-brand"><img src="/assets/ctdf-logo.png" alt="CTDF"><p>中華民國競技飛鏢總會</p><h1>內容管理平台</h1><span>管理平台採瀏覽器本機草稿與 ZIP 上架包，核准內容須依正式發布流程上線。</span></section><section class="login-panel"><div><p class="admin-kicker">ADMIN PORTAL</p><h2>登入管理平台</h2><p>請使用授權的管理帳號進入內容製作介面。</p></div><form data-login-form><label class="admin-field"><span>帳號</span><input name="account" autocomplete="username" required placeholder="請輸入帳號"></label><label class="admin-field"><span>密碼</span><input name="password" type="password" autocomplete="current-password" required placeholder="請輸入密碼"></label><p class="login-error" data-login-error hidden>帳號或密碼不正確。</p><button class="admin-button" type="submit">登入</button></form><section class="login-documents" aria-labelledby="login-documents-title"><h3 id="login-documents-title">管理者操作手冊</h3><a href="/output/pdf/CTDF_HiNet_Vercel_DNS_操作手冊_v1.0.pdf" target="_blank" rel="noopener noreferrer">HiNet DNS 與 Vercel 網域設定操作手冊</a><a href="/output/pdf/CTDF_第一版無資料庫後台流程_v1.0.pdf" target="_blank" rel="noopener noreferrer">第一版無資料庫後台流程</a><a href="/output/pdf/CTDF_網站內容上下架操作手冊_v1.2.pdf" target="_blank" rel="noopener noreferrer">網站內容上下架操作手冊</a></section><small class="login-security-note">管理平台僅供授權人員使用。請勿共用帳號或將密碼寫入公開文件。</small></section></main><script src="/assets/admin-demo.js"></script></body></html>`;
}

function adminHtml(route) {
  if (route.path === "admin/login") return adminLoginHtml(route);
  const content = route.path === "admin" ? adminDashboardContent() : route.path === "admin/settings/site" ? adminSettingsContent() : route.path === "admin/logs" ? adminLogsContent() : adminModules[route.path] ? adminModuleContent(route.path, adminModules[route.path]) : adminDashboardContent();
  return `<!doctype html><html lang="zh-Hant"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${htmlEscape(route.title)} | CTDF Admin</title><meta name="robots" content="noindex, nofollow"><link rel="stylesheet" href="/assets/demo.css"></head><body class="admin-page" data-admin-path="${route.path}"><header class="admin-topbar"><a class="admin-brand" href="/admin/"><img src="/assets/ctdf-logo.png" alt="CTDF"><span><b>CTDF 後台管理</b><small>瀏覽器草稿模式</small></span></a><div><span class="admin-badge">管理平台</span><a class="view-site" href="/">查看前台</a><button class="logout-button" type="button" data-logout>登出</button></div></header><div class="admin-shell">${adminSidebar(route.path)}<main class="admin-main">${content}</main></div><div class="admin-toast" role="status" aria-live="polite" data-toast></div><script src="/assets/admin-demo.js"></script></body></html>`;
}

function pageHtml(route) {
  const root = route.path.split("/")[0];
  if (root === "admin") return adminHtml(route);
  const bodyClass = route.path === "media/videos" ? "video-page" : "";
  return `<!doctype html>
<html lang="zh-Hant">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${htmlEscape(route.title)} | 中華民國競技飛鏢總會</title>
  <link rel="stylesheet" href="/assets/demo.css">
</head>
<body class="${bodyClass}">
  <header class="site-header">
    <nav class="nav" aria-label="主要導覽">
      <a class="brand" href="/"><img class="brand-logo" src="/assets/ctdf-logo.png" alt="CTDF Logo"><span><b>中華民國競技飛鏢總會</b><small>Official Website</small></span></a>
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
          <h2>${htmlEscape(route.title)}</h2>
          <p>本區依資料性質呈現，公開內容以總會最新公告及核定資料為準。</p>
        </div>
        ${renderContent(root, route.path)}
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

function portalHtml() {
  const portals = [
    ["WDF & 國際賽事", "代表隊參賽、國際新聞、WDF 世界盃成果", "/news/"],
    ["CTDF 賽事系統", "賽事公告、報名時程、競賽規程與賽果", "/events/"],
    ["文件與規章", "報名表、規章與公告文件的外部連結", "/downloads/"]
  ];
  return `<section class="portal-band">
    <div class="section-inner">
      <div class="portal-head">
        <p class="eyebrow">Competition Portal</p>
        <h2>競技飛鏢資訊入口</h2>
      </div>
      <div class="portal-grid">
        ${portals.map(([title, text, href]) => `<a class="portal-card" href="${href}"><span>${title}</span><p>${text}</p></a>`).join("")}
      </div>
    </div>
  </section>`;
}

function wdfMembershipHtml() {
  return `<section class="wdf-band">
    <div class="section-inner">
      <div class="wdf-card">
        <div class="wdf-logo-wrap">
          <img src="/assets/wdf-logo.png" alt="World Darts Federation Logo">
        </div>
        <div>
          <p class="eyebrow">World Darts Federation Member</p>
          <h2>WDF 中華民國代表會員</h2>
          <p>中華民國競技飛鏢總會為 World Darts Federation（WDF）會員代表，負責推動中華民國競技飛鏢與國際賽事、代表隊參賽及國際交流接軌。</p>
          <a class="text-link" href="${sources.wdfMembers}" target="_blank" rel="noopener noreferrer">查看 WDF Members</a>
        </div>
      </div>
    </div>
  </section>`;
}

function homeHtml() {
  return `<!doctype html>
<html lang="zh-Hant">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>中華民國競技飛鏢總會(審查版)</title>
  <link rel="stylesheet" href="/assets/demo.css">
</head>
<body>
  <header class="site-header">
    <nav class="nav" aria-label="主要導覽">
      <a class="brand" href="/"><img class="brand-logo" src="/assets/ctdf-logo.png" alt="CTDF Logo"><span><b>中華民國競技飛鏢總會</b><small>Official Website</small></span></a>
      <div class="nav-links">${navHtml()}</div>
    </nav>
  </header>
  <main>
    <section class="home-hero">
      <div class="home-hero-inner">
        <div>
          <p class="eyebrow">Official Website</p>
          <h1>中華民國競技飛鏢總會(審查版)</h1>
          <p>提供總會公告、賽事資訊、文件連結、國際交流與會務公開資訊。</p>
        </div>
        <div class="target-panel" aria-label="CTDF 視覺識別">
          <img class="hero-logo" src="/assets/ctdf-logo.png" alt="CTDF Logo">
          <div class="stat-row">
            <a href="/about/"><b>關於</b>本會</a>
            <a href="/news/"><b>公告</b>列表</a>
            <a href="/events/"><b>賽事</b>資訊</a>
          </div>
        </div>
      </div>
    </section>
    ${wdfMembershipHtml()}
    ${portalHtml()}
    ${homeSection("最新公告", "/news/", renderNews())}
    ${homeSection("賽事資訊", "/events/", renderEvents())}
    ${homeSection("文件連結", "/downloads/", renderDownloads())}
    ${homeSection("關於總會", "/about/", renderAbout())}
  </main>
  ${footerHtml()}
</body>
</html>`;
}

const css = `:root{--ink:#142033;--muted:#667085;--line:#d9e1ec;--paper:#fff;--wash:#f4f7fb;--navy:#153a6b;--red:#c92c35;--green:#187a58;--gold:#ffd166;font-family:"Noto Sans TC","Microsoft JhengHei","PingFang TC",system-ui,sans-serif}*{box-sizing:border-box}body{margin:0;color:var(--ink);background:var(--wash);letter-spacing:0}a{color:inherit;text-decoration:none}.site-header{position:sticky;top:0;z-index:5;border-bottom:1px solid var(--line);background:rgba(255,255,255,.94);backdrop-filter:blur(14px)}.nav{display:flex;align-items:center;justify-content:space-between;gap:18px;width:min(1180px,calc(100% - 32px));min-height:72px;margin:0 auto}.brand{display:flex;align-items:center;gap:12px;min-width:0}.brand-logo{width:74px;height:44px;object-fit:contain;border-radius:6px;background:#fff}.brand b,.brand small{display:block}.brand small{color:var(--muted);font-size:12px}.nav-links{display:flex;gap:16px;color:#344054;font-size:14px;font-weight:800}.home-hero,.page-hero{color:#fff;background:linear-gradient(105deg,rgba(10,23,43,.96),rgba(21,58,107,.88)),linear-gradient(135deg,#0a172b,#153a6b 60%,#c92c35 130%)}.home-hero-inner,.page-hero-inner,.section-inner{width:min(1180px,calc(100% - 32px));margin:0 auto}.home-hero-inner,.page-hero-inner{display:grid;grid-template-columns:minmax(0,1fr) minmax(300px,430px);gap:34px;align-items:center}.home-hero-inner{padding:76px 0}.page-hero-inner{padding:66px 0}.hero-art{justify-self:end;width:min(430px,100%);opacity:.98}.hero-art svg{display:block;width:100%;height:auto}.title-icon{display:inline-grid;place-items:center;flex:0 0 auto;width:76px;height:76px;margin-right:16px;border:1px solid rgba(255,255,255,.22);border-radius:8px;background:rgba(255,255,255,.1)}.title-icon svg{width:62px;height:58px}.eyebrow{margin:0 0 14px;color:var(--gold);font-weight:900}.home-hero h1,.page-hero h1{max-width:860px;margin:0 0 18px;font-size:clamp(36px,6vw,72px);line-height:1.06}.page-hero h1{display:flex;align-items:center}.home-hero p,.page-hero p{max-width:720px;color:#dbe7f6;font-size:18px;line-height:1.75}.actions{display:flex;flex-wrap:wrap;gap:10px;margin-top:24px}.button{display:inline-flex;align-items:center;justify-content:center;min-height:44px;padding:0 15px;border-radius:8px;background:#c92c35;color:#fff;font-weight:900}.button.secondary{border:1px solid rgba(255,255,255,.3);background:rgba(255,255,255,.1)}.target-panel{padding:0;background:transparent}.hero-logo{display:block;width:min(360px,100%);margin:0 auto 18px;border-radius:8px;background:#fff;box-shadow:0 12px 30px rgba(0,0,0,.22)}.stat-row{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}.stat-row span{border-radius:8px;background:rgba(255,255,255,.13);padding:12px;color:#dbe7f6;font-size:12px}.stat-row b{display:block;color:var(--gold);font-size:18px}.section{padding:52px 0}.section.alt{background:#fff}.section.real-data{background:#eef4fb}.section-head{display:flex;align-items:end;justify-content:space-between;gap:18px;margin-bottom:20px}.section-head h2{margin:0;font-size:28px}.section-head p{max-width:720px;margin:0;color:var(--muted);line-height:1.7}.text-link,.news-item a,.event-item a,.ranking-table a,.player-row a,.download-row a,.about-block a{color:var(--navy);font-weight:900;text-decoration:underline;text-underline-offset:3px}.news-list,.event-list,.player-list,.download-list{display:grid;gap:12px}.news-item,.event-item,.player-row,.download-row{display:grid;grid-template-columns:minmax(150px,.25fr) minmax(0,1fr) auto;gap:14px 22px;align-items:center;border:1px solid var(--line);border-radius:8px;background:#fff;padding:18px;box-shadow:0 10px 28px rgba(20,32,51,.06)}.news-item time,.event-date{color:var(--red);font-weight:900}.tag,.file-badge{display:inline-flex;width:max-content;margin-bottom:8px;border-radius:999px;background:#eef4fb;color:var(--navy);padding:5px 9px;font-size:12px;font-weight:900}.news-item h3,.event-item h3,.player-row h3,.download-row h3,.about-block h3{margin:0 0 8px;font-size:20px;line-height:1.35}.news-item p,.event-item p,.player-row p,.download-row p,.about-block p{margin:0;color:var(--muted);line-height:1.65}.table-wrap{overflow:auto;border:1px solid var(--line);border-radius:8px;background:#fff;box-shadow:0 10px 28px rgba(20,32,51,.06)}.ranking-table{width:100%;border-collapse:collapse;min-width:780px}.ranking-table th,.ranking-table td{padding:16px;border-bottom:1px solid var(--line);text-align:left;vertical-align:top}.ranking-table th{background:#f8fafc;color:var(--navy);font-size:13px}.ranking-table tr:last-child td{border-bottom:0}.player-row{grid-template-columns:auto minmax(0,1fr) minmax(240px,.35fr) auto}.avatar{display:grid;place-items:center;width:56px;height:56px;border-radius:50%;background:#153a6b;color:#fff;font-size:12px;font-weight:900}.player-row dl{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:0}.player-row dt{color:var(--muted);font-size:12px;font-weight:900}.player-row dd{margin:3px 0 0}.download-row{grid-template-columns:auto minmax(0,1fr) auto}.about-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.about-block{border:1px solid var(--line);border-radius:8px;background:#fff;padding:20px;box-shadow:0 10px 28px rgba(20,32,51,.06)}.link-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}.link-card{display:grid;gap:7px;min-height:88px;padding:15px;border:1px solid var(--line);border-radius:8px;background:#fff;box-shadow:0 10px 28px rgba(20,32,51,.06)}.link-card.current{border-color:rgba(201,44,53,.45);box-shadow:0 12px 28px rgba(201,44,53,.12)}.link-card b{color:var(--navy);font-size:14px}.link-card span{color:var(--muted);font-size:14px;line-height:1.45}.footer{padding:28px 16px;color:#dbe7f6;background:#0a172b;font-size:14px}.footer-inner{display:flex;align-items:center;justify-content:center;flex-wrap:wrap;gap:10px 18px;width:min(1180px,calc(100% - 32px));margin:0 auto;text-align:center}.footer b{color:#fff}.footer a{color:#fff;text-decoration:underline;text-underline-offset:3px}.footer-note{color:#98a8bd}@media (max-width:900px){.nav{align-items:flex-start;flex-direction:column;padding:14px 0}.nav-links{width:100%;overflow-x:auto;padding-bottom:4px}.home-hero-inner,.page-hero-inner,.about-grid,.link-grid{grid-template-columns:1fr}.hero-art{justify-self:start;width:min(360px,100%)}.page-hero h1{align-items:flex-start}.title-icon{width:58px;height:58px;margin-right:12px}.title-icon svg{width:46px;height:44px}.news-item,.event-item,.player-row,.download-row{grid-template-columns:1fr;align-items:start}.player-row dl{grid-template-columns:1fr}.section-head{align-items:start;flex-direction:column}.home-hero-inner,.page-hero-inner{padding:52px 0}.home-hero h1,.page-hero h1{font-size:clamp(34px,10vw,52px)}.footer-inner{align-items:flex-start;flex-direction:column;text-align:left}}`;

const cssEnhancements = `body{background:#f5f8fc}.site-header{border-top:4px solid #d83a45;box-shadow:0 8px 24px rgba(20,32,51,.06)}.nav-links a{position:relative;padding:8px 0}.nav-links a:after{content:"";position:absolute;left:0;right:0;bottom:0;height:3px;border-radius:999px;background:#d83a45;transform:scaleX(0);transform-origin:left;transition:transform .18s ease}.nav-links a:hover:after{transform:scaleX(1)}.home-hero,.page-hero{position:relative;overflow:hidden;color:#142033;border-bottom:1px solid #dfe8f4}.home-hero{background:linear-gradient(90deg,rgba(255,255,255,.9) 0%,rgba(246,250,255,.82) 48%,rgba(255,246,247,.74) 100%),url("/assets/ctdf-world-cup-2025.jpg") center 38%/cover no-repeat}.page-hero{background:radial-gradient(circle at 84% 22%,rgba(21,58,107,.14),transparent 28%),radial-gradient(circle at 10% 88%,rgba(24,122,88,.12),transparent 30%),linear-gradient(135deg,#f9fcff 0%,#eef6ff 52%,#fff1f3 100%)}.home-hero:after,.page-hero:after{content:"";position:absolute;left:0;right:0;bottom:0;height:8px;background:linear-gradient(90deg,#d83a45,#f6c85f,#61b99a,#2f6fb0);opacity:.9}.home-hero-inner,.page-hero-inner{position:relative;z-index:1}.home-hero p,.page-hero p{color:#475467}.eyebrow{color:#2f6fb0}.title-icon{border-color:#d9e7f7;background:#fff;box-shadow:0 10px 24px rgba(21,58,107,.08)}.target-panel{position:relative}.target-panel:before{content:"";position:absolute;inset:-18px;border:1px solid rgba(223,232,244,.9);border-radius:8px;background:rgba(255,255,255,.72);box-shadow:0 18px 42px rgba(21,58,107,.12);z-index:-1}.hero-logo{box-shadow:0 16px 34px rgba(21,58,107,.16)}.stat-row span{background:rgba(255,255,255,.82);color:#475467;border:1px solid #dfe8f4}.stat-row b{color:#2f6fb0}.button{background:#d83a45;box-shadow:0 12px 22px rgba(216,58,69,.18)}.button.secondary{border:1px solid #bfd2e8;background:rgba(255,255,255,.88);color:#153a6b}.portal-band{padding:46px 0;background:linear-gradient(135deg,#f0f7ff 0%,#fff7f7 52%,#f2fbf6 100%);color:#142033;border-top:0;border-bottom:1px solid #dfe8f4}.portal-head{display:flex;align-items:flex-end;justify-content:space-between;gap:18px;margin-bottom:18px}.portal-head h2{max-width:620px;margin:0;font-size:30px;line-height:1.25}.portal-head .eyebrow{margin:0;color:#2f6fb0}.portal-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px}.portal-card{position:relative;display:grid;align-content:start;gap:10px;min-height:150px;padding:18px;border:1px solid #dfe8f4;border-radius:8px;background:#fff;box-shadow:0 16px 34px rgba(21,58,107,.08);overflow:hidden}.portal-card:nth-child(1){background:#edf5ff}.portal-card:nth-child(2){background:#fff0f1}.portal-card:nth-child(3){background:#eaf8f1}.portal-card:nth-child(4){background:#fff5db}.portal-card:before{content:"";position:absolute;left:0;top:0;bottom:0;width:4px;background:#2f6fb0}.portal-card:nth-child(2):before{background:#d83a45}.portal-card:nth-child(3):before{background:#61b99a}.portal-card:nth-child(4):before{background:#f6c85f}.portal-card span{position:relative;color:#153a6b;font-size:20px;font-weight:900;line-height:1.35}.portal-card p{position:relative;margin:0;color:#526277;line-height:1.6}.portal-card:hover{border-color:#b9cce4;transform:translateY(-2px)}.section{background:#fff}.section:nth-of-type(3n){background:#f0f7ff}.section:nth-of-type(3n+1){background:#fff7f7}.section:nth-of-type(3n+2){background:#f2fbf6}.section.alt{background:#fffdf6}.section.real-data{background:#eef6ff}.section-head h2{position:relative;padding-left:14px}.section-head h2:before{content:"";position:absolute;left:0;top:.18em;bottom:.18em;width:4px;border-radius:999px;background:#d83a45}.news-item,.event-item,.player-row,.download-row,.about-block,.link-card,.table-wrap{position:relative;overflow:hidden;border-color:#d7e3f0;box-shadow:0 12px 28px rgba(21,58,107,.07)}.news-item:before,.event-item:before,.player-row:before,.download-row:before,.about-block:before,.link-card:before{content:"";position:absolute;left:0;top:0;bottom:0;width:4px;background:#d83a45}.event-item:before{background:#61b99a}.player-row:before{background:#2f6fb0}.download-row:before{background:#f6c85f}.about-block:before,.link-card:before{background:#9db8d8}.ranking-table th{background:#dfeeff;color:#153a6b}.ranking-table tbody tr:nth-child(even){background:#f8fbff}.avatar{box-shadow:inset 0 0 0 4px rgba(255,255,255,.38);background:linear-gradient(135deg,#2f6fb0,#61b99a)}.tag,.file-badge{border:1px solid rgba(21,58,107,.12);background:#edf5ff}.footer{background:#edf4fb;color:#475467;border-top:1px solid #dfe8f4}.footer b,.footer a{color:#153a6b}.footer-note{color:#7a8ba1}@media (max-width:900px){.home-hero{background:linear-gradient(180deg,rgba(255,255,255,.92),rgba(246,250,255,.86)),url("/assets/ctdf-world-cup-2025.jpg") center top/cover no-repeat}.portal-head{align-items:flex-start;flex-direction:column}.portal-grid{grid-template-columns:1fr 1fr}.target-panel:before{inset:-10px}}@media (max-width:640px){.portal-grid{grid-template-columns:1fr}.portal-card{min-height:auto}}`;

const cssWdfEnhancements = `.wdf-band{padding:40px 0;background:linear-gradient(135deg,#fffdf8 0%,#eef6ff 100%);border-bottom:1px solid #dfe8f4}.wdf-card{display:grid;grid-template-columns:190px minmax(0,1fr);gap:28px;align-items:center;padding:24px;border:1px solid #d7e3f0;border-radius:8px;background:rgba(255,255,255,.84);box-shadow:0 16px 34px rgba(21,58,107,.08)}.wdf-logo-wrap{display:grid;place-items:center;min-height:150px;border-radius:8px;background:#fff;border:1px solid #e2ebf5}.wdf-logo-wrap img{display:block;width:min(145px,100%);height:auto}.wdf-card h2{margin:0 0 10px;color:#153a6b;font-size:30px}.wdf-card p:not(.eyebrow){max-width:760px;margin:0 0 14px;color:#526277;line-height:1.75}@media (max-width:900px){.wdf-card{grid-template-columns:1fr}.wdf-logo-wrap{justify-content:start;min-height:auto;padding:18px}}`;

const cssCompactListEnhancements = `.item-title-row{display:flex;align-items:center;gap:12px;margin-bottom:8px}.item-title-row .tag{flex:0 0 auto;margin-bottom:0}.item-title-row h3{margin:0}.news-item,.event-item{padding:16px 18px}.news-item p,.event-item p{line-height:1.55}@media (max-width:640px){.item-title-row{align-items:flex-start;flex-direction:column;gap:7px}}`;

const cssFeaturedThumbEnhancements = `.news-item.has-thumb,.event-item.has-thumb{grid-template-columns:150px minmax(128px,.16fr) minmax(0,1fr) auto}.item-thumb{display:block;width:150px;aspect-ratio:4/3;object-fit:cover;border-radius:8px;border:1px solid #d7e3f0;background:#fff}@media (max-width:900px){.news-item.has-thumb,.event-item.has-thumb{grid-template-columns:150px minmax(0,1fr);align-items:start}.news-item.has-thumb time,.event-item.has-thumb .event-date{grid-column:2}.news-item.has-thumb>div:not(.event-body),.event-item.has-thumb .event-body{grid-column:1 / -1}.news-item.has-thumb>a,.event-item.has-thumb>a{grid-column:1 / -1}}@media (max-width:640px){.news-item.has-thumb,.event-item.has-thumb{grid-template-columns:1fr}.item-thumb{width:100%;max-width:360px}.news-item.has-thumb time,.event-item.has-thumb .event-date,.news-item.has-thumb>div:not(.event-body),.event-item.has-thumb .event-body{grid-column:auto}}`;

const cssCompactHeroEnhancements = `.page-hero-inner{grid-template-columns:minmax(0,1fr) minmax(180px,280px);gap:26px;padding:36px 0}.page-hero h1{margin-bottom:10px;font-size:clamp(30px,4vw,48px)}.page-hero p{font-size:16px;line-height:1.55}.page-hero .eyebrow{margin-bottom:10px;font-size:14px}.page-hero .hero-art{width:min(280px,100%)}.page-hero .title-icon{width:56px;height:56px;margin-right:14px}.page-hero .title-icon svg{width:44px;height:42px}.section.real-data{padding-top:38px}.section-head h2{font-size:24px}.section-head p{font-size:14px;line-height:1.55}@media (max-width:900px){.page-hero-inner{grid-template-columns:1fr;padding:34px 0}.page-hero .hero-art{display:none}.page-hero h1{font-size:clamp(28px,8vw,42px)}.section.real-data{padding-top:34px}}`;

const cssHomeTitleEnhancements = `.home-hero-inner{align-items:start;padding:62px 0 68px}.home-hero h1{max-width:none;font-size:clamp(42px,4.2vw,64px);line-height:1.08;white-space:nowrap}.home-hero p{font-size:17px}.target-panel{margin-top:-2px}@media (max-width:1180px){.home-hero h1{font-size:clamp(38px,4vw,54px)}}@media (max-width:900px){.home-hero-inner{padding:52px 0}.home-hero h1{white-space:normal;font-size:clamp(34px,9vw,48px)}}`;

const cssFixedFooterEnhancements = `body{padding-bottom:74px}.footer{position:fixed;left:0;right:0;bottom:0;z-index:10;padding:14px 16px;background:rgba(237,244,251,.96);backdrop-filter:blur(12px);box-shadow:0 -10px 28px rgba(21,58,107,.08)}.footer-inner{justify-content:center;gap:8px 18px}.footer-note{white-space:nowrap}@media (max-width:900px){body{padding-bottom:138px}.footer{padding:12px 16px}.footer-inner{gap:6px 12px;font-size:13px}.footer-note{white-space:normal}}`;

const cssDropdownNavEnhancements = `.nav-links{align-items:center}.nav-item{position:relative}.nav-trigger{display:inline-flex;align-items:center;min-height:38px}.nav-item>.nav-trigger:after{content:"";width:0;height:0;margin-left:6px;border-left:4px solid transparent;border-right:4px solid transparent;border-top:5px solid currentColor;opacity:.62}.nav-menu{position:absolute;top:100%;left:50%;min-width:230px;padding:8px;border:1px solid #d7e3f0;border-radius:8px;background:rgba(255,255,255,.98);box-shadow:0 18px 38px rgba(21,58,107,.16);transform:translate(-50%,8px);opacity:0;pointer-events:none;transition:opacity .16s ease,transform .16s ease}.nav-menu a{display:block;padding:10px 12px;border-radius:7px;color:#153a6b;line-height:1.35;white-space:nowrap}.nav-menu a:after{display:none}.nav-menu a:hover,.nav-menu a:focus{background:#edf5ff}.nav-item:hover .nav-menu,.nav-item:focus-within .nav-menu{opacity:1;pointer-events:auto;transform:translate(-50%,0)}@media (max-width:900px){.nav-links{align-items:flex-start;flex-wrap:wrap;overflow-x:visible}.nav-item{width:auto}.nav-menu{left:0;right:auto;transform:translate(0,8px)}.nav-item:hover .nav-menu,.nav-item:focus-within .nav-menu{transform:translate(0,0)}}`;

const cssMobileNavCorrection = `@media (max-width:900px){.nav-item:nth-last-child(-n+2) .nav-menu{left:auto;right:0}body{padding-bottom:0}.footer{position:static}}`;

const cssQuickLinksEnhancements = `.stat-row a{display:grid;place-items:center;min-height:58px;border:1px solid #dfe8f4;border-radius:8px;background:rgba(255,255,255,.82);padding:12px;color:#475467;text-align:center;transition:border-color .16s ease,box-shadow .16s ease,transform .16s ease}.stat-row a:hover,.stat-row a:focus-visible{border-color:#9db8d8;box-shadow:0 8px 18px rgba(21,58,107,.14);transform:translateY(-2px);outline:none}.stat-row a:focus-visible{box-shadow:0 0 0 3px rgba(47,111,176,.24),0 8px 18px rgba(21,58,107,.14)}`;

const cssVisiblePortalEnhancements = `.portal-grid{grid-template-columns:repeat(3,minmax(0,1fr))}@media (max-width:900px){.portal-grid{grid-template-columns:1fr 1fr}}@media (max-width:640px){.portal-grid{grid-template-columns:1fr}}`;

const cssVideoEnhancements = `.video-page{overflow-x:hidden}.video-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:30px 18px}.video-card{display:grid;align-content:start;color:var(--ink)}.video-thumb{position:relative;aspect-ratio:16/9;overflow:hidden;border:1px solid #d7e3f0;border-radius:8px;background:#fff;box-shadow:0 12px 28px rgba(21,58,107,.08)}.video-thumb img{width:100%;height:100%;object-fit:cover;transition:transform .22s ease}.video-card:hover .video-thumb img,.video-card:focus-visible .video-thumb img{transform:scale(1.035)}.video-play{position:absolute;left:50%;top:50%;width:58px;height:58px;border-radius:50%;background:#e52335;box-shadow:0 10px 26px rgba(229,35,53,.34);transform:translate(-50%,-50%)}.video-play:after{content:"";position:absolute;left:23px;top:18px;border-top:11px solid transparent;border-bottom:11px solid transparent;border-left:17px solid #fff}.video-meta{display:flex;align-items:center;gap:10px;margin:12px 0 8px;color:#7a8ba1;font-size:12px}.video-meta span{border:1px solid #bfd2e8;border-radius:999px;padding:4px 8px;background:#edf5ff;color:#153a6b}.video-card h3{margin:0 0 8px;color:#142033;font-size:19px;line-height:1.45}.video-card p{margin:0;color:#667085;line-height:1.65}.video-link{margin-top:12px;color:#c92c35;font-size:13px}.video-card:focus-visible{border-radius:8px;outline:3px solid rgba(47,111,176,.3);outline-offset:5px}@media (max-width:900px){.video-grid{grid-template-columns:1fr 1fr}}@media (max-width:640px){.video-grid{grid-template-columns:1fr}.video-play{width:52px;height:52px}.video-play:after{left:21px;top:16px}}`;

const cssAdminEnhancements = `.sr-only{position:absolute!important;width:1px!important;height:1px!important;padding:0!important;margin:-1px!important;overflow:hidden!important;clip:rect(0,0,0,0)!important;white-space:nowrap!important;border:0!important}.admin-page{min-height:100vh;padding:0;background:#f4f7fb;color:#172033}.admin-topbar{position:sticky;top:0;z-index:20;display:flex;align-items:center;justify-content:space-between;height:68px;padding:0 28px;border-top:4px solid #d83a45;border-bottom:1px solid #dce4ee;background:#fff;box-shadow:0 4px 18px rgba(20,32,51,.05)}.admin-brand{display:flex;align-items:center;gap:12px}.admin-brand img{width:64px;height:40px;object-fit:contain}.admin-brand b,.admin-brand small{display:block}.admin-brand small{margin-top:2px;color:#7a8ba1;font-size:12px}.admin-topbar>div{display:flex;align-items:center;gap:12px}.demo-badge{border-radius:999px;background:#fff1f2;color:#c92c35;padding:5px 9px;font-size:11px;font-weight:900}.view-site{color:#153a6b;font-size:14px;font-weight:800;text-decoration:underline;text-underline-offset:3px}.admin-shell{display:grid;grid-template-columns:220px minmax(0,1fr);min-height:calc(100vh - 68px)}.admin-sidebar{position:sticky;top:68px;display:flex;flex-direction:column;height:calc(100vh - 68px);border-right:1px solid #dce4ee;background:#fff;padding:24px 14px}.admin-sidebar-title{padding:0 12px 10px;color:#98a2b3;font-size:12px;font-weight:900}.admin-sidebar nav{display:grid;gap:3px}.admin-sidebar nav a{display:flex;align-items:center;min-height:42px;padding:0 12px;border-radius:7px;color:#46556a;font-size:14px;font-weight:800}.admin-sidebar nav a:hover{background:#f3f7fc;color:#153a6b}.admin-sidebar nav a.active{background:#e9f2fc;color:#153a6b;box-shadow:inset 3px 0 #2f6fb0}.admin-user{display:grid;gap:2px;margin-top:auto;padding:14px 12px 0;border-top:1px solid #e4eaf1;font-size:13px;font-weight:800}.admin-user small{color:#7a8ba1;font-weight:500}.admin-main{min-width:0;padding:34px clamp(20px,4vw,54px) 64px}.admin-page-head{display:flex;align-items:flex-end;justify-content:space-between;gap:24px;margin-bottom:24px}.admin-page-head h1{margin:2px 0 7px;font-size:30px;line-height:1.2}.admin-page-head p:not(.admin-kicker){max-width:680px;margin:0;color:#667085;line-height:1.55}.admin-kicker{margin:0;color:#2f6fb0;font-size:12px;font-weight:900}.admin-button{display:inline-flex;align-items:center;justify-content:center;min-height:42px;padding:0 15px;border:1px solid #153a6b;border-radius:7px;background:#153a6b;color:#fff;font:inherit;font-size:14px;font-weight:900;cursor:pointer;white-space:nowrap}.admin-button:hover{background:#0f2d55}.admin-button.secondary{border-color:#c8d5e4;background:#fff;color:#153a6b}.admin-button.publish{border-color:#187a58;background:#187a58}.icon-button{display:grid;place-items:center;width:38px;height:38px;border:0;border-radius:7px;background:#eef3f8;color:#344054;font-size:25px;cursor:pointer}.admin-panel{overflow:hidden;border:1px solid #dce4ee;border-radius:8px;background:#fff;box-shadow:0 10px 28px rgba(21,58,107,.06)}.admin-toolbar{display:flex;align-items:center;gap:10px;padding:14px 16px;border-bottom:1px solid #e5ebf2}.admin-toolbar input,.admin-toolbar select,.admin-field input,.admin-field select,.admin-field textarea{width:100%;border:1px solid #cfd9e6;border-radius:7px;background:#fff;color:#172033;font:inherit;font-size:14px;outline:none}.admin-toolbar input,.admin-toolbar select,.admin-field input,.admin-field select{height:42px;padding:0 11px}.admin-toolbar input:focus,.admin-toolbar select:focus,.admin-field input:focus,.admin-field select:focus,.admin-field textarea:focus{border-color:#2f6fb0;box-shadow:0 0 0 3px rgba(47,111,176,.15)}.admin-search{width:min(380px,50%)}.admin-count{margin-left:auto;color:#7a8ba1;font-size:13px}.admin-table-wrap{overflow:auto}.admin-table{width:100%;min-width:780px;border-collapse:collapse}.admin-table th,.admin-table td{padding:15px 16px;border-bottom:1px solid #e8edf3;text-align:left;vertical-align:middle}.admin-table th{background:#f8fafc;color:#526277;font-size:12px}.admin-table td{color:#526277;font-size:14px}.admin-table td:first-child{color:#172033}.admin-table tr:last-child td{border-bottom:0}.table-action{border:0;background:transparent;color:#2f6fb0;font:inherit;font-weight:900;cursor:pointer}.status-badge{display:inline-flex;align-items:center;border-radius:999px;padding:5px 9px;font-size:12px;font-weight:900;white-space:nowrap}.status-draft{background:#eef1f5;color:#526277}.status-review{background:#fff4d6;color:#8a5a00}.status-scheduled{background:#eaf1ff;color:#2b59a2}.status-published{background:#e9f8f1;color:#187a58}.status-archived{background:#f2eefa;color:#66508d}.admin-empty{padding:48px;text-align:center;color:#667085}.admin-metrics{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px;margin-bottom:18px}.admin-metrics article{display:grid;gap:7px;padding:18px;border:1px solid #dce4ee;border-radius:8px;background:#fff}.admin-metrics span{color:#526277;font-size:13px;font-weight:800}.admin-metrics b{color:#153a6b;font-size:30px}.admin-metrics small{color:#8a98aa}.admin-dashboard-grid{display:grid;grid-template-columns:minmax(0,1.6fr) minmax(280px,.8fr);gap:18px}.admin-panel-head{display:flex;align-items:center;justify-content:space-between;gap:14px;padding:17px 18px;border-bottom:1px solid #e5ebf2}.admin-panel-head h2{margin:0;font-size:18px}.admin-panel-head span{color:#8a98aa;font-size:12px}.task-list{display:grid}.task-list a{display:grid;grid-template-columns:auto minmax(0,1fr) auto;gap:12px;align-items:center;padding:16px 18px;border-bottom:1px solid #e8edf3}.task-list a:last-child{border-bottom:0}.task-list small{display:block;margin-top:4px;color:#8a98aa}.task-list strong{color:#2f6fb0;font-size:13px}.task-dot{width:9px;height:9px;border-radius:50%;background:#2f6fb0}.task-dot.red{background:#d83a45}.task-dot.green{background:#61b99a}.task-dot.gold{background:#e8ad2f}.admin-quick-grid{display:grid;grid-template-columns:1fr 1fr;gap:9px;padding:16px}.admin-quick-grid a{display:grid;place-items:center;min-height:72px;border:1px solid #dce4ee;border-radius:7px;background:#f8fafc;color:#153a6b;font-weight:900}.admin-quick-grid a:hover{border-color:#9db8d8;background:#edf5ff}.admin-dialog{width:min(860px,calc(100% - 28px));max-height:calc(100vh - 30px);padding:0;border:0;border-radius:8px;background:#fff;color:#172033;box-shadow:0 26px 80px rgba(12,26,45,.28)}.admin-dialog::backdrop{background:rgba(16,28,45,.58);backdrop-filter:blur(2px)}.admin-editor{margin:0}.admin-dialog-head{display:flex;align-items:center;justify-content:space-between;gap:20px;padding:18px 20px;border-bottom:1px solid #e5ebf2}.admin-dialog-head small{color:#2f6fb0;font-weight:900}.admin-dialog-head h2{margin:3px 0 0;font-size:22px}.admin-form-grid{display:grid;grid-template-columns:1fr 1fr;gap:17px 18px;padding:22px;overflow:auto}.admin-field{display:grid;align-content:start;gap:7px;color:#344054;font-size:13px;font-weight:800}.admin-field-wide{grid-column:1 / -1}.admin-field textarea{min-height:105px;padding:11px;resize:vertical;line-height:1.55}.admin-field input[type=file]{height:auto;padding:10px}.admin-field small{color:#8a98aa;font-weight:500}.admin-form-actions{display:flex;align-items:center;gap:9px;padding:15px 20px;border-top:1px solid #e5ebf2;background:#f8fafc}.action-spacer{flex:1}.preview-dialog{width:min(760px,calc(100% - 28px))}.preview-surface{padding:36px}.preview-surface h1{margin:12px 0;font-size:34px;line-height:1.25}.preview-surface p,.preview-body{color:#526277;line-height:1.75}.preview-body{margin-top:22px;padding-top:22px;border-top:1px solid #e1e7ef;white-space:pre-wrap}.admin-settings{max-width:900px}.admin-settings .admin-form-actions{border-radius:0 0 8px 8px}.admin-toast{position:fixed;right:24px;bottom:24px;z-index:50;max-width:340px;border-radius:7px;background:#153a6b;color:#fff;padding:12px 16px;box-shadow:0 14px 34px rgba(21,58,107,.24);font-size:14px;font-weight:800;opacity:0;pointer-events:none;transform:translateY(8px);transition:opacity .18s ease,transform .18s ease}.admin-toast.show{opacity:1;transform:translateY(0)}@media (max-width:900px){.admin-topbar{padding:0 16px}.admin-shell{grid-template-columns:1fr}.admin-sidebar{position:static;display:block;width:100%;height:auto;padding:10px 16px;border-right:0;border-bottom:1px solid #dce4ee;overflow-x:auto}.admin-sidebar-title,.admin-user{display:none}.admin-sidebar nav{display:flex;width:max-content}.admin-sidebar nav a{min-height:38px;white-space:nowrap}.admin-main{padding:26px 16px 54px}.admin-metrics{grid-template-columns:1fr 1fr}.admin-dashboard-grid{grid-template-columns:1fr}.admin-page-head{align-items:flex-start;flex-direction:column}.admin-page-head .admin-button{align-self:stretch}.admin-toolbar{align-items:stretch;flex-wrap:wrap}.admin-search{width:100%}.admin-count{display:flex;align-items:center;margin-left:0}.admin-form-grid{grid-template-columns:1fr}.admin-field-wide{grid-column:auto}}@media (max-width:560px){.admin-brand span{display:none}.admin-metrics{grid-template-columns:1fr 1fr}.admin-form-actions{align-items:stretch;flex-direction:column}.admin-form-actions .action-spacer{display:none}.admin-form-actions .admin-button{width:100%}.preview-surface{padding:24px}.preview-surface h1{font-size:27px}}`;

const cssAdminResponsiveFix = `html:has(.admin-page){overflow-x:clip}.admin-page{width:100%;max-width:100vw;overflow-x:clip}.admin-page .sr-only{left:0;top:0}.admin-shell{min-width:0}@media (max-width:900px){.admin-shell{width:100%;max-width:100vw;overflow:hidden}.admin-sidebar,.admin-main,.admin-panel,.admin-table-wrap{max-width:100%}.admin-main{width:100%;overflow:hidden}}`;

const cssAdminWorkflowEnhancements = `.status-approved{background:#e8f5ff;color:#17618f}.admin-head-actions{display:flex;align-items:center;gap:9px}.import-button{position:relative;cursor:pointer}.import-button input{position:absolute;width:1px;height:1px;opacity:0;pointer-events:none}.logout-button{min-height:34px;padding:0 10px;border:1px solid #c8d5e4;border-radius:6px;background:#fff;color:#526277;font:inherit;font-size:13px;font-weight:800;cursor:pointer}.logout-button:hover{border-color:#9db8d8;color:#153a6b}.admin-login-page{margin:0;min-height:100vh;padding:0;background:#eef4fb;color:#172033}.login-shell{display:grid;grid-template-columns:minmax(0,1.05fr) minmax(360px,.7fr);min-height:100vh}.login-brand{display:flex;flex-direction:column;justify-content:center;align-items:flex-start;padding:clamp(40px,8vw,110px);background:linear-gradient(135deg,#f9fcff 0%,#eaf4ff 55%,#fff0f2 100%);border-top:5px solid #d83a45}.login-brand img{width:min(340px,80%);margin-bottom:34px;border-radius:8px;background:#fff}.login-brand p{margin:0 0 8px;color:#2f6fb0;font-weight:900}.login-brand h1{margin:0 0 18px;font-size:clamp(40px,5vw,68px);line-height:1.08}.login-brand span{max-width:620px;color:#526277;font-size:17px;line-height:1.7}.login-panel{display:flex;flex-direction:column;justify-content:center;padding:clamp(28px,6vw,72px);background:#fff;box-shadow:-16px 0 40px rgba(21,58,107,.08)}.login-panel h2{margin:4px 0 8px;font-size:30px}.login-panel>div>p:not(.admin-kicker){margin:0 0 28px;color:#667085;line-height:1.6}.login-panel form{display:grid;gap:17px}.login-panel form .admin-button{width:100%;margin-top:4px}.login-error{margin:0;color:#b4232d;font-size:13px;font-weight:800}.demo-credential{display:grid;gap:5px;margin-top:24px;padding:15px;border:1px solid #dce4ee;border-radius:7px;background:#f8fafc;color:#526277;font-size:13px}.demo-credential b{color:#153a6b}.login-security-note{margin-top:18px;color:#8a98aa;line-height:1.55}.package-note{margin:0;color:#667085;font-size:12px}@media (max-width:900px){.admin-head-actions{width:100%}.admin-head-actions .admin-button{flex:1}.login-shell{grid-template-columns:1fr}.login-brand{min-height:330px;padding:42px 24px}.login-brand img{width:min(230px,70%);margin-bottom:24px}.login-brand h1{font-size:38px}.login-panel{padding:38px 24px}}@media (max-width:560px){.admin-topbar>div{gap:7px}.demo-badge{display:none}.view-site{font-size:12px}.logout-button{font-size:12px}.admin-head-actions{align-items:stretch;flex-direction:column}.admin-head-actions .admin-button{width:100%}}`;

const cssAdminMediaEnhancements = `.admin-thumbnail-preview{display:grid;gap:8px}.admin-thumbnail-frame{position:relative;display:grid;place-items:center;width:min(420px,100%);aspect-ratio:16/9;overflow:hidden;border:1px dashed #b9c8da;border-radius:8px;background:#f5f8fc;color:#7a8ba1;text-align:center}.admin-thumbnail-frame img{width:100%;height:100%;object-fit:cover}.admin-thumbnail-frame span{max-width:250px;padding:18px;line-height:1.55}.admin-thumbnail-preview.is-custom .admin-thumbnail-frame{border-style:solid;border-color:#187a58}.admin-thumbnail-preview.is-youtube .admin-thumbnail-frame{border-style:solid;border-color:#2f6fb0}.admin-preview-thumbnail{display:block;width:100%;max-height:360px;margin:0 0 22px;border-radius:8px;object-fit:cover;aspect-ratio:16/9;background:#eef3f8}`;

const cssProductionEnhancements = `.admin-badge{border-radius:999px;background:#eef4fb;color:#153a6b;padding:5px 9px;font-size:11px;font-weight:900}.login-documents{display:grid;gap:8px;margin-top:24px;padding:15px;border:1px solid #dce4ee;border-radius:7px;background:#f8fafc}.login-documents h3{margin:0 0 2px;color:#153a6b;font-size:15px}.login-documents a{color:#2f6fb0;font-size:13px;font-weight:800;text-decoration:underline;text-underline-offset:3px}@media (max-width:560px){.admin-badge{display:none}}`;

mkdirSync("assets", { recursive: true });
writeFileSync(join("assets", "demo.css"), css + cssEnhancements + cssWdfEnhancements + cssCompactListEnhancements + cssFeaturedThumbEnhancements + cssCompactHeroEnhancements + cssHomeTitleEnhancements + cssFixedFooterEnhancements + cssDropdownNavEnhancements + cssMobileNavCorrection + cssQuickLinksEnhancements + cssVisiblePortalEnhancements + cssVideoEnhancements + cssAdminEnhancements + cssAdminResponsiveFix + cssAdminWorkflowEnhancements + cssAdminMediaEnhancements + cssProductionEnhancements, "utf8");
writeFileSync("index.html", homeHtml(), "utf8");

for (const route of routes) {
  const filePath = join(route.path, "index.html");
  mkdirSync(dirname(filePath), { recursive: true });
  writeFileSync(filePath, pageHtml(route), "utf8");
}

const sitemap = visibleRoutes.map((route) => `/${route.path}/ ${route.title}`).join("\n");
writeFileSync("SITEMAP.txt", `CTDF website route list\n\n/\n${sitemap}\n`, "utf8");

console.log(`Generated ${routes.length} website pages plus homepage.`);
