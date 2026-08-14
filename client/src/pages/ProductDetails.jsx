import { tw } from "../utils/twStyles.js";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Check,
  ChevronRight,
  Heart,
  Minus,
  Plus,
  RotateCcw,
  ShieldCheck,
  ShoppingBag,
  Star,
  Truck,
} from "lucide-react";
import toast from "react-hot-toast";

import productService from "../services/productService";
import useCartStore from "../store/cartStore";
import useWishlistStore from "../store/wishlistStore";
import useRecentStore from "../store/recentStore";
import reviewService from "../services/reviewService";
import categoryService from "../services/categoryService";

const formatPrice = (price) => `₹${Number(price || 0).toLocaleString("en-IN")}`;

const normalizeImageUrl = (value) => {
  if (!value || typeof value !== "string") return "";
  const markdownMatch = value.match(/\((https?:\/\/[^)]+)\)/);
  if (markdownMatch) return markdownMatch[1];
  return value.trim();
};


const ProductDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const [buyingNow, setBuyingNow] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("description");
  const [related, setRelated] = useState([]);
  const [categories, setCategories] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [reviewStats, setReviewStats] = useState({ average: 0, count: 0 });
  const [reviewForm, setReviewForm] = useState({ rating: 5, title: "", comment: "" });
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  const addToCart = useCartStore((state) => state.addToCart);
  const toggleWishlist = useWishlistStore((state) => state.toggle);
  const isWishlisted = useWishlistStore((state) =>
    product ? state.items.some((item) => item._id === product._id) : false
  );
  const addRecent = useRecentStore((state) => state.add);

  useEffect(() => {
    let mounted = true;

    categoryService
      .getCategories()
      .then((data) => {
        if (mounted) {
          setCategories(data.data?.categories || data.categories || []);
        }
      })
      .catch((error) => {
        console.error("Failed to load categories for product page:", error);
      });

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await productService.getProductBySlug(slug);
        const loadedProduct = data.data?.product || data.product;

        setProduct(loadedProduct);
        setSelectedImage(normalizeImageUrl(loadedProduct?.images?.[0] || loadedProduct?.image || ""));
        setQuantity(1);
        if (loadedProduct) addRecent(loadedProduct);

        try {
          const categoryId =
            typeof loadedProduct?.category === "object"
              ? loadedProduct.category?._id
              : loadedProduct?.category;

          if (categoryId) {
            const relatedData = await productService.getProducts({
              category: categoryId,
              limit: 8,
              page: 1,
            });

            const relatedProducts =
              relatedData.data?.products || relatedData.products || [];

            setRelated(
              relatedProducts
                .filter((item) => item._id !== loadedProduct._id)
                .slice(0, 4)
            );
          } else {
            setRelated([]);
          }
        } catch (relatedError) {
          console.error("Failed to load related products:", relatedError);
          setRelated([]);
        }

        try {
          const reviewData = await reviewService.getReviews(loadedProduct._id);
          setReviews(reviewData.data?.reviews || []);
          setReviewStats({
            average: reviewData.data?.average || 0,
            count: reviewData.data?.count || 0,
          });
        } catch {
          setReviews([]);
        }
      } catch (err) {
        setError(err.response?.data?.message || "Unable to load this product.");
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [slug, addRecent]);

  if (loading) {
    return (
      <main className={tw("vanta-product-page vanta-product-loading")}>
        <div className={tw("vanta-product-shell")}>
          <div className={tw("vanta-product-skeleton-media")} />
          <div className={tw("vanta-product-skeleton-copy")}>
            <div className={tw("vanta-skeleton-line small")} />
            <div className={tw("vanta-skeleton-line title")} />
            <div className={tw("vanta-skeleton-line price")} />
            <div className={tw("vanta-skeleton-line text")} />
            <div className={tw("vanta-skeleton-line button")} />
          </div>
        </div>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className={tw("vanta-product-page")}>
        <div className={tw("vanta-product-error")}>
          <p className={tw("vanta-eyebrow")}>VANTA BAGS</p>
          <h1 className={tw("vanta-serif")}>Product unavailable</h1>
          <p>{error || "We couldn't find this product."}</p>
          <Link to="/products" className={tw("vanta-product-primary-btn")}>
            <ArrowLeft size={16} /> Back to Collection
          </Link>
        </div>
      </main>
    );
  }

  const stock = Math.max(Number(product.stock || 0), 0);
  const isSoldOut = stock === 0;
  const images = (
    product.images?.length
      ? product.images
      : product.image
      ? [product.image]
      : []
  )
    .map(normalizeImageUrl)
    .filter(Boolean);
  const currentPrice = Number(product.price || 0);
  const compareAtPrice = Number(product.compareAtPrice || 0);
  const hasDiscount = compareAtPrice > currentPrice;
  const discountPercentage = hasDiscount
    ? Math.round(((compareAtPrice - currentPrice) / compareAtPrice) * 100)
    : 0;
  const productCategoryId =
    typeof product.category === "object"
      ? product.category?._id
      : product.category;

  const fallbackCategory = categories.find(
    (category) => category._id === productCategoryId
  );

  const categoryName =
    (typeof product.category === "object" && product.category?.name) ||
    fallbackCategory?.name ||
    "Collection";

  const categorySlug =
    (typeof product.category === "object" && product.category?.slug) ||
    fallbackCategory?.slug ||
    "";

  const rating = reviewStats.average || Number(product.rating || 0) || 0;
  const ratingCount = reviewStats.count || Number(product.reviewCount || 0) || 0;

  const colorName = product.color || "Black";
  const colorSwatches = [
    "#111111",
    "#19334a",
    "#ddd7c7",
    "#5b4c35",
    "#2d2d2b",
  ];

  const changeQuantity = (delta) => {
    setQuantity((current) => Math.max(1, Math.min(current + delta, stock)));
  };

  const addProduct = async () => {
    if (isSoldOut) return false;
    await addToCart(product._id, quantity);
    return true;
  };

  const handleAddToCart = async () => {
    try {
      setAddingToCart(true);
      await addProduct();
      toast.success(`${quantity} ${quantity === 1 ? "item" : "items"} added to cart`);
    } catch (err) {
      if (err.response?.status === 401) {
        toast.error("Please login to add items to your cart");
      } else {
        toast.error(err.response?.data?.message || "Unable to add product to cart");
      }
    } finally {
      setAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    try {
      setBuyingNow(true);
      await addProduct();
      navigate("/checkout");
    } catch (err) {
      if (err.response?.status === 401) {
        toast.error("Please login before buying this product");
      } else {
        toast.error(err.response?.data?.message || "Unable to continue to checkout");
      }
    } finally {
      setBuyingNow(false);
    }
  };

  const toggleSaved = () => {
    const added = toggleWishlist(product);
    toast.success(added ? "Added to wishlist" : "Removed from wishlist");
  };

  const submitReview = async (event) => {
    event.preventDefault();
    try {
      setReviewSubmitting(true);
      const data = await reviewService.createReview(product._id, reviewForm);
      toast.success(data.message || "Review submitted");
      const fresh = await reviewService.getReviews(product._id);
      setReviews(fresh.data?.reviews || []);
      setReviewStats({ average: fresh.data?.average || 0, count: fresh.data?.count || 0 });
      setReviewForm({ rating: 5, title: "", comment: "" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Unable to submit review");
    } finally {
      setReviewSubmitting(false);
    }
  };

  return (
    <main className={tw("vanta-product-page")}>
      <div className={tw("vanta-product-breadcrumbs")}>
        <Link to="/">Home</Link>
        <ChevronRight size={13} />
        {categorySlug ? <Link to={`/products?category=${categorySlug}`}>{categoryName}</Link> : <span>{categoryName}</span>}
        <ChevronRight size={13} />
        <span>{product.name}</span>
      </div>

      <section className={tw("vanta-product-shell vanta-reveal")}>
        <div className={tw("vanta-product-gallery")}>
          <div className={tw("vanta-product-thumbs")}>
            {images.map((image, index) => (
              <button
                key={`${image}-${index}`}
                type="button"
                onClick={() => setSelectedImage(image)}
                className={tw(`vanta-product-thumb ${selectedImage === image ? "active" : ""}`)}
                aria-label={`View product image ${index + 1}`}
              >
                <img src={image} alt={`${product.name} ${index + 1}`} />
              </button>
            ))}
          </div>

          <div className={tw("vanta-product-main-image")}>
            {selectedImage ? (
              <img src={selectedImage} alt={product.name} />
            ) : (
              <span>VANTA</span>
            )}
            {hasDiscount && <span className={tw("vanta-product-sale")}>{discountPercentage}% OFF</span>}
            {product.isFeatured && <span className={tw("vanta-product-featured")}>FEATURED</span>}
          </div>
        </div>

        <aside className={tw("vanta-product-info-panel")}>
          <p className={tw("vanta-eyebrow")}>{categoryName}</p>
          <div className={tw("vanta-product-title-row")}>
            <h1>{product.name}</h1>
            <button
              type="button"
              onClick={toggleSaved}
              className={tw(`vanta-product-wishlist ${isWishlisted ? "saved" : ""}`)}
              aria-label="Toggle wishlist"
            >
              <Heart size={19} fill={isWishlisted ? "currentColor" : "none"} />
            </button>
          </div>

          <div className={tw("vanta-product-rating")}>
            <span className={tw("vanta-stars")}>
              {[1, 2, 3, 4, 5].map((item) => (
                <Star key={item} size={14} fill={item <= Math.round(rating) ? "currentColor" : "none"} />
              ))}
            </span>
            <span>{rating ? rating.toFixed(1) : "5.0"}</span>
            <span className={tw("vanta-rating-muted")}>({ratingCount || 0} reviews)</span>
          </div>

          <div className={tw("vanta-product-price-row")}>
            <strong>{formatPrice(currentPrice)}</strong>
            {hasDiscount && <del>{formatPrice(compareAtPrice)}</del>}
          </div>
          <p className={tw("vanta-tax-note")}>Inclusive of all taxes</p>

          <p className={tw("vanta-product-short-description")}>
            {product.description || "A refined VANTA piece designed for everyday movement, with thoughtful storage and a premium finish."}
          </p>

          <div className={tw("vanta-product-option")}>
            <div className={tw("vanta-option-label")}><span>Color:</span> <b>{colorName}</b></div>
            <div className={tw("vanta-color-swatches")}>
              {colorSwatches.map((color, index) => (
                <button
                  key={color}
                  type="button"
                  className={tw(`vanta-color-swatch ${index === 0 ? "active" : ""}`)}
                  style={{ background: color }}
                  aria-label={`Color option ${index + 1}`}
                />
              ))}
            </div>
          </div>

          <div className={tw("vanta-stock-row")}>
            {isSoldOut ? (
              <span className="out">Currently sold out</span>
            ) : stock <= 5 ? (
              <span className="low">Only {stock} left in stock</span>
            ) : (
              <span className="in"><Check size={14} /> In Stock</span>
            )}
          </div>

          {!isSoldOut && (
            <>
              <div className={tw("vanta-product-buy-row")}>
                <div className={tw("vanta-quantity")}>
                  <button type="button" onClick={() => changeQuantity(-1)} disabled={quantity <= 1 || addingToCart || buyingNow}>
                    <Minus size={14} />
                  </button>
                  <span>{quantity}</span>
                  <button type="button" onClick={() => changeQuantity(1)} disabled={quantity >= stock || addingToCart || buyingNow}>
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              <button type="button" onClick={handleAddToCart} disabled={addingToCart || buyingNow} className={tw("vanta-product-primary-btn")}>
                <ShoppingBag size={17} />
                {addingToCart ? "Adding to cart..." : "Add to Cart"}
              </button>

              <button type="button" onClick={handleBuyNow} disabled={addingToCart || buyingNow} className={tw("vanta-product-secondary-btn")}>
                {buyingNow ? "Opening checkout..." : "Buy Now"}
              </button>
            </>
          )}

          {isSoldOut && <button disabled className={tw("vanta-product-secondary-btn disabled")}>Sold Out</button>}

          <div className={tw("vanta-product-benefits")}>
            <div><Truck size={22} /><span><b>Free Shipping</b><small>On orders above ₹999</small></span></div>
            <div><RotateCcw size={21} /><span><b>7 Days Return</b><small>Hassle-free returns</small></span></div>
            <div><ShieldCheck size={22} /><span><b>Secure Payment</b><small>100% secure checkout</small></span></div>
          </div>
        </aside>
      </section>

      <section className={tw("vanta-product-tabs-section")}>
        <div className={tw("vanta-product-tabs")}>
          {["description", "specifications", "shipping"].map((tab) => (
            <button key={tab} type="button" className={activeTab === tab ? "active" : ""} onClick={() => setActiveTab(tab)}>
              {tab === "description" ? "Description" : tab === "specifications" ? "Specifications" : "Shipping & Returns"}
            </button>
          ))}
        </div>

        <div className={tw("vanta-product-tab-content")}>
          {activeTab === "description" && (
            <div>
              <h2>Made for modern movement.</h2>
              <p>{product.description || "The VANTA collection balances clean architecture with practical details, giving your everyday carry a polished finish."}</p>
              <ul>
                <li>Designed for everyday city use</li>
                <li>Thoughtful compartments for daily essentials</li>
                <li>Comfort-focused construction</li>
                <li>Premium VANTA finish</li>
              </ul>
            </div>
          )}

          {activeTab === "specifications" && (
            <div className={tw("vanta-spec-grid")}>
              <div><span>Brand</span><b>{product.brand || "Vanta Bags"}</b></div>
              <div><span>Material</span><b>{product.material || "Premium construction"}</b></div>
              <div><span>Color</span><b>{colorName}</b></div>
              <div><span>SKU</span><b>{product.sku || "N/A"}</b></div>
              <div><span>Availability</span><b>{stock > 0 ? "In stock" : "Sold out"}</b></div>
            </div>
          )}

          {activeTab === "shipping" && (
            <div className={tw("vanta-shipping-copy")}>
              <p><b>Free shipping</b> is available on orders above ₹999.</p>
              <p>Orders are carefully packed before dispatch. Eligible returns can be requested within 7 days according to the store's return policy.</p>
              <p>Payments are processed securely through the checkout provider.</p>
            </div>
          )}
        </div>
      </section>

      <section className={tw("vanta-reviews-section")}>
        <div className={tw("vanta-section-head")}>
          <div>
            <p className={tw("vanta-eyebrow")}>CUSTOMER NOTES</p>
            <h2 className={tw("vanta-heading")}>Reviews</h2>
          </div>
          <div className={tw("vanta-review-summary")}>
            <div className={tw("vanta-stars")}>{[1, 2, 3, 4, 5].map((item) => <Star key={item} size={16} fill={item <= Math.round(rating) ? "currentColor" : "none"} />)}</div>
            <span>{rating ? rating.toFixed(1) : "No rating"} · {ratingCount} reviews</span>
          </div>
        </div>

        <div className={tw("vanta-review-grid")}>
          {reviews.length ? reviews.map((review) => (
            <article key={review._id} className={tw("vanta-review-card")}>
              <div className={tw("vanta-stars")}>{[1, 2, 3, 4, 5].map((item) => <Star key={item} size={14} fill={item <= review.rating ? "currentColor" : "none"} />)}</div>
              <h3>{review.title || "Customer review"}</h3>
              <p>{review.comment}</p>
              <small>{review.user?.name || "Verified customer"}</small>
            </article>
          )) : <p className={tw("vanta-empty-reviews")}>No reviews yet. Be the first verified buyer to leave one.</p>}
        </div>

        <form onSubmit={submitReview} className={tw("vanta-review-form")}>
          <p className={tw("vanta-eyebrow")}>PURCHASED THIS PIECE?</p>
          <div className={tw("vanta-review-form-grid")}>
            <select value={reviewForm.rating} onChange={(event) => setReviewForm({ ...reviewForm, rating: Number(event.target.value) })}>
              <option value="5">5 stars</option>
              <option value="4">4 stars</option>
              <option value="3">3 stars</option>
              <option value="2">2 stars</option>
              <option value="1">1 star</option>
            </select>
            <input value={reviewForm.title} onChange={(event) => setReviewForm({ ...reviewForm, title: event.target.value })} placeholder="Review title" />
          </div>
          <textarea required value={reviewForm.comment} onChange={(event) => setReviewForm({ ...reviewForm, comment: event.target.value })} placeholder="Tell us what you think" />
          <button type="submit" disabled={reviewSubmitting}>{reviewSubmitting ? "Submitting..." : "Submit review"}</button>
        </form>
      </section>

      {related.length > 0 && (
        <section className={tw("vanta-related-section")}>
          <p className={tw("vanta-eyebrow")}>CURATED FOR YOU</p>
          <h2 className={tw("vanta-heading")}>You may also like</h2>
          <div className={tw("vanta-related-grid")}>
            {related.map((item) => (
              <Link key={item._id} to={`/products/${item.slug}`} className={tw("vanta-related-card")}>
                <div><img src={item.images?.[0]} alt={item.name} /></div>
                <h3>{item.name}</h3>
                <p>{formatPrice(item.price)}</p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
};

export default ProductDetails;
