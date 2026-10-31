const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const runtimeModules = "C:\\Users\\chuyi\\.cache\\codex-runtimes\\codex-primary-runtime\\dependencies\\node\\node_modules";
const { chromium } = require(path.join(runtimeModules, "playwright"));
const JSZip = require(path.join(runtimeModules, "jszip"));

(async () => {
  const root = process.cwd();
  const outputDirectory = path.resolve("tests/.output");
  fs.mkdirSync(outputDirectory, { recursive: true });
  const browser = await chromium.launch({
    headless: true,
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    downloadsPath: os.tmpdir()
  });
  const context = await browser.newContext({ acceptDownloads: true });
  await context.route("http://localhost:4173/**", async (route) => {
    const urlPath = decodeURIComponent(new URL(route.request().url()).pathname);
    let filePath = path.join(root, urlPath);
    try {
      if (fs.statSync(filePath).isDirectory()) filePath = path.join(filePath, "index.html");
      const types = { ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".png": "image/png", ".jpg": "image/jpeg" };
      await route.fulfill({ status: 200, contentType: types[path.extname(filePath)] || "application/octet-stream", body: fs.readFileSync(filePath) });
    } catch {
      await route.fulfill({ status: 404, body: "Not found" });
    }
  });
  const page = await context.newPage();
  page.on("console", (message) => console.log("browser-console", message.type(), message.text()));
  page.on("pageerror", (error) => console.error("browser-error", error));

  await page.goto("http://localhost:4173/admin/");
  await page.waitForURL("**/admin/login/**");
  await page.screenshot({ path: path.join(outputDirectory, "ctdf-admin-login.png"), fullPage: true });

  await page.getByLabel("帳號").fill("secretary");
  await page.getByLabel("密碼").fill("CTDF-DEMO");
  await page.getByRole("button", { name: "登入" }).click();
  await page.waitForURL("**/admin/");
  await page.goto("http://localhost:4173/admin/news/");

  await page.getByRole("button", { name: "＋ 新增公告" }).click();
  await page.getByLabel("公告標題").fill("IndexedDB 與 ZIP 流程測試公告");
  await page.getByLabel("公告分類").selectOption({ label: "總會消息" });
  await page.getByLabel("發布日期").fill("2026-10-25");
  await page.getByLabel("公告摘要").fill("驗證瀏覽器草稿與上架包流程。");
  await page.getByLabel("公告內文").fill("此內容不會直接更新正式網站。");
  await page.getByLabel("封面圖片").setInputFiles(path.resolve("assets/ctdf-logo.png"));
  await page.getByRole("button", { name: "儲存草稿" }).click();
  await page.locator("[data-editor-dialog]").waitFor({ state: "hidden" });
  await page.getByText("IndexedDB 與 ZIP 流程測試公告", { exact: true }).waitFor();
  await page.reload();
  await page.getByText("IndexedDB 與 ZIP 流程測試公告", { exact: true }).waitFor();

  const testRow = page.getByRole("row", { name: /IndexedDB 與 ZIP 流程測試公告/ });
  await testRow.getByRole("button", { name: "編輯" }).click();
  await page.getByRole("button", { name: "預覽" }).click();
  assert.match(await page.locator("[data-preview-dialog]").innerText(), /驗證瀏覽器草稿與上架包流程/);
  await page.locator("[data-preview-dialog]").getByRole("button", { name: "關閉" }).click();

  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "核准並匯出 ZIP" }).click();
  const download = await downloadPromise;
  assert.match(download.suggestedFilename(), /^CTDF-.*\.zip$/);
  await download.cancel().catch(() => {});
  await page.getByRole("row", { name: /IndexedDB 與 ZIP 流程測試公告/ }).getByText("已核准匯出").waitFor();

  const generatedZipBytes = await page.evaluate(async () => {
    const zipBlob = await window.CTDFAdminPackageTools.createZip([
      { name: "manifest.json", data: JSON.stringify({ schema_version: 1, module: "admin/news", status: "approved" }) },
      { name: "content/news/test.json", data: JSON.stringify({ id: "test" }) },
      { name: "uploads/ctdf-logo.png", data: new Blob([new Uint8Array([1, 2, 3])], { type: "image/png" }) }
    ]);
    return [...new Uint8Array(await zipBlob.arrayBuffer())];
  });
  const zip = await JSZip.loadAsync(Buffer.from(generatedZipBytes));
  const names = Object.keys(zip.files);
  assert(names.includes("manifest.json"));
  assert(names.some((name) => name.startsWith("content/news/") && name.endsWith(".json")));
  assert(names.some((name) => name.startsWith("uploads/") && name.endsWith("ctdf-logo.png")));
  const manifest = JSON.parse(await zip.file("manifest.json").async("string"));
  assert.equal(manifest.module, "admin/news");
  assert.equal(manifest.status, "approved");

  const importZip = new JSZip();
  importZip.file("manifest.json", JSON.stringify({ schema_version: 1, package_id: "CTDF-IMPORT-TEST", module: "admin/news", status: "approved", files: [] }));
  importZip.file("content/news/import-test.json", JSON.stringify({ id: "import-test", module: "admin/news", title: "匯入流程測試", category: "總會消息", date: "2026-10-25", status: "approved", fields: { title: "匯入流程測試", category: "總會消息", date: "2026-10-25", status: "approved" }, files: [] }));
  const zipPath = path.join(outputDirectory, "ctdf-admin-import-test.zip");
  fs.writeFileSync(zipPath, await importZip.generateAsync({ type: "nodebuffer", compression: "STORE" }));
  await page.locator("[data-import-package]").setInputFiles(zipPath);
  await page.locator("[data-editor-dialog]").waitFor({ state: "visible" });
  assert.equal(await page.getByLabel("內容狀態").inputValue(), "draft");
  await page.locator("[data-editor-dialog]").getByRole("button", { name: "關閉" }).click();

  await page.goto("http://localhost:4173/admin/downloads/");
  await page.getByRole("button", { name: "＋ 新增文件連結" }).click();
  assert.equal(await page.locator("[data-editor-dialog] input[type=file]").count(), 0);
  await page.getByLabel("文件名稱").fill("文件連結流程測試");
  await page.getByLabel("文件分類").selectOption({ label: "競賽規程" });
  await page.getByLabel("文件連結").fill("example.com/document");
  await page.getByRole("button", { name: "儲存草稿" }).click();
  await page.locator("[data-editor-dialog]").waitFor({ state: "visible" });
  await page.getByLabel("文件連結").fill("https://example.com/document");
  await page.getByRole("button", { name: "預覽" }).click();
  assert.match(await page.locator("[data-preview-dialog]").innerText(), /https:\/\/example\.com\/document/);
  await page.locator("[data-preview-dialog]").getByRole("button", { name: "關閉" }).click();
  await page.getByRole("button", { name: "儲存草稿" }).click();
  await page.getByRole("row", { name: /文件連結流程測試/ }).waitFor();
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.screenshot({ path: path.join(outputDirectory, "ctdf-admin-document-links.png"), fullPage: true });

  await page.goto("http://localhost:4173/downloads/");
  await page.getByRole("heading", { name: "文件連結", exact: true }).waitFor();
  assert.equal(await page.getByRole("link", { name: "開啟文件連結" }).count(), 3);
  await page.screenshot({ path: path.join(outputDirectory, "ctdf-document-links-page.png"), fullPage: true });
  await page.goto("http://localhost:4173/admin/downloads/");

  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({ path: path.join(outputDirectory, "ctdf-admin-mobile.png"), fullPage: true });
  const mobileMetrics = await page.evaluate(() => ({
    innerWidth: window.innerWidth,
    bodyScrollWidth: document.body.scrollWidth,
    documentScrollWidth: document.documentElement.scrollWidth,
    boxes: [".admin-shell", ".admin-sidebar", ".admin-main", ".admin-panel", ".admin-table-wrap"].map((selector) => { const element = document.querySelector(selector); const box = element.getBoundingClientRect(); return { selector, left: box.left, right: box.right, width: box.width, clientWidth: element.clientWidth, scrollWidth: element.scrollWidth, overflow: getComputedStyle(element).overflowX }; }),
    overflow: [...document.querySelectorAll("*")].map((element) => ({ selector: element.className || element.tagName, right: Math.round(element.getBoundingClientRect().right), width: element.scrollWidth })).filter((item) => item.right > window.innerWidth + 1).slice(0, 12)
  }));
  assert.equal(mobileMetrics.documentScrollWidth <= mobileMetrics.innerWidth, true, JSON.stringify(mobileMetrics));

  console.log(JSON.stringify({
    login: "pass",
    indexedDbPersistence: "pass",
    preview: "pass",
    documentLinks: "pass",
    zipExport: names,
    zipImport: "pass",
    mobileOverflow: "pass",
    mobileMetrics,
    zipPath,
    screenshots: [
      path.join(outputDirectory, "ctdf-admin-login.png"),
      path.join(outputDirectory, "ctdf-admin-document-links.png"),
      path.join(outputDirectory, "ctdf-document-links-page.png"),
      path.join(outputDirectory, "ctdf-admin-mobile.png")
    ]
  }, null, 2));
  await browser.close();
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
