> Superseded by the open-field redesign after explicit user rejection. Retained as historical exploration, not the current specification.

# Experimental Entry Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the catalogue homepage with a distinct interactive visual entrance while keeping all existing content discoverable.

**Architecture:** A buildless landing page with isolated landing.css/landing.js. The former homepage content becomes work.html. Shared generation and static checking follow the new content location.

**Tech Stack:** HTML, CSS, native 2D Canvas, JavaScript.

**Spec:** docs/superpowers/specs/2026-10-24-experimental-entry-design.md

## Global Constraints
- No 3D object, large explanatory copy, fabricated project imagery, or added dependency.
- Real project content and tool behavior remain accessible.
- Pause and reduced-motion behavior; ordinary keyboard-accessible links.

## Review Focus
- 320px width and short landscape viewports retain reachable controls.
- Canvas or JavaScript failure leaves a readable name and navigation.
- Background tabs and paused/reduced modes do not run animation loops.
- Old project and guide return links reach the migrated index.
- Changing polarity preserves readable controls and focus indicators.

### Task 1: Content migration (delegated)
- [ ] Create dist/work.html from the existing index, excluding signature/motion.
- [ ] Change build-product-pages.mjs generation target and per-page CSS injection.
- [ ] Change check-site.mjs collection checks to work.html and check homepage entrances.
- [ ] Migrate old HTML and generated links; root also updates dynamic hub.js links.
- [ ] Validate static document, content count and local link integrity.

### Task 2: Interactive entry (root)
- [ ] Replace dist/index.html, create dist/landing.css and dist/landing.js.
- [ ] Build cropped type artwork, one optical cut, pointer/press response and inverse treatment.
- [ ] Add static fallback, pause, reduced-motion and visibility lifecycle.
- [ ] Inspect live desktop/mobile rendering and controls; review actual screenshots independently.

### Task 3: Verify and release
- [ ] Test migrated navigation, catalogue search/dialog and reduced/paused animation lifecycle.
- [ ] Refresh social card and local GitHub mirror, run build/static/syntax checks.
- [ ] Package exact source through Sites helper, save/deploy and refresh the existing preview.
