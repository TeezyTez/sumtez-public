# Homepage stacked projects

The user selected the first interactive exhibition study: layered cards. The homepage now presents the existing six projects in large sequential cards, retaining the monochrome palette, scanline signature, shared typography, and project routes.

## Implementation

- `scripts/render-products.mjs` emits all six semantic articles and links statically. Cover symbols are typographic compositions, not claimed product screenshots.
- `project-stack.css` provides a normal-flow list by default and progressive sticky positioning. It uses shared 18px body, 16px controls, and 15px metadata tokens.
- `project-stack.js` follows native document scroll. It scales outgoing card surfaces slightly, updates the counter and previous/next controls, and never intercepts wheel or touch events.
- Keyboard focus reveals the focused card, including during partial overlap. Tab from the navigation enters the current card. Pointer focus does not move the link before activation.
- Pausing the existing motion toggle, reduced-motion preference, or insufficient viewport height restores normal document flow. There is no content clipping or fixed card height.
- New classes isolate the stack from the earlier project arrival effects and shared typography overrides. Build-time asset hashing includes the new files.

## Verification

- Production generator and static checker passed: 13 HTML pages, 196 local references, six no-JavaScript project articles, 32 tools and 16 featured tools.
- JavaScript syntax check passed. Independent review identified a partially covered keyboard focus case; fixed before publication.
- Browser QA: desktop 1280×920, phone 390×844 and narrow 320×820. No horizontal overflow; all card scroll heights equal their content heights.
- Verified native stacked positioning, next-card control, keyboard entry into current card, MPCI detail navigation and browser return, last-card boundary and continued scrolling into tools.
- Verified the motion pause toggle restores all six cards to relative positioning. Reduced-motion and no-JavaScript fallbacks inspected in source; no separate OS preference emulation was performed.

No new runtime dependency. Project data, source destinations, detail-page styling, tools and guide behavior remain in their existing locations.
