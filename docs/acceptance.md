# Acceptance checklist

Status: partially verified. The automated unit tests pass and a first browser pass has been run (see the record below). Unchecked boxes are unverified, not failed. Proposed behaviors refer to the [interaction specification](interaction-spec.md).

## Verification record — first browser pass

Environment: production build served locally; headless Chromium via Playwright at 1440×900 and a mobile emulation (~390×844). Date: 2026-09-28.

| Check | Result |
| --- | --- |
| Type check, unit tests (12), production build | Pass |
| Desktop first viewport: text flows around the circle | Pass (screenshots in `.impeccable/review/`) |
| Mouse drag: grab offset respected, clamped bounds, clean release | Pass |
| Arrow keys (8px) and Shift+arrows (24px) on focused circle | Pass |
| Move pad buttons | Pass (same code path as arrows) |
| Size slider changes disc and text space | Pass |
| Edit → Apply replaces text; Cancel preserves; over-limit blocked with draft kept | Pass |
| Empty text state shows prompt; controls remain | Pass |
| Reset restores essay, circle, slider, layout view, and announces | Pass |
| Layout view: fragment outlines and explanation; no input interception | Pass |
| Mobile: compact rail above text; both sides of the circle remain usable | Pass |
| Mobile emulated drag with clamping | Pass (mouse events in mobile emulation) |
| Mechanical design-detector scan of changed UI files | Clean (no findings) |

Not yet verified: real touch hardware, Firefox and Safari rendering/measurement agreement, screen readers, 200% zoom, and a sustained-drag performance profile. These remain open; do not present them as passed.

## Audit and polish record — second pass

Audited dimensions (0–4): Accessibility 3, Performance 4, Responsive 3, Theming 3, Implementation Integrity 4 — 17/20, "Good". Evidence: contrast computed for every text pair (6.2:1–16:1); drag frame histogram median 6.9 ms / p95 8.1 ms over 120 frames; no horizontal overflow at 320 px; tab order verified end-to-end; `prefers-reduced-motion` zeroes transitions with content visible; copy of the essay preserves word boundaries and reading order.

Fixes applied in one batch:

