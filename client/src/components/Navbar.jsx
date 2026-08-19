import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { tw } from "../utils/twStyles.js";
import useAuthStore from "../store/authStore";
import useCartStore from "../store/cartStore";
import useWishlistStore from "../store/wishlistStore";
import { useAuthModal } from "../context/AuthModalContext";
import categoryService from "../services/categoryService";
import NavbarDesktop from "../components/navbar/NavbarDesktop";
import NavbarMobile from "../components/navbar/NavbarMobile";
import NavbarProfile from "../components/navbar/NavbarProfile";

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
  const [collectionsOpen, setCollectionsOpen] = useState(false);
  const [navSearch, setNavSearch] = useState("");
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  const profileRef = useRef(null);
  const mobileMenuRef = useRef(null);

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

  useEffect(() => {
    let cancelled = false;

    const loadCategories = async () => {
      try {
        const response = await categoryService.getCategories();
        const list = response?.data?.categories || response?.categories || response?.data || [];
        if (!cancelled) setCategories(Array.isArray(list) ? list : []);
      } catch (error) {
        console.error("Failed to load navbar categories:", error);
      } finally {
        if (!cancelled) setCategoriesLoading(false);
      }
    };

    loadCategories();
    return () => { cancelled = true; };
  }, []);

  const closeMobileMenu = () => setMobileMenuOpen(false);

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

  useEffect(() => {
    setCollectionsOpen(false);
    setMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    if (!mobileMenuOpen) return;

    const handleMobileMenuOutsideClick = (event) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        closeMobileMenu();
      }
    };

    document.addEventListener("mousedown", handleMobileMenuOutsideClick);
    return () => document.removeEventListener("mousedown", handleMobileMenuOutsideClick);
  }, [mobileMenuOpen]);

  const isHome = location.pathname === "/";

  return (
    <header
      ref={mobileMenuRef}
      className={tw(`vanta-header vanta-reference-header ${isHome ? "vanta-header-home" : ""}`)}
    >
      <div className={tw("vanta-promo")}>Free shipping on orders above ₹999</div>

      <div className={tw("vanta-reference-navbar")}>
        <NavbarMobile
          mobileMenuOpen={mobileMenuOpen}
          mobileSearchOpen={mobileSearchOpen}
          setMobileMenuOpen={setMobileMenuOpen}
          setMobileSearchOpen={setMobileSearchOpen}
          navSearch={navSearch}
          setNavSearch={setNavSearch}
          collectionsOpen={collectionsOpen}
          setCollectionsOpen={setCollectionsOpen}
          theme={theme}
          setTheme={setTheme}
          categories={categories}
          isAuthenticated={isAuthenticated}
          user={user}
          cartCount={cartCount}
          wishlistCount={wishlistCount}
          navigate={navigate}
          openAuth={openAuth}
          closeMobileMenu={closeMobileMenu}
          handleLogout={handleLogout}
        />

        <div className={tw("vanta-reference-navbar-inner")}>
          <NavbarDesktop
            categories={categories}
            collectionsOpen={collectionsOpen}
            setCollectionsOpen={setCollectionsOpen}
            navSearch={navSearch}
            setNavSearch={setNavSearch}
            navigate={navigate}
            closeMobileMenu={closeMobileMenu}
          />

          <NavbarProfile
            user={user}
            isAuthenticated={isAuthenticated}
            profileOpen={profileOpen}
            setProfileOpen={setProfileOpen}
            theme={theme}
            setTheme={setTheme}
            wishlistCount={wishlistCount}
            cartCount={cartCount}
            handleLogout={handleLogout}
            openAuth={openAuth}
          />

          <button
            type="button"
            className={tw("vanta-reference-mobile-toggle")}
            onClick={() => setMobileMenuOpen((v) => !v)}
            aria-label="Menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
