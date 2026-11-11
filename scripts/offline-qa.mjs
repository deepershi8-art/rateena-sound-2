import { chromium } from "@playwright/test";
import assert from "node:assert/strict";
import { writeFile } from "node:fs/promises";
const b = await chromium.launch({
  headless: true,
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});
try {
  const c = await b.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: "reduce",
    offline: true,
  });
  const p = await c.newPage();
  const requests = [],
    errors = [];
  p.on("request", (r) => {
    if (/^https?:/.test(r.url())) requests.push(r.url());
  });
  p.on("pageerror", (e) => errors.push(e.message));
  await p.goto(
    "file:///workspace/artifacts/RATEENA-SOUND-2.html#/flagship/study/architectural",
    { waitUntil: "load" },
  );
  await p.evaluate(() => document.fonts.ready);
  assert.equal(await p.locator("[data-room-envelope]").count(), 8);
  await p
    .locator(".plan-toolbar")
    .evaluate((el) => el.scrollIntoView({ block: "start" }));
  await p.screenshot({
    path: "docs/screens/offline-plan.png",
    animations: "disabled",
  });
  await p.getByRole("tab", { name: "Documents", exact: true }).click();
  assert(
    await p
      .locator(".room-information .concept-reference img")
      .evaluate((i) => i.complete && i.naturalWidth > 0),
  );
  const favicon = await p.locator('link[rel="icon"]').getAttribute("href");
  assert(favicon.startsWith("data:image/"));
  assert.deepEqual(requests, []);
  assert.deepEqual(errors, []);
  await writeFile(
    "docs/screens/offline-qa.json",
    JSON.stringify(
      {
        file: "/workspace/artifacts/RATEENA-SOUND-2.html",
        rooms: 8,
        conceptImageLoaded: true,
        officialFaviconInlined: true,
        externalRequests: requests,
        pageErrors: errors,
      },
      null,
      2,
    ),
  );
  console.log(
    "Offline standalone: 8 rooms, concept image, inlined official favicon, zero external requests, no browser errors.",
  );
} finally {
  await b.close();
}
