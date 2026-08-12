import { Link, useNavigate } from "react-router-dom";
import {
  User,
  Package,
  MapPin,
  LogOut,
  ChevronRight,
} from "lucide-react";
import useAuthStore from "../store/authStore";

const Account = () => {
  const navigate = useNavigate();

  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <main className="mx-auto max-w-5xl px-5 py-10 lg:px-8 lg:py-16">
      {/* Header */}
      <div className="border-b border-stone-200 pb-10">
        <p className="text-xs font-bold tracking-[0.25em] text-stone-500">
          VANTA BAGS
        </p>

        <h1 className="mt-3 font-serif text-5xl">
          My Account
        </h1>

        <p className="mt-4 text-stone-500">
          Manage your account, orders and saved addresses.
        </p>
      </div>

      {/* User information */}
      <section className="mt-10 border border-stone-200 p-6 md:p-8">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-stone-100">
            <User size={22} strokeWidth={1.7} />
          </div>

          <div>
            <h2 className="font-serif text-2xl">
              {user?.name || "Customer"}
            </h2>

            <p className="mt-1 text-sm text-stone-500">
              {user?.email}
            </p>
          </div>
        </div>
      </section>

      {/* Account options */}
      <section className="mt-8 divide-y divide-stone-200 border-y border-stone-200">
        <Link
          to="/account/orders"
          className="group flex items-center justify-between py-6"
        >
          <div className="flex items-center gap-4">
            <Package
              size={21}
              strokeWidth={1.7}
            />

            <div>
              <h2 className="text-sm font-semibold">
                My Orders
              </h2>

              <p className="mt-1 text-sm text-stone-500">
                View your orders and track their status.
              </p>
            </div>
          </div>

          <ChevronRight
            size={19}
            className="transition-transform group-hover:translate-x-1"
          />
        </Link>

        <Link
          to="/account/addresses"
          className="group flex items-center justify-between py-6"
        >
          <div className="flex items-center gap-4">
            <MapPin
              size={21}
              strokeWidth={1.7}
            />

            <div>
              <h2 className="text-sm font-semibold">
                My Addresses
              </h2>

              <p className="mt-1 text-sm text-stone-500">
                Manage your saved delivery addresses.
              </p>
            </div>
          </div>

          <ChevronRight
            size={19}
            className="transition-transform group-hover:translate-x-1"
          />
        </Link>

        <button
          type="button"
          onClick={handleLogout}
          className="group flex w-full items-center justify-between py-6 text-left"
        >
          <div className="flex items-center gap-4">
            <LogOut
              size={21}
              strokeWidth={1.7}
            />

            <div>
              <h2 className="text-sm font-semibold">
                Logout
              </h2>

              <p className="mt-1 text-sm text-stone-500">
                Sign out of your Vanta Bags account.
              </p>
            </div>
          </div>

          <ChevronRight
            size={19}
            className="transition-transform group-hover:translate-x-1"
          />
        </button>
      </section>
    </main>
  );
};

export default Account;