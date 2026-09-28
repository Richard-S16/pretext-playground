---
name: Pretext playground
description: An interactive text specimen where a movable circle reshapes a flowing essay.
colors:
  violet-accent: "#5639d9"
  table-surface: "#f4f5f7"
  paper: "#ffffff"
  table-ink: "#202128"
  ink-secondary: "#565b66"
  hairline: "#d9dce3"
  control-border: "#868b9b"
  control-border-hover: "#666b78"
  clay-error: "#b3261e"
  ink-primary-deep: "#33353f"
typography:
  body:
    fontFamily: "Source Sans 3, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "24px"
    fontWeight: 400
    lineHeight: "35px"
    letterSpacing: "0"
  body-compact:
    fontFamily: "Source Sans 3, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "20px"
    fontWeight: 400
    lineHeight: "29px"
    letterSpacing: "0"
  instruction:
    fontFamily: "Source Sans 3, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "30px"
    fontWeight: 600
    lineHeight: 1.2
  instruction-compact:
    fontFamily: "Source Sans 3, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "24px"
    fontWeight: 600
    lineHeight: 1.2
  empty-state:
    fontFamily: "Source Sans 3, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "18px"
    fontWeight: 400
  explanation:
    fontFamily: "Source Sans 3, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.5
  control:
    fontFamily: "Source Sans 3, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "15px"
    fontWeight: 500
  label:
    fontFamily: "Source Sans 3, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "13px"
    fontWeight: 600
  hint:
    fontFamily: "Source Sans 3, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1.45
  counter:
    fontFamily: "Source Sans 3, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "12px"
    fontWeight: 400
rounded:
  control: "8px"
  disc: "50%"
spacing:
  xs: "6px"
  sm: "10px"
  md: "16px"
  lg: "24px"
  xl: "36px"
components:
  button:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.table-ink}"
    rounded: "{rounded.control}"
    padding: "8px 14px"
    typography: "{typography.control}"
  button-primary:
    backgroundColor: "{colors.table-ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.control}"
    padding: "8px 14px"
  button-pressed:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.violet-accent}"
    rounded: "{rounded.control}"
  obstacle-disc:
    backgroundColor: "{colors.violet-accent}"
    rounded: "{rounded.disc}"
    width: "2 × radius (48–140px radius)"
    height: "2 × radius (48–140px radius)"
---

# Design System: Pretext playground

## Overview

**Creative North Star: "The Living Specimen"**

The page is a working typesetter's table, cleared of everything but one broad sheet of text and a single instrument for moving it. Cool near-white ground, charcoal humanist sans-serif at reading scale, one solid violet disc. The text is the exhibit; the tool rail is visibly secondary and never dresses up.

The world is flat and optical rather than material: no paper textures, no shadows, no glass, no decorative gradients. Depth is conveyed by tone and hairline rules only. Motion is confined to direct manipulation: the reflow of text under the disc is the feedback, and no animation is allowed to delay or dramatize it. Every explanatory device (dashed outlines, the dashed exclusion ring, the layout panel) appears only when the visitor asks for it.

**Key Characteristics:**
- One continuous essay rendered as positioned line fragments; the layout itself is the work.
- A single saturated accent (Specimen Violet) reserved for the disc, active states, and focus.
- Flat surfaces; hairlines for divisions; dashed strokes only for explanatory geometry.
- Motion under 300 ms, transform/opacity only, and never applied to the reflow itself.
- Responsive by recomposition (type scale and rail arrangement change), never by shrinking.

## Colors

Restrained strategy: cool neutrals over a single assertive violet. Hex values in the frontmatter are the source of truth.

