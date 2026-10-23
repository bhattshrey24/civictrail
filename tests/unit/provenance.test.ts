import { describe, it, expect } from "vitest";
import { daysBetween, isStale, DEFAULT_MAX_AGE_DAYS } from "@/lib/provenance";

describe("provenance freshness", () => {
  const base = new Date("2026-01-01T00:00:00Z");

  it("counts whole days between dates", () => {
    expect(daysBetween(base, new Date("2026-01-11T00:00:00Z"))).toBe(10);
  });

  it("is order-independent", () => {
    const later = new Date("2026-01-11T00:00:00Z");
    expect(daysBetween(later, base)).toBe(10);
  });

  it("treats a recent verification as fresh", () => {
    const verified = new Date("2026-01-01T00:00:00Z");
    const now = new Date("2026-02-01T00:00:00Z"); // 31 days
    expect(isStale(verified, now)).toBe(false);
  });

  it("flags a verification older than the max age as stale", () => {
    const verified = new Date("2026-01-01T00:00:00Z");
    const now = new Date(
      base.getTime() + (DEFAULT_MAX_AGE_DAYS + 1) * 86_400_000,
    );
    expect(isStale(verified, now)).toBe(true);
  });
});
