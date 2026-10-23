import type { Evidence } from "@/lib/domain/schema";
import { formatIsoDate } from "@/lib/format";

/** Lists supporting sources for a claim, with provenance + dates. */
export function EvidenceList({ evidence }: { evidence: Evidence[] }) {
  if (evidence.length === 0) {
    return (
      <p className="text-sm text-muted">
        No source on record — responsibility or status could not be confirmed.
      </p>
    );
  }
  return (
    <ul className="flex flex-col gap-2">
      {evidence.map((e, i) => (
        <li
          key={`${e.source_url}-${i}`}
          className="rounded-md border border-border bg-surface-2 p-3 text-sm"
        >
          <div className="flex flex-wrap items-center gap-2">
            <a
              href={e.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-brand underline underline-offset-2 break-all"
            >
              {hostOf(e.source_url)}
            </a>
            {e.is_official ? (
              <span className="rounded-full bg-ok-bg px-2 py-0.5 text-xs font-medium text-ok">
                Official source
              </span>
            ) : (
              <span className="rounded-full bg-neutral-bg px-2 py-0.5 text-xs font-medium text-neutral">
                Supplementary
              </span>
            )}
          </div>
          {e.excerpt && <p className="mt-1 text-muted">{e.excerpt}</p>}
          <p className="mt-1 text-xs text-muted">
            {e.source_date && (
              <>Source dated {formatIsoDate(e.source_date)} · </>
            )}
            Verified {formatIsoDate(e.verified_at)}
          </p>
        </li>
      ))}
    </ul>
  );
}

function hostOf(url: string): string {
  try {
    return new URL(url).host;
  } catch {
    return url;
  }
}
