import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './components/Home'
import Trending from './components/Trending'
import Popular from './components/Popular'
import Movies from './components/Movies'
import Tv from './components/Tv'
import People from './components/People'
import Bollywood from './components/Bollywood'
import Watchlist from './components/Watchlist'
import Favorites from './components/Favorites'
import Search from './components/Search'
import Collections from './components/Collections'
import CollectionDetail from './components/CollectionDetail'
import CreateCollection from './components/CreateCollection'
import Notifications from './components/Notifications'
import Premium from './components/premium'
import Moviedatails from './partials/moviedatails'
import Tvdatails from './partials/tvdatails'
import Parsondatails from './partials/parsondatails'
import Trailer from './partials/Trailer'
import NotFound from './components/notfound'
import Sinup from './components/Sinup'
import AuthenticateToken from './components/AuthenticateToken'
import Login from './components/Login'
import Profile from './components/Profile'
import Setting from './components/Setting'
import { ToastContainer } from 'react-toastify';
import MoviePalyer from './partials/MoviePalyer'
import TvPalyer from './partials/Tvplayer'
// import './node_modules/react-toastify/dist/ReactToastify.css';

function App() { 
  return (
    <div className='w-full bg-[#0f0b20] select-none h-screen flex text-white '>
      <ToastContainer />
      <Routes>
        <Route path='/signup' element={<Sinup/>} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<AuthenticateToken><Home /></AuthenticateToken>} />
        <Route path="/profile" element={<AuthenticateToken><Profile /></AuthenticateToken>} />
        <Route path="/trending" element={<AuthenticateToken><Trending /></AuthenticateToken>} />
        <Route path="/popular" element={<AuthenticateToken><Popular /></AuthenticateToken>} />
        <Route path="/movie" element={<AuthenticateToken><Movies /></AuthenticateToken>} />
        <Route path="/bollywood" element={<AuthenticateToken><Bollywood /></AuthenticateToken>} />
        <Route path="/watchlist" element={<AuthenticateToken><Watchlist /></AuthenticateToken>} />
        <Route path="/favorites" element={<AuthenticateToken><Favorites /></AuthenticateToken>} />
        <Route path="/search" element={<AuthenticateToken><Search /></AuthenticateToken>} />
        <Route path="/collections" element={<AuthenticateToken><Collections /></AuthenticateToken>} />
        <Route path="/collections/create" element={<AuthenticateToken><CreateCollection /></AuthenticateToken>} />
        <Route path="/collections/:id" element={<AuthenticateToken><CollectionDetail /></AuthenticateToken>} />
        <Route path="/notifications" element={<AuthenticateToken><Notifications /></AuthenticateToken>} />
        <Route path="/premium" element={<AuthenticateToken><Premium /></AuthenticateToken>} />
        <Route path="/settings" element={<AuthenticateToken><Setting /></AuthenticateToken>} />
        <Route path="/movie/datails/:id" element={<AuthenticateToken><Moviedatails /></AuthenticateToken>}>
          <Route path="/movie/datails/:id/trailer" element={<AuthenticateToken><Trailer /></AuthenticateToken>} />
          <Route path="/movie/datails/:id/moviepalyer" element={<AuthenticateToken><MoviePalyer /></AuthenticateToken>} />
        </Route>
        <Route path="/tv" element={<AuthenticateToken><Tv /></AuthenticateToken>} />
        <Route path="/tv/datails/:id" element={<AuthenticateToken><Tvdatails /></AuthenticateToken>}>
        <Route path="/tv/datails/:id/:epid/:sid/tvpalyer/" element={<AuthenticateToken><TvPalyer /></AuthenticateToken>} />
        </Route>
        <Route path="/people" element={<AuthenticateToken><People /></AuthenticateToken>} />
        <Route path="/People/datails/:id" element={<AuthenticateToken><Parsondatails /></AuthenticateToken>} />
        <Route path="*" element={<NotFound />} />
      </Routes>  
    </div> 
  )
}
export default App