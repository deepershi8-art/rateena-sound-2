import { chromium } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";
import assert from "node:assert/strict";
const origin = process.env.QA_URL || "http://127.0.0.1:4173/rateena-sound-2/";
const browser = await chromium.launch({
  headless: true,
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});
const results = [];
await mkdir("docs/screens", { recursive: true });
try {
  for (const [name, route, width] of [
    ["home", "/", 1440],
    ["knowledge-01", "/flagship/knowledge/sound", 1440],
    ["knowledge-02-1", "/flagship/knowledge/static-comparison", 1440],
    ["architectural-proposal", "/flagship/study/architectural", 1440],
    ["center", "/centre", 1440],
    ["mobile", "/", 390],
    ["mobile-plan", "/flagship/study/architectural", 390],
  ]) {
    const context = await browser.newContext({
      viewport: { width, height: 900 },
      reducedMotion: "reduce",
    });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto(origin + "#" + route, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    if (name === "architectural-proposal" || name === "mobile-plan")
      await page
        .locator(".plan-toolbar")
        .evaluate((el) => el.scrollIntoView({ block: "start" }));
    await page.screenshot({
      path: `docs/screens/${name}.png`,
      animations: "disabled",
    });
    if (name === "home" || name === "mobile")
      await page.screenshot({
        path: `docs/screens/${name}-full.png`,
        fullPage: true,
        animations: "disabled",
      });
    const layout = await page.evaluate(() => ({
      width: innerWidth,
      scrollWidth: document.documentElement.scrollWidth,
      images: [...document.images]
        .filter((i) => i.offsetParent !== null)
        .map((i) => ({ alt: i.alt, loaded: i.complete && i.naturalWidth > 0 })),
    }));
    assert.equal(
      layout.width,
      layout.scrollWidth,
      `${name} horizontal overflow`,
    );
    assert.deepEqual(errors, []);
    assert(layout.images.every((i) => i.loaded));
    results.push({ name, ...layout, errors });
    if (name === "architectural-proposal") {
      await page
        .locator(".metre-plan")
        .screenshot({ path: "docs/screens/true-scale-plan.png" });
      const geometry = await page.evaluate(() => {
        const get = (s) => document.querySelector(s).getBoundingClientRect();
        const bar = get('[data-testid="scale-bar-five-metres"]');
        const live = get('[data-room-envelope="live"]');
        const booth = get('[data-room-envelope="bass"]');
        const piano = get('[data-object="grand"] .object-bounds');
        const console = get('[data-object="console"] .object-bounds');
        const chair = get('[data-object="engineer"] .object-bounds');
        const m = document.querySelector(".metre-plan svg").getScreenCTM();
        return {
          barPixels: bar.width,
          liveWidthPixels: live.width,
          boothWidthPixels: booth.width,
          pianoDepthPixels: piano.height,
          consoleWidthPixels: console.width,
          engineerChairPixels: chair.width,
          liveToBoothArea:
            (live.width * live.height) / (booth.width * booth.height),
          xMetrePixels: m.a,
          yMetrePixels: m.d,
          wallZonePixels:
            Number.parseFloat(
              getComputedStyle(document.querySelector('[data-wall="live"]'))
                .strokeWidth,
            ) * m.a,
        };
      });
      const near = (actual, expected) =>
        assert(
          Math.abs(actual - expected) < 0.0001,
          `${actual} != ${expected}`,
        );
      near(geometry.liveWidthPixels / geometry.barPixels, 12 / 5);
      near(geometry.boothWidthPixels / geometry.barPixels, 3 / 5);
      near(geometry.pianoDepthPixels / geometry.barPixels, 2.74 / 5);
      near(geometry.consoleWidthPixels / geometry.barPixels, 2.2 / 5);
      near(geometry.engineerChairPixels / geometry.barPixels, 0.65 / 5);
      near(geometry.liveToBoothArea, 99.96 / 7.5);
      near(geometry.xMetrePixels, geometry.yMetrePixels);
      near(geometry.wallZonePixels / geometry.barPixels, 0.3 / 5);
      results.push({ geometry });
      await page
        .getByRole("button", {
          name: "Select Bass / Rhythm Isolation Booth, 7.5 square metre target",
        })
        .click();
      await page.screenshot({ path: "docs/screens/selected-bass-booth.png" });
      await page.getByRole("tab", { name: "Documents", exact: true }).click();
      await page.screenshot({ path: "docs/screens/room-documents.png" });
      await page
        .getByRole("tab", { name: "Architecture", exact: true })
        .click();
      const textarea = page.getByLabel("Bass / Rhythm Architecture study", {
        exact: true,
      });
      await textarea.fill("QA temporary local note");
      await page
        .getByRole("button", { name: "Save content", exact: true })
        .first()
        .click();
      await page.reload({ waitUntil: "networkidle" });
      assert(
        (await page.evaluate(
          () =>
            JSON.parse(localStorage.getItem("rateena-sound-2:v2")).notes[
              "room:bass:Architecture"
            ].body,
        )) === "QA temporary local note",
      );
    }
    await context.close();
  }
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  await page.goto(origin + "#/flagship/knowledge/sound-isolation", {
    waitUntil: "networkidle",
  });
  await page.locator(".isolation-model").scrollIntoViewIfNeeded();
  for (let i = 0; i < 3; i++) {
    await page.locator(".model-controls button").nth(i).click();
    await page.screenshot({
      path: `docs/screens/isolation-stage-${i + 1}.png`,
      animations: "disabled",
    });
  }
  await context.close();
  await writeFile(
    "docs/screens/progressive-qa.json",
    JSON.stringify(results, null, 2),
  );
  console.log(JSON.stringify(results, null, 2));
} finally {
  await browser.close();
}
