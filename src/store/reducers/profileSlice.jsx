import { createSlice } from "@reduxjs/toolkit";

const profileSlice = createSlice({
  name: "profile",
  initialState: {
    profile: null,
    error: null,
  },
  reducers: {
    setProfile: (state, action) => {
      state.profile = action.payload;
      state.error = null;
    },
    setError: (state, action) => {
      console.log(action.payload);
      localStorage.removeItem("token");
      state.profile = null;
      state.error = action.payload;
    },
  },
});

export const { setProfile, setError } = profileSlice.actions;
export default profileSlice.reducer;
