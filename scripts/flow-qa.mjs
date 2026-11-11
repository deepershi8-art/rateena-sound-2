import { chromium } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";
import assert from "node:assert/strict";
const origin = process.env.QA_URL || "http://127.0.0.1:4173/rateena-sound-2/";
const out = "docs/screens/flow";
await mkdir(out, { recursive: true });
const browser = await chromium.launch({
  headless: true,
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});
const results = [];
const shots = [
  ["splash", "/", null],
  ["gateway", "/gateway", null],
  ["studio-management", "/management", null],
  ["rateena-projects", "/rateena", null],
  ["flagship-design-brief", "/flagship/study/architectural", ".design-brief"],
  ["flagship-plan-windows", "/flagship/study/architectural", ".plan-toolbar"],
  [
    "knowledge-isolation",
    "/flagship/knowledge/sound-isolation",
    ".topic-cards",
  ],
  [
    "knowledge-cube-modes",
    "/flagship/knowledge/acoustic-treatment",
    ".mode-cube",
  ],
];
try {
  for (const [device, width, height] of [
    ["desktop", 1440, 900],
    ["mobile", 390, 844],
  ]) {
    for (const [name, route, anchor] of shots) {
      const cube = name === "knowledge-cube-modes";
      const context = await browser.newContext({
        viewport: { width, height },
        deviceScaleFactor: 1,
        reducedMotion: cube ? "no-preference" : "reduce",
      });
      const page = await context.newPage();
      const errors = [];
      page.on("pageerror", (e) => errors.push(e.message));
      await page.goto(origin + "#" + route, { waitUntil: "networkidle" });
      await page.evaluate(() => document.fonts.ready);
      if (anchor)
        await page
          .locator(anchor)
          .first()
          .evaluate((el) => el.scrollIntoView({ block: "start" }));
      if (cube) await page.waitForTimeout(2600);
      await page.screenshot({
        path: `${out}/${device}-${name}.png`,
        animations: cube ? "allow" : "disabled",
      });
      if (name === "flagship-plan-windows" && device === "desktop") {
        await page
          .locator(".metre-plan")
          .screenshot({ path: `${out}/desktop-plan-detail.png` });
        assert.equal(await page.locator("[data-window]").count(), 6);
      }
      if (name === "splash") {
        const s = await page.evaluate(() => {
          const img = document.querySelector(".splash-logo");
          const r = img.getBoundingClientRect();
          return {
            anim: getComputedStyle(img).animationName,
            trans: getComputedStyle(img).transitionDuration,
            share: (r.width * r.height) / (innerWidth * innerHeight),
            buttons: document.querySelectorAll("button,a").length,
          };
        });
        assert.equal(s.anim, "none");
        assert.equal(s.buttons, 0);
        results.push({ device, splash: s });
        await page.mouse.click(width * 0.1, height * 0.1);
        await page.waitForURL(/#\/gateway$/);
      }
      if (cube) {
        const lit = await page
          .locator(".mode-canvas-wrap canvas")
          .evaluate((c) => {
            const d = c
              .getContext("2d")
              .getImageData(0, 0, c.width, c.height).data;
            let n = 0;
            for (let i = 0; i < d.length; i += 16)
              if (d[i] + d[i + 1] + d[i + 2] > 180) n++;
            return n;
          });
        assert(lit > 50, "cube canvas rendered");
      }
      const layout = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        width: innerWidth,
      }));
      assert.equal(
        layout.scrollWidth,
        layout.width,
        `${device} ${name} overflow`,
      );
      assert.deepEqual(errors, []);
      results.push({ device, name, ...layout });
      await context.close();
    }
  }
  await writeFile(`${out}/flow-qa.json`, JSON.stringify(results, null, 2));
  console.log(JSON.stringify(results));
} finally {
  await browser.close();
}
