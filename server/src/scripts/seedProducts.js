import "dotenv/config";
import mongoose from "mongoose";
import slugify from "slugify";

import Product from "../models/product.js";
import Category from "../models/category.js";

const products = [
  // =========================
  // BAGS
  // =========================

  {
    name: "Vanta Classic Handbag",
    category: "Handbags",
    description: "A refined everyday handbag designed for effortless modern style.",
    price: 2899,
    compareAtPrice: 3499,
    image:
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1000&q=85",
    stock: 18,
    material: "Premium Vegan Leather",
    color: "Black",
  },
  {
    name: "Vanta Urban Backpack",
    category: "Backpacks",
    description: "A spacious everyday backpack designed for commuting and city life.",
    price: 2699,
    compareAtPrice: 3199,
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1000&q=85",
    stock: 20,
    material: "Water-Resistant Nylon",
    color: "Black",
  },
  {
    name: "Vanta Explorer Travel Bag",
    category: "Travel Bags",
    description: "A practical travel bag built for organized weekend journeys.",
    price: 3299,
    compareAtPrice: 3899,
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1000&q=85",
    stock: 15,
    material: "Durable Polyester",
    color: "Olive",
  },
  {
    name: "Vanta Weekend Duffle",
    category: "Duffle Bags",
    description: "A versatile duffle bag for weekends, gym sessions and short trips.",
    price: 2999,
    compareAtPrice: 3599,
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1000&q=85",
    stock: 17,
    material: "Canvas",
    color: "Charcoal",
  },
  {
    name: "Vanta Executive Laptop Bag",
    category: "Laptop Bags",
    description: "A professional laptop bag with padded protection and organized storage.",
    price: 3299,
    compareAtPrice: 3899,
    image:
      "https://images.unsplash.com/photo-1491637639811-60e2756cc1c7?auto=format&fit=crop&w=1000&q=85",
    stock: 15,
    material: "Water-Resistant Polyester",
    color: "Navy",
  },

  // =========================
  // DRESSES
  // =========================

  {
    name: "Vanta Summer Flow Dress",
    category: "Summer Wear",
    description: "A lightweight silhouette designed for warm summer days.",
    price: 2199,
    compareAtPrice: 2799,
    image:
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=1000&q=85",
    stock: 20,
    material: "Cotton Blend",
    color: "Cream",
  },
  {
    name: "Vanta Winter Knit Dress",
    category: "Winter Wear",
    description: "A warm knit dress designed for sophisticated cold-weather styling.",
    price: 2599,
    compareAtPrice: 3199,
    image:
      "https://images.unsplash.com/photo-1572804013427-4d7ca7268217?auto=format&fit=crop&w=1000&q=85",
    stock: 14,
    material: "Soft Knit",
    color: "Brown",
  },
  {
    name: "Vanta Sculpt Bodycon",
    category: "Bodycon",
    description: "A clean fitted silhouette designed for a confident evening look.",
    price: 2399,
    compareAtPrice: 2999,
    image:
      "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=1000&q=85",
    stock: 16,
    material: "Stretch Fabric",
    color: "Black",
  },
  {
    name: "Vanta Evening Maxi",
    category: "Maxi Dresses",
    description: "An elegant full-length dress for elevated occasions.",
    price: 2899,
    compareAtPrice: 3499,
    image:
      "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=1000&q=85",
    stock: 12,
    material: "Polyester Blend",
    color: "Wine",
  },
  {
    name: "Vanta Everyday Midi",
    category: "Midi Dresses",
    description: "A versatile midi dress made for everyday elegance.",
    price: 2299,
    compareAtPrice: 2799,
    image:
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=1000&q=85",
    stock: 18,
    material: "Cotton Blend",
    color: "Beige",
  },
  {
    name: "Vanta Party Edit Dress",
    category: "Party Wear",
    description: "A statement silhouette designed for nights that deserve attention.",
    price: 3199,
    compareAtPrice: 3899,
    image:
      "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=1000&q=85",
    stock: 10,
    material: "Satin Blend",
    color: "Black",
  },

  // =========================
  // FOOTWEAR
  // =========================

  {
    name: "Vanta Street Runner",
    category: "Sneakers",
    description: "Clean everyday sneakers designed for comfort and modern street style.",
    price: 2499,
    compareAtPrice: 2999,
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1000&q=85",
    stock: 25,
    material: "Mesh",
    color: "Red",
  },
  {
    name: "Vanta Classic Heels",
    category: "Heels",
    description: "Minimal heels designed to finish formal and evening looks.",
    price: 2799,
    compareAtPrice: 3299,
    image:
      "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=1000&q=85",
    stock: 15,
    material: "Faux Leather",
    color: "Black",
  },
  {
    name: "Vanta Everyday Flats",
    category: "Flats",
    description: "Comfortable flats designed for effortless everyday movement.",
    price: 1899,
    compareAtPrice: 2299,
    image:
      "https://images.unsplash.com/photo-1560343090-f0409e92791a?auto=format&fit=crop&w=1000&q=85",
    stock: 22,
    material: "Vegan Leather",
    color: "Beige",
  },
  {
    name: "Vanta Urban Boots",
    category: "Boots",
    description: "Structured boots designed for confident everyday styling.",
    price: 3299,
    compareAtPrice: 3999,
    image:
      "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1000&q=85",
    stock: 13,
    material: "Synthetic Leather",
    color: "Black",
  },
  {
    name: "Vanta Summer Sandals",
    category: "Sandals",
    description: "Minimal sandals designed for warm-weather everyday wear.",
    price: 1699,
    compareAtPrice: 2099,
    image:
      "https://images.unsplash.com/photo-1603487742131-4160ec999306?auto=format&fit=crop&w=1000&q=85",
    stock: 24,
    material: "Synthetic Leather",
    color: "Tan",
  },
  {
    name: "Vanta Classic Loafers",
    category: "Loafers",
    description: "Refined loafers combining polished design with everyday comfort.",
    price: 2399,
    compareAtPrice: 2899,
    image:
      "https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=1000&q=85",
    stock: 17,
    material: "Faux Leather",
    color: "Brown",
  },

  // =========================
  // JEWELRY
  // =========================

  {
    name: "Vanta Signature Necklace",
    category: "Necklaces",
    description: "A refined necklace designed to add a subtle finishing detail.",
    price: 1299,
    compareAtPrice: 1699,
    image:
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1000&q=85",
    stock: 30,
    material: "Stainless Steel",
    color: "Gold",
  },
  {
    name: "Vanta Minimal Earrings",
    category: "Earrings",
    description: "Minimal earrings designed for everyday elegance.",
    price: 899,
    compareAtPrice: 1199,
    image:
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1000&q=85",
    stock: 35,
    material: "Stainless Steel",
    color: "Gold",
  },
  {
    name: "Vanta Line Bracelet",
    category: "Bracelets",
    description: "A clean bracelet designed for subtle everyday styling.",
    price: 999,
    compareAtPrice: 1299,
    image:
      "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=1000&q=85",
    stock: 28,
    material: "Stainless Steel",
    color: "Silver",
  },
  {
    name: "Vanta Signet Ring",
    category: "Rings",
    description: "A minimal statement ring with a clean contemporary profile.",
    price: 1099,
    compareAtPrice: 1399,
    image:
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1000&q=85",
    stock: 25,
    material: "Stainless Steel",
    color: "Silver",
  },
  {
    name: "Vanta Fine Anklet",
    category: "Anklets",
    description: "A delicate anklet designed for understated summer styling.",
    price: 799,
    compareAtPrice: 999,
    image:
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1000&q=85",
    stock: 30,
    material: "Stainless Steel",
    color: "Gold",
  },
  {
    name: "Vanta Jewelry Set",
    category: "Jewelry Sets",
    description: "A coordinated jewelry set designed to complete an elevated look.",
    price: 1899,
    compareAtPrice: 2399,
    image:
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1000&q=85",
    stock: 20,
    material: "Stainless Steel",
    color: "Gold",
  },

  // =========================
  // TOPS
  // =========================

  {
    name: "Vanta Essential T-Shirt",
    category: "T-Shirts",
    description: "A clean everyday T-shirt designed for effortless layering.",
    price: 999,
    compareAtPrice: 1299,
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1000&q=85",
    stock: 35,
    material: "Cotton",
    color: "White",
  },
  {
    name: "Vanta Relaxed Shirt",
    category: "Shirts",
    description: "A relaxed shirt designed for polished everyday outfits.",
    price: 1499,
    compareAtPrice: 1899,
    image:
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=1000&q=85",
    stock: 25,
    material: "Cotton Blend",
    color: "Blue",
  },
  {
    name: "Vanta Soft Blouse",
    category: "Blouses",
    description: "A refined blouse designed for work and everyday styling.",
    price: 1699,
    compareAtPrice: 2099,
    image:
      "https://images.unsplash.com/photo-1564257577054-9e7b7b3a4f8a?auto=format&fit=crop&w=1000&q=85",
    stock: 20,
    material: "Viscose",
    color: "Cream",
  },
  {
    name: "Vanta Studio Crop Top",
    category: "Crop Tops",
    description: "A modern crop top designed for contemporary casual looks.",
    price: 899,
    compareAtPrice: 1199,
    image:
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1000&q=85",
    stock: 30,
    material: "Cotton Blend",
    color: "Black",
  },
  {
    name: "Vanta Essential Tank",
    category: "Tank Tops",
    description: "A lightweight tank designed for layering and warm-weather looks.",
    price: 799,
    compareAtPrice: 999,
    image:
      "https://images.unsplash.com/photo-1506629905607-d9d1f2e6b5a5?auto=format&fit=crop&w=1000&q=85",
    stock: 32,
    material: "Cotton",
    color: "White",
  },
  {
    name: "Vanta Fine Knit Top",
    category: "Knitwear",
    description: "A soft knit top designed for elevated everyday layering.",
    price: 1799,
    compareAtPrice: 2199,
    image:
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=1000&q=85",
    stock: 18,
    material: "Soft Knit",
    color: "Grey",
  },
];

