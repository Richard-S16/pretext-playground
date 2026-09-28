# Interaction specification

Status: confirmed capabilities with proposed behavioral defaults. All details labeled proposed need review before implementation. Requirement IDs are referenced by the acceptance checklist.

## R1 — Starting experience

**Confirmed:** show the curated essay with one movable, resizable circle; make the effect usable on desktop and phone.

**Proposed:** start with layout view off and the editor closed. Place the circle within the initially visible text. Keep all text reachable through ordinary page scrolling; do not clip the essay into a fixed-height viewport.

## R2 — Obstacle movement

**Confirmed:** mouse, keyboard, and touch operation.

**Proposed:** drag anywhere on the obstacle. Preserve the grab offset so it does not jump under the pointer. The obstacle may travel anywhere within the current text layout: its bounds are the field width and the layout's own height, captured when the text, language, or type metrics last changed and held frozen while a drag is in progress, so a drag can never feed back into the bounds it is clamped against. On load and after Reset it starts in the upper text area.

Use arrow keys while the obstacle is focused: 8 CSS pixels per press, or 24 with Shift. Provide labeled directional buttons as an equivalent click/tap alternative. These controls serve accessibility rather than adding another interaction mode to the showcase.

Clamp movement at the region edges. Pointer release or cancellation ends the drag at its latest valid position. A second pointer does not take ownership of an active drag. Scrolling elsewhere on the page remains available.

## R3 — Obstacle size

**Confirmed:** a visitor can adjust the circle's size.

**Proposed:** use a labeled native range control. Derive its valid range from available width, including the exclusion gap, so the largest circle cannot consume the whole text field. Keep a useful text passage open where possible; skip fragments too narrow to be readable.

Resizing preserves the center until bounds require clamping. No pinch gesture is required. The final minimum, maximum, and initial diameter need visual validation on phones.

## R4 — Text editing

**Confirmed:** visitors can replace the essay through a draft editor. Apply updates the composition; Cancel leaves the current text unchanged. Input is limited to 5,000 characters, and explicit line breaks are preserved.

**Proposed:** “Edit text” opens an inline, labeled textarea with a draft copy of the current text. “Apply text” updates the composition and closes the editor; “Cancel” discards the draft. Both return focus to “Edit text.” Editing preserves obstacle placement, size, and layout-view state.

Treat input as plain text, never HTML. Preserve explicit line breaks and normalize platform newline variants consistently. Allow empty text: show a brief empty-state prompt while retaining the controls.

The 5,000-character limit is confirmed. Counting in UTF-16 code units remains a technical proposal, not an explicitly approved counting convention. Validate pasted input as well as typed input, and explain any error without silently truncating text. Support input-method composition without applying an unfinished draft.

**Confirmed:** the first version is English-first. For text the interactive renderer cannot handle correctly, show a readable standard layout with a short explanation. Arbitrary pasted writing systems must not be advertised as fully supported by this app before testing. Reliable fallback detection remains an implementation detail to validate. Preserve the ability to edit or reset.

## R5 — Reset and session lifetime

**Confirmed:** “Reset all” restores the original essay, starting obstacle position and size, and hides layout view. Its nearby hint explains: “Restores the essay, circle, and view.” Changes do not persist across refresh.

**Proposed supporting behavior:** calculate initial geometry for the current viewport, close/discard any open text draft, keep focus on reset, and announce completion once.

Do not store compositions in local storage, session storage, a server, or URL parameters. A normal reload and a newly opened app URL restore the curated state. Browser back/forward restoration may retain the existing page instance; this is not a promise to erase browser-managed history state.

## R6 — Layout view

**Confirmed:** a toggle shows line boundaries and a plain-language explanation of Pretext.

**Proposed:** show the actual line-fragment regions used by the layout, including separate left and right fragments when both exist on a row. The overlay is visual-only and does not intercept input. Toggling it does not change the text or obstacle geometry.

Keep the explanation concise and link to the upstream project. Metrics, FPS counters, benchmark comparisons, and additional developer controls are not required.

## R7 — Responsive behavior and text flow

**Confirmed:** both desktop and phones support the full interaction.

**Proposed:** preserve the text, layout toggle, and open editor draft across viewport changes. Map the obstacle's relative position into the new interaction region and clamp its size and position. Retain readable font sizes rather than shrinking the page as an image.

Text proceeds in reading order through available regions. For the English composition, fill a row's left fragment, then its right fragment, then the next row. The obstacle's exclusion gap must cover the entire line box, not just its baseline. Skip unusably narrow regions; never loop indefinitely trying to fit a glyph.

## R8 — Accessibility and failure states

**Proposed:** expose the complete text once, in a meaningful reading order. Visual line fragments must not duplicate the essay in the accessibility tree. Choose the rendering semantics during implementation and verify with a screen reader.

Provide instructions for keyboard movement. Avoid announcing every pointer move or every line reflow. Announce explicit actions such as reset, applied text, and validation failures. Native controls retain their standard keyboard behavior.

If fonts or layout preparation fail, preserve the current text and editor draft. Show readable normal-flow text and a concise explanation rather than a blank page. Distinguish a temporary loading state from a fallback state. Editing and reset should remain usable when feasible.

## R9 — Language toggle

**Confirmed:** a button switches the curated essay between English and Mandarin Chinese.

**Proposed:** the button labels itself with the target language (中文 in English mode, English in Chinese mode) and its accessible name states the target ("Show the essay in Mandarin Chinese"). English remains the default on load. Edits are per language: editing applies to the essay currently shown. Switching language with the editor open replaces the draft with the target language's committed text. Reset all restores both essays. There is no automatic language detection, and the toggle does not claim support for arbitrary pasted scripts — it switches between two curated texts.

## State inventory — proposed

| State | Expected behavior |
| --- | --- |
| Loading fonts/library | Text remains readable; interactive layout is not falsely presented as ready |
| Ready | Circle, controls, and current text are usable |
| Dragging | One active pointer owns movement; geometry updates with input |
| Editing | Draft is separate from displayed text until Apply |
| Empty text | Helpful prompt; controls and reset remain available |
| Invalid draft | Inline explanation; draft preserved; Apply does not discard it |
| Layout view on | Boundaries and explanation visible, normal interaction preserved |
| Fallback | Readable current text, honest explanation, edit/reset where feasible |

Layout view can coexist with ready, dragging, and editing. These are user-visible conditions, not a requirement to introduce a state-machine library.
