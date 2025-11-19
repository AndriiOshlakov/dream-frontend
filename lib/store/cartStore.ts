import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  rating: number;
  reviewsCount: number;
  size: string;
}

interface CartState {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  updateQuantity: (id: string, quantity: number) => void;
}

export const useShopStore = create<CartState>()(
  persist(
    (set) => ({
      cartItems: [],

      // addToCart: (item) =>
      //   set((state) => {
      //     const existing = state.cartItems.find((i) => i.id === item.id);
      //     if (existing) {
      //       return {
      //         cartItems: state.cartItems.map((i) =>
      //           i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
      //         ),
      //       };
      //     }
      //     return { cartItems: [...state.cartItems, item] };
      //   }),

      addToCart: (
        item // ⬅️ UPDATED LOGIC
      ) =>
        set((state) => {
          // Check for an existing item with the SAME ID AND SAME SIZE
          const existing = state.cartItems.find((i) => i.id === item.id && i.size === item.size);

          if (existing) {
            return {
              cartItems: state.cartItems.map((i) =>
                // If ID and Size match, increment quantity
                i.id === item.id && i.size === item.size
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              ),
            };
          }
          // If new size or new item, add to the cart
          return { cartItems: [...state.cartItems, item] };
        }),
      removeFromCart: (id) =>
        set((state) => ({
          cartItems: state.cartItems.filter((item) => item.id !== id),
        })),

      clearCart: () => set({ cartItems: [] }),

      updateQuantity: (id, quantity) =>
        set((state) => ({
          cartItems: state.cartItems.map((item) =>
            item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
          ),
        })),
    }),
    {
      name: 'cart-storage',
    }
  )
);
