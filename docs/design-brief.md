# Design brief

Status: **direction selected under explicit user delegation**, using Impeccable. Planning only: no mockup, UI, font files, or implemented design system exists. Rendered typography, contrast, and responsive behavior still need verification.

## Selected direction — The living type specimen

A typesetter's light table: a broad, cool-white text surface, generous dark sans-serif text, and one solid violet circle. The text is the exhibit. Moving the obstacle changes a precise typographic composition in real time.

This is a single interactive work with a small set of tools, not a dashboard, a marketing page, or a simulated desktop. Its distinctiveness comes from the live negative space opening inside a field of words.

### Why this fits

- Non-technical visitors see an object they can move and a response they can understand.
- Technical visitors can reveal the line geometry without changing contexts.
- Continuous text makes Pretext's actual contribution visible, rather than competing with illustration or elaborate interface chrome.
- A flat, restrained surface remains readable on phones and under varied lighting.

## Confirmed constraints

Artful personality; restrained color; curated typography; one circular obstacle; optional technical detail; desktop and phone support; mouse, keyboard, and touch. The user delegated specific design choices rather than selecting an earlier red or cobalt proposal.

## Surface and first viewport

Visitor mode: **Experience**.

On desktop, a compact header names the work and credits Pretext. A large text composition begins directly below it. The circle starts slightly right of center in the upper text, producing visibly different left and right passages. Do not give a giant headline more space than the actual interaction.

A narrow tool rail alongside the composition contains the size control, Edit text, Show the layout, Reset all, and accessible directional controls. Controls remain visibly secondary but recognizable and labeled. Give the essay a bounded reading width; widen the surrounding breathing room on large screens instead of stretching lines indefinitely.

On phones, move the tool rail into a compact, wrapping group above the text. The first text and obstacle remain close to the instruction, not below a large introduction. Start the circle small enough to leave a useful passage. Let longer text extend through normal document scrolling.

The first-view instruction is: “Move the circle. See what the words do.” The product name is still open; a layout decision does not approve “Between the Lines.”

## Palette — selected starting values

Strategy: restrained neutrals with one assertive accent. The likely scene is someone opening a shared link on a laptop or phone in ordinary daylight; a light surface supports that use.

| Role | Value | Use |
| --- | --- | --- |
| Surface | `#F4F5F7` | Flat, cool near-white page |
| Ink | `#202128` | Essay, labels, primary copy |
| Secondary ink | `#565B66` | Hints and supporting explanation |
| Accent | `#5639D9` | Solid obstacle and active control emphasis |
| Subtle rule | `#D9DCE3` | Decorative divisions, never the sole control boundary |

No grain, glass, ornamental gradients, shadows that imply floating cards, or fake print wear. The circle's solid fill should remain visually distinct from its focus outline. Essential control boundaries and focus colors must meet contrast requirements when rendered.

## Typography — selected direction

- **Essay and heading:** Source Sans 3, regular text and semibold headings. Its humanist forms give long passages warmth without relying on an editorial display serif.
- **Controls:** the same family at a smaller, clearly readable size; use weight and spacing rather than a second decorative face.
- **Technical labels:** a system monospace only where actual dimensions or notation later justify it. Metrics are not required scope.
- Starting essay sizes for later validation: 24px desktop, 20px phone, approximately 1.45 line height. Resolve the actual font size to whole CSS pixels for Pretext.
- Use a named static font face with default shaping settings for flowing text. Do not rely on unsupported optical-sizing or variable-font axes.

Font licensing, available static files, coverage, and delivery must be verified before acquiring assets. Self-hosting the chosen files is preferred. This is a font selection, not a claim that assets have been installed or measurement accuracy tested.

## Controls and interaction expression

Use restrained rectangular controls, modest corner rounding, and plain labels. A size slider should look like a slider, not an abstract art control. Reserve violet for the obstacle and meaningful active states; do not scatter it across every label.

The circle has a clear drag affordance on hover and focus. Instructions must also work without hover. Directional buttons provide a simple click/tap movement alternative. Dragging follows the pointer directly, with no delayed spring or trailing text animation.

