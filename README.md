# RATEENA SOUND 2

A working, desktop-first React + TypeScript engineering workspace for the Cairo studio project. This is a separate application codebase; no files or repositories belonging to the earlier Cairo investor app were touched.

The original owner brief is preserved in `docs/MASTER-PROMPT.md`. Later owner clarifications retain the premium design and the content explicitly supplied in the brief, defer Arabic, and supply an official logo. The owner’s subsequent existing-application update is preserved verbatim in `docs/EXISTING-APPLICATION-UPDATE.md`. The current floor plan is a clearly proposed true-scale spatial study, not an approved footprint. No engineering result or compliance claim is invented.

## Local development

Node.js 24 recommended.

```sh
npm install
npm run dev
npm run build
npm test
```

Vite serves `http://localhost:5173/rateena-sound-2/`. `npm run preview` serves the production build. Routing uses `HashRouter`, so static hosting does not require route rewrites. Fonts are bundled locally; the application does not require third-party font requests.

## Implemented — navigation flow update (11 Nov 2026)

Brief preserved in `docs/UPDATE-2026-11-11-flow.md`.

- **Splash** (`#/`): only the official logo on black, no motion, a tiny “Tap anywhere”. Click/tap anywhere, Enter or Space continues.
- **Gateway** (`#/gateway`): Studio Management and RATEENA SOUND. The header logo returns here.
- **Studio Management** (`#/management`): a single full-bleed slot, “Studio graphic plan – to be uploaded”. The owner can add/replace/remove a PNG/JPEG/WebP (≤ 15 MB) which is stored on that device in IndexedDB (not in JSON export, not published). A typed, empty hotspot layer is ready for future room links. The earlier nine Project Management modules are retired from navigation but retained in code (`LegacyHome`).
- **RATEENA SOUND** (`#/rateena`): RATEENA SOUND FLAGSHIP STUDIO (gold) and RATEENA SOUND CENTER (blue). Center placeholders now describe a future home for other studio types and specialised facilities.
- **Flagship** lands on **Technical Study**: a five-point Design Brief (proportion informed by — not equal to — the golden ratio, shown as H : W : L = 1 : 1.85 : 2.67; up to 25 musicians as the design target; length vs. low-E 41.2 Hz → 8.33 m at 343 m/s; height; central control room), an owner 2D-plan upload slot, then the unchanged true-scale plan, now with six proposed control-room windows (live, lounge, percussion, bass, vocal) labelled “proposed double / laminated glazing”, no rating.
- **Knowledge** order: 01 Understanding Sound; 02 Stopping Sound — Isolation (mass, decoupling, floating, box-in-box + three-stage model); 03 Acoustic Treatment (absorption, diffusion, reflection + interactive 3D wireframe cube); 04 HVAC & Conditioning; 05 Equipment Infrastructure; 06 Equipment; Appendix A Terminology; Appendix B Standards. Every topic has a local image slot. Old deep links still resolve.
- **3D cube**: canvas wireframe (gold/blue on navy), drag to orbit, a source emitting rays that reflect specularly, a selectable axial standing wave with nodes/antinodes, L/W/H sliders (default 12.00 / 8.33 / 4.50 m), first four axial modes per axis, coincident (≤ 1 %) / clustered (≤ 5 %) flags and spacing verdict. Labelled illustrative; values Calculated (rectangular-room approximation, axial only). Pause control; starts paused under prefers-reduced-motion.

## Earlier — progressive existing-application update

