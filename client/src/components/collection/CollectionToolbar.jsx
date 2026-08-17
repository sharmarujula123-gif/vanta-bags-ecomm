import { tw } from "../../utils/twStyles.js";
import { ChevronDown, SlidersHorizontal, X } from "lucide-react";

const SORT_OPTIONS = [
  ["newest", "Newest"],
  ["popular", "Popular"],
  ["price_asc", "Price: Low to High"],
  ["price_desc", "Price: High to Low"],
  ["name_asc", "Name: A-Z"],
];

export default function CollectionToolbar({
  title,
  searchInput,
  onSearchInput,
  onSearch,
  onClearSearch,
  sort,
  onSort,
  showFilters,
  onToggleFilters,
  hasFilters,
  resultCount,
}) {
  return (
    <section className={tw("mt-8 mb-10")}>
      <div className={tw(
        "flex flex-col gap-4 rounded-2xl border border-[var(--vanta-border)] bg-[var(--vanta-bg)] p-4 shadow-sm",
      )}>
        <div className={tw("flex flex-col gap-4 lg:flex-row lg:items-center")}>
          <form
            onSubmit={onSearch}
            className={tw(
              "flex h-12 flex-1 overflow-hidden rounded-xl border border-[var(--vanta-border)] bg-[var(--vanta-bg)] focus-within:border-[var(--vanta-text)]",
            )}
          >
            <div className={tw("flex w-12 items-center justify-center text-[var(--vanta-muted)]")}>
              <svg viewBox="0 0 24 24" className={tw("h-5 w-5")} fill="none" stroke="currentColor" strokeWidth="1.8">
                <circle cx="11" cy="11" r="6.5" />
                <path d="m16 16 4.2 4.2" />
              </svg>
            </div>
            <input
              type="search"
              value={searchInput}
              onChange={(e) => onSearchInput(e.target.value)}
              placeholder={`Search ${title.toLowerCase()}...`}
              className={tw("min-w-0 flex-1 bg-transparent px-1 text-sm text-[var(--vanta-text)] outline-none placeholder:text-[var(--vanta-muted)]")}
            />
            {searchInput && (
              <button type="button" onClick={onClearSearch} className={tw("px-3 text-[var(--vanta-muted)]")} aria-label="Clear search">
                <X size={16} />
              </button>
            )}
            <button type="submit" className={tw("my-1 mr-1 rounded-lg bg-[var(--vanta-text)] px-5 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--vanta-bg)]")}>
              Search
            </button>
          </form>

          <div className={tw("flex items-center gap-2")}>
            <button
              type="button"
              onClick={onToggleFilters}
              className={tw("flex h-12 items-center gap-2 rounded-xl border border-[var(--vanta-border)] px-4 text-sm font-medium transition hover:border-[var(--vanta-text)]")}
            >
              <SlidersHorizontal size={17} />
              Filters
              {hasFilters && <span className={tw("flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--vanta-text)] px-1 text-[10px] text-[var(--vanta-bg)]")}>•</span>}
            </button>

            <div className={tw("relative flex h-12 items-center rounded-xl border border-[var(--vanta-border)]")}>
              <span className={tw("hidden px-3 text-xs text-[var(--vanta-muted)] sm:block")}>Sort</span>
              <select value={sort} onChange={(e) => onSort(e.target.value)} className={tw("h-full min-w-[150px] cursor-pointer appearance-none bg-transparent px-4 pr-9 text-sm font-medium outline-none")}>
                {SORT_OPTIONS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
              </select>
              <ChevronDown size={15} className={tw("pointer-events-none absolute right-3 text-[var(--vanta-muted)]")} />
            </div>
          </div>
        </div>

        <div className={tw("flex items-center justify-between border-t border-[var(--vanta-border)] pt-3")}>
          <span className={tw("text-sm text-[var(--vanta-muted)]")}>
            {title} · {resultCount} products
          </span>
          {hasFilters && (
            <button type="button" onClick={onClearSearch} className={tw("text-xs font-semibold uppercase tracking-[0.1em] underline underline-offset-4")}>
              Clear search
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
