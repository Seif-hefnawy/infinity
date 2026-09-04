// Run against an isolated Next build using NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:4312.
// PLAYWRIGHT_MODULE optionally points to an existing Playwright package directory.
import assert from "node:assert/strict";
import http from "node:http";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const { chromium, webkit } = await import(process.env.PLAYWRIGHT_MODULE
  ? pathToFileURL(resolve(process.env.PLAYWRIGHT_MODULE, "index.mjs")).href
  : "playwright");
const base = process.env.MEMORY_TEST_BASE_URL || "http://localhost:3100";
assert.ok(["localhost", "127.0.0.1"].includes(new URL(base).hostname));

const calls = [];
const responses = new Map();
const memory = (id, suffix = "") => ({
  memory_id: id, status: "PUBLISHED", title: null, images: [], music: null,
  special_message: null, created_at: "2025-01-01",
  stories: [1, 2].map(n => ({
    id: `story-${n}`, title: `Moment ${n} ${id}${suffix}`, date: "2025-01-01",
    content: `Private story content ${id}${suffix}`, content_images: [],
    image_url: null, spotify_url: null, caption: null, sort_order: n - 1,
  })),
});
const api = http.createServer(async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Authorization, Content-Type");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  if (req.method === "OPTIONS") { res.writeHead(204).end(); return; }
  res.setHeader("Content-Type", "application/json");
  const [, , , id, action] = req.url.split("/");
  if (action === "status") {
    res.end(JSON.stringify({ memory_exists: true, memory_id: id, status: id === "setup" ? "NOT_SETUP" : "PUBLISHED" }));
  } else if (action === "verify-pin") {
    res.end(JSON.stringify({ verified: true, view_token: `view-${id}`, view_token_expires_in_minutes: 30, edit_token: `edit-${id}`, edit_token_expires_in_minutes: 30, error: null }));
  } else if (!action && req.method === "GET") {
    calls.push({ id, token: req.headers.authorization });
    const response = responses.get(id) || {};
    if (response.wait) await response.wait;
    res.statusCode = response.status || 200;
    res.end(JSON.stringify(response.body || memory(id)));
  } else {
    res.statusCode = 500;
    res.end(JSON.stringify({ detail: "Unexpected API request in navigation test" }));
  }
});
const defer = (id, response = {}) => {
  let release;
  responses.set(id, { ...response, wait: new Promise(resolve => { release = resolve; }) });
  return release;
};
const count = id => calls.filter(call => call.id === id).length;
const until = async condition => {
  for (let n = 0; n < 200; n++) {
    if (await condition()) return;
    await new Promise(resolve => setTimeout(resolve, 50));
  }
  throw new Error("Timed out waiting for condition");
};

