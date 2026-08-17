import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice/auth';
import shopReducer from './shopSlice/ownerShopSlice';
import locationReducer from './locationSlice/location';
import itemReducer from './itemSlice/itemSlice';
import cartItemReducer from './cartItemSlice/cartItemSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    owner: shopReducer,
    location: locationReducer,
    shopItem: itemReducer,
    cartItem: cartItemReducer,
  },
});

export default store;


