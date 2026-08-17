import  { createSlice } from '@reduxjs/toolkit';

interface ItemState {
  item: any | null;
  items: any[];
}

const initialState: ItemState = {
  item: null,
  items: []
};

const itemSlice = createSlice({
  name: 'shopItem',
  initialState,
    reducers: {
    setShopItem: (state, action) => {
      state.item = action.payload;
      if (state.items) {
        state.items = [...state.items, action.payload];
      } else {
        state.items = [action.payload];
      }
    },
    setShopItems: (state, action) => {
      state.items = action.payload;
    },
    updateShopItem: (state, action) => {
      state.items = state.items.map(item => 
        (item._id === action.payload._id || item.id === action.payload.id) ? action.payload : item
      );
    },
    deleteShopItem: (state, action) => {
      state.items = state.items.filter(item => 
        item._id !== action.payload && item.id !== action.payload
      );
    }
  }
});

export const { setShopItem, setShopItems, updateShopItem, deleteShopItem } = itemSlice.actions;
export default itemSlice.reducer;