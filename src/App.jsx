import React, { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import AuthenticateToken from './components/AuthenticateToken';
import NotFound from './components/notfound';
import Loading from './components/Loading';

const Home = lazy(() => import('./components/Home'));
const Trending = lazy(() => import('./components/Trending'));
const Popular = lazy(() => import('./components/Popular'));
const Movies = lazy(() => import('./components/Movies'));
const Tv = lazy(() => import('./components/Tv'));
const People = lazy(() => import('./components/People'));
const Moviedatails = lazy(() => import('./partials/moviedatails'));
const Tvdatails = lazy(() => import('./partials/tvdatails'));
const Parsondatails = lazy(() => import('./partials/parsondatails'));
const Trailer = lazy(() => import('./partials/Trailer'));
const Sinup = lazy(() => import('./components/Sinup'));
const Login = lazy(() => import('./components/Login'));
const Profile = lazy(() => import('./components/Profile'));
const Setting = lazy(() => import('./components/Setting'));
const MoviePalyer = lazy(() => import('./partials/MoviePalyer'));
const TvPalyer = lazy(() => import('./partials/Tvplayer'));

function App() {
  return (
    <div className="w-full bg-[#0f0b20] select-none h-screen flex text-white">
      <ToastContainer />
      <Suspense fallback={<Loading/>}>
        <Routes>
          <Route path='/signup' element={<Sinup />} />
          <Route path='/login' element={<Login />} />
          <Route path='/' element={<AuthenticateToken><Home /></AuthenticateToken>} />
          <Route path='/profile' element={<AuthenticateToken><Profile /></AuthenticateToken>} />
          <Route path='/trending' element={<AuthenticateToken><Trending /></AuthenticateToken>} />
          <Route path='/popular' element={<AuthenticateToken><Popular /></AuthenticateToken>} />
          <Route path='/movie' element={<AuthenticateToken><Movies /></AuthenticateToken>} />
          <Route path='/settings' element={<AuthenticateToken><Setting /></AuthenticateToken>} />
          <Route path='/movie/datails/:id' element={<AuthenticateToken><Moviedatails /></AuthenticateToken>}>
            <Route path='/movie/datails/:id/trailer' element={<AuthenticateToken><Trailer /></AuthenticateToken>} />
            <Route path='/movie/datails/:id/moviepalyer' element={<AuthenticateToken><MoviePalyer /></AuthenticateToken>} />
          </Route>
          <Route path='/tv' element={<AuthenticateToken><Tv /></AuthenticateToken>} />
          <Route path='/tv/datails/:id' element={<AuthenticateToken><Tvdatails /></AuthenticateToken>}>
            <Route path='/tv/datails/:id/:epid/:sid/tvpalyer/' element={<AuthenticateToken><TvPalyer /></AuthenticateToken>} />
          </Route>
          <Route path='/people' element={<AuthenticateToken><People /></AuthenticateToken>} />
          <Route path='/People/datails/:id' element={<AuthenticateToken><Parsondatails /></AuthenticateToken>} />
          <Route path='*' element={<NotFound />} />
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;
