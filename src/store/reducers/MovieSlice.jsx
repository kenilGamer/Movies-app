import { createSlice } from '@reduxjs/toolkit';

const initialState = { info: null }
export const movieSlice = createSlice({
  name: 'movie',
  initialState,
  reducers: {
    loadmovie: (state, { payload }) => { state.info = payload },
    removemovie: (state) => { state.info = initialState.info },
  },
})

export const { loadmovie, removemovie } = movieSlice.actions
export default movieSlice.reducer
