import { ArrowRight, ShoppingBag } from "lucide-react";

const OrderSummary = ({
  cart,
  subtotal,
  shipping,
  total,
  onPlaceOrder,
  placingOrder,
  disabled,
}) => {
  const items = cart?.items || [];

  return (
    <aside className="lg:sticky lg:top-8 lg:h-fit">
      <div className="border border-stone-200 bg-stone-50 p-6">
        <div className="flex items-center gap-3">
          <ShoppingBag size={19} />

          <h2 className="font-serif text-2xl">
            Your order
          </h2>
        </div>

        <div className="mt-6 space-y-5">
          {items.map((item) => (
            <div
              key={item.product?._id}
              className="flex gap-4"
            >
              <div className="h-16 w-16 shrink-0 overflow-hidden bg-stone-200">
                {item.product?.images?.[0] ? (
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-[9px] font-bold tracking-widest text-stone-500">
                    VANTA
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">
                  {item.product?.name}
                </p>

                <p className="mt-1 text-xs text-stone-500">
                  Qty: {item.quantity}
                </p>
              </div>

              <p className="text-sm font-medium">
                ₹
                {(
                  Number(item.product?.price || 0) *
                  item.quantity
                ).toLocaleString("en-IN")}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-7 border-t border-stone-200 pt-5">
          <div className="flex justify-between text-sm">
            <span className="text-stone-500">
              Subtotal
            </span>

            <span>
              ₹{subtotal.toLocaleString("en-IN")}
            </span>
          </div>

          <div className="mt-3 flex justify-between text-sm">
            <span className="text-stone-500">
              Shipping
            </span>

            <span>
              {shipping === 0
                ? "Free"
                : `₹${shipping.toLocaleString("en-IN")}`}
            </span>
          </div>

          <div className="mt-5 flex justify-between border-t border-stone-200 pt-5">
            <span className="font-semibold">
              Total
            </span>

            <span className="text-lg font-semibold">
              ₹{total.toLocaleString("en-IN")}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={onPlaceOrder}
          disabled={disabled || placingOrder}
          className="mt-6 flex h-14 w-full items-center justify-center gap-3 bg-stone-950 text-sm font-semibold text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:bg-stone-300"
        >
          {placingOrder
            ? "Processing..."
            : "Place Order"}

          {!placingOrder && (
            <ArrowRight size={17} />
          )}
        </button>

        {!disabled && (
          <p className="mt-4 text-center text-xs leading-5 text-stone-500">
            You will be redirected to Razorpay to complete
            your payment.
          </p>
        )}
      </div>
    </aside>
  );
};

export default OrderSummary;