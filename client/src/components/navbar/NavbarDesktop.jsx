import { Link, NavLink, useNavigate } from "react-router-dom";
import { ChevronDown, Search } from "lucide-react";
import { tw } from "../../utils/twStyles.js";

const NavbarDesktop = ({
  categories,
  collectionsOpen,
  setCollectionsOpen,
  navSearch,
  setNavSearch,
  navigate,
  closeMobileMenu,
}) => (
  <>
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
                      to={`/category/${category.slug}`}
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

            <Link to="/category" onClick={() => setCollectionsOpen(false)} className={tw("vanta-mega-feature")}>
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
      <button type="submit" aria-label="Search">
        <Search size={18} strokeWidth={1.7} />
      </button>
    </form>
  </>
);

export default NavbarDesktop;
