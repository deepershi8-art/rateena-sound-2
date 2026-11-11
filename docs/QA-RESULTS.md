# QA results — editorial visual edition

11 November 2026 — Africa/Cairo.

## Build and functional checks

- Production build: PASS (`npm run build`).
- Offline single-file build: PASS (`npm run build:offline`).
- Vitest: PASS — 13 tests across geometry, schema integrity, navigation, room editing, the static comparison and revision interactions.
- Dependency audit: zero vulnerabilities.
- Engineering content, data model, calculations, persistence keys and original logo are unchanged by this visual redesign. Existing local project data remains compatible.
- Offline HTML has inlined JavaScript, CSS, logo and fonts; no external script or stylesheet references. Its embedded logo matches the original JPG byte-for-byte.

## Real browser visual verification — PASS

Playwright's bundled Chromium / headless shell was installed with `npx playwright install chromium` and rendered the production build at `http://127.0.0.1:4173/rateena-sound-2/`. This succeeded, so Xvfb and stock-Chrome fallbacks were not required.

Screenshots were opened and inspected, then the design was refined for stronger small-text contrast, larger explanations and facility names visible in the desktop first fold. Final captures pause motion for a stable final-state layout; normal app motion remains enabled. A native-resolution crop confirmed the gold app-bar title renders correctly.

Required captures:

- `docs/screens/home.png` — 1440 × 900
- `docs/screens/knowledge-01.png` — 1440 × 900
- `docs/screens/architectural-proposal.png` — 1440 × 900; Main Live Room selected
- `docs/screens/mobile.png` — 390 × 844

Additional reviewed captures:

- `docs/screens/home-full.png`
- `docs/screens/mobile-full.png`
- `docs/screens/knowledge-02-1.png` — static comparison
- `docs/screens/geometry-calculator.png`

Browser checks reported no uncaught page errors, no broken logo images and no horizontal document overflow. `visual-qa.json` records the six captured routes. `responsive-qa.json` records 20 passing layout checks: home, Knowledge, architectural proposal and geometry at widths 320, 390, 768, 1024 and 1440 px.

The drafting canvas remains clean and empty. Chapter 02.1 remains static. Hierarchy and all technical qualifications are unchanged.

## Delivery

- Live application: https://deepershi8-art.github.io/rateena-sound-2/
- Repository: https://github.com/deepershi8-art/rateena-sound-2
- Standard build JS asset: `assets/index-DXfg9KNY.js` (new versus the preceding `index-BupqpVhw.js`).
- Offline edition: `/workspace/artifacts/RATEENA-SOUND-2.html`
- Clean source archive: `/workspace/artifacts/rateena-sound-2-source.zip`

Publishing uses the existing Pages workflow. No files or settings in the earlier Cairo application's repository were changed.

The final Pages HTML, JavaScript and stylesheet return HTTP 200, with asset names matching the production build used for visual review. The standalone file was also opened in bundled Chromium: both home sections and all logos rendered, no horizontal overflow or page errors occurred, and zero HTTP(S) requests were made. Its inspected preview is `/workspace/artifacts/RATEENA-SOUND-2-offline-preview.png`.
