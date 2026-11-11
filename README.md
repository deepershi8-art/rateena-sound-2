# RATEENA SOUND 2

A working, desktop-first React + TypeScript engineering workspace for the Cairo studio project. This is a separate application codebase; no files or repositories belonging to the earlier Cairo investor app were touched.

The original owner brief is preserved in `docs/MASTER-PROMPT.md`. Later owner clarifications retain the premium design and the content explicitly supplied in the brief, defer Arabic, and supply an official logo. No unapproved floor plan or invented engineering result is included.

## Local development

Node.js 24 recommended.

```sh
npm install
npm run dev
npm run build
npm test
```

Vite serves `http://localhost:5173/rateena-sound-2/`. `npm run preview` serves the production build. Routing uses `HashRouter`, so static hosting does not require route rewrites. Fonts are bundled locally; the application does not require third-party font requests.

## Implemented

- Premium near-black navy interface, restrained metallic-gold flagship identity, separate cool-blue Phase Two identity, responsive desktop/tablet/mobile layouts, cyan SVG technical sketches and reduced-motion support.
- Exactly two primary home sections: **Project Management** and **Technical Study & Knowledge**. Exactly two independent facility cards. No Knowledge top-level section or Studio Introduction page.
- Project Management visibly **Under Construction**. Expandable empty structures for tasks, milestones, deliverables, dependencies, risks, budget, contractors, documents and approvals; no invented operational data.
- Flagship opens directly on **Knowledge** and has exactly two main tabs. **Technical Study** opens directly on Architectural Proposal, independently of chapter completion.
- Knowledge chapters covering every topic supplied in the brief. Animated stroke-draw diagrams and progressive reveals; Chapter **02.1 is static** with no controls, animation or audio inside its lesson. Normal book navigation remains outside the lesson. Every chapter links principles to a design decision.
- All 10 Technical Study sections, including the preliminary strategy text, requirements and caveats explicitly described in the master prompt.
- Empty metric drawing workspace with the exact pending-approval status; zoom, drag-pan, 1:50/1:100/1:200 selector, metre grid, scale bar, layer visibility and drawing revision. No explanatory overlays or fabricated plan.
- Separate five-room list and a six-tab side information panel. Editable clear room dimensions; save commits a revision and updates net area, volume, normalised proportions and axial estimates wherever displayed.
- The exact five-room programme: one Main Live Room, three isolation rooms and one Control Room. Initial total **179.54 m²**, approximately **179.5 m²**. Finished clear-height, preliminary-only, area-exclusion, capacity and building-area-TBD qualifications retained.
- Golden / published Sepmeyer A, B, C comparison tools, source records, a clearly qualitative Bolt illustration with **no pass/fail test**, and explicit Golden/non-parallel-wall limitations.
- First four axial modes per axis using `f = n × 343 / (2D)`. Clearly an ideal rectangular-reference approximation, not a simulation of an irregular finished room.
- Typed model for projects, facilities, rooms, metric geometry, walls/thickness, polygons/angles, openings/acoustic doors, sound locks, sightlines, circulation, dimensions, layers, references, targets, calculations, verification results, decisions and revisions.
- Shoelace polygon area, point-angle and wall-angle utilities with unit tests.
- Proposed/Calculated/Simulated/Measured/Verified type system and expandable evidence records: source, method, assumptions, date/revision, discipline and outstanding validation. No simulated, measured or verified initial results.
- Scope-only reference library: ISO 3382-1/-2, ISO 16283-1/-3, ISO 717-1, NC/RC; no invented clauses or certification. NC-15 remains **Proposed aspiration only**.
- Pending-validation register with review state and notes; decision recording; revision history; localStorage schema v1; JSON import/export with validation and confirmation; downloadable preliminary Markdown report; SVG export of the current empty canvas.
- Honest future-integration dialogs and Phase Two empty states.

## Official logo

The supplied original `src/assets/logo/rateena-official.jpg` is used in the shared header, home identity panel and favicon. Its design and source pixels are unchanged; CSS only crops outer black margins and blends its background into the UI.

## Offline single-file edition

```sh
npm run build:offline
```

This produces `dist-offline/index.html`: a self-contained application with inlined JavaScript, CSS, logo and bundled fonts. Open it directly in a modern browser using `file://`; no server or internet connection is required to use the app. Engineering source links naturally require internet if opened. HashRouter keeps navigation within the file.

The delivered standalone copy is `/workspace/artifacts/RATEENA-SOUND-2.html`. Browser policies for local-file storage vary; JSON export/import remains the portable backup mechanism. To enable reliable shared persistence, use the hosted app or a local web server.

## Future integration / not claimed implemented

- Approved final 2D floor plan, real drawing authoring and geometry import.
- CAD/DXF integration, PDF export, independent 3D view derived from approved geometry.
- Acoustic simulation, ray tracing, measured results and commissioning approval.
- Full non-rectangular acoustic modelling. Polygon utility support alone is not a room solver.
- Backend, accounts, synchronisation, collaboration and formal approval permissions.
- Operational project management data and workflows.
- Phase Two engineering programme and study content.
- Arabic UI, deferred in the latest owner clarification. Logical CSS and a label boundary preserve a path to future RTL support.

The SVG export is the current **empty drafting view**, not a technical floor-plan deliverable. Screen zoom and display calibration affect apparent scale; the export uses millimetre SVG units and the selected nominal scale at 100% zoom. Do not measure a browser screen with a ruler.

## Data and evidence limits

Room dimensions are proposed reference envelopes, not approved construction dimensions. Derived values are calculated, not measured. The exact formula and input assumptions accompany results. Changes are committed with the Save button, not every uncommitted keystroke. The layer toggle changes local project revision history, not the approved drawing revision.

Import is for this v1 application's empty-plan state; it deliberately refuses imported drawn geometry, unrecognised schema versions and altered room counts. Keep exported JSON backups. Local storage is device/browser specific, not a remote database.

Timestamps are shown in **Africa/Cairo**; persisted instants use ISO timestamps.

## Reference cross-check

Sepmeyer sets were cross-checked against the published table at <https://acoustic.ua/forms/rr.en.html> and <https://www.bandcoach.org/calculators/roomVolCalc.html> on 11 November 2026:

- A — 1 : 1.14 : 1.39
- B — 1 : 1.28 : 1.54
- C — 1 : 1.60 : 2.33

Primary research identifiers: Sepmeyer (1965), <https://doi.org/10.1121/1.1909344>; Bolt (1946), <https://doi.org/10.1121/1.1916349>. Secondary-table confirmation is not a certification of the proposed facility. The Bolt shading is hand-sketched and explicitly illustrative.

## QA

`npm run build` type-checks and compiles production assets. `npm test` runs Vitest geometry, schema and component interaction tests. DOM component tests are not a visual-browser inspection. The screenshot/browser hand-off, including the six required routes, is in `docs/SCREENSHOT-BRIEF.md`. A headless rasterisation retry is documented in `docs/QA-RESULTS.md`; DOM checks alone are not visual verification.

## Static deployment preparation

Vite base is `/rateena-sound-2/`. A GitHub Pages Actions workflow is prepared at `.github/workflows/pages.yml`; it runs tests and builds before deployment. A future repository's Pages source must be GitHub Actions.

The owner approved public publication of this application. Target repository: <https://github.com/deepershi8-art/rateena-sound-2>. Target Pages URL: <https://deepershi8-art.github.io/rateena-sound-2/>. See the QA record for deployment verification. The earlier Cairo application repository remains untouched.

For Vercel or root-domain deployment, set `base: '/'` in `vite.config.ts`; the output directory remains `dist`.
