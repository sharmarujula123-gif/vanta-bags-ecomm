import { Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { tw } from "../../utils/twStyles.js";
import { formatPrice, normalizeCategoryKey, normalizeImageUrl } from "../../utils/productHelpers.js";

const ProductCard = ({ product, isWishlisted, toggleWishlist }) => {
  const rating = Number(
    product.rating?.average || product.averageRating || 0
  );
  const color = String(product.color || "").toLowerCase();
  const discounted = product.compareAtPrice > product.price;

  return (
    <article className={tw("vanta-collection-product")} key={product._id}>
      <Link to={`/products/${product.slug}`} className={tw("vanta-collection-product-link")}>
        <div className={tw("vanta-collection-product-image")}>
          {normalizeImageUrl(product.images?.[0]) ? (
            <img
              src={normalizeImageUrl(product.images?.[0])}
              alt={product.name}
            />
          ) : (
            <div className={tw("vanta-image-placeholder")}>VANTA</div>
          )}

          {product.isFeatured && product.stock > 0 && (
            <span className={tw("vanta-collection-badge")}>NEW</span>
          )}

          {product.stock === 0 && (
            <span className={tw("vanta-collection-badge sold")}>Sold out</span>
          )}

          <button
            type="button"
            className={tw(`vanta-product-heart ${isWishlisted ? "active" : ""}`)}
            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            onClick={(event) => {
              event.preventDefault();
              toggleWishlist(product);
            }}
          >
            <Heart size={15} fill={isWishlisted ? "currentColor" : "none"} />
          </button>
        </div>

        <div className={tw("vanta-collection-product-meta")}>
          <div className="flex items-start justify-between gap-2">
            <h3>{product.name}</h3>

            {discounted && (
              <span className={tw("vanta-discount-badge")}>
                -{Math.round((1 - product.price / product.compareAtPrice) * 100)}%
              </span>
            )}
          </div>

          <div className="mt-1 flex items-center gap-2">
            <p>{formatPrice(product.price)}</p>

            {discounted && (
              <span className={tw("vanta-old-price inline")}>
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
          </div>

          {rating > 0 && (
            <div className={tw("vanta-rating")}>
              <span>★★★★★</span>
              <small>{rating.toFixed(1)}</small>
            </div>
          )}

          {color && (
            <div className={tw("vanta-product-color-label")}>
              <span className={tw(`vanta-mini-color ${normalizeCategoryKey(color)}`)} />
              {product.color}
            </div>
          )}
        </div>
      </Link>
    </article>
  );
};

export default ProductCard;
