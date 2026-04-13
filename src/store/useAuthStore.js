import { create } from "zustand";
import { getStoredUser, getToken, setToken, setStoredUser, clearAuth } from "@/lib/auth";

const useAuthStore = create((set, get) => ({
  //aways start with empty defaults on both
  user: null,
  token: null,
  isAuthenticated: false,
  _hydrated: false,

  // called once on the client after mount — reads localStorage safely
  hydrate: () => {
    const token = getToken();
    const user  = getStoredUser();
    set({
      token,
      user,
      isAuthenticated: !!token,
      _hydrated: true,
    });
  },

  login: (user, token) => {
    setToken(token);
    setStoredUser(user);
    set({ user, token, isAuthenticated: true, _hydrated: true });
  },

  logout: () => {
    clearAuth();
    set({ user: null, token: null, isAuthenticated: false });
  },

  updateUser: (updatedUser) => {
    const merged = { ...get().user, ...updatedUser };
    setStoredUser(merged);
    set({ user: merged });
  },
}));

export default useAuthStore;