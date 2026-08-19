import { tw } from "../utils/twStyles.js";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";   

import productService from "../services/productService";
import categoryService from "../services/categoryService";
import useWishlistStore from "../store/wishlistStore";
import heroImage from "../assets/category/hero.jpg";
import {
  getCategoryId,
  getCategoryKey,
  getParentId,
  getParentKey,
  normalizeCategoryKey,
  unwrapList,
} from "../utils/productHelpers.js";
import CollectionHero from "../components/products/CollectionHero.jsx";
import CategoryPills from "../components/products/CategoryPills.jsx";
import CollectionToolbar from "../components/products/CollectionToolbar.jsx";
import FilterSidebar from "../components/products/FilterSidebar.jsx";
import ProductGrid from "../components/products/ProductGrid.jsx";
import Pagination from "../components/products/Pagination.jsx";
import CollectionBenefits from "../components/products/CollectionBenefits.jsx";

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
          heroImage,
      }
    : {
        title: "All Collections",
        subtitle:
          "Five categories. One VANTA point of view.",
        image: heroImage,
      };

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
        <CollectionHero hero={hero} parentCategory={parentCategory} />

        <CategoryPills
  activeCategory={activeCategory}
  siblingCategories={siblingCategories}
  parentCategory={parentCategory}
  selectedCategory={selectedCategory}
  chooseCategory={chooseCategory}
/>

        <div
          className={tw(
            "vanta-collection-shell !max-w-[1240px] !w-[calc(100%-40px)] max-[640px]:!w-[calc(100%-24px)]"
          )}
        >
          <CollectionToolbar
            sort={sort}
            setSort={setSort}
            setPage={setPage}
            hasFilters={hasFilters}
            setShowFilters={setShowFilters}
          />

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
                  "vanta-filter-backdrop !z-[100]"
                )}
              />
            )}

<FilterSidebar
  showFilters={showFilters}
  setShowFilters={setShowFilters}
  selectedCategory={selectedCategory}
  parentCategory={parentCategory}
  categories={categories}
  siblingCategories={siblingCategories}
  chooseCategory={chooseCategory}
  minPrice={minPrice}
  setMinPrice={setMinPrice}
  maxPrice={maxPrice}
  setMaxPrice={setMaxPrice}
  colorFilter={colorFilter}
  setColorFilter={setColorFilter}
  materialFilter={materialFilter}
  setMaterialFilter={setMaterialFilter}
  featured={featured}
  setFeatured={setFeatured}
  hasFilters={hasFilters}
  resetFilters={resetFilters}
  PRICE_MIN={PRICE_MIN}
  PRICE_MAX={PRICE_MAX}
  PRICE_STEP={PRICE_STEP}
/>

            <section className={tw("vanta-collection-results")}>
              {loading && (
                <div className={tw("vanta-collection-grid")}>
                  {Array.from({ length: 8 }).map((_, index) => (
                    <div className={tw("vanta-collection-product skeleton")} key={index}>
                      <div className={tw("vanta-collection-product-image")} />
                      <div className="skeleton-line wide" />
                      <div className="skeleton-line short" />
                    </div>
                  ))}
                </div>
              )}

              {!loading && error && (
                <div className={tw("vanta-collection-empty")}>
                  <h2>Something went wrong</h2>
                  <p>{error}</p>
                  <button type="button" onClick={() => setRetryKey((current) => current + 1)}>
                    Try again
                  </button>
                </div>
              )}

              {!loading && !error && products.length === 0 && (
                <div className={tw("vanta-collection-empty")}>
                  <h2>No products found</h2>
                  <p>Try changing your search or collection filters.</p>
                  <button type="button" onClick={resetFilters}>Clear filters</button>
                </div>
              )}

              {!loading && !error && products.length > 0 && (
                <>
                  <ProductGrid
                    products={products}
                    wishlistItems={wishlistItems}
                    toggleWishlist={toggleWishlist}
                  />
                  <Pagination pagination={pagination} setPage={setPage} />
                </>
              )}
            </section>
          </div>
        </div>
      </div>

      <CollectionBenefits />
    </main>
  );
};

export default Products;