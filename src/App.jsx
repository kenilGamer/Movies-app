/* eslint-disable no-unused-vars */
import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './components/Home'
import Trending from './components/Trending'
import Popular from './components/Popular'
import Movies from './components/Movies'
import Tv from './components/Tv'
import People from './components/People'
import Moviedatails from './partials/moviedatails'
import Tvdatails from './partials/tvdatails'
import Parsondatails from './partials/parsondatails'
import Trailer from './partials/Trailer'
import NotFound from './components/notfound'

function App() {

  return (
    <div className='w-full bg-[#0f0b20] select-none h-screen flex text-white '>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/trending" element={<Trending />} />
        <Route path="/popular" element={<Popular />} />
        <Route path="/movie" element={<Movies />} />
        
        <Route path="/movie/datails/:id" element={<Moviedatails />}>
          <Route
            path="/movie/datails/:id/trailer"
            element={<Trailer />}
          />
        </Route>

        <Route path="/tv" element={<Tv />} />
        <Route path="/tv/datails/:id" element={<Tvdatails />}>
          <Route
              path="/tv/datails/:id/trailer"
              element={<Trailer />}
          />
        </Route>

        <Route path="/people" element={<People />} />
        <Route path="/People/datails/:id" element={<Parsondatails />} />
        <Route path="*" element={<NotFound />} />
      </Routes>  
    </div>
  )
}

export default App
