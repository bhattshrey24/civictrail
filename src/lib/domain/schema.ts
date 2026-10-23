/**
 * CivicTrail domain schema (Zod).
 *
 * This is the single source of truth for the shape AND the evidence rules of
 * every record. The Postgres migration (supabase/migrations) mirrors it, and all
 * seed data is validated against it. See CLAUDE.md "The evidence rules".
 *
 * Core principles encoded here:
 *  - Every claim-bearing record carries >= 1 piece of Evidence and a confidence.
 *  - Responsibility has an explicit `basis` (constituency != control).
 *  - Officials/representatives are time-bounded.
 *  - Nothing here stores an AI summary AS evidence.
 */
import { z } from "zod";

/** A stable, human-readable id (slug). */
export const Id = z
  .string()
  .min(1)
  .regex(/^[a-z0-9][a-z0-9-]*$/, "id must be a lowercase slug");

/** ISO date (YYYY-MM-DD). Kept as a string for stable serialization. */
export const IsoDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "expected an ISO date (YYYY-MM-DD)");

/** How much we trust a given fact. Never blur these. */
export const ConfidenceLevel = z.enum(["verified", "inferred", "unverified"]);
export type ConfidenceLevel = z.infer<typeof ConfidenceLevel>;

/**
 * A single piece of supporting evidence. `is_official` marks a primary/official
 * source (outranks third-party). AI summaries must NEVER be recorded as evidence.
 */
export const Evidence = z.object({
  source_url: z.string().url(),
  /** When the source itself was published/dated. */
  source_date: IsoDate.optional(),
  /** When a human last checked this source still supports the claim. */
  verified_at: IsoDate,
  excerpt: z.string().min(1).max(1000).optional(),
  /** True for a primary/official source; absent/false = supplementary. */
  is_official: z.boolean().optional(),
});
export type Evidence = z.infer<typeof Evidence>;

/**
 * Mixin for a claim-bearing record: a confidence level plus its evidence.
 * A `verified` claim must have at least one piece of evidence.
 */
const claim = {
  confidence: ConfidenceLevel,
  evidence: z.array(Evidence).default([]),
};

const claimRefine = <
  T extends { confidence: ConfidenceLevel; evidence: Evidence[] },
>(
  v: T,
  ctx: z.RefinementCtx,
) => {
  if (v.confidence === "verified" && v.evidence.length === 0) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "a 'verified' claim must carry at least one piece of evidence",
      path: ["evidence"],
    });
  }
};

// --- Enums ---------------------------------------------------------------

export const AgencyKind = z.enum([
  "MCD", // Municipal Corporation of Delhi
  "PWD", // Public Works Department (GNCTD)
  "DJB", // Delhi Jal Board
  "IFC", // Irrigation & Flood Control
  "DDA", // Delhi Development Authority
  "NDMC",
  "DISCOM",
  "OTHER",
]);
export type AgencyKind = z.infer<typeof AgencyKind>;

export const AssetType = z.enum([
  "road",
  "drain",
  "streetlight",
  "project",
  "other",
]);
export type AssetType = z.infer<typeof AssetType>;

export const IssueStatus = z.enum([
  "pending",
  "in_progress",
  "completed",
  "unclear",
]);
export type IssueStatus = z.infer<typeof IssueStatus>;

export const RepresentativeType = z.enum(["MP", "MLA", "councillor"]);
export type RepresentativeType = z.infer<typeof RepresentativeType>;

/** The nature of a party's link to an issue. Constituency != control. */
export const ResponsibilityBasis = z.enum([
  "direct", // formally assigned to execute the work
  "oversight", // supervises the relevant function (verified jurisdiction)
  "political", // documented formal powers / decisions / oversight
  "shared", // multiple agencies / overlapping jurisdiction
  "unclear", // insufficient evidence
]);
export type ResponsibilityBasis = z.infer<typeof ResponsibilityBasis>;

export const PartyType = z.enum(["agency", "official", "representative"]);
export type PartyType = z.infer<typeof PartyType>;

// --- Entities ------------------------------------------------------------

export const Locality = z.object({
  id: Id,
  name: z.string().min(1),
  /** MCD ward numbers covered by this locality. */
  ward_numbers: z.array(z.number().int().positive()).default([]),
  assembly_constituency: z.string().optional(),
  parliamentary_constituency: z.string().optional(),
  pincodes: z.array(z.string().regex(/^\d{6}$/)).default([]),
});
export type Locality = z.infer<typeof Locality>;

export const Agency = z
  .object({
    id: Id,
    name: z.string().min(1),
    kind: AgencyKind,
    /** What this agency is responsible for, in this context. */
    role: z.string().min(1),
    contact_url: z.string().url().optional(),
    /** Where a citizen lodges a complaint / escalates. */
    escalation_url: z.string().url().optional(),
    ...claim,
  })
  .superRefine(claimRefine);
export type Agency = z.infer<typeof Agency>;

export const Official = z
  .object({
    id: Id,
    agency_id: Id,
    name: z.string().min(1),
    designation: z.string().min(1),
    term_start: IsoDate.optional(),
    term_end: IsoDate.optional(),
    ...claim,
  })
  .superRefine(claimRefine);
export type Official = z.infer<typeof Official>;

export const Representative = z
  .object({
    id: Id,
    type: RepresentativeType,
    name: z.string().min(1),
    constituency: z.string().min(1),
    party: z.string().optional(),
    term_start: IsoDate.optional(),
    term_end: IsoDate.optional(),
    ...claim,
  })
  .superRefine(claimRefine);
export type Representative = z.infer<typeof Representative>;

export const Asset = z
  .object({
    id: Id,
    locality_id: Id,
    type: AssetType,
    name: z.string().min(1),
    description: z.string().optional(),
    /** The agency that owns the asset (may differ from who executes a repair). */
    owner_agency_id: Id.optional(),
    ...claim,
  })
  .superRefine(claimRefine);
export type Asset = z.infer<typeof Asset>;

export const Project = z.object({
  id: Id,
  tender_ref: z.string().optional(),
  contractor: z.string().optional(),
  /** Cost in INR. */
  cost_inr: z.number().nonnegative().optional(),
  deadline: IsoDate.optional(),
  progress_note: z.string().optional(),
  delay_note: z.string().optional(),
});
export type Project = z.infer<typeof Project>;

/**
 * A link between an issue and a responsible party, with an explicit basis and
 * the reasoning. This is where "constituency != control" is enforced in review.
 */
export const Responsibility = z
  .object({
    id: Id,
    party_type: PartyType,
    party_id: Id,
    basis: ResponsibilityBasis,
    reasoning: z.string().min(1),
    ...claim,
  })
  .superRefine(claimRefine);
export type Responsibility = z.infer<typeof Responsibility>;

export const Issue = z
  .object({
    id: Id,
    asset_id: Id,
    title: z.string().min(1),
    description: z.string().optional(),
    status: IssueStatus,
    project: Project.optional(),
    responsibilities: z.array(Responsibility).default([]),
    ...claim,
  })
  .superRefine(claimRefine);
export type Issue = z.infer<typeof Issue>;

/** The full seed dataset for a locality. */
export const Dataset = z.object({
  locality: Locality,
  agencies: z.array(Agency).default([]),
  officials: z.array(Official).default([]),
  representatives: z.array(Representative).default([]),
  assets: z.array(Asset).default([]),
  issues: z.array(Issue).default([]),
});
export type Dataset = z.infer<typeof Dataset>;
