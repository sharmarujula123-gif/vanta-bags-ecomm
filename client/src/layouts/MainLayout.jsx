import { Outlet } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ToastProvider from "../components/ToastProvider";
import AuthModal from "../components/AuthModal";

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-stone-100 text-stone-900 transition-colors duration-300">
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
      <ToastProvider />
      <AuthModal />
    </div>
  );
};

export default MainLayout;
