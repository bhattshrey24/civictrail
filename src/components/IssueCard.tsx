import Link from "next/link";
import type { Issue } from "@/lib/domain/schema";
import { ProvenanceBadge } from "@/components/ProvenanceBadge";
import { STATUS_LABEL, formatInr } from "@/lib/format";

export function IssueCard({ issue }: { issue: Issue }) {
  return (
    <Link
      href={`/issue/${issue.id}`}
      className="block rounded-lg border border-border bg-surface p-4 transition-colors hover:border-brand focus:border-brand focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-semibold text-foreground">{issue.title}</h3>
        <span className="shrink-0 rounded-full bg-surface-2 px-2 py-0.5 text-xs font-medium text-muted">
          {STATUS_LABEL[issue.status]}
        </span>
      </div>
      {issue.description && (
        <p className="mt-1 line-clamp-2 text-sm text-muted">
          {issue.description}
        </p>
      )}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        <ProvenanceBadge
          confidence={issue.confidence}
          evidence={issue.evidence}
        />
        {typeof issue.project?.cost_inr === "number" && (
          <span className="text-sm font-medium text-foreground">
            {formatInr(issue.project.cost_inr)}
          </span>
        )}
      </div>
    </Link>
  );
}
