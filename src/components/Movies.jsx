import React, { useEffect, useState, useCallback, useRef, useMemo } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import Card from "../partials/Card";
import Dropdown from "../partials/Dropdown";
import Topnev from "../partials/topnev";
import AdvancedFilters from "./AdvancedFilters";
import axios from "../utils/axios";
import { useNavigate } from "react-router-dom";
import Loading from "./Loading";
import { FaLongArrowAltLeft } from "react-icons/fa";
import { useDebounce } from "../utils/useDebounce";

const Movies = React.memo(() => {
  document.title = "Godcrfts | Movies";
  const navigate = useNavigate();
  const [category, setCategory] = useState("now_playing");
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState({});
  const [useFilters, setUseFilters] = useState(false);
  const abortControllerRef = useRef(null);
  
  // Debounce category changes to prevent rapid API calls
  const debouncedCategory = useDebounce(category, 300);
  
  const fetchMovies = useCallback(async (currentPage = page, currentCategory = category, currentFilters = filters) => {
    // Cancel previous request if exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    abortControllerRef.current = new AbortController();
    setIsLoading(true);
    
    try {
      let data;
      if (useFilters && Object.keys(currentFilters).length > 0) {
        // Use discover endpoint with filters
        const params = {
          page: currentPage,
          sort_by: currentFilters.sortBy || 'popularity.desc',
        };
        if (currentFilters.genres && currentFilters.genres.length > 0) {
          params.with_genres = currentFilters.genres.join(',');
        }
        if (currentFilters.yearMin) {
          params['primary_release_date.gte'] = `${currentFilters.yearMin}-01-01`;
        }
        if (currentFilters.yearMax) {
          params['primary_release_date.lte'] = `${currentFilters.yearMax}-12-31`;
        }
        if (currentFilters.ratingMin !== undefined) {
          params['vote_average.gte'] = currentFilters.ratingMin;
        }
        if (currentFilters.ratingMax !== undefined) {
          params['vote_average.lte'] = currentFilters.ratingMax;
        }
        if (currentFilters.language) {
          params.with_original_language = currentFilters.language;
        }
        const response = await axios.get('/discover/movie', {
          params,
          signal: abortControllerRef.current.signal
        });
        data = response.data;
      } else {
        // Use regular category endpoint
        const response = await axios.get(`/movie/${currentCategory}?language=en-US&page=${currentPage}`, {
          signal: abortControllerRef.current.signal
        });
        data = response.data;
      }
      
      if (data.results && data.results.length > 0) {
        if (currentPage === 1) {
          setMovies(data.results);
        } else {
          setMovies(prevState => [...prevState, ...data.results]);
        }
        setPage(currentPage + 1);
        setHasMore(data.page < data.total_pages);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      if (error.name !== 'CanceledError' && error.code !== 'ERR_CANCELED') {
        console.error("Error fetching movies: ", error);
        setHasMore(false);
      }
    } finally {
      setIsLoading(false);
    }
  }, [category, page, filters, useFilters]);

  const refreshMovies = useCallback(() => {
    setPage(1);
    setMovies([]);
    setHasMore(true);
    fetchMovies(1, category, filters);
  }, [category, filters, fetchMovies]);

  const handleFilterChange = useCallback((newFilters) => {
    setFilters(newFilters);
    const hasActiveFilters = Object.values(newFilters).some(value => {
      if (Array.isArray(value)) return value.length > 0;
      if (typeof value === 'object' && value !== null) {
        return Object.values(value).some(v => v !== '' && v !== 0 && v !== 1900);
      }
      return value !== '' && value !== 'popularity.desc';
    });
    setUseFilters(hasActiveFilters);
  }, []);

  // Handle category change
  useEffect(() => {
    if (debouncedCategory === category) {
      refreshMovies();
    }
  }, [debouncedCategory]);

  // Handle filter changes
  useEffect(() => {
    if (useFilters) {
      refreshMovies();
    }
  }, [filters, useFilters]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Memoize category change handler
  const handleCategoryChange = useCallback((e) => {
    setCategory(e.target.value);
  }, []);

  // Memoize navigation handler
  const handleBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  // Memoize load more function
  const loadMore = useCallback(() => {
    if (!isLoading && hasMore) {
      fetchMovies();
    }
  }, [fetchMovies, isLoading, hasMore]);

  return movies.length > 0 ? (
    <div className="w-full min-h-screen py-3 select-auto animate-fadeIn">
      <div className="w-full flex max-sm:flex-col sm:items-center gap-4 px-[3%] mb-6">
        <h1
          onClick={handleBack}
          className="text-2xl font-semibold hover:text-blue-500 flex items-center text-zinc-400 cursor-pointer transition-colors duration-200 group"
        >
          <FaLongArrowAltLeft className="mr-2 transform transition-transform duration-200 group-hover:-translate-x-1" /> Movies
        </h1>
        <Topnev left={40} />
        {!useFilters && (
          <Dropdown
            title="Category"
            options={["popular", "top_rated", "upcoming", "now_playing"]}
            onChange={handleCategoryChange}
          />
        )}
      </div>
      <div className="px-[3%] mb-6">
        <AdvancedFilters mediaType="movie" onFilterChange={handleFilterChange} />
      </div>
      <InfiniteScroll
        dataLength={movies.length}
        next={loadMore}
        hasMore={hasMore}
        loader={
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            <span className="ml-4 text-zinc-400">Loading more movies...</span>
          </div>
        }
      >
        <Card data={movies} title="movie" />
      </InfiniteScroll>
    </div>
  ) : (
    <Loading />
  );
});

Movies.displayName = 'Movies';

export default Movies;
