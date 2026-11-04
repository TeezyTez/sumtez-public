# Open-field verification

A complete homepage replacement; no accordion, generated backdrop or framed illustration remains in the homepage.

- Browser inspected the actual page at desktop 1280 × 800 and mobile 390 × 844 / 320 × 640. No horizontal overflow in these fixtures.
- Canvas animation pause toggled through the actual UI; accessibility state changed to playback.
- A script-free copy remains readable and links remain present at 844 × 390 (short view scrolls vertically).
- Clicked homepage → work index → full tools page; searched Cursor (1 of 32 results) and opened its detail dialog.
- Independent motion controller tests cover 12 cases including pause/reduce/visibility/bfcache/resize/DPR/Canvas failures. Initially caught DPR-only resize and runtime context-loss handling; both fixed and rerun successfully.
- Static build/link checks cover 13 HTML pages, 6 projects, 32 tools and 16 featured tools.

These checks establish rendering and behavior, not subjective user approval. Live reference sites could not be reliably loaded; no claim of visual reference-site inspection.
