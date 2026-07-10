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
  const childLinks = siblings
    .map((item) => `<a class="link-card${item.path === route.path ? " current" : ""}" href="/${item.path}/"><b>/${item.path}</b><span>${item.title}</span></a>`)
    .join("\n          ");
  const itemList = route.items.map((item) => `<li>${item}</li>`).join("");
  const navLinks = nav.map(([label, href]) => `<a href="${href}">${label}</a>`).join("");

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
          <p>此頁為第一階段資訊架構 Demo，用於確認網站階層、導覽連結與未來功能位置。所有內容皆為示意資料，不含正式會員個資。</p>
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

const css = `:root{--ink:#142033;--muted:#667085;--line:#d9e1ec;--paper:#fff;--wash:#f4f7fb;--navy:#153a6b;--red:#c92c35;--green:#187a58;font-family:"Noto Sans TC","Microsoft JhengHei","PingFang TC",system-ui,sans-serif}*{box-sizing:border-box}body{margin:0;color:var(--ink);background:var(--wash);letter-spacing:0}a{color:inherit;text-decoration:none}.site-header{position:sticky;top:0;z-index:5;border-bottom:1px solid var(--line);background:rgba(255,255,255,.94);backdrop-filter:blur(14px)}.nav{display:flex;align-items:center;justify-content:space-between;gap:18px;width:min(1180px,calc(100% - 32px));min-height:72px;margin:0 auto}.brand{display:flex;align-items:center;gap:12px;min-width:0}.brand-mark{display:grid;place-items:center;width:44px;height:44px;border-radius:50%;color:#fff;background:radial-gradient(circle,var(--red) 0 20%,#fff 21% 30%,var(--green) 31% 42%,#12151b 43% 62%,var(--navy) 63% 100%);font-size:11px;font-weight:900}.brand b,.brand small{display:block}.brand small{color:var(--muted);font-size:12px}.nav-links{display:flex;gap:16px;color:#344054;font-size:14px;font-weight:800}.page-hero{color:#fff;background:linear-gradient(105deg,rgba(10,23,43,.96),rgba(21,58,107,.88)),linear-gradient(135deg,#0a172b,#153a6b 60%,#c92c35 130%)}.page-hero-inner{width:min(1180px,calc(100% - 32px));margin:0 auto;padding:72px 0}.eyebrow{margin:0 0 14px;color:#ffd166;font-weight:900}.page-hero h1{max-width:860px;margin:0 0 18px;font-size:clamp(36px,6vw,72px);line-height:1.06}.page-hero p{max-width:720px;color:#dbe7f6;font-size:18px;line-height:1.75}.actions{display:flex;flex-wrap:wrap;gap:10px;margin-top:24px}.button{display:inline-flex;align-items:center;justify-content:center;min-height:44px;padding:0 15px;border-radius:8px;background:#c92c35;color:#fff;font-weight:900}.button.secondary{border:1px solid rgba(255,255,255,.3);background:rgba(255,255,255,.1)}.section{padding:54px 0}.section.alt{background:#fff}.section-inner{width:min(1180px,calc(100% - 32px));margin:0 auto}.two-col{display:grid;grid-template-columns:minmax(0,1fr) minmax(300px,.75fr);gap:18px;align-items:start}.panel,.link-card{border:1px solid var(--line);border-radius:8px;background:#fff;box-shadow:0 10px 28px rgba(20,32,51,.06)}.panel{padding:22px}.panel h2,.section-head h2{margin:0 0 12px;font-size:26px}.panel p,.section-head p{color:var(--muted);line-height:1.7}.check-list{display:grid;gap:10px;margin:18px 0 0;padding-left:22px}.check-list li{line-height:1.55}.meta{display:grid;gap:12px;margin:18px 0 0}.meta div{display:grid;gap:4px}.meta dt{color:var(--muted);font-size:13px;font-weight:800}.meta dd{margin:0;font-weight:800;word-break:break-word}.section-head{display:flex;align-items:end;justify-content:space-between;gap:18px;margin-bottom:20px}.link-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}.link-card{display:grid;gap:7px;min-height:88px;padding:15px}.link-card.current{border-color:rgba(201,44,53,.45);box-shadow:0 12px 28px rgba(201,44,53,.12)}.link-card b{color:var(--navy);font-size:14px}.link-card span{color:var(--muted);font-size:14px;line-height:1.45}.footer{padding:30px 16px;color:#dbe7f6;background:#0a172b;text-align:center;font-size:14px}@media (max-width:900px){.nav{align-items:flex-start;flex-direction:column;padding:14px 0}.nav-links{width:100%;overflow-x:auto;padding-bottom:4px}.two-col,.link-grid{grid-template-columns:1fr}.section-head{align-items:start;flex-direction:column}.page-hero-inner{padding:54px 0}.page-hero h1{font-size:clamp(34px,10vw,52px)}}`;

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
