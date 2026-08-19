import { NavLink, Outlet, Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Store,
  LogOut,
} from "lucide-react";
import toast from "react-hot-toast";

import useAuthStore from "../store/authStore";

const AdminLayout = () => {
  const navigate = useNavigate();

  const logout = useAuthStore(
    (state) => state.logout
  );

  const user = useAuthStore(
    (state) => state.user
  );

  const navItems = [
    {
      to: "/admin",
      label: "Dashboard",
      icon: LayoutDashboard,
      end: true,
    },
    {
      to: "/admin/orders",
      label: "Orders",
      icon: ShoppingBag,
    },
    {
      to: "/admin/products",
      label: "Products",
      icon: Package,
    },
  ];

  const handleLogout = async () => {
    try {
      await logout();

      toast.success("Logged out successfully");

      navigate("/login", {
        replace: true,
      });
    } catch {
      toast.error("Unable to logout");
    }
  };

  return (
    <div className="vanta-admin-shell min-h-screen bg-stone-50">

      {/* Admin header */}

      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-5 px-5 py-4">

          {/* Logo */}

          <Link
            to="/admin"
            className="shrink-0 font-serif text-2xl tracking-tight"
          >
            VANTA

            <span className="ml-2 font-sans text-xs font-bold tracking-[0.2em] text-stone-400">
              ADMIN
            </span>
          </Link>

          {/* Right side */}

          <div className="flex items-center gap-4">

            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold">
                {user?.name || "Admin"}
              </p>

              <p className="text-xs text-stone-500">
                {user?.email || ""}
              </p>
            </div>

            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm font-semibold text-stone-600 hover:text-stone-950"
            >
              <Store size={16} />

              <span className="hidden sm:inline">
                Store
              </span>
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-2 border border-stone-300 bg-white px-4 py-2.5 text-sm font-semibold text-stone-700 hover:bg-stone-100"
            >
              <LogOut size={16} />

              <span className="hidden sm:inline">
                Logout
              </span>
            </button>

          </div>
        </div>
      </header>

      {/* Navigation */}

      <nav className="border-b border-stone-200 bg-white">
        <div className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-5">

          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `inline-flex shrink-0 items-center gap-2 border-b-2 px-5 py-4 text-sm font-semibold transition ${
                    isActive
                      ? "border-stone-950 text-stone-950"
                      : "border-transparent text-stone-500 hover:text-stone-950"
                  }`
                }
              >
                <Icon size={16} />

                {item.label}
              </NavLink>
            );
          })}

        </div>
      </nav>

      {/* Admin page */}

      <Outlet />

    </div>
  );
};

export default AdminLayout;