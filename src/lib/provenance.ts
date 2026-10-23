/**
 * Deterministic data-provenance / freshness helpers.
 *
 * CivicTrail rule: every claim-bearing record carries a `verified_at` date, and
 * the UI must show how fresh that verification is. This logic is intentionally
 * kept OUT of any LLM — freshness is a deterministic calculation, never a model
 * judgement. See CLAUDE.md ("Evidence rules").
 */

/** A verified fact older than this many days is considered stale by default. */
export const DEFAULT_MAX_AGE_DAYS = 180;

/** Whole days between two dates (order-independent). */
export function daysBetween(a: Date, b: Date): number {
  const ms = Math.abs(b.getTime() - a.getTime());
  return Math.floor(ms / 86_400_000);
}

/**
 * True when a verified fact is older than `maxAgeDays` and should be flagged
 * for re-verification in the UI.
 */
export function isStale(
  verifiedAt: Date,
  now: Date = new Date(),
  maxAgeDays: number = DEFAULT_MAX_AGE_DAYS,
): boolean {
  return daysBetween(verifiedAt, now) > maxAgeDays;
}