### Primary
- **Specimen Violet** (#5639d9): the obstacle disc, the pressed state of toggles, focus rings, links, and the dashed exclusion ring. Nowhere else; its rarity is what marks the movable object.

### Neutral
- **Table Surface** (#f4f5f7): the page ground; the field sits directly on it with no card.
- **Paper** (#ffffff): button and textarea fills only.
- **Table Ink** (#202128): essay text, control text, the primary button fill, and the focus outline on the disc.
- **Secondary Ink** (#565b66): labels, hints, the credit line, explanation prose.
- **Hairline** (#d9dce3): 1px decorative dividers only — never the boundary of a control.
- **Control Border** (#868b9b): the 1px boundary of buttons and the textarea, held at 3.1:1 against the surface; hover deepens to Control Border Hover (#666b78).
- **Clay Error** (#b3261e): the character-limit error only.

### Named Rules
**The One Violet Rule.** Specimen Violet appears only on the obstacle, active/selected states, focus indicators, links, and explanatory geometry. It is never used as a background wash or decoration.

**The Two-Border Rule.** Hairlines are decoration; controls carry the darker control border. A control must never be identified by a decorative hairline.

## Typography

**Display Font:** Source Sans 3 (self-hosted via Fontsource, latin subset)
**Body Font:** Source Sans 3, weight 400. In Mandarin mode the field re-points to a system CJK stack (`"Noto Sans SC", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Source Han Sans SC", system-ui, sans-serif`); Pretext measures with the field's own computed stack, so ink and measurement stay in the same family on every platform.
**No mono/technical face.** Metrics readouts are not part of the product; labels use the body family at reduced size.

**Character:** A workhorse humanist sans carried at reading scale. The essay is set generously (20–24px) so that its changing column widths stay comfortable; hierarchy is created with weight and position, not with a second decorative face.

### Hierarchy
- **Instruction** (600, 30px/1.2; 24px under 640px): "Move the circle. See what the words do." — the single loud line on the page.
- **Body** (400, 24px/35px; 20px/29px body-compact under 900px): the essay. Line length is bounded by the field, not by a ch cap.
- **Empty state** (400, 18px): the one prompt shown when the text is empty.
- **Heading** (600, 15px, secondary ink): the product name in the header.
- **Explanation** (400, 14px/1.5): the layout-view prose and its heading at the same size in 600.
- **Control** (500, 15px): button labels and the textarea.
- **Label** (600, 13px, secondary ink): slider label, "Move the circle", counter.
- **Hint** (400, 13px/1.45, secondary ink): the one-line help under controls.
- **Counter** (400, 12px, secondary ink): the character count under the textarea; turns Clay Error over the limit.

### Named Rules
**The Measured-Type Rule.** Flowing text uses whole-pixel font sizes and explicit px line-heights that are identical for CSS and canvas measurement, and the canvas measures with the field's computed `font-family` stack — including the Mandarin mode's CJK stack. No `font-variation-settings`, no optical sizing, no fractional sizes on the essay. If the type scale or the font stack changes, the measurement changes with it.

## Layout

A single page, max-width 1400px, with 40px vertical and 32px horizontal padding (96px bottom). The workspace is a CSS grid: the field occupies the fluid column and the tool rail a fixed 248px column with a 48px gap; the rail is sticky at 32px on desktop. Under 900px the grid collapses to one column, the rail moves above the field and re-flows into compact wrap rows, and the type drops one step (see Typography).

The essay field is the only content-driven dimension: the canvas grows to the measured height of the text, and the disc roams the full height of the current layout. Its bounds are recomputed when the text, language, or type metrics change and frozen for the duration of a drag, so the reflowed height can never feed back into the bounds it is clamped against. A scroll during an active drag refreshes the cached field rect so the disc stays under the pointer. Controls group as: size slider, language, edit, move pad, layout toggle, reset — in that order in the rail, with the pad re-ordered last on narrow screens.

## Elevation & Depth

Explicitly flat. There are no shadows anywhere in the system. Depth and grouping are carried by tone (surface vs paper fills), 1px hairlines, and spacing. The one special "layer" is explanatory geometry: the dashed line-fragment outlines and the dashed exclusion ring, which are drawn as strokes over the existing surface and never occlude text.

## Shapes

Controls and fields use a modest 8px corner radius. The obstacle is a perfect disc (50% radius) — the only purely circular form in the interface, which is what makes it read as the movable object. Borders are 1px hairlines; explanatory strokes are 1px dashed. The move pad uses square-ish 36px buttons in a 3×3 (desktop) or single-row (mobile) arrangement.

## Components

### Buttons
- **Shape:** 8px radius, 1px control border (#868b9b), paper fill, padding 8px 14px.
- **Default:** ink text on paper; hover (`hover: hover` only) deepens the border to #666b78; the primary variant is ink-filled with paper text and hovers to #33353f.
- **Active:** `scale(0.97)` press feedback, 140ms.
- **Toggle (layout view):** carries `aria-pressed`; pressed state turns border and text Specimen Violet.
- **Disabled:** 45% opacity, default cursor.
- **Focus:** 2px Specimen Violet outline, 2px offset.
- **Touch:** under `pointer: coarse`, every button grows to a 44px minimum target.
- **Language toggle:** the default button, labeled with the target language (`中文` / `English`); its `lang` attribute follows the label so assistive tech pronounces it in the right language.

### Inputs / Fields
- **Range (size):** native input with `accent-color: #5639d9`; label is the 13px Label style; 44px minimum target height under `pointer: coarse`.
- **Textarea:** paper fill, control border, 8px radius, 15px/1.5 text, min-height 160px, violet caret; focus-visible gets the violet outline. The counter is a right-aligned 12px secondary line and turns Clay Error when over the 5,000-character limit; the error line uses Clay Error at 13px.

### Move pad
- **Style:** the same button component at 36×36, arrow glyphs, labeled `Move up/left/right/down` for assistive tech; a labelled group. The pad is a click/tap alternative to dragging and never the primary interaction.

### Signature: The Disc
- **Shape:** a 50%-radius button, 48–140px radius (responsive cap), solid Specimen Violet on a nested `.disc` span so placement and scale can transform independently.
- **Behavior:** pointer-captured drag with grab offset; arrow keys move 8px (24px with Shift); focus-visible draws a 2px Table Ink outline at 6px offset, inside the 12px text gap.
- **Motion:** disc scales 1.03 on hover (`hover: hover` only) and 1.05 while dragging, 150ms; placement itself never transitions — the disc must track the pointer with zero lag.

### Signature: Fragments and the exclusion ring
- **Fragments:** absolutely positioned `<span>`s with `white-space: pre`, each as wide as its available interval. At rest they are bare text; in layout view each gets a 1px dashed ink outline (30% alpha) marking the region Pretext was given.
- **Ring:** a dashed 1px Specimen Violet circle drawn at the exclusion radius (disc radius + 12px gap), opacity-animated in layout view only. It explains the text gap and never intercepts input.

## Do's and Don'ts

### Do:
- **Do** keep Specimen Violet to the disc, active states, focus, links, and explanatory strokes.
- **Do** keep control boundaries at ≥3:1 against the surface (Control Border, #868b9b); use the hairline for decoration only (Two-Border Rule).
- **Do** keep CSS type metrics and Pretext measurement in lockstep (Measured-Type Rule); re-prepare when either the text, the font size, or the line height changes.
- **Do** keep pointer-tracked movement instant and put all micro-interaction timing at 140–180ms with the system ease (`cubic-bezier(0.23, 1, 0.32, 1)`).
- **Do** hide hover effects behind `@media (hover: hover) and (pointer: fine)`.
- **Do** keep every explanatory stroke 1px dashed so it reads as annotation, not chrome.

### Don't:
- **Don't** add shadows, gradients, glass, textures, or card containers; the system is flat by decision.
- **Don't** animate the text reflow, stagger fragment entrances, or add autonomous motion; reflow is direct feedback.
- **Don't** let the disc's exclusion zone overlap glyphs — the 12px gap is the invariant that keeps the composition readable.
- **Don't** use `< 44px` touch targets for the pad on touch layouts.
- **Don't** let controls depend on color alone; every state pairs color with a border, outline, or text change.
