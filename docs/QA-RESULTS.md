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


## Progressive existing-application update — 11 November 2026, 21:44 Cairo

- Production build/type-check passed; 24 Vitest tests passed across 4 files. Tests cover earlier source values, non-destructive schema migration, v1/v2 round trips, corrupt-storage preservation, eight-room areas, room non-overlap, unscaled object fit, static 02.1, five chapters, seven room tabs, editable dimensions, grid layers, access-door presence, fixed isolation construction geometry and five Center placeholders.
- Production dependency audit: 0 vulnerabilities. Vite reports a non-fatal approximately 510 kB JS chunk warning; the standalone edition intentionally bundles the application.
- Isolated Playwright bundled Chromium rendered desktop 1440 × 900 and 390 px mobile pages. Screenshots were opened and visually reviewed, not merely generated. Existing branding/identity is preserved. Compact room labels, a correct lounge access door, outward WC door swings, diagram pan, metre-grid visibility inside rooms and mobile capture positioning were checked/fixed.
- Responsive matrix: 40 checks (320 / 390 / 768 / 1024 / 1440 px; eight routes), zero document overflow. No page errors or broken visible image assets in the capture pass.
- Pixel-based geometric checks use actual rendered SVG bounds, not dimension labels. The 5 m scale bar measures 124.053 px; the 12 m live room width 297.728 px; the 3 m booth width 74.432 px; concert-grand depth 2.74 m 67.981 px. Uniform x/y projection: 24.81067 px/m. Live/booth area ratio 13.32801, matching 99.96 / 7.5. Assumed 0.30 m wall zone renders 7.443 px.
- Standalone HTML tested through file:// with network disabled: eight rooms present, concept image loaded, official favicon inlined, zero HTTP(S) requests, zero browser errors. Fonts and all bundled imagery are inlined.
- Current local production assets: /rateena-sound-2/assets/index-6XdUCDJY.js, /rateena-sound-2/assets/index-DimLACmK.css. Existing Pages workflow will publish these same source changes; final remote status/hash verification is supplied in the handoff and deployment artifact.

### Current visual evidence

`docs/screens/`: home.png; home-full.png; mobile.png; mobile-full.png; knowledge-01.png; knowledge-02-1.png; architectural-proposal.png; true-scale-plan.png; selected-bass-booth.png; room-documents.png; mobile-plan.png; center.png; isolation-stage-1.png; isolation-stage-2.png; isolation-stage-3.png; offline-plan.png. Machine-readable: progressive-qa.json, responsive-qa.json, offline-qa.json. Earlier screenshot files remain historical unless listed here.

This is an expanded, true-scale preliminary spatial study, not a resolved building footprint, final acoustic construction design or compliance approval. See CLARIFICATIONS.md for concept contradictions and explicitly assumed room shapes, wall zones and access strips.