- Existing luxury editorial branding, logo, typography, navigation components and local study records retained; this is not a replacement app.
- Exactly two gateways: **Project Management** and **RATEENA SOUND**. RATEENA SOUND contains exactly **RATEENA SOUND FLAGSHIP STUDIO** and **RATEENA SOUND CENTER**. Project Management retains its nine empty future modules.
- Flagship has exactly **Knowledge** and **Technical Study** tabs; no Introduction page. Knowledge has five chapters: Understanding Sound; Sound Isolation; Internal Acoustics; Acoustic Terminology; International Standards. All earlier topics, illustrations and progressive reveals are retained within the new chapters; earlier deep links remain functional. 02.1 remains entirely static inside its lesson.
- Three-stage isolation construction model uses the live room’s preliminary proportions and one fixed camera: structural shell → independent inner envelope → floating floor/continuity. Wall, floor and ceiling principles are separate. Mass–Decoupling–Damping and floating construction complement the integrated Room-in-Room intent; no universal springs or common isolated raft are asserted.
- Technical Study opens on the **eight-room selectable true-scale floor plan**. One SVG unit equals one metre. Actual room rectangles match supplied dimensions; tiny 7.5 m² booths remain tiny beside the 99.96 m² live-room envelope. A working 5 m scale bar, metre-grid toggle, real-scale wall zones, doors and typical instruments/furniture, zoom/pan, fullscreen, layer preferences and physical-scale SVG export are included.
- Eight current net-area targets: Live 100; Control 24.5; Percussion 18; Bass/Rhythm 7.5; Vocal 7.5; Equipment 8; Storage 10; Lounge & Services 70 m². Heights remain unknown where not supplied. WC Men/Women are included in Lounge & Services. Target areas and calculated rectangle areas are distinguished.
- Every selected room has seven tabs: Overview; Architecture; Sound Isolation; Internal Acoustics; Infrastructure; Equipment; Documents. Dimensions, capacity notes, study findings and evidence statuses can be edited locally. The concept reference image appears outside the canvas and in Documents. Add local images/diagrams/specifications/documents; no backend upload is implied.
- Six expandable technical sections follow the plan: Studio-wide Isolation Architecture; HVAC and Environmental Control; Electrical, Audio and Network Infrastructure; Construction Coordination; Equipment Planning; Engineering References and Verification. Missing actual findings remain editable placeholders.
- Center has five expandable, editable organizational placeholders: Specialized Audio Production Facilities; Additional Recording Studios — Coming Later; Supporting Technical Facilities; Shared Infrastructure and Services; Future Departments and Expansion. These are not confirmed facility specifications.
- Existing Golden / published Sepmeyer A/B/C comparisons, qualitative Bolt illustration, rectangular axial modes, non-parallel-wall caveats, NC-15 aspiration, targets, decisions, verification registers, references and earlier ten-section text are retained in clearly labelled earlier-study views. No initial Simulated, Measured or Verified outcomes.
- Evidence status system: Proposed / Calculated / Simulated / Measured / Verified. Applicable ISO scopes plus IEC 61672-1, IEC 61260-1, ITU-R BS.1116 and EBU Tech 3276; no certification assertion.
- **Schema v2** adds a separate current programme, resources, notes and preferences while preserving all five earlier rooms and all edited values, decisions and revisions. The old `rateena-sound-2:v1` browser key is left untouched. Corrupt saved data is not silently overwritten. JSON import accepts v1 and v2; export includes both current and retained records. Local attachments are embedded in JSON backups.
- The concept’s footprint conflicts are explicit, not concealed: 12 × 14.18 m cannot contain the stated 245.5 m² net targets; vertical bands total 20.03 m. See `docs/CLARIFICATIONS.md`. Equipment/storage shapes, wall zones and access strips are explicit diagram assumptions, not fabricated approved specifications.

## Official logo

The supplied original `src/assets/logo/rateena-official.jpg` is used in the shared header, home identity panel and favicon. Its design and source pixels are unchanged; CSS only crops outer black margins and blends its background into the UI.

## Offline single-file edition

```sh
npm run build:offline
```

This produces `dist-offline/index.html`: a self-contained application with inlined JavaScript, CSS, official logo, concept reference image and bundled fonts. Open it directly in a modern browser using `file://`; no server or internet connection is required to use the app. Engineering source links naturally require internet if opened. HashRouter keeps navigation within the file.

