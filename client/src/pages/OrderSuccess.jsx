import { Link, useParams } from "react-router-dom";
import { CheckCircle, Package } from "lucide-react";

const OrderSuccess = () => {
  const { orderId } = useParams();

  return (
    <main className="min-h-[70vh] bg-stone-50 px-5 py-16">
      <div className="mx-auto max-w-2xl text-center">

        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-stone-900 text-white">
          <CheckCircle size={38} strokeWidth={1.6} />
        </div>

        <p className="mt-8 text-xs font-bold tracking-[0.3em] text-stone-500">
          ORDER CONFIRMED
        </p>

        <h1 className="mt-4 font-serif text-5xl leading-tight md:text-6xl">
          Thank you for your order.
        </h1>

        <p className="mx-auto mt-6 max-w-lg leading-7 text-stone-600">
          Your payment was successful and your Vanta order has been
          confirmed.
        </p>

        <div className="mx-auto mt-8 max-w-md border border-stone-200 bg-white p-6 text-left">
          <div className="flex items-center gap-3">
            <Package size={20} />

            <div>
              <p className="text-xs font-bold tracking-[0.2em] text-stone-500">
                ORDER ID
              </p>

              <p className="mt-1 break-all text-sm font-medium">
                {orderId}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            to={`/orders/${orderId}`}
            className="inline-flex h-12 items-center justify-center bg-stone-950 px-7 text-sm font-semibold text-white transition hover:bg-stone-800"
          >
            View Order
          </Link>

          <Link
            to="/products"
            className="inline-flex h-12 items-center justify-center border border-stone-300 px-7 text-sm font-semibold text-stone-900 transition hover:bg-white"
          >
            Continue Shopping
          </Link>
        </div>

      </div>
    </main>
  );
};

export default OrderSuccess;