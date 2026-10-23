import { SearchBox } from "@/components/SearchBox";
import { IssueCard } from "@/components/IssueCard";
import { getLocality, listIssues } from "@/lib/data/repository";

export default function Home() {
  const locality = getLocality();
  const issues = listIssues();

  return (
    <div className="flex flex-col gap-10">
      <section className="flex flex-col gap-4">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          Who is responsible for public works in your area?
        </h1>
        <p className="max-w-2xl text-muted">
          CivicTrail traces a pending public work to the agency executing it,
          the officials who supervise it, and the elected representatives
          connected to it — with a source and a verification date for every
          claim.
        </p>
        <SearchBox />
        <p className="text-sm text-muted">
          This MVP covers <strong>{locality.name}</strong> (wards{" "}
          {locality.ward_numbers.join(", ")}, PIN{" "}
          {locality.pincodes.join(" / ")}
          ).
        </p>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-foreground">
          Known public works in {locality.name}
        </h2>
        <div className="grid gap-3">
          {issues.map((issue) => (
            <IssueCard key={issue.id} issue={issue} />
          ))}
        </div>
      </section>
    </div>
  );
}
