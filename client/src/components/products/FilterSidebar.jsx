import { ChevronDown, X } from "lucide-react";
import { tw } from "../../utils/twStyles.js";
import {
  normalizeCategoryKey,
  getCategoryId,
  getCategoryKey,
} from "../../utils/productHelpers.js";

const FilterSidebar = ({
  showFilters,
  setShowFilters,
  selectedCategory,
  parentCategory,
  categories,
  siblingCategories = [],
  chooseCategory,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  colorFilter,
  setColorFilter,
  materialFilter,
  setMaterialFilter,
  featured,
  setFeatured,
  hasFilters,
  resetFilters,
  PRICE_MIN,
  PRICE_MAX,
  PRICE_STEP,
}) => {
  const categoryScope = parentCategory || null;

  return (
    <aside
      className={tw(
        `vanta-collection-sidebar !z-[101] ${
          showFilters ? "is-open" : ""
        }`
      )}
    >
      {/* Header */}
      <div className={tw("vanta-filter-heading")}>
        <div>
          <h3>Filters</h3>
        </div>

        <button
          type="button"
          onClick={() => setShowFilters(false)}
          aria-label="Close filters"
        >
          <X size={17} />
        </button>
      </div>

      {/* Category */}
      <div className={tw("vanta-filter-block")}>
        <div className={tw("vanta-filter-title")}>
          <span>Category</span>
          {/* <ChevronDown size={13} /> */}
        </div>

        {/* All categories / parent */}
        <label className={tw("vanta-check-row")}>
          <input
            type="radio"
            name="category"
            checked={
              !selectedCategory ||
              (!!parentCategory &&
                normalizeCategoryKey(selectedCategory) ===
                  normalizeCategoryKey(
                    parentCategory.slug || parentCategory.name
                  ))
            }
            onChange={() =>
              chooseCategory(parentCategory || "")
            }
          />

          <span>
            All {categoryScope?.name || "Collections"}
          </span>
        </label>

        {/* Child / sibling categories */}
        {siblingCategories.map((category) => {
          const key = getCategoryKey(category);

          return (
            <label
              className={tw("vanta-check-row")}
              key={getCategoryId(category) || key}
            >
              <input
                type="radio"
                name="category"
                checked={
                  normalizeCategoryKey(selectedCategory) ===
                  normalizeCategoryKey(key)
                }
                onChange={() => chooseCategory(category)}
              />

              <span>{category.name}</span>
            </label>
          );
        })}
      </div>

      {/* Price */}
      <div className={tw("vanta-filter-block")}>
        <div className={tw("vanta-filter-title")}>
          <span>Price Range</span>
          <ChevronDown size={13} />
        </div>

        <div className={tw("vanta-price-labels")}>
          <span>
            ₹
            {Number(minPrice || PRICE_MIN).toLocaleString("en-IN")}
          </span>

          <span>
            ₹
            {Number(maxPrice || PRICE_MAX).toLocaleString("en-IN")}
          </span>
        </div>

        <div className="relative mt-2 h-7">
          <div className="absolute left-0 right-0 top-1/2 h-[2px] -translate-y-1/2 bg-[var(--vanta-border)]" />

          <div
            className="absolute top-1/2 h-[3px] -translate-y-1/2 bg-[var(--vanta-text)]"
            style={{
              left: `${
                ((Number(minPrice || PRICE_MIN) - PRICE_MIN) /
                  (PRICE_MAX - PRICE_MIN)) *
                100
              }%`,
              right: `${
                100 -
                ((Number(maxPrice || PRICE_MAX) - PRICE_MIN) /
                  (PRICE_MAX - PRICE_MIN)) *
                  100
              }%`,
            }}
          />

          <input
            type="range"
            min={PRICE_MIN}
            max={PRICE_MAX}
            step={PRICE_STEP}
            value={Number(minPrice || PRICE_MIN)}
            onChange={(event) => {
              const value = Number(event.target.value);

              if (value <= Number(maxPrice || PRICE_MAX)) {
                setMinPrice(value);
              }
            }}
            className={tw("vanta-range-input")}
            aria-label="Minimum price"
          />

          <input
            type="range"
            min={PRICE_MIN}
            max={PRICE_MAX}
            step={PRICE_STEP}
            value={Number(maxPrice || PRICE_MAX)}
            onChange={(event) => {
              const value = Number(event.target.value);

              if (value >= Number(minPrice || PRICE_MIN)) {
                setMaxPrice(value);
              }
            }}
            className={tw("vanta-range-input max")}
            aria-label="Maximum price"
          />
        </div>
      </div>

      {/* Color */}
      <div className={tw("vanta-filter-block")}>
        <div className={tw("vanta-filter-title")}>
          <span>Color</span>
          <ChevronDown size={13} />
        </div>

        <div className={tw("vanta-color-swatches")}>
          {[
            ["Black", "#111111"],
            ["Brown", "#6a4529"],
            ["Tan", "#bd8d55"],
            ["Cream", "#e5dccd"],
            ["Grey", "#b9b8b4"],
            ["Green", "#17694e"],
            ["Pink", "#d9919b"],
          ].map(([label, value]) => (
            <button
              type="button"
              key={label}
              title={label}
              aria-label={`Filter ${label}`}
              onClick={() =>
                setColorFilter((current) =>
                  current === label ? "" : label
                )
              }
              className={tw(
                `vanta-color-dot ${
                  colorFilter === label ? "active" : ""
                }`
              )}
              style={{ background: value }}
            />
          ))}
        </div>
      </div>

      {/* Material */}
      <div className={tw("vanta-filter-block")}>
        <div className={tw("vanta-filter-title")}>
          <span>Material</span>
          <ChevronDown size={13} />
        </div>

        {[
          "Leather",
          "Vegan Leather",
          "Canvas",
          "Suede",
        ].map((material) => (
          <label
            className={tw("vanta-check-row")}
            key={material}
          >
            <input
              type="radio"
              name="material"
              checked={materialFilter === material}
              onChange={() =>
                setMaterialFilter((current) =>
                  current === material ? "" : material
                )
              }
            />

            <span>{material}</span>
          </label>
        ))}
      </div>

      {/* Featured */}
      <div className={tw("vanta-filter-block")}>
        <label className={tw("vanta-check-row")}>
          <input
            type="checkbox"
            checked={featured}
            onChange={() =>
              setFeatured((current) => !current)
            }
          />

          <span>Featured pieces</span>
        </label>
      </div>

      {/* Actions */}
      <button
        type="button"
        className={tw("vanta-filter-apply")}
        onClick={() => setShowFilters(false)}
      >
        Apply filters
      </button>

      {hasFilters && (
        <button
          type="button"
          className={tw("vanta-filter-clear")}
          onClick={resetFilters}
        >
          Clear all
        </button>
      )}
    </aside>
  );
};

export default FilterSidebar;