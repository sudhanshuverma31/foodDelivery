import {createSlice} from '@reduxjs/toolkit'


interface OwnerShopState {
  ownerShopData: any | null;
}

const initialState: OwnerShopState = {
  ownerShopData: null
};

const ownerShopSlice = createSlice({
  name: 'ownerShop',
  initialState,
  reducers: {
    setOwnerShopData: (state, action) => {
      state.ownerShopData = action.payload;
    }
  }
});

export const { setOwnerShopData } = ownerShopSlice.actions;
export default ownerShopSlice.reducer;