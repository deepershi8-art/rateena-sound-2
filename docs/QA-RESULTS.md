# QA results

11 November 2026 — Africa/Cairo.

## Builds and tests

- Production build: PASS (`npm run build`, TypeScript + Vite).
- Offline single-file build: PASS (`npm run build:offline`).
- Vitest: PASS — 13 tests across metric geometry, schema integrity, navigation, room editing, static chapter and revision interactions.
- DOM tests use reduced motion. They are not a visual-browser inspection.
- Dependency audit: zero vulnerabilities reported by `npm audit --audit-level=moderate`.

## Official logo

The original supplied JPG is used for the shared header, home identity panel and favicon. Source pixels and design are unchanged; CSS crops only outer black margins and blends the background into the navy interface.

Byte-for-byte checks confirm the normal build's JPG and the decoded offline image data URI match the supplied original (51,342 bytes). This confirms asset integration and integrity, not a visual browser inspection.

## Offline delivery

`/workspace/artifacts/RATEENA-SOUND-2.html` is self-contained: all JavaScript, CSS, the logo and bundled fonts are inline. An HTML asset check found no external script or stylesheet references. HashRouter supports direct local-file navigation. External engineering source links require internet if opened.

The source ZIP excludes node_modules, .git, dist, dist-offline and build caches.

## Public deployment

The owner approved public publication after initially requesting a private file. Only the new repository was created:

- Repository: https://github.com/deepershi8-art/rateena-sound-2
- Live app: https://deepershi8-art.github.io/rateena-sound-2/
- Initial successful workflow: https://github.com/deepershi8-art/rateena-sound-2/actions/runs/42975693505
- Live HTML: HTTP 200.
- Compiled JavaScript: HTTP 200; 457,835 bytes, asset `assets/index-BupqpVhw.js`.
- The earlier Cairo application repository was not touched.

A stale Git credential-helper path was corrected through the standard `gh auth setup-git` command before pushing. No credentials were extracted.

## Screenshot limitation

Headless Chrome capture stalled even for about:blank. The requested final single retry against `file:///workspace/artifacts/RATEENA-SOUND-2.html` used `--headless=new --no-sandbox --disable-gpu` and an OS-enforced 60-second timeout. It timed out (exit 124) without producing an image. The retry was not repeated. `docs/screens/` is empty; no screenshots or visual fixes are claimed.

Official headless documentation checked: https://developer.chrome.com/docs/chromium/headless . See SCREENSHOT-BRIEF.md for the five core review routes plus geometry/mobile checks to perform in a functioning browser.
