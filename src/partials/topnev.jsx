import React, { useEffect, useState, useRef } from "react";
import { RiSearchEyeLine } from "react-icons/ri";
import { IoCloseSharp } from "react-icons/io5";
import { Link } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../utils/config";
import { FaLeaf } from "react-icons/fa";
import NotificationBell from "../components/NotificationBell.jsx";
import ThemeToggle from "../components/ThemeToggle.jsx";

function Topnev({ left }) {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const abortControllerRef = useRef(null);
  const timeoutRef = useRef(null);

  const getSearchResults = async () => {
    if (!query || query.trim().length === 0) {
      setSearchResults([]);
      return;
    }

    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    try {
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      
      const response = await axios.get(`${API_BASE_URL}/api/search`, {
        params: { query: query.trim() },
        headers,
        signal: abortControllerRef.current.signal
      });
      setSearchResults(response.data.results || []);
    } catch (error) {
      if (error.name !== 'CanceledError' && error.code !== 'ERR_CANCELED') {
        // Silently handle errors in topnav search - don't show toasts
        if (import.meta.env.DEV) {
          console.error('Topnav search error:', error);
        }
        setSearchResults([]);
      }
    }
  };

  useEffect(() => {
    // Debounce search to prevent too many requests
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      getSearchResults();
    }, 500); // 500ms debounce

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [query]);

  return (
    <div className="w-full h-[10vh] relative flex mx-auto items-center justify-center px-2 sm:px-4">
      <div className="flex-1 max-w-2xl relative">
        <div className="relative group">
          <input
            onChange={(e) => setQuery(e.target.value)}
            value={query}
            className="w-full px-4 sm:px-6 py-3 sm:py-4 text-base sm:text-lg outline-none text-zinc-200 bg-[#20164d] rounded-full shadow-md shadow-[#000033] transition-all duration-300 focus:shadow-lg focus:shadow-indigo-500/50 focus:ring-2 focus:ring-indigo-500/50 pr-12 sm:pr-14"
            type="search"
            name="search"
            placeholder="Search movies, TV shows..."
            autoComplete="off"
          />
          <RiSearchEyeLine className="text-xl sm:text-2xl text-zinc-400 absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 pointer-events-none transition-colors duration-300 group-focus-within:text-indigo-400" />
        </div>
        
        {/* Search Results Dropdown */}
        {query.length > 0 && (
          <div className="w-full sm:w-auto min-w-[300px] sm:min-w-[40%] max-w-[90vw] sm:max-w-[600px] rounded-xl z-[9999] max-h-[70vh] absolute top-full left-0 mt-2 py-3 px-2 bg-[#111] backdrop-blur-md bg-opacity-95 gap-2 flex flex-col overflow-y-auto shadow-2xl shadow-black/50 border border-zinc-800 animate-fadeIn">
          {searchResults.length > 0 ? (
            <>
              {searchResults.slice(0, 8).map((result, index) => (
                <Link
                  to={`/${result.media_type || "movie"}/datails/${result.id}`}
                  key={`${result.id}-${index}`}
                  className="hover:bg-[#6556cd]/30 overflow-hidden duration-300 p-3 sm:p-4 flex items-center gap-3 border-b border-zinc-800/50 last:border-0 rounded-lg transition-all hover:scale-[1.01] group"
                  onClick={() => setQuery("")}
                >
                  <img
                    src={
                      result.poster_path || result.backdrop_path || result.profile_path
                        ? `https://image.tmdb.org/t/p/w200/${result.poster_path || result.backdrop_path || result.profile_path}`
                        : "/noimage.jpeg"
                    }
                    className="w-16 h-20 sm:w-20 sm:h-28 rounded-lg object-cover flex-shrink-0 group-hover:scale-105 transition-transform"
                    alt={result.title || result.original_name || result.original_title}
                    loading="lazy"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm sm:text-base font-semibold text-zinc-300 group-hover:text-white transition-colors truncate">
                      {result.title || result.original_name || result.original_title}
                    </h3>
                    <p className="text-xs sm:text-sm text-zinc-500 mt-1 capitalize">
                      {result.media_type || 'movie'}
                    </p>
                    {result.release_date && (
                      <p className="text-xs text-zinc-600 mt-1">
                        {new Date(result.release_date).getFullYear()}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
              {searchResults.length > 8 && (
                <Link
                  to={`/search?q=${encodeURIComponent(query)}`}
                  className="block text-center py-3 text-indigo-400 hover:text-indigo-300 font-semibold border-t border-zinc-800 text-sm"
                  onClick={() => setQuery("")}
                >
                  View all {searchResults.length} results →
                </Link>
              )}
            </>
          ) : (
            <div className="text-center py-8 px-4">
              <div className="text-4xl mb-2">🔍</div>
              <p className="text-zinc-400 text-sm sm:text-base">No results found</p>
              <Link
                to={`/search?q=${encodeURIComponent(query)}`}
                className="mt-3 inline-block text-indigo-400 hover:text-indigo-300 text-sm font-semibold"
                onClick={() => setQuery("")}
              >
                Try advanced search →
              </Link>
            </div>
          )}
          </div>
        )}
      </div>
      
      <div className="absolute right-2 sm:right-4 flex items-center gap-2 sm:gap-4">
        <ThemeToggle />
        <NotificationBell />
      </div>
    </div>
  );
}

export default Topnev;
