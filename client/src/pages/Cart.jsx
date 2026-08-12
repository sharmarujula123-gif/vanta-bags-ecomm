import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
} from "lucide-react";
import cartService from "../services/cartService";
import useCartStore from "../store/cartStore";
import toast from "react-hot-toast";

const formatPrice = (price) => {
  return `₹${Number(price || 0).toLocaleString(
    "en-IN"
  )}`;
};

const Cart = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] =
    useState(null);
  const [clearing, setClearing] =
    useState(false);
  const setGlobalCart = useCartStore(
    (state) => state.setCart
  );

  const loadCart = async () => {
    try {
      setLoading(true);

      const data =
        await cartService.getCart();

      const loadedCart = data.data?.cart || null;
      setCart(loadedCart);
      setGlobalCart(loadedCart);
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error(
          "Please login to view your cart"
        );
      } else {
        toast.error(
          error.response?.data?.message ||
            "Unable to load cart"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  const updateQuantity = async (
    productId,
    quantity
  ) => {
    if (quantity < 1) return;

    try {
      setUpdatingId(productId);

      const data =
        await cartService.updateCartItem(
          productId,
          quantity
        );

      const updatedCart = data.data?.cart || null;
      setCart(updatedCart);
      setGlobalCart(updatedCart);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to update quantity"
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const removeItem = async (productId) => {
    try {
      setUpdatingId(productId);

      const data =
        await cartService.removeCartItem(
          productId
        );

      const updatedCart = data.data?.cart || null;
      setCart(updatedCart);
      setGlobalCart(updatedCart);

      toast.success("Item removed");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to remove item"
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const clearCart = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to clear your cart?"
    );

    if (!confirmed) return;

    try {
      setClearing(true);

      const data =
        await cartService.clearCart();

      const updatedCart = data.data?.cart || null;
      setCart(updatedCart);
      setGlobalCart(updatedCart);

      toast.success("Cart cleared");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to clear cart"
      );
    } finally {
      setClearing(false);
    }
  };

  if (loading) {
    return (
      <main className="mx-auto max-w-6xl px-5 py-20 lg:px-8">
        <div className="animate-pulse">
          <div className="h-10 w-40 bg-stone-200" />

          <div className="mt-10 h-32 bg-stone-200" />

          <div className="mt-5 h-32 bg-stone-200" />
        </div>
      </main>
    );
  }

  if (!cart || !cart.items?.length) {
    return (
      <main className="mx-auto max-w-6xl px-5 py-20 text-center lg:px-8">
        <ShoppingBag
          size={42}
          strokeWidth={1.5}
          className="mx-auto text-stone-400"
        />

        <p className="mt-6 text-xs font-bold tracking-[0.25em]">
          VANTA BAGS
        </p>

        <h1 className="mt-5 font-serif text-5xl">
          Your Cart
        </h1>

        <p className="mt-4 text-stone-500">
          Your cart is currently empty.
        </p>

        <Link
          to="/products"
          className="mt-8 inline-flex bg-stone-950 px-8 py-4 text-sm font-semibold text-white transition hover:bg-stone-800"
        >
          Continue Shopping
        </Link>
      </main>
    );
  }

  const subtotal = cart.items.reduce(
    (total, item) => {
      return (
        total +
        Number(item.product?.price || 0) *
          item.quantity
      );
    },
    0
  );

  const shipping =
    subtotal >= 2000 ? 0 : 100;

  const total = subtotal + shipping;

  return (
    <main className="mx-auto max-w-6xl px-5 py-16 lg:px-8">

      {/* Header */}

      <div className="flex flex-col gap-5 border-b border-stone-200 pb-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold tracking-[0.25em]">
            VANTA BAGS
          </p>

          <h1 className="mt-4 font-serif text-5xl">
            Your Cart
          </h1>

          <p className="mt-3 text-sm text-stone-500">
            {cart.items.length}{" "}
            {cart.items.length === 1
              ? "item"
              : "items"}{" "}
            in your bag.
          </p>
        </div>

        <button
          type="button"
          onClick={clearCart}
          disabled={clearing}
          className="self-start text-sm text-stone-500 underline underline-offset-4 hover:text-stone-950 disabled:cursor-not-allowed disabled:opacity-40 sm:self-auto"
        >
          {clearing
            ? "Clearing..."
            : "Clear cart"}
        </button>
      </div>

      <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_360px]">

        {/* Cart items */}

        <div className="space-y-6">
          {cart.items.map((item) => {
            const product = item.product;

            if (!product) {
              return null;
            }

            const isUpdating =
              updatingId === product._id;

            const stock = Math.max(
              Number(product.stock || 0),
              0
            );

            const exceedsStock =
              item.quantity > stock;

            const isSoldOut =
              stock === 0;

            return (
              <div
                key={product._id}
                className="border-b border-stone-200 pb-6"
              >
                <div className="flex gap-5">

                  {/* Image */}

                  <Link
                    to={`/products/${product.slug}`}
                    className="h-32 w-32 shrink-0 overflow-hidden bg-stone-200"
                  >
                    {product.images?.[0] ? (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="h-full w-full object-cover transition duration-300 hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs font-bold tracking-[0.2em] text-stone-400">
                        VANTA
                      </div>
                    )}
                  </Link>

                  {/* Details */}

                  <div className="flex min-w-0 flex-1 flex-col justify-between gap-4">

                    <div className="flex justify-between gap-4">
                      <div className="min-w-0">
                        <Link
                          to={`/products/${product.slug}`}
                          className="font-semibold hover:underline"
                        >
                          {product.name}
                        </Link>

                        <p className="mt-2 text-sm text-stone-500">
                          {formatPrice(
                            product.price
                          )}
                        </p>

                        {isSoldOut && (
                          <p className="mt-2 text-xs font-semibold text-red-600">
                            Out of stock
                          </p>
                        )}

                        {!isSoldOut &&
                          exceedsStock && (
                            <p className="mt-2 text-xs font-semibold text-amber-700">
                              Only {stock} available
                            </p>
                          )}
                      </div>

                      <p className="shrink-0 font-semibold">
                        {formatPrice(
                          Number(
                            product.price
                          ) *
                            item.quantity
                        )}
                      </p>
                    </div>

                    <div className="flex items-center justify-between">

                      {/* Quantity */}

                      <div className="flex items-center border border-stone-300">
                        <button
                          type="button"
                          disabled={
                            isUpdating ||
                            item.quantity <= 1
                          }
                          onClick={() =>
                            updateQuantity(
                              product._id,
                              item.quantity - 1
                            )
                          }
                          className="p-2 transition hover:bg-stone-100 disabled:cursor-not-allowed disabled:opacity-30"
                        >
                          <Minus size={15} />
                        </button>

                        <span className="w-10 text-center text-sm">
                          {item.quantity}
                        </span>

                        <button
                          type="button"
                          disabled={
                            isUpdating ||
                            item.quantity >= stock ||
                            stock === 0
                          }
                          onClick={() =>
                            updateQuantity(
                              product._id,
                              item.quantity + 1
                            )
                          }
                          className="p-2 transition hover:bg-stone-100 disabled:cursor-not-allowed disabled:opacity-30"
                        >
                          <Plus size={15} />
                        </button>
                      </div>

                      {/* Remove */}

                      <button
                        type="button"
                        disabled={isUpdating}
                        onClick={() =>
                          removeItem(
                            product._id
                          )
                        }
                        className="flex items-center gap-2 text-sm text-stone-500 transition hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <Trash2 size={16} />

                        {isUpdating
                          ? "Updating..."
                          : "Remove"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary */}

        <aside className="h-fit border border-stone-200 p-6">
          <h2 className="font-serif text-2xl">
            Order Summary
          </h2>

          <div className="mt-6 space-y-4 border-b border-stone-200 pb-5 text-sm">

            <div className="flex justify-between">
              <span className="text-stone-500">
                Subtotal
              </span>

              <span className="font-semibold">
                {formatPrice(subtotal)}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-stone-500">
                Shipping
              </span>

              <span className="font-semibold">
                {shipping === 0
                  ? "Free"
                  : formatPrice(shipping)}
              </span>
            </div>
          </div>

          <div className="mt-5 flex justify-between text-lg font-semibold">
            <span>Total</span>

            <span>
              {formatPrice(total)}
            </span>
          </div>

          {subtotal < 2000 && (
            <p className="mt-4 text-xs leading-5 text-stone-500">
              Add{" "}
              {formatPrice(
                2000 - subtotal
              )}{" "}
              more to unlock free shipping.
            </p>
          )}

          <Link
            to="/checkout"
            className="mt-6 flex w-full items-center justify-center bg-stone-950 py-4 text-sm font-semibold text-white transition hover:bg-stone-800"
          >
            Proceed to Checkout
          </Link>

          <Link
            to="/products"
            className="mt-3 flex w-full items-center justify-center border border-stone-300 py-4 text-sm font-semibold transition hover:border-stone-950"
          >
            Continue Shopping
          </Link>
        </aside>
      </div>
    </main>
  );
};

export default Cart;