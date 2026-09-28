# Technical approach

Status: confirmed TypeScript/Vite stack and Vercel hosting, researched library facts, and a proposed implementation approach. No code has been written. Detailed architecture recommendations remain proposals.

## Verified library facts

Reviewed 2026-09-25 against the upstream README and Context7 documentation for `/chenglou/pretext`. Upstream `main` is mutable; verify the selected package version again before implementation.

- The package is `@chenglou/pretext`.
- `prepareWithSegments` measures and segments text for manual line layout.
- `layoutNextLine` accepts prepared text, a segment/grapheme cursor, and an available width. It returns a line and its continuation cursor, or null at exhaustion.
- `layoutNextLineRange` provides ranges without constructing line strings; `materializeLineRange` turns a range into a line. These are alternatives if allocation becomes a measured concern.
- Preparation can be reused when only layout widths change. Text, font configuration, or page-language changes require renewed preparation.
- The app can render the resulting layout into DOM, Canvas, or SVG. Pretext does not itself compute circle geometry or provide drag interactions.
- Browser support requires Canvas 2D text measurement and Unicode property escapes. Some Southeast Asian scripts also require `Intl.Segmenter`.
- Measurements must match rendered typography. The README calls out named fonts, pixel font sizes, matching spacing, page language, and unsupported separate optical/feature/variation settings.
- Pretext does not provide bidi visual order. Separately rendered lines can reorder mixed-direction content differently from a whole paragraph.
- Avoiding DOM text measurement does not remove DOM rendering, style, or paint costs from the app.

Sources:

