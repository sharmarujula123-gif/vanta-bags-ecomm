import { tw } from "../utils/twStyles.js";
import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Heart,
  SlidersHorizontal,
  X,
  Truck,
  ShieldCheck,
  RefreshCw,
  Headphones,
} from "lucide-react";

import productService from "../services/productService";
import categoryService from "../services/categoryService";
import useWishlistStore from "../store/wishlistStore";
import heroImage from "../assets/category/hero.jpg";

const CATEGORY_HEROES = {
  backpacks: {
    title: "Backpacks",
    subtitle: "Functional. Durable. Made for your journey.",
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1800&q=85",
  },
  "laptop-bags": {
    title: "Laptop Bags",
    subtitle: "Polished protection for work and everyday carry.",
    image:
      "https://images.unsplash.com/photo-1581605405669-fcdf81165afa?auto=format&fit=crop&w=1800&q=85",
  },
  "duffle-bags": {
    title: "Duffle Bags",
    subtitle: "Built for weekends, workouts and longer escapes.",
    image:
      "https://images.unsplash.com/photo-1556306535-38febf6782e7?auto=format&fit=crop&w=1800&q=85",
  },
  handbags: {
    title: "Handbags",
    subtitle: "Refined silhouettes for everyday elegance.",
    image:
      "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=1800&q=85",
  },
  "travel-bags": {
    title: "Travel Bags",
    subtitle: "Smart organization for the road ahead.",
    image:
      "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=1800&q=85",
  },
};

const formatPrice = (value) =>
  `₹${Number(value || 0).toLocaleString("en-IN")}`;

const normalizeCategoryKey = (value = "") =>
  String(value)
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const unwrapList = (payload, keys = []) => {
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

const getCategoryId = (category) =>
  String(
    category?._id ||
      category?.id ||
      category?.categoryId ||
      category?.category?._id ||
      category?.category?.id ||
      ""
  );

const getCategoryKey = (category) => {
  const value =
    category?.slug ||
    category?.name ||
    category?.category?.slug ||
    category?.category?.name ||
    getCategoryId(category);

  return value ? normalizeCategoryKey(value) : "";
};

const getParentId = (category) => {
  const parent = category?.parentCategory;

  if (!parent) return "";

  return String(parent?._id || parent?.id || parent || "");
};

const getParentKey = (category) => {
  const parent = category?.parentCategory;

  return normalizeCategoryKey(parent?.slug || parent?.name || "");
};

const normalizeImageUrl = (value) => {
  if (!value || typeof value !== "string") return "";

  const markdownMatch = value.match(/\((https?:\/\/[^)]+)\)/);

  if (markdownMatch) {
    return markdownMatch[1];
  }

  return value.trim();
};

