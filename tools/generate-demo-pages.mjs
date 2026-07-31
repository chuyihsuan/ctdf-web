import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const routes = [
  { path: "news", title: "新聞公告", group: "前台", status: "MVP", summary: "公告列表、分類標籤、置頂消息與新聞詳細頁入口。", items: ["置頂公告", "賽事公告", "行政公告"] },
  { path: "news/demo-announcement", title: "新聞詳細頁示意", group: "前台", status: "MVP", summary: "新聞公告詳細內容、發布日期、分類、附件與分享資訊的示意頁。", items: ["標題與日期", "公告本文", "相關附件"] },
  { path: "events", title: "賽事資訊", group: "前台", status: "MVP", summary: "賽事列表、報名狀態、項目、組別、地點與詳細頁入口。", items: ["近期賽事", "報名狀態", "規程下載"] },
  { path: "events/calendar", title: "賽事行事曆", group: "前台", status: "MVP", summary: "以月份與日期檢視賽事，方便選手、家長與行政人員快速確認時程。", items: ["月曆檢視", "賽事篩選", "重要日期"] },
  { path: "events/list", title: "賽事列表", group: "前台", status: "MVP", summary: "依年度、項目、地區與狀態呈現所有賽事。", items: ["年度篩選", "硬式 / 電子", "報名 / 結果"] },
  { path: "events/results", title: "成績公告", group: "前台", status: "MVP", summary: "發布賽事結果、名次、成績附件與後續排名更新連結。", items: ["成績摘要", "附件下載", "排名更新"] },
  { path: "events/demo-event", title: "賽事詳細頁示意", group: "前台", status: "MVP", summary: "賽事資訊、地點、規則、報名連結與成績連結的示意頁。", items: ["賽事資訊", "報名連結", "成績連結"] },
  { path: "rankings", title: "排名成績", group: "前台", status: "MVP", summary: "硬式與電子飛鏢排名總覽，支援公開組與青少年組。", items: ["排名摘要", "組別篩選", "項目篩選"] },
  { path: "rankings/main", title: "選手積分排名", group: "前台", status: "MVP", summary: "公開組或主要積分榜，以表格或卡片呈現選手排名與分數。", items: ["公開組", "積分", "更新日期"] },
  { path: "rankings/youth", title: "青少年排名", group: "前台", status: "MVP", summary: "青少年組排名，未來需注意個資、肖像權與公開欄位授權。", items: ["青少年組", "年齡分組", "公開欄位"] },
  { path: "rankings/history", title: "歷史成績查詢", group: "第二階段", status: "Later", summary: "保存歷年賽事結果與查詢入口，作為第二階段功能候選。", items: ["年度查詢", "賽事結果", "資料匯出"] },
  { path: "rankings/region", title: "分區排名", group: "第二階段", status: "Later", summary: "依地區或協會分區呈現排名，用於區域推廣與管理。", items: ["地區篩選", "分區積分", "推廣資料"] },
  { path: "players", title: "選手資料庫", group: "前台", status: "MVP", summary: "公開選手列表、搜尋、篩選與個人頁入口。", items: ["姓名搜尋", "地區篩選", "公開資料"] },
  { path: "players/demo-player", title: "選手個人頁示意", group: "前台", status: "MVP", summary: "選手公開資料、積分、參賽紀錄與公開狀態示意。", items: ["公開簡介", "排名資料", "賽事紀錄"] },
  { path: "about", title: "關於總會", group: "前台", status: "MVP", summary: "總會簡介、組織、章程、聯絡資訊與隱私政策入口。", items: ["總會簡介", "組織架構", "聯絡資訊"] },
  { path: "about/organization", title: "組織架構", group: "前台", status: "MVP", summary: "呈現總會組織、職掌與未來可維護的組織資料。", items: ["理監事", "委員會", "行政窗口"] },
  { path: "about/rules", title: "章程規則", group: "前台", status: "MVP", summary: "收錄章程、競賽規則、會員規範與相關制度文件。", items: ["章程", "競賽規則", "會員規範"] },
  { path: "about/contact", title: "聯絡我們", group: "前台", status: "MVP", summary: "總會聯絡方式、社群連結與詢問入口。", items: ["Email", "電話", "社群連結"] },
  { path: "about/privacy", title: "隱私權政策", group: "前台", status: "MVP", summary: "個資告知、資料使用範圍與會員服務前置說明。", items: ["個資告知", "資料使用", "權利說明"] },
  { path: "about/citizens-sports-games", title: "全民運推動專區", group: "第二階段", status: "Later", summary: "全民運推動、倡議內容與佐證資料下載區。", items: ["推動說明", "佐證資料", "成果下載"] },
  { path: "about/development", title: "推廣成果頁", group: "第二階段", status: "Later", summary: "校園、地方、青少年與社群推廣成果展示。", items: ["推廣成果", "活動紀錄", "合作單位"] },
  { path: "downloads", title: "文件下載", group: "前台", status: "MVP", summary: "申請表格、競賽規程、年報與成果報告下載入口。", items: ["申請表格", "競賽規程", "年度文件"] },
  { path: "downloads/forms", title: "申請表格下載", group: "前台", status: "MVP", summary: "會員、賽事、裁判、教練或行政申請表單下載。", items: ["會員表格", "賽事表格", "行政表格"] },
  { path: "downloads/rules", title: "競賽規程下載", group: "前台", status: "MVP", summary: "競賽規程、賽事辦法、裁判規則與附件。", items: ["競賽規程", "賽事辦法", "裁判規則"] },
  { path: "downloads/annual", title: "年報 / 大會手冊", group: "第二階段", status: "Later", summary: "年報、大會手冊與年度資料彙整。", items: ["年報", "大會手冊", "年度紀錄"] },
  { path: "downloads/reports", title: "成果報告下載", group: "第二階段", status: "Later", summary: "推廣、補助、活動與全民運相關成果報告下載。", items: ["成果報告", "佐證附件", "推廣資料"] },
  { path: "fairplay", title: "反禁藥 / 公平競技", group: "前台", status: "MVP", summary: "反禁藥政策、公平競技聲明與外部教育資源連結。", items: ["政策聲明", "教育資源", "外部連結"] },
  { path: "media/photos", title: "活動相簿", group: "第二階段", status: "Later", summary: "活動照片與相簿示意，正式上線前需確認肖像權與使用授權。", items: ["活動相簿", "授權狀態", "照片分類"] },
  { path: "media/videos", title: "影片專區", group: "第二階段", status: "Later", summary: "使用 YouTube 連結或嵌入方式呈現賽事與推廣影片。", items: ["YouTube", "賽事影片", "教學影片"] },
  { path: "media/press", title: "媒體報導", group: "第二階段", status: "Later", summary: "媒體報導、新聞連結與外部引用資料。", items: ["媒體連結", "報導摘要", "來源日期"] },
  { path: "member/login", title: "會員登入 / 註冊", group: "會員", status: "MVP", summary: "會員登入、註冊與未來 Supabase Auth 串接入口。Demo 不收集資料。", items: ["登入入口", "註冊入口", "個資告知"] },
  { path: "member/profile", title: "會員資料", group: "會員", status: "MVP", summary: "會員個人資料維護示意，正式階段需登入與 RLS 保護。", items: ["基本資料", "公開設定", "會員狀態"] },
  { path: "member/fee", title: "會費繳納狀態", group: "第二階段", status: "Later", summary: "會員會費狀態與繳費紀錄示意，第二階段候選功能。", items: ["繳費狀態", "年度紀錄", "提醒"] },
  { path: "admin", title: "後台首頁", group: "後台", status: "MVP", summary: "管理員儀表板示意，正式階段需登入、角色權限與操作紀錄。", items: ["待辦事項", "近期活動", "草稿內容"] },
  { path: "admin/news", title: "新聞公告管理", group: "後台", status: "MVP", summary: "新聞草稿、發布、置頂、排程、下架與封存管理。", items: ["草稿", "發布", "置頂"] },
  { path: "admin/pages", title: "靜態頁面管理", group: "後台", status: "MVP", summary: "關於總會、章程、隱私政策與聯絡資訊等靜態頁管理。", items: ["頁面內容", "審閱狀態", "發布"] },
  { path: "admin/events", title: "賽事管理", group: "後台", status: "MVP", summary: "賽事建立、報名連結、規程附件與成績連結管理。", items: ["賽事資料", "報名連結", "附件"] },
  { path: "admin/rankings", title: "排名管理", group: "後台", status: "MVP", summary: "排名資料匯入、更新、檢查與發布管理。", items: ["匯入", "檢查", "發布"] },
  { path: "admin/players", title: "選手管理", group: "後台", status: "MVP", summary: "選手公開欄位、照片、組別與資料可見性管理。", items: ["公開欄位", "照片授權", "組別"] },
  { path: "admin/members", title: "會員管理", group: "後台", status: "MVP", summary: "會員審核、停權、恢復、匯出與資料保護流程。", items: ["審核", "停權", "匯出"] },
  { path: "admin/downloads", title: "文件管理", group: "後台", status: "MVP", summary: "文件上傳、分類、發布、封存與下載 metadata 管理。", items: ["上傳", "分類", "封存"] },
  { path: "admin/media", title: "媒體管理", group: "第二階段", status: "Later", summary: "照片、影片、媒體報導與授權狀態管理。", items: ["相簿", "影片", "授權"] },
  { path: "admin/citizens-sports-games", title: "全民運推動資料管理", group: "第二階段", status: "Later", summary: "全民運推動內容、佐證資料與成果下載管理。", items: ["推動內容", "佐證資料", "成果"] },
  { path: "admin/settings/features", title: "功能啟用設定", group: "後台", status: "MVP", summary: "Feature flags 管理，用於控制尚未正式啟用的模組。", items: ["功能開關", "公開狀態", "啟用紀錄"] },
  { path: "admin/settings/roles", title: "角色權限設定", group: "後台", status: "MVP", summary: "管理超級管理員、秘書處、賽事、排名、只讀等角色權限。", items: ["角色", "權限", "模組"] },
  { path: "admin/settings/admins", title: "管理員帳號管理", group: "後台", status: "MVP", summary: "管理員帳號、邀請、停用與備援管理者設定。", items: ["邀請", "停用", "備援"] },
  { path: "admin/settings/site", title: "網站基本設定", group: "後台", status: "MVP", summary: "網站名稱、Logo、聯絡資訊、社群連結與 SEO metadata。", items: ["Logo", "聯絡資訊", "SEO"] },
  { path: "admin/logs", title: "操作紀錄", group: "後台", status: "MVP", summary: "記錄新增、修改、刪除、發布、匯出與權限變更等重要操作。", items: ["操作人", "操作項目", "時間"] }
];

