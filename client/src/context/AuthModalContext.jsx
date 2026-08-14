import { createContext, useCallback, useContext, useMemo, useState } from "react";

const AuthModalContext = createContext(null);

export const AuthModalProvider = ({ children }) => {
  const [mode, setMode] = useState(null);

  const openAuth = useCallback((nextMode = "login") => setMode(nextMode), []);
  const closeAuth = useCallback(() => setMode(null), []);
  const switchAuth = useCallback((nextMode) => setMode(nextMode), []);

  const value = useMemo(
    () => ({
      mode,
      isOpen: Boolean(mode),
      openAuth,
      closeAuth,
      switchAuth,
    }),
    [mode, openAuth, closeAuth, switchAuth]
  );

  return (
    <AuthModalContext.Provider value={value}>
      {children}
    </AuthModalContext.Provider>
  );
};

export const useAuthModal = () => {
  const context = useContext(AuthModalContext);
  if (!context) {
    throw new Error("useAuthModal must be used inside AuthModalProvider");
  }
  return context;
};
