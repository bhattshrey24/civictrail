# docs/ai-log.md — AI-assisted implementation log

Significant decisions, completed phases, open issues, and the next recommended
action. Newest first.

---

## 2026-10-23 — Phase 2: ward selection, sources & data model

### Ward chosen: Vikaspuri (Assembly Constituency AC-31), West Delhi

Selected after a data-availability spike for having (a) multiple ward-level public
works with cost/timeline from the official e-procurement data, (b) a clean,
sourced responsibility chain, and (c) built-in overlapping-jurisdiction examples.

Key sourced facts curated into the seed:

- MLA Vikaspuri (AC-31): **Pankaj Kumar Singh (BJP)**, won 2025, defeated Mahinder
  Yadav (AAP, MLA 2014–2025 — kept as a time-ended record to show officeholder
  change).
- MP West Delhi: **Kamaljeet Sehrawat (BJP)**, 2024.
- Agencies with verified official sites: MCD (mcdonline.nic.in), PWD
  (pwddelhi.gov.in), DJB (delhijalboard.delhi.gov.in), I&FC (ifc.delhi.gov.in).
- Issues: D K Road reconstruction (NIT 01, ₹64.66 lakh, 180 days); dark-spot LED
  lighting (NIT 06, ₹45.0 lakh); an explicitly **unclear** drain-ownership case.
- Councillor deliberately **omitted** — name not yet verified against the Delhi
  State Election Commission record (incomplete chain is valid).

### Built & verified locally

- `src/lib/domain/schema.ts` — Zod contract encoding the evidence rules
  (confidence enum, basis enum, time-bounded officials/reps, evidence requires a
  source + verified_at, a `verified` claim must cite evidence).
- `src/lib/domain/validate.ts` — referential integrity + "direct/oversight/
  political responsibility must cite evidence (constituency alone ≠ control)".
- `src/data/vikaspuri.ts` — the curated, fully-sourced seed.
- `supabase/migrations/0001_init.sql` — mirrors the schema; RLS = anon read-only;
  deferred trigger enforces the responsibility-evidence rule at the DB too.
- `src/lib/data/repository.ts` — the single data-access seam the UI will use.
- Tests: 15 green (provenance, dataset data-quality incl. negative cases,
  repository). typecheck / lint / build green.

### Open issues / next action

- Migration + RLS are **authored but unapplied** (no Docker/Postgres locally; needs
  the owner's Supabase account). DB-side acceptance (apply + anon-write-denied)
  is pending that.
- Seed has 3 issues; expand toward ~10–15.
- Ward boundary GeoJSON (OpenCity KML → GeoJSON) moved to Phase 3 (map).
- **Next action:** begin Phase 3 (discovery UI: search + list + map) against the
  repository seam, OR expand the seed to ~10–15 issues first. Awaiting owner steer.

---

## 2026-10-23 — Phase 1: setup & guardrails

### Environment findings (verified)

- Working dir was empty, not a git repo. No Node/npm/pnpm/gh/Docker installed;
  only git 2.43 + Python 3.12. Node installed via **nvm** (no sudo) → Node 20.20.2,
  npm 10.8.2, pnpm 9.15.0 (corepack), gh 2.103.0 (binary → `~/.local/bin`).
- Claude Code Bash tool uses a session shell snapshot, so it does not pick up new
  PATH entries mid-session. Worked around with symlinks in `~/.local/bin` + a PATH
  prefix; `~/.bashrc` patched (before its interactive guard) for future sessions.

### Data-availability research (the decisive finding)

- **No official open API** for ward-wise Delhi public works. Tenders are on the
  official e-procurement portal / third-party aggregators; ward numbers appear in
  tender _title text_, not structured fields.
- `data.gov.in` has only national/aggregate stats for roads/drains/streetlights,
  no live per-asset Delhi dataset (one streetlight resource's API "does not exist").
- **Ward boundary GeoJSON IS available** (OpenCity 2022 MCD delimitation; Datameet
  older). Representatives (MLA/MP/councillor) are curatable but scattered (PRS
  India, ECI, Delhi Assembly, MCD pages).
- **Consequence:** MVP is a human-verified **curated evidence ledger for one ward**,
  not an automated scraper. This matches the product's "never invent / cite
  everything" rules.

### Decisions approved by owner

1. Data approach: **curated verified ledger**, one ward.
2. Product AI: **build-time extraction only, human-verified**; no runtime LLM; no
   API-key cost for MVP.
3. Tooling: **lightweight** — build directly, Tester subagent for meaningful
   features, `/code-review` + `/security-review` as verifier, `gh` CLI +
   Supabase CLI over extra MCP servers.
4. Local setup via nvm — approved.

### Stack locked (versions)

Next.js 16.4.2 · React 19.3.0 · TypeScript 5.9.3 · Tailwind 4.3.3 · ESLint 9 ·
Vitest 2.1.9 · Playwright 1.56.0 · Zod 3.24.1 · prettier 3.4.2.

### Completed

- Scaffolded app at repo root; added Vitest + Playwright configs + sample tests
  (unit: `provenance`; e2e: home smoke).
- Added Prettier, ESLint/Prettier interop, scripts (typecheck/test/test:e2e/format).
- Claude Code hooks written and **verified via fixtures** (block rm -rf / force-push
  main / drop database; advisory-protect acceptance + hook paths; format-on-write;
  session-start status). Hooks are live in-session.
- Docs: CLAUDE.md, FEATURES.md, this log, improve.md. CI workflow + CODEOWNERS.

### Open issues / next action

- Hook _wiring_ confirmed active this session; re-confirm after any Claude Code
  update. CODEOWNERS uses `@OWNER` placeholder — set real username before enabling
  branch protection.
- **Next action:** run the full local check suite (lint/typecheck/test/build +
  install Playwright chromium + e2e), then make the first green commit. Then
  create the GitHub repo + Vercel project (needs owner action/accounts). Then begin
  Phase 2 ward-selection spike.
