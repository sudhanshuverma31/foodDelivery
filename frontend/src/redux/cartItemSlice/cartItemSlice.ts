import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cartItems: [] as { dish: any; quantity: number }[],
  totalQuantity: 0,
  totalPrice: 0,
};

const cartItemSlice = createSlice({
  name: "cartItem",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const dish = action.payload;
      const existingItem = state.cartItems.find((item) => item.dish.id === dish.id);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.cartItems.push({ dish, quantity: 1 });
      }
    },
    setCartItems: (state, action) => {
      state.cartItems = action.payload;
    },
    updateQuantity: (state, action) => {
      const { dishId, delta } = action.payload;
      const item = state.cartItems.find((item) => item.dish.id === dishId);
      if (item) {
        item.quantity += delta;
        if (item.quantity <= 0) {
          state.cartItems = state.cartItems.filter((item) => item.dish.id !== dishId);
        }
      }
    },
    removeFromCart: (state, action) => {
      const dishId = action.payload;
      state.cartItems = state.cartItems.filter((item) => item.dish.id !== dishId);
    },
    clearCartItems: (state) => {
      state.cartItems = [];
      state.totalQuantity = 0;
      state.totalPrice = 0;
    },
    setTotalQuantity: (state, action) => {
      state.totalQuantity = action.payload;
    },
    setTotalPrice: (state, action) => {
      state.totalPrice = action.payload;
    },
  }
});

export const {
  addToCart,
  setCartItems,
  updateQuantity,
  removeFromCart,
  clearCartItems,
  setTotalQuantity,
  setTotalPrice
} = cartItemSlice.actions;

export default cartItemSlice.reducer;
