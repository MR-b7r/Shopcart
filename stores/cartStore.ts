import { CartStoreActionsType, CartStoreStateType } from "@/lib/types";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const useCartStore = create<CartStoreStateType & CartStoreActionsType>()(
  persist(
    (set) => ({
      cart: [],
      hasHydrated: false,
      addToCart: (product) =>
        set((state) => {
          const existingIndex = state.cart.findIndex(
            (p) =>
              p.id === product.id &&
              p.selectedSize === product.selectedSize &&
              p.selectedColor === product.selectedColor,
          );
          if (existingIndex !== -1) {
            const updateCart = [...state.cart];
            updateCart[existingIndex].quantity += product.quantity;
            return { cart: updateCart };
          }
          return {
            cart: [
              ...state.cart,
              {
                ...product,
                quantity: product.quantity || 1,
                selectedSize: product.selectedSize,
                selectedColor: product.selectedColor,
              },
            ],
          };
        }),
      removeFromCart: (product) =>
        set((state) => ({
          cart: state.cart.filter(
            (p) =>
              !(
                p.id === product.id &&
                p.selectedSize === product.selectedSize &&
                p.selectedColor === product.selectedColor
              ),
          ),
        })),
      updateQuantity: (product, newQuantity) =>
        set((state) => {
          const existingIndex = state.cart.findIndex(
            (p) =>
              p.id === product.id &&
              p.selectedSize === product.selectedSize &&
              p.selectedColor === product.selectedColor,
          );
          if (existingIndex !== -1) {
            if (newQuantity <= 0) {
              return {
                cart: state.cart.filter((_, idx) => idx !== existingIndex),
              };
            }
            const updateCart = [...state.cart];
            updateCart[existingIndex].quantity = newQuantity;
            return { cart: updateCart };
          }
          return { cart: state.cart };
        }),
      clearCart: () => set({ cart: [] }),
    }),
    {
      name: "cart",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (state) state.hasHydrated = true;
      },
    },
  ),
);
export default useCartStore;