async function run(browser, name, viewport) {
  calls.length = 0;
  responses.clear();
  const context = await browser.newContext({ viewport });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", error => errors.push(error.message));
  // Use a local image placeholder; this test neither needs nor changes assets.
  await page.route("**/_next/image?**", route => route.fulfill({
    contentType: "image/png",
    body: Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jGAAAAABJRU5ErkJggg==", "base64"),
  }));
  const setSession = async (id, token, ttl = 600000) => page.evaluate(({ id, token, ttl }) => {
    sessionStorage.setItem(`memory_session:${id}`, JSON.stringify({ view: { token, expiresAt: Date.now() + ttl } }));
    window.dispatchEvent(new Event("focus"));
  }, { id, token, ttl });
  const noLoader = () => until(async () => await page.locator(".loader-container--page").count() === 0);
  const initialLoader = async () => {
    await page.locator(".loader-container--page").waitFor();
    assert.equal(await page.locator(".loader-brand").count(), 0);
    // Hydration replaces the anonymous session once storage is read. Inspect a
    // connected node, not an SSR loader that just got detached in that swap.
    const style = await (await page.waitForFunction(() => {
      const el = document.querySelector(".loader-container--page");
      if (!el) return false;
      const css = getComputedStyle(el);
      if (!css.backgroundColor) return false;
      return { background: css.backgroundColor, image: css.backgroundImage,
        labelWidth: el.querySelector("p").getBoundingClientRect().width };
    })).jsonValue();
    assert.equal(style.background, "rgb(255, 233, 236)");
    assert.equal(style.image, "none");
    assert.equal(style.labelWidth, 1, "loading label is screen-reader-only");
  };

  // Enter through the actual PIN UI: issuing a token must not prefetch twice.
  const releaseInitial = defer("a");
  await page.goto(`${base}/m/a`);
  assert.equal(count("a"), 0);
  for (const digit of ["1", "2", "3", "4"]) await page.getByRole("button", { name: digit, exact: true }).click();
  await page.getByRole("button", { name: "OK", exact: true }).click();
  await page.waitForURL(`${base}/m/a/home`);
  await initialLoader();
  await until(() => count("a") === 1);
  releaseInitial();
  await page.getByRole("heading", { name: "Our Memories" }).waitFor();
  await noLoader();
  await page.evaluate(() => {
    window.loadingMounts = 0;
    new MutationObserver(records => {
      for (const record of records) for (const node of record.addedNodes) {
        if (node instanceof Element && (node.matches(".loader-container--page") || node.querySelector(".loader-container--page"))) window.loadingMounts++;
      }
    }).observe(document.body, { subtree: true, childList: true });
  });

  // These are real router.push / Next Link transitions, not page.goto reloads.
  await page.getByRole("button", { name: "Tap to Read Story" }).click();
  await page.getByRole("heading", { name: "Moment 1 a", exact: true }).waitFor();
  await page.getByRole("link", { name: "Next memory: Moment 2 a" }).click();
  await page.getByRole("heading", { name: "Moment 2 a", exact: true }).waitFor();
  await page.getByRole("link", { name: "Previous memory: Moment 1 a" }).click();
  await page.getByRole("link", { name: /Back to Home/ }).click();
  await page.getByRole("heading", { name: "Our Memories" }).waitFor();
  await page.goBack();
  await page.getByRole("heading", { name: "Moment 1 a", exact: true }).waitFor();
  await page.goForward();
  await page.getByRole("heading", { name: "Our Memories" }).waitFor();
  assert.equal(count("a"), 1, "entire cached navigation loop uses one GET");
  assert.equal(await page.evaluate(() => window.loadingMounts), 0, "no loader mounted during cached navigation");
  assert.equal(calls[0].token, "Bearer view-a");
  const storage = await page.evaluate(() => JSON.stringify({ local: { ...localStorage }, session: { ...sessionStorage } }));
  assert.ok(!storage.includes("Private story content") && !storage.includes("Moment 1"), "content never persisted");
  console.log(`PASS ${name}: PIN -> Home -> Story -> next -> previous -> Home -> browser back/forward: one GET, zero loading mounts`);

  // Refresh and uncached direct story entry must each make a new authenticated GET.
  const releaseRefresh = defer("a");
  await page.reload();
  await initialLoader();
  await until(() => count("a") === 2);
  releaseRefresh();
  await noLoader();
  await setSession("b", "view-b");
  const releaseDeepLink = defer("b");
  await page.goto(`${base}/m/b/inf/story-2`);
  await initialLoader();
  await until(() => count("b") === 1);
  releaseDeepLink();
  await page.getByRole("heading", { name: "Moment 2 b", exact: true }).waitFor();
  assert.equal(calls.find(call => call.id === "b").token, "Bearer view-b");

  // Replacing a token invalidates the old content and fetches with the new token.
  const releaseReplacement = defer("b", { body: memory("b", " new") });
  await setSession("b", "view-b-new");
  await initialLoader();
  assert.equal(await page.getByRole("heading", { name: "Moment 2 b", exact: true }).count(), 0);
  await until(() => count("b") === 2);
  releaseReplacement();
  await page.getByRole("heading", { name: "Moment 2 b new", exact: true }).waitFor();
  assert.equal(calls.at(-1).token, "Bearer view-b-new");

  // Expiry while the page is open removes content and returns to PIN without a reload.
  await setSession("b", "view-b-new", 1200);
  await page.waitForURL(`${base}/m/b`);
  await page.getByRole("button", { name: "OK", exact: true }).waitFor();
  assert.equal(await page.getByRole("heading", { name: "Moment 2 b new", exact: true }).count(), 0);

  // A missing session never issues the protected GET.
  await page.goto(`${base}/m/no-token/inf/story-1`);
  await page.waitForURL(`${base}/m/no-token`);
  assert.equal(count("no-token"), 0);

  // 401 must clear every token in that memory session and redirect.
  responses.set("c", { status: 401, body: { detail: "Invalid session" } });
  await setSession("c", "invalid-c");
  await page.goto(`${base}/m/c/home`);
  await page.waitForURL(`${base}/m/c`);
  assert.equal(await page.evaluate(() => sessionStorage.getItem("memory_session:c")), null);
  await noLoader();

  // Late 401 from an older token must not clear a newer session or its data.
  const releaseOld = defer("d", { status: 401, body: { detail: "Old token" } });
  await setSession("d", "old-d");
  await page.goto(`${base}/m/d/home`);
  await until(() => count("d") === 1);
  responses.set("d", { body: memory("d") });
  await setSession("d", "new-d");
  await page.getByRole("heading", { name: "Our Memories" }).waitFor();
  releaseOld();
  await page.getByRole("button", { name: "Tap to Read Story" }).click();
  await page.getByRole("heading", { name: "Moment 1 d", exact: true }).waitFor();
  assert.ok((await page.evaluate(() => sessionStorage.getItem("memory_session:d"))).includes("new-d"));
  assert.equal(count("d"), 2);

  // Ordinary API errors remain visible, without a loading screen covering them.
  responses.set("error", { status: 500, body: { detail: "Visible memory failure" } });
  await setSession("error", "view-error");
  await page.goto(`${base}/m/error/inf/story-1`);
  await page.getByText("Visible memory failure", { exact: true }).waitFor();
  await noLoader();
  await page.goto(`${base}/m/setup/setup`);
  await page.getByRole("heading", { name: "Verify it's you" }).waitFor();
  assert.equal(count("setup"), 0, "setup never fetches published memory");
  assert.deepEqual(errors, []);
  console.log(`PASS ${name}: refresh, deep link, memory isolation, token replacement/expiry, missing session, 401, late response, errors, Setup`);
  await context.close();
}

await new Promise(resolve => api.listen(4312, "127.0.0.1", resolve));
try {
  for (const [engine, name, viewport, options] of [
    [chromium, "desktop-chrome", { width: 1440, height: 900 }, { channel: "chrome" }],
    [webkit, "mobile-webkit", { width: 390, height: 844 }, {}],
  ]) {
    const browser = await engine.launch({ headless: true, ...options });
    try { await run(browser, name, viewport); } finally { await browser.close(); }
  }
} finally {
  api.close();
}
