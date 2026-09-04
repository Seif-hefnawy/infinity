// Isolated Next app must use NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:4312.
import assert from "node:assert/strict";
import http from "node:http";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const { chromium, webkit } = await import(process.env.PLAYWRIGHT_MODULE
  ? pathToFileURL(resolve(process.env.PLAYWRIGHT_MODULE, "index.mjs")).href
  : "playwright");
const base = process.env.MEMORY_TEST_BASE_URL || "http://localhost:3100";
assert.ok(["localhost", "127.0.0.1"].includes(new URL(base).hostname));
let requests = 0;
let release;
let pending;
const hold = () => { pending = new Promise(resolve => { release = resolve; }); };
const data = {
  memory_id: "refresh", status: "PUBLISHED", title: null, images: [], music: null,
  special_message: null, created_at: "2025-01-01",
  stories: [{ id: "story-1", title: "Refresh story", date: "2025-01-01",
    content: "Private test story", content_images: [], image_url: null,
    spotify_url: null, caption: null, sort_order: 0 }],
};
const api = http.createServer(async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Authorization, Content-Type");
  if (req.method === "OPTIONS") { res.writeHead(204).end(); return; }
  res.setHeader("Content-Type", "application/json");
  if (req.url.endsWith("/status")) {
    res.end(JSON.stringify({ memory_exists: true, memory_id: "refresh", status: "PUBLISHED" }));
  } else {
    requests++;
    await pending;
    res.end(JSON.stringify(data));
  }
});

async function run(browser, name, viewport) {
  const context = await browser.newContext({ viewport });
  await context.addInitScript(() => {
    sessionStorage.setItem("memory_session:refresh", JSON.stringify({
      view: { token: "test-view", expiresAt: Date.now() + 600000 },
    }));
    window.homeTrace = [];
    window.dataReady = false;
    const record = () => {
      if (!document.body) return;
      const cards = [...document.querySelectorAll('[class~="bg-white/80"], [class~="backdrop-blur-sm"][class~="rounded-2xl"]')];
      for (const card of cards) {
        const entry = { path: location.pathname, ready: window.dataReady,
          classes: card.className, html: card.outerHTML.slice(0, 2200) };
        if (!window.homeTrace.some(item => item.path === entry.path && item.ready === entry.ready && item.classes === entry.classes)) window.homeTrace.push(entry);
      }
    };
    new MutationObserver(record).observe(document, { childList: true, subtree: true });
    const fetchOriginal = window.fetch;
    window.fetch = async (...args) => {
      const response = await fetchOriginal(...args);
      if (response.url.endsWith("/api/memory/refresh") && response.ok) window.dataReady = true;
      return response;
    };
  });
  const page = await context.newPage();
  const routes = [];
  page.on("framenavigated", frame => { if (frame === page.mainFrame()) routes.push(frame.url()); });
  await page.route("**/_next/image?**", route => route.fulfill({ contentType: "image/png",
    body: Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jGAAAAABJRU5ErkJggg==", "base64") }));

  for (const mode of ["empty RAM entry", "hard refresh"]) {
    hold();
    const before = requests;
    if (mode === "hard refresh") await page.reload();
    else await page.goto(`${base}/m/refresh/home`);
    await page.waitForFunction(() => document.querySelector(".loader-pendulum"));
    // Sample the whole initial wait, including any transient entry/PIN mount.
    await page.waitForTimeout(700);
    const trace = await page.evaluate(() => window.homeTrace);
    assert.deepEqual(trace.filter(item => !item.ready), [], "no card before PublishedMemory is ready");
    assert.equal(await page.getByRole("heading", { name: "Our Memories" }).count(), 0);
    assert.equal(await page.locator('[style*="perspective: 1000px"]').count(), 0, "carousel not mounted");
    assert.equal(await page.locator(".loader-container--page").count(), 1);
    assert.equal(await page.locator(".loader-container--page").evaluate(el => getComputedStyle(el).backgroundColor), "rgb(255, 233, 236)");
    console.log(`PASS ${name} ${mode}: no card/carousel before data; routes ${routes.map(url => new URL(url).pathname).join(" -> ")}`);
    if (mode === "hard refresh") await page.screenshot({ path: resolve("build", `home-refresh-${name.replaceAll(" ", "-")}.png`) });
    release();
    await page.getByRole("heading", { name: "Our Memories" }).waitFor();
    await page.getByRole("button", { name: "Tap to Read Story" }).waitFor();
    assert.equal(requests - before, 1, "fresh data is still fetched exactly once");
  }

  const cachedCount = requests;
  await page.evaluate(() => {
    window.cachedLoaderMounts = 0;
    new MutationObserver(records => {
      for (const record of records) for (const node of record.addedNodes) {
        if (node instanceof Element && (node.matches(".loader-container--page") || node.querySelector(".loader-container--page"))) window.cachedLoaderMounts++;
      }
    }).observe(document.body, { childList: true, subtree: true });
  });
  await page.getByRole("button", { name: "Tap to Read Story" }).click();
  await page.getByRole("heading", { name: "Refresh story", exact: true }).waitFor();
  await page.getByRole("link", { name: /Back to Home/ }).click();
  await page.getByRole("heading", { name: "Our Memories" }).waitFor();
  assert.equal(requests, cachedCount);
  assert.equal(await page.evaluate(() => window.cachedLoaderMounts), 0);
  console.log(`PASS ${name}: empty RAM, hard refresh, cached Home -> Story -> Home`);
  await context.close();
}

await new Promise(resolve => api.listen(4312, "127.0.0.1", resolve));
try {
  for (const [engine, name, viewport, options] of [
    [chromium, "Chrome", { width: 1440, height: 900 }, { channel: "chrome" }],
    [webkit, "WebKit 390px", { width: 390, height: 844 }, {}],
  ]) {
    const browser = await engine.launch({ headless: true, ...options });
    try { await run(browser, name, viewport); } finally { await browser.close(); }
  }
} finally {
  api.close();
}
