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
        if (import.meta.env.DEV) {
          console.error('Search error:', error);
        }
        setSearchResults([]);
      }
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      getSearchResults();
    }, 300); // Debounce search

    return () => {
      clearTimeout(timeoutId);
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [query]);

  return (
    <div className="w-full h-[10vh] relative flex mx-auto items-center justify-center">
      <div className="flex sm:items-center md:min-w-[40%] max-sm:w-[72vw] mx-auto max-sm:absolute max-md:w-[70vw] relative group">
        <input
          onChange={(e) => setQuery(e.target.value)}
          value={query}
          className="max-sm:px-5 py-4 md:px-16 mt-5 outline-none text-zinc-200 font2 bg-[#20164d] rounded-full text-xl md:mx-1 flex items-center mx-auto justify-center shadow-md shadow-[#000033] transition-all duration-300 focus:shadow-lg focus:shadow-indigo-500/50 focus:ring-2 focus:ring-indigo-500/50 w-full pr-12"
          type="search"
          name="search"
          placeholder="Search anything..."
        />
        <RiSearchEyeLine className="text-3xl md:mt-5 mt-8 text-zinc-400 absolute right-4 md:right-6 pointer-events-none transition-colors duration-300 group-focus-within:text-indigo-400" />
      </div>
      <div className="absolute right-4 md:right-6 mt-5 flex items-center gap-4">
        <ThemeToggle />
        <NotificationBell />
      </div>
      {query.length > 0 && (
        <div className="min-w-[40%] rounded-xl z-20 max-h-64 absolute top-[120%] py-3 px-2 bg-[#111] backdrop-blur-sm bg-opacity-95 gap-2 flex flex-col overflow-auto shadow-2xl shadow-black/50 border border-zinc-800 animate-fadeIn">
          {searchResults.length > 0 ? (
            searchResults.map((result, index) => (
              <Link
                to={`/${result.media_type || "title"}/datails/${result.id}`}
                key={index}
                className="hover:bg-[#6556cd] min-h-[15vh] overflow-hidden duration-300 hover:border-none p-4 flex items-center justify-between px-6 border-[1px] border-zinc-700 rounded-lg w-full transform transition-all hover:scale-[1.02] hover:shadow-lg group"
                onClick={() => setQuery("")}
              >
                <span className="max-sm:text-xs text-zinc-300 group-hover:text-white transition-colors duration-300 flex-1 truncate mr-4">
                  {result.title || result.original_name || result.original_title}
                </span>
                <img
                  src={`https://image.tmdb.org/t/p/original/${result.poster_path || result.backdrop_path || result.profile_path}`}
                  className="md:w-[10vw] max-sm:w-[20vw] rounded-lg overflow-hidden object-cover h-full max-h-[12vh] transition-transform duration-300 group-hover:scale-110"
                  alt={result.title || result.original_name || result.original_title}
                  loading="lazy"
                />
              </Link>
            ))
          ) : (
            <div className="text-center py-8 text-zinc-400">
              No results found
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Topnev;
