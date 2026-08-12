import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  Package,
  AlertTriangle,
} from "lucide-react";
import toast from "react-hot-toast";

import orderService from "../services/orderService";

const OrderDetails = () => {
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    const loadOrder = async () => {
      try {
        const data = await orderService.getOrderById(id);

        setOrder(data.data?.order || data.order);
      } catch (error) {
        setError(
          error.response?.data?.message ||
            "Unable to load this order."
        );
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [id]);

  if (loading) {
    return (
      <main className="mx-auto max-w-5xl px-5 py-16 lg:px-8">
        <div className="animate-pulse space-y-6">
          <div className="h-10 w-56 bg-stone-200" />
          <div className="h-32 bg-stone-200" />
          <div className="h-64 bg-stone-200" />
        </div>
      </main>
    );
  }

  if (error || !order) {
    return (
      <main className="mx-auto max-w-5xl px-5 py-20 text-center lg:px-8">
        <p className="text-xs font-bold tracking-[0.25em] text-stone-500">
          VANTA BAGS
        </p>

        <h1 className="mt-5 font-serif text-4xl">
          Order unavailable
        </h1>

        <p className="mt-4 text-stone-500">
          {error || "We couldn't find this order."}
        </p>

        <Link
          to="/products"
          className="mt-8 inline-flex items-center gap-2 bg-stone-950 px-6 py-3 text-sm font-semibold text-white"
        >
          <ArrowLeft size={16} />
          Continue Shopping
        </Link>
      </main>
    );
  }

  const status = order.orderStatus || "pending";

  const statusLabel =
    status.charAt(0).toUpperCase() +
    status.slice(1);

  const getStatusClass = () => {
    if (status === "cancelled") {
      return "bg-red-50 text-red-700";
    }

    if (
      status === "delivered" ||
      status === "confirmed"
    ) {
      return "bg-green-50 text-green-700";
    }

    if (status === "shipped") {
      return "bg-blue-50 text-blue-700";
    }

    if (status === "processing") {
      return "bg-purple-50 text-purple-700";
    }

    return "bg-stone-100 text-stone-700";
  };

  const canCancel =
    order.orderStatus === "pending" &&
    order.paymentStatus !== "paid";

  const handleCancelOrder = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this order?"
    );

    if (!confirmed) return;

    try {
      setCancelling(true);

      await orderService.cancelOrder(order._id);

      setOrder((currentOrder) => ({
        ...currentOrder,
        orderStatus: "cancelled",
        inventoryReserved: false,
        paymentExpiresAt: null,
      }));

      toast.success("Order cancelled successfully");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to cancel order"
      );
    } finally {
      setCancelling(false);
    }
  };

  return (
    <main className="mx-auto max-w-5xl px-5 py-10 lg:px-8 lg:py-16">
      {/* Back */}
      <Link
        to="/products"
        className="inline-flex items-center gap-2 text-sm text-stone-500 transition hover:text-stone-950"
      >
        <ArrowLeft size={16} />
        Continue Shopping
      </Link>

      {/* Order Header */}
      <div className="mt-10 border-b border-stone-200 pb-10">
        <CheckCircle2
          size={42}
          strokeWidth={1.5}
        />

        <p className="mt-6 text-xs font-bold tracking-[0.25em] text-stone-500">
          VANTA BAGS
        </p>

        <h1 className="mt-3 font-serif text-5xl">
          Order Details
        </h1>

        <p className="mt-4 text-stone-500">
          {status === "cancelled"
            ? "This order has been cancelled."
            : "Here are the details of your order."}
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-4">
          <span className="text-sm font-medium">
            Order #{order.orderNumber || order._id}
          </span>

          <span
            className={`px-3 py-1 text-xs font-semibold ${getStatusClass()}`}
          >
            {statusLabel}
          </span>

          <span className="border border-stone-200 px-3 py-1 text-xs font-semibold">
            Payment:{" "}
            {order.paymentStatus || "pending"}
          </span>
        </div>
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_340px]">
        {/* Items */}
        <section>
          <div className="flex items-center gap-3 border-b border-stone-200 pb-4">
            <Package size={20} />

            <h2 className="font-serif text-2xl">
              Order Items
            </h2>
          </div>

          <div className="divide-y divide-stone-200">
            {order.items?.map((item, index) => (
              <div
                key={item._id || `${order._id}-${index}`}
                className="flex gap-5 py-6"
              >
                <div className="h-24 w-24 shrink-0 overflow-hidden bg-stone-200">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs font-bold tracking-[0.2em] text-stone-400">
                      VANTA
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <h3 className="font-medium">
                    {item.name}
                  </h3>

                  <p className="mt-2 text-sm text-stone-500">
                    Quantity: {item.quantity}
                  </p>

                  <p className="mt-2 text-sm font-semibold">
                    ₹
                    {Number(item.price).toLocaleString(
                      "en-IN"
                    )}
                  </p>
                </div>

                <div className="text-right text-sm font-semibold">
                  ₹
                  {Number(
                    item.price * item.quantity
                  ).toLocaleString("en-IN")}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Summary */}
        <aside className="h-fit border border-stone-200 p-6">
          <h2 className="font-serif text-2xl">
            Order Summary
          </h2>

          <div className="mt-6 space-y-4 text-sm">
            <div className="flex justify-between">
              <span className="text-stone-500">
                Subtotal
              </span>

              <span>
                ₹
                {Number(
                  order.subtotal || 0
                ).toLocaleString("en-IN")}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-stone-500">
                Shipping
              </span>

              <span>
                {Number(order.shippingFee || 0) === 0
                  ? "Free"
                  : `₹${Number(
                      order.shippingFee || 0
                    ).toLocaleString("en-IN")}`}
              </span>
            </div>

            <div className="flex justify-between border-t border-stone-200 pt-4 text-lg font-semibold">
              <span>Total</span>

              <span>
                ₹
                {Number(
                  order.total || 0
                ).toLocaleString("en-IN")}
              </span>
            </div>
          </div>

          {/* Address */}
          {order.shippingAddress && (
            <div className="mt-8 border-t border-stone-200 pt-6">
              <p className="text-xs font-bold tracking-[0.2em] text-stone-500">
                SHIPPING TO
              </p>

              <p className="mt-3 text-sm font-semibold">
                {order.shippingAddress.name}
              </p>

              <p className="mt-2 text-sm leading-6 text-stone-500">
                {order.shippingAddress.addressLine1}

                {order.shippingAddress.addressLine2 &&
                  `, ${order.shippingAddress.addressLine2}`}

                <br />

                {order.shippingAddress.city},{" "}
                {order.shippingAddress.state}{" "}
                {order.shippingAddress.postalCode}

                <br />

                {order.shippingAddress.country}
              </p>

              <p className="mt-2 text-sm text-stone-500">
                {order.shippingAddress.phone}
              </p>
            </div>
          )}
        </aside>
      </div>

      {/* Actions */}
      <div className="mt-10 flex flex-wrap gap-4">
        {canCancel && (
          <button
            type="button"
            onClick={handleCancelOrder}
            disabled={cancelling}
            className="inline-flex items-center gap-2 border border-red-300 px-7 py-4 text-sm font-semibold text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <AlertTriangle size={16} />

            {cancelling
              ? "Cancelling..."
              : "Cancel Order"}
          </button>
        )}

        <Link
          to="/products"
          className="bg-stone-950 px-7 py-4 text-sm font-semibold text-white transition hover:bg-stone-800"
        >
          Continue Shopping
        </Link>

        <Link
          to="/account/orders"
          className="border border-stone-300 px-7 py-4 text-sm font-semibold transition hover:border-stone-950"
        >
          View My Orders
        </Link>
      </div>
    </main>
  );
};

export default OrderDetails;