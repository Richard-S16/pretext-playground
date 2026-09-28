https://github.com/user-attachments/assets/fadf9e49-5b34-4732-8b35-20813611d12e


# Pretext playground

An artful, interactive demonstration of [Pretext](https://github.com/chenglou/pretext): move the circle, and the essay flows around it.

The app lives at this project root (TypeScript + Vite, no application framework) and deploys to Vercel from this directory. Planning and design documents live in [docs/](docs/) and the root files below.

## Run it

```sh
npm install
npm run dev        # development server
npm run build      # type check + production build to dist/
npm run preview    # serve the production build
npm run test       # unit tests for the geometry and flow logic
npm run typecheck  # strict TypeScript check
```

Deployment: Vercel detects the Vite setup in this directory; `vite build` and `dist/` are the defaults. No server, secret, or environment variable is required.

## Read in this order

| Document | Responsibility |
| --- | --- |
| [PRODUCT.md](PRODUCT.md) | Confirmed purpose, audience, scope, and constraints |
| [CONTEXT.md](CONTEXT.md) | Domain glossary only |
| [DESIGN.md](DESIGN.md) | The implemented visual system: tokens, components, rules |
| [Design brief](docs/design-brief.md) | How the visual direction was selected |
| [Interaction specification](docs/interaction-spec.md) | Behavior, state, accessibility, and edge cases |
| [Content](docs/content.md) | Essay and interface copy |
| [Technical approach](docs/technical-approach.md) | Library facts, architecture, deployment plan |
| [Acceptance checklist](docs/acceptance.md) | Verification plan and what has been checked so far |
| [AGENTS.md](AGENTS.md) | Skills to load and project facts for agents |

## Decision status

- **Confirmed** means explicitly selected or accepted in the interview.
- **Proposed** means a concrete recommendation for review, not user approval.
- **Selected under delegation** means the assistant made the choice the user explicitly asked it to make.
- A verification checkbox is a future check, not evidence of a passing test.

PRODUCT.md owns the confirmed scope. Other documents elaborate it; proposed details do not silently expand that scope.

## Confirmed decisions

| Topic | Decision |
| --- | --- |
| Purpose | An interesting Pretext showcase for technical and non-technical people |
| Interaction | Text flows around one draggable circle |
| Personality | Artful, with technical details available on demand |
| Content | Original essay about reading and space, editable by visitors |
| Languages | English default with a Mandarin Chinese (中文) toggle; curated texts, edits per language |
| Controls | Drag, obstacle size, reset, edit text, and layout view |
| Typography | Curated rather than adjustable by visitors |
| Design selection | Delegated to the assistant using Impeccable; direction recorded in DESIGN.md and the design brief |
| Stack | TypeScript, Vite, and Pretext; no application framework |
| Hosting | Vercel |
| Language scope | English-first |
| Text editing | Draft with Apply/Cancel; 5,000-character limit; explicit line breaks preserved |
| Unsupported layout cases | Readable standard text layout with a short explanation |
| Reset scope | Original essay, starting circle position and size, layout view off; clearly labeled Reset all |
| Platform | Web app supporting desktop and phones |
| Input | Mouse, keyboard, and touch |
| Persistence | Current page session only; refresh restores the starting experience |
| Sharing | App URL opens the curated starting experience |
