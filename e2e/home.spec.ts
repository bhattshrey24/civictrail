import { test, expect } from "@playwright/test";

/**
 * Phase 1 smoke test: proves the E2E harness, build, and server all work.
 * Feature-level acceptance tests will live under e2e/acceptance/ (a protected
 * path — see .claude/hooks/guard-protected-paths.sh).
 */
test("home page renders with a title", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/.+/);
});