const run = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is missing");
    }

    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected");

    const categories = await Category.find({ isActive: true });

    if (!categories.length) {
      throw new Error("No categories found. Run seedCategories.js first.");
    }

    const categoryMap = new Map(
      categories.map((category) => [
        category.name.toLowerCase(),
        category,
      ])
    );

    let created = 0;
    let skipped = 0;

    for (const item of products) {
      const category = categoryMap.get(item.category.toLowerCase());

      if (!category) {
        console.log(`Category not found: ${item.category}`);
        skipped++;
        continue;
      }

      const slug = slugify(item.name, {
        lower: true,
        strict: true,
      });

      const sku = `VNT-${slug
        .split("-")
        .slice(1, 4)
        .join("-")
        .toUpperCase()}-${String(created + 1).padStart(3, "0")}`;

      const existing = await Product.findOne({
        slug,
      });

      if (existing) {
        console.log(`Already exists: ${item.name}`);
        skipped++;
        continue;
      }

      await Product.create({
        name: item.name,
        slug,
        description: item.description,
        price: item.price,
        compareAtPrice: item.compareAtPrice,
        category: category._id,
        images: [item.image],
        stock: item.stock,
        sku,
        brand: "Vanta Bags",
        material: item.material,
        color: item.color,
        isFeatured: created % 5 === 0,
        isActive: true,
      });

      console.log(`Created: ${item.name} → ${category.name}`);
      created++;
    }

    console.log("");
    console.log("====================================");
    console.log("VANTA PRODUCT SEED COMPLETE");
    console.log(`Created: ${created}`);
    console.log(`Skipped: ${skipped}`);
    console.log("====================================");
  } catch (error) {
    console.error("Product seed failed:", error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

run();