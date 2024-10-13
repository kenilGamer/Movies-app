import { createSlice } from '@reduxjs/toolkit'

const initialState = { info: null }
export const tvSlice = createSlice({
  name: 'tv',
  initialState,
  reducers: {
    loadtv: (state, { payload }) => { state.info = payload },
    removetv: (state) => { state.info = null },
  },
})

export const { loadtv, removetv } = tvSlice.actions
export default tvSlice.reducer