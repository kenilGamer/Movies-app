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
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button 
            onClick={() => {
              setError(null);
              getTrending();
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Sidenav />
      <div className={containerClass}>
        <Topnev />
        <Headers data={wallpaper} />
        <div className="mt-8 flex justify-between p-3 max-sm:flex-col items-center gap-4 mb-6">
          <h1 className="text-3xl md:text-4xl uppercase text-center font-bold text-white tracking-wide">
            Trendings
          </h1>
          <Dropdown title="filter" options={["tv", "movie", "all"]} func={handleCategoryChange} />
        </div>
        <Horizontalcrads data={trending} />
      </div>
    </>
  );
});

Home.displayName = 'Home';

export default Home
