import { create } from "zustand";
const KEY = "vanta-recently-viewed";
const read = () => { try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; } };
const useRecentStore = create((set, get) => ({
  items: read(),
  add: (product) => {
    const next = [product, ...get().items.filter((item) => item._id !== product._id)].slice(0, 6);
    localStorage.setItem(KEY, JSON.stringify(next)); set({ items: next });
  },
}));
export default useRecentStore;