- [Upstream README and API](https://github.com/chenglou/pretext/blob/main/README.md)
- [Live demonstrations](https://chenglou.me/pretext/)
- [Platform bug ledger](https://github.com/chenglou/pretext/blob/main/PLATFORM_BUGS.md)

## Proposed system boundary

A client-side app with local in-memory state should cover the agreed scope. No backend is required by that scope. Vercel is the confirmed hosting provider.

TypeScript and Vite are confirmed, without an application framework. This supersedes the earlier plain-JavaScript choice. DOM rendering remains the recommended rendering approach. Pin actual dependency versions when implementation is authorized; no packages have been installed.

Proposed verification policy: enable strict TypeScript checking and require a successful type check before production deployment. Type checks complement the runtime and browser checks; they do not prove text-layout correctness.

DOM rendering is attractive for ordinary text and controls, but fragmented positioning needs deliberate selection, copy, and screen-reader treatment. Do not claim these are automatically solved by choosing DOM.

## Proposed data flow

1. Load the chosen font and establish the actual text style and page language.
2. Prepare the current text with Pretext.
3. Read the text field's width and determine the obstacle's bounded geometry.
4. Derive available horizontal intervals for each text row.
5. Ask Pretext to fill those intervals in reading order, retaining its continuation cursor.
6. Render the returned fragments and size the text field to contain the result.
7. Reuse that layout for the optional boundary overlay.

Track only the current text, editor draft/open state, obstacle geometry, layout-view state, and transient input/readiness state. Line fragments are derived output. No state-management framework is justified by this plan alone.

## Circle exclusion geometry

This geometry belongs to the app, not Pretext. Proposed method:

- Let the visible radius be `r`, the text gap be `g`, and the exclusion radius be `R = r + g`.
- For a row spanning vertical coordinates `y0` to `y1`, find `d`, the shortest vertical distance from the circle center to that interval; `d` is zero when the interval includes the center.
- If `d >= R`, the row is unobstructed. Otherwise, the largest excluded half-width over that row is `sqrt(R² - d²)`.
- Clip the resulting excluded horizontal interval to the text field. Its complement gives zero, one, or two available intervals.
- For the English composition, fill left then right before advancing to the next row.

Using the whole line box prevents overlap near the circle's top and bottom that a baseline-only calculation can miss. Keep the gap large enough for the chosen font's visual ink bounds and verify it with actual rendering.

Reject intervals below a useful minimum width. If a grapheme cannot fit, skip that interval without accepting an overflowing fragment. If none can fit on the row, advance vertically. Ensure every iteration either advances the text cursor or moves to another row; provide a bounded failure path rather than a potentially unending loop.

Obstacle bounds are the field width × the current layout height. The height is recomputed only when the text, language, or type metrics change and is frozen for the duration of a drag, which breaks the feedback loop: within a drag, moving the obstacle changes the text height but never the bounds it is clamped against. A scroll during an active drag refreshes the cached field rect so the disc stays under the pointer.

## Typography and input

English-first for arbitrary input. The app additionally ships two curated texts (English and Mandarin Chinese) behind a language toggle; the Mandarin mode is curated content, not a claim of arbitrary-script support. The 5,000-character limit and readable standard-layout fallback remain the governing rules for visitor-pasted text.

In Mandarin mode the field re-points to a system CJK font stack, and the canvas measures with the field's own computed `font-family` stack, so measurement and ink resolve to the same family. Verified in Chromium: no fragment overflowed its available width and no forbidden line-start punctuation (kinsoku) appeared. As a precaution, the check should be repeated on Firefox/Safari and on a real phone; the library's `lang`, minimum-font-size, and macOS `system-ui` caveats still apply.

Prepare only after the actual font is ready, or explicitly prepare again when a fallback changes. Use one resolved style definition for measurement and rendering. If dimensions change without a font change, reuse preparation.

The proposed editor preserves line breaks, so `whiteSpace: 'pre-wrap'` is a candidate. Normalize CRLF and lone CR to LF consistently. Validate that hard breaks terminate a row rather than continuing into the opposite side of the same row; this behavior must be checked against the pinned API.

Never interpret pasted text as markup. Do not use raw string offsets in place of Pretext's segment/grapheme cursors. Test long tokens, emoji sequences, combining marks, explicit breaks, and empty input.

Mixed-direction text is a material correctness concern for a split-line renderer. The approved fallback policy is normal-flow text when interactive rendering cannot preserve correctness, retaining its text and direction. Detection and the exact supported-script policy must be selected and tested, not approximated with an undocumented heuristic.

## Input and rendering performance

Use pointer events and pointer capture for drag continuity. Restrict touch gesture suppression to the draggable surface; do not disable page scrolling globally. Read container geometry when needed, but do not measure every text fragment to choose line breaks.

Coalesce movement updates to one layout/render per animation frame. Reprepare only when text or typography changes, not on every pointer event. Observe container resize and recompute geometry. Keep obstacle motion and text updates synchronized.

A small bounded input is preferable to adding virtualization, workers, or a custom cache prematurely. No frame-rate target has been measured. Profile the complete interaction on the agreed browser/device matrix before publishing performance claims.

## Accessibility and recovery

Keep the full essay available exactly once in logical reading order for assistive technology. If using a separate accessible text representation, hide only the duplicate visual fragments, never the controls. Verify copy/selection separately; fragment joins must not merge or reorder words.

Keep a readable normal-flow representation available when initialization fails. Unsupported browser parsing can fail before feature checks inside the library execute, so a fallback must not depend on successfully importing and running Pretext first.

No text transmission or persistent composition storage is required. If external font delivery is proposed later, document that network dependency separately rather than claiming the app makes no external requests.

## Future implementation sequence

Only after explicit authorization:

1. Review the delegated visual direction, resolve key interaction proposals and support policy, and select dependency versions for the confirmed stack.
2. Verify the chosen Pretext version with one variable-width layout proof, including hard breaks, narrow intervals, and text exhaustion.
3. Build the single composition with the curated essay and stable circle bounds.
4. Add mouse/touch movement, keyboard and click/tap alternatives, size, editing, reset, and layout view.
5. Add responsive behavior, accessible reading order, empty/error states, and font recovery.
6. Run the [acceptance checklist](acceptance.md), record actual results, and build for Vercel.

This sequence is a plan, not an instruction to begin. Add deployment/run commands to README only when they exist and have been checked.

## Vercel deployment plan

Confirmed destination: Vercel. Verified against [Vercel's framework definitions](https://github.com/vercel/vercel/blob/main/packages/frameworks/src/frameworks.ts) through Context7 on 2026-09-25: Vercel detects the Vite dependency and provides a Vite preset with `vite build` and `dist` as the output directory.

For a later deployment, select the app's directory as the project root and use the Vite preset. Verify the actual package scripts and generated output before relying on those defaults. This single-page scope does not require a server, secret, or custom route rewrite. A public URL, repository connection, and deployment authorization have not been provided. No Vercel project or configuration file has been created.
