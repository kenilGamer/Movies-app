import { createSlice } from '@reduxjs/toolkit'

const initialState = {
 info: null
}
export const tvSlice = createSlice({
    name: 'tv',
    initialState,
    reducers: {
      loadtv: (state,actions) => {
        state.info = actions.payload;
      },
      removetv: (state,actions) => {
        state.info = null;
      }
    },
  })
  
  // Action creators are generated for each case reducer function
  export const { loadtv,removetv } = tvSlice.actions
  
  export default tvSlice.reducer