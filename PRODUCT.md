# Pretext playground — product brief

<!-- impeccable:product-schema 1 -->

Status: agreed product scope, documentation only. Implementation requires a separate, explicit request. Scope approval in the interview was not permission to build.

## Platform

web

Desktop and phone browsers, with mouse, keyboard, and touch interaction.

## Stack

Confirmed: TypeScript, Vite, and Pretext, hosted on Vercel. TypeScript replaces the earlier plain-JavaScript decision at the user's request, for stronger error checking and alignment with Pretext's TypeScript codebase. Package versions and the public URL remain undecided. No application framework is required.

## Users

Technical and non-technical visitors encountering an interactive demonstration, including people the creator wants to show it to. No programming knowledge should be needed to enjoy it.

## Product Purpose

Show what Pretext can do through an immediately understandable, visually interesting interaction: moving a circle through text makes the words flow around it.

Success means visitors can discover the interaction, change the composition, and understand the result. Interested visitors can reveal a technical explanation without making the initial experience feel like a developer tool.

## Operating Context

A shareable web app used on desktops and phones. Opening the app starts with a curated essay. Visitor edits last only in the current page session; refreshing starts over. Sharing the app URL shares the starting experience, not a visitor's edits.

## Capabilities and Constraints

- One draggable circular obstacle, with an adjustable size.
- Text flows around the obstacle as it moves or changes size.
- An original short essay about reading, space, and meaning.
- A language toggle that shows the same essay in Mandarin Chinese (中文), with edits kept per language.
- An “Edit text” draft with Apply and Cancel, a 5,000-character limit, and preserved explicit line breaks.
- “Reset all” restores the original essay, obstacle position and size, and hides layout view, with a clear explanation of its scope.
- An optional “Show the layout” view with line boundaries and a plain-language explanation of Pretext.
- Curated typography rather than visitor-facing font controls.
- English-first text experience. Text the interactive renderer cannot handle correctly uses a readable standard layout with a short explanation; detection details require implementation-time validation.
- Full interaction on desktop and phone, including touch dragging.
- Mouse, keyboard, and touch access to the agreed controls.
- Session-only state; persistent or shareable edited compositions are outside the first version.

## Brand Commitments

Artful: beautiful typography, restrained color, and the feel of an interactive exhibition. Technical details are available on demand.

The user delegated visual design selection to the assistant using Impeccable. The selected planning direction is a living type specimen on a typesetter's light table, recorded in [the design brief](docs/design-brief.md). It has not been rendered or visually verified.

There is no approved product name or logo. “Between the Lines,” an ink-and-paper treatment, and a red circle were earlier assistant suggestions, not user-selected constraints.

## Evidence on Hand

The user approved the concept and first-version scope during the design interview. The library's current documentation supports variable-width line layout; see [technical approach](docs/technical-approach.md) for sources and limitations.

There is no implementation, visual prototype, user-test evidence, or app performance benchmark. The essay and interface copy in [content](docs/content.md) are drafts.

## Product Principles

1. Make the effect understandable before explaining the technology.
2. Keep one strong interaction at the center of the experience.
3. Make the technical explanation accurate and optional.
4. Preserve readability and access across input methods and screen sizes.

## Accessibility & Inclusion

Keyboard and touch support are agreed requirements. Specific semantics, focus behavior, contrast targets, and reduced-motion handling are proposed in the interaction and design documents. No formal compliance certification has been agreed.
