import { tw } from "../utils/twStyles.js";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Box,
  Check,
  Droplets,
  Feather,
  Heart,
  Search,
  ShieldCheck,
  ShoppingBag,
  UserRound,
} from "lucide-react";
import { Link } from "react-router-dom";
import productService from "../services/productService";
import categoryService from "../services/categoryService";
import heroImage from "../assets/category/hero.jpg";


const categoryImages = {
  backpacks:
    "https://res.cloudinary.com/q9toon94/image/upload/v1786813548/vanta-bags/products/backpack1.jpg",
  "duffle-bags":
    "https://res.cloudinary.com/q9toon94/image/upload/v1786810385/vanta-bags/products/dufflebag-2.jpg",
  handbags:
    "https://res.cloudinary.com/q9toon94/image/upload/v1786812733/vanta-bags/products/handbag-4.jpg",
  "laptop-bags":
    "https://res.cloudinary.com/q9toon94/image/upload/v1786812857/vanta-bags/products/laptopbag-2.jpg",
  "travel-bags":
    "https://res.cloudinary.com/q9toon94/image/upload/v1786812611/vanta-bags/products/travelbag.jpg",
};

const money = (value) => `₹${Number(value || 0).toLocaleString("en-IN")}`;

export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    Promise.allSettled([
      productService.getProducts({ limit: 8, page: 1, sort: "newest" }),
      categoryService.getCategories(),
    ]).then(([productResult, categoryResult]) => {
      if (productResult.status === "fulfilled") {
        setProducts(
          productResult.value.data?.products ||
            productResult.value.products ||
            []
        );
      }
      if (categoryResult.status === "fulfilled") {
        setCategories(
          categoryResult.value.data?.categories ||
            categoryResult.value.categories ||
            []
        );
      }
    });
  }, []);

  const fallbackCategories = [
    ["Backpacks", "backpacks", "Everyday carry"],
    ["Duffle Bags", "duffle-bags", "Made for weekends"],
    ["Handbags", "handbags", "Easy, polished carry"],
    ["Laptop Bags", "laptop-bags", "Built around your tech"],
    ["Sling Bags", "sling-bags", "Light and close"],
  ];

  const categoryItems = categories.length
    ? categories.slice(0, 5).map((category, index) => [
        category.name,
        category.slug,
        ["Everyday carry", "Made for weekends", "Easy, polished carry", "Built around your tech", "Light and close"][index] ||
          "Designed for movement",
      ])
    : fallbackCategories;

  return (
    <main className={tw("vanta-home vanta-reference-home")}>
      {/* HERO */}
      <section className={tw("vanta-reference-hero")}>
      <img
  src={heroImage}
  alt="Vanta black bag"
  className={tw("vanta-reference-hero-image")}
/>
        <div className={tw("vanta-reference-hero-shade")} />

        <div className={tw("vanta-reference-hero-copy")}>
          <p>BUILT TO MOVE. DESIGNED TO LAST.</p>
          <h1>
            What moves you,
            <br />
            <em>matters.</em>
          </h1>
          <Link to="/" className={tw("vanta-reference-outline-btn")}>
            Explore collection <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* CATEGORY / SHOP THE EDIT */}
      <section className={tw("vanta-reference-edit")}>
        <div className={tw("vanta-reference-section-head")}>
          <div>
            <p>SHOP THE EDIT</p>
            <h2>Find your carry.</h2>
          </div>
          <Link to="/" className={tw("vanta-reference-view-all")}>
            View all <ArrowRight size={15} />
          </Link>
        </div>

        <div className={tw("vanta-reference-category-row")}>
          {categoryItems.map(([name, slug, description], index) => (
            <Link
              key={slug || name}
              to={slug ? `/category/${slug}` : "/products"}
              className={tw("vanta-reference-category")}
            >
              <div className={tw("vanta-reference-category-image")}>
                <img
                  src={categoryImages[slug] || heroImage}
                  alt={name}
                />
                <span className={tw("vanta-reference-category-arrow")}>
                  <ArrowUpRight size={17} />
                </span>
              </div>
              <div className={tw("vanta-reference-category-copy")}>
                <div>
                  <small>{String(index + 1).padStart(2, "0")}</small>
                  <h3>{name}</h3>
                  <p>{description}</p>
                </div>
                <ArrowRight size={14} />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* NEW / NOW */}
      <section className={tw("vanta-reference-now")}>
        <div className={tw("vanta-reference-section-head")}>
          <div>
            <p>NEW / NOW</p>
            <h2>Made for the way you move.</h2>
          </div>
          <Link to="/" className={tw("vanta-reference-view-all")}>
            Shop all <ArrowRight size={15} />
          </Link>
        </div>

        <div className={tw("vanta-reference-features")}>
          <div>
            <span><ShieldCheck size={19} /></span>
            <div><b>PREMIUM MATERIALS</b><small>Built to last, every time.</small></div>
          </div>
          <div>
            <span><Box size={19} /></span>
            <div><b>SMART DESIGN</b><small>Thoughtful in every detail.</small></div>
          </div>
          <div>
            <span><Feather size={19} /></span>
            <div><b>LIGHTWEIGHT</b><small>Move freely, always.</small></div>
          </div>
          <div>
            <span><Droplets size={19} /></span>
            <div><b>WATER RESISTANT</b><small>Ready for anything.</small></div>
          </div>
        </div>
      </section>

      {/* PRODUCTS */}
      <section className={tw("vanta-reference-products")}>
        <div className={tw("vanta-reference-section-head")}>
          <div>
            <p>THE LATEST</p>
            <h2>Pieces worth carrying.</h2>
          </div>
          <Link to="/" className={tw("vanta-reference-view-all")}>
            View collection <ArrowRight size={15} />
          </Link>
        </div>

        <div className={tw("vanta-reference-product-grid")}>
          {products.slice(0, 8).map((product, index) => (
            <Link
              key={product._id}
              to={`/products/${product.slug}`}
              className={tw("vanta-reference-product")}
            >
              <div className={tw("vanta-reference-product-image")}>
                {product.images?.[0] ? (
                  <img src={product.images[0]} alt={product.name} />
                ) : (
                  <span>VANTA</span>
                )}
                <span className={tw("vanta-reference-product-number")}>
                  {String(index + 1).padStart(2, "0")}
                </span>
                <button
                  type="button"
                  aria-label="Wishlist"
                  onClick={(e) => e.preventDefault()}
                >
                  <Heart size={16} />
                </button>
              </div>
              <div className={tw("vanta-reference-product-meta")}>
                <h3>{product.name}</h3>
                <p>{money(product.price)}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section
  className={tw(
    "bg-white px-4 py-16 transition-colors duration-300 dark:bg-[#0a0a0a] sm:px-6 sm:py-20 md:py-24"
  )}
>
  <div className={tw("mx-auto max-w-6xl")}>

    {/* Header */}
    <div className={tw("mb-10 text-center sm:mb-12")}>
      <p
        className={tw(
          "mb-3 text-[10px] uppercase tracking-[0.25em] text-gray-500 dark:text-gray-400 sm:mb-4 sm:text-[11px]"
        )}
      >
        Customer Stories
      </p>

      <h2
        className={tw(
          "text-3xl font-light leading-tight tracking-tight text-gray-900 dark:text-white sm:text-4xl md:text-5xl"
        )}
      >
        Loved by people who
        <br />
        <em className={tw("font-serif")}>carry VANTA.</em>
      </h2>

      <p
        className={tw(
          "mx-auto mt-4 max-w-xl text-xs leading-6 text-gray-500 dark:text-gray-400 sm:text-sm sm:leading-7"
        )}
      >
        Thoughtfully designed bags made for everyday movement, work, travel,
        and everything in between.
      </p>
    </div>

    {/* Reviews */}
    <div className={tw("grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-5")}>

      {/* Review 1 */}
      <div
        className={tw(
          "flex min-h-[280px] flex-col justify-between border border-gray-200 bg-white p-6 transition-colors duration-300 dark:border-white/10 dark:bg-[#151515] sm:p-7 md:p-8"
        )}
      >
        <div>
          <div
            className={tw(
              "mb-6 text-sm tracking-wide text-gray-900 dark:text-white"
            )}
          >
            ★★★★★
          </div>

          <p
            className={tw(
              "text-sm leading-6 text-gray-700 dark:text-gray-300 sm:text-[15px] sm:leading-7"
            )}
          >
            “The quality is much better than I expected. The bag feels
            premium, looks minimal, and fits everything I need for work.”
          </p>
        </div>

        <div
          className={tw(
            "mt-8 border-t border-gray-100 pt-5 dark:border-white/10"
          )}
        >
          <p
            className={tw(
              "text-sm font-medium text-gray-900 dark:text-white"
            )}
          >
            Arjun Mehta
          </p>

          <p
            className={tw(
              "mt-1 text-xs text-gray-400 dark:text-gray-500"
            )}
          >
            Verified Customer
          </p>
        </div>
      </div>

      {/* Review 2 */}
      <div
        className={tw(
          "flex min-h-[280px] flex-col justify-between border border-gray-200 bg-white p-6 transition-colors duration-300 dark:border-white/10 dark:bg-[#151515] sm:p-7 md:p-8"
        )}
      >
        <div>
          <div
            className={tw(
              "mb-6 text-sm tracking-wide text-gray-900 dark:text-white"
            )}
          >
            ★★★★★
          </div>

          <p
            className={tw(
              "text-sm leading-6 text-gray-700 dark:text-gray-300 sm:text-[15px] sm:leading-7"
            )}
          >
            “I bought the duffle for a weekend trip and it quickly became my
            go-to travel bag. Clean design, plenty of space, and very
            comfortable to carry.”
          </p>
        </div>

        <div
          className={tw(
            "mt-8 border-t border-gray-100 pt-5 dark:border-white/10"
          )}
        >
          <p
            className={tw(
              "text-sm font-medium text-gray-900 dark:text-white"
            )}
          >
            Riya Kapoor
          </p>

          <p
            className={tw(
              "mt-1 text-xs text-gray-400 dark:text-gray-500"
            )}
          >
            Verified Customer
          </p>
        </div>
      </div>

      {/* Review 3 */}
      <div
        className={tw(
          "flex min-h-[280px] flex-col justify-between border border-gray-200 bg-white p-6 transition-colors duration-300 dark:border-white/10 dark:bg-[#151515] sm:p-7 md:p-8"
        )}
      >
        <div>
          <div
            className={tw(
              "mb-6 text-sm tracking-wide text-gray-900 dark:text-white"
            )}
          >
            ★★★★★
          </div>

          <p
            className={tw(
              "text-sm leading-6 text-gray-700 dark:text-gray-300 sm:text-[15px] sm:leading-7"
            )}
          >
            “Simple, stylish and practical. I love that it doesn't have huge
            logos everywhere. VANTA has nailed the understated look.”
          </p>
        </div>

        <div
          className={tw(
            "mt-8 border-t border-gray-100 pt-5 dark:border-white/10"
          )}
        >
          <p
            className={tw(
              "text-sm font-medium text-gray-900 dark:text-white"
            )}
          >
            Kabir Sharma
          </p>

          <p
            className={tw(
              "mt-1 text-xs text-gray-400 dark:text-gray-500"
            )}
          >
            Verified Customer
          </p>
        </div>
      </div>

    </div>

    {/* Bottom rating */}
    <div className={tw("mt-8 text-center sm:mt-10")}>
      <div
        className={tw(
          "text-sm tracking-wide text-gray-900 dark:text-white"
        )}
      >
        ★★★★★
      </div>

      <p
        className={tw(
          "mt-2 text-xs text-gray-400 dark:text-gray-500"
        )}
      >
        Rated 4.9/5 by VANTA customers
      </p>
    </div>

  </div>
</section> 
    </main>
  );
}
