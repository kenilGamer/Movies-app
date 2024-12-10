// profileSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  profile: null,
  settings: null,
  error: null,
  loading: false,
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    setProfile: (state, action) => {
      state.profile = action.payload.profile;
      state.settings = action.payload.settings;
      state.loading = false;  // stop loading when profile is set
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;  // stop loading on error
    },
    setLoading: (state) => {
      state.loading = true;  // start loading
    },
  },
});

export const { setProfile, setError, setLoading } = profileSlice.actions;
export default profileSlice.reducer;
