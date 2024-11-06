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
import Sinup from './components/Sinup'
import AuthenticateToken from './components/AuthenticateToken'
import Login from './components/Login'
import Profile from './components/Profile'
function App() { 
  return (
    <div className='w-full bg-[#0f0b20] select-none h-screen flex text-white '>
      <Routes>
        <Route path='/' element={<Sinup/>} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<AuthenticateToken><Home /></AuthenticateToken>} />
        <Route path="/profile" element={<AuthenticateToken><Profile /></AuthenticateToken>} />
        <Route path="/trending" element={<AuthenticateToken><Trending /></AuthenticateToken>} />
        <Route path="/popular" element={<AuthenticateToken><Popular /></AuthenticateToken>} />
        <Route path="/movie" element={<AuthenticateToken><Movies /></AuthenticateToken>} />
        <Route path="/movie/datails/:id" element={<AuthenticateToken><Moviedatails /></AuthenticateToken>}>
          <Route path="/movie/datails/:id/trailer" element={<AuthenticateToken><Trailer /></AuthenticateToken>} />
        </Route>
        <Route path="/tv" element={<AuthenticateToken><Tv /></AuthenticateToken>} />
        <Route path="/tv/datails/:id" element={<AuthenticateToken><Tvdatails /></AuthenticateToken>}>
        </Route>
        <Route path="/people" element={<AuthenticateToken><People /></AuthenticateToken>} />
        <Route path="/People/datails/:id" element={<AuthenticateToken><Parsondatails /></AuthenticateToken>} />
        <Route path="*" element={<NotFound />} />
      </Routes>  
    </div>
  )
}
export default App