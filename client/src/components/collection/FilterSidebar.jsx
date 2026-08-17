import { tw } from "../../utils/twStyles.js";
import { getCategoryKey, normalizeKey } from "../../utils/product";
import { ChevronDown, X } from "lucide-react";

export default function FilterSidebar({
  open,
  categories,
  selectedCategory,
  pagination,
  chooseCategory,
  minPrice,
  maxPrice,
  setMinPrice,
  setMaxPrice,
  featured,
  setFeatured,
  priceRange,
  hasFilters,
  resetFilters,
  onClose,
}) {
  const min = Number(minPrice || priceRange.min);
  const max = Number(maxPrice || priceRange.max);
  const position = (value) => ((value - priceRange.min) / (priceRange.max - priceRange.min)) * 100;

  return (
    <aside className={tw(
      `vanta-collection-sidebar ${open ? "is-open" : ""} !rounded-none !border-0 border-r border-[var(--vanta-border)] bg-[var(--vanta-bg)]`,
    )}>
      <div className={tw("vanta-filter-heading border-b border-[var(--vanta-border)]")}>
        <div><p className={tw("vanta-eyebrow")}>Refine</p><h3>Shop Filters</h3></div>
        <button type="button" onClick={onClose} aria-label="Close filters"><X size={17} /></button>
      </div>

      <div className={tw("vanta-filter-block")}>
        <div className={tw("vanta-filter-title")}><span>Category</span><ChevronDown size={14} /></div>
        <label className={tw("vanta-check-row")}>
          <input type="checkbox" checked={!selectedCategory} onChange={() => chooseCategory("")} />
          <span>All Bags</span><small>{pagination.totalProducts}</small>
        </label>
        {categories.map((category) => {
          const key = getCategoryKey(category);
          return (
            <label className={tw("vanta-check-row")} key={category._id || key}>
              <input
                type="checkbox"
                checked={normalizeKey(selectedCategory) === normalizeKey(key)}
                onChange={() => chooseCategory(category)}
              />
              <span>{category.name}</span>
            </label>
          );
        })}
      </div>

      <div className={tw("vanta-filter-block")}>
        <div className={tw("vanta-filter-title")}><span>Price Range</span></div>
        <div className="relative mt-8 px-1">
          <div className="relative h-8">
            <div className="absolute left-0 right-0 top-1/2 h-[2px] -translate-y-1/2 rounded-full bg-[var(--vanta-border)]" />
            <div className="absolute top-1/2 h-[3px] -translate-y-1/2 rounded-full bg-[var(--vanta-text)]" style={{ left: `${position(min)}%`, right: `${100 - position(max)}%` }} />
            <div className="absolute -top-7 -translate-x-1/2 rounded-md bg-[var(--vanta-text)] px-2 py-1 text-[9px] font-semibold text-[var(--vanta-bg)]" style={{ left: `${position(min)}%` }}>₹{min.toLocaleString("en-IN")}</div>
            <div className="absolute -top-7 -translate-x-1/2 rounded-md bg-[var(--vanta-text)] px-2 py-1 text-[9px] font-semibold text-[var(--vanta-bg)]" style={{ left: `${position(max)}%` }}>₹{max.toLocaleString("en-IN")}</div>

            <input
              type="range"
              min={priceRange.min}
              max={priceRange.max}
              step={priceRange.step}
              value={min}
              onChange={(e) => {
                const next = Number(e.target.value);
                if (next <= max) setMinPrice(next);
              }}
              aria-label="Minimum price"
              className="absolute inset-0 z-20 h-full w-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-runnable-track]:bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:mt-[8px] [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[var(--vanta-text)] [&::-webkit-slider-thumb]:bg-[var(--vanta-bg)]"
            />
            <input
              type="range"
              min={priceRange.min}
              max={priceRange.max}
              step={priceRange.step}
              value={max}
              onChange={(e) => {
                const next = Number(e.target.value);
                if (next >= min) setMaxPrice(next);
              }}
              aria-label="Maximum price"
              className="absolute inset-0 z-30 h-full w-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-runnable-track]:bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:mt-[8px] [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[var(--vanta-text)] [&::-webkit-slider-thumb]:bg-[var(--vanta-bg)]"
            />
          </div>
        </div>
      </div>

      <div className={tw("vanta-filter-block")}>
        <div className={tw("vanta-filter-title")}><span>Featured</span><ChevronDown size={14} /></div>
        <label className={tw("vanta-check-row")}>
          <input type="checkbox" checked={featured} onChange={() => setFeatured(!featured)} />
          <span>Featured pieces</span>
        </label>
      </div>

      <button type="button" className={tw("vanta-filter-apply")} onClick={onClose}>Filter</button>
      {hasFilters && <button type="button" className={tw("vanta-filter-clear")} onClick={resetFilters}>Clear all filters</button>}
    </aside>
  );
}
