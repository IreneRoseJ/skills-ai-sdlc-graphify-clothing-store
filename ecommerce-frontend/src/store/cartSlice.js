import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  totalAmount: 0,
  totalQuantity: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCart: (state, action) => {
      state.items = action.payload.items || [];
      state.totalAmount = action.payload.totalAmount || 0;
      state.totalQuantity = action.payload.totalQuantity || 0;
    },

    addToCart: (state, action) => {
      const newItem = action.payload; 
      const itemQty = newItem.qty || 1;

      const existingItem = state.items.find(
        item => item.product === newItem.product && item.size === newItem.size
      );

      if (existingItem) {
        existingItem.qty += itemQty;
      } else {
        state.items.push({
          product: newItem.product,
          name: newItem.name,
          price: newItem.price,
          image: newItem.image,
          size: newItem.size || '',
          qty: itemQty,
        });
      }

      state.totalQuantity += itemQty;
      state.totalAmount += newItem.price * itemQty;
    },

    removeFromCart: (state, action) => {
      const { product, size } = action.payload;
      const existingItem = state.items.find(
        item => item.product === product && item.size === size
      );

      if (existingItem) {
        state.totalQuantity -= existingItem.qty;
        state.totalAmount -= existingItem.qty * existingItem.price;
        state.items = state.items.filter(
          item => !(item.product === product && item.size === size)
        );
      }
    },

    updateQuantity: (state, action) => {
      const { product, size, qty } = action.payload;
      const existingItem = state.items.find(
        item => item.product === product && item.size === size
      );

      if (existingItem && qty > 0) {
        const difference = qty - existingItem.qty;
        existingItem.qty = qty;
        state.totalQuantity += difference;
        state.totalAmount += difference * existingItem.price;
      }
    },

    clearCart: (state) => {
      state.items = [];
      state.totalAmount = 0;
      state.totalQuantity = 0;
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart, setCart } = cartSlice.actions;
export default cartSlice.reducer;
