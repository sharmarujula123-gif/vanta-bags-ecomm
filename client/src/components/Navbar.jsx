import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  Menu,
  Moon,
  ShoppingBag,
  Sun,
  User,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import useAuthStore from "../store/authStore";
import useCartStore from "../store/cartStore";

const getInitialTheme = () => {
  if (typeof window === "undefined") return "light";

  const saved = localStorage.getItem("vanta-theme");
  if (saved === "dark" || saved === "light") return saved;

  return window.matchMedia?.("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

const Navbar = () => {
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState(getInitialTheme);

  const cartCount = useCartStore((state) => state.cartCount);
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const logout = useAuthStore((state) => state.logout);
  const fetchCart = useCartStore((state) => state.fetchCart);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("vanta-theme", theme);
  }, [theme]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart().catch(() => {});
    }
  }, [isAuthenticated, fetchCart]);

  const toggleTheme = () => {
    setTheme((current) => (current === "dark" ? "light" : "dark"));
  };

  const handleLogout = async () => {
    await logout();
    setMobileMenuOpen(false);
    navigate("/login");
  };

  const closeMobileMenu = () => setMobileMenuOpen(false);

  const navLinkClass = ({ isActive }) =>
    `relative text-[11px] font-semibold uppercase tracking-[0.16em] transition ${
      isActive
        ? "text-stone-950 after:absolute after:-bottom-2 after:left-0 after:h-px after:w-full after:bg-stone-950"
        : "text-stone-500 hover:text-stone-950"
    }`;

  const iconButton =
    "flex h-10 w-10 items-center justify-center rounded-full border border-stone-300 text-stone-700 transition hover:border-stone-950 hover:text-stone-950";

  return (
    <header className="sticky top-0 z-50 border-b border-stone-200 bg-stone-100/95 backdrop-blur-xl">
      <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 lg:px-8">
        <Link
          to="/"
          onClick={closeMobileMenu}
          className="group flex items-center gap-3 text-stone-950"
        >
          <span className="flex h-9 w-9 items-center justify-center border border-stone-950 text-[10px] font-bold tracking-[0.12em] transition group-hover:rotate-45">
            V
          </span>
          <span className="text-[18px] font-bold tracking-[0.34em]">
            VANTA
          </span>
        </Link>

        <nav className="hidden items-center gap-9 md:flex">
          <NavLink to="/" className={navLinkClass}>Home</NavLink>
          <NavLink to="/products" className={navLinkClass}>Collection</NavLink>
          <a
            href="/#categories"
            className="text-[11px] font-semibold uppercase tracking-[0.16em] text-stone-500 transition hover:text-stone-950"
          >
            Categories
          </a>
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <button
            type="button"
            onClick={toggleTheme}
            className={iconButton}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          >
            {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
          </button>

          <Link
            to="/cart"
            className={`${iconButton} relative`}
            aria-label="Shopping cart"
          >
            <ShoppingBag size={18} strokeWidth={1.7} />
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-stone-950 px-1 text-[8px] font-bold text-white">
                {cartCount}
              </span>
            )}
          </Link>

          {isAuthenticated ? (
            <div className="ml-2 flex items-center gap-3 border-l border-stone-200 pl-4">
              <Link
                to="/account"
                className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-stone-600 transition hover:text-stone-950"
              >
                <User size={17} strokeWidth={1.7} />
                <span>{user?.name}</span>
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="text-[10px] font-semibold uppercase tracking-[0.14em] text-stone-500 transition hover:text-stone-950"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="ml-2 border border-stone-950 bg-stone-950 px-5 py-2.5 text-[10px] font-bold uppercase tracking-[0.16em] text-white transition hover:opacity-80"
            >
              Login
            </Link>
          )}
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <button
            type="button"
            onClick={toggleTheme}
            className={iconButton}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
          </button>

          <Link
            to="/cart"
            className={`${iconButton} relative`}
            aria-label="Shopping cart"
          >
            <ShoppingBag size={18} />
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-stone-950 px-1 text-[8px] font-bold text-white">
                {cartCount}
              </span>
            )}
          </Link>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((current) => !current)}
            className={iconButton}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={19} /> : <Menu size={19} />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="border-t border-stone-200 bg-stone-100 md:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col px-5 py-3">
            <NavLink to="/" onClick={closeMobileMenu} className="border-b border-stone-200 py-4 text-[11px] font-semibold uppercase tracking-[0.16em]">Home</NavLink>
            <NavLink to="/products" onClick={closeMobileMenu} className="border-b border-stone-200 py-4 text-[11px] font-semibold uppercase tracking-[0.16em]">Collection</NavLink>
            <a href="/#categories" onClick={closeMobileMenu} className="border-b border-stone-200 py-4 text-[11px] font-semibold uppercase tracking-[0.16em]">Categories</a>

            {isAuthenticated ? (
              <>
                <Link to="/account" onClick={closeMobileMenu} className="border-b border-stone-200 py-4 text-[11px] font-semibold uppercase tracking-[0.16em]">Account</Link>
                <button type="button" onClick={handleLogout} className="py-4 text-left text-[11px] font-semibold uppercase tracking-[0.16em]">Logout</button>
              </>
            ) : (
              <Link to="/login" onClick={closeMobileMenu} className="py-4 text-[11px] font-semibold uppercase tracking-[0.16em]">Login</Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
