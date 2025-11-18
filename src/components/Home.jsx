/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useMemo, useCallback, useRef } from 'react'
import { Link } from 'react-router-dom'
import { FaFire, FaArrowRight, FaStar, FaPlay } from 'react-icons/fa'
import Sidenav from '../partials/sidenav'
import Topnev from '../partials/topnev'
import axios from '../utils/axios'
import Headers from '../partials/headers'
import Horizontalcrads from '../partials/Horizontalcrads'
import Card from '../partials/Card'
import Dropdown from '../partials/Dropdown'
import Loading from './Loading'

const Home = React.memo(() => {
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const [wallpaper, setWallpaper] = useState(null);
  const [trending, setTrending] = useState(null);
  const [trendingMovies, setTrendingMovies] = useState(null);
  const [trendingTV, setTrendingTV] = useState(null);
  const [popularMovies, setPopularMovies] = useState(null);
  const [topRated, setTopRated] = useState(null);
  const [category, setCategory] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const wallpaperAbortRef = useRef(null);
  const trendingAbortRef = useRef(null);
  const moviesAbortRef = useRef(null);
  const tvAbortRef = useRef(null);
  const popularAbortRef = useRef(null);
  const topRatedAbortRef = useRef(null);

  const setIsMenu = useCallback(() => setIsMenuOpen(prevState => !prevState), []);

  const getHeaderWallpaper = useCallback(async () => {
    // Cancel previous request if exists
    if (wallpaperAbortRef.current) {
      wallpaperAbortRef.current.abort();
    }
    
    wallpaperAbortRef.current = new AbortController();
    
    try {
      const { data } = await axios.get(`/trending/all/day`, {
        signal: wallpaperAbortRef.current.signal
      });
      
      if (data.results && data.results.length > 0) {
        const randomIndex = Math.floor(Math.random() * data.results.length);
        setWallpaper(data.results[randomIndex]);
      }
    } catch (error) {
      if (error.name !== 'CanceledError' && error.code !== 'ERR_CANCELED') {
        console.error('Error fetching wallpaper:', error);
        setError('Failed to load wallpaper');
      }
    }
  }, []);

  const getTrending = useCallback(async () => {
    if (trendingAbortRef.current) {
      trendingAbortRef.current.abort();
    }
    
    trendingAbortRef.current = new AbortController();
    setIsLoading(true);
    
    try {
      const { data } = await axios.get(`/trending/${category}/day`, {
        signal: trendingAbortRef.current.signal
      });
      if (data.results) {
        setTrending(data.results);
        setError(null);
      }
    } catch (error) {
      if (error.name !== 'CanceledError' && error.code !== 'ERR_CANCELED') {
        console.error('Error fetching trending:', error);
        setError('Failed to load trending content');
      }
    } finally {
      setIsLoading(false);
    }
  }, [category]);

  const getTrendingMovies = useCallback(async () => {
    if (moviesAbortRef.current) {
      moviesAbortRef.current.abort();
    }
    moviesAbortRef.current = new AbortController();
    
    try {
      const { data } = await axios.get('/trending/movie/day', {
        signal: moviesAbortRef.current.signal
      });
      if (data.results) {
        setTrendingMovies(data.results.slice(0, 10));
      }
    } catch (error) {
      if (error.name !== 'CanceledError' && error.code !== 'ERR_CANCELED') {
        console.error('Error fetching trending movies:', error);
      }
    }
  }, []);

  const getTrendingTV = useCallback(async () => {
    if (tvAbortRef.current) {
      tvAbortRef.current.abort();
    }
    tvAbortRef.current = new AbortController();
    
    try {
      const { data } = await axios.get('/trending/tv/day', {
        signal: tvAbortRef.current.signal
      });
      if (data.results) {
        setTrendingTV(data.results.slice(0, 10));
      }
    } catch (error) {
      if (error.name !== 'CanceledError' && error.code !== 'ERR_CANCELED') {
        console.error('Error fetching trending TV:', error);
      }
    }
  }, []);

  const getPopularMovies = useCallback(async () => {
    if (popularAbortRef.current) {
      popularAbortRef.current.abort();
    }
    popularAbortRef.current = new AbortController();
    
    try {
      const { data } = await axios.get('/movie/popular', {
        signal: popularAbortRef.current.signal
      });
      if (data.results) {
        setPopularMovies(data.results.slice(0, 12));
      }
    } catch (error) {
      if (error.name !== 'CanceledError' && error.code !== 'ERR_CANCELED') {
        console.error('Error fetching popular movies:', error);
      }
    }
  }, []);

  const getTopRated = useCallback(async () => {
    if (topRatedAbortRef.current) {
      topRatedAbortRef.current.abort();
    }
    topRatedAbortRef.current = new AbortController();
    
    try {
      const { data } = await axios.get('/movie/top_rated', {
        signal: topRatedAbortRef.current.signal
      });
      if (data.results) {
        setTopRated(data.results.slice(0, 12));
      }
    } catch (error) {
      if (error.name !== 'CanceledError' && error.code !== 'ERR_CANCELED') {
        console.error('Error fetching top rated:', error);
      }
    }
  }, []);

  // Initial load - fetch all data
  useEffect(() => {
    if (!wallpaper) {
      getHeaderWallpaper();
    }
    getTrendingMovies();
    getTrendingTV();
    getPopularMovies();
    getTopRated();
  }, [getHeaderWallpaper, getTrendingMovies, getTrendingTV, getPopularMovies, getTopRated]);

  // Fetch trending when category changes
  useEffect(() => {
    getTrending();
    
    // Cleanup function to cancel requests on unmount
    return () => {
      if (trendingAbortRef.current) {
        trendingAbortRef.current.abort();
      }
      if (wallpaperAbortRef.current) {
        wallpaperAbortRef.current.abort();
      }
      if (moviesAbortRef.current) {
        moviesAbortRef.current.abort();
      }
      if (tvAbortRef.current) {
        tvAbortRef.current.abort();
      }
      if (popularAbortRef.current) {
        popularAbortRef.current.abort();
      }
      if (topRatedAbortRef.current) {
        topRatedAbortRef.current.abort();
      }
    };
  }, [category, getTrending]);

  // Memoize category change handler
  const handleCategoryChange = useCallback((e) => {
    setCategory(e.target.value);
  }, []);

  // Memoize computed values
  const containerClass = useMemo(() => 
    `${isMenuOpen ? `w-[100%]` : `md:w-[100%]`} h-full overflow-auto overflow-x-hidden`,
    [isMenuOpen]
  );

  // Show loading only if we're actually loading and have no data
  if (isLoading && !trending && !error) return <Loading />;
  
  // Show error state if there's an error and no data
  if (error && !trending) {
    return (
      <>
        <Sidenav />
        <div className="w-full h-full flex items-center justify-center bg-[#0f0b20]">
          <div className="text-center p-8 bg-zinc-900/50 backdrop-blur-sm rounded-xl border border-red-500/20 max-w-md mx-4">
            <div className="mb-4 text-6xl">⚠️</div>
            <h2 className="text-2xl font-bold text-white mb-2">Oops! Something went wrong</h2>
            <p className="text-red-400 mb-6">{error}</p>
            <button 
              onClick={() => {
                setError(null);
                setIsLoading(true);
                getHeaderWallpaper();
                getTrending();
              }}
              className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Try Again
            </button>
          </div>
        </div>
      </>
    );
  }

  const SectionHeader = ({ title, icon, link, linkText = "View All" }) => (
    <div className="flex items-center justify-between mb-4 sm:mb-6 px-4 sm:px-[3%]">
      <div className="flex items-center gap-3">
        {icon && <span className="text-2xl sm:text-3xl">{icon}</span>}
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          {title}
        </h2>
      </div>
      {link && (
        <Link
          to={link}
          className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 transition-colors duration-300 group text-sm sm:text-base font-medium"
        >
          <span>{linkText}</span>
          <FaArrowRight className="transform transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      )}
    </div>
  );

  return (
    <>
      <Sidenav />
      <div className={containerClass}>
        <Topnev />
        
        {/* Hero Section */}
        <Headers data={wallpaper} />
        
        {/* Trending Section - Main */}
        <div className="mt-8 sm:mt-12 mb-8 sm:mb-12 animate-fadeIn">
          <div className="flex flex-col sm:flex-row justify-between px-4 sm:px-[3%] items-center gap-3 sm:gap-4 mb-6">
            <div className="flex items-center gap-3">
              <FaFire className="text-3xl sm:text-4xl text-orange-500 animate-pulse" />
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 bg-clip-text text-transparent tracking-wide">
                Trending Now
              </h1>
            </div>
            <div className="w-full sm:w-auto">
              <Dropdown title="Filter" options={["all", "movie", "tv"]} func={handleCategoryChange} />
            </div>
          </div>
          {trending && trending.length > 0 && (
            <div className="animate-fadeIn">
              <Horizontalcrads data={trending} />
            </div>
          )}
        </div>

        {/* Trending Movies Section */}
        {trendingMovies && trendingMovies.length > 0 && (
          <div className="mb-8 sm:mb-12 animate-fadeIn">
            <SectionHeader 
              title="Trending Movies" 
              icon={<FaFire className="text-orange-500" />}
              link="/trending"
            />
            <Horizontalcrads data={trendingMovies} />
          </div>
        )}

        {/* Trending TV Shows Section */}
        {trendingTV && trendingTV.length > 0 && (
          <div className="mb-8 sm:mb-12 animate-fadeIn">
            <SectionHeader 
              title="Trending TV Shows" 
              icon={<FaFire className="text-orange-500" />}
              link="/trending"
            />
            <Horizontalcrads data={trendingTV} />
          </div>
        )}

        {/* Popular Movies Section */}
        {popularMovies && popularMovies.length > 0 && (
          <div className="mb-8 sm:mb-12 animate-fadeIn">
            <SectionHeader 
              title="Popular Movies" 
              icon={<FaStar className="text-yellow-400" />}
              link="/popular"
            />
            <Card data={popularMovies} title="movie" />
            <div className="text-center mt-6 px-4">
              <Link
                to="/popular"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-semibold shadow-lg shadow-indigo-500/50 transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
              >
                <span>View All Popular</span>
                <FaArrowRight />
              </Link>
            </div>
          </div>
        )}

        {/* Top Rated Section */}
        {topRated && topRated.length > 0 && (
          <div className="mb-8 sm:mb-12 animate-fadeIn">
            <SectionHeader 
              title="Top Rated Movies" 
              icon={<FaStar className="text-yellow-400" />}
              link="/movie"
            />
            <Card data={topRated} title="movie" />
            <div className="text-center mt-6 px-4">
              <Link
                to="/movie"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-semibold shadow-lg shadow-indigo-500/50 transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
              >
                <span>View All Movies</span>
                <FaArrowRight />
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
});

Home.displayName = 'Home';

export default Home
