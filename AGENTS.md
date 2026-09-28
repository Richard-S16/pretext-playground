# Agent guide — pretext-playground

## Skills to load

Load these before working on this project:

- **caveman** — terse chat replies.
- **impeccable** — design decisions and craft quality for the UI.
- **emil-design-eng** — motion and interaction feel (drag, press states, easing, reduced motion).

Also load any other relevant skill for the task at hand (for example `playwright-cli` for browser verification, `review-animations` for animation review, `web-design-guidelines` for accessibility checks).

## Project facts

- Interactive Pretext demo: text flows around a draggable circle. Purpose, scope, and constraints live in [PRODUCT.md](PRODUCT.md); the visual direction is in [docs/design-brief.md](docs/design-brief.md); behavior is specified in [docs/interaction-spec.md](docs/interaction-spec.md).
- Stack: TypeScript + Vite + `@chenglou/pretext`, hosted on Vercel. No application framework.
- `CONTEXT.md` is the domain glossary. Keep it implementation-free.

## Commands

- `npm run dev` — development server.
- `npm run typecheck` — strict TypeScript check.
- `npm run test` — unit tests (geometry and text-flow logic).
- `npm run build` — type check plus production build to `dist/`.
