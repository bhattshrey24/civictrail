import { describe, it, expect } from "vitest";
import {
  getIssue,
  listIssues,
  resolveParty,
  localityMatches,
  getLocality,
} from "@/lib/data/repository";

describe("repository", () => {
  it("loads the validated locality and issues", () => {
    expect(getLocality().id).toBe("vikaspuri");
    expect(listIssues().length).toBeGreaterThan(0);
  });

  it("resolves every responsibility party to a real record", () => {
    for (const issue of listIssues()) {
      for (const r of issue.responsibilities) {
        const resolved = resolveParty(r.party_type, r.party_id);
        expect(resolved, `${issue.id}/${r.id}`).toBeDefined();
      }
    }
  });

  it("matches the locality by name, pincode and ward number", () => {
    expect(localityMatches("vikaspuri")).toBe(true);
    expect(localityMatches("110018")).toBe(true);
    expect(localityMatches("114")).toBe(true);
    expect(localityMatches("gurgaon")).toBe(false);
  });

  it("returns undefined for an unknown issue id", () => {
    expect(getIssue("nope")).toBeUndefined();
  });
});
