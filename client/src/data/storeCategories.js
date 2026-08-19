export const normalizeCategory = (value = "") =>
    String(value)
      .toLowerCase()
      .trim()
      .replace(/&/g, "and")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  
  export const categoryImage = (category) => category?.image || "";
  
  export const getCategoryChildren = (categories = [], parent) => {
    const parentId = parent?._id ? String(parent._id) : "";
    const parentSlug = normalizeCategory(parent?.slug || parent?.name);
  
    return categories.filter((category) => {
      const relation = category?.parentCategory;
      if (!relation) return false;
  
      if (typeof relation === "object") {
        return (
          (relation._id && String(relation._id) === parentId) ||
          normalizeCategory(relation.slug || relation.name) === parentSlug
        );
      }
  
      return parentId && String(relation) === parentId;
    });
  };
  
  export const getRootCategories = (categories = []) =>
    categories.filter((category) => !category?.parentCategory);
  
  // Kept as an empty fallback so existing imports remain safe.
  export const fallbackRootCategories = [];
  