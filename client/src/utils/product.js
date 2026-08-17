export const PRICE_RANGE = { min: 500, max: 10000, step: 500 };

export const formatPrice = (value) =>
  `₹${Number(value || 0).toLocaleString("en-IN")}`;

export const normalizeKey = (value = "") =>
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
      "",
  );

export const getCategoryKey = (category) => {
  const value =
    category?.slug ||
    category?.name ||
    category?.category?.slug ||
    category?.category?.name ||
    getCategoryId(category);

  return value ? normalizeKey(value) : "";
};

export const normalizeImageUrl = (value) => {
  if (!value || typeof value !== "string") return "";
  const markdownMatch = value.match(/\((https?:\/\/[^)]+)\)/);
  return markdownMatch ? markdownMatch[1] : value.trim();
};

export const unwrapList = (payload, keys = []) => {
  let value = payload;
  for (let i = 0; i < 4; i += 1) {
    if (Array.isArray(value)) return value;
    if (!value || typeof value !== "object") return [];
    const key = keys.find((item) => value[item] !== undefined);
    if (!key) return [];
    value = value[key];
  }
  return Array.isArray(value) ? value : [];
};
