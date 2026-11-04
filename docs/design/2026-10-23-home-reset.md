# Homepage composition reset

User constraints: restrained experimentation, future-facing without a decorative 3D object, little explanatory copy, clear personal authorship. Prior pale card gallery rejected.

Final composition: a flat SVG scanline treatment of the Sumtez wordmark, charcoal type on a cool off-white page, a staggered two-column index made from the six real project names. Mobile uses one column. No generated concept covers, nested website screenshot, or introductory prose. Hover motion is limited to slight type and scan-band displacement and disabled under reduced motion.

Implementation: homepage-only home.css replaces three theme override stylesheets on index.html. The product renderer emits six readable static articles and real project/source links. Tools and notebooks use compact indexes. Native details contains the homepage search/filter controls; search, favorites, and detail dialogs retain their original behavior. Product detail pages remain intact.

Validation: existing static checker; source syntax; rendered 320, 390, 768, and 1280px layouts; browser search/details/favorites smoke checks. Independent visual review rejected the intermediate screenshot-led layout and plain directory; the final scanline typography version has no visible blocking defects. Aesthetic approval remains the user's judgment.

## Motion refinement requested by user

A flat scan band traverses the signature and follows the pointer locally; no 3D scene or dependencies. Pointer hover adds a short typographic scan and small displacement to project links. Project entries arrive once as they enter the viewport. The scan loop caps at 30 fps and stops when offscreen or the document is hidden. A header control pauses motion, and the system reduced-motion preference disables it by default.

Review repairs: focus targets inside collapsed tool filters now open their disclosure before focus; accessible project names include the visible English label.
