import { configureStore } from '@reduxjs/toolkit'
import  movieReducer  from './reducers/MovieSlice'
import tvReducer from './reducers/tvSlice'
import personReducer from './reducers/personSlice'

const reducers = {
  movie: movieReducer,
  tv: tvReducer,
  person: personReducer
}

export const store = configureStore({
  reducer: reducers
})