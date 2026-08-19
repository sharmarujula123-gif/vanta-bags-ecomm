import "dotenv/config";
import mongoose from "mongoose";
import Category from "../models/category.js";

const CATEGORY_TREE = [
  {
    name: "Tops",
    slug: "tops",
    description: "Everyday tops, shirts and easy layers.",
    image: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=1200&q=85",
    children: [
      ["T-Shirts", "t-shirts", "Clean everyday tees."],
      ["Shirts", "shirts", "Polished shirts for work and weekends."],
      ["Blouses", "blouses", "Soft, refined feminine layers."],
      ["Crop Tops", "crop-tops", "Modern cropped silhouettes."],
      ["Tank Tops", "tank-tops", "Lightweight essentials for warm days."],
      ["Knitwear", "knitwear", "Soft layers for cooler days."],
    ],
  },
  {
    name: "Bags",
    slug: "bags",
    description: "Carry pieces for work, weekends and everywhere between.",
    image: "https://res.cloudinary.com/q9toon94/image/upload/v1786812733/vanta-bags/products/handbag-4.jpg",
    children: [
      ["Handbags", "handbags", "Refined silhouettes for everyday carry."],
      ["Backpacks", "backpacks", "Hands-free everyday movement."],
      ["Travel Bags", "travel-bags", "Smart organization for the road."],
      ["Duffle Bags", "duffle-bags", "Made for weekends and getaways."],
      ["Laptop Bags", "laptop-bags", "Polished protection for your tech."],
    ],
  },
  {
    name: "Footwear",
    slug: "footwear",
    description: "Shoes that finish the look without stealing the show.",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=85",
    children: [
      ["Sneakers", "sneakers", "Clean everyday comfort."],
      ["Heels", "heels", "Elevated silhouettes for evenings out."],
      ["Flats", "flats", "Easy, polished and comfortable."],
      ["Boots", "boots", "Structured footwear for cooler days."],
      ["Sandals", "sandals", "Light summer-ready essentials."],
      ["Loafers", "loafers", "Classic polish with modern ease."],
    ],
  },
  {
    name: "Dresses",
    slug: "dresses",
    description: "Easy silhouettes for sun, evenings, weekends and beyond.",
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=1200&q=85",
    children: [
      ["Summer Wear", "summer-wear", "Light dresses made for warm days."],
      ["Winter Wear", "winter-wear", "Layer-friendly dresses for colder weather."],
      ["Bodycon", "bodycon", "Sculpted silhouettes with confident lines."],
      ["Maxi Dresses", "maxi-dresses", "Long, flowing everyday elegance."],
      ["Midi Dresses", "midi-dresses", "The versatile in-between length."],
      ["Party Wear", "party-wear", "Statement dresses for special nights."],
    ],
  },
  {
    name: "Jewelry",
    slug: "jewelry",
    description: "Small details that pull the whole look together.",
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=85",
    children: [
      ["Necklaces", "necklaces", "Fine details that frame the look."],
      ["Earrings", "earrings", "Everyday studs to statement drops."],
      ["Bracelets", "bracelets", "Subtle shine around the wrist."],
      ["Rings", "rings", "Minimal bands and standout pieces."],
      ["Anklets", "anklets", "Light finishing details for summer looks."],
      ["Jewelry Sets", "jewelry-sets", "Coordinated pieces made to pair."],
    ],
  },
];

const upsertCategory = async ({ name, slug, description, image, parentCategory = null }) => {
  return Category.findOneAndUpdate(
    { slug },
    {
      $set: {
        name,
        description,
        image,
        parentCategory,
        isActive: true,
      },
      $setOnInsert: { slug },
    },
    { returnDocument: "after", upsert: true, setDefaultsOnInsert: true }
  );
};

const run = async () => {
  if (!process.env.MONGO_URI) throw new Error("MONGO_URI is missing");

  await mongoose.connect(process.env.MONGO_URI);

  for (const root of CATEGORY_TREE) {
    const parent = await upsertCategory(root);

    for (const [name, slug, description] of root.children) {
      const existing = await Category.findOne({ slug });
      const image = existing?.image || root.image;

      await upsertCategory({
        name,
        slug,
        description,
        image,
        parentCategory: parent._id,
      });
    }
  }

  // Preserve existing bag products by moving the five legacy bag categories
  // underneath the new Bags parent. This is safe to run more than once.
  const bags = await Category.findOne({ slug: "bags" });
  if (bags) {
    await Category.updateMany(
      { slug: { $in: ["backpacks", "handbags", "duffle-bags", "laptop-bags", "travel-bags"] } },
      { $set: { parentCategory: bags._id, isActive: true } }
    );
  }

  // Verify the final hierarchy: exactly five root categories and the expected
  // direct children beneath each root.
  const rootCount = await Category.countDocuments({
    parentCategory: null,
    isActive: true,
    slug: { $in: CATEGORY_TREE.map((item) => item.slug) },
  });

  const childCount = await Category.countDocuments({
    parentCategory: { $ne: null },
    isActive: true,
  });

  console.log(
    `Vanta category hierarchy seeded successfully: ${rootCount} root categories, ${childCount} subcategories.`
  );

  if (rootCount !== 5 || childCount !== 29) {
    console.warn(
      "Warning: expected 5 root categories and 29 subcategories. Check the categories collection before continuing."
    );
  }

  await mongoose.disconnect();
};

run().catch(async (error) => {
  console.error("Category seed failed:", error);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
