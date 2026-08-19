export const normalizeCategoryKey = (value = "") =>
  String(value)
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export const getCategoryId = (category) =>
  String(
    category?._id ||
      category?.id ||
      category?.categoryId ||
      category?.category?._id ||
      category?.category?.id ||
      ""
  );

export const getCategoryKey = (category) => {
  const value =
    category?.slug ||
    category?.name ||
    category?.category?.slug ||
    category?.category?.name ||
    getCategoryId(category);

  return value ? normalizeCategoryKey(value) : "";
};

export const getParentId = (category) => {
  const parent = category?.parentCategory;
  if (!parent) return "";
  return String(parent?._id || parent?.id || parent || "");
};

export const getParentKey = (category) => {
  const parent = category?.parentCategory;
  return normalizeCategoryKey(parent?.slug || parent?.name || "");
};

export const normalizeImageUrl = (value) => {
  if (!value || typeof value !== "string") return "";

  const markdownMatch = value.match(/\((https?:\/\/[^)]+)\)/);
  if (markdownMatch) return markdownMatch[1];

  return value.trim();
};

export const formatPrice = (value) =>
  `₹${Number(value || 0).toLocaleString("en-IN")}`;

export const unwrapList = (payload, keys = []) => {
  let value = payload;

  for (let i = 0; i < 4; i += 1) {
    if (Array.isArray(value)) return value;
    if (!value || typeof value !== "object") return [];

    const nextKey = keys.find((key) => value[key] !== undefined);
    if (!nextKey) return [];

    value = value[nextKey];
  }

  return Array.isArray(value) ? value : [];
};
