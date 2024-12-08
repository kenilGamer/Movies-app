import React, { useEffect, useState } from "react";
import { RiSearchEyeLine } from "react-icons/ri";
import { IoCloseSharp } from "react-icons/io5";
import { Link } from "react-router-dom";
import axios from "../utils/axios";
import { FaLeaf } from "react-icons/fa";

function Topnev({ left }) {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const getSearchResults = async () => {
    try {
      const response = await axios.get(`/search/multi?query=${query}`);
      setSearchResults(response.data.results);
      console.log("Search results", response.data.results);
      
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getSearchResults();
  }, [query]);

  return (
    <div className="w-full h-[10vh] relative flex sm:items-center justify-center">
      <div className="flex sm:items-center md:min-w-[40%] max-sm:w-[50vw] max-sm:absolute max-md:w-[70vw]">
        <input
          onChange={(e) => setQuery(e.target.value)}
          value={query}
          className="max-sm:px-5 py-4 md:px-16 mt-5 outline-none text-zinc-200 font2 bg-[#20164d] rounded-full text-xl md:mx-1 flex items-center justify-center shadow-md shadow-[#000033]"
          type="search"
          name="search"
          placeholder="Search anything"
        />
        <RiSearchEyeLine className="text-3xl mt-5 text-zinc-400 -ml-16" />
      </div>
      {query.length > 0 && (
        <div className="min-w-[40%] rounded-xl z-20 max-h-52 absolute top-[120%] py-3 px-1 bg-[#111] gap-2 flex flex-col overflow-auto">
          {searchResults.map((result, index) => (
            <Link
              to={`/${result.media_type || "title"}/datails/${result.id}`}
              key={index}
              className="hover:bg-[#6556cd] min-h-[15vh] overflow-hidden duration-500 hover:border-none p-4 flex items-center justify-between px-10 border-[1px] rounded-full w-full"
            >
              <span className="max-sm:text-xs">
                {result.title || result.original_name || result.original_title}
              </span>
              <img
                src={`https://image.tmdb.org/t/p/original/${result.poster_path || result.backdrop_path || result.profile_path}`}
                className="md:w-[10vw] max-sm:w-[20vw] rounded-xl overflow-hidden"
                alt={result.title || result.original_name || result.original_title}
              />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default Topnev;
