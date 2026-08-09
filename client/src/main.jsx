import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App.jsx";
import useAuthStore from "./store/authStore.js";

import "./index.css";

const initializeAuth = async () => {
  await useAuthStore.getState().initializeAuth();
};

initializeAuth().finally(() => {
  createRoot(document.getElementById("root")).render(
    <StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </StrictMode>
  );
});