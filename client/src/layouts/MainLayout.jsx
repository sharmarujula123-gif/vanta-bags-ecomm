import { Outlet } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ToastProvider from "../components/ToastProvider";
import AuthModal from "../components/AuthModal";

const MainLayout = () => {
  return (
    <div className="vanta-app-shell min-h-screen transition-colors duration-300">
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
