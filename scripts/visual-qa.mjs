import { chromium } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";
const origin = process.env.QA_URL || "http://127.0.0.1:4173/rateena-sound-2/";
const browser = await chromium.launch({
  headless: true,
  timeout: 20000,
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});
const results = [];
try {
  await mkdir("docs/screens", { recursive: true });
  for (const [name, route, width, height] of [
    ["home", "/", 1440, 900],
    ["knowledge-01", "/flagship/knowledge/sound", 1440, 900],
    ["architectural-proposal", "/flagship/study/architectural", 1440, 900],
    ["mobile", "/", 390, 844],
    ["knowledge-02-1", "/flagship/knowledge/static-comparison", 1440, 900],
    ["geometry-calculator", "/flagship/study/geometry", 1440, 900],
  ]) {
    const context = await browser.newContext({
      viewport: { width, height },
      deviceScaleFactor: 1,
      reducedMotion: "reduce",
    });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    page.setDefaultTimeout(15000);
    await page.goto(origin + "#" + route, {
      waitUntil: "networkidle",
      timeout: 20000,
    });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(1600);
    await page.screenshot({
      path: `docs/screens/${name}.png`,
      timeout: 15000,
      animations: "disabled",
    });
    if (name === "home" || name === "mobile")
      await page.screenshot({
        path: `docs/screens/${name}-full.png`,
        fullPage: true,
        timeout: 15000,
        animations: "disabled",
      });
    const layout = await page.evaluate(() => ({
      width: innerWidth,
      scrollWidth: document.documentElement.scrollWidth,
      overflow: document.documentElement.scrollWidth > innerWidth,
      images: [...document.images].map((i) => ({
        alt: i.alt,
        loaded: i.complete && i.naturalWidth > 0,
      })),
    }));
    const row = { name, route, width, height, ...layout, errors };
    results.push(row);
    console.log(JSON.stringify(row));
    await context.close();
  }
  await writeFile(
    "docs/screens/visual-qa.json",
    JSON.stringify(results, null, 2),
  );
  if (
    results.some(
      (r) => r.overflow || r.errors.length || r.images.some((i) => !i.loaded),
    )
  )
    process.exitCode = 1;
} finally {
  await browser.close();
}
