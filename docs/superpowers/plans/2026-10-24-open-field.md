# Open field implementation plan

**Goal:** Replace the rejected homepage completely with a responsive, usable, live 2D composition.
**Architecture:** Static HTML carries identity and all navigation. CSS defines layout and static fallback. A separate Canvas controller enhances the visual field without controlling navigation.
**Tech stack:** HTML, CSS, Canvas 2D, native JavaScript; existing static build scripts.
**Spec:** docs/superpowers/specs/2026-10-24-open-field-design.md

## Tasks
- [x] Replace index.html body and rewrite landing.css/landing.js; remove all accordion and image bindings.
- [x] Tune the canvas reading area and mobile arrangement after browser screenshots.
- [x] Add independent lifecycle checks: pause, reduced motion, visibility, resize and missing Canvas.
- [x] Align shared interior palette and verify real work/notes/tools paths.
- [x] Run build/static checks and desktop/mobile browser QA; retain a current local preview and evidence.

## Review focus
- Long/narrow viewports must keep the statement and all links readable.
- Pause and reduced-motion preference must never be overridden by visibility/resize events.
- Canvas failure must not hide navigation or expose a dead pause control.
- Hover/touch must not hijack link activation or page scrolling.
- Generated inner pages must retain the independent work route and real catalogue content.
