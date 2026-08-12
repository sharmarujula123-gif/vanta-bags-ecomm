import { Link, Navigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import useCheckout from "../hooks/useCheckout";

import ContactSection from "../components/checkout/ContactSection";
import AddressSection from "../components/checkout/AddressSection";
import AddressForm from "../components/checkout/AddressForm";
import PaymentSection from "../components/checkout/PaymentSection";
import OrderSummary from "../components/checkout/OrderSummary";

import useAuthStore from "../store/authStore";

const Checkout = () => {
  const isAuthenticated = useAuthStore(
    (state) => state.isAuthenticated
  );

  const {
    user,
    cart,
    addresses,

    selectedAddressId,

    loading,
    savingAddress,
    placingOrder,

    showAddressForm,

    subtotal,
    shipping,
    total,

    selectAddress,
    openAddressForm,
    closeAddressForm,

    createAddress,
    deleteAddress,

    placeOrder,
  } = useCheckout();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-stone-50">
        <div className="mx-auto max-w-7xl px-5 py-16">
          <div className="h-5 w-32 animate-pulse bg-stone-200" />

          <div className="mt-8 grid gap-12 lg:grid-cols-[1fr_380px]">
            <div className="space-y-6">
              <div className="h-40 animate-pulse bg-stone-200" />
              <div className="h-64 animate-pulse bg-stone-200" />
              <div className="h-32 animate-pulse bg-stone-200" />
            </div>

            <div className="h-96 animate-pulse bg-stone-200" />
          </div>
        </div>
      </main>
    );
  }

  if (!cart?.items?.length) {
    return (
      <main className="min-h-screen bg-stone-50">
        <div className="mx-auto max-w-3xl px-5 py-24 text-center">
          <p className="text-xs font-bold tracking-[0.25em] text-stone-500">
            CHECKOUT
          </p>

          <h1 className="mt-5 font-serif text-5xl">
            Your cart is empty
          </h1>

          <p className="mx-auto mt-5 max-w-md text-stone-500">
            Add something from the Vanta collection
            before checking out.
          </p>

          <Link
            to="/products"
            className="mt-8 inline-flex items-center gap-2 bg-stone-950 px-6 py-3 text-sm font-semibold text-white"
          >
            <ArrowLeft size={16} />
            Continue Shopping
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-stone-50">
      <div className="mx-auto max-w-7xl px-5 py-10 md:px-8 md:py-16">
        {/* Header */}

        <div className="mb-10">
          <Link
            to="/cart"
            className="inline-flex items-center gap-2 text-sm text-stone-500 transition hover:text-stone-950"
          >
            <ArrowLeft size={16} />
            Back to Cart
          </Link>

          <p className="mt-8 text-xs font-bold tracking-[0.25em] text-stone-500">
            VANTA BAGS
          </p>

          <h1 className="mt-3 font-serif text-5xl md:text-6xl">
            Checkout
          </h1>
        </div>

        <div className="grid gap-12 lg:grid-cols-[1fr_380px] lg:items-start lg:gap-20">
          {/* Left */}

          <div>
            <ContactSection user={user} />

            <AddressSection
              addresses={addresses}
              selectedAddressId={selectedAddressId}
              onSelect={selectAddress}
              onDelete={deleteAddress}
              onAdd={openAddressForm}
            />

            {showAddressForm && (
              <AddressForm
                onSubmit={createAddress}
                onCancel={closeAddressForm}
                saving={savingAddress}
              />
            )}

            <PaymentSection />
          </div>

          {/* Right */}

          <OrderSummary
            cart={cart}
            subtotal={subtotal}
            shipping={shipping}
            total={total}
            onPlaceOrder={placeOrder}
            placingOrder={placingOrder}
            disabled={!selectedAddressId}
          />
        </div>
      </div>
    </main>
  );
};

export default Checkout;