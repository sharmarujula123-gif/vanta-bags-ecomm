export const STORE_CATEGORIES = [
  {
    name: "Tops",
    slug: "tops",
    description: "Everyday layers, shirts and easy essentials.",
    image: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=1000&q=85",
    children: ["T-Shirts", "Shirts", "Blouses", "Crop Tops", "Tank Tops", "Knitwear"],
  },
  {
    name: "Bags",
    slug: "bags",
    description: "Work, travel and everyday carry, refined.",
    image: "https://res.cloudinary.com/q9toon94/image/upload/v1786812733/vanta-bags/products/handbag-4.jpg",
    children: ["Handbags", "Backpacks", "Travel Bags", "Duffle Bags", "Laptop Bags"],
  },
  {
    name: "Footwear",
    slug: "footwear",
    description: "Sneakers, heels and everyday finishing pieces.",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1000&q=85",
    children: ["Sneakers", "Heels", "Flats", "Boots", "Sandals", "Loafers"],
  },
  {
    name: "Dresses",
    slug: "dresses",
    description: "Easy silhouettes for every kind of day.",
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=1000&q=85",
    children: ["Summer Wear", "Winter Wear", "Bodycon", "Maxi Dresses", "Midi Dresses", "Party Wear"],
  },
  {
    name: "Jewelry",
    slug: "jewelry",
    description: "The small details that finish the look.",
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1000&q=85",
    children: ["Necklaces", "Earrings", "Bracelets", "Rings", "Anklets", "Jewelry Sets"],
  },
];

export const normalizeCategory = (value = "") =>
  String(value)
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export const categoryImage = (category) => {
  const slug = normalizeCategory(category?.slug || category?.name);
  return STORE_CATEGORIES.find((item) => item.slug === slug)?.image || "";
};

export const getCategoryChildren = (categories, parent) => {
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

export const fallbackRootCategories = STORE_CATEGORIES.map((item) => ({
  ...item,
  image: item.image,
}));