const realDataByRoot = {
  news: [
    {
      title: "中華民國競技飛鏢總會成功加入 WDF，台灣飛鏢走向國際",
      meta: "2018-09-26 / Yahoo、三立新聞公開報導",
      desc: "公開報導提及 CTDF 於 WDF 第 24 屆大會通過加入，可作為國際交流頁面素材；正式官網發布前仍需總會補充 WDF 證書或官方文件。",
      source: "https://tw.sports.yahoo.com/news/飛鏢-中華民國競技飛鏢總會成功加入wdf-台灣飛鏢走向國際第一步-032657955.html"
    },
    {
      title: "台灣首度參加 WDF 世界盃飛鏢錦標賽",
      meta: "2025-09-22 / 自由體育公開報導",
      desc: "可作為國際賽事與代表隊里程碑素材；正式上架前需總會確認代表隊名單與成績。",
      source: "https://sports.ltn.com.tw/news/breakingnews/5187129"
    },
    {
      title: "第 15 屆全國飛鏢公開賽登場，推動飛鏢成為全民運動",
      meta: "2024-11-09 / 中央社公開報導",
      desc: "可作為媒體中心、推廣成果與全民運推動專區素材。",
      source: "https://www.cna.com.tw/news/aspt/202411090100.aspx"
    }
  ],
  events: [
    {
      title: "114 學年師生盃全國各級學校飛鏢錦標賽",
      meta: "公開公告資料：115 年 3 月 14 日至 15 日 / 中壢國中",
      desc: "多個學校與政府公告提及本賽事，可作為賽事列表與文件下載 demo 內容；正式資訊需以總會原始規程與報名表為準。",
      source: "https://www.penghu.gov.tw/edu/home.jsp?act=view&dataserno=202602110004&id=94"
    },
    {
      title: "113 學年度國中暨高中飛鏢隊際聯賽",
      meta: "公開公告資料：114 年 6 月 14 日至 15 日",
      desc: "可作為隊際聯賽與校園推廣賽事範例，正式上架前需確認總會原始公告。",
      source: "https://www.penghu.gov.tw/ch/home.jsp?act=view&dataserno=202504250027&id=10088"
    },
    {
      title: "113 學年師生盃全國各級學校飛鏢錦標賽",
      meta: "公開公告資料：114 年 3 月 15 日至 16 日 / 桃園市立中壢國中",
      desc: "可作為歷年賽事、升學資格佐證線索與成果資料庫素材。",
      source: "https://www.cyc.edu.tw/modules/tadnews/index.php?nsn=83975"
    }
  ],
  rankings: [
    {
      title: "WDF 世界盃 U18 女雙金牌公開報導",
      meta: "2025-09 / 自由體育公開報導",
      desc: "可作為歷史成績與國際成績頁面素材；涉及青少年姓名與成績，正式上架前需總會核對 WDF 成績與公開授權。",
      source: "https://sports.ltn.com.tw/news/breakingnews/5192343"
    },
    {
      title: "WDF World Masters Qualification Criteria",
      meta: "2024-04-29 / WDF 文件",
      desc: "文件中列有 Chinese Taipei 相關會員國資訊，可作為國際頁面輔助佐證；正式對外聲明仍需總會確認。",
      source: "https://dartswdf.com/storage/uploads/2cf58373-76ad-4659-92e8-0e3b57dcf7b9/2024-04-29_World_Masters_Qualification_Criteria_Seniors.pdf"
    }
  ],
  players: [
    {
      title: "選手資料庫 demo 原則",
      meta: "公開欄位需待總會確認",
      desc: "正式選手頁可顯示姓名、縣市、組別、項目、積分與近期成績；demo 階段不放未授權個資或照片。",
      source: "/docs/FRD.md"
    },
    {
      title: "青少年選手資料注意事項",
      meta: "個資、肖像權與監護人授權",
      desc: "若引用公開報導中的青少年成績，正式官網仍需確認姓名、照片與成績是否可公開。",
      source: "/docs/DEMO_REAL_DATA_NOTES.md"
    }
  ],
  about: [
    {
      title: "總會英文名稱：Chinese Taipei Dart Federation",
      meta: "網域申請與計畫書 v11 一致",
      desc: "Demo 首頁與關於頁使用 Chinese Taipei Dart Federation 作為英文名稱，對應主網域 ctdf.org.tw。",
      source: "/README.md"
    },
    {
      title: "全民運推動定位",
      meta: "115 全民運公開資訊 / 飛鏢尚未查得列入正式競賽種類",
      desc: "官網應以「爭取納入自辦、選辦或示範推廣項目」保守描述，避免寫成已核定項目。",
      source: "https://sport115.tycg.gov.tw/"
    }
  ],
  downloads: [
    {
      title: "113 學年師生盃競賽規程",
      meta: "2025-01 / 新竹市教育網公開 PDF",
      desc: "可作為競賽規程下載區範例；正式上架建議由總會提供原始檔與最新版。",
      source: "https://www.hc.edu.tw/edub/upload/113學年師生盃全國各級學校飛鏢錦標賽競賽規程20250109083023.pdf"
    },
    {
      title: "112 學年師生盃競賽規程",
      meta: "2024-01 / 新竹市教育網公開 PDF",
      desc: "可作為歷年規程與文件分類 demo；正式上架前需確認授權與版本。",
      source: "https://www.hc.edu.tw/edub/upload/112學年師生盃競賽規程20240103083807.pdf"
    },
    {
      title: "111 學年度國中學生聯賽競賽規程",
      meta: "2023-03-10 / 新竹市教育網公開 PDF",
      desc: "可作為歷年賽事文件範例，正式使用需由總會確認是否可重新上架。",
      source: "https://www.hc.edu.tw/edub/upload/111學年度國中學生聯賽競賽規程FINAL20230325165733.pdf"
    }
  ],
  fairplay: [
    {
      title: "反禁藥與公平競技資源頁",
      meta: "MVP 必要頁面",
      desc: "此頁應連結 WADA、WDF 或國內主管機關反禁藥資訊；正式連結與文字需由總會確認。",
      source: "/docs/FRD.md"
    }
  ],
  media: [
    {
      title: "中央社：第 15 屆全國飛鏢公開賽登場",
      meta: "2024-11-09 / 媒體報導",
      desc: "可作為媒體報導清單範例；新聞全文與照片不可直接轉載，應以摘要與外部連結呈現。",
      source: "https://www.cna.com.tw/news/aspt/202411090100.aspx"
    },
    {
      title: "WOWSight：總會紮根基層培養人口",
      meta: "2024-11-09 / 媒體報導",
      desc: "可作為推廣成果與全民運推動內容線索。",
      source: "https://wowsight.tw/2024/11/09/《飛鏢》中華民國競技飛鏢總會紮根基層培養人口/"
    }
  ],
  member: [
    {
      title: "會員功能 demo 原則",
      meta: "正式階段需登入與 RLS 保護",
      desc: "Demo 只呈現會員登入、個人資料與會費狀態的未來樣貌，不收集、不顯示真實會員資料。",
      source: "/docs/SRD.md"
    }
  ],
  admin: [
    {
      title: "後台管理 demo 原則",
      meta: "正式階段需角色權限與操作紀錄",
      desc: "Demo 呈現新聞、賽事、排名、會員、文件與設定模組的位置；正式資料需登入後才能管理。",
      source: "/docs/SRD.md"
    }
  ]
};

