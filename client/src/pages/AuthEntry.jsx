import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthModal } from "../context/AuthModalContext";

const AuthEntry = ({ mode }) => {
  const navigate = useNavigate();
  const { openAuth } = useAuthModal();

  useEffect(() => {
    openAuth(mode);
    navigate("/", { replace: true });
  }, [mode, openAuth, navigate]);

  return null;
};

export default AuthEntry;
