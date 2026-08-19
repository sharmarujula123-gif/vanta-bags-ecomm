import { Link } from "react-router-dom";
import { tw } from "../../utils/twStyles.js";
import { getCategoryId, getCategoryKey, normalizeCategoryKey } from "../../utils/productHelpers.js";

const CategoryPills = ({
  activeCategory,
  siblingCategories,
  parentCategory,
  selectedCategory,
  chooseCategory,
}) => {
  if (!activeCategory || siblingCategories.length === 0) return null;

  return (
    <div className={tw("vanta-category-pills")}>
      {parentCategory && (
        <button
          type="button"
          onClick={() => chooseCategory(parentCategory)}
          className={tw(`vanta-category-pill ${
            normalizeCategoryKey(selectedCategory) ===
            normalizeCategoryKey(parentCategory.slug || parentCategory.name)
              ? "active"
              : ""
          }`)}
        >
          All {parentCategory.name}
        </button>
      )}

      {siblingCategories.map((category) => {
        const key = getCategoryKey(category);
        const active =
          normalizeCategoryKey(selectedCategory) === normalizeCategoryKey(key);

        return (
          <Link
            key={getCategoryId(category) || key}
            to={`/category/${key}`}
            className={tw(`vanta-category-pill ${active ? "active" : ""}`)}
          >
            {category.name}
          </Link>
        );
      })}
    </div>
  );
};

export default CategoryPills;
