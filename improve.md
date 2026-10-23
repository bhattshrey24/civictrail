# improve.md — engineering improvements & tech debt

Prioritized by impact × risk. Not all of this is MVP-necessary; it's a backlog.

## High

- **Tighten test/guardrail enforcement.** Branch protection on `main` is live
  (3 required CI checks, strict, no force-push/delete). It is NOT yet maximal:
  `enforce_admins: false` (owner can push directly) and `require_code_owner_reviews:
false` (solo repo — nobody to approve). When a second reviewer exists, set
  `enforce_admins: true` and enable Code Owner reviews so changes to
  `e2e/acceptance/**`, `tests/acceptance/**`, `.claude/hooks/**`, `.github/**`
  genuinely require independent review. CODEOWNERS already lists them.
- **Secrets hygiene — done.** Secret scanning, push protection, and Dependabot
  alerts + security updates are enabled on the repo; gitleaks runs in CI.

## Medium

- **Pin transitive deps / reproducibility.** Lockfile is committed and CI uses
  `--frozen-lockfile`; consider Dependabot for controlled updates.
- **Supabase build-time env.** When the Supabase client lands (Phase 2), make env
  access lazy/guarded so `pnpm build` doesn't require real keys (CI builds without
  secrets). Add RLS integration tests (anon cannot write; anon can only read
  published rows).
- **shadcn/ui (decided: skipped for MVP).** Building accessible Tailwind
  components directly to avoid a Tailwind-v4/Next-16/React-19 init risk. Revisit
  only if a component library clearly earns its keep (e.g. complex dialogs).
- **Next 16 Cache Components (decided: off).** Disabled `cacheComponents` for
  predictable SSG/SSR. If we later want partial prerendering / fine-grained
  caching, re-enable it and wrap dynamic reads (`searchParams`, current time) in
  Suspense or `"use cache"`.
- **Data-quality test suite.** Formalize: every evidence row has a resolving
  `source_url`; no `verified` claim lacks `verified_at`; no `political` basis is
  auto-derived from constituency alone; metric formulas are unit-tested.

## Low

- **Map tiles key.** MapTiler free-tier key needed in Phase 3; self-hosted style is
  a fallback if rate limits bite.
- **PreCompact hook.** Optional: flush key decisions to `docs/ai-log.md` before
  context compaction (the SessionStart hook already reloads them).
- **`pnpm audit` noise.** If high-severity advisories appear in transitive deps
  that can't be fixed quickly, consider a documented allowlist rather than
  disabling the gate.