const nav = [
  ["首頁", "/"],
  ["新聞", "/news/"],
  ["賽事", "/events/"],
  ["排名", "/rankings/"],
  ["選手", "/players/"],
  ["文件", "/downloads/"],
  ["後台", "/admin/"]
];

function pageHtml(route) {
  const siblings = routes.filter((item) => item.path.split("/")[0] === route.path.split("/")[0]);
  const root = route.path.split("/")[0];
  const realData = realDataByRoot[root] || [];
  const childLinks = siblings
    .map((item) => `<a class="link-card${item.path === route.path ? " current" : ""}" href="/${item.path}/"><b>/${item.path}</b><span>${item.title}</span></a>`)
    .join("\n          ");
  const itemList = route.items.map((item) => `<li>${item}</li>`).join("");
  const navLinks = nav.map(([label, href]) => `<a href="${href}">${label}</a>`).join("");
  const realDataCards = realData
    .map((item) => `<article class="data-card"><p class="data-meta">${item.meta}</p><h3>${item.title}</h3><p>${item.desc}</p><a href="${item.source}" target="_blank" rel="noopener noreferrer">查看來源或對應文件</a></article>`)
    .join("\n          ");

  return `<!doctype html>
<html lang="zh-Hant">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${route.title} | CTDF Demo</title>
  <meta name="robots" content="noindex, nofollow">
  <link rel="stylesheet" href="/assets/demo.css">
</head>
<body>
  <header class="site-header">
    <nav class="nav" aria-label="主要導覽">
      <a class="brand" href="/"><span class="brand-mark">CTDF</span><span><b>中華民國競技飛鏢總會</b><small>Demo Site Map</small></span></a>
      <div class="nav-links">${navLinks}</div>
    </nav>
  </header>

  <main>
    <section class="page-hero">
      <div class="page-hero-inner">
        <p class="eyebrow">${route.group} / ${route.status}</p>
        <h1>${route.title}</h1>
        <p>${route.summary}</p>
        <div class="actions">
          <a class="button" href="/">回首頁</a>
          <a class="button secondary" href="/${route.path}/">目前路由：/${route.path}/</a>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="section-inner two-col">
        <article class="panel">
          <h2>Demo 頁面內容</h2>
          <p>此頁為第一階段資訊架構 Demo，用於確認網站階層、導覽連結與未來功能位置。部分內容採公開資料整理，正式上架前仍需總會確認。</p>
          <ul class="check-list">${itemList}</ul>
        </article>
        <aside class="panel">
          <h2>後續開發提示</h2>
          <p>MVP 階段會依需求文件改為真實資料、列表、詳細頁、搜尋篩選、登入或後台管理流程。</p>
          <dl class="meta">
            <div><dt>Route</dt><dd>/${route.path}/</dd></div>
            <div><dt>Source</dt><dd>README / FRD / PRD / SRD sitemap</dd></div>
            <div><dt>Data</dt><dd>Placeholder only</dd></div>
          </dl>
        </aside>
      </div>
    </section>

    <section class="section real-data">
      <div class="section-inner">
        <div class="section-head">
          <h2>公開資料 Demo</h2>
          <p>以下內容來自公開資料索引，目的為讓審閱者理解未來官網完成後的呈現方式；正式上架前需以總會確認版本為準。</p>
        </div>
        <div class="data-grid">
          ${realDataCards || `<article class="data-card"><p class="data-meta">Demo 原則</p><h3>本頁暫無公開資料範例</h3><p>後續可由總會提供正式資料、文件或公告內容後補入。</p></article>`}
        </div>
      </div>
    </section>

    <section class="section alt">
      <div class="section-inner">
        <div class="section-head">
          <h2>同層相關頁面</h2>
          <p>以下連結可用來檢查同一模組下的資料夾階層。</p>
        </div>
        <div class="link-grid">
          ${childLinks}
        </div>
      </div>
    </section>
  </main>

  <footer class="footer">第一階段靜態 Demo / 無 API key / 無正式會員個資</footer>
</body>
</html>
`;
}

