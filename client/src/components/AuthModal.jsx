import { tw } from "../utils/twStyles.js";
import { useEffect } from "react";
import { X } from "lucide-react";
import { useAuthModal } from "../context/AuthModalContext";
import Login from "../pages/Login";
import Register from "../pages/Register";

const AuthModal = () => {
  const { mode, isOpen, closeAuth } = useAuthModal();

  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") closeAuth();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, closeAuth]);

  if (!isOpen) return null;

  return (
    <div
      className={tw("vanta-auth-overlay")}
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) closeAuth();
      }}
    >
      <div
        className={tw("vanta-auth-modal")}
        role="dialog"
        aria-modal="true"
        aria-labelledby="vanta-auth-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className={tw("vanta-auth-close")}
          onClick={closeAuth}
          aria-label="Close"
        >
          <X size={18} strokeWidth={1.8} />
        </button>

        {mode === "register" ? <Register /> : <Login />}
      </div>
    </div>
  );
};

export default AuthModal;
