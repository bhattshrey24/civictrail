import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getAsset,
  getIssue,
  listIssues,
  resolveParty,
} from "@/lib/data/repository";
import type { Responsibility } from "@/lib/domain/schema";
import { ProvenanceBadge } from "@/components/ProvenanceBadge";
import { EvidenceList } from "@/components/EvidenceList";
import {
  BASIS_CLASS,
  BASIS_LABEL,
  STATUS_LABEL,
  formatInr,
  formatIsoDate,
} from "@/lib/format";

export function generateStaticParams() {
  return listIssues().map((i) => ({ id: i.id }));
}

export default async function IssuePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const issue = getIssue(id);
  if (!issue) notFound();

  const asset = getAsset(issue.asset_id);
  const project = issue.project;

  return (
    <article className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <Link
          href="/"
          className="text-sm text-brand underline underline-offset-2"
        >
          ← All public works
        </Link>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            {issue.title}
          </h1>
          <span className="rounded-full bg-surface-2 px-2.5 py-1 text-xs font-medium text-muted">
            {STATUS_LABEL[issue.status]}
          </span>
        </div>
        {issue.description && <p className="text-muted">{issue.description}</p>}
        <ProvenanceBadge
          confidence={issue.confidence}
          evidence={issue.evidence}
        />
      </div>

      {asset && (
        <section className="rounded-lg border border-border bg-surface p-4">
          <h2 className="text-sm font-semibold text-muted uppercase tracking-wide">
            Asset
          </h2>
          <p className="mt-1 font-medium text-foreground">{asset.name}</p>
          {asset.description && (
            <p className="text-sm text-muted">{asset.description}</p>
          )}
        </section>
      )}

      {project && (
        <section className="flex flex-col gap-3">
          <h2 className="text-lg font-semibold text-foreground">
            Project &amp; timeline
          </h2>
          <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field label="Tender reference" value={project.tender_ref} />
            <Field
              label="Estimated cost"
              value={
                typeof project.cost_inr === "number"
                  ? formatInr(project.cost_inr)
                  : undefined
              }
            />
            <Field label="Contractor" value={project.contractor} />
            <Field label="Deadline" value={formatIsoDate(project.deadline)} />
            <Field label="Progress" value={project.progress_note} />
            <Field label="Delays" value={project.delay_note} />
          </dl>
        </section>
      )}

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold text-foreground">
          Responsibility chain
        </h2>
        <p className="text-sm text-muted">
          A representative&rsquo;s constituency is not the same as control. Each
          link below states the basis and the reasoning, with sources.
        </p>
        <div className="flex flex-col gap-4">
          {issue.responsibilities.map((r) => (
            <ResponsibilityBlock key={r.id} responsibility={r} />
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold text-foreground">
          Sources for this issue
        </h2>
        <EvidenceList evidence={issue.evidence} />
      </section>
    </article>
  );
}

function Field({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <div className="rounded-md border border-border bg-surface-2 p-3">
      <dt className="text-xs font-medium text-muted uppercase tracking-wide">
        {label}
      </dt>
      <dd className="mt-0.5 text-sm text-foreground">{value}</dd>
    </div>
  );
}

function ResponsibilityBlock({
  responsibility: r,
}: {
  responsibility: Responsibility;
}) {
  const resolved = resolveParty(r.party_type, r.party_id);

  const partyName = resolved ? resolved.party.name : `Unknown ${r.party_type}`;

  let subtitle = "";
  let escalationUrl: string | undefined;
  if (resolved?.party_type === "agency") {
    subtitle = resolved.party.role;
    escalationUrl = resolved.party.escalation_url ?? resolved.party.contact_url;
  } else if (resolved?.party_type === "official") {
    subtitle = resolved.party.designation;
  } else if (resolved?.party_type === "representative") {
    const p = resolved.party;
    const term = p.term_start
      ? `${formatIsoDate(p.term_start)} – ${p.term_end ? formatIsoDate(p.term_end) : "present"}`
      : p.term_end
        ? `until ${formatIsoDate(p.term_end)}`
        : "";
    subtitle = [p.type, p.party, term].filter(Boolean).join(" · ");
  }

  return (
    <div className="rounded-lg border border-border bg-surface p-4">
      <div className="flex flex-wrap items-center gap-2">
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-medium ${BASIS_CLASS[r.basis]}`}
        >
          {BASIS_LABEL[r.basis]}
        </span>
        <span className="font-semibold text-foreground">{partyName}</span>
      </div>
      {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
      <p className="mt-2 text-sm text-foreground">{r.reasoning}</p>
      <div className="mt-2">
        <ProvenanceBadge confidence={r.confidence} evidence={r.evidence} />
      </div>
      {escalationUrl && (
        <a
          href={escalationUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-block text-sm font-medium text-brand underline underline-offset-2"
        >
          Complaint / escalation channel →
        </a>
      )}
      {r.evidence.length > 0 && (
        <div className="mt-3">
          <EvidenceList evidence={r.evidence} />
        </div>
      )}
    </div>
  );
}
