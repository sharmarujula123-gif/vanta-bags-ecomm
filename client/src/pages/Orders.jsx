import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Package,
  XCircle,
} from "lucide-react";
import toast from "react-hot-toast";

import orderService from "../services/orderService";
import useAuthStore from "../store/authStore";

const statusStyles = {
  pending:
    "bg-amber-50 text-amber-700 border-amber-200",
  confirmed:
    "bg-blue-50 text-blue-700 border-blue-200",
  processing:
    "bg-purple-50 text-purple-700 border-purple-200",
  shipped:
    "bg-indigo-50 text-indigo-700 border-indigo-200",
  delivered:
    "bg-emerald-50 text-emerald-700 border-emerald-200",
  cancelled:
    "bg-red-50 text-red-700 border-red-200",
};

const paymentStyles = {
  pending:
    "bg-amber-50 text-amber-700 border-amber-200",
  paid:
    "bg-emerald-50 text-emerald-700 border-emerald-200",
  failed:
    "bg-red-50 text-red-700 border-red-200",
  refunded:
    "bg-purple-50 text-purple-700 border-purple-200",
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
};

const formatPrice = (price) => {
  return `₹${Number(price || 0).toLocaleString(
    "en-IN"
  )}`;
};

const canCancelOrder = (status) => {
  return [
    "pending",
    "confirmed",
    "processing",
  ].includes(status);
};

const Orders = () => {
  const isAuthenticated = useAuthStore(
    (state) => state.isAuthenticated
  );

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] =
    useState(null);

  useEffect(() => {
    const loadOrders = async () => {
      if (!isAuthenticated) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const data =
          await orderService.getMyOrders();

        setOrders(
          data.data?.orders || []
        );
      } catch (error) {
        toast.error(
          error.response?.data?.message ||
            "Unable to load orders"
        );
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [isAuthenticated]);

  const handleCancelOrder = async (
    orderId
  ) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this order?"
    );

    if (!confirmed) return;

    try {
      setCancellingId(orderId);

      await orderService.cancelOrder(
        orderId
      );

      setOrders((current) =>
        current.map((order) =>
          order._id === orderId
            ? {
                ...order,
                orderStatus: "cancelled",
              }
            : order
        )
      );

      toast.success(
        "Order cancelled successfully"
      );
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to cancel order"
      );
    } finally {
      setCancellingId(null);
    }
  };

  if (!isAuthenticated) {
    return (
      <main className="min-h-[70vh] bg-stone-50 px-5 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="font-serif text-4xl">
            Your Orders
          </h1>

          <p className="mt-4 text-stone-500">
            Please login to view your orders.
          </p>

          <Link
            to="/login"
            className="mt-8 inline-flex bg-stone-950 px-6 py-3 text-sm font-semibold text-white hover:bg-stone-800"
          >
            Login
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[70vh] bg-stone-50 px-5 py-12">
      <div className="mx-auto max-w-5xl">

        {/* Header */}

        <div>
          <p className="text-xs font-bold tracking-[0.25em] text-stone-500">
            VANTA ACCOUNT
          </p>

          <h1 className="mt-3 font-serif text-5xl">
            Your Orders
          </h1>

          <p className="mt-3 text-sm text-stone-500">
            View and track your Vanta purchases.
          </p>
        </div>

        {/* Loading */}

        {loading ? (
          <div className="mt-10 space-y-4">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-40 animate-pulse bg-stone-200"
              />
            ))}
          </div>
        ) : orders.length === 0 ? (
          /* Empty state */

          <div className="mt-10 border border-stone-200 bg-white px-6 py-16 text-center">
            <Package
              size={42}
              className="mx-auto text-stone-400"
            />

            <h2 className="mt-5 font-serif text-2xl">
              No orders yet
            </h2>

            <p className="mt-2 text-sm text-stone-500">
              Your purchases will appear here.
            </p>

            <Link
              to="/products"
              className="mt-7 inline-flex items-center gap-2 bg-stone-950 px-6 py-3 text-sm font-semibold text-white hover:bg-stone-800"
            >
              Start Shopping
              <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          /* Orders */

          <div className="mt-10 space-y-5">
            {orders.map((order) => (
              <div
                key={order._id}
                className="border border-stone-200 bg-white"
              >

                {/* Order header */}

                <div className="flex flex-col justify-between gap-4 border-b border-stone-200 px-6 py-5 sm:flex-row sm:items-center">
                  <div>
                    <p className="text-xs font-bold tracking-[0.15em] text-stone-400">
                      ORDER
                    </p>

                    <p className="mt-1 text-sm font-semibold">
                      #{order._id.slice(-8)}
                    </p>

                    <p className="mt-1 text-xs text-stone-500">
                      Placed on{" "}
                      {formatDate(
                        order.createdAt
                      )}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <span
                      className={`border px-3 py-1.5 text-[10px] font-bold uppercase ${
                        statusStyles[
                          order.orderStatus
                        ] || ""
                      }`}
                    >
                      {order.orderStatus}
                    </span>

                    <span
                      className={`border px-3 py-1.5 text-[10px] font-bold uppercase ${
                        paymentStyles[
                          order.paymentStatus
                        ] || ""
                      }`}
                    >
                      Payment:{" "}
                      {order.paymentStatus}
                    </span>
                  </div>
                </div>

                {/* Items */}

                <div className="divide-y divide-stone-100">
                  {order.items?.map(
                    (item, index) => (
                      <div
                        key={`${order._id}-${index}`}
                        className="flex gap-4 px-6 py-5"
                      >
                        <div className="h-20 w-20 shrink-0 overflow-hidden bg-stone-100">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center text-[9px] font-bold tracking-[0.15em] text-stone-400">
                              VANTA
                            </div>
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold">
                            {item.name}
                          </p>

                          <p className="mt-1 text-xs text-stone-500">
                            Quantity:{" "}
                            {item.quantity}
                          </p>

                          <p className="mt-2 text-sm">
                            {formatPrice(
                              item.price *
                                item.quantity
                            )}
                          </p>
                        </div>
                      </div>
                    )
                  )}
                </div>

                {/* Footer */}

                <div className="flex flex-col justify-between gap-5 border-t border-stone-200 px-6 py-5 sm:flex-row sm:items-center">
                  <div>
                    <p className="text-xs text-stone-500">
                      {order.items?.length || 0}{" "}
                      {order.items?.length === 1
                        ? "item"
                        : "items"}
                    </p>

                    <p className="mt-1 text-lg font-semibold">
                      Total:{" "}
                      {formatPrice(
                        order.total
                      )}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">

                    {/* Cancel */}

                    {canCancelOrder(
                      order.orderStatus
                    ) && (
                      <button
                        type="button"
                        onClick={() =>
                          handleCancelOrder(
                            order._id
                          )
                        }
                        disabled={
                          cancellingId ===
                          order._id
                        }
                        className="inline-flex items-center justify-center gap-2 border border-red-200 px-5 py-3 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <XCircle
                          size={16}
                        />

                        {cancellingId ===
                        order._id
                          ? "Cancelling..."
                          : "Cancel Order"}
                      </button>
                    )}

                    {/* Details */}

                    <Link
                      to={`/orders/${order._id}`}
                      className="inline-flex items-center justify-center gap-2 bg-stone-950 px-5 py-3 text-sm font-semibold text-white hover:bg-stone-800"
                    >
                      View Order
                      <ArrowRight size={16} />
                    </Link>

                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default Orders;