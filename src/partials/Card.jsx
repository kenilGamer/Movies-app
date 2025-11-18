import React from "react";
import { Link } from "react-router-dom";
import noimage from "/noimage.jpeg";

function Card({ data, title }) {
  return (
    <div className="w-full px-2 sm:px-[3%] mt-6 sm:mt-10">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-6">
        {data.map((c, i) => (
          <Link 
            key={i} 
            to={`/${c.media_type || title}/datails/${c.id}`} 
            className="group cursor-pointer transform transition-all duration-300 hover:scale-105 active:scale-95"
          >
            <div className="relative overflow-hidden rounded-lg sm:rounded-xl shadow-lg shadow-black/50 group-hover:shadow-2xl group-hover:shadow-indigo-500/20 transition-all duration-300">
              <div className="aspect-[2/3] w-full relative">
                <img
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  src={c.poster_path || c.backdrop_path || c.profile_path 
                    ? `https://image.tmdb.org/t/p/w500/${c.poster_path || c.backdrop_path || c.profile_path}` 
                    : noimage}
                  alt={c.title || c.original_name || c.original_title || "Movie poster"}
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                {c.vote_average && (
                  <div className="absolute top-2 right-2 sm:top-3 sm:right-3 w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center bg-yellow-500/90 backdrop-blur-sm rounded-full shadow-lg transform transition-all duration-300 group-hover:scale-110 group-hover:bg-yellow-400">
                    <span className="text-xs sm:text-sm font-bold text-black">
                      {(c.vote_average * 10).toFixed(0)}<sup className="text-[0.6em]">%</sup>
                    </span>
                  </div>
                )}
              </div>
              <h1 className="text-xs sm:text-sm md:text-base font-semibold text-zinc-300 mt-2 sm:mt-3 px-1 text-center transition-colors duration-300 group-hover:text-white line-clamp-2 min-h-[2.5em]">
                {c.title || c.original_name || c.original_title}
              </h1>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Card;
