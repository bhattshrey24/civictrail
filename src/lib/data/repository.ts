/**
 * Data-access layer. The UI imports ONLY from here, never from the seed file
 * directly — so when the data source moves to Supabase/Postgres, only this module
 * changes. The dataset is validated at import time, so invalid data fails fast
 * (and fails the build) rather than rendering wrong facts.
 */
import { loadDataset } from "@/lib/domain/validate";
import { vikaspuri } from "@/data/vikaspuri";
import type {
  Agency,
  Asset,
  Dataset,
  Issue,
  Official,
  PartyType,
  Representative,
} from "@/lib/domain/schema";

const dataset: Dataset = loadDataset(vikaspuri);

export function getLocality() {
  return dataset.locality;
}

export function listIssues(): Issue[] {
  return dataset.issues;
}

export function getIssue(id: string): Issue | undefined {
  return dataset.issues.find((i) => i.id === id);
}

export function getAsset(id: string): Asset | undefined {
  return dataset.assets.find((a) => a.id === id);
}

export function getAgency(id: string): Agency | undefined {
  return dataset.agencies.find((a) => a.id === id);
}

export function getOfficial(id: string): Official | undefined {
  return dataset.officials.find((o) => o.id === id);
}

export function getRepresentative(id: string): Representative | undefined {
  return dataset.representatives.find((r) => r.id === id);
}

export type ResolvedParty =
  | { party_type: "agency"; party: Agency }
  | { party_type: "official"; party: Official }
  | { party_type: "representative"; party: Representative };

/** Resolve a responsibility's party reference to the actual record. */
export function resolveParty(
  party_type: PartyType,
  party_id: string,
): ResolvedParty | undefined {
  if (party_type === "agency") {
    const party = getAgency(party_id);
    return party && { party_type, party };
  }
  if (party_type === "official") {
    const party = getOfficial(party_id);
    return party && { party_type, party };
  }
  const party = getRepresentative(party_id);
  return party && { party_type, party };
}

/**
 * Does this locality match a free-text query (pincode, ward number, or name)?
 * Deterministic — no fuzzy/LLM matching.
 */
export function localityMatches(query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return false;
  const l = dataset.locality;
  if (l.name.toLowerCase().includes(q)) return true;
  if (l.pincodes.some((p) => p === q)) return true;
  if (l.ward_numbers.some((w) => String(w) === q)) return true;
  if (l.assembly_constituency?.toLowerCase().includes(q)) return true;
  return false;
}
