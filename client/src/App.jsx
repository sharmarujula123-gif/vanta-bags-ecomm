import { Routes, Route } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";

import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderDetails from "./pages/OrderDetails";
import Orders from "./pages/Orders";
import Account from "./pages/Account";
import Addresses from "./pages/Addresses";
import OrderSuccess from "./pages/OrderSuccess";
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

        <Route
          path="/products/:slug"
          element={<ProductDetails />}
        />

        <Route path="/cart" element={<Cart />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

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

      </Route>
    </Routes>
  );
}

export default App; 