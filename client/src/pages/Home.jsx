import { tw } from "../utils/twStyles.js";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Heart, Star, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import productService from "../services/productService";
import categoryService from "../services/categoryService";
import heroImage from "../assets/category/hero.jpg";
import {
  categoryImage,
  fallbackRootCategories,
  getRootCategories,
  normalizeCategory,
} from "../data/storeCategories";

const money = (value) => `₹${Number(value || 0).toLocaleString("en-IN")}`;

const reviews = [
  {
    name: "Priya Sharma",
    text: "The quality is amazing. Exactly what I was looking for, and the finish feels genuinely premium.",
  },
  {
    name: "Ananya Verma",
    text: "Stylish, comfortable and worth every penny. The details are beautiful in person.",
  },
  {
    name: "Ritika Singh",
    text: "Fast delivery and excellent customer service. I will definitely be shopping here again.",
  },
];

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

  const rootCategories = useMemo(() => {
    const roots = getRootCategories(categories);
    return roots.length ? roots.slice(0, 5) : fallbackRootCategories;
  }, [categories]);

  return (
    <main className={tw("bg-[var(--vanta-bg)] text-[var(--vanta-text)]")}>
      {/* HERO */}
      <section className={tw("relative min-h-[500px] overflow-hidden sm:min-h-[590px] lg:min-h-[650px]")}>
        <img
          src={heroImage}
          alt="Vanta fashion collection"
          className={tw("absolute inset-0 h-full w-full object-cover object-center")}
        />
        <div
          className={tw(
            "absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-black/5"
          )}
        />

        <div
          className={tw(
            "relative mx-auto flex min-h-[500px] max-w-[1280px] items-center px-5 py-20 sm:min-h-[590px] sm:px-8 lg:min-h-[650px] lg:px-10"
          )}
        >
          <div className={tw("max-w-[620px] text-white")}>
            <p className={tw("mb-4 text-[10px] font-semibold uppercase tracking-[0.32em] text-[#d8b56b] sm:text-xs")}>
              New Collection
            </p>
            <h1
              className={tw(
                "font-serif text-[46px] leading-[0.95] tracking-[-0.045em] sm:text-6xl lg:text-[76px]"
              )}
            >
              Elevate
              <br />
              <em className={tw("font-normal")}>your style.</em>
            </h1>
            <p
              className={tw(
                "mt-5 max-w-[420px] text-sm leading-6 text-white/85 sm:text-base sm:leading-7"
              )}
            >
              Timeless designs. Premium quality.
              <br className={tw("hidden sm:block")} />
              Made for every you.
            </p>
            <Link
              to="/category"
              className={tw(
                "mt-7 inline-flex items-center gap-3 rounded-md bg-black px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.08em] text-white transition hover:bg-black/80 sm:px-7"
              )}
            >
              Shop Collection
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        <div className={tw("absolute bottom-5 left-1/2 flex -translate-x-1/2 gap-2")}>
          {[0, 1, 2].map((dot) => (
            <span
              key={dot}
              className={tw(
                "h-1.5 w-1.5 rounded-full border border-white/80",
                dot === 0 ? "bg-white" : "bg-transparent"
              )}
            />
          ))}
        </div>
      </section>

      {/* CATEGORY */}
      <section className={tw("px-4 py-10 sm:px-8 sm:py-14 lg:px-10 lg:py-16")}>
        <div className={tw("mx-auto max-w-[1280px]")}>
          <div className={tw("mb-7 flex items-end justify-between gap-4 sm:mb-9")}>
            <div>
              <p className={tw("text-[9px] font-bold uppercase tracking-[0.3em] text-[var(--vanta-muted)] sm:text-[10px]")}>
                Shop by Category
              </p>
              <h2 className={tw("mt-2 font-serif text-3xl tracking-[-0.04em] sm:text-4xl lg:text-5xl")}>
                Find your next favorite.
              </h2>
            </div>
            <Link
              to="/category"
              className={tw("hidden shrink-0 items-center gap-2 text-xs font-semibold uppercase tracking-[0.08em] sm:flex")}
            >
              View All <ArrowRight size={15} />
            </Link>
          </div>

          <div
            className={tw(
              "grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5"
            )}
          >
            {rootCategories.map((category, index) => {
              const slug = category.slug || normalizeCategory(category.name);
              const image = category.image || categoryImage(category);

              return (
                <Link
                  key={category._id || slug}
                  to={`/category/${slug}`}
                  className={tw(
                    "group overflow-hidden rounded-md border border-[var(--vanta-border)] bg-[var(--vanta-surface)]"
                  )}
                >
                  <div className={tw("relative aspect-[0.94] overflow-hidden bg-[#f3f1ed]")}>
                    <img
                      src={image || heroImage}
                      alt={category.name}
                      className={tw(
                        "h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
                      )}
                    />
                  </div>
                  <div className={tw("flex items-center justify-between px-3 py-3 sm:px-4 sm:py-4")}>
                    <div>
                      <span className={tw("text-[9px] tracking-[0.2em] text-[var(--vanta-muted)]")}>
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <h3 className={tw("mt-1 font-serif text-xl sm:text-2xl")}>
                        {category.name}
                      </h3>
                    </div>
                    <ArrowRight size={15} />
                  </div>
                </Link>
              );
            })}
          </div>

          <Link
            to="/category"
            className={tw("mt-5 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.08em] sm:hidden")}
          >
            View All <ArrowRight size={15} />
          </Link>
        </div>
      </section>

      {/* TRENDING */}
      <section className={tw("border-y border-[var(--vanta-border)] bg-[var(--vanta-surface)] px-4 py-10 sm:px-8 sm:py-14 lg:px-10 lg:py-16")}>
        <div className={tw("mx-auto max-w-[1280px]")}>
          <div className={tw("mb-7 flex items-end justify-between gap-4 sm:mb-9")}>
            <div>
              <p className={tw("text-[9px] font-bold uppercase tracking-[0.3em] text-[var(--vanta-muted)] sm:text-[10px]")}>
                Trending Now
              </p>
              <h2 className={tw("mt-2 font-serif text-3xl tracking-[-0.04em] sm:text-4xl lg:text-5xl")}>
                Popular picks.
              </h2>
            </div>
            <Link
              to="/products"
              className={tw("inline-flex items-center gap-2 rounded-full border border-[var(--vanta-border)] px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.08em] sm:px-5")}
            >
              Shop All <ArrowRight size={14} />
            </Link>
          </div>

          <div
            className={tw(
              "grid grid-cols-2 gap-x-3 gap-y-7 sm:grid-cols-3 sm:gap-x-4 sm:gap-y-9 lg:grid-cols-4 xl:grid-cols-4"
            )}
          >
            {products.slice(0, 8).map((product, index) => (
              <Link
                key={product._id}
                to={`/products/${product.slug}`}
                className={tw("group min-w-0")}
              >
                <div className={tw("relative aspect-[0.82] overflow-hidden rounded-md bg-[#f2f1ee]")}>
                  {product.images?.[0] ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className={tw("h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]")}
                    />
                  ) : (
                    <span className={tw("flex h-full items-center justify-center font-serif text-2xl")}>
                      VANTA
                    </span>
                  )}

                  <span className={tw("absolute left-3 top-3 text-[9px] font-semibold tracking-[0.16em] text-black/50")}>
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <button
                    type="button"
                    aria-label="Wishlist"
                    onClick={(event) => event.preventDefault()}
                    className={tw(
                      "absolute right-2.5 top-2.5 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-sm transition hover:bg-white"
                    )}
                  >
                    <Heart size={15} />
                  </button>
                </div>

                <div className={tw("pt-3")}>
                  <h3 className={tw("truncate text-xs font-medium sm:text-sm")}>
                    {product.name}
                  </h3>
                  <p className={tw("mt-1 text-xs font-semibold sm:text-sm")}>
                    {money(product.price)}
                  </p>
                  <div className={tw("mt-2 flex items-center justify-between")}>
                    <div className={tw("flex items-center gap-0.5 text-[#c99824]")}>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} size={10} fill="currentColor" />
                      ))}
                      <span className={tw("ml-1 text-[9px] text-[var(--vanta-muted)]")}>
                        ({product.reviews?.length || product.reviewCount || 0})
                      </span>
                    </div>
                    <span className={tw("flex h-7 w-7 items-center justify-center rounded-full bg-black text-white")}>
                      <ShoppingBag size={12} />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {!products.length && (
            <div className={tw("py-16 text-center text-sm text-[var(--vanta-muted)]")}>
              Trending products will appear here.
            </div>
          )}
        </div>
      </section>

      {/* PROMO */}
      <section className={tw("px-4 py-7 sm:px-8 sm:py-10 lg:px-10")}>
        <div
          className={tw(
            "relative mx-auto min-h-[230px] max-w-[1280px] overflow-hidden rounded-lg bg-[#101010] px-6 py-10 text-white sm:min-h-[280px] sm:px-10 sm:py-12 lg:px-16"
          )}
        >
          <div className={tw("absolute -right-10 top-1/2 h-56 w-56 -translate-y-1/2 rounded-full bg-[#b78b42]/20 blur-3xl sm:right-20 sm:h-72 sm:w-72")} />
          <div className={tw("relative max-w-[620px]")}>
            <p className={tw("text-[10px] font-bold uppercase tracking-[0.28em] text-[#d5ae65]")}>
              Limited Time Only
            </p>
            <h2 className={tw("mt-3 font-serif text-4xl tracking-[-0.04em] sm:text-6xl")}>
              Up to <span className={tw("text-[#d5ae65]")}>30%</span> off
            </h2>
            <p className={tw("mt-2 text-sm text-white/70")}>
              On selected styles. Don&apos;t miss out.
            </p>
            <Link
              to="/products"
              className={tw("mt-6 inline-flex items-center gap-3 rounded-md bg-[#d5ae65] px-5 py-3 text-xs font-semibold text-black")}
            >
              Shop Offers <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section className={tw("border-t border-[var(--vanta-border)] bg-[var(--vanta-bg)] px-4 py-12 sm:px-8 sm:py-16 lg:px-10 lg:py-20")}>
        <div className={tw("mx-auto max-w-[1240px]")}>
          <div className={tw("mb-8 text-center sm:mb-10")}>
            <p className={tw("text-[9px] font-bold uppercase tracking-[0.3em] text-[var(--vanta-muted)] sm:text-[10px]")}>
              Customer Love
            </p>
            <h2 className={tw("mt-3 font-serif text-3xl tracking-[-0.04em] sm:text-4xl lg:text-5xl")}>
              What our customers say.
            </h2>
          </div>

          <div className={tw("grid gap-4 md:grid-cols-3")}>
            {reviews.map((review) => (
              <article
                key={review.name}
                className={tw(
                  "flex min-h-[205px] flex-col justify-between rounded-md border border-[var(--vanta-border)] bg-[var(--vanta-surface)] p-5 sm:p-7"
                )}
              >
                <div>
                  <div className={tw("flex gap-1 text-[#c99824]")} aria-label="5 star review">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Star key={index} size={13} fill="currentColor" />
                    ))}
                  </div>
                  <p className={tw("mt-5 text-sm leading-6 text-[var(--vanta-text)]")}>
                    “{review.text}”
                  </p>
                </div>
                <div className={tw("mt-6 border-t border-[var(--vanta-border)] pt-4")}>
                  <p className={tw("text-sm font-semibold")}>{review.name}</p>
                  <p className={tw("mt-1 text-[11px] text-[var(--vanta-muted)]")}>
                    Verified Buyer
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}