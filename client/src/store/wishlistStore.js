import { create } from "zustand";

const STORAGE_KEY = "vanta-wishlist";
const read = () => {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); }
  catch { return []; }
};
const persist = (items) => localStorage.setItem(STORAGE_KEY, JSON.stringify(items));

const useWishlistStore = create((set, get) => ({
  items: read(),
  toggle: (product) => {
    const items = get().items;
    const exists = items.some((item) => item._id === product._id);
    const next = exists ? items.filter((item) => item._id !== product._id) : [...items, product];
    persist(next); set({ items: next }); return !exists;
  },
  has: (id) => get().items.some((item) => item._id === id),
  remove: (id) => { const next = get().items.filter((item) => item._id !== id); persist(next); set({ items: next }); },
}));
export default useWishlistStore;
