import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Box,
  IndianRupee,
  Package,
  ShoppingBag,
  AlertTriangle,
} from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import orderService from "../../services/orderService";
import productService from "../../services/productService";
import useAuthStore from "../../store/authStore";
import AdminHeader from "../../components/admin/AdminHeader";
import { formatCurrency, formatDate } from "../../utils/admin";

const AdminDashboard = () => {
  const isAuthenticated = useAuthStore(
    (state) => state.isAuthenticated
  );

  const user = useAuthStore((state) => state.user);

  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      if (!isAuthenticated) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const [ordersData, productsData] =
          await Promise.all([
            orderService.getAllOrders(),
            productService.getProducts({
              page: 1,
              limit: 100,
            }),
          ]);

        setOrders(
          ordersData.data?.orders || []
        );

        setProducts(
          productsData.data?.products || []
        );
      } catch (error) {
        toast.error(
          error.response?.data?.message ||
            "Unable to load admin dashboard"
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [isAuthenticated]);

  const stats = useMemo(() => {
    const paidOrders = orders.filter(
      (order) =>
        order.paymentStatus === "paid"
    );

    const pendingOrders = orders.filter(
      (order) =>
        order.orderStatus === "pending"
    );

    const revenue = paidOrders.reduce(
      (total, order) =>
        total + Number(order.total || 0),
      0
    );

    const lowStockProducts =
      products.filter(
        (product) =>
          product.stock <= 5
      );

    return {
      totalOrders: orders.length,
      paidOrders: paidOrders.length,
      pendingOrders: pendingOrders.length,
      revenue,
      totalProducts: products.length,
      lowStockProducts:
        lowStockProducts.length,
    };
  }, [orders, products]);

  const recentOrders = orders.slice(0, 5);

  if (!isAuthenticated) {
    return (
      <main className="min-h-[70vh] bg-stone-50 px-5 py-16">
        <div className="mx-auto max-w-5xl text-center">
          <h1 className="font-serif text-4xl">
            Admin Dashboard
          </h1>

          <p className="mt-4 text-stone-500">
            Please login to access the admin area.
          </p>

          <Link
            to="/login"
            className="mt-8 inline-flex bg-stone-950 px-6 py-3 text-sm font-semibold text-white"
          >
            Login
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[70vh] bg-stone-50 px-5 py-12">
      <div className="mx-auto max-w-7xl">

        <AdminHeader
          title="Dashboard"
          description={`Welcome back, ${user?.name || "Admin"}.`}
        >
          <Link
            to="/admin/orders"
            className="inline-flex items-center gap-2 border border-stone-300 bg-white px-5 py-3 text-sm font-semibold hover:bg-stone-100"
          >
            Orders
            <ArrowRight size={16} />
          </Link>
          <Link
            to="/admin/products"
            className="inline-flex items-center gap-2 bg-stone-950 px-5 py-3 text-sm font-semibold text-white hover:bg-stone-800"
          >
            Products
            <ArrowRight size={16} />
          </Link>
        </AdminHeader>

        {/* Loading */}

        {loading ? (
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-32 animate-pulse bg-stone-200"
              />
            ))}
          </div>
        ) : (
          <>
            {/* Stats */}

            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

              <div className="border border-stone-200 bg-white p-6">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold tracking-[0.15em] text-stone-500">
                    REVENUE
                  </p>

                  <IndianRupee
                    size={20}
                    className="text-stone-400"
                  />
                </div>

                <p className="mt-5 text-3xl font-semibold">
                  {formatCurrency(stats.revenue)}
                </p>

                <p className="mt-2 text-xs text-stone-500">
                  From paid orders
                </p>
              </div>

              <div className="border border-stone-200 bg-white p-6">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold tracking-[0.15em] text-stone-500">
                    ORDERS
                  </p>

                  <ShoppingBag
                    size={20}
                    className="text-stone-400"
                  />
                </div>

                <p className="mt-5 text-3xl font-semibold">
                  {stats.totalOrders}
                </p>

                <p className="mt-2 text-xs text-stone-500">
                  {stats.paidOrders} paid
                </p>
              </div>

              <div className="border border-stone-200 bg-white p-6">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold tracking-[0.15em] text-stone-500">
                    PRODUCTS
                  </p>

                  <Box
                    size={20}
                    className="text-stone-400"
                  />
                </div>

                <p className="mt-5 text-3xl font-semibold">
                  {stats.totalProducts}
                </p>

                <p className="mt-2 text-xs text-stone-500">
                  Active products
                </p>
              </div>

              <div className="border border-stone-200 bg-white p-6">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold tracking-[0.15em] text-stone-500">
                    ATTENTION
                  </p>

                  <AlertTriangle
                    size={20}
                    className="text-stone-400"
                  />
                </div>

                <p className="mt-5 text-3xl font-semibold">
                  {stats.pendingOrders +
                    stats.lowStockProducts}
                </p>

                <p className="mt-2 text-xs text-stone-500">
                  {stats.pendingOrders} pending orders ·{" "}
                  {stats.lowStockProducts} low stock
                </p>
              </div>
            </div>

            {/* Secondary stats */}

            <div className="mt-4 grid gap-4 sm:grid-cols-2">

              <div className="border border-stone-200 bg-white p-6">
                <div className="flex items-center gap-3">
                  <Package
                    size={20}
                    className="text-stone-400"
                  />

                  <div>
                    <p className="text-xs font-bold tracking-[0.15em] text-stone-500">
                      PENDING ORDERS
                    </p>

                    <p className="mt-1 text-2xl font-semibold">
                      {stats.pendingOrders}
                    </p>
                  </div>
                </div>
              </div>

              <div className="border border-stone-200 bg-white p-6">
                <div className="flex items-center gap-3">
                  <AlertTriangle
                    size={20}
                    className="text-stone-400"
                  />

                  <div>
                    <p className="text-xs font-bold tracking-[0.15em] text-stone-500">
                      LOW STOCK
                    </p>

                    <p className="mt-1 text-2xl font-semibold">
                      {stats.lowStockProducts}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent orders */}

            <section className="mt-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold tracking-[0.2em] text-stone-500">
                    ACTIVITY
                  </p>

                  <h2 className="mt-2 font-serif text-3xl">
                    Recent Orders
                  </h2>
                </div>

                <Link
                  to="/admin/orders"
                  className="hidden items-center gap-2 text-sm font-semibold sm:flex"
                >
                  View all
                  <ArrowRight size={15} />
                </Link>
              </div>

              {recentOrders.length === 0 ? (
                <div className="mt-6 border border-stone-200 bg-white px-6 py-12 text-center">
                  <ShoppingBag
                    size={35}
                    className="mx-auto text-stone-400"
                  />

                  <p className="mt-4 text-sm text-stone-500">
                    No orders yet.
                  </p>
                </div>
              ) : (
                <div className="mt-6 overflow-hidden border border-stone-200 bg-white">
                  <div className="hidden grid-cols-[1.3fr_1fr_1fr_1fr] border-b border-stone-200 px-6 py-4 text-[10px] font-bold tracking-[0.15em] text-stone-400 md:grid">
                    <span>ORDER</span>
                    <span>CUSTOMER</span>
                    <span>STATUS</span>
                    <span>TOTAL</span>
                  </div>

                  {recentOrders.map((order) => (
                    <Link
                      key={order._id}
                      to={`/admin/orders/${order._id}`}
                      className="grid gap-3 border-b border-stone-100 px-6 py-5 transition last:border-b-0 hover:bg-stone-50 md:grid-cols-[1.3fr_1fr_1fr_1fr] md:items-center"
                    >
                      <div>
                        <p className="text-sm font-semibold">
                          #{order._id.slice(-8)}
                        </p>

                        <p className="mt-1 text-xs text-stone-500">
                          {formatDate(order.createdAt)}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm">
                          {order.user?.name ||
                            "Unknown customer"}
                        </p>

                        <p className="mt-1 text-xs text-stone-500">
                          {order.user?.email || ""}
                        </p>
                      </div>

                      <div>
                        <span className="inline-flex border border-stone-200 bg-stone-50 px-3 py-1.5 text-[10px] font-bold uppercase">
                          {order.orderStatus}
                        </span>
                      </div>

                      <div className="flex items-center justify-between md:justify-start md:gap-3">
                        <p className="text-sm font-semibold">
                          {formatCurrency(order.total)}
                        </p>

                        <ArrowRight
                          size={15}
                          className="text-stone-400"
                        />
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              <Link
                to="/admin/orders"
                className="mt-5 flex items-center justify-center gap-2 border border-stone-300 bg-white px-5 py-3 text-sm font-semibold sm:hidden"
              >
                View all orders
                <ArrowRight size={15} />
              </Link>
            </section>

            {/* Quick actions */}

            <section className="mt-10 grid gap-4 md:grid-cols-2">

              <Link
                to="/admin/orders"
                className="group border border-stone-200 bg-white p-7 transition hover:border-stone-400"
              >
                <div className="flex items-center justify-between">
                  <ShoppingBag
                    size={22}
                    className="text-stone-500"
                  />

                  <ArrowRight
                    size={18}
                    className="transition group-hover:translate-x-1"
                  />
                </div>

                <h3 className="mt-8 font-serif text-2xl">
                  Manage Orders
                </h3>

                <p className="mt-2 text-sm text-stone-500">
                  Review customer orders and update
                  fulfillment status.
                </p>
              </Link>

              <Link
                to="/admin/products"
                className="group border border-stone-200 bg-white p-7 transition hover:border-stone-400"
              >
                <div className="flex items-center justify-between">
                  <Box
                    size={22}
                    className="text-stone-500"
                  />

                  <ArrowRight
                    size={18}
                    className="transition group-hover:translate-x-1"
                  />
                </div>

                <h3 className="mt-8 font-serif text-2xl">
                  Manage Products
                </h3>

                <p className="mt-2 text-sm text-stone-500">
                  Add products, update inventory and
                  manage your collection.
                </p>
              </Link>

            </section>
          </>
        )}
      </div>
    </main>
  );
};

export default AdminDashboard;