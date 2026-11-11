import { chromium } from "@playwright/test";
import { writeFile } from "node:fs/promises";
const b = await chromium.launch({
  headless: true,
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});
const checks = [];
try {
  for (const width of [320, 390, 768, 1024, 1440]) {
    for (const route of [
      "/",
      "/flagship/knowledge/sound",
      "/flagship/study/architectural",
      "/flagship/study/geometry",
    ]) {
      const c = await b.newContext({
        viewport: { width, height: 900 },
        reducedMotion: "reduce",
      });
      const p = await c.newPage();
      await p.goto("http://127.0.0.1:4173/rateena-sound-2/#" + route, {
        waitUntil: "networkidle",
      });
      await p.evaluate(() => document.fonts.ready);
      const row = await p.evaluate(() => ({
        width: innerWidth,
        scrollWidth: document.documentElement.scrollWidth,
        overflow: document.documentElement.scrollWidth > innerWidth,
      }));
      checks.push({ ...row, route });
      console.log(JSON.stringify({ ...row, route }));
      await c.close();
    }
  }
  await writeFile(
    "docs/screens/responsive-qa.json",
    JSON.stringify(checks, null, 2),
  );
  if (checks.some((c) => c.overflow)) process.exitCode = 1;
} finally {
  await b.close();
}
