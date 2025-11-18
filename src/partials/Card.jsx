import React from "react";
import { Link } from "react-router-dom";
import noimage from "/noimage.jpeg";

function Card({ data, title }) {
  
  return (
    <div className="flex bg-[#0f0b20] w-[100vw] h-full sm:px-[3%] mt-10 justify-between flex-wrap gap-4">
      {data.map((c, i) => (
        <Link 
          key={i} 
          to={`/${c.media_type || title}/datails/${c.id}`} 
          className="relative w-full sm:w-[22vw] m-2 group cursor-pointer transform transition-all duration-300 hover:scale-105 hover:z-10"
        >
          <div className="relative overflow-hidden rounded-lg shadow-xl shadow-black/50 group-hover:shadow-2xl group-hover:shadow-black/70 transition-all duration-300">
            <img
              className="min-h-[40vh] w-full object-cover transition-transform duration-500 group-hover:scale-110"
              src={ c.poster_path || c.backdrop_path || c.profile_path ? `https://image.tmdb.org/t/p/original/${c.poster_path || c.backdrop_path || c.profile_path}` : noimage}
              alt={c.titlel || c.original_name || c.original_title || "Movie poster"}
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            {c.vote_average && (
              <div className="absolute top-3 right-3 text-white w-[7vh] h-[7vh] flex items-center justify-center bg-yellow-700/90 backdrop-blur-sm rounded-full shadow-lg transform transition-all duration-300 group-hover:scale-110 group-hover:bg-yellow-600">
                <span className="text-sm font-bold">{(c.vote_average * 10).toFixed()}<sup className="text-xs">%</sup></span>
              </div>
            )}
          </div>
          <h1 className="text-xl sm:text-2xl text-zinc-400 font-semibold p-3 mb-10 text-center transition-colors duration-300 group-hover:text-white line-clamp-2">
            {c.titlel || c.original_name || c.original_title}
          </h1>
        </Link>
      ))}
    </div>
  );
}

export default Card;
