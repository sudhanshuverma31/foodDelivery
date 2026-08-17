import { createSlice } from '@reduxjs/toolkit'


interface OwnerShopState {
  ownerShopData: any | null;
  ownerShops: any[];
}

const initialState: OwnerShopState = {
  ownerShopData: null,
  ownerShops: [],
};

const ownerShopSlice = createSlice({
  name: 'ownerShop',
  initialState,
  reducers: {
    setOwnerShopData: (state, action) => {
      const shops = Array.isArray(action.payload) ? action.payload : [action.payload];
      state.ownerShops = shops.filter(Boolean);
      state.ownerShopData = state.ownerShops[0] ?? null;
    },
    clearShopData: (state) => {
      state.ownerShopData = null;
      state.ownerShops = [];
    }
  }
});

export const { setOwnerShopData, clearShopData } = ownerShopSlice.actions;
export default ownerShopSlice.reducer;
