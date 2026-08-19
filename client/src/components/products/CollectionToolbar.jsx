import { ChevronDown, SlidersHorizontal } from "lucide-react";
import { tw } from "../../utils/twStyles.js";

const CollectionToolbar = ({
  sort,
  setSort,
  setPage,
  hasFilters,
  setShowFilters,
}) => (
  <div className={tw("vanta-collection-toolbar !min-h-[76px] !grid-cols-[1fr_auto] max-[640px]:!grid-cols-[auto_1fr_auto]")}>
    <div className={tw("flex items-center gap-3")}>
      <button
        type="button"
        onClick={() => setShowFilters(true)}
        className={tw("vanta-filter-toggle")}
      >
        <SlidersHorizontal size={15} />
        Filters
        {hasFilters && (
          <span className={tw("ml-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--vanta-text)] px-1 text-[8px] text-[var(--vanta-bg)]")}>
            •
          </span>
        )}
      </button>
    </div>

    <div className={tw("vanta-sort-wrap")}>
      <span>Sort by:</span>
      <select
        value={sort}
        onChange={(event) => {
          setSort(event.target.value);
          setPage(1);
        }}
      >
        <option value="newest">Featured</option>
        <option value="popular">Popular</option>
        <option value="price_asc">Price: Low to High</option>
        <option value="price_desc">Price: High to Low</option>
        <option value="name_asc">Name: A-Z</option>
      </select>
      <ChevronDown size={14} />
    </div>
  </div>
);

export default CollectionToolbar;
