const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const runtimeModules = "C:\\Users\\chuyi\\.cache\\codex-runtimes\\codex-primary-runtime\\dependencies\\node\\node_modules";
const { chromium } = require(path.join(runtimeModules, "playwright"));

const title = "WDF Asia-Pacific Cup 2026, Mongolia - Official Welcome Video";
const videoUrl = "https://www.youtube.com/watch?v=wWRWQvpGyv4";

(async () => {
  const root = process.cwd();
  const outputDirectory = path.resolve("tests/.output");
  fs.mkdirSync(outputDirectory, { recursive: true });

  const browser = await chromium.launch({
    headless: true,
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
  });

  try {
    const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
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
    await page.goto("http://localhost:4173/media/videos/");

    const firstCard = page.locator(".video-card").first();
    await firstCard.waitFor();
    assert.equal(await firstCard.locator("h3").textContent(), title);
    assert.equal(await firstCard.getAttribute("href"), videoUrl);
    assert.equal(await firstCard.locator("img").getAttribute("src"), "/media/photos/2026_APC.png");
    assert.ok(await firstCard.locator("img").evaluate((image) => image.complete && image.naturalWidth > 0), "Video thumbnail did not load");
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth), true, "Desktop layout overflows horizontally");
    await page.screenshot({ path: path.join(outputDirectory, "ctdf-video-publish-desktop.png"), fullPage: true });

    await page.setViewportSize({ width: 390, height: 844 });
    await page.reload();
    const mobileLayout = await page.evaluate(() => ({
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
      overflow: [...document.querySelectorAll("body *")]
        .map((element) => {
          const box = element.getBoundingClientRect();
          return { selector: element.className || element.tagName, left: box.left, right: box.right, width: box.width };
        })
        .filter((box) => box.left < -1 || box.right > document.documentElement.clientWidth + 1)
    }));
    console.log("mobile layout", JSON.stringify(mobileLayout, null, 2));
    assert.equal(mobileLayout.scrollWidth <= mobileLayout.clientWidth, true, "Mobile layout overflows horizontally");
    await page.screenshot({ path: path.join(outputDirectory, "ctdf-video-publish-mobile.png"), fullPage: true });

    console.log("video publish checks passed");
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
