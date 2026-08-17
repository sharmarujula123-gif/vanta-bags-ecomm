import { tw } from "../../utils/twStyles.js";
import { Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { formatPrice, normalizeImageUrl } from "../../utils/product";

export default function ProductCard({ product, wishlisted, onWishlist }) {
  const rating = Number(product.rating?.average || product.averageRating || 0);

  return (
    <article className={tw("vanta-collection-product")}>
      <Link to={`/products/${product.slug}`} className={tw("vanta-collection-product-link")}>
        <div className={tw("vanta-collection-product-image")}>
          {normalizeImageUrl(product.images?.[0]) ? (
            <img src={normalizeImageUrl(product.images[0])} alt={product.name} />
          ) : (
            <div className={tw("vanta-image-placeholder")}>VANTA</div>
          )}

          {product.isFeatured && product.stock > 0 && (
            <span className={tw("vanta-collection-badge")}>Featured</span>
          )}
          {product.stock === 0 && (
            <span className={tw("vanta-collection-badge sold")}>Sold out</span>
          )}
        </div>

        <div className={tw("vanta-collection-product-meta")}>
          <h3>{product.name}</h3>
          <p>{formatPrice(product.price)}</p>
          {product.compareAtPrice > product.price && (
            <span className={tw("vanta-old-price")}>{formatPrice(product.compareAtPrice)}</span>
          )}
          {rating > 0 && (
            <div className={tw("vanta-rating")} aria-label={`${rating} out of 5 stars`}>
              <span>★★★★★</span><small>{rating.toFixed(1)}</small>
            </div>
          )}
        </div>
      </Link>

      <button
        type="button"
        className={tw(`vanta-product-heart ${wishlisted ? "active" : ""}`)}
        aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
        onClick={() => onWishlist(product)}
      >
        <Heart size={15} fill={wishlisted ? "currentColor" : "none"} />
      </button>
    </article>
  );
}
