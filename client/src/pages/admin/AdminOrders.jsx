import { useEffect, useState } from "react";
import { ArrowRight, RefreshCw, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import orderService from "../../services/orderService";

const statusStyles = {
  pending: "border-amber-200 bg-amber-50 text-amber-700",
  confirmed: "border-blue-200 bg-blue-50 text-blue-700",
  processing: "border-purple-200 bg-purple-50 text-purple-700",
  shipped: "border-indigo-200 bg-indigo-50 text-indigo-700",
  delivered: "border-emerald-200 bg-emerald-50 text-emerald-700",
  cancelled: "border-red-200 bg-red-50 text-red-700",
};

const paymentStyles = {
  pending: "border-amber-200 bg-amber-50 text-amber-700",
  paid: "border-emerald-200 bg-emerald-50 text-emerald-700",
  failed: "border-red-200 bg-red-50 text-red-700",
  refunded: "border-purple-200 bg-purple-50 text-purple-700",
};

const formatCurrency = (value) =>
  `₹${Number(value || 0).toLocaleString("en-IN")}`;

const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = async () => {
    try {
      setLoading(true);

      const data = await orderService.getAllOrders();

      setOrders(data.data?.orders || []);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to load orders"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  return (
    <main className="min-h-[70vh] bg-stone-50 px-5 py-12">
      <div className="mx-auto max-w-7xl">

        {/* Header */}

        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-bold tracking-[0.25em] text-stone-500">
              VANTA ADMIN
            </p>

            <h1 className="mt-3 font-serif text-5xl">
              Orders
            </h1>

            <p className="mt-3 text-sm text-stone-500">
              Manage customer orders and fulfillment.
            </p>
          </div>

          <div className="flex gap-3">
            <Link
              to="/admin"
              className="border border-stone-300 bg-white px-5 py-3 text-sm font-semibold hover:bg-stone-100"
            >
              Dashboard
            </Link>

            <button
              type="button"
              onClick={loadOrders}
              disabled={loading}
              className="inline-flex items-center gap-2 bg-stone-950 px-5 py-3 text-sm font-semibold text-white hover:bg-stone-800 disabled:opacity-50"
            >
              <RefreshCw
                size={16}
                className={loading ? "animate-spin" : ""}
              />
              Refresh
            </button>
          </div>
        </div>

        {/* Content */}

        {loading ? (
          <div className="mt-10 space-y-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-32 animate-pulse bg-stone-200"
              />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="mt-10 border border-stone-200 bg-white px-6 py-16 text-center">
            <ShoppingBag
              size={42}
              className="mx-auto text-stone-400"
            />

            <h2 className="mt-5 font-serif text-2xl">
              No orders yet
            </h2>

            <p className="mt-2 text-sm text-stone-500">
              Customer orders will appear here.
            </p>
          </div>
        ) : (
          <div className="mt-10 overflow-hidden border border-stone-200 bg-white">

            {/* Desktop heading */}

            <div className="hidden grid-cols-[1.2fr_1.3fr_1fr_1fr_0.8fr] border-b border-stone-200 px-6 py-4 text-[10px] font-bold tracking-[0.15em] text-stone-400 lg:grid">
              <span>ORDER</span>
              <span>CUSTOMER</span>
              <span>STATUS</span>
              <span>PAYMENT</span>
              <span>TOTAL</span>
            </div>

            {orders.map((order) => (
              <Link
                key={order._id}
                to={`/admin/orders/${order._id}`}
                className="block border-b border-stone-100 px-6 py-6 last:border-b-0 hover:bg-stone-50"
              >
                <div className="grid gap-5 lg:grid-cols-[1.2fr_1.3fr_1fr_1fr_0.8fr] lg:items-center">

                  {/* Order */}

                  <div>
                    <p className="text-xs font-bold tracking-[0.15em] text-stone-400">
                      ORDER
                    </p>

                    <p className="mt-1 text-sm font-semibold">
                      #{order._id.slice(-8)}
                    </p>

                    <p className="mt-1 text-xs text-stone-500">
                      {formatDate(order.createdAt)}
                    </p>
                  </div>

                  {/* Customer */}

                  <div>
                    <p className="text-xs font-bold tracking-[0.15em] text-stone-400 lg:hidden">
                      CUSTOMER
                    </p>

                    <p className="mt-1 text-sm font-medium">
                      {order.user?.name ||
                        "Unknown customer"}
                    </p>

                    <p className="mt-1 break-all text-xs text-stone-500">
                      {order.user?.email || "No email"}
                    </p>
                  </div>

                  {/* Order Status */}

                  <div>
                    <p className="text-xs font-bold tracking-[0.15em] text-stone-400 lg:hidden">
                      ORDER STATUS
                    </p>

                    <span
                      className={`mt-2 inline-flex border px-3 py-1.5 text-[10px] font-bold uppercase ${
                        statusStyles[
                          order.orderStatus
                        ] || ""
                      }`}
                    >
                      {order.orderStatus}
                    </span>
                  </div>

                  {/* Payment */}

                  <div>
                    <p className="text-xs font-bold tracking-[0.15em] text-stone-400 lg:hidden">
                      PAYMENT
                    </p>

                    <span
                      className={`mt-2 inline-flex border px-3 py-1.5 text-[10px] font-bold uppercase ${
                        paymentStyles[
                          order.paymentStatus
                        ] || ""
                      }`}
                    >
                      {order.paymentStatus}
                    </span>
                  </div>

                  {/* Total */}

                  <div className="flex items-center justify-between lg:block">
                    <div>
                      <p className="text-xs font-bold tracking-[0.15em] text-stone-400 lg:hidden">
                        TOTAL
                      </p>

                      <p className="mt-1 text-sm font-semibold">
                        {formatCurrency(order.total)}
                      </p>
                    </div>

                    <ArrowRight
                      size={17}
                      className="text-stone-400 lg:hidden"
                    />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default AdminOrders;