const css = `:root{--ink:#142033;--muted:#667085;--line:#d9e1ec;--paper:#fff;--wash:#f4f7fb;--navy:#153a6b;--red:#c92c35;--green:#187a58;font-family:"Noto Sans TC","Microsoft JhengHei","PingFang TC",system-ui,sans-serif}*{box-sizing:border-box}body{margin:0;color:var(--ink);background:var(--wash);letter-spacing:0}a{color:inherit;text-decoration:none}.site-header{position:sticky;top:0;z-index:5;border-bottom:1px solid var(--line);background:rgba(255,255,255,.94);backdrop-filter:blur(14px)}.nav{display:flex;align-items:center;justify-content:space-between;gap:18px;width:min(1180px,calc(100% - 32px));min-height:72px;margin:0 auto}.brand{display:flex;align-items:center;gap:12px;min-width:0}.brand-mark{display:grid;place-items:center;width:44px;height:44px;border-radius:50%;color:#fff;background:radial-gradient(circle,var(--red) 0 20%,#fff 21% 30%,var(--green) 31% 42%,#12151b 43% 62%,var(--navy) 63% 100%);font-size:11px;font-weight:900}.brand b,.brand small{display:block}.brand small{color:var(--muted);font-size:12px}.nav-links{display:flex;gap:16px;color:#344054;font-size:14px;font-weight:800}.page-hero{color:#fff;background:linear-gradient(105deg,rgba(10,23,43,.96),rgba(21,58,107,.88)),linear-gradient(135deg,#0a172b,#153a6b 60%,#c92c35 130%)}.page-hero-inner{width:min(1180px,calc(100% - 32px));margin:0 auto;padding:72px 0}.eyebrow{margin:0 0 14px;color:#ffd166;font-weight:900}.page-hero h1{max-width:860px;margin:0 0 18px;font-size:clamp(36px,6vw,72px);line-height:1.06}.page-hero p{max-width:720px;color:#dbe7f6;font-size:18px;line-height:1.75}.actions{display:flex;flex-wrap:wrap;gap:10px;margin-top:24px}.button{display:inline-flex;align-items:center;justify-content:center;min-height:44px;padding:0 15px;border-radius:8px;background:#c92c35;color:#fff;font-weight:900}.button.secondary{border:1px solid rgba(255,255,255,.3);background:rgba(255,255,255,.1)}.section{padding:54px 0}.section.alt{background:#fff}.section.real-data{background:#eef4fb}.section-inner{width:min(1180px,calc(100% - 32px));margin:0 auto}.two-col{display:grid;grid-template-columns:minmax(0,1fr) minmax(300px,.75fr);gap:18px;align-items:start}.panel,.link-card,.data-card{border:1px solid var(--line);border-radius:8px;background:#fff;box-shadow:0 10px 28px rgba(20,32,51,.06)}.panel{padding:22px}.panel h2,.section-head h2{margin:0 0 12px;font-size:26px}.panel p,.section-head p{color:var(--muted);line-height:1.7}.check-list{display:grid;gap:10px;margin:18px 0 0;padding-left:22px}.check-list li{line-height:1.55}.meta{display:grid;gap:12px;margin:18px 0 0}.meta div{display:grid;gap:4px}.meta dt{color:var(--muted);font-size:13px;font-weight:800}.meta dd{margin:0;font-weight:800;word-break:break-word}.section-head{display:flex;align-items:end;justify-content:space-between;gap:18px;margin-bottom:20px}.data-grid,.link-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}.data-card{display:grid;gap:10px;min-height:230px;padding:18px}.data-card h3{margin:0;font-size:20px;line-height:1.35}.data-card p{margin:0;color:var(--muted);line-height:1.62}.data-card a{align-self:end;color:var(--navy);font-weight:900;text-decoration:underline;text-underline-offset:3px}.data-meta{color:var(--red)!important;font-size:13px;font-weight:900}.link-card{display:grid;gap:7px;min-height:88px;padding:15px}.link-card.current{border-color:rgba(201,44,53,.45);box-shadow:0 12px 28px rgba(201,44,53,.12)}.link-card b{color:var(--navy);font-size:14px}.link-card span{color:var(--muted);font-size:14px;line-height:1.45}.footer{padding:30px 16px;color:#dbe7f6;background:#0a172b;text-align:center;font-size:14px}@media (max-width:900px){.nav{align-items:flex-start;flex-direction:column;padding:14px 0}.nav-links{width:100%;overflow-x:auto;padding-bottom:4px}.two-col,.data-grid,.link-grid{grid-template-columns:1fr}.section-head{align-items:start;flex-direction:column}.page-hero-inner{padding:54px 0}.page-hero h1{font-size:clamp(34px,10vw,52px)}}`;

mkdirSync("assets", { recursive: true });
writeFileSync(join("assets", "demo.css"), css, "utf8");

for (const route of routes) {
  const filePath = join(route.path, "index.html");
  mkdirSync(dirname(filePath), { recursive: true });
  writeFileSync(filePath, pageHtml(route), "utf8");
}

const sitemap = routes.map((route) => `/${route.path}/ ${route.title}`).join("\n");
writeFileSync("DEMO_SITEMAP.txt", `CTDF Demo route list\n\n/\n${sitemap}\n`, "utf8");

console.log(`Generated ${routes.length} demo pages.`);
