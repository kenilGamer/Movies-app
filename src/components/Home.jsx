/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useMemo, useCallback, useRef } from 'react'
import Sidenav from '../partials/sidenav'
import Topnev from '../partials/topnev'
import axios from '../utils/axios'
import Headers from '../partials/headers'
import Horizontalcrads from '../partials/Horizontalcrads'
import Dropdown from '../partials/Dropdown'
import Loading from './Loading'
import { RiH1 } from 'react-icons/ri'

const Home = React.memo(() => {
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const [wallpaper, setWallpaper] = useState(null);
  const [trending, setTrending] = useState(null);
  const [category, setCategory] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const wallpaperAbortRef = useRef(null);
  const trendingAbortRef = useRef(null);

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
    // Cancel previous request if exists
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

  // Initial load - fetch wallpaper once
  useEffect(() => {
    if (!wallpaper) {
      getHeaderWallpaper();
    }
  }, [wallpaper, getHeaderWallpaper]);

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

  return (
    <>
      <Sidenav />
      <div className={containerClass}>
        <Topnev />
        <Headers data={wallpaper} />
        <div className="mt-4 sm:mt-8 flex flex-col sm:flex-row justify-between px-4 sm:px-[3%] items-center gap-3 sm:gap-4 mb-4 sm:mb-6 animate-fadeIn">
          <h1 className="text-2xl sm:text-3xl md:text-4xl uppercase text-center font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent tracking-wide">
            Trendings
          </h1>
          <div className="w-full sm:w-auto">
            <Dropdown title="filter" options={["tv", "movie", "all"]} func={handleCategoryChange} />
          </div>
        </div>
        <div className="animate-fadeIn">
          <Horizontalcrads data={trending} />
        </div>
      </div>
    </>
  );
});

Home.displayName = 'Home';

export default Home
