import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import App from "./App.jsx";
import useAuthStore from "./store/authStore.js";

import "./index.css";

// Apply the saved theme before React paints the application.
const savedTheme = localStorage.getItem("vanta-theme");
const systemDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches;
const initialTheme =
  savedTheme === "dark" || savedTheme === "light"
    ? savedTheme
    : systemDark
    ? "dark"
    : "light";

document.documentElement.classList.toggle("dark", initialTheme === "dark");

const initializeAuth = async () => {
  await useAuthStore.getState().initializeAuth();
};

initializeAuth().finally(() => {
  createRoot(document.getElementById("root")).render(
    <StrictMode>
      <BrowserRouter>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              borderRadius: "0px",
              border: "1px solid var(--vanta-border)",
              background: "var(--vanta-surface)",
              color: "var(--vanta-text)",
            },
          }}
        />
      </BrowserRouter>
    </StrictMode>
  );
});
