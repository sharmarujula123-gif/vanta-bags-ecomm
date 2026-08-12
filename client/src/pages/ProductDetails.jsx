import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Check,
  Minus,
  Plus,
  ShoppingBag,
} from "lucide-react";
import toast from "react-hot-toast";

import productService from "../services/productService";
import useCartStore from "../store/cartStore";

const formatPrice = (price) => {
  return `₹${Number(price || 0).toLocaleString(
    "en-IN"
  )}`;
};

const ProductDetails = () => {
  const { slug } = useParams();

  const [product, setProduct] =
    useState(null);

  const [selectedImage, setSelectedImage] =
    useState("");

  const [quantity, setQuantity] =
    useState(1);

  const [loading, setLoading] =
    useState(true);

  const [addingToCart, setAddingToCart] =
    useState(false);

  const [error, setError] =
    useState("");

  const addToCart = useCartStore(
    (state) => state.addToCart
  );

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const data =
          await productService.getProductBySlug(
            slug
          );

        const loadedProduct =
          data.data?.product ||
          data.product;

        setProduct(loadedProduct);

        setSelectedImage(
          loadedProduct?.images?.[0] ||
            loadedProduct?.image ||
            ""
        );

        setQuantity(1);
      } catch (error) {
        setError(
          error.response?.data?.message ||
            "Unable to load this product."
        );
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [slug]);

  if (loading) {
    return (
      <main className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2">
          <div className="aspect-square animate-pulse bg-stone-200" />

          <div className="space-y-6 py-8">
            <div className="h-4 w-32 animate-pulse bg-stone-200" />
            <div className="h-14 w-3/4 animate-pulse bg-stone-200" />
            <div className="h-8 w-32 animate-pulse bg-stone-200" />
            <div className="h-24 w-full animate-pulse bg-stone-200" />
            <div className="h-14 w-full animate-pulse bg-stone-200" />
          </div>
        </div>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
        <p className="text-xs font-bold tracking-[0.25em]">
          VANTA BAGS
        </p>

        <h1 className="mt-5 font-serif text-5xl">
          Product unavailable
        </h1>

        <p className="mt-4 text-stone-500">
          {error ||
            "We couldn't find this product."}
        </p>

        <Link
          to="/products"
          className="mt-8 inline-flex items-center gap-2 bg-stone-950 px-6 py-3 text-sm font-semibold text-white hover:bg-stone-800"
        >
          <ArrowLeft size={16} />
          Back to Collection
        </Link>
      </main>
    );
  }

  const stock = Math.max(
    Number(product.stock || 0),
    0
  );

  const isSoldOut = stock === 0;

  const images = (
    product.images?.length
      ? product.images
      : product.image
      ? [product.image]
      : []
  ).filter(Boolean);

  const compareAtPrice = Number(
    product.compareAtPrice || 0
  );

  const currentPrice = Number(
    product.price || 0
  );

  const hasDiscount =
    compareAtPrice > currentPrice;

  const discountPercentage = hasDiscount
    ? Math.round(
        ((compareAtPrice -
          currentPrice) /
          compareAtPrice) *
          100
      )
    : 0;

  const increaseQuantity = () => {
    setQuantity((current) =>
      Math.min(current + 1, stock)
    );
  };

  const decreaseQuantity = () => {
    setQuantity((current) =>
      Math.max(current - 1, 1)
    );
  };

  const handleAddToCart = async () => {
    if (isSoldOut) return;

    try {
      setAddingToCart(true);

      await addToCart(
        product._id,
        quantity
      );

      toast.success(
        `${quantity} ${
          quantity === 1
            ? "item"
            : "items"
        } added to cart`
      );
    } catch (error) {
      if (
        error.response?.status === 401
      ) {
        toast.error(
          "Please login to add items to your cart"
        );
        return;
      }

      toast.error(
        error.response?.data?.message ||
          "Unable to add product to cart"
      );
    } finally {
      setAddingToCart(false);
    }
  };

  return (
    <main className="mx-auto max-w-7xl px-5 py-10 lg:px-8 lg:py-16">

      {/* Back */}

      <Link
        to="/products"
        className="inline-flex items-center gap-2 text-sm text-stone-500 transition hover:text-stone-950"
      >
        <ArrowLeft size={16} />
        Back to Collection
      </Link>

      <div className="mt-10 grid gap-12 lg:grid-cols-2 lg:gap-20">

        {/* Images */}

        <div>
          <div className="relative aspect-square overflow-hidden bg-stone-100">
            {selectedImage ? (
              <img
                src={selectedImage}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-sm font-bold tracking-[0.3em] text-stone-500">
                VANTA
              </div>
            )}

            {product.isFeatured && (
              <span className="absolute left-4 top-4 bg-stone-950 px-3 py-1.5 text-[10px] font-bold tracking-[0.15em] text-white">
                FEATURED
              </span>
            )}

            {hasDiscount && (
              <span className="absolute right-4 top-4 bg-white px-3 py-1.5 text-[10px] font-bold tracking-[0.15em] text-stone-950">
                {discountPercentage}% OFF
              </span>
            )}
          </div>

          {/* Thumbnails */}

          {images.length > 1 && (
            <div className="mt-4 grid grid-cols-5 gap-3">
              {images.map(
                (image, index) => (
                  <button
                    key={`${image}-${index}`}
                    type="button"
                    onClick={() =>
                      setSelectedImage(
                        image
                      )
                    }
                    className={`aspect-square overflow-hidden border ${
                      selectedImage === image
                        ? "border-stone-950"
                        : "border-stone-200"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${
                        index + 1
                      }`}
                      className="h-full w-full object-cover"
                    />
                  </button>
                )
              )}
            </div>
          )}
        </div>

        {/* Product information */}

        <div className="flex flex-col justify-center">

          <p className="text-xs font-bold tracking-[0.25em] text-stone-500">
            VANTA COLLECTION
          </p>

          <h1 className="mt-4 font-serif text-5xl leading-tight md:text-6xl">
            {product.name}
          </h1>

          {/* Price */}

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <span className="text-2xl font-medium">
              {formatPrice(
                product.price
              )}
            </span>

            {hasDiscount && (
              <>
                <span className="text-lg text-stone-400 line-through">
                  {formatPrice(
                    compareAtPrice
                  )}
                </span>

                <span className="text-xs font-bold text-emerald-700">
                  Save{" "}
                  {formatPrice(
                    compareAtPrice -
                      currentPrice
                  )}
                </span>
              </>
            )}
          </div>

          {/* Description */}

          {product.description && (
            <p className="mt-8 max-w-xl leading-8 text-stone-600">
              {product.description}
            </p>
          )}

          {/* Product metadata */}

          <div className="mt-8 grid grid-cols-2 border-y border-stone-200">
            {product.brand && (
              <div className="border-b border-r border-stone-200 px-4 py-4">
                <p className="text-[9px] font-bold tracking-[0.15em] text-stone-400">
                  BRAND
                </p>

                <p className="mt-1 text-sm">
                  {product.brand}
                </p>
              </div>
            )}

            {product.material && (
              <div className="border-b border-stone-200 px-4 py-4">
                <p className="text-[9px] font-bold tracking-[0.15em] text-stone-400">
                  MATERIAL
                </p>

                <p className="mt-1 text-sm">
                  {product.material}
                </p>
              </div>
            )}

            {product.color && (
              <div className="border-r border-stone-200 px-4 py-4">
                <p className="text-[9px] font-bold tracking-[0.15em] text-stone-400">
                  COLOR
                </p>

                <p className="mt-1 text-sm">
                  {product.color}
                </p>
              </div>
            )}

            {product.sku && (
              <div className="px-4 py-4">
                <p className="text-[9px] font-bold tracking-[0.15em] text-stone-400">
                  SKU
                </p>

                <p className="mt-1 text-sm">
                  {product.sku}
                </p>
              </div>
            )}
          </div>

          {/* Stock */}

          <div className="mt-8">
            {isSoldOut ? (
              <p className="text-sm font-semibold text-red-600">
                Currently sold out
              </p>
            ) : stock <= 5 ? (
              <p className="text-sm font-semibold text-amber-700">
                Only {stock} left in stock
              </p>
            ) : (
              <p className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700">
                <Check size={16} />
                In stock
              </p>
            )}
          </div>

          {!isSoldOut && (
            <>
              {/* Quantity */}

              <div className="mt-8">
                <p className="mb-3 text-xs font-bold tracking-[0.2em]">
                  QUANTITY
                </p>

                <div className="flex h-12 w-36 items-center border border-stone-300">
                  <button
                    type="button"
                    onClick={
                      decreaseQuantity
                    }
                    disabled={
                      quantity === 1 ||
                      addingToCart
                    }
                    className="flex h-full w-12 items-center justify-center transition hover:bg-stone-100 disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    <Minus size={16} />
                  </button>

                  <span className="flex flex-1 justify-center text-sm font-medium">
                    {quantity}
                  </span>

                  <button
                    type="button"
                    onClick={
                      increaseQuantity
                    }
                    disabled={
                      quantity >= stock ||
                      addingToCart
                    }
                    className="flex h-full w-12 items-center justify-center transition hover:bg-stone-100 disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              {/* Add to cart */}

              <button
                type="button"
                onClick={
                  handleAddToCart
                }
                disabled={addingToCart}
                className="mt-8 flex h-14 w-full items-center justify-center gap-3 bg-stone-950 text-sm font-semibold text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:bg-stone-400"
              >
                <ShoppingBag
                  size={18}
                />

                {addingToCart
                  ? "Adding..."
                  : "Add to Cart"}
              </button>
            </>
          )}

          {isSoldOut && (
            <button
              type="button"
              disabled
              className="mt-8 h-14 w-full cursor-not-allowed bg-stone-300 text-sm font-semibold text-stone-500"
            >
              Sold Out
            </button>
          )}

          {/* Continue shopping */}

          <Link
            to="/products"
            className="mt-4 flex h-12 items-center justify-center border border-stone-300 text-sm font-semibold transition hover:border-stone-950"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </main>
  );
};

export default ProductDetails;