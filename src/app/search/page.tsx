import { SearchBox } from "@/components/SearchBox";
import { IssueCard } from "@/components/IssueCard";
import {
  getLocality,
  listIssues,
  localityMatches,
} from "@/lib/data/repository";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string | string[] }>;
}) {
  const sp = await searchParams;
  const raw = Array.isArray(sp.q) ? (sp.q[0] ?? "") : (sp.q ?? "");
  const query = raw.trim();
  const locality = getLocality();
  const matched = query !== "" && localityMatches(query);

  return (
    <div className="flex flex-col gap-8">
      <SearchBox defaultValue={query} />

      {query === "" ? (
        <p className="text-muted">
          Enter a PIN code, ward number, or locality to search.
        </p>
      ) : matched ? (
        <section className="flex flex-col gap-4">
          <div>
            <h1 className="text-xl font-semibold text-foreground">
              {locality.name}
            </h1>
            <p className="text-sm text-muted">
              Assembly: {locality.assembly_constituency} · Lok Sabha:{" "}
              {locality.parliamentary_constituency} · Wards{" "}
              {locality.ward_numbers.join(", ")}
            </p>
          </div>
          <div className="grid gap-3">
            {listIssues().map((issue) => (
              <IssueCard key={issue.id} issue={issue} />
            ))}
          </div>
        </section>
      ) : (
        <section className="rounded-lg border border-border bg-surface p-6">
          <h1 className="text-lg font-semibold text-foreground">
            No data for “{query}” yet
          </h1>
          <p className="mt-2 text-muted">
            This MVP currently covers only <strong>{locality.name}</strong>{" "}
            (wards {locality.ward_numbers.join(", ")}, PIN{" "}
            {locality.pincodes.join(" / ")}). Try searching for that ward.
          </p>
        </section>
      )}
    </div>
  );
}
