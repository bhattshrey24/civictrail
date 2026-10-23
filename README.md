# CivicTrail

Helps a citizen in a Delhi ward see **who is responsible** for a pending public
work — damaged roads, blocked drains, streetlights, unfinished projects — by
mapping each issue to its executing agency, supervising officials, and elected
representatives **where documented evidence supports it**, with source links and
verification dates throughout.

CivicTrail is an **evidence ledger**, not a data aggregator: it never invents
facts, labels every claim `verified` / `inferred` / `unverified`, and shows the
provenance and freshness of everything. See [CLAUDE.md](./CLAUDE.md) for the full
evidence rules.

> **MVP status:** early build. Scope is one Delhi ward with a human-verified
> curated dataset. See [FEATURES.md](./FEATURES.md) for progress.

## Stack

Next.js 16 · React 19 · TypeScript · Tailwind v4 · Supabase/Postgres (RLS) ·
MapLibre · Vitest · Playwright · GitHub Actions · Vercel.

## Development

Requires Node 20 and pnpm 9. (If a shell can't find them:
`export PATH="$HOME/.local/bin:$PATH"`.)

```bash
pnpm install
pnpm dev            # http://localhost:3000
```

Quality checks (all must pass before a commit is "done"):

```bash
pnpm lint
pnpm typecheck
pnpm test           # unit / integration (vitest)
pnpm build
pnpm test:e2e       # playwright (installs a browser on first run)
```

Copy `.env.example` to `.env.local` and fill in keys as phases need them. Never
commit real secrets — `.env*` is git-ignored.

## Docs

- [CLAUDE.md](./CLAUDE.md) — durable instructions + evidence rules
- [FEATURES.md](./FEATURES.md) — feature list, acceptance criteria, status
- [docs/ai-log.md](./docs/ai-log.md) — decisions & progress log
- [improve.md](./improve.md) — improvement backlog & tech debt
