/** Presentation helpers. Pure, deterministic — safe to unit-test. */
import type {
  ConfidenceLevel,
  IssueStatus,
  ResponsibilityBasis,
} from "@/lib/domain/schema";

/** Format an amount in INR with the Indian numbering grouping. */
export function formatInr(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

/** Human-readable ISO date, e.g. "23 Oct 2026". Returns "" for empty input. */
export function formatIsoDate(iso?: string): string {
  if (!iso) return "";
  const d = new Date(`${iso}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(d);
}

export const CONFIDENCE_LABEL: Record<ConfidenceLevel, string> = {
  verified: "Verified",
  inferred: "Inferred",
  unverified: "Unverified",
};

/** Tailwind classes using the confidence token colours (text label is required). */
export const CONFIDENCE_CLASS: Record<ConfidenceLevel, string> = {
  verified: "bg-ok-bg text-ok",
  inferred: "bg-warn-bg text-warn",
  unverified: "bg-neutral-bg text-neutral",
};

export const BASIS_LABEL: Record<ResponsibilityBasis, string> = {
  direct: "Direct responsibility",
  oversight: "Administrative oversight",
  political: "Political accountability",
  shared: "Shared / overlapping",
  unclear: "Unclear",
};

export const BASIS_CLASS: Record<ResponsibilityBasis, string> = {
  direct: "bg-ok-bg text-ok",
  oversight: "bg-warn-bg text-warn",
  political: "bg-neutral-bg text-neutral",
  shared: "bg-warn-bg text-warn",
  unclear: "bg-neutral-bg text-neutral",
};

export const STATUS_LABEL: Record<IssueStatus, string> = {
  pending: "Pending",
  in_progress: "In progress",
  completed: "Completed",
  unclear: "Status unclear",
};
