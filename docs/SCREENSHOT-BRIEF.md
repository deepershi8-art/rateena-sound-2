# Browser QA hand-off
This executor has no browser subagent tool. Its desktop skill prohibits Shell-driven Playwright/browser automation, so no browser screenshots or runtime rendering are claimed.

Use an authorised browser executor on the local app at http://localhost:5173/rateena-sound-2/ (start: npm run dev) and save to docs/screens:
- home.png — /#/ at 1440×900
- knowledge-01.png — /#/flagship/knowledge/sound at 1440×900
- knowledge-02-1.png — /#/flagship/knowledge/static-comparison at 1440×900
- architectural-proposal.png — /#/flagship/study/architectural at 1440×900, Main Live Room selected
- geometry-calculator.png — /#/flagship/study/geometry at 1440×900
- mobile.png — /#/ at 390×844

Check: exactly two primary home sections/two facility cards; no intro route; two main tabs; Ch02.1 static illustration with no controls inside the lesson; room edit recalculates total, volume, ratios and modes; reload persists; JSON import/export; layer toggles, scale, zoom and drag pan; SVG export; decision record and verification review notes; Arabic RTL; mobile no body overflow. No final plan or verified measurement should exist.
