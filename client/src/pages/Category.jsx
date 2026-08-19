import { useEffect, useMemo, useState } from "react";
import { ArrowRight, ArrowUpRight, Loader2 } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import categoryService from "../services/categoryService";
import Products from "./Products";
import heroImage from "../assets/category/hero.jpg";
import {
  categoryImage,
  fallbackRootCategories,
  getCategoryChildren,
  getRootCategories,
  normalizeCategory,
} from "../data/storeCategories";

const getCategoryId = (category) => String(category?._id || category?.id || "");

export default function Category() {
  const { slug } = useParams();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    categoryService
      .getCategories()
      .then((response) => {
        const list = response.data?.categories || response.categories || response.data || [];
        if (!cancelled) setCategories(Array.isArray(list) ? list : []);
      })
      .catch((error) => console.error("Failed to load categories:", error))
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, []);

  const roots = useMemo(() => getRootCategories(categories), [categories]);

  const active = useMemo(() => {
    if (!slug) return null;
    const wanted = normalizeCategory(slug);
    return categories.find(
      (category) => normalizeCategory(category.slug || category.name) === wanted
    ) || null;
  }, [categories, slug]);

  if (slug) {
    return (
      <main className="min-h-screen bg-[var(--vanta-bg)] text-[var(--vanta-text)]">
        <Products categorySlug={slug} />
      </main>
    );
  }

  const displayRoots = roots.length ? roots : fallbackRootCategories;

  return (
    <main className="min-h-screen bg-[var(--vanta-bg)] text-[var(--vanta-text)]">
      <section className="mx-auto max-w-[1280px] px-5 pb-16 pt-10 sm:px-8 lg:px-10 lg:pt-14">
        <div className="max-w-3xl">
          <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[var(--vanta-muted)]">VANTA COLLECTION</p>
          <h1 className="mt-3 font-serif text-5xl tracking-[-0.05em] sm:text-6xl">Shop by category.</h1>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-[var(--vanta-muted)]">
            Explore the five VANTA worlds, then narrow down to the exact style you want.
          </p>
        </div>

        {loading && (
          <div className="mt-10 flex justify-center"><Loader2 className="animate-spin text-[var(--vanta-muted)]" size={20} /></div>
        )}

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {displayRoots.map((category, index) => {
            const key = category.slug || normalizeCategory(category.name);
            const image = category.image || categoryImage(category) || heroImage;
            const children = getCategoryChildren(categories, category);
            const fallbackChildren = category.children || [];

            return (
              <article key={getCategoryId(category) || key} className="group min-w-0">
                <Link to={`/category/${key}`} className="block">
                  <div className="relative aspect-[0.82] overflow-hidden rounded-[2px] bg-[var(--vanta-soft)]">
                    <img src={image} alt={category.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.035]" loading="lazy" />
                    <span className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-stone-900 opacity-0 backdrop-blur transition group-hover:opacity-100">
                      <ArrowUpRight size={16} />
                    </span>
                    <span className="absolute left-3 top-3 text-[9px] font-bold tracking-[0.18em] text-white drop-shadow">{String(index + 1).padStart(2, "0")}</span>
                  </div>
                </Link>

                <div className="pt-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="font-serif text-xl">{category.name}</h2>
                      <p className="mt-1 text-[11px] leading-5 text-[var(--vanta-muted)]">{category.description || "Designed for modern everyday style."}</p>
                    </div>
                    <ArrowRight size={14} className="mt-1 shrink-0 text-[var(--vanta-muted)]" />
                  </div>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {(children.length ? children : fallbackChildren).map((child) => {
                      const childSlug = typeof child === "string" ? normalizeCategory(child) : child.slug;
                      const childName = typeof child === "string" ? child : child.name;
                      return (
                        <Link
                          key={childSlug}
                          to={`/category/${childSlug}`}
                          className="border border-[var(--vanta-border)] px-2.5 py-1.5 text-[9px] font-semibold uppercase tracking-[0.08em] text-[var(--vanta-muted)] transition hover:border-[var(--vanta-text)] hover:text-[var(--vanta-text)]"
                        >
                          {childName}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
