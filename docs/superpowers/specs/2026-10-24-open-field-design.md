# Open field — replacement homepage

The user explicitly rejected the existing design and requested a complete restart. The previous accordion, colored panels, oversized distorted wordmark, generated backdrop and framed illustration are discarded. The homepage should feel experimental and alive, without a strange 3D object or explanatory paragraphs. Full content remains in the separate work and tools routes.

## Approaches and decision

A fresh independent study used a framed optical print; screenshot review rejected it because its structure still read as header + illustration + three entries. The chosen implementation is an open, two-dimensional flowing line composition with a protected reading area. It uses luminous white, clear electric blue and a small coral accent. Normal sans typography and italic serif create contrast without stretching letters. This is the implementer's design decision, not a claim of user approval of a mockup.

The complete viewport is the composition. Small identity/navigation sit at the edges, a short curiosity statement occupies the open center-left, and one ordinary link leads into the work index. Every destination is real and accessible without the artwork. No generated image, cards, fake status, invented metrics or project dump appears on the homepage.

## Motion and implementation

Canvas 2D draws continuous line trajectories. Slow phase changes and damped pointer response provide motion; navigation stays fixed. Motion can be paused, obeys reduced-motion preferences, stops while hidden, and uses one capped animation loop. Canvas failure retains the static CSS/HTML composition and ordinary links. Mobile gets a separately composed protected text area, not a scaled desktop poster.

Use existing buildless HTML/CSS/JS and self-hosted Instrument Sans; system Georgia supplies italic contrast. No runtime dependency or new remote asset. Update the shared interior colors while retaining real project, notes and tool functionality. QA must inspect desktop, mobile, narrow and short viewport states, keyboard navigation, no-canvas behavior and animation lifecycle.

Research: searched current portfolios and read https://rauno.me/ and public design references. External browser previews timed out; no claim of live visual inspection of reference sites. Local prototypes are visually inspected before integration.
