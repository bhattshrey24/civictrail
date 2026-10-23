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
- [ ] First green commit (lint + typecheck + unit + build + e2e all pass locally)
- [ ] GitHub repo created, branch protection + required checks configured
- [ ] Vercel project linked (preview + prod)

**Acceptance:** `pnpm lint && pnpm typecheck && pnpm test && pnpm build` all pass;
E2E smoke test passes; hooks demonstrably block the right things.

## Phase 2 — Ward selection, sources & data model

- [ ] Timeboxed data-availability spike across 2–3 candidate wards; pick richest
- [ ] Load ward boundary GeoJSON (OpenCity 2022 MCD delimitation)
- [ ] Zod schemas + Postgres schema (issue → asset → agency → office → oversight →
      representative; evidence; responsibility with `basis`)
- [ ] Supabase project + RLS (anon SELECT only) + seed migration
- [ ] First ~10–15 **verified** issues with real source links

**Acceptance:** seed migration loads; every claim-bearing row has
`source_url` + `source_date` + `verified_at`; RLS denies anon writes; data-quality
tests pass.

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
