import { createSlice } from '@reduxjs/toolkit';

interface LocationState {
  city: string;
  lat: number | null;
  lng: number | null;
}

const initialState: LocationState = {
  city: 'Noida',
  lat: null,
  lng: null,
};

const locationSlice = createSlice({
  name: 'location',
  initialState,
  reducers: {
    setLocation: (state, action) => {
      state.city = action.payload.city ?? state.city;
      state.lat = action.payload.lat ?? state.lat;
      state.lng = action.payload.lng ?? state.lng;
    },
  },
});

export const { setLocation } = locationSlice.actions;
export default locationSlice.reducer;
