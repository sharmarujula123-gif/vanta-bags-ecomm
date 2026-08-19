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
import categoryService from "../services/categoryService";
import { normalizeCategory } from "../data/storeCategories";

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

  useEffect(() => {
    setCollectionsOpen(false);
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Lock the page scroll while the mobile menu is open.
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

  // Close the mobile menu when clicking anywhere outside the navbar/menu.
  useEffect(() => {
    if (!mobileMenuOpen) return;

    const handleMobileMenuOutsideClick = (event) => {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target)
      ) {
        closeMobileMenu();
      }
    };

    document.addEventListener("mousedown", handleMobileMenuOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleMobileMenuOutsideClick);
    };
  }, [mobileMenuOpen]);

  return (
    <header ref={mobileMenuRef} className={tw(`vanta-header vanta-reference-header ${isHome ? "vanta-header-home" : ""}`)}>
      <div className={tw("vanta-promo")}>Free shipping on orders above ₹999</div>

      <div className={tw("vanta-reference-navbar")}>
        <div className={tw("vanta-reference-mobile-bar")}>
          <button
            type="button"
            className={tw("vanta-mobile-bar-icon")}
            onClick={() => { setMobileMenuOpen((v) => !v); setMobileSearchOpen(false); }}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? <X size={21} strokeWidth={1.8} /> : <Menu size={21} strokeWidth={1.8} />}
          </button>

          <button
            type="button"
            className={tw("vanta-mobile-bar-icon") }
            onClick={() => { setMobileSearchOpen((v) => !v); setMobileMenuOpen(false); }}
            aria-label="Search"
          >
            <Search size={20} strokeWidth={1.7} />
          </button>

          <Link to="/" className={tw("vanta-mobile-bar-logo")} onClick={() => { closeMobileMenu(); setMobileSearchOpen(false); }}>
            <span>VANTA</span>
          </Link>

          <div className={tw("vanta-mobile-bar-actions")}>
            <button type="button" className={tw("vanta-mobile-bar-icon")} onClick={() => (isAuthenticated ? navigate("/account") : openAuth("login"))} aria-label="Account">
              <UserRound size={20} strokeWidth={1.7} />
            </button>
            <Link to="/cart" className={tw("vanta-mobile-bar-cart")} aria-label="Cart">
              <ShoppingBag size={20} strokeWidth={1.7} />
              {cartCount > 0 && <span>{cartCount > 9 ? "9+" : cartCount}</span>}
            </Link>
          </div>
        </div>

        {mobileSearchOpen && (
          <form
            className={tw("vanta-mobile-bar-search")}
            onSubmit={(event) => {
              event.preventDefault();
              const value = navSearch.trim();
              setMobileSearchOpen(false);
              navigate(value ? `/products?search=${encodeURIComponent(value)}` : "/products");
            }}
          >
            <Search size={17} strokeWidth={1.7} />
            <input
              autoFocus
              type="search"
              value={navSearch}
              onChange={(event) => setNavSearch(event.target.value)}
              placeholder="Search bags, dresses, jewelry..."
              aria-label="Search products"
            />
            <button type="button" onClick={() => setMobileSearchOpen(false)} aria-label="Close search">
              <X size={17} strokeWidth={1.7} />
            </button>
          </form>
        )}

        <div className={tw("vanta-reference-navbar-inner")}>
          <Link to="/" className={tw("vanta-reference-logo")} onClick={closeMobileMenu}>
            <span>VANTA</span>
          </Link>

          <nav className={tw("vanta-reference-main-nav")}>
            <NavLink to="/">Home</NavLink>

            <div className={tw("vanta-mega-trigger-wrap")}>
              <button
                type="button"
                className={tw(`vanta-mega-trigger ${collectionsOpen ? "is-open" : ""}`)}
                onClick={() => setCollectionsOpen((current) => !current)}
                aria-expanded={collectionsOpen}
              >
                Collections
                <ChevronDown size={13} strokeWidth={1.7} />
              </button>

              {collectionsOpen && (
                <div className={tw("vanta-mega-menu")}>
                  <div className={tw("vanta-mega-column vanta-mega-root")}>
                    <p>Shop by category</p>
                    {categories.filter((category) => !category.parentCategory).map((category) => (
                      <Link
                        key={category.slug}
                        to={`/category/${category.slug}`}
                        onClick={() => setCollectionsOpen(false)}
                        className={tw("vanta-mega-root-link")}
                      >
                        <span>{category.name}</span>
                        <span>›</span>
                      </Link>
                    ))}
                  </div>

                  <div className={tw("vanta-mega-column vanta-mega-popular")}>
                    <p>Popular categories</p>
                    <div className={tw("vanta-mega-subgrid")}>
                      {categories
                        .filter((category) => category.parentCategory)
                        .slice(0, 10)
                        .map((category) => (
                          <Link
                            key={category._id || category.slug}
                            to={`/category/${category.slug || normalizeCategory(category.name)}`}
                            onClick={() => setCollectionsOpen(false)}
                          >
                            <span>{category.name}</span>
                            <small>
                              {typeof category.parentCategory === "object"
                                ? category.parentCategory.name
                                : "Collection"}
                            </small>
                          </Link>
                        ))}
                    </div>
                  </div>

                  <Link
                    to="/category"
                    onClick={() => setCollectionsOpen(false)}
                    className={tw("vanta-mega-feature")}
                  >
                    <div>
                      <span>VANTA EDIT</span>
                      <h3>Explore every collection.</h3>
                      <strong>Shop now <span>→</span></strong>
                    </div>
                  </Link>
                </div>
              )}
            </div>

            <NavLink to="/about">About</NavLink>
            <NavLink to="/about">Contact</NavLink>
          </nav>

          <form
            className={tw("vanta-navbar-search")}
            onSubmit={(event) => {
              event.preventDefault();
              const value = navSearch.trim();
              navigate(value ? `/products?search=${encodeURIComponent(value)}` : "/products");
              setNavSearch(value);
            }}
          >
            <input
              type="search"
              value={navSearch}
              onChange={(event) => setNavSearch(event.target.value)}
              placeholder="Search for bags, dresses, jewelry..."
              aria-label="Search products"
            />
            <button type="submit" aria-label="Search"><Search size={18} strokeWidth={1.7} /></button>
          </form>

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

        {/* {mobileMenuOpen && (
          <div className={tw("vanta-reference-mobile-menu")}>
            <form
              className={tw("vanta-mobile-search")}
              onSubmit={(event) => {
                event.preventDefault();
                const value = navSearch.trim();
                closeMobileMenu();
                navigate(value ? `/products?search=${encodeURIComponent(value)}` : "/products");
              }}
            >
              <input
                type="search"
                value={navSearch}
                onChange={(event) => setNavSearch(event.target.value)}
                placeholder="Search products..."
                aria-label="Search products"
              />
              <button type="submit" aria-label="Search"><Search size={17} /></button>
            </form>
            <NavLink to="/products" onClick={closeMobileMenu}>Shop All</NavLink>
            <Link to="/category" onClick={closeMobileMenu}>Collections</Link>
            {categories.filter((category) => !category.parentCategory).map((category) => (
              <Link key={category.slug} to={`/category/${category.slug}`} onClick={closeMobileMenu}>
                {category.name}
              </Link>
            ))}
            <Link to="/about" onClick={closeMobileMenu}>About</Link>
            <Link to="/about" onClick={closeMobileMenu}>Contact</Link>
            <Link to="/wishlist" onClick={closeMobileMenu}>
              Wishlist{wishlistCount > 0 ? ` (${wishlistCount})` : ""}
            </Link>
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
            )} */}
          {/* </div> */}
        {/* )} */}
        {mobileMenuOpen && (
  <div className={tw("vanta-reference-mobile-menu")}>
    
    {/* TOP MENU */}
    <div className={tw("vanta-mobile-menu-main")}>

      {/* Profile */}
      <button
        type="button"
        className={tw("vanta-mobile-menu-item")}
        onClick={() => {
          closeMobileMenu();
          isAuthenticated ? navigate("/account") : openAuth("login");
        }}
      >
        <span>Profile</span>
      </button>

      {/* Shop All */}
      <NavLink
        to="/products"
        onClick={closeMobileMenu}
        className={tw("vanta-mobile-menu-item")}
      >
        <span>Shop All</span>
      </NavLink>

      {/* Collections */}
      <div className={tw("vanta-mobile-collection")}>
        <button
          type="button"
          className={tw("vanta-mobile-menu-item")}
          onClick={() => setCollectionsOpen((current) => !current)}
          aria-expanded={collectionsOpen}
        >
          <span>Collections</span>

          <ChevronDown
            size={15}
            strokeWidth={1.7}
            className={tw(
              `transition-transform duration-200 ${
                collectionsOpen ? "rotate-180" : ""
              }`
            )}
          />
        </button>

        {collectionsOpen && (
          <div className={tw("vanta-mobile-collection-dropdown")}>
            {[
             
                { name: "Bags", slug: "bags" },
                { name: "Footwear", slug: "footwear" },
                { name: "Jewellery", slug: "jewellery" },
                { name: "Tops", slug: "tops" },
                { name: "Dresses", slug: "dresses" },
              
            ].map((collection) => (
              <Link
                key={collection.slug}
                to={`/category/${collection.slug}`}
                onClick={closeMobileMenu}
                className={tw("vanta-mobile-collection-item")}
              >
                {collection.name}
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Category - NO DROPDOWN */}
      <NavLink
        to="/category"
        onClick={closeMobileMenu}
        className={tw("vanta-mobile-menu-item")}
      >
        <span>Category</span>
      </NavLink>

    </div>

    {/* LOWER MENU */}
    <div className={tw("vanta-mobile-menu-secondary")}>

      {/* Cart */}
      <Link
        to="/cart"
        onClick={closeMobileMenu}
        className={tw("vanta-mobile-menu-item")}
      >
        <span>Cart</span>
        {cartCount > 0 && (
          <span className={tw("vanta-mobile-count")}>
            {cartCount > 9 ? "9+" : cartCount}
          </span>
        )}
      </Link>

      {/* Wishlist */}
      <Link
        to="/wishlist"
        onClick={closeMobileMenu}
        className={tw("vanta-mobile-menu-item")}
      >
        <span>Wishlist</span>
        {wishlistCount > 0 && (
          <span className={tw("vanta-mobile-count")}>
            {wishlistCount > 9 ? "9+" : wishlistCount}
          </span>
        )}
      </Link>

      {/* Orders */}
      <Link
        to="/account/orders"
        onClick={closeMobileMenu}
        className={tw("vanta-mobile-menu-item")}
      >
        <span>Orders</span>
      </Link>

      {/* Address */}
      <Link
        to="/account/addresses"
        onClick={closeMobileMenu}
        className={tw("vanta-mobile-menu-item")}
      >
        <span>Address</span>
      </Link>

      {/* About */}
      <Link
        to="/about"
        onClick={closeMobileMenu}
        className={tw("vanta-mobile-menu-item")}
      >
        <span>About</span>
      </Link>

      {/* Contact */}
      <Link
        to="/contact"
        onClick={closeMobileMenu}
        className={tw("vanta-mobile-menu-item")}
      >
        <span>Contact</span>
      </Link>

    </div>

    {/* THEME */}
    <div className={tw("vanta-mobile-menu-theme")}>
      <button
        type="button"
        className={tw("vanta-mobile-theme-button")}
        onClick={() =>
          setTheme((current) =>
            current === "dark" ? "light" : "dark"
          )
        }
      >
        {theme === "dark" ? (
          <Sun size={15} strokeWidth={1.7} />
        ) : (
          <Moon size={15} strokeWidth={1.7} />
        )}

        <span>
          {theme === "dark" ? "Light" : "Dark"}
        </span>
      </button>
    </div>

    {/* LOGIN / REGISTER */}
    {!isAuthenticated ? (
      <div className={tw("vanta-mobile-menu-auth")}>

        <button
          type="button"
          onClick={() => {
            closeMobileMenu();
            openAuth("login");
          }}
        >
          Login
        </button>

        <span>/</span>

        <button
          type="button"
          onClick={() => {
            closeMobileMenu();
            openAuth("register");
          }}
        >
          Register
        </button>

      </div>
    ) : (
      <button
        type="button"
        className={tw("vanta-mobile-logout")}
        onClick={handleLogout}
      >
        Logout
      </button>
    )}

  </div>
)}
      </div>
    </header>
  );
};

export default Navbar;