import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";

import productService from "../services/productService";
import categoryService from "../services/categoryService";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] =
    useState("");

  const [selectedCategory, setSelectedCategory] =
    useState("");

  const [sort, setSort] =
    useState("newest");

  const [minPrice, setMinPrice] =
    useState("");

  const [maxPrice, setMaxPrice] =
    useState("");

  const [featured, setFeatured] =
    useState(false);

  const [page, setPage] = useState(1);

  const [pagination, setPagination] =
    useState({
      currentPage: 1,
      totalPages: 1,
      totalProducts: 0,
      hasNextPage: false,
      hasPreviousPage: false,
    });

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [showFilters, setShowFilters] =
    useState(false);

  /*
   * Load categories
   */

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data =
          await categoryService.getCategories();

        setCategories(
          data.data?.categories ||
            data.categories ||
            []
        );
      } catch (error) {
        console.error(
          "Failed to load categories:",
          error
        );
      }
    };

    loadCategories();
  }, []);

  /*
   * Load products
   */

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      setError("");

      try {
        const params = {
          page,
          limit: 12,
          sort,
        };

        if (search.trim()) {
          params.search = search.trim();
        }

        if (selectedCategory) {
          params.category =
            selectedCategory;
        }

        if (minPrice !== "") {
          params.minPrice =
            Number(minPrice);
        }

        if (maxPrice !== "") {
          params.maxPrice =
            Number(maxPrice);
        }

        if (featured) {
          params.featured = true;
        }

        const data =
          await productService.getProducts(
            params
          );

        setProducts(
          data.data?.products ||
            data.products ||
            []
        );

        setPagination(
          data.data?.pagination || {
            currentPage: page,
            totalPages: 1,
            totalProducts: 0,
            hasNextPage: false,
            hasPreviousPage: false,
          }
        );
      } catch (error) {
        setError(
          error.response?.data?.message ||
            "Unable to load products."
        );
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [
    search,
    selectedCategory,
    sort,
    minPrice,
    maxPrice,
    featured,
    page,
  ]);

  /*
   * Search
   */

  const handleSearch = (event) => {
    event.preventDefault();

    setPage(1);
    setSearch(searchInput);
  };

  /*
   * Category
   */

  const handleCategoryChange = (
    category
  ) => {
    setSelectedCategory(category);
    setPage(1);
  };

  /*
   * Sort
   */

  const handleSortChange = (event) => {
    setSort(event.target.value);
    setPage(1);
  };

  /*
   * Price filters
   */

  const handleMinPriceChange = (
    event
  ) => {
    setMinPrice(event.target.value);
    setPage(1);
  };

  const handleMaxPriceChange = (
    event
  ) => {
    setMaxPrice(event.target.value);
    setPage(1);
  };

  /*
   * Featured
   */

  const handleFeaturedChange = () => {
    setFeatured((current) => !current);
    setPage(1);
  };

  /*
   * Reset
   */

  const resetFilters = () => {
    setSearch("");
    setSearchInput("");
    setSelectedCategory("");
    setSort("newest");
    setMinPrice("");
    setMaxPrice("");
    setFeatured(false);
    setPage(1);
  };

  const hasFilters =
    search ||
    selectedCategory ||
    minPrice ||
    maxPrice ||
    featured;

  return (
    <main className="mx-auto max-w-7xl px-5 py-16 lg:px-8">

      {/* Header */}

      <div className="border-b border-stone-200 pb-10">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">

          <div>
            <p className="text-xs font-bold tracking-[0.25em]">
              VANTA BAGS
            </p>

            <h1 className="mt-4 font-serif text-5xl md:text-6xl">
              Collection
            </h1>

            <p className="mt-5 max-w-xl leading-7 text-stone-500">
              Explore bags designed for work,
              travel and everyday movement.
            </p>
          </div>

          {/* Search */}

          <form
            onSubmit={handleSearch}
            className="flex w-full max-w-md border border-stone-300"
          >
            <div className="flex flex-1 items-center">
              <Search
                size={18}
                className="ml-3 shrink-0 text-stone-400"
              />

              <input
                type="search"
                value={searchInput}
                onChange={(event) =>
                  setSearchInput(
                    event.target.value
                  )
                }
                placeholder="Search bags..."
                className="h-12 w-full bg-transparent px-3 text-sm outline-none"
              />
            </div>

            <button
              type="submit"
              className="bg-stone-950 px-5 text-sm font-semibold text-white hover:bg-stone-800"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      {/* Categories */}

      <div className="flex gap-3 overflow-x-auto py-8">
        <button
          type="button"
          onClick={() =>
            handleCategoryChange("")
          }
          className={`whitespace-nowrap border px-5 py-2.5 text-sm transition ${
            selectedCategory === ""
              ? "border-stone-950 bg-stone-950 text-white"
              : "border-stone-300 hover:border-stone-950"
          }`}
        >
          All
        </button>

        {categories.map((category) => (
          <button
            key={category._id}
            type="button"
            onClick={() =>
              handleCategoryChange(
                category.slug
              )
            }
            className={`whitespace-nowrap border px-5 py-2.5 text-sm transition ${
              selectedCategory ===
              category.slug
                ? "border-stone-950 bg-stone-950 text-white"
                : "border-stone-300 hover:border-stone-950"
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Toolbar */}

      <div className="flex flex-col gap-4 border-y border-stone-200 py-5 sm:flex-row sm:items-center sm:justify-between">

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() =>
              setShowFilters(
                (current) => !current
              )
            }
            className="inline-flex items-center gap-2 border border-stone-300 px-4 py-2.5 text-sm font-semibold hover:border-stone-950"
          >
            <SlidersHorizontal
              size={16}
            />

            Filters
          </button>

          <p className="text-sm text-stone-500">
            {pagination.totalProducts}{" "}
            {pagination.totalProducts === 1
              ? "product"
              : "products"}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-stone-500">
            Sort
          </span>

          <select
            value={sort}
            onChange={handleSortChange}
            className="h-10 border border-stone-300 bg-transparent px-3 text-sm outline-none"
          >
            <option value="newest">
              Newest
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

            <option value="name_desc">
              Name: Z-A
            </option>
          </select>
        </div>
      </div>

      {/* Filters */}

      {showFilters && (
        <div className="border-b border-stone-200 bg-stone-50 py-6">
          <div className="grid gap-6 md:grid-cols-3">

            {/* Minimum price */}

            <div>
              <label className="text-xs font-semibold tracking-wide">
                Minimum Price
              </label>

              <input
                type="number"
                min="0"
                value={minPrice}
                onChange={
                  handleMinPriceChange
                }
                placeholder="₹0"
                className="mt-2 h-11 w-full border border-stone-300 bg-white px-3 text-sm outline-none focus:border-stone-950"
              />
            </div>

            {/* Maximum price */}

            <div>
              <label className="text-xs font-semibold tracking-wide">
                Maximum Price
              </label>

              <input
                type="number"
                min="0"
                value={maxPrice}
                onChange={
                  handleMaxPriceChange
                }
                placeholder="₹10,000"
                className="mt-2 h-11 w-full border border-stone-300 bg-white px-3 text-sm outline-none focus:border-stone-950"
              />
            </div>

            {/* Featured */}

            <label className="flex cursor-pointer items-center gap-3 self-end pb-2">
              <input
                type="checkbox"
                checked={featured}
                onChange={
                  handleFeaturedChange
                }
                className="h-4 w-4"
              />

              <span className="text-sm font-semibold">
                Featured products only
              </span>
            </label>
          </div>

          {hasFilters && (
            <button
              type="button"
              onClick={resetFilters}
              className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-stone-600 hover:text-stone-950"
            >
              <X size={15} />
              Clear all filters
            </button>
          )}
        </div>
      )}

      {/* Loading */}

      {loading && (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(
            (item) => (
              <div
                key={item}
                className="animate-pulse"
              >
                <div className="aspect-square bg-stone-200" />

                <div className="mt-4 h-4 w-3/4 bg-stone-200" />

                <div className="mt-2 h-4 w-1/3 bg-stone-200" />
              </div>
            )
          )}
        </div>
      )}

      {/* Error */}

      {!loading && error && (
        <div className="mt-10 border border-dashed border-stone-300 py-24 text-center">
          <h2 className="font-serif text-3xl">
            Something went wrong
          </h2>

          <p className="mt-3 text-stone-500">
            {error}
          </p>

          <button
            type="button"
            onClick={() => setPage(page)}
            className="mt-6 border border-stone-300 px-5 py-2.5 text-sm font-semibold hover:border-stone-950"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Products */}

      {!loading && !error && (
        <>
          {products.length === 0 ? (
            <div className="mt-10 border border-dashed border-stone-300 py-24 text-center">
              <h2 className="font-serif text-3xl">
                No products found
              </h2>

              <p className="mt-3 text-stone-500">
                Try changing your search or
                filters.
              </p>

              {hasFilters && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="mt-6 inline-flex items-center gap-2 bg-stone-950 px-6 py-3 text-sm font-semibold text-white hover:bg-stone-800"
                >
                  Clear Filters
                  <X size={15} />
                </button>
              )}
            </div>
          ) : (
            <div className="mt-10 grid gap-x-5 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((product) => (
                <Link
                  key={product._id}
                  to={`/products/${product.slug}`}
                  className="group"
                >
                  <div className="relative aspect-square overflow-hidden bg-stone-200">

                    {product.images?.[0] ? (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs font-bold tracking-[0.3em] text-stone-500">
                        VANTA
                      </div>
                    )}

                    {product.stock === 0 && (
                      <span className="absolute left-3 top-3 bg-stone-950 px-3 py-1 text-[10px] font-semibold tracking-wider text-white">
                        SOLD OUT
                      </span>
                    )}

                    {product.isFeatured &&
                      product.stock > 0 && (
                        <span className="absolute left-3 top-3 bg-white px-3 py-1 text-[10px] font-semibold tracking-wider text-stone-950">
                          FEATURED
                        </span>
                      )}
                  </div>

                  <div className="mt-4">
                    <h2 className="text-sm font-semibold">
                      {product.name}
                    </h2>

                    <p className="mt-1 text-sm text-stone-500">
                      ₹
                      {Number(
                        product.price
                      ).toLocaleString(
                        "en-IN"
                      )}
                    </p>

                    {product.compareAtPrice &&
                      product.compareAtPrice >
                        product.price && (
                        <p className="mt-1 text-xs text-stone-400 line-through">
                          ₹
                          {Number(
                            product.compareAtPrice
                          ).toLocaleString(
                            "en-IN"
                          )}
                        </p>
                      )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </>
      )}

      {/* Pagination */}

      {!loading &&
        !error &&
        pagination.totalPages > 1 && (
          <div className="mt-14 flex items-center justify-center gap-3">

            <button
              type="button"
              disabled={
                !pagination.hasPreviousPage
              }
              onClick={() =>
                setPage((current) =>
                  Math.max(current - 1, 1)
                )
              }
              className="inline-flex h-10 items-center gap-2 border border-stone-300 px-4 text-sm font-semibold hover:border-stone-950 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft size={16} />
              Previous
            </button>

            <div className="flex h-10 min-w-10 items-center justify-center border border-stone-950 px-3 text-sm font-semibold">
              {pagination.currentPage}
            </div>

            <button
              type="button"
              disabled={
                !pagination.hasNextPage
              }
              onClick={() =>
                setPage((current) =>
                  current + 1
                )
              }
              className="inline-flex h-10 items-center gap-2 border border-stone-300 px-4 text-sm font-semibold hover:border-stone-950 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
              <ChevronRight size={16} />
            </button>
          </div>
        )}
    </main>
  );
};

export default Products;