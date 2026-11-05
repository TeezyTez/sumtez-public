# Typography and compact project gallery — 2026-11-05

## Intent

Replace generic typography with a coherent Chinese/English pairing, preserve readable text sizes and the existing scanline wordmark, and make works browseable without forcing visitors through six screenfuls of content.

## References and decisions

- Fontsource: https://github.com/fontsource/fontsource — self-host variable WOFF2 files and preserve unicode-range CSS for Chinese subsets. Used IBM Plex Sans Variable 5.3.0 (Latin/Latin-ext) and Noto Sans SC Variable 5.3.1. Fonts use swap and retain their SIL OFL licenses. Total stored assets: 103 WOFF2 files, 4,577,220 bytes; Chinese ranges load only as needed. Only the 45,712-byte Latin face is preloaded.
- IBM Plex: https://github.com/IBM/plex — English typography with a distinct but restrained character.
- Fontaine: https://github.com/unjs/fontaine and Modern Font Stacks: https://github.com/system-fonts/modern-font-stacks — reviewed fallback strategies. No runtime dependency added from either project.
- Frontend design skill: https://github.com/anthropics/skills/blob/main/skills/frontend-design/SKILL.md — used as a design reference for intentional type choices and avoiding decorative template conventions; not installed as a local skill.

Shared pages use IBM Plex Sans with Noto Sans SC and platform Chinese fallbacks. Body/UI/meta remain 18/16/15px. Display text is less oversized, Chinese spacing returns to normal, metadata uses proportional lettering, and monospace is retained for actual code. Removed redundant project card numbers and decorative art labels.

## Gallery behavior

Centered viewport capped at 1000px and 82% of desktop content width. Side gutters belong to the document. Native inner scroll chaining allows users to leave at either end; no wheel preventDefault handler. A direct link continues to the tools section.

Autoplay moves only the gallery at 25 CSS pixels per second, rests three seconds per card, and stops after the final card. It pauses on mouse hover, keyboard focus, user pause, hidden document, reduced motion, or the site's global motion setting. It resumes after mouse exit with a short delay. Coarse-pointer/touch layouts preserve vertical page scrolling, disable autoplay, and use previous/next controls. Large-text or short layouts fall back to natural document flow.

## Validation

- Product page generation, JavaScript syntax, static local asset checks, and all 103 WOFF2 signatures/licenses passed.
- Browser at 1280×920: gallery autoplay changed internal scroll position while document scroll remained unchanged; mouse hover froze internal position; side-gutter scrolling went directly to tools; final-card scrolling continued the document; manual pause persisted after leaving the gallery.
- Keyboard Tab brought the focused card into view and paused autoplay.
- Browser widths 390 and 320: complete cards and actions, no horizontal document overflow. Touch-specific behavior was source-reviewed, not tested on physical touch hardware.
- Browser console had no errors or warnings during these checks.
- Independent read-only review found no remaining publication blockers after fixing rest position recalculation and natural-flow card counter updates.

Local screenshot: work/gallery-refine/gallery-desktop.png (desktop viewport, paused on Cloud Agent).
