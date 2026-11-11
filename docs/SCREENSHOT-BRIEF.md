# Visual QA — completed

The editorial redesign was successfully rendered using Playwright's isolated bundled Chromium. Final images were opened and inspected; the review prompted readability and first-fold spacing refinements.

Run a production preview on port 4173, then:

```sh
npx playwright install chromium
npm run test:visual
npm run test:responsive
```

The screenshots use reduced motion to capture a stable final layout. All tested logos load, no page errors were recorded, and 20 width/route combinations report no horizontal document overflow. See QA-RESULTS.md and the JSON results in docs/screens/.

Core screenshot routes: home, Knowledge chapter 01, Technical Study architectural proposal and 390 px mobile home. Additional captures cover the static 02.1 comparison and geometry calculator.
