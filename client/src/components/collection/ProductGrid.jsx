import { tw } from "../../utils/twStyles.js";
import ProductCard from "./ProductCard";

function EmptyState({ title, message, action, onAction }) {
  return (
    <div className={tw("vanta-collection-empty")}>
      <h2>{title}</h2>
      <p>{message}</p>
      <button type="button" onClick={onAction}>{action}</button>
    </div>
  );
}

export default function ProductGrid({ loading, error, products, onRetry, onReset, wishlist, onWishlist }) {
  if (loading) {
    return (
      <div className={tw("vanta-collection-grid")}>
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <div className={tw("vanta-collection-product skeleton")} key={item}>
            <div className={tw("vanta-collection-product-image")} />
            <div className="skeleton-line wide" />
            <div className="skeleton-line short" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return <EmptyState title="Something went wrong" message={error} action="Try again" onAction={onRetry} />;
  }

  if (!products.length) {
    return <EmptyState title="No bags found" message="Try changing your search or collection filters." action="Clear filters" onAction={onReset} />;
  }

  return (
    <div className={tw("vanta-collection-grid")}>
      {products.map((product) => (
        <ProductCard
          key={product._id}
          product={product}
          wishlisted={wishlist.has(product._id)}
          onWishlist={onWishlist}
        />
      ))}
    </div>
  );
}
