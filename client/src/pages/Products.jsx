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
} from "lucide-react";

import productService from "../services/productService";
import categoryService from "../services/categoryService";

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

const formatPrice = (value) => `₹${Number(value || 0).toLocaleString("en-IN")}`;

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
			"",
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

const normalizeImageUrl = (value) => {
	if (!value || typeof value !== "string") return "";
	const markdownMatch = value.match(/\((https?:\/\/[^)]+)\)/);
	if (markdownMatch) return markdownMatch[1];
	return value.trim();
};
const Products = ({ categorySlug = "" }) => {
	const [searchParams, setSearchParams] = useSearchParams();
	const urlCategory = searchParams.get("category") || categorySlug || "";

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
	const [wishlist, setWishlist] = useState([]);
	const [retryKey, setRetryKey] = useState(0);
	const PRICE_MIN = 500;
	const PRICE_MAX = 10000;
	const PRICE_STEP = 500;

	useEffect(() => {
		setSelectedCategory(urlCategory);
		setPage(1);
	}, [urlCategory]);

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

	const activeCategory = useMemo(() => {
		if (!selectedCategory) return null;

		const selectedKey = normalizeCategoryKey(selectedCategory);

		return (
			categories.find((category) => {
				const slug = normalizeCategoryKey(
					category.slug || category.category?.slug || "",
				);
				const name = normalizeCategoryKey(
					category.name || category.category?.name || "",
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
				pagination: responseData.pagination || data?.pagination || null,
			};
		};

		const productMatches = (product) => {
			const price = Number(product?.price);
			if (!Number.isFinite(price)) return false;
			if (minPrice !== "" && price < Number(minPrice)) return false;
			if (maxPrice !== "" && price > Number(maxPrice)) return false;
			if (featured && !product?.isFeatured) return false;
			return true;
		};

		const productCategoryMatches = (product) => {
			if (!selectedCategory) return true;

			const wanted = normalizeCategoryKey(selectedCategory);
			const productCategory = product?.category;
			if (!productCategory) return false;

			const values = [
				productCategory?._id,
				productCategory?.id,
				productCategory?.categoryId,
				productCategory?.slug,
				productCategory?.name,
				productCategory?.category?.slug,
				productCategory?.category?.name,
			].filter(Boolean);

			return values.some(
				(value) =>
					normalizeCategoryKey(value) === wanted ||
					String(value) === String(selectedCategory),
			);
		};

		const loadProducts = async () => {
			setLoading(true);
			setError("");

			try {
				const min = minPrice === "" ? null : Number(minPrice);
				const max = maxPrice === "" ? null : Number(maxPrice);

				if (
					min !== null &&
					max !== null &&
					(Number.isNaN(min) || Number.isNaN(max) || min > max)
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
						"Please enter a valid price range: From must be less than or equal to To.",
					);
					setLoading(false);
					return;
				}

				const params = { page, limit: 12, sort };
				if (search.trim()) params.search = search.trim();
				if (selectedCategory)
					params.category = activeCategoryId || selectedCategory;
				if (min !== null) params.minPrice = min;
				if (max !== null) params.maxPrice = max;
				if (featured) params.featured = true;

				try {
					const data = await productService.getProducts(params);
					const parsed = parseProductsResponse(data);
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
				} catch (categoryError) {
					// Some existing databases have category slugs/names that do not match
					// the URL exactly. Do not let that make the whole Products page fail.
					// Fetch the normal product list and filter against the populated
					// category object on the client as a safe compatibility fallback.
					if (!selectedCategory) throw categoryError;

					const fallbackData = await productService.getProducts({
						page: 1,
						limit: 100,
						sort,
						...(search.trim() ? { search: search.trim() } : {}),
						...(min !== null ? { minPrice: min } : {}),
						...(max !== null ? { maxPrice: max } : {}),
						...(featured ? { featured: true } : {}),
					});

					const fallback = parseProductsResponse(fallbackData);
					const matching = fallback.products.filter(
						(product) =>
							productMatches(product) && productCategoryMatches(product),
					);
					const start = (page - 1) * 12;
					const visible = matching.slice(start, start + 12);
					const totalPages = Math.max(1, Math.ceil(matching.length / 12));

					setProducts(visible);
					setPagination({
						currentPage: page,
						itemsPerPage: 12,
						totalProducts: matching.length,
						totalPages,
						hasNextPage: page < totalPages,
						hasPreviousPage: page > 1,
					});
				}
			} catch (err) {
				console.error("Failed to load products:", err);
				setProducts([]);
				setError(
					err.response?.data?.message ||
						"Unable to load products. Check that the backend is running on port 5000.",
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
        page,
        retryKey,
    
    ]);

	const activeCategoryName = activeCategory?.name || "";

	const hero = CATEGORY_HEROES[selectedCategory] || {
		title: activeCategory?.name || "All Bags",
		subtitle: "Designed for modern journeys. Built to go further.",
		image: CATEGORY_HEROES.backpacks.image,
	};

	const hasFilters =
	search ||
	selectedCategory ||
	minPrice ||
	maxPrice ||
	featured;

	const toggleWishlist = (productId) => {
		setWishlist((current) =>
			current.includes(productId)
				? current.filter((id) => id !== productId)
				: [...current, productId],
		);
	};

	const chooseCategory = (categoryOrSlug) => {
		if (!categoryOrSlug) {
			setSelectedCategory("");
			setPage(1);
			setSearchParams({});
			return;
		}

		const category =
			typeof categoryOrSlug === "object"
				? categoryOrSlug
				: categories.find((item) => {
						const wanted = normalizeCategoryKey(categoryOrSlug);
						return (
							normalizeCategoryKey(item.slug || item.category?.slug || "") ===
								wanted ||
							normalizeCategoryKey(item.name || item.category?.name || "") ===
								wanted ||
							getCategoryId(item) === String(categoryOrSlug)
						);
					});

		// Always keep the URL human-readable, but retain the category object in
		// state long enough for activeCategoryId to send MongoDB's _id to the API.
		const key = category
			? getCategoryKey(category)
			: normalizeCategoryKey(categoryOrSlug);

		setSelectedCategory(key);
		setPage(1);

		if (key) setSearchParams({ category: key });
		else setSearchParams({});
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
		setSearchParams({});
	};

	const submitSearch = (event) => {
		event.preventDefault();
		setSearch(searchInput);
		setPage(1);
	};

	return (
		<main className={tw("vanta-collection-page")}>
			{/* Breadcrumb */}
			<div className={tw("vanta-collection-shell")}>
				<div className={tw("vanta-breadcrumb")}>
					<Link to="/">Home</Link>
					<span>›</span>
					<span>Collection</span>
					<span>›</span>
					<strong>{hero.title}</strong>
				</div>

				{/* Category hero */}
				<section className={tw("vanta-collection-hero")}>
					<img src={hero.image} alt={hero.title} />

					<div className={tw("vanta-collection-hero-overlay")} />

					<div className={tw("vanta-collection-hero-copy")}>
						<p className={tw("vanta-eyebrow")}>VANTA COLLECTION</p>

						<h1>{hero.title}</h1>

						<p>{hero.subtitle}</p>
					</div>
				</section>

				{/* Collection controls */}
				<section className={tw("mt-8 mb-10")}>
					<div className={tw(
						"flex flex-col gap-4 rounded-2xl border border-[var(--vanta-border)] bg-[var(--vanta-bg)] p-4 shadow-sm"
					)}>
						<div className={tw("flex flex-col gap-4 lg:flex-row lg:items-center")}>
							<div className={tw("flex-1")}>
								<div className={tw(
									"flex h-12 overflow-hidden rounded-xl border border-[var(--vanta-border)] bg-[var(--vanta-bg)] transition focus-within:border-[var(--vanta-text)] focus-within:ring-2 focus-within:ring-[var(--vanta-text)]/10"
								)}>
									<div className={tw("flex w-12 shrink-0 items-center justify-center text-[var(--vanta-muted)]")}>
										<svg viewBox="0 0 24 24" className={tw("h-5 w-5")} fill="none" stroke="currentColor" strokeWidth="1.8">
											<circle cx="11" cy="11" r="6.5" />
											<path d="m16 16 4.2 4.2" />
										</svg>
									</div>
									<form onSubmit={submitSearch} className={tw("flex min-w-0 flex-1")}>
										<input
											type="search"
											value={searchInput}
											onChange={(event) => setSearchInput(event.target.value)}
											placeholder={`Search ${hero.title.toLowerCase()}...`}
											className={tw(
												"min-w-0 flex-1 bg-transparent px-1 text-sm text-[var(--vanta-text)] outline-none placeholder:text-[var(--vanta-muted)]"
											)}
										/>
										
										<button
											type="submit"
											className={tw(
												"my-1 mr-1 rounded-lg bg-[var(--vanta-text)] px-5 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--vanta-bg)] transition hover:opacity-85"
											)}
										>
											Search
										</button>
									</form>
								</div>
							</div>

							<div className={tw("flex items-center gap-2")}>
								
								<div className={tw("relative")}>
									<div className={tw(
										"flex h-12 items-center rounded-xl border border-[var(--vanta-border)] bg-[var(--vanta-bg)]"
									)}>
										<span className={tw("hidden px-3 text-xs text-[var(--vanta-muted)] sm:block")}>
											Sort
										</span>
										<select
											value={sort}
											onChange={(event) => {
												setSort(event.target.value);
												setPage(1);
											}}
											className={tw(
												"h-full min-w-[150px] cursor-pointer appearance-none bg-transparent px-4 pr-9 text-sm font-medium text-[var(--vanta-text)] outline-none"
											)}
										>
											<option value="newest">Newest</option>
											<option value="popular">Popular</option>
											<option value="price_asc">Price: Low to High</option>
											<option value="price_desc">Price: High to Low</option>
											<option value="name_asc">Name: A-Z</option>
										</select>
										<ChevronDown size={15} className={tw("pointer-events-none absolute right-3 text-[var(--vanta-muted)]")} />
									</div>
								</div>
							</div>
						</div>

					</div>
				</section>

				<div className={tw("vanta-collection-layout")}>
					{/* Sidebar */}
					<aside
						className={tw(
							`vanta-collection-sidebar ${showFilters ? "is-open" : ""} !rounded-none !border-0 border-r border-[var(--vanta-border)] bg-[var(--vanta-bg)]`,
						)}
					>
						<div className={tw("vanta-filter-heading border-b border-[var(--vanta-border)]")}>
							<div>
								<p className={tw("vanta-eyebrow")}>Refine</p>
								<h3>Shop Filters</h3>
							</div>
							<button type="button" onClick={() => setShowFilters(false)}>
							</button>
						</div>

						<div className={tw("vanta-filter-block")}>
							<div className={tw("vanta-filter-title")}>
								<span>Category</span>
								<ChevronDown size={14} />
							</div>

							<label className={tw("vanta-check-row")}>
								<input
									type="checkbox"
									checked={!selectedCategory}
									onChange={() => chooseCategory("")}
								/>
								<span>All Bags</span>
								<small>{pagination.totalProducts}</small>
							</label>

							{categories.map((category) => {
								const categoryKey = getCategoryKey(category);

								return (
									<label
										className={tw("vanta-check-row")}
										key={getCategoryId(category) || categoryKey}
									>
										<input
											type="checkbox"
											checked={
												normalizeCategoryKey(selectedCategory) ===
												normalizeCategoryKey(categoryKey)
											}
											onChange={() => chooseCategory(category)}
										/>
										<span>{category.name}</span>
									</label>
								);
							})}
						</div>

						<div className={tw("vanta-filter-block")}>
							<div className={tw("vanta-filter-title")}>
								<span>Price Range</span>
							</div>

							<div className="relative mt-8 px-1">
								<div className="relative h-8">
									<div className="absolute left-0 right-0 top-1/2 h-[2px] -translate-y-1/2 rounded-full bg-[var(--vanta-border)]" />

									<div
										className="absolute top-1/2 h-[3px] -translate-y-1/2 rounded-full bg-[var(--vanta-text)]"
										style={{
											left: `${((Number(minPrice || PRICE_MIN) - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100}%`,
											right: `${100 - ((Number(maxPrice || PRICE_MAX) - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100}%`,
										}}
									/>

									<div
										className="absolute -top-7 -translate-x-1/2 whitespace-nowrap rounded-md bg-[var(--vanta-text)] px-2 py-1 text-[9px] font-semibold text-[var(--vanta-bg)]"
										style={{
											left: `${((Number(minPrice || PRICE_MIN) - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100}%`,
										}}
									>
										₹{Number(minPrice || PRICE_MIN).toLocaleString("en-IN")}
									</div>

									<div
										className="absolute -top-7 -translate-x-1/2 whitespace-nowrap rounded-md bg-[var(--vanta-text)] px-2 py-1 text-[9px] font-semibold text-[var(--vanta-bg)]"
										style={{
											left: `${((Number(maxPrice || PRICE_MAX) - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100}%`,
										}}
									>
										₹{Number(maxPrice || PRICE_MAX).toLocaleString("en-IN")}
									</div>

									<input
										type="range"
										min={PRICE_MIN}
										max={PRICE_MAX}
										step={PRICE_STEP}
										value={Number(minPrice || PRICE_MIN)}
										onChange={(event) => {
											const value = Number(event.target.value);

											if (value <= Number(maxPrice || PRICE_MAX)) {
												setMinPrice(value);
												setPage(1);
											}
										}}
										aria-label="Minimum price"
										className="absolute inset-0 z-20 h-full w-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-runnable-track]:bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:mt-[8px] [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[var(--vanta-text)] [&::-webkit-slider-thumb]:bg-[var(--vanta-bg)] [&::-moz-range-track]:bg-transparent [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-[var(--vanta-text)] [&::-moz-range-thumb]:bg-[var(--vanta-bg)]"
									/>

									<input
										type="range"
										min={PRICE_MIN}
										max={PRICE_MAX}
										step={PRICE_STEP}
										value={Number(maxPrice || PRICE_MAX)}
										onChange={(event) => {
											const value = Number(event.target.value);

											if (value >= Number(minPrice || PRICE_MIN)) {
												setMaxPrice(value);
												setPage(1);
											}
										}}
										aria-label="Maximum price"
										className="absolute inset-0 z-30 h-full w-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-runnable-track]:bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:mt-[8px] [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[var(--vanta-text)] [&::-webkit-slider-thumb]:bg-[var(--vanta-bg)] [&::-moz-range-track]:bg-transparent [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-[var(--vanta-text)] [&::-moz-range-thumb]:bg-[var(--vanta-bg)]"
									/>
								</div>
							</div>
						</div>
						<div className={tw("vanta-filter-block")}>
							<div className={tw("vanta-filter-title")}>
								<span>Featured</span>
								<ChevronDown size={14} />
							</div>
							<label className={tw("vanta-check-row")}>
								<input
									type="checkbox"
									checked={featured}
									onChange={() => {
										setFeatured((current) => !current);
										setPage(1);
									}}
								/>
								<span>Featured pieces</span>
							</label>
						</div>

						<button
							type="button"
							className={tw("vanta-filter-apply")}
							onClick={() => setShowFilters(false)}
						>
							Filter
						</button>

						{hasFilters && (
							<button
								type="button"
								className={tw("vanta-filter-clear")}
								onClick={resetFilters}
							>
								Clear all filters
							</button>
						)}
					</aside>

					{/* Product grid */}
					<section className={tw("vanta-collection-results min-w-0")}>
						{loading && (
							<div className={tw("vanta-collection-grid")}>
								{[1, 2, 3, 4, 5, 6].map((item) => (
									<div
										className={tw("vanta-collection-product skeleton")}
										key={item}
									>
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
								<button
									type="button"
									onClick={() => setRetryKey((current) => current + 1)}
								>
									Try again
								</button>
							</div>
						)}

						{!loading && !error && products.length === 0 && (
							<div className={tw("vanta-collection-empty")}>
								<h2>No bags found</h2>
								<p>Try changing your search or collection filters.</p>
								<button type="button" onClick={resetFilters}>
									Clear filters
								</button>
							</div>
						)}

						{!loading && !error && products.length > 0 && (
							<>
								<div className={tw("vanta-collection-grid")}>
									{products.map((product) => {
										const isWishlisted = wishlist.includes(product._id);
										const rating = Number(
											product.rating?.average || product.averageRating || 0,
										);

										return (
											<article
												className={tw("vanta-collection-product")}
												key={product._id}
											>
												<Link
													to={`/products/${product.slug}`}
													className={tw("vanta-collection-product-link")}
												>
													<div className={tw("vanta-collection-product-image")}>
														{normalizeImageUrl(product.images?.[0]) ? (
															<img
																src={normalizeImageUrl(product.images?.[0])}
																alt={product.name}
															/>
														) : (
															<div className={tw("vanta-image-placeholder")}>
																VANTA
															</div>
														)}

														{product.isFeatured && product.stock > 0 && (
															<span className={tw("vanta-collection-badge")}>
																Featured
															</span>
														)}

														{product.stock === 0 && (
															<span
																className={tw("vanta-collection-badge sold")}
															>
																Sold out
															</span>
														)}
													</div>

													<div className={tw("vanta-collection-product-meta")}>
														<h3>{product.name}</h3>
														<p>{formatPrice(product.price)}</p>
														{product.compareAtPrice > product.price && (
															<span className={tw("vanta-old-price")}>
																{formatPrice(product.compareAtPrice)}
															</span>
														)}
														{rating > 0 && (
															<div
																className={tw("vanta-rating")}
																aria-label={`${rating} out of 5 stars`}
															>
																<span>★★★★★</span>
																<small>{rating.toFixed(1)}</small>
															</div>
														)}
													</div>
												</Link>

												<button
													type="button"
													className={tw(
														`vanta-product-heart ${isWishlisted ? "active" : ""}`,
													)}
													aria-label={
														isWishlisted
															? "Remove from wishlist"
															: "Add to wishlist"
													}
													onClick={() => toggleWishlist(product._id)}
												>
													<Heart
														size={15}
														fill={isWishlisted ? "currentColor" : "none"}
													/>
												</button>
											</article>
										);
									})}
								</div>

								{pagination.totalPages > 1 && (
									<div className={tw("vanta-collection-pagination")}>
										<button
											type="button"
											disabled={!pagination.hasPreviousPage}
											onClick={() =>
												setPage((current) => Math.max(current - 1, 1))
											}
										>
											<ChevronLeft size={16} />
										</button>
										<span>{pagination.currentPage}</span>
										<button
											type="button"
											disabled={!pagination.hasNextPage}
											onClick={() => setPage((current) => current + 1)}
										>
											<ChevronRight size={16} />
										</button>
									</div>
								)}
							</>
						)}
					</section>
				</div>
			</div>
		</main>
	);
};

export default Products;