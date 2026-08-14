import { tw } from "../utils/twStyles.js";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, ArrowUpRight, Loader2 } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import categoryService from "../services/categoryService";
import Products from "./Products";

import bucketBagImage from "../assets/category/bucket-bag.png";
import satchelImage from "../assets/category/satchel.png";
import crossbodyImage from "../assets/category/crossbody.png";
import shoulderBagImage from "../assets/category/shoulder-bag.png";
import toteBagImage from "../assets/category/tote-bag.png";

const categoryCopy = {
  "bucket-bag": "Soft structure, everyday ease.",
  bucket: "Soft structure, everyday ease.",
  satchel: "Polished shape for everyday carry.",
  crossbody: "Hands-free essentials, kept close.",
  "cross-body": "Hands-free essentials, kept close.",
  "shoulder-bag": "An easy silhouette for every day.",
  shoulder: "An easy silhouette for every day.",
  tote: "Roomy, clean and ready for more.",
  "tote-bag": "Roomy, clean and ready for more.",
};

const fallbackCategories = [
  { name: "Bucket Bags", slug: "bucket-bag", image: bucketBagImage, description: categoryCopy["bucket-bag"] },
  { name: "Satchels", slug: "satchel", image: satchelImage, description: categoryCopy.satchel },
  { name: "Crossbody Bags", slug: "crossbody", image: crossbodyImage, description: categoryCopy.crossbody },
  { name: "Shoulder Bags", slug: "shoulder-bag", image: shoulderBagImage, description: categoryCopy["shoulder-bag"] },
  { name: "Tote Bags", slug: "tote-bag", image: toteBagImage, description: categoryCopy["tote-bag"] },
];

const categoryImages = {
  backpacks: bucketBagImage,
  "duffle-bags": toteBagImage,
  handbags: shoulderBagImage,
  "laptop-bags": satchelImage,
  "sling-bags": crossbodyImage,
  "travel-bags": toteBagImage,
  "bucket-bag": bucketBagImage,
  bucket: bucketBagImage,
  satchel: satchelImage,
  crossbody: crossbodyImage,
  "cross-body": crossbodyImage,
  "shoulder-bag": shoulderBagImage,
  shoulder: shoulderBagImage,
  tote: toteBagImage,
  "tote-bag": toteBagImage,
};

const fallbackDescriptions = {
  backpacks: "Everyday carry built for work, travel and everything between.",
  "duffle-bags": "Roomy, reliable carry for weekends and longer escapes.",
  handbags: "Refined silhouettes made for effortless everyday style.",
  "laptop-bags": "Protective, organized carry designed around your tech.",
  "sling-bags": "Compact essentials, kept close and easy to reach.",
  "travel-bags": "Smart organization for journeys big and small.",
};

const normalizeKey = (value = "") =>
  String(value)
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export default function Category() {
  const { slug } = useParams();

  // Keep the category landing page here. A selected category intentionally
  // uses the exact Products page component so its grid, filters, sorting,
  // wishlist and pagination are identical to /products.
  if (slug) return <Products categorySlug={slug} />;

  return <CategoryLanding />;
}

function CategoryLanding() {
  const [categories, setCategories] = useState([]);
  const [categoryLoading, setCategoryLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const loadCategories = async () => {
      try {
        const response = await categoryService.getCategories();
        const result = response.data?.categories || response.categories || [];
        if (!cancelled) setCategories(result);
      } catch (err) {
        if (!cancelled) console.error("Failed to load categories:", err);
      } finally {
        if (!cancelled) setCategoryLoading(false);
      }
    };

    loadCategories();
    return () => {
      cancelled = true;
    };
  }, []);

  const displayCategories = useMemo(() => {
    if (!categories.length) return fallbackCategories;

    return categories.slice(0, 5).map((item, index) => {
      const key = normalizeKey(item.slug || item.name);
      return {
        ...item,
        slug: item.slug || key,
        image:
          item.image ||
          item.imageUrl ||
          categoryImages[key] ||
          fallbackCategories[index]?.image ||
          bucketBagImage,
        description:
          categoryCopy[key] ||
          fallbackDescriptions[key] ||
          [
            "Everyday carry, refined.",
            "Built for the daily commute.",
            "Compact and easy to carry.",
            "Polished essentials for every day.",
            "Room for everything that matters.",
          ][index],
      };
    });
  }, [categories]);

  return (
    <main className="min-h-screen bg-[var(--vanta-bg)] text-[var(--vanta-text)]">
      <section className="mx-auto max-w-[1280px] px-5 pb-14 pt-10 sm:px-8 lg:px-10 lg:pt-14">
        <div className="max-w-2xl">
          <p className={tw("text-[10px] font-bold uppercase tracking-[0.28em] text-[var(--vanta-muted)]")}>
            VANTA COLLECTION
          </p>
          <h1 className="mt-3 font-serif text-5xl font-medium tracking-[-0.045em] sm:text-6xl">
            Find your carry.
          </h1>
          <p className={tw("mt-5 max-w-xl text-sm leading-7 text-[var(--vanta-muted)]")}>
            Five silhouettes. Different days. Pick the shape that fits the way you move.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {displayCategories.map((item, index) => (
            <Link
              key={item._id || item.slug || item.name}
              to={`/category/${item.slug}`}
              className="group block min-w-0"
            >
              <div className="relative aspect-[0.84] overflow-hidden bg-[#eeeae4]">
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.035]"
                />
                <span className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-stone-900 opacity-0 backdrop-blur transition group-hover:opacity-100">
                  <ArrowUpRight size={16} />
                </span>
                <span className="absolute left-3 top-3 text-[9px] font-bold tracking-[0.18em] text-stone-700">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>

              <div className="flex items-start justify-between gap-2 py-4">
                <div>
                  <h2 className="text-sm font-semibold leading-5">{item.name}</h2>
                  <p className={tw("mt-1 text-[11px] leading-5 text-[var(--vanta-muted)]")}>
                    {item.description}
                  </p>
                </div>
                <ArrowRight
                  size={14}
                  className="mt-1 shrink-0 text-[var(--vanta-muted)] transition group-hover:translate-x-1"
                />
              </div>
            </Link>
          ))}
        </div>

        {categoryLoading && (
          <div className="mt-8 flex justify-center">
            <Loader2 className="animate-spin text-[var(--vanta-muted)]" size={20} />
          </div>
        )}
      </section>
    </main>
  );
}
