import { CreditCard, ShieldCheck } from "lucide-react";

const PaymentSection = () => {
  return (
    <section className="border-b border-stone-200 py-8">
      <div>
        <p className="text-xs font-bold tracking-[0.2em] text-stone-500">
          PAYMENT
        </p>

        <h2 className="mt-2 font-serif text-2xl">
          Payment method
        </h2>
      </div>

      <div className="mt-6 border border-stone-950 p-5">
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center bg-stone-100">
            <CreditCard size={20} />
          </div>

          <div>
            <p className="text-sm font-semibold">
              Razorpay
            </p>

            <p className="mt-1 text-xs text-stone-500">
              UPI, cards, net banking and more
            </p>
          </div>
        </div>

        <div className="mt-5 flex items-center gap-2 border-t border-stone-200 pt-4 text-xs text-stone-500">
          <ShieldCheck size={15} />

          Secure payment powered by Razorpay
        </div>
      </div>
    </section>
  );
};

export default PaymentSection;