| Finding | Fix |
| --- | --- |
| Touch targets under 44 px on coarse pointers (buttons 39, pad 36, slider 16) | `pointer: coarse` media query: 44 px minimum for buttons, slider, pad cells |
| Resting control border 1.86:1 non-text contrast | New `control-border` token (#868b9b, 3.1:1) on buttons and textarea; hover deepens to #666b78; hairlines now decorative only (Two-Border Rule) |
| Reset with the editor open moved focus to "Edit text" | Focus returns to Reset all |
| Literal hover colors not tokenized | `--control-border`, `--control-border-hover`, `--ink-deep` tokens |
| Browser surfaces unthemed | Violet caret in the textarea; themed scrollbar color |
| Type steps (12/14/18 px) missing from DESIGN.md ramp | Documented as `counter`, `explanation`, `empty-state` roles; detector advisories cleared |

One detector advisory remains and is a verified false positive: `h1` is flagged with `rgb(0, 0, 0)` because the static scan cannot resolve `var()`; the computed color is `rgb(86, 91, 102)`, the documented Secondary Ink.

## Longer essay and language toggle record — third pass

Checked in the same Chromium environments after extending the English essay to eleven paragraphs and adding the Mandarin toggle:

| Check | Result |
| --- | --- |
| Longer English essay renders (46 fragments, canvas 1820 px) | Pass |
| Drag frame timing with the longer text | Pass (median 6.9 ms, p95 9.5 ms, max 21.5 ms over 120 frames) |
| Toggle to Mandarin: label flips to English, `lang` set to `zh-CN` | Pass |
| Mandarin renders with real CJK glyphs, no tofu; flows around the disc | Pass |
| Measurement agreement: no fragment wider than its available interval | Pass (0 overflow fragments) |
| Kinsoku: no line starts with forbidden punctuation (。，、！？：；」) | Pass |
| Editor: draft follows the current language; switching with the editor open swaps the draft | Pass |
| Reset restores both essays | Pass (Chinese text restored to its original) |
| Mobile (390 px): Mandarin rail and composition hold | Pass |
| Console errors during the whole pass | None |

Still open from the earlier list (real touch hardware, Firefox/Safari, screen readers, 200% zoom), plus the Mandarin mode's cross-browser wrapping, which should be re-checked on Firefox/Safari before launch claims.

## Full-height disc and wider column record — fourth pass

| Check | Result |
| --- | --- |
| The disc reaches the last lines of the essay (bounds = layout height) | Pass (clamped at layout bottom: cy 1394 of 1470) |
| No bounds creep: drag held at the bottom, frames 30 and 90 identical | Pass (position and canvas height unchanged) |
| Reset returns the disc to the fresh-load spot at the current viewport | Pass (cy = 0.3 × provisional height) |
| Wider content column | Pass (field 1040 px at 1440 viewport, up from 776 px) |
| Mobile: 296 px field at 360 px viewport, ball roams whole essay, no overflow | Pass |
| Console errors | None |

## Product demonstration

- [ ] R1: The initial viewport shows text already flowing around the circle and gives a clear invitation to move it.
- [ ] R2: Moving the circle visibly changes nearby line breaks rather than merely covering words.
- [ ] R3: Changing size changes the available text space without hiding content or losing the circle.
- [ ] R6: A non-technical visitor can understand the layout explanation without knowing Pretext terminology.
- [ ] R6: The explanation accurately distinguishes app geometry, Pretext measurement/layout, and browser rendering.

## Interaction checks

- [ ] R2: Mouse drag retains the grab offset; release outside the obstacle ends cleanly.
- [ ] R2: Touch drag works; scrolling outside the obstacle still works.
- [ ] R2: Pointer cancellation and a second touch do not leave a stuck drag.
- [ ] R2: Keyboard movement and directional click/tap controls reach the same bounded positions as dragging.
- [ ] R3: Minimum and maximum size work at each target width; resizing near an edge clamps correctly.
- [ ] R4: Apply changes the text; Cancel preserves the previous text; neither resets the circle or layout toggle.
- [ ] R4: Empty input shows a useful empty state and can be recovered through edit or reset.
- [ ] R4: Over-limit input preserves the draft and gives a clear error without silent truncation.
- [ ] R4: IME entry is not applied mid-composition.
- [ ] R5: Reset restores all agreed starting values and returns focus predictably.
- [ ] R5: Refresh and opening the base URL restore the curated experience; edited text is absent from storage and the URL.
- [ ] R6: Layout outlines match the actual fragment regions and do not intercept input.
- [ ] R7: Resize and phone orientation changes preserve text and drafts, with valid clamped circle geometry.

## Text-layout correctness

- [ ] Full text is consumed once, in order, without duplicated or dropped words across fragment boundaries.
- [ ] Paragraph breaks and explicit newlines behave consistently, including when a row has two available fragments.
- [ ] No rendered text intersects the circle's exclusion gap at its top, center, bottom, or container edges.
- [ ] Very narrow intervals, long unbroken text, emoji, and combining marks do not create overflow or non-progress loops.
- [ ] A row with no usable interval advances; text continues below the obstacle.
- [ ] All text remains reachable, including long input extending below the interaction region.
- [ ] The selected mixed-direction/script policy produces readable text or its documented fallback.
- [ ] Measurements agree with rendering after font load, font failure, zoom, and responsive typography changes.

## Accessibility and resilience

- [ ] Controls have visible labels, accessible names, visible focus, and predictable tab order.
- [ ] A keyboard-only visitor can move/resize the circle, edit, apply/cancel, reset, and toggle layout view.
- [ ] A screen reader reads the essay once in a sensible order and does not announce every reflow.
- [ ] Selection and copying preserve word boundaries and reading order.
- [ ] Text/control contrast and touch targets meet the approved design targets.
- [ ] At 200% zoom, the interface remains usable; at a 320-CSS-pixel viewport, content reflows without page-level horizontal scrolling.
- [ ] Reduced-motion preference removes decorative motion without disabling the main interaction.
- [ ] Slow or failed font/library loading leaves readable content and an honest state message.
- [ ] HTML-like pasted input renders as text rather than executable markup.

## Proposed verification matrix

Confirm the support commitment before implementation. Record exact browser versions and devices when checks run; “latest” alone is not a reproducible result.

| Environment | Primary checks |
| --- | --- |
| Desktop Chromium, 1440 × 900 | Mouse, keyboard, layout, editor, zoom |
| Desktop Firefox, 1280 × 800 | Font measurement differences, line breaks, keyboard |
| Desktop Safari | Font/rendering agreement and focus behavior, if available |
| iPhone Safari, approximately 390 CSS pixels wide | Real touch, scrolling, orientation, text input |
| Android Chrome, approximately 360 CSS pixels wide | Real touch, narrow layout, text input |
| Narrow viewport, 320 CSS pixels wide | Reflow, usable controls, geometry bounds |
| One desktop screen reader and VoiceOver on iPhone | Reading order, control names, focus, announcements |

Emulation is useful for layout checks but does not prove real-device touch or font behavior. Mark unavailable environments as unverified rather than passed.

## Minimal automated evidence to leave behind

- A geometry check for unobstructed rows, circle-center rows, tangency, and edge clipping.
- A browser-based layout check covering text progress, complete consumption, narrow fragments, and hard breaks using the pinned Pretext version and real fonts.
- One interaction smoke check for editing, reset, and responsive bounds if the chosen tooling supports it economically.

Use the smallest suitable test setup. Do not mock font measurement and treat the result as browser typography verification.

## Performance and completion record

- [ ] Profile a sustained drag with the curated essay and the approved maximum text length on a phone and desktop.
- [ ] Confirm preparation is reused during dragging and updates are coalesced per animation frame.
- [ ] Record any visible stutter and its environment; do not infer a benchmark from the library's marketing.
- [ ] Run the selected production build and check the built app, not just the development server.
- [ ] Record checks actually run, failures, unavailable environments, screenshots, and unresolved limitations.

There are no runnable test or build commands yet. This checklist will become evidence only after implementation and execution.
