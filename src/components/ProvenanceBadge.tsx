import type { ConfidenceLevel, Evidence } from "@/lib/domain/schema";
import { isStale } from "@/lib/provenance";
import {
  CONFIDENCE_CLASS,
  CONFIDENCE_LABEL,
  formatIsoDate,
} from "@/lib/format";

function latestVerifiedAt(evidence: Evidence[]): string | undefined {
  if (evidence.length === 0) return undefined;
  return evidence.map((e) => e.verified_at).sort()[evidence.length - 1];
}

/**
 * Shows how much a claim is trusted (verified/inferred/unverified) and how fresh
 * its verification is. Confidence is conveyed with a text label, never colour
 * alone (accessibility).
 */
export function ProvenanceBadge({
  confidence,
  evidence,
}: {
  confidence: ConfidenceLevel;
  evidence: Evidence[];
}) {
  const verifiedAt = latestVerifiedAt(evidence);
  const stale = verifiedAt
    ? isStale(new Date(`${verifiedAt}T00:00:00Z`))
    : false;

  return (
    <span className="inline-flex flex-wrap items-center gap-1.5 text-xs">
      <span
        className={`rounded-full px-2 py-0.5 font-medium ${CONFIDENCE_CLASS[confidence]}`}
      >
        {CONFIDENCE_LABEL[confidence]}
      </span>
      {verifiedAt ? (
        <span className="text-muted">
          Last verified {formatIsoDate(verifiedAt)}
        </span>
      ) : (
        <span className="text-muted">No source on record</span>
      )}
      {stale && (
        <span className="rounded-full bg-danger-bg px-2 py-0.5 font-medium text-danger">
          Needs re-verification
        </span>
      )}
    </span>
  );
}
