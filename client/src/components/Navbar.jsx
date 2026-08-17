import { tw } from "../utils/twStyles.js";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  Menu,
  Moon,
  ShoppingBag,
  Heart,
  Sun,
  UserRound,
  Search,
  X,
  ChevronDown,
  Package,
  MapPin,
  LogOut,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import useAuthStore from "../store/authStore";
import useCartStore from "../store/cartStore";
import useWishlistStore from "../store/wishlistStore";
import { useAuthModal } from "../context/AuthModalContext";

const getInitialTheme = () => {
  if (typeof window === "undefined") return "light";
  const saved = localStorage.getItem("vanta-theme");
  if (saved === "dark" || saved === "light") return saved;
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState(getInitialTheme);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  const cartCount = useCartStore((state) => state.cartCount);
  const wishlistCount = useWishlistStore((state) => state.items.length);
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const logout = useAuthStore((state) => state.logout);
  const fetchCart = useCartStore((state) => state.fetchCart);
  const { openAuth } = useAuthModal();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("vanta-theme", theme);
  }, [theme]);

  useEffect(() => {
    if (isAuthenticated) fetchCart().catch(() => {});
  }, [isAuthenticated, fetchCart]);

  const handleLogout = async () => {
    setProfileOpen(false);
    await logout();
    setMobileMenuOpen(false);
    navigate("/");
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") setProfileOpen(false);
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const isHome = location.pathname === "/";
  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <header className={tw(`vanta-header vanta-reference-header ${isHome ? "vanta-header-home" : ""}`)}>
      <div className={tw("vanta-promo")}>Free shipping on orders above ₹999</div>

      <div className={tw("vanta-reference-navbar")}>
        <div className={tw("vanta-reference-navbar-inner")}>
          <Link to="/" className={tw("vanta-reference-logo")} onClick={closeMobileMenu}>
            VANTA
          </Link>

          <nav className={tw("vanta-reference-main-nav")}>
            <NavLink to="/">Home</NavLink>
            <NavLink to="/products">Collection</NavLink>
            <Link to="/about">About</Link>
            <Link to="/category">Category</Link>
          </nav>

          <div className={tw("vanta-reference-actions")}>
            <button
              type="button"
              className={tw("vanta-theme-toggle")}
              onClick={() => setTheme((current) => (current === "dark" ? "light" : "dark"))}
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
              title={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
            >
              {theme === "dark" ? <Sun size={18} strokeWidth={1.7} /> : <Moon size={18} strokeWidth={1.7} />}
            </button>

            <button type="button" onClick={() => {}} aria-label="Search">
              <Search size={22} strokeWidth={1.5} />
            </button>

            {isAuthenticated ? (
              <div ref={profileRef} className={tw("relative")}> 
                <button
                  type="button"
                  onClick={() => setProfileOpen((current) => !current)}
                  aria-label="Open profile menu"
                  aria-expanded={profileOpen}
                  aria-haspopup="menu"
                  className={tw(
                    "inline-flex h-10 items-center gap-1.5 rounded-full px-2 text-[var(--vanta-text)] transition hover:bg-[var(--vanta-border)]/40"
                  )}
                >
                  <span className={tw("flex h-8 w-8 items-center justify-center rounded-full border border-[var(--vanta-border)]")}> 
                    <UserRound size={17} strokeWidth={1.6} />
                  </span>
                  <ChevronDown
                    size={14}
                    strokeWidth={1.7}
                    className={tw(`transition-transform ${profileOpen ? "rotate-180" : ""}`)}
                  />
                </button>

                {profileOpen && (
                  <div
                    role="menu"
                    className={tw(
                      "absolute right-0 top-[calc(100%+12px)] z-50 w-64 overflow-hidden rounded-2xl border border-[var(--vanta-border)] bg-[var(--vanta-bg)] p-2 shadow-[0_18px_50px_rgba(0,0,0,0.12)]"
                    )}
                  >
                    <div className={tw("border-b border-[var(--vanta-border)] px-4 py-3")}> 
                      <p className={tw("text-xs uppercase tracking-[0.14em] text-[var(--vanta-muted)]")}>My Account</p>
                      <p className={tw("mt-1 truncate text-sm font-semibold text-[var(--vanta-text)]")}>{user?.name || "Customer"}</p>
                      {user?.email && (
                        <p className={tw("mt-0.5 truncate text-xs text-[var(--vanta-muted)]")}>{user.email}</p>
                      )}
                    </div>

                    <div className={tw("pt-1")}> 
                      <Link
                        to="/account"
                        role="menuitem"
                        onClick={() => setProfileOpen(false)}
                        className={tw("flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-[var(--vanta-text)] transition hover:bg-[var(--vanta-border)]/40")}
                      >
                        <UserRound size={17} strokeWidth={1.6} />
                        <span>Profile</span>
                      </Link>

                      <Link
                        to="/account/orders"
                        role="menuitem"
                        onClick={() => setProfileOpen(false)}
                        className={tw("flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-[var(--vanta-text)] transition hover:bg-[var(--vanta-border)]/40")}
                      >
                        <Package size={17} strokeWidth={1.6} />
                        <span>Orders</span>
                      </Link>

                      <Link
                        to="/account/addresses"
                        role="menuitem"
                        onClick={() => setProfileOpen(false)}
                        className={tw("flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-[var(--vanta-text)] transition hover:bg-[var(--vanta-border)]/40")}
                      >
                        <MapPin size={17} strokeWidth={1.6} />
                        <span>Addresses</span>
                      </Link>

                      <div className={tw("my-1 border-t border-[var(--vanta-border)]")} />

                      <button
                        type="button"
                        role="menuitem"
                        onClick={handleLogout}
                        className={tw("flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-red-600 transition hover:bg-red-50 dark:hover:bg-red-950/20")}
                      >
                        <LogOut size={17} strokeWidth={1.6} />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button type="button" onClick={() => openAuth("login")} aria-label="Login">
                <UserRound size={22} strokeWidth={1.5} />
              </button>
            )}

            <Link
              to="/wishlist"
              aria-label={`Wishlist${wishlistCount ? `, ${wishlistCount} saved` : ""}`}
              title="Wishlist"
              className={tw("relative inline-flex items-center justify-center")}
            >
              <Heart size={22} strokeWidth={1.5} />
              {wishlistCount > 0 && (
                <span className={tw("absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--vanta-text)] px-1 text-[9px] font-bold leading-none text-[var(--vanta-bg)]")}>
                  {wishlistCount > 9 ? "9+" : wishlistCount}
                </span>
              )}
            </Link>

            <Link to="/cart" aria-label="Cart" className={tw("vanta-reference-cart")}>
              <ShoppingBag size={22} strokeWidth={1.5} />
              {cartCount > 0 && <span>{cartCount}</span>}
            </Link>

            {!isAuthenticated && (
              <div className={tw("vanta-reference-auth")}>
                <button type="button" onClick={() => openAuth("login")}>Login</button>
                <span>/</span>
                <button type="button" onClick={() => openAuth("register")}>Register</button>
              </div>
            )}

          </div>

          <button
            type="button"
            className={tw("vanta-reference-mobile-toggle")}
            onClick={() => setMobileMenuOpen((v) => !v)}
            aria-label="Menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className={tw("vanta-reference-mobile-menu")}>
            <NavLink to="/products" onClick={closeMobileMenu}>Shop</NavLink>
            <NavLink to="/products" onClick={closeMobileMenu}>Collection</NavLink>
            <Link to="/about" onClick={closeMobileMenu}>About</Link>
            <Link to="/wishlist" onClick={closeMobileMenu}>
              Wishlist{wishlistCount > 0 ? ` (${wishlistCount})` : ""}
            </Link>
            <Link to="/journal" onClick={closeMobileMenu}>Journal</Link>
            <button
              type="button"
              className={tw("vanta-mobile-theme-button")}
              onClick={() => setTheme((current) => (current === "dark" ? "light" : "dark"))}
            >
              {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
              {theme === "dark" ? "Light theme" : "Dark theme"}
            </button>

            {!isAuthenticated ? (
              <div className={tw("vanta-reference-mobile-auth")}>
                <button type="button" onClick={() => { closeMobileMenu(); openAuth("login"); }}>Login</button>
                <button type="button" onClick={() => { closeMobileMenu(); openAuth("register"); }}>Register</button>
              </div>
            ) : (
              <button type="button" onClick={handleLogout}>Logout</button>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
