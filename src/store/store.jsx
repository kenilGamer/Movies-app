import { configureStore } from '@reduxjs/toolkit'
import  movieReducer  from './reducers/MovieSlice'
import tvReducer from './reducers/tvSlice'
import personReducer from './reducers/personSlice'
import profileReducer from './reducers/profileSlice'
const reducers = {
  profile: profileReducer,
  movie: movieReducer,
  tv: tvReducer,
  person: personReducer
}

export const store = configureStore({
  devTools: true,
  reducer: reducers
})