The inline editor opens near the controls using the same surface grammar. It must feel like changing the material of the exhibit, not entering another application.

## Layout view

Outline the available line-fragment boxes with thin, visible rules; show the actual regions used by the layout. Use an alternate stroke treatment where needed to distinguish available space from text bounds without inventing a legend of arbitrary colors.

Place the short explanation beside the composition on wider screens and below it on phones. Opening it must not unnecessarily change the composition width or obstacle position. Boundaries do not intercept input or obscure text. Technical detail is revealed intentionally, not permanently overprinted on the essay.

## Accessibility and motion

- Visible focus, distinct from selection and obstacle fill.
- Clear labels and useful touch targets, aiming for at least 44 × 44 CSS pixels.
- WCAG AA contrast targets: 4.5:1 for normal text and 3:1 for large text and essential control boundaries.
- Logical reading order independent of fragments, and equivalent keyboard/click/tap movement.
- No automatic motion, letter-by-letter entrances, or scroll hijacking.
- Reduced-motion mode retains functional reflow and removes decorative transitions if any are introduced.
- Narrow screens and browser zoom change layout, not access to controls.

## Direction contract

**THESIS:** Let a visitor feel text layout by opening a movable space inside a continuous passage. The interaction owns the first viewport.

**OWN-WORLD:** Cool-white surface, charcoal humanist sans-serif, one violet disc, flat tool controls, and deliberate whitespace. No fake physical chrome.

**STORY:** Notice the gap, move it, see the words respond, try your own words, optionally reveal the geometry.

**FIRST VIEWPORT:** Compact header; large text surface immediately below; obstacle within upper visible text; narrow adjacent controls on desktop and compact controls above on phones.

**FORM:** Typesetter's light table / living specimen, candidate 7, Impeccable seed `99ab3809`. Selected under delegated design authority; not a user-reviewed rendered mockup.

**FINISH:** unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

That finish condition applies only to a future authorized build. It does not authorize implementation now.

## Design exploration record

The seven grounded directions considered were: (1) a contemporary gallery wall label, (2) a concrete-poetry sheet, (3) a modern reading-room publication, (4) a kinetic museum exhibit, (5) a typographic poster, (6) a transparent drafting sheet, and (7) a typesetter's light table. They span exhibition, publishing, and working-tool traditions. The seed assigned candidate 7. It carries both the quiet reading experience and the optional layout tools without requiring an extra visual metaphor.

The generated challengers were assessed as descriptions, not as reviewed visual mockups. Judgments use audience fit and clarity of this product's interaction:

| Challenger applied to this app | Judgment | Discipline retained in the selected direction |
| --- | --- | --- |
| Printed-goods kiosk: tools and text as gridded printed cells | Declined: item browsing fragments one continuous exhibit and weakens immediate interaction clarity | A rigorously limited palette and consistent control states |
| Theater poster: oversized words and diagonal actions | Declined: spectacle competes with readable flowing text and quiet artfulness | Give the actual text field substantial first-viewport scale |
| ANSI bulletin board: a text-cell interface with keyboard menus | Declined: technical nostalgia narrows the audience and conceals proportional layout | Complete keyboard access without technical-looking controls |
| Teletext: fixed-grid text and a reveal action | Declined: fixed cells work against variable-width text and phone reflow | A clear, deliberate reveal for optional explanation |
| Hand-processed film: text presented as frames on a strip | Declined: frame navigation and surface damage distract from moving one obstacle | Keep the responsive visual effect tied to the visitor's action |
| Moon-shadow bazaar: passages as stalls and the obstacle as a shadow | Declined: trading and browsing semantics introduce an unrelated task | Make the negative space the memorable visual object |

These disciplines raise scale, consistency, access, and state clarity; they do not import the challengers' colors, textures, or fictional features. No raster references or UI artifacts were generated during this planning pass.

## Remaining validation

Product name and final copy remain open. The selected visual system needs a future rendered check for font metrics, contrast, desktop/phone composition, and obstacle sizing. Update values when evidence warrants it, while retaining the agreed artful direction and central interaction.
