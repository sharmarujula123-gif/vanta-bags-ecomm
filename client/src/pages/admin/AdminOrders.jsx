import { useEffect, useState } from "react";
import { ArrowRight, RefreshCw, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import orderService from "../../services/orderService";

import AdminHeader from "../../components/admin/AdminHeader";
import { formatCurrency, formatDate } from "../../utils/admin";
import { ORDER_STATUS_STYLES, PAYMENT_STATUS_STYLES } from "../../utils/orderStatus";

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

        <AdminHeader
          title="Orders"
          description="Manage customer orders and fulfillment."
        >
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
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </AdminHeader>

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
                        ORDER_STATUS_STYLES[
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
                        PAYMENT_STATUS_STYLES[
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