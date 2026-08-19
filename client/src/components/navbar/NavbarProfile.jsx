import { Link } from "react-router-dom";
import {
  ChevronDown,
  Heart,
  LayoutDashboard,
  LogOut,
  MapPin,
  Package,
  ShoppingBag,
  Sun,
  Moon,
  UserRound,
} from "lucide-react";
import { tw } from "../../utils/twStyles.js";

const NavbarProfile = ({
  user,
  isAuthenticated,
  profileOpen,
  setProfileOpen,
  theme,
  setTheme,
  wishlistCount,
  cartCount,
  handleLogout,
  openAuth,
}) => (
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
      <div className={tw("relative")}>
        <button
          type="button"
          onClick={() => setProfileOpen((current) => !current)}
          aria-label="Open profile menu"
          aria-expanded={profileOpen}
          aria-haspopup="menu"
          className={tw("inline-flex h-10 items-center gap-1.5 rounded-full px-2 text-[var(--vanta-text)] transition hover:bg-[var(--vanta-border)]/40")}
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
            className={tw("absolute right-0 top-[calc(100%+12px)] z-50 w-64 overflow-hidden rounded-2xl border border-[var(--vanta-border)] bg-[var(--vanta-bg)] p-2 shadow-[0_18px_50px_rgba(0,0,0,0.12)]")}
          >
            <div className={tw("border-b border-[var(--vanta-border)] px-4 py-3")}>
              <p className={tw("text-xs uppercase tracking-[0.14em] text-[var(--vanta-muted)]")}>My Account</p>
              <p className={tw("mt-1 truncate text-sm font-semibold text-[var(--vanta-text)]")}>{user?.name || "Customer"}</p>
              {user?.email && <p className={tw("mt-0.5 truncate text-xs text-[var(--vanta-muted)]")}>{user.email}</p>}
            </div>

            <div className={tw("pt-1")}>
              {user?.role === "admin" && (
                <Link to="/admin" role="menuitem" onClick={() => setProfileOpen(false)} className={tw("flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-[var(--vanta-text)] transition hover:bg-[var(--vanta-border)]/40")}>
                  <LayoutDashboard size={17} strokeWidth={1.6} />
                  <span>Dashboard</span>
                </Link>
              )}

              <Link to="/account" role="menuitem" onClick={() => setProfileOpen(false)} className={tw("flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-[var(--vanta-text)] transition hover:bg-[var(--vanta-border)]/40")}>
                <UserRound size={17} strokeWidth={1.6} />
                <span>Profile</span>
              </Link>

              <Link to="/account/orders" role="menuitem" onClick={() => setProfileOpen(false)} className={tw("flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-[var(--vanta-text)] transition hover:bg-[var(--vanta-border)]/40")}>
                <Package size={17} strokeWidth={1.6} />
                <span>Orders</span>
              </Link>

              <Link to="/account/addresses" role="menuitem" onClick={() => setProfileOpen(false)} className={tw("flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-[var(--vanta-text)] transition hover:bg-[var(--vanta-border)]/40")}>
                <MapPin size={17} strokeWidth={1.6} />
                <span>Addresses</span>
              </Link>

              <div className={tw("my-1 border-t border-[var(--vanta-border)]")} />

              <button type="button" role="menuitem" onClick={handleLogout} className={tw("flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-red-600 transition hover:bg-red-50 dark:hover:bg-red-950/20")}>
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
);

export default NavbarProfile;
