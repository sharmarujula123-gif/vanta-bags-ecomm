import { tw } from "../../utils/twStyles.js";
import ProductCard from "./ProductCard.jsx";

const ProductGrid = ({ products, wishlistItems, toggleWishlist }) => (
  <div className={tw("vanta-collection-grid")}>
    {products.map((product) => (
      <ProductCard
        key={product._id}
        product={product}
        isWishlisted={wishlistItems.some((item) => item._id === product._id)}
        toggleWishlist={toggleWishlist}
      />
    ))}
  </div>
);

export default ProductGrid;
