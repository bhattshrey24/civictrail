import { test, expect } from "@playwright/test";

/**
 * ACCEPTANCE — Phase 3, journey (a): locality search & project discovery.
 * Protected path (see .claude/hooks/guard-protected-paths.sh): derived from the
 * acceptance criteria, not from the implementation.
 */

test("home lists known public works and offers search", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", {
      name: /who is responsible for public works/i,
    }),
  ).toBeVisible();
  await expect(page.getByRole("search")).toBeVisible();
  // At least one issue card is shown.
  await expect(
    page.getByRole("link", { name: /reconstruction of d k road/i }),
  ).toBeVisible();
});

test("searching the covered ward returns its issues", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("searchbox").fill("Vikaspuri");
  await page.getByRole("button", { name: /search/i }).click();
  await expect(page).toHaveURL(/\/search\?q=Vikaspuri/i);
  await expect(
    page.getByRole("heading", { level: 1, name: /vikaspuri/i }),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: /dark spots/i })).toBeVisible();
});

test("searching an uncovered area shows an honest empty state", async ({
  page,
}) => {
  await page.goto("/search?q=gurgaon");
  await expect(page.getByText(/no data for/i)).toBeVisible();
  await expect(page.getByText(/currently covers only/i)).toBeVisible();
});

test("an issue page shows the responsibility chain with basis and sources", async ({
  page,
}) => {
  await page.goto("/issue/dk-road-reconstruction");
  await expect(
    page.getByRole("heading", { name: /responsibility chain/i }),
  ).toBeVisible();
  // The product rule is stated to the user.
  await expect(
    page.getByText(/constituency is not the same as control/i),
  ).toBeVisible();
  // A direct-responsibility basis badge is present.
  await expect(page.getByText("Direct responsibility").first()).toBeVisible();
  // Evidence links out to a source.
  const sourceLink = page
    .getByRole("link", { name: /publicservicesmap\.in/i })
    .first();
  await expect(sourceLink).toHaveAttribute("href", /^https:\/\//);
});
