import { tw } from "../utils/twStyles.js";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

const Footer = () => {
  return (
    <footer className={tw("vanta-footer border-t border-stone-800 bg-stone-950 text-stone-100")}>
      <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-20">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link
              to="/"
              className="text-2xl font-bold tracking-[0.3em]"
            >
              VANTA
            </Link>

            <p className="mt-6 max-w-md text-sm leading-7 text-stone-400">
              Premium bags designed for modern everyday movement.
              Functional forms, dependable materials and timeless
              design.
            </p>

            <div className="mt-7 flex gap-3">
              <a
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-stone-700 text-xs transition hover:border-stone-300 hover:bg-stone-800"
              >
                IG
              </a>

              <a
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-stone-700 text-xs transition hover:border-stone-300 hover:bg-stone-800"
              >
                FB
              </a>

              <a
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-stone-700 text-xs transition hover:border-stone-300 hover:bg-stone-800"
              >
                X
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-xs font-bold tracking-[0.2em] text-stone-300">
              SHOP
            </h3>

            <nav className="mt-6 flex flex-col gap-4 text-sm text-stone-400">
              <Link
                to="/"
                className="transition hover:text-white"
              >
                Collection
              </Link>

              <Link
                to="/cart"
                className="transition hover:text-white"
              >
                Cart
              </Link>
            </nav>
          </div>

          {/* Help */}
          <div>
            <h3 className="text-xs font-bold tracking-[0.2em] text-stone-300">
              HELP
            </h3>

            <nav className="mt-6 flex flex-col gap-4 text-sm text-stone-400">
              <Link
                to="/account"
                className="transition hover:text-white"
              >
                My Account
              </Link>

              <a
                href="#"
                className="flex items-center gap-1 transition hover:text-white"
              >
                Contact
                <ArrowUpRight size={13} />
              </a>

              <a
                href="#"
                className="transition hover:text-white"
              >
                Shipping & Returns
              </a>
            </nav>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-16 flex flex-col gap-4 border-t border-stone-800 pt-6 text-xs text-stone-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Vanta Bags. All rights reserved.</p>

          <div className="flex gap-6">
            <a
              href="#"
              className="transition hover:text-stone-300"
            >
              Privacy
            </a>

            <a
              href="#"
              className="transition hover:text-stone-300"
            >
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
