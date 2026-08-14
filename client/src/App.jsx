import { tw } from "./utils/twStyles.js";
import { Routes, Route } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";

import Home from "./pages/Home";
import Products from "./pages/Products";
import Category from "./pages/Category";
import About from "./pages/About";
import ProductDetails from "./pages/ProductDetails";
import AuthEntry from "./pages/AuthEntry";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderDetails from "./pages/OrderDetails";
import Orders from "./pages/Orders";
import Account from "./pages/Account";
import Addresses from "./pages/Addresses";
import OrderSuccess from "./pages/OrderSuccess";
import Wishlist from "./pages/Wishlist";
import RecentlyViewed from "./pages/RecentlyViewed";
import AdminLayout from "./layouts/AdminLayout";
import AdminRoute from "./components/AdminRoute";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminOrderDetails from "./pages/admin/AdminOrderDetails";
import AdminProducts from "./pages/admin/AdminProducts";

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />

        <Route path="/products" element={<Products />} />
        <Route path="/category" element={<Category />} />
        <Route path="/category/:slug" element={<Category />} />

        <Route
          path="/products/:slug"
          element={<ProductDetails />}
        />
        <Route path="/about" element={<About />} />

        <Route path="/cart" element={<Cart />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/recently-viewed" element={<RecentlyViewed />} />

        <Route path="/login" element={<AuthEntry mode="login" />} />

        <Route path="/register" element={<AuthEntry mode="register" />} />

        <Route path="/checkout" element={<Checkout />} />

        {/* Orders */}
        <Route
          path="/orders/:id"
          element={<OrderDetails />}
        />

        <Route
          path="/account/orders"
          element={<Orders />}
        />

        {/* Account */}
        <Route
          path="/account"
          element={<Account />}
        />

        <Route
          path="/account/addresses"
          element={<Addresses />}
        />

        {/* Payment success */}
        <Route
          path="/order-success/:orderId"
          element={<OrderSuccess />}
        />
        <Route element={<AdminRoute />}>
  <Route element={<AdminLayout />}>
    <Route
      path="/admin"
      element={<AdminDashboard />}
    />

    <Route
      path="/admin/orders"
      element={<AdminOrders />}
    />

    <Route
      path="/admin/orders/:id"
      element={<AdminOrderDetails />}
    />

    <Route
      path="/admin/products"
      element={<AdminProducts />}
    />
  </Route>
</Route>

        <Route path="*" element={<main className="mx-auto max-w-3xl px-5 py-24 text-center"><p className={tw("vanta-eyebrow")}>404</p><h1 className={tw("vanta-serif mt-4 text-6xl")}>Page not found.</h1><a href="/" className="mt-8 inline-flex bg-stone-950 px-6 py-3 text-sm font-semibold text-white">Return home</a></main>} />
      </Route>
    </Routes>
  );
}

export default App; 