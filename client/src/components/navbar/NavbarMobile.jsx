import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  ChevronDown,
  Menu,
  Moon,
  Search,
  ShoppingBag,
  Sun,
  UserRound,
  X,
} from "lucide-react";
import { tw } from "../../utils/twStyles.js";

const NavbarMobile = ({
  mobileMenuOpen,
  mobileSearchOpen,
  setMobileMenuOpen,
  setMobileSearchOpen,
  navSearch,
  setNavSearch,
  collectionsOpen,
  setCollectionsOpen,
  theme,
  setTheme,
  categories,
  isAuthenticated,
  user,
  cartCount,
  wishlistCount,
  navigate,
  openAuth,
  closeMobileMenu,
  handleLogout,
}) => (
  <>
    <div className={tw("vanta-reference-mobile-bar")}>
      <button
        type="button"
        className={tw("vanta-mobile-bar-icon")}
        onClick={() => {
          setMobileMenuOpen((v) => !v);
          setMobileSearchOpen(false);
        }}
        aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
      >
        {mobileMenuOpen ? <X size={21} strokeWidth={1.8} /> : <Menu size={21} strokeWidth={1.8} />}
      </button>

      <button
        type="button"
        className={tw("vanta-mobile-bar-icon")}
        onClick={() => {
          setMobileSearchOpen((v) => !v);
          setMobileMenuOpen(false);
        }}
        aria-label="Search"
      >
        <Search size={20} strokeWidth={1.7} />
      </button>

      <Link
        to="/"
        className={tw("vanta-mobile-bar-logo")}
        onClick={() => {
          closeMobileMenu();
          setMobileSearchOpen(false);
        }}
      >
        <span>VANTA</span>
      </Link>

      <div className={tw("vanta-mobile-bar-actions")}>
        <button
          type="button"
          className={tw("vanta-mobile-bar-icon")}
          onClick={() => (isAuthenticated ? navigate("/account") : openAuth("login"))}
          aria-label="Account"
        >
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

    {mobileMenuOpen && (
      <div className={tw("vanta-reference-mobile-menu")}>
        <div className={tw("vanta-mobile-menu-main")}>
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

          <NavLink to="/products" onClick={closeMobileMenu} className={tw("vanta-mobile-menu-item")}>
            <span>Shop All</span>
          </NavLink>

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
                className={tw(`transition-transform duration-200 ${collectionsOpen ? "rotate-180" : ""}`)}
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

          <NavLink to="/category" onClick={closeMobileMenu} className={tw("vanta-mobile-menu-item")}>
            <span>Category</span>
          </NavLink>
        </div>

        <div className={tw("vanta-mobile-menu-secondary")}>
          {user?.role === "admin" && (
            <NavLink to="/admin" onClick={closeMobileMenu} className={tw("vanta-mobile-menu-item")}>
              <span>Dashboard</span>
            </NavLink>
          )}

          <Link to="/cart" onClick={closeMobileMenu} className={tw("vanta-mobile-menu-item")}>
            <span>Cart</span>
            {cartCount > 0 && (
              <span className={tw("vanta-mobile-count")}>{cartCount > 9 ? "9+" : cartCount}</span>
            )}
          </Link>

          <Link to="/wishlist" onClick={closeMobileMenu} className={tw("vanta-mobile-menu-item")}>
            <span>Wishlist</span>
            {wishlistCount > 0 && (
              <span className={tw("vanta-mobile-count")}>{wishlistCount > 9 ? "9+" : wishlistCount}</span>
            )}
          </Link>

          <Link to="/account/orders" onClick={closeMobileMenu} className={tw("vanta-mobile-menu-item")}>
            <span>Orders</span>
          </Link>

          <Link to="/account/addresses" onClick={closeMobileMenu} className={tw("vanta-mobile-menu-item")}>
            <span>Address</span>
          </Link>

          <Link to="/about" onClick={closeMobileMenu} className={tw("vanta-mobile-menu-item")}>
            <span>About</span>
          </Link>

          <Link to="/contact" onClick={closeMobileMenu} className={tw("vanta-mobile-menu-item")}>
            <span>Contact</span>
          </Link>
        </div>

        <div className={tw("vanta-mobile-menu-theme")}>
          <button
            type="button"
            className={tw("vanta-mobile-theme-button")}
            onClick={() => setTheme((current) => (current === "dark" ? "light" : "dark"))}
          >
            {theme === "dark" ? <Sun size={15} strokeWidth={1.7} /> : <Moon size={15} strokeWidth={1.7} />}
            <span>{theme === "dark" ? "Light" : "Dark"}</span>
          </button>
        </div>

        {!isAuthenticated ? (
          <div className={tw("vanta-mobile-menu-auth")}>
            <button type="button" onClick={() => { closeMobileMenu(); openAuth("login"); }}>
              Login
            </button>
            <span>/</span>
            <button type="button" onClick={() => { closeMobileMenu(); openAuth("register"); }}>
              Register
            </button>
          </div>
        ) : (
          <button type="button" className={tw("vanta-mobile-logout")} onClick={handleLogout}>
            Logout
          </button>
        )}
      </div>
    )}
  </>
);

export default NavbarMobile;
