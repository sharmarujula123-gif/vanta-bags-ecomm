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
} from "lucide-react";
import { useEffect, useState } from "react";
import useAuthStore from "../store/authStore";
import useCartStore from "../store/cartStore";
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

  const cartCount = useCartStore((state) => state.cartCount);
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const logout = useAuthStore((state) => state.logout);
  const fetchCart = useCartStore((state) => state.fetchCart);
  const { openAuth } = useAuthModal();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("vanta-theme", theme);
  }, [theme]);

  useEffect(() => {
    if (isAuthenticated) fetchCart().catch(() => {});
  }, [isAuthenticated, fetchCart]);

  const handleLogout = async () => {
    await logout();
    setMobileMenuOpen(false);
    navigate("/");
  };

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
            <button type="button" onClick={() => {}} aria-label="Search">
              <Search size={22} strokeWidth={1.5} />
            </button>

            {isAuthenticated ? (
              <Link to="/account" aria-label="Account" className={tw("vanta-reference-icon-link")}>
                <UserRound size={22} strokeWidth={1.5} />
              </Link>
            ) : (
              <button type="button" onClick={() => openAuth("login")} aria-label="Login">
                <UserRound size={22} strokeWidth={1.5} />
              </button>
            )}

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

            {isAuthenticated && (
              <button type="button" className={tw("vanta-reference-user-name")} onClick={handleLogout}>
                {user?.name || "Logout"}
              </button>
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
            <Link to="/journal" onClick={closeMobileMenu}>Journal</Link>
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
