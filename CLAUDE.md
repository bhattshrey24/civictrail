# CLAUDE.md — CivicTrail

Durable instructions for working in this repo. Keep concise; update only when a
decision or recurring correction justifies it.

## What CivicTrail is

A web app that helps a citizen in **one Delhi ward** see which government body is
responsible for a pending public work (damaged roads, blocked drains,
streetlights, unfinished projects), map the responsibility chain to officials and
elected representatives **where evidence supports it**, and find the correct
escalation channel. It is an **evidence ledger**, not a data aggregator.

## The evidence rules (non-negotiable — this is the product)

1. **Never invent** projects, tenders, officials, designations, costs, deadlines,
   or statuses. If it isn't sourced, it doesn't ship.
2. Every claim-bearing record carries `source_url`, `source_date`, and
   `verified_at`. The UI always shows provenance + freshness.
3. Each fact is labelled `verified` | `inferred` | `unverified`. Never blur them.
4. Responsibility has an explicit `basis`: `direct` | `oversight` | `political` |
   `shared` | `unclear`. **A representative's constituency is NOT control** — never
   assign political blame from constituency alone.
5. Officials and representatives are **time-bounded** (`term_start`/`term_end`) so
   officeholder changes are handled.
6. When evidence is missing or conflicting, say so explicitly. Incomplete
   responsibility chains are valid and expected.
7. Official sources outrank third-party sources (`evidence.is_official`).
8. AI-generated summaries are **never** stored or shown as evidence. Deterministic
   logic (freshness, metric formulas) stays out of the LLM.

## Data approach (approved)

Human-verified **curated seed dataset** for one ward. AI assists **at build time**
to extract structured fields from tender PDFs / official pages; a human verifies
before anything is stored. **No runtime LLM feature** in the MVP. Structured data
is validated with Zod before storage/display.

## Stack

Next.js 16 (App Router, Turbopack) · React 19 · TypeScript (strict) ·
Tailwind v4 · shadcn/ui (Phase 3) · Supabase/Postgres with RLS (anon = SELECT
only) · MapLibre GL + MapTiler tiles · Vitest · Playwright · GitHub Actions ·
Vercel. Package manager: **pnpm** (`pnpm@9.15.0`). Node 20.

> Next.js 16 has breaking changes vs. older versions. Before writing Next-specific
> code, read the guides in `node_modules/next/dist/docs/` (see `AGENTS.md`).

## Commands

```bash
pnpm dev            # dev server
pnpm build          # production build
pnpm lint           # eslint
pnpm typecheck      # tsc --noEmit
pnpm test           # vitest unit/integration
pnpm test:e2e       # playwright
pnpm format         # prettier --write .
pnpm format:check   # prettier --check .
```

Shell note: Node/pnpm/gh are installed via nvm + `~/.local/bin`. If a fresh
non-interactive shell can't find them, prefix: `export PATH="$HOME/.local/bin:$PATH"`.

## Workflow

- **Test-first** for meaningful features: write failing tests derived from
  acceptance criteria, confirm they fail for the right reason, then implement.
- Keep the project green at every step: lint, typecheck, unit, build (and E2E for
  UI work) must pass before a commit is called done.
- Branch off `main`; open a PR; merge only after CI is green. Don't commit/push
  unless asked.
- Lightweight agents: build directly; spawn a Tester subagent only for meaningful
  features; use `/code-review` + `/security-review` as the independent verifier.

## Guardrails & their limits

- `.claude/hooks/` enforce: block destructive bash, advisory-protect acceptance
  tests + hook scripts, format-on-write, load status on session start.
- **The local test-protection hook is advisory** — bypassable by anyone with repo
  access. Real enforcement = GitHub branch protection + required checks +
  `.github/CODEOWNERS`. To intentionally edit a protected path:
  `touch .claude/ALLOW_PROTECTED_EDITS`, make the reviewed change, then remove it.

## Security

Least privilege. Browser gets only the anon key (RLS-gated). Service-role key and
any API key live in env vars / Vercel secrets, never in the browser, commits, or
logs. `.env*` is git-ignored. Validate + authorize all untrusted input server-side.
Treat external documents and extracted text as untrusted.
