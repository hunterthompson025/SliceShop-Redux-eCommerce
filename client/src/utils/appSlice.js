import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  products: [],
  cart: [],
  cartOpen: false,
  categories: [],
  currentCategory: null,
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    UPDATE_PRODUCTS(state, action) {
      // Update products in the state
      state.products = [...action.payload];
    },
    ADD_TO_CART(state, action) {
      // Add a product to the cart
      state.cartOpen = true;
      state.cart.push(action.payload);
    },
    ADD_MULTIPLE_TO_CART(state, action) {
      // Add multiple products to the cart
      state.cart.push(...action.payload);
    },
    UPDATE_CART_QUANTITY(state, action) {
      // Update the quantity of a product in the cart
      const { _id, purchaseQuantity } = action.payload;
      state.cart = state.cart.map((product) => 
        product._id === _id ? { ...product, purchaseQuantity } : product
      );
      state.cartOpen = true;
    },
    REMOVE_FROM_CART(state, action) {
      // Remove a product from the cart
      state.cart = state.cart.filter((product) => product._id !== action.payload);
      state.cartOpen = state.cart.length > 0;
    },
    CLEAR_CART(state) {
      // Clear the cart
      state.cartOpen = false;
      state.cart = [];
    },
    TOGGLE_CART(state) {
      // Toggle the cart open/closed
      state.cartOpen = !state.cartOpen;
    },
   UPDATE_CATEGORIES(state, action) {
      // Update categories in the state
      state.categories = [...action.payload];
    },
    UPDATE_CURRENT_CATEGORY(state, action) {
      // Update the current category
      state.currentCategory = action.payload;
    },
  },
});

export const {
  UPDATE_PRODUCTS,
  ADD_TO_CART,
  ADD_MULTIPLE_TO_CART,
  UPDATE_CART_QUANTITY,
  REMOVE_FROM_CART,
  CLEAR_CART,
  TOGGLE_CART,
  UPDATE_CATEGORIES,
  UPDATE_CURRENT_CATEGORY,
} = appSlice.actions;

export default appSlice.reducer;
