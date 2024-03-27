import { createSlice } from '@reduxjs/toolkit'

const initialState = {
 info: null
}
export const peopleSlice = createSlice({
    name: 'people',
    initialState,
    reducers: {
      loadpeople: (state,actions) => {
        state.info = actions.payload;
      },
      removepeople: (state,actions) => {
        state.info = null;
      }
    },
  })
  
  // Action creators are generated for each case reducer function
  export const { loadpeople,removepeople } = peopleSlice.actions
  
  export default peopleSlice.reducer