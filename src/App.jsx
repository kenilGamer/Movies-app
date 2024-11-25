import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Trending from './components/Trending';
import Popular from './components/Popular';
import Movies from './components/Movies';
import Tv from './components/Tv';
import People from './components/People';
import MovieDetails from './partials/MovieDetails';
import TvDetails from './partials/TvDetails';
import PersonDetails from './partials/PersonDetails';
import Trailer from './partials/Trailer';
import NotFound from './components/notfound';
import Signup from './components/Signup';
import AuthenticateToken from './components/AuthenticateToken';
import Login from './components/Login';
import Profile from './components/Profile';
import Setting from './components/Setting';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <div className="w-full bg-[#0f0b20] select-none h-full min-h-screen flex text-white">
      <ToastContainer />
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<AuthenticateToken><Home /></AuthenticateToken>} />
        <Route path="/profile" element={<AuthenticateToken><Profile /></AuthenticateToken>} />
        <Route path="/trending" element={<AuthenticateToken><Trending /></AuthenticateToken>} />
        <Route path="/popular" element={<AuthenticateToken><Popular /></AuthenticateToken>} />
        <Route path="/movie" element={<AuthenticateToken><Movies /></AuthenticateToken>} />
        <Route path="/settings" element={<AuthenticateToken><Setting /></AuthenticateToken>} />
        <Route path="/movie/details/:id" element={<AuthenticateToken><MovieDetails /></AuthenticateToken>}>
          <Route path="trailer" element={<AuthenticateToken><Trailer /></AuthenticateToken>} />
        </Route>
        <Route path="/tv" element={<AuthenticateToken><Tv /></AuthenticateToken>} />
        <Route path="/tv/details/:id" element={<AuthenticateToken><TvDetails /></AuthenticateToken>} />
        <Route path="/people" element={<AuthenticateToken><People /></AuthenticateToken>} />
        <Route path="/people/details/:id" element={<AuthenticateToken><PersonDetails /></AuthenticateToken>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