const Products = ({ categorySlug = "" }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const urlCategory =
    searchParams.get("category") || categorySlug || "";

  const urlSearch = searchParams.get("search") || "";

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const [selectedCategory, setSelectedCategory] =
    useState(urlCategory);

  const [sort, setSort] = useState("newest");

  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const [featured, setFeatured] = useState(false);

  const [colorFilter, setColorFilter] = useState("");
  const [materialFilter, setMaterialFilter] = useState("");

  const [page, setPage] = useState(1);

  const wishlistItems = useWishlistStore(
    (state) => state.items
  );

  const toggleWishlist = useWishlistStore(
    (state) => state.toggle
  );

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalProducts: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showFilters, setShowFilters] = useState(false);
  const [retryKey, setRetryKey] = useState(0);

  const PRICE_MIN = 500;
  const PRICE_MAX = 10000;
  const PRICE_STEP = 500;

  /*
   * Keep URL and local state synchronized.
   */
  useEffect(() => {
    setSelectedCategory(urlCategory);
    setSearch(urlSearch);
    setSearchInput(urlSearch);
    setPage(1);
  }, [urlCategory, urlSearch]);

  /*
   * Load categories.
   */
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await categoryService.getCategories();

        const list = unwrapList(data, [
          "categories",
          "data",
          "results",
          "items",
        ]);

        setCategories(list);
      } catch (err) {
        console.error("Failed to load categories:", err);
      } finally {
        setCategoriesLoading(false);
      }
    };

    loadCategories();
  }, []);

  /*
   * Find currently selected category.
   */
  const activeCategory = useMemo(() => {
    if (!selectedCategory) return null;

    const selectedKey =
      normalizeCategoryKey(selectedCategory);

    return (
      categories.find((category) => {
        const slug = normalizeCategoryKey(
          category.slug ||
            category.category?.slug ||
            ""
        );

        const name = normalizeCategoryKey(
          category.name ||
            category.category?.name ||
            ""
        );

        const id = getCategoryId(category);
        const key = getCategoryKey(category);

        return (
          id === String(selectedCategory) ||
          slug === selectedKey ||
          name === selectedKey ||
          key === selectedKey
        );
      }) || null
    );
  }, [categories, selectedCategory]);

  const activeCategoryId = getCategoryId(activeCategory);

  /*
   * Find parent category.
   */
  const parentCategory = useMemo(() => {
    if (!activeCategory?.parentCategory) {
      return null;
    }

    const parentId = getParentId(activeCategory);
    const parentKey = getParentKey(activeCategory);

    return (
      categories.find(
        (category) =>
          getCategoryId(category) === parentId ||
          normalizeCategoryKey(
            category.slug || category.name
          ) === parentKey
      ) ||
      (typeof activeCategory.parentCategory === "object"
        ? activeCategory.parentCategory
        : null)
    );
  }, [activeCategory, categories]);

  /*
   * Find children/sibling categories.
   */
  const siblingCategories = useMemo(() => {
    if (!activeCategory) return [];

    /*
     * If we are inside a subcategory, show
     * all subcategories belonging to the same parent.
     */
    if (parentCategory) {
      const parentId = getCategoryId(parentCategory);

      const parentKey = normalizeCategoryKey(
        parentCategory.slug || parentCategory.name
      );

      return categories.filter((category) => {
        const relationId = getParentId(category);
        const relationKey = getParentKey(category);

        return (
          relationId === parentId ||
          relationKey === parentKey
        );
      });
    }

    /*
     * If the selected category is a root category,
     * show its children.
     */
    const activeId = getCategoryId(activeCategory);

    const activeKey = normalizeCategoryKey(
      activeCategory.slug || activeCategory.name
    );

    const children = categories.filter((category) => {
      const relationId = getParentId(category);
      const relationKey = getParentKey(category);

      return (
        relationId === activeId ||
        relationKey === activeKey
      );
    });

    return children.length
      ? children
      : categories.filter(
          (category) => !category.parentCategory
        );
  }, [activeCategory, parentCategory, categories]);

  /*
   * Load products.
   */
  useEffect(() => {
    if (selectedCategory && categoriesLoading) {
      setLoading(true);
      return;
    }

    const parseProductsResponse = (data) => {
      const responseData = data?.data || data || {};

      return {
        products:
          responseData.products ||
          responseData.items ||
          data?.products ||
          data?.items ||
          [],

        pagination:
          responseData.pagination ||
          data?.pagination ||
          null,
      };
    };

    /*
     * IMPORTANT:
     *
     * Check whether a product belongs to the selected
     * category OR one of its child categories.
     */
    const productCategoryMatches = (product) => {
      if (!selectedCategory) {
        return true;
      }

      const productCategory = product?.category;

      if (!productCategory) {
        return false;
      }

      const wanted = normalizeCategoryKey(
        selectedCategory
      );

      const productId = getCategoryId(productCategory);

      const productSlug = normalizeCategoryKey(
        productCategory.slug ||
          productCategory.name ||
          ""
      );

      /*
       * Exact category match.
       */
      if (
        productId === String(selectedCategory) ||
        productSlug === wanted
      ) {
        return true;
      }

      /*
       * Parent category match.
       *
       * Example:
       *
       * Footwear
       *   ├── Sneakers
       *   ├── Boots
       *   ├── Sandals
       *   └── Heels
       *
       * Selecting Footwear should return products
       * from all four child categories.
       */
      if (activeCategory) {
        const activeId = getCategoryId(activeCategory);

        const activeSlug = normalizeCategoryKey(
          activeCategory.slug ||
            activeCategory.name ||
            ""
        );

        const productParentId =
          getParentId(productCategory);

        const productParentKey =
          getParentKey(productCategory);

        if (
          productParentId &&
          String(productParentId) === String(activeId)
        ) {
          return true;
        }

        if (
          productParentKey &&
          productParentKey === activeSlug
        ) {
          return true;
        }
      }

      return false;
    };

    const productMatches = (product) => {
      const price = Number(product?.price);

      if (!Number.isFinite(price)) {
        return false;
      }

      if (
        minPrice !== "" &&
        price < Number(minPrice)
      ) {
        return false;
      }

      if (
        maxPrice !== "" &&
        price > Number(maxPrice)
      ) {
        return false;
      }

      if (
        featured &&
        !product?.isFeatured
      ) {
        return false;
      }

      if (
        colorFilter &&
        !String(product?.color || "")
          .toLowerCase()
          .includes(colorFilter.toLowerCase())
      ) {
        return false;
      }

      if (
        materialFilter &&
        !String(product?.material || "")
          .toLowerCase()
          .includes(materialFilter.toLowerCase())
      ) {
        return false;
      }

      return true;
    };

    const loadProducts = async () => {
      setLoading(true);
      setError("");

      try {
        const min =
          minPrice === ""
            ? null
            : Number(minPrice);

        const max =
          maxPrice === ""
            ? null
            : Number(maxPrice);

        if (
          min !== null &&
          max !== null &&
          (Number.isNaN(min) ||
            Number.isNaN(max) ||
            min > max)
        ) {
          setProducts([]);

          setPagination({
            currentPage: 1,
            totalPages: 1,
            totalProducts: 0,
            hasNextPage: false,
            hasPreviousPage: false,
          });

          setError(
            "Please enter a valid price range: From must be less than or equal to To."
          );

          setLoading(false);

          return;
        }

        /*
         * Send category to backend.
         *
         * Root category:
         *   Footwear -> footwear ID
         *
         * Child category:
         *   Sneakers -> sneakers ID
         *
         * The backend expands root categories into
         * their children.
         */
        const params = {
          page,
          limit: 12,
          sort,
        };

        if (search.trim()) {
          params.search = search.trim();
        }

        if (selectedCategory) {
            params.category = selectedCategory;
          }

        if (min !== null) {
          params.minPrice = min;
        }

        if (max !== null) {
          params.maxPrice = max;
        }

        if (featured) {
          params.featured = true;
        }

        if (colorFilter) {
          params.color = colorFilter;
        }

        if (materialFilter) {
          params.material = materialFilter;
        }

        try {
          const data =
            await productService.getProducts(params);

          let parsed =
            parseProductsResponse(data);

          /*
           * Root categories such as Footwear do not own products
           * directly. Their products live in child categories such
           * as Sneakers, Heels, Flats, Boots, Sandals and Loafers.
           *
           * If the API returns an empty category result, fetch the
           * complete active catalog and resolve the category tree on
           * the frontend. This also makes the "All Footwear" button
           * reliable when an older backend/database is deployed.
           */
          if (selectedCategory && Number(parsed?.pagination?.totalProducts || 0) === 0) {
            const catalogData =
              await productService.getProducts({
                page: 1,
                limit: 100,
                sort,
                ...(search.trim() ? { search: search.trim() } : {}),
                ...(min !== null ? { minPrice: min } : {}),
                ...(max !== null ? { maxPrice: max } : {}),
                ...(featured ? { featured: true } : {}),
                ...(colorFilter ? { color: colorFilter } : {}),
                ...(materialFilter ? { material: materialFilter } : {}),
              });

            const catalog = parseProductsResponse(catalogData);

            const selectedId = activeCategoryId;
            const selectedKey = normalizeCategoryKey(selectedCategory);

            const allowedCategoryIds = new Set(
              categories
                .filter((category) => {
                  if (!selectedId) return false;
                  if (getCategoryId(category) === selectedId) return true;

                  let relation = category?.parentCategory;
                  while (relation) {
                    const relationId =
                      typeof relation === "object"
                        ? getCategoryId(relation)
                        : String(relation);
                    const relationKey =
                      typeof relation === "object"
                        ? normalizeCategoryKey(relation.slug || relation.name || "")
                        : "";

                    if (relationId === selectedId || relationKey === selectedKey) {
                      return true;
                    }

                    const parent = categories.find(
                      (candidate) =>
                        getCategoryId(candidate) === relationId ||
                        normalizeCategoryKey(candidate.slug || candidate.name || "") === relationKey
                    );
                    relation = parent?.parentCategory || null;
                  }

                  return false;
                })
                .map(getCategoryId)
                .filter(Boolean)
            );

            if (selectedId) allowedCategoryIds.add(selectedId);

            const matching = catalog.products.filter((product) => {
              const productCategory = product?.category;
              if (!productCategory) return false;

              const productId = getCategoryId(productCategory);
              if (allowedCategoryIds.has(productId)) return true;

              const productKey = normalizeCategoryKey(
                productCategory.slug || productCategory.name || ""
              );

              if (productKey === selectedKey) return true;

              const parent = productCategory.parentCategory;
              if (parent) {
                const parentId =
                  typeof parent === "object"
                    ? getCategoryId(parent)
                    : String(parent);
                const parentKey =
                  typeof parent === "object"
                    ? normalizeCategoryKey(parent.slug || parent.name || "")
                    : "";
                if (parentId === selectedId || parentKey === selectedKey) return true;
              }

              return false;
            });

            const start = (page - 1) * 12;
            const totalPages = Math.max(1, Math.ceil(matching.length / 12));

            parsed = {
              products: matching.slice(start, start + 12),
              pagination: {
                currentPage: page,
                itemsPerPage: 12,
                totalProducts: matching.length,
                totalPages,
                hasNextPage: page < totalPages,
                hasPreviousPage: page > 1,
              },
            };
          }

          /*
           * Do not filter a correctly paginated backend response a
           * second time. The backend category query already contains
           * the selected category and its descendants.
           */
          setProducts(parsed.products);
          setPagination(
            parsed.pagination || {
              currentPage: page,
              totalPages: 1,
              totalProducts: parsed.products.length,
              hasNextPage: false,
              hasPreviousPage: false,
            }
          );
        } catch (categoryError) {
          /*
           * Fallback for older databases where
           * category slugs/names may not match perfectly.
           */
          if (!selectedCategory) {
            throw categoryError;
          }

          const fallbackData =
            await productService.getProducts({
              page: 1,
              limit: 100,
              sort,

              ...(search.trim()
                ? { search: search.trim() }
                : {}),

              ...(min !== null
                ? { minPrice: min }
                : {}),

              ...(max !== null
                ? { maxPrice: max }
                : {}),

              ...(featured
                ? { featured: true }
                : {}),

              ...(colorFilter
                ? { color: colorFilter }
                : {}),

              ...(materialFilter
                ? { material: materialFilter }
                : {}),
            });

          const fallback =
            parseProductsResponse(
              fallbackData
            );

          const matching =
            fallback.products.filter(
              (product) =>
                productMatches(product) &&
                productCategoryMatches(product)
            );

          const start =
            (page - 1) * 12;

          const visible =
            matching.slice(
              start,
              start + 12
            );

          const totalPages = Math.max(
            1,
            Math.ceil(
              matching.length / 12
            )
          );

          setProducts(visible);

          setPagination({
            currentPage: page,
            itemsPerPage: 12,
            totalProducts:
              matching.length,
            totalPages,
            hasNextPage:
              page < totalPages,
            hasPreviousPage:
              page > 1,
          });
        }
      } catch (err) {
        console.error(
          "Failed to load products:",
          err
        );

        setProducts([]);

        setError(
          err.response?.data?.message ||
            "Unable to load products. Check that the backend is running on port 5000."
        );
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [
    search,
    selectedCategory,
    activeCategoryId,
    categoriesLoading,
    sort,
    minPrice,
    maxPrice,
    featured,
    colorFilter,
    materialFilter,
    page,
    retryKey,
  ]);

  const activeCategoryName =
    activeCategory?.name || "";

  /*
   * Hero section.
   */
  const hero = activeCategory
    ? {
        title: activeCategory.name,

        subtitle:
          activeCategory.description ||
          `Explore the ${activeCategory.name.toLowerCase()} collection.`,

        image:
          activeCategory.image ||
          CATEGORY_HEROES[
            selectedCategory
          ]?.image ||
          CATEGORY_HEROES.backpacks.image,
      }
    : {
        title: "All Collections",
        subtitle:
          "Five categories. One VANTA point of view.",
        image: heroImage,
      };

  const categoryScope =
    parentCategory || activeCategory;

  const hasFilters =
    search ||
    selectedCategory ||
    minPrice ||
    maxPrice ||
    featured ||
    colorFilter ||
    materialFilter;

  /*
   * Category selection.
   */
  const chooseCategory = (categoryOrSlug) => {
    if (!categoryOrSlug) {
      setSelectedCategory("");
      setPage(1);
      setSearchParams({});
      return;
    }
  
    let category = null;
  
    if (typeof categoryOrSlug === "object") {
      category = categoryOrSlug;
    } else {
      const wanted = normalizeCategoryKey(
        categoryOrSlug
      );
  
      category = categories.find((item) => {
        const slug = normalizeCategoryKey(
          item.slug || item.category?.slug || ""
        );
  
        const name = normalizeCategoryKey(
          item.name || item.category?.name || ""
        );
  
        const id = getCategoryId(item);
  
        return (
          slug === wanted ||
          name === wanted ||
          id === String(categoryOrSlug)
        );
      });
    }
  
    const key = category
      ? normalizeCategoryKey(
          category.slug || category.name
        )
      : normalizeCategoryKey(categoryOrSlug);
  
    setSelectedCategory(key);
    setPage(1);
  
    setSearchParams({
      category: key,
    });
  };


  const resetFilters = () => {
    setSearch("");
    setSearchInput("");
    setSelectedCategory("");
    setSort("newest");
    setMinPrice("");
    setMaxPrice("");
    setFeatured(false);
    setColorFilter("");
    setMaterialFilter("");
    setPage(1);
    setSearchParams({});
  };

  const submitSearch = (event) => {
    event.preventDefault();

    setSearch(searchInput);
    setPage(1);
  };

  return (
    <main
      className={tw(
        "vanta-collection-page"
      )}
    >
      <div
        className={tw(
          "vanta-collection-shell !w-full !max-w-none"
        )}
      >
        <section
          className={tw(
            "vanta-collection-hero !h-[235px] max-[640px]:!h-[220px]"
          )}
        >
          <img
            src={hero.image}
            alt={hero.title}
          />

          <div
            className={tw(
              "vanta-collection-hero-overlay"
            )}
          />

          <div
            className={tw(
              "vanta-collection-hero-copy !w-full !max-w-[1280px] !mx-auto !left-0 !right-0 !px-6 sm:!px-10 lg:!px-14"
            )}
          >
            <div>
              <div
                className={tw(
                  "mb-3 flex items-center gap-2 text-[9px] text-white/70"
                )}
              >
                <Link
                  to="/"
                  className={tw(
                    "hover:text-white"
                  )}
                >
                  Home
                </Link>

                <span>›</span>

                <Link
                  to="/category"
                  className={tw(
                    "hover:text-white"
                  )}
                >
                  Collections
                </Link>

                {parentCategory && (
                  <>
                    <span>›</span>

                    <Link
                      to={`/category/${parentCategory.slug}`}
                      className={tw(
                        "hover:text-white"
                      )}
                    >
                      {parentCategory.name}
                    </Link>
                  </>
                )}

                <span>›</span>

                <strong className="font-semibold text-white">
                  {hero.title}
                </strong>
              </div>

              <p
                className={tw(
                  "vanta-eyebrow"
                )}
              >
                VANTA COLLECTION
              </p>

              <h1>{hero.title}</h1>

              <p>{hero.subtitle}</p>
            </div>
          </div>
        </section>

        {activeCategory &&
          siblingCategories.length > 0 && (
            <div
              className={tw(
                "vanta-category-pills"
              )}
            >
              {parentCategory && (
                <button
                  type="button"
                  onClick={() =>
                    chooseCategory(
                      parentCategory
                    )
                  }
                  className={tw(
                    `vanta-category-pill ${
                      normalizeCategoryKey(
                        selectedCategory
                      ) ===
                      normalizeCategoryKey(
                        parentCategory.slug ||
                          parentCategory.name
                      )
                        ? "active"
                        : ""
                    }`
                  )}
                >
                  All {parentCategory.name}
                </button>
              )}


              {siblingCategories.map(
                (category) => {
                  const key =
                    getCategoryKey(
                      category
                    );

                  const active =
                    normalizeCategoryKey(
                      selectedCategory
                    ) ===
                    normalizeCategoryKey(
                      key
                    );

                  return (
                    <Link
                      key={
                        getCategoryId(
                          category
                        ) || key
                      }
                      to={`/category/${key}`}
                      className={tw(
                        `vanta-category-pill ${
                          active
                            ? "active"
                            : ""
                        }`
                      )}
                    >
                      {category.name}
                    </Link>
                  );
                }
              )}
            </div>
          )}

        <div
          className={tw(
            "vanta-collection-shell !max-w-[1240px] !w-[calc(100%-40px)] max-[640px]:!w-[calc(100%-24px)]"
          )}
        >
          <div
            className={tw(
              "vanta-collection-toolbar !min-h-[76px] !grid-cols-[1fr_auto] max-[640px]:!grid-cols-[auto_1fr_auto]"
            )}
          >
            <div
              className={tw(
                "flex items-center gap-3"
              )}
            >
              <button
                type="button"
                onClick={() =>
                  setShowFilters(true)
                }
                className={tw(
                  "vanta-filter-toggle"
                )}
              >
                <SlidersHorizontal
                  size={15}
                />

                Filters

                {hasFilters && (
                  <span
                    className={tw(
                      "ml-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--vanta-text)] px-1 text-[8px] text-[var(--vanta-bg)]"
                    )}
                  >
                    •
                  </span>
                )}
              </button>

              {/* <p
                className={tw(
                  "text-[11px] text-[var(--vanta-text)]"
                )}
              >
                Showing{" "}
                {products.length
                  ? `${
                      (pagination.currentPage -
                        1) *
                        12 +
                      1
                    }–${Math.min(
                      pagination.currentPage *
                        12,
                      pagination.totalProducts
                    )}`
                  : "0"}{" "}
                of{" "}
                {pagination.totalProducts}{" "}
                products
              </p> */}
            </div>

            <div
              className={tw(
                "vanta-sort-wrap"
              )}
            >
              <span>Sort by:</span>

              <select
                value={sort}
                onChange={(event) => {
                  setSort(
                    event.target.value
                  );

                  setPage(1);
                }}
              >
                <option value="newest">
                  Featured
                </option>

                <option value="popular">
                  Popular
                </option>

                <option value="price_asc">
                  Price: Low to High
                </option>

                <option value="price_desc">
                  Price: High to Low
                </option>

                <option value="name_asc">
                  Name: A-Z
                </option>
              </select>

              <ChevronDown size={14} />
            </div>
          </div>

          <div
            className={tw(
              `vanta-collection-layout ${
                showFilters
                  ? "filters-open"
                  : ""
              }`
            )}
          >
            {showFilters && (
              <button
                type="button"
                aria-label="Close filters"
                onClick={() =>
                  setShowFilters(false)
                }
                className={tw(
                  "vanta-filter-backdrop"
                )}
              />
            )}

            <aside
              className={tw(
                `vanta-collection-sidebar ${
                  showFilters
                    ? "is-open"
                    : ""
                }`
              )}
            >
              <div
                className={tw(
                  "vanta-filter-heading"
                )}
              >
                <div>
                  <p
                    className={tw(
                      "vanta-eyebrow"
                    )}
                  >
                    Refine
                  </p>

                  <h3>Filters</h3>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setShowFilters(false)
                  }
                  aria-label="Close filters"
                >
                  <X size={17} />
                </button>
              </div>

              <div
                className={tw(
                  "vanta-filter-block"
                )}
              >
                <div
                  className={tw(
                    "vanta-filter-title"
                  )}
                >
                  <span>Category</span>
                  <ChevronDown size={13} />
                </div>

                <label
                  className={tw(
                    "vanta-check-row"
                  )}
                >
                  <input
                    type="radio"
                    name="category"
                    checked={
                      !selectedCategory ||
                      (!!parentCategory &&
                        normalizeCategoryKey(
                          selectedCategory
                        ) ===
                          normalizeCategoryKey(
                            parentCategory.slug ||
                              parentCategory.name
                          ))
                    }
                    onChange={() =>
                      chooseCategory(
                        parentCategory ||
                          activeCategory ||
                          ""
                      )
                    }
                  />

                  <span>
                    All{" "}
                    {categoryScope?.name ||
                      "Collections"}
                  </span>
                </label>

                {siblingCategories.map(
                  (category) => {
                    const key =
                      getCategoryKey(
                        category
                      );

                    return (
                      <label
                        className={tw(
                          "vanta-check-row"
                        )}
                        key={
                          getCategoryId(
                            category
                          ) || key
                        }
                      >
                        <input
                          type="radio"
                          name="category"
                          checked={
                            normalizeCategoryKey(
                              selectedCategory
                            ) ===
                            normalizeCategoryKey(
                              key
                            )
                          }
                          onChange={() =>
                            chooseCategory(
                              category
                            )
                          }
                        />

                        <span>
                          {category.name}
                        </span>
                      </label>
                    );
                  }
                )}
              </div>

              <div
                className={tw(
                  "vanta-filter-block"
                )}
              >
                <div
                  className={tw(
                    "vanta-filter-title"
                  )}
                >
                  <span>
                    Price Range
                  </span>

                  <ChevronDown size={13} />
                </div>

                <div
                  className={tw(
                    "vanta-price-labels"
                  )}
                >
                  <span>
                    ₹
                    {Number(
                      minPrice ||
                        PRICE_MIN
                    ).toLocaleString(
                      "en-IN"
                    )}
                  </span>

                  <span>
                    ₹
                    {Number(
                      maxPrice ||
                        PRICE_MAX
                    ).toLocaleString(
                      "en-IN"
                    )}
                  </span>
                </div>

                <div className="relative mt-2 h-7">
                  <div className="absolute left-0 right-0 top-1/2 h-[2px] -translate-y-1/2 bg-[var(--vanta-border)]" />

                  <div
                    className="absolute top-1/2 h-[3px] -translate-y-1/2 bg-[var(--vanta-text)]"
                    style={{
                      left: `${
                        ((Number(
                          minPrice ||
                            PRICE_MIN
                        ) -
                          PRICE_MIN) /
                          (PRICE_MAX -
                            PRICE_MIN)) *
                        100
                      }%`,

                      right: `${
                        100 -
                        ((Number(
                          maxPrice ||
                            PRICE_MAX
                        ) -
                          PRICE_MIN) /
                          (PRICE_MAX -
                            PRICE_MIN)) *
                          100
                      }%`,
                    }}
                  />

                  <input
                    type="range"
                    min={PRICE_MIN}
                    max={PRICE_MAX}
                    step={PRICE_STEP}
                    value={Number(
                      minPrice ||
                        PRICE_MIN
                    )}
                    onChange={(event) => {
                      const value =
                        Number(
                          event.target
                            .value
                        );

                      if (
                        value <=
                        Number(
                          maxPrice ||
                            PRICE_MAX
                        )
                      ) {
                        setMinPrice(value);
                      }
                    }}
                    className={tw(
                      "vanta-range-input"
                    )}
                    aria-label="Minimum price"
                  />

                  <input
                    type="range"
                    min={PRICE_MIN}
                    max={PRICE_MAX}
                    step={PRICE_STEP}
                    value={Number(
                      maxPrice ||
                        PRICE_MAX
                    )}
                    onChange={(event) => {
                      const value =
                        Number(
                          event.target
                            .value
                        );

                      if (
                        value >=
                        Number(
                          minPrice ||
                            PRICE_MIN
                        )
                      ) {
                        setMaxPrice(value);
                      }
                    }}
                    className={tw(
                      "vanta-range-input max"
                    )}
                    aria-label="Maximum price"
                  />
                </div>
              </div>

              <div
                className={tw(
                  "vanta-filter-block"
                )}
              >
                <div
                  className={tw(
                    "vanta-filter-title"
                  )}
                >
                  <span>Color</span>
                  <ChevronDown size={13} />
                </div>

                <div
                  className={tw(
                    "vanta-color-swatches"
                  )}
                >
                  {[
                    ["Black", "#111111"],
                    ["Brown", "#6a4529"],
                    ["Tan", "#bd8d55"],
                    ["Cream", "#e5dccd"],
                    ["Grey", "#b9b8b4"],
                    ["Green", "#17694e"],
                    ["Pink", "#d9919b"],
                  ].map(
                    ([label, value]) => (
                      <button
                        type="button"
                        key={label}
                        title={label}
                        aria-label={`Filter ${label}`}
                        onClick={() =>
                          setColorFilter(
                            (current) =>
                              current ===
                              label
                                ? ""
                                : label
                          )
                        }
                        className={tw(
                          `vanta-color-dot ${
                            colorFilter ===
                            label
                              ? "active"
                              : ""
                          }`
                        )}
                        style={{
                          background:
                            value,
                        }}
                      />
                    )
                  )}
                </div>
              </div>

              <div
                className={tw(
                  "vanta-filter-block"
                )}
              >
                <div
                  className={tw(
                    "vanta-filter-title"
                  )}
                >
                  <span>Material</span>
                  <ChevronDown size={13} />
                </div>

                {[
                  "Leather",
                  "Vegan Leather",
                  "Canvas",
                  "Suede",
                ].map((material) => (
                  <label
                    className={tw(
                      "vanta-check-row"
                    )}
                    key={material}
                  >
                    <input
                      type="radio"
                      name="material"
                      checked={
                        materialFilter ===
                        material
                      }
                      onChange={() =>
                        setMaterialFilter(
                          (current) =>
                            current ===
                            material
                              ? ""
                              : material
                        )
                      }
                    />

                    <span>
                      {material}
                    </span>
                  </label>
                ))}
              </div>

              <div
                className={tw(
                  "vanta-filter-block"
                )}
              >
                <label
                  className={tw(
                    "vanta-check-row"
                  )}
                >
                  <input
                    type="checkbox"
                    checked={featured}
                    onChange={() =>
                      setFeatured(
                        (current) =>
                          !current
                      )
                    }
                  />

                  <span>
                    Featured pieces
                  </span>
                </label>
              </div>

              <button
                type="button"
                className={tw(
                  "vanta-filter-apply"
                )}
                onClick={() =>
                  setShowFilters(false)
                }
              >
                Apply filters
              </button>

              {hasFilters && (
                <button
                  type="button"
                  className={tw(
                    "vanta-filter-clear"
                  )}
                  onClick={resetFilters}
                >
                  Clear all
                </button>
              )}
            </aside>

            <section
              className={tw(
                "vanta-collection-results"
              )}
            >
              {loading && (
                <div
                  className={tw(
                    "vanta-collection-grid"
                  )}
                >
                  {Array.from({
                    length: 8,
                  }).map(
                    (_, index) => (
                      <div
                        className={tw(
                          "vanta-collection-product skeleton"
                        )}
                        key={index}
                      >
                        <div
                          className={tw(
                            "vanta-collection-product-image"
                          )}
                        />

                        <div className="skeleton-line wide" />

                        <div className="skeleton-line short" />
                      </div>
                    )
                  )}
                </div>
              )}

              {!loading && error && (
                <div
                  className={tw(
                    "vanta-collection-empty"
                  )}
                >
                  <h2>
                    Something went wrong
                  </h2>

                  <p>{error}</p>

                  <button
                    type="button"
                    onClick={() =>
                      setRetryKey(
                        (current) =>
                          current + 1
                      )
                    }
                  >
                    Try again
                  </button>
                </div>
              )}

              {!loading &&
                !error &&
                products.length === 0 && (
                  <div
                    className={tw(
                      "vanta-collection-empty"
                    )}
                  >
                    <h2>
                      No products found
                    </h2>

                    <p>
                      Try changing your
                      search or collection
                      filters.
                    </p>

                    <button
                      type="button"
                      onClick={
                        resetFilters
                      }
                    >
                      Clear filters
                    </button>
                  </div>
                )}

              {!loading &&
                !error &&
                products.length > 0 && (
                  <>
                    <div
                      className={tw(
                        "vanta-collection-grid"
                      )}
                    >
                      {products.map(
                        (product) => {
                          const isWishlisted =
                            wishlistItems.some(
                              (item) =>
                                item._id ===
                                product._id
                            );

                          const rating =
                            Number(
                              product
                                .rating
                                ?.average ||
                                product.averageRating ||
                                0
                            );

                          const color =
                            String(
                              product.color ||
                                ""
                            ).toLowerCase();

                          return (
                            <article
                              className={tw(
                                "vanta-collection-product"
                              )}
                              key={
                                product._id
                              }
                            >
                              <Link
                                to={`/products/${product.slug}`}
                                className={tw(
                                  "vanta-collection-product-link"
                                )}
                              >
                                <div
                                  className={tw(
                                    "vanta-collection-product-image"
                                  )}
                                >
                                  {normalizeImageUrl(
                                    product
                                      .images?.[0]
                                  ) ? (
                                    <img
                                      src={normalizeImageUrl(
                                        product
                                          .images?.[0]
                                      )}
                                      alt={
                                        product.name
                                      }
                                    />
                                  ) : (
                                    <div
                                      className={tw(
                                        "vanta-image-placeholder"
                                      )}
                                    >
                                      VANTA
                                    </div>
                                  )}

                                  {product.isFeatured &&
                                    product.stock >
                                      0 && (
                                      <span
                                        className={tw(
                                          "vanta-collection-badge"
                                        )}
                                      >
                                        NEW
                                      </span>
                                    )}

                                  {product.stock ===
                                    0 && (
                                    <span
                                      className={tw(
                                        "vanta-collection-badge sold"
                                      )}
                                    >
                                      Sold out
                                    </span>
                                  )}

                                  <button
                                    type="button"
                                    className={tw(
                                      `vanta-product-heart ${
                                        isWishlisted
                                          ? "active"
                                          : ""
                                      }`
                                    )}
                                    aria-label={
                                      isWishlisted
                                        ? "Remove from wishlist"
                                        : "Add to wishlist"
                                    }
                                    onClick={(
                                      event
                                    ) => {
                                      event.preventDefault();

                                      toggleWishlist(
                                        product
                                      );
                                    }}
                                  >
                                    <Heart
                                      size={15}
                                      fill={
                                        isWishlisted
                                          ? "currentColor"
                                          : "none"
                                      }
                                    />
                                  </button>
                                </div>

                                <div
                                  className={tw(
                                    "vanta-collection-product-meta"
                                  )}
                                >
                                  <div className="flex items-start justify-between gap-2">
                                    <h3>
                                      {
                                        product.name
                                      }
                                    </h3>

                                    {product.compareAtPrice >
                                      product.price && (
                                      <span
                                        className={tw(
                                          "vanta-discount-badge"
                                        )}
                                      >
                                        -
                                        {Math.round(
                                          (1 -
                                            product.price /
                                              product.compareAtPrice) *
                                            100
                                        )}
                                        %
                                      </span>
                                    )}
                                  </div>

                                  <div className="mt-1 flex items-center gap-2">
                                    <p>
                                      {formatPrice(
                                        product.price
                                      )}
                                    </p>

                                    {product.compareAtPrice >
                                      product.price && (
                                      <span
                                        className={tw(
                                          "vanta-old-price inline"
                                        )}
                                      >
                                        {formatPrice(
                                          product.compareAtPrice
                                        )}
                                      </span>
                                    )}
                                  </div>

                                  {rating >
                                    0 && (
                                    <div
                                      className={tw(
                                        "vanta-rating"
                                      )}
                                    >
                                      <span>
                                        ★★★★★
                                      </span>

                                      <small>
                                        {rating.toFixed(
                                          1
                                        )}
                                      </small>
                                    </div>
                                  )}

                                  {color && (
                                    <div
                                      className={tw(
                                        "vanta-product-color-label"
                                      )}
                                    >
                                      <span
                                        className={tw(
                                          `vanta-mini-color ${normalizeCategoryKey(
                                            color
                                          )}`
                                        )}
                                      />

                                      {
                                        product.color
                                      }
                                    </div>
                                  )}
                                </div>
                              </Link>
                            </article>
                          );
                        }
                      )}
                    </div>

                    {pagination.totalPages >
                      1 && (
                      <div
                        className={tw(
                          "vanta-collection-pagination"
                        )}
                      >
                        <button
                          type="button"
                          disabled={
                            !pagination.hasPreviousPage
                          }
                          onClick={() =>
                            setPage(
                              (current) =>
                                Math.max(
                                  current - 1,
                                  1
                                )
                            )
                          }
                        >
                          <ChevronLeft
                            size={16}
                          />
                        </button>

                        {Array.from({
                          length: Math.min(
                            pagination.totalPages,
                            5
                          ),
                        }).map(
                          (_, index) => {
                            const pageNumber =
                              index + 1;

                            return (
                              <button
                                key={
                                  pageNumber
                                }
                                type="button"
                                className={tw(
                                  pageNumber ===
                                    pagination.currentPage
                                    ? "active"
                                    : ""
                                )}
                                onClick={() =>
                                  setPage(
                                    pageNumber
                                  )
                                }
                              >
                                {pageNumber}
                              </button>
                            );
                          }
                        )}

                        <button
                          type="button"
                          disabled={
                            !pagination.hasNextPage
                          }
                          onClick={() =>
                            setPage(
                              (current) =>
                                current + 1
                            )
                          }
                        >
                          <ChevronRight
                            size={16}
                          />
                        </button>
                      </div>
                    )}
                  </>
                )}
            </section>
          </div>
        </div>
      </div>

      <section
        className={tw(
          "vanta-collection-benefits"
        )}
      >
        {[
          [
            Truck,
            "Free Shipping",
            "On all orders over ₹999",
          ],
          [
            ShieldCheck,
            "Secure Payment",
            "100% secure checkout",
          ],
          [
            RefreshCw,
            "Easy Returns",
            "30-day return policy",
          ],
          [
            Headphones,
            "Customer Support",
            "We're here to help",
          ],
        ].map(
          ([Icon, title, text]) => (
            <div key={title}>
              <Icon
                size={27}
                strokeWidth={1.5}
              />

              <div>
                <strong>
                  {title}
                </strong>

                <span>{text}</span>
              </div>
            </div>
          )
        )}
      </section>
    </main>
  );
};

export default Products;