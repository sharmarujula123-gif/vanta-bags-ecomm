import { create } from "zustand";
import authService from "../services/authService";

const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  loading: true,

  register: async (userData) => {
    const data = await authService.register(userData);

    set({
      user: data.data.user,
      isAuthenticated: true,
    });

    return data;
  },

  login: async (credentials) => {
    const data = await authService.login(credentials);

    set({
      user: data.data.user,
      isAuthenticated: true,
    });

    return data;
  },

  logout: async () => {
    try {
      await authService.logout();
    } finally {
      set({
        user: null,
        isAuthenticated: false,
      });
    }
  },

  initializeAuth: async () => {
    try {
      const data = await authService.getCurrentUser();

      set({
        user: data.data.user,
        isAuthenticated: true,
        loading: false,
      });
    } catch (error) {
      // 401 simply means there is no active session.
      if (error.response?.status === 401) {
        set({
          user: null,
          isAuthenticated: false,
          loading: false,
        });

        return;
      }

      set({
        user: null,
        isAuthenticated: false,
        loading: false,
      });
    }
  },
}));

export default useAuthStore;