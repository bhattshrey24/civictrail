# FEATURES.md — CivicTrail

Status legend: `- [ ]` todo · `- [~]` in progress · `- [x]` done (acceptance met).
A feature is only `done` when its acceptance criteria have been verified by an
actual check.

## Phase 1 — Setup & guardrails

- [x] Toolchain installed (Node 20, pnpm 9.15.0, gh 2.103.0)
- [x] Next.js 16 + TS + Tailwind v4 + ESLint scaffold at repo root
- [x] Test tooling: Vitest + Testing Library + Playwright
- [x] Prettier + ESLint/Prettier interop
- [x] Claude Code hooks (guard-bash, protected-paths, format, session-start) —
      verified via fixtures
- [x] Project docs (CLAUDE.md, FEATURES.md, docs/ai-log.md, improve.md)
- [x] CI workflow (verify / e2e / security) + CODEOWNERS
- [x] First green commit (lint + typecheck + unit + build + e2e all pass locally)
- [ ] GitHub repo created, branch protection + required checks configured
- [ ] Vercel project linked (preview + prod)

**Acceptance:** `pnpm lint && pnpm typecheck && pnpm test && pnpm build` all pass;
E2E smoke test passes; hooks demonstrably block the right things.

## Phase 2 — Ward selection, sources & data model

- [x] Timeboxed data-availability spike; **chose Vikaspuri (AC-31), West Delhi**
- [x] Zod domain schema encoding the evidence rules (`src/lib/domain/schema.ts`)
- [x] Dataset validation: referential integrity + "constituency ≠ control" rule
      (`src/lib/domain/validate.ts`)
- [x] Postgres migration mirroring the schema, with RLS (anon = read-only) and an
      evidence trigger (`supabase/migrations/0001_init.sql`) — **authored, not yet
      applied** (no hosted DB in this env)
- [x] Data-access layer / repository seam for the UI (`src/lib/data/repository.ts`)
- [x] Data-quality tests (evidence rules, provenance, referential integrity)
- [~] Curated **verified** issues with real source links — **3 issues** so far
  (D K Road reconstruction, dark-spot lighting, unclear drain ownership);
  expand toward ~10–15
- [ ] Load ward boundary GeoJSON (OpenCity 2022 MCD KML → GeoJSON) — moved to
      Phase 3 (needed for the map)
- [ ] Provision Supabase + apply migration + verify RLS denies anon writes
      (blocked on owner's Supabase account)

**Acceptance:** every claim-bearing row has `source_url` + `verified_at`;
data-quality tests pass (15 tests green); typecheck/lint/build green. DB-side
checks (migration applies, RLS denies anon writes) pending the Supabase account.

## Phase 3 — Discovery UI

- [ ] shadcn/ui set up
- [ ] Search by PIN / ward / locality
- [ ] Map (MapLibre) + issue list for the ward
- [ ] Loading / empty / error states; responsive; accessible

**Acceptance:** journey (a) search → results E2E passes.

## Phase 4 — Responsibility & evidence

- [ ] Responsibility-chain view with basis badges (Direct/Oversight/Political/Unclear)
- [ ] Evidence panel: source links + source date + last-verified + official flag
- [ ] Freshness/staleness indicator (deterministic)

**Acceptance:** journey (b) issue → chain E2E passes; data-quality tests enforce
"no political basis derived from constituency alone".

## Phase 5 — Timelines, accountability & escalation

- [ ] Project timeline (cost, tender ref, contractor, deadline, delays, progress)
- [ ] Accountability summary (status, outstanding work, next steps)
- [ ] Correct official complaint / escalation channels

**Acceptance:** journey (c) accountability + escalation E2E passes.

## Phase 6 — Hardening & deploy

- [ ] `/security-review` clean; a11y pass; full error states
- [ ] Deploy to Vercel prod behind required checks

## Phase 7 — Demo prep

- [ ] Scripted walkthrough + known-limitations summary
