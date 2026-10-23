/** Search by PIN code, ward number, or locality. A plain GET form → /search. */
export function SearchBox({ defaultValue = "" }: { defaultValue?: string }) {
  return (
    <form
      action="/search"
      method="get"
      role="search"
      className="flex w-full flex-col gap-2 sm:flex-row"
    >
      <label htmlFor="q" className="sr-only">
        PIN code, ward number, or locality
      </label>
      <input
        id="q"
        name="q"
        type="search"
        defaultValue={defaultValue}
        placeholder="PIN code, ward number, or locality (e.g. 110018, 114, Vikaspuri)"
        className="w-full rounded-md border border-border bg-surface px-4 py-2.5 text-foreground placeholder:text-muted focus:border-brand focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
      />
      <button
        type="submit"
        className="rounded-md bg-brand px-5 py-2.5 font-medium text-brand-foreground transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
      >
        Search
      </button>
    </form>
  );
}
