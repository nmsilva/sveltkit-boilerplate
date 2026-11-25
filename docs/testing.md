# Testing and verification

Run what is relevant before opening or updating a PR (all exist in `package.json`):

```bash
bun run lint
bun run format:check
bun run check
bun test              # unit tests, e.g. src/lib/db/adapters/memory/index.test.ts
bun run build
bun run test:e2e      # Playwright, memory backend by default; see CONTRIBUTING.md
```

- Unit tests sit next to the code as `*.test.ts` and use `bun test`. Test adapters with an injected client or the memory provider, not real credentials.
- E2E tests are in `e2e/` and use the `data-testid` selectors listed in the README. They need `bunx playwright install chromium`.
- UI or behaviour changes need a test or a note on how it was verified. Docs-only changes need `bun run check` and `bun run build` still passing.
- CI is not a substitute for running the commands locally. If a command needs network or credentials that are not available, say so in the PR instead of skipping silently.
