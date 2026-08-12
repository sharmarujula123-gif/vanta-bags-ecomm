import { create } from "zustand";
import cartService from "../services/cartService";

const getCartCount = (cart) => {
  return (
    cart?.items?.reduce(
      (total, item) => total + item.quantity,
      0
    ) || 0
  );
};

const useCartStore = create((set) => ({
  cart: null,
  cartCount: 0,
  loading: false,

  setCart: (cart) => {
    set({
      cart,
      cartCount: getCartCount(cart),
    });
  },

  fetchCart: async () => {
    try {
      set({ loading: true });

      const data = await cartService.getCart();
      const cart = data.data.cart;

      set({
        cart,
        cartCount: getCartCount(cart),
        loading: false,
      });

      return cart;
    } catch (error) {
      set({
        cart: null,
        cartCount: 0,
        loading: false,
      });

      throw error;
    }
  },

  addToCart: async (productId, quantity = 1) => {
    const data = await cartService.addToCart(
      productId,
      quantity
    );

    const cart = data.data.cart;

    set({
      cart,
      cartCount: getCartCount(cart),
    });

    return cart;
  },

  updateQuantity: async (productId, quantity) => {
    const data = await cartService.updateCartItem(
      productId,
      quantity
    );

    const cart = data.data.cart;

    set({
      cart,
      cartCount: getCartCount(cart),
    });

    return cart;
  },

  removeFromCart: async (productId) => {
    const data = await cartService.removeCartItem(productId);

    const cart = data.data.cart;

    set({
      cart,
      cartCount: getCartCount(cart),
    });

    return cart;
  },

  clearCart: async () => {
    const data = await cartService.clearCart();

    const cart = data.data.cart;

    set({
      cart,
      cartCount: 0,
    });

    return cart;
  },
}));

export default useCartStore;