The delivered standalone copy is `/workspace/artifacts/RATEENA-SOUND-2.html`; the complete source archive is `/workspace/artifacts/rateena-sound-2-source.zip` (no node_modules or build output). Browser policies for local-file storage vary; JSON export/import remains the portable backup mechanism. To enable reliable shared persistence, use the hosted app or a local web server.

## Future integration / not claimed implemented

- Approved final 2D floor plan, real drawing authoring and geometry import.
- CAD/DXF integration, PDF export, independent 3D view derived from approved geometry.
- Acoustic simulation, ray tracing, measured results and commissioning approval.
- Full non-rectangular acoustic modelling. Polygon utility support alone is not a room solver.
- Backend, accounts, synchronisation, collaboration and formal approval permissions.
- Operational project management data and workflows.
- Phase Two engineering programme and study content.
- Arabic UI, deferred in the latest owner clarification. Logical CSS and a label boundary preserve a path to future RTL support.

The SVG export is the current **provisional spatial study**, not an approved construction deliverable. Screen zoom and display calibration affect apparent scale; the export uses millimetre SVG units and the selected nominal scale at 100% zoom. Do not measure a browser screen with a ruler.

## Data and evidence limits

Room dimensions are proposed reference envelopes, not approved construction dimensions. Derived values are calculated, not measured. The exact formula and input assumptions accompany results. Changes are committed with the Save button, not every uncommitted keystroke. The layer toggle changes local project revision history, not the approved drawing revision.

Import accepts v1/v2 project data; it preserves the old pending approved-geometry record separately from the derived, provisional concept spatial study. Arbitrary CAD/approved geometry import remains a future integration. Keep exported JSON backups. Local storage is device/browser specific, not a remote database.

Timestamps are shown in **Africa/Cairo**; persisted instants use ISO timestamps.

## Reference cross-check

Sepmeyer sets were cross-checked against the published table at <https://acoustic.ua/forms/rr.en.html> and <https://www.bandcoach.org/calculators/roomVolCalc.html> on 11 November 2026:

- A — 1 : 1.14 : 1.39
- B — 1 : 1.28 : 1.54
- C — 1 : 1.60 : 2.33

Primary research identifiers: Sepmeyer (1965), <https://doi.org/10.1121/1.1909344>; Bolt (1946), <https://doi.org/10.1121/1.1916349>. Secondary-table confirmation is not a certification of the proposed facility. The Bolt shading is hand-sketched and explicitly illustrative.

## QA

`npm run build` type-checks and compiles production assets. `npm test` runs Vitest geometry, schema and component interaction tests. DOM component tests are not a visual-browser inspection. The screenshot/browser hand-off, including earlier required routes, is in `docs/SCREENSHOT-BRIEF.md`. The visual redesign was rendered with Playwright’s isolated bundled Chromium. Desktop and mobile screenshots are in `docs/screens/` and were visually reviewed. The viewport matrix checks 320, 390, 768, 1024 and 1440 px across home, Knowledge, architectural proposal and geometry views, with no document overflow. See `docs/QA-RESULTS.md`.


To reproduce visual QA (against the local production preview):

```sh
npx playwright install chromium
npm run build
npm run preview -- --port 4173
# In another terminal:
npm run test:visual
npm run test:responsive
```

These scripts launch a fresh isolated headless test browser, not a saved desktop browser profile. Screenshots pause motion to capture the final layout consistently; normal CSS reveals remain enabled in the application.

## Static deployment preparation

Vite base is `/rateena-sound-2/`. A GitHub Pages Actions workflow is prepared at `.github/workflows/pages.yml`; it runs tests and builds before deployment. The existing repository uses GitHub Actions as its Pages source.

The owner approved public publication of this application. Target repository: <https://github.com/deepershi8-art/rateena-sound-2>. Target Pages URL: <https://deepershi8-art.github.io/rateena-sound-2/>. See the QA record for deployment verification. The earlier Cairo application repository remains untouched.

For Vercel or root-domain deployment, set `base: '/'` in `vite.config.ts`; the output directory remains `dist`.
