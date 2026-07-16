import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice/auth';
import shopReducer from './shopSlice/ownerShopSlice';
import locationReducer from './locationSlice/location';

const store = configureStore({
  reducer: {
    auth: authReducer,
    owner: shopReducer,
    location: locationReducer,
  },
});

export default store;


