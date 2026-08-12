import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Check,
  Package,
  User,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import orderService from "../../services/orderService";

const allowedTransitions = {
    pending: ["confirmed", "cancelled"],
    confirmed: ["processing", "cancelled"],
    processing: ["shipped", "cancelled"],
    shipped: ["delivered"],
    delivered: [],
    cancelled: [],
  };

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
    month: "long",
    year: "numeric",
  });

const AdminOrderDetails = () => {
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [selectedStatus, setSelectedStatus] =
    useState("");

  const loadOrder = async () => {
    try {
      setLoading(true);

      const data =
        await orderService.getAdminOrderById(id);

      const loadedOrder = data.data?.order;

      setOrder(loadedOrder);
      setSelectedStatus(
        loadedOrder?.orderStatus || ""
      );
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to load order"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrder();
  }, [id]);

  const updateStatus = async () => {
    if (!order || !selectedStatus) return;

    if (selectedStatus === order.orderStatus) {
      toast.error("Choose a different status");
      return;
    }

    try {
      setUpdating(true);

      const data =
        await orderService.updateOrderStatus(
          order._id,
          selectedStatus
        );

      const updatedOrder =
        data.data?.order;

      if (updatedOrder) {
        setOrder(updatedOrder);
        setSelectedStatus(
          updatedOrder.orderStatus
        );
      }

      toast.success(
        "Order status updated"
      );
    } catch (error) {
      setSelectedStatus(
        order.orderStatus
      );

      toast.error(
        error.response?.data?.message ||
          "Unable to update order status"
      );
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-[70vh] bg-stone-50 px-5 py-12">
        <div className="mx-auto max-w-6xl space-y-5">
          <div className="h-6 w-32 animate-pulse bg-stone-200" />
          <div className="h-20 animate-pulse bg-stone-200" />
          <div className="h-64 animate-pulse bg-stone-200" />
        </div>
      </main>
    );
  }

  if (!order) {
    return (
      <main className="min-h-[70vh] bg-stone-50 px-5 py-16">
        <div className="mx-auto max-w-6xl text-center">
          <h1 className="font-serif text-4xl">
            Order not found
          </h1>

          <Link
            to="/admin/orders"
            className="mt-8 inline-flex items-center gap-2 bg-stone-950 px-6 py-3 text-sm font-semibold text-white"
          >
            <ArrowLeft size={16} />
            Back to Orders
          </Link>
        </div>
      </main>
    );
  }

  const canChangeStatus =
    order.orderStatus !== "delivered" &&
    order.orderStatus !== "cancelled";

    const availableStatuses =
  allowedTransitions[order.orderStatus] || [];
  return (
    <main className="min-h-[70vh] bg-stone-50 px-5 py-12">
      <div className="mx-auto max-w-6xl">

        {/* Back */}

        <Link
          to="/admin/orders"
          className="inline-flex items-center gap-2 text-sm font-semibold text-stone-600 hover:text-stone-950"
        >
          <ArrowLeft size={16} />
          Back to Orders
        </Link>

        {/* Header */}

        <div className="mt-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-bold tracking-[0.25em] text-stone-500">
              VANTA ADMIN
            </p>

            <h1 className="mt-3 font-serif text-4xl md:text-5xl">
              Order #{order._id.slice(-8)}
            </h1>

            <p className="mt-3 text-sm text-stone-500">
              Placed on {formatDate(order.createdAt)}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <span
              className={`border px-3 py-2 text-[10px] font-bold uppercase ${
                statusStyles[order.orderStatus] || ""
              }`}
            >
              {order.orderStatus}
            </span>

            <span
              className={`border px-3 py-2 text-[10px] font-bold uppercase ${
                paymentStyles[
                  order.paymentStatus
                ] || ""
              }`}
            >
              Payment: {order.paymentStatus}
            </span>
          </div>
        </div>

        {/* Status update */}

        <section className="mt-8 border border-stone-200 bg-white p-6">
          <div className="flex items-center gap-3">
            <Package
              size={20}
              className="text-stone-500"
            />

            <div>
              <p className="text-xs font-bold tracking-[0.2em] text-stone-500">
                FULFILLMENT
              </p>

              <h2 className="mt-1 font-serif text-2xl">
                Update Order Status
              </h2>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <select
  value={selectedStatus}
  onChange={(event) =>
    setSelectedStatus(event.target.value)
  }
  disabled={!canChangeStatus || updating}
  className="h-12 flex-1 border border-stone-300 bg-white px-4 text-sm outline-none focus:border-stone-950 disabled:bg-stone-100"
>
  <option value={order.orderStatus}>
    Current:{" "}
    {order.orderStatus.charAt(0).toUpperCase() +
      order.orderStatus.slice(1)}
  </option>

  {availableStatuses.map((status) => (
    <option
      key={status}
      value={status}
    >
      Change to:{" "}
      {status.charAt(0).toUpperCase() +
        status.slice(1)}
    </option>
  ))}
</select>
            <button
              type="button"
              onClick={updateStatus}
              disabled={
                updating ||
                !canChangeStatus ||
                selectedStatus ===
                  order.orderStatus
              }
              className="inline-flex h-12 items-center justify-center gap-2 bg-stone-950 px-6 text-sm font-semibold text-white hover:bg-stone-800 disabled:cursor-not-allowed disabled:bg-stone-300"
            >
              <Check size={16} />

              {updating
                ? "Updating..."
                : "Update Status"}
            </button>
          </div>

          {!canChangeStatus && (
            <p className="mt-3 text-xs text-stone-500">
              This order is {order.orderStatus} and
              cannot be moved to another status.
            </p>
          )}
        </section>

        {/* Main grid */}

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">

          {/* Items */}

          <section className="border border-stone-200 bg-white">
            <div className="border-b border-stone-200 px-6 py-5">
              <h2 className="font-serif text-2xl">
                Order Items
              </h2>
            </div>

            <div className="divide-y divide-stone-100">
              {order.items?.map(
                (item, index) => (
                  <div
                    key={`${item.product?._id || item.product}-${index}`}
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
                        Quantity: {item.quantity}
                      </p>

                      <p className="mt-2 text-sm">
                        {formatCurrency(item.price)}
                        {" × "}
                        {item.quantity}
                      </p>
                    </div>

                    <p className="text-sm font-semibold">
                      {formatCurrency(
                        item.price *
                          item.quantity
                      )}
                    </p>
                  </div>
                )
              )}
            </div>

            {/* Totals */}

            <div className="border-t border-stone-200 px-6 py-6">
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-stone-500">
                    Subtotal
                  </span>

                  <span>
                    {formatCurrency(
                      order.subtotal
                    )}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-stone-500">
                    Shipping
                  </span>

                  <span>
                    {order.shippingFee === 0
                      ? "FREE"
                      : formatCurrency(
                          order.shippingFee
                        )}
                  </span>
                </div>

                <div className="flex justify-between border-t border-stone-200 pt-4 text-base font-semibold">
                  <span>Total</span>

                  <span>
                    {formatCurrency(order.total)}
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Customer / Shipping */}

          <div className="space-y-8">

            {/* Customer */}

            <section className="border border-stone-200 bg-white p-6">
              <div className="flex items-center gap-3">
                <User
                  size={19}
                  className="text-stone-500"
                />

                <h2 className="font-serif text-2xl">
                  Customer
                </h2>
              </div>

              <div className="mt-6 space-y-3 text-sm">
                <div>
                  <p className="text-xs text-stone-400">
                    NAME
                  </p>

                  <p className="mt-1 font-medium">
                    {order.user?.name ||
                      order.shippingAddress?.name}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-stone-400">
                    EMAIL
                  </p>

                  <p className="mt-1 break-all">
                    {order.user?.email ||
                      "Not available"}
                  </p>
                </div>
              </div>
            </section>

            {/* Shipping */}

            <section className="border border-stone-200 bg-white p-6">
              <h2 className="font-serif text-2xl">
                Shipping Address
              </h2>

              <div className="mt-6 space-y-1 text-sm leading-6 text-stone-600">
                <p className="font-semibold text-stone-950">
                  {order.shippingAddress?.name}
                </p>

                <p>
                  {order.shippingAddress?.phone}
                </p>

                <p className="pt-2">
                  {order.shippingAddress?.addressLine1}
                </p>

                {order.shippingAddress
                  ?.addressLine2 && (
                  <p>
                    {
                      order.shippingAddress
                        .addressLine2
                    }
                  </p>
                )}

                <p>
                  {order.shippingAddress?.city},{" "}
                  {order.shippingAddress?.state}
                </p>

                <p>
                  {order.shippingAddress?.postalCode}
                </p>

                <p>
                  {order.shippingAddress?.country}
                </p>
              </div>
            </section>

          </div>
        </div>
      </div>
    </main>
  );
};

export default AdminOrderDetails;