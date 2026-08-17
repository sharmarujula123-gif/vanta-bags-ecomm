import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import productService from "../services/productService";
import categoryService from "../services/categoryService";
import {
  getCategoryId,
  getCategoryKey,
  normalizeKey,
  unwrapList,
  PRICE_RANGE,
} from "../utils/product";

const emptyPagination = {
  currentPage: 1,
  totalPages: 1,
  totalProducts: 0,
  hasNextPage: false,
  hasPreviousPage: false,
};

const parseResponse = (data) => {
  const source = data?.data || data || {};
  return {
    products: source.products || source.items || data?.products || data?.items || [],
    pagination: source.pagination || data?.pagination || null,
  };
};

export default function useProductCollection(categorySlug = "") {
  const [params, setParams] = useSearchParams();
  const urlCategory = params.get("category") || categorySlug || "";

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(urlCategory);
  const [sort, setSort] = useState("newest");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [featured, setFeatured] = useState(false);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(emptyPagination);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    setSelectedCategory(urlCategory);
    setPage(1);
  }, [urlCategory]);

  useEffect(() => {
    categoryService
      .getCategories()
      .then((data) =>
        setCategories(
          unwrapList(data, ["categories", "data", "results", "items"]),
        ),
      )
      .catch((err) => console.error("Failed to load categories:", err))
      .finally(() => setCategoriesLoading(false));
  }, []);

  const activeCategory = useMemo(() => {
    if (!selectedCategory) return null;
    const wanted = normalizeKey(selectedCategory);

    return (
      categories.find((category) => {
        const slug = normalizeKey(category.slug || category.category?.slug);
        const name = normalizeKey(category.name || category.category?.name);
        return (
          getCategoryId(category) === String(selectedCategory) ||
          slug === wanted ||
          name === wanted ||
          getCategoryKey(category) === wanted
        );
      }) || null
    );
  }, [categories, selectedCategory]);

  const activeCategoryId = getCategoryId(activeCategory);

  useEffect(() => {
    if (selectedCategory && categoriesLoading) return;

    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError("");

      const min = minPrice === "" ? null : Number(minPrice);
      const max = maxPrice === "" ? null : Number(maxPrice);

      if (
        min !== null &&
        max !== null &&
        (Number.isNaN(min) || Number.isNaN(max) || min > max)
      ) {
        setProducts([]);
        setPagination(emptyPagination);
        setError("Please enter a valid price range: From must be less than or equal to To.");
        setLoading(false);
        return;
      }

      const query = {
        page,
        limit: 12,
        sort,
        ...(search.trim() && { search: search.trim() }),
        ...(selectedCategory && { category: activeCategoryId || selectedCategory }),
        ...(min !== null && { minPrice: min }),
        ...(max !== null && { maxPrice: max }),
        ...(featured && { featured: true }),
      };

      try {
        let parsed;

        try {
          parsed = parseResponse(await productService.getProducts(query));
        } catch (categoryError) {
          if (!selectedCategory) throw categoryError;

          const fallback = parseResponse(
            await productService.getProducts({
              page: 1,
              limit: 100,
              sort,
              ...(search.trim() && { search: search.trim() }),
              ...(min !== null && { minPrice: min }),
              ...(max !== null && { maxPrice: max }),
              ...(featured && { featured: true }),
            }),
          );

          const wanted = normalizeKey(selectedCategory);
          const matches = fallback.products.filter((product) => {
            const price = Number(product?.price);
            const category = product?.category;
            if (!Number.isFinite(price) || !category) return false;
            if (min !== null && price < min) return false;
            if (max !== null && price > max) return false;
            if (featured && !product.isFeatured) return false;

            const values = [
              category._id,
              category.id,
              category.categoryId,
              category.slug,
              category.name,
              category.category?.slug,
              category.category?.name,
            ].filter(Boolean);

            return values.some(
              (value) =>
                normalizeKey(value) === wanted ||
                String(value) === String(selectedCategory),
            );
          });

          const start = (page - 1) * 12;
          const totalPages = Math.max(1, Math.ceil(matches.length / 12));

          parsed = {
            products: matches.slice(start, start + 12),
            pagination: {
              currentPage: page,
              itemsPerPage: 12,
              totalProducts: matches.length,
              totalPages,
              hasNextPage: page < totalPages,
              hasPreviousPage: page > 1,
            },
          };
        }

        if (cancelled) return;

        setProducts(parsed.products);
        setPagination(
          parsed.pagination || {
            currentPage: page,
            totalPages: 1,
            totalProducts: parsed.products.length,
            hasNextPage: false,
            hasPreviousPage: false,
          },
        );
      } catch (err) {
        if (cancelled) return;
        console.error("Failed to load products:", err);
        setProducts([]);
        setError(
          err.response?.data?.message ||
            "Unable to load products. Check that the backend is running on port 5000.",
        );
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [
    search,
    selectedCategory,
    activeCategoryId,
    categoriesLoading,
    sort,
    minPrice,
    maxPrice,
    featured,
    page,
    retryKey,
  ]);

  const chooseCategory = (categoryOrSlug) => {
    if (!categoryOrSlug) {
      setSelectedCategory("");
      setPage(1);
      setParams({});
      return;
    }

    const category =
      typeof categoryOrSlug === "object"
        ? categoryOrSlug
        : categories.find((item) => {
            const wanted = normalizeKey(categoryOrSlug);
            return (
              normalizeKey(item.slug || item.category?.slug) === wanted ||
              normalizeKey(item.name || item.category?.name) === wanted ||
              getCategoryId(item) === String(categoryOrSlug)
            );
          });

    const key = category
      ? getCategoryKey(category)
      : normalizeKey(categoryOrSlug);

    setSelectedCategory(key);
    setPage(1);
    setParams(key ? { category: key } : {});
  };

  const resetFilters = () => {
    setSearch("");
    setSearchInput("");
    setSelectedCategory("");
    setSort("newest");
    setMinPrice("");
    setMaxPrice("");
    setFeatured(false);
    setPage(1);
    setParams({});
  };

  return {
    products,
    categories,
    selectedCategory,
    activeCategory,
    searchInput,
    sort,
    minPrice,
    maxPrice,
    featured,
    page,
    pagination,
    loading,
    error,
    showFilters,
    hasFilters: Boolean(search || selectedCategory || minPrice || maxPrice || featured),
    priceRange: PRICE_RANGE,
    setSearch: (value) => {
      setSearch(value);
      setPage(1);
    },
    setSearchInput,
    setSort: (value) => {
      setSort(value);
      setPage(1);
    },
    setMinPrice: (value) => {
      setMinPrice(value);
      setPage(1);
    },
    setMaxPrice: (value) => {
      setMaxPrice(value);
      setPage(1);
    },
    setFeatured: (value) => {
      setFeatured(value);
      setPage(1);
    },
    setPage,
    setShowFilters,
    setRetryKey,
    chooseCategory,
    resetFilters,
  };
}
