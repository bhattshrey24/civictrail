import { describe, it, expect } from "vitest";
import { validateDataset, loadDataset } from "@/lib/domain/validate";
import { Evidence } from "@/lib/domain/schema";
import { vikaspuri } from "@/data/vikaspuri";

describe("vikaspuri seed dataset — data quality", () => {
  it("passes full schema + referential + evidence-rule validation", () => {
    const { issues } = validateDataset(vikaspuri);
    expect(issues).toEqual([]);
    expect(() => loadDataset(vikaspuri)).not.toThrow();
  });

  it("every piece of evidence has a valid URL and a verification date", () => {
    const all = [
      ...vikaspuri.agencies,
      ...vikaspuri.officials,
      ...vikaspuri.representatives,
      ...vikaspuri.assets,
      ...vikaspuri.issues,
      ...vikaspuri.issues.flatMap((i) => i.responsibilities),
    ];
    for (const record of all) {
      for (const e of record.evidence) {
        expect(() => Evidence.parse(e)).not.toThrow();
        expect(e.source_url.startsWith("http")).toBe(true);
        expect(e.verified_at).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      }
    }
  });

  it("no 'verified' claim is missing evidence", () => {
    const all = [
      ...vikaspuri.agencies,
      ...vikaspuri.representatives,
      ...vikaspuri.assets,
      ...vikaspuri.issues,
      ...vikaspuri.issues.flatMap((i) => i.responsibilities),
    ];
    for (const record of all) {
      if (record.confidence === "verified") {
        expect(record.evidence.length).toBeGreaterThan(0);
      }
    }
  });

  it("models officeholder change over time (a former + a current MLA)", () => {
    const vikaspuriMlas = vikaspuri.representatives.filter(
      (r) => r.type === "MLA",
    );
    expect(vikaspuriMlas.some((r) => r.term_end)).toBe(true);
    expect(vikaspuriMlas.some((r) => r.term_start && !r.term_end)).toBe(true);
  });
});

describe("evidence-rule enforcement (negative cases)", () => {
  it("rejects a 'political' responsibility asserted with no evidence", () => {
    const bad = structuredClone(vikaspuri) as typeof vikaspuri;
    bad.issues[0].responsibilities.push({
      id: "bogus-political",
      party_type: "representative",
      party_id: "mla-vikaspuri-2025",
      basis: "political",
      reasoning: "represents the area", // constituency alone — not control
      confidence: "inferred",
      evidence: [],
    });
    const { issues } = validateDataset(bad);
    expect(
      issues.some((i) => i.message.includes("requires at least one piece")),
    ).toBe(true);
  });

  it("rejects a 'verified' claim with no evidence", () => {
    const bad = structuredClone(vikaspuri) as typeof vikaspuri;
    bad.agencies.push({
      id: "ghost-agency",
      name: "Ghost Agency",
      kind: "OTHER",
      role: "unsourced",
      confidence: "verified",
      evidence: [],
    });
    const { issues } = validateDataset(bad);
    expect(issues.length).toBeGreaterThan(0);
  });

  it("rejects a responsibility pointing at an unknown party", () => {
    const bad = structuredClone(vikaspuri) as typeof vikaspuri;
    bad.issues[0].responsibilities.push({
      id: "dangling",
      party_type: "agency",
      party_id: "does-not-exist",
      basis: "direct",
      reasoning: "x",
      confidence: "verified",
      evidence: [
        {
          source_url: "https://example.gov.in",
          verified_at: "2026-10-23",
          is_official: true,
        },
      ],
    });
    const { issues } = validateDataset(bad);
    expect(issues.some((i) => i.message.includes("unknown agency"))).toBe(true);
  });
});
