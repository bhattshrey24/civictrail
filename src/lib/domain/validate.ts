/**
 * Dataset validation: Zod shape + evidence rules + referential integrity.
 *
 * This runs over the curated seed data in tests (and can run at load time), so a
 * record that breaks an evidence rule fails loudly instead of shipping.
 */
import { Dataset, type Dataset as DatasetT } from "./schema";

export interface ValidationIssue {
  path: string;
  message: string;
}

/** Bases that assert real responsibility and therefore must cite evidence. */
const EVIDENCE_REQUIRED_BASES = new Set(["direct", "oversight", "political"]);

export function validateDataset(raw: unknown): {
  data?: DatasetT;
  issues: ValidationIssue[];
} {
  const parsed = Dataset.safeParse(raw);
  if (!parsed.success) {
    return {
      issues: parsed.error.issues.map((i) => ({
        path: i.path.join("."),
        message: i.message,
      })),
    };
  }

  const d = parsed.data;
  const issues: ValidationIssue[] = [];

  const agencyIds = new Set(d.agencies.map((a) => a.id));
  const officialIds = new Set(d.officials.map((o) => o.id));
  const repIds = new Set(d.representatives.map((r) => r.id));
  const assetIds = new Set(d.assets.map((a) => a.id));

  const poolFor = (partyType: string) =>
    partyType === "agency"
      ? agencyIds
      : partyType === "official"
        ? officialIds
        : repIds;

  for (const o of d.officials) {
    if (!agencyIds.has(o.agency_id)) {
      issues.push({
        path: `officials.${o.id}.agency_id`,
        message: `unknown agency '${o.agency_id}'`,
      });
    }
  }

  for (const a of d.assets) {
    if (a.locality_id !== d.locality.id) {
      issues.push({
        path: `assets.${a.id}.locality_id`,
        message: `asset is not in locality '${d.locality.id}'`,
      });
    }
    if (a.owner_agency_id && !agencyIds.has(a.owner_agency_id)) {
      issues.push({
        path: `assets.${a.id}.owner_agency_id`,
        message: `unknown owner agency '${a.owner_agency_id}'`,
      });
    }
  }

  for (const issue of d.issues) {
    if (!assetIds.has(issue.asset_id)) {
      issues.push({
        path: `issues.${issue.id}.asset_id`,
        message: `unknown asset '${issue.asset_id}'`,
      });
    }
    for (const r of issue.responsibilities) {
      if (!poolFor(r.party_type).has(r.party_id)) {
        issues.push({
          path: `issues.${issue.id}.responsibilities.${r.id}.party_id`,
          message: `unknown ${r.party_type} '${r.party_id}'`,
        });
      }
      if (EVIDENCE_REQUIRED_BASES.has(r.basis) && r.evidence.length === 0) {
        issues.push({
          path: `issues.${issue.id}.responsibilities.${r.id}`,
          message: `basis '${r.basis}' requires at least one piece of evidence (a representative's constituency alone is not evidence of control)`,
        });
      }
    }
  }

  return { data: d, issues };
}

/** Parse + validate, throwing a readable error if anything is wrong. */
export function loadDataset(raw: unknown): DatasetT {
  const { data, issues } = validateDataset(raw);
  if (!data || issues.length > 0) {
    throw new Error(
      "Invalid CivicTrail dataset:\n" +
        issues.map((i) => `  - ${i.path}: ${i.message}`).join("\n"),
    );
  }
  return data;
}
