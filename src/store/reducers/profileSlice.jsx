import { createSlice } from "@reduxjs/toolkit";

const profileSlice = createSlice({
  name: "profile",
  initialState: {
    profile: null,
    error: null,
  },
  reducers: {
    /**
     * Sets the profile in the state to the given payload or clears the profile if the
     * payload is null. Clears the error if the payload is not null.
     *
     * @param {Object} state - The current state of the store.
     * @param {Object} action - The action containing the payload to use to set the profile.
     * @param {Object|null} action.payload - The profile data to set or null to clear the profile.
     */
    setProfile: (state, action) => {
      if (!action.payload) {
        state.profile = null;
        state.error = null;
        return;
      }
      state.profile = action.payload;
      state.error = null;
    },
    setError: (state, { payload: error }) => {
      state.profile = null;
      state.error = error;
      state.error = action.payload;
      localStorage.removeItem("token");
    },
  },
});

export const { setProfile, setError } = profileSlice.actions;
export default profileSlice.reducer;
