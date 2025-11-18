import React from "react";
import { Link } from "react-router-dom";
import Dropdown from "./Dropdown";
import noimage from "/noimage.jpeg";

function Horizontalcrads({ data, title }) {
  return (
    <div className="w-full overflow-x-auto pb-4 mb-6 scrollbar-hide">
      <div className="flex gap-3 sm:gap-4 md:gap-6 min-w-max px-2 sm:px-4">
        {data.map((d, i) => (
          <div 
            key={i} 
            className="flex-shrink-0 w-[85vw] sm:w-[45vw] md:w-[35vw] lg:w-[28vw] xl:w-[22vw] group"
          >
            <Link
              to={`/${d.media_type || title}/datails/${d.id}`}
              className="block transform transition-all duration-300 hover:scale-[1.02] active:scale-95"
            >
              <div className="relative overflow-hidden rounded-lg sm:rounded-xl shadow-lg shadow-black/50 group-hover:shadow-xl group-hover:shadow-indigo-500/20 transition-all duration-300">
                <div className="aspect-video w-full relative">
                  <img
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    src={
                      d.backdrop_path || d.poster_path || d.profile_path
                        ? `https://image.tmdb.org/t/p/w780/${d.backdrop_path || d.poster_path || d.profile_path}`
                        : noimage
                    }
                    alt={d.title || d.original_name || d.original_title || "Content poster"}
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent"></div>
                  {d.vote_average && (
                    <div className="absolute top-2 right-2 sm:top-3 sm:right-3 w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center bg-yellow-500/90 backdrop-blur-sm rounded-full shadow-lg">
                      <span className="text-xs sm:text-sm font-bold text-black">
                        {(d.vote_average * 10).toFixed(0)}<sup className="text-[0.6em]">%</sup>
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <h1 className="text-sm sm:text-base md:text-lg font-bold mt-3 sm:mt-4 text-zinc-300 group-hover:text-white transition-colors duration-300 line-clamp-2">
                {d.title || d.original_name || d.original_title}
              </h1>
              {d.overview && (
                <p className="mt-2 text-zinc-400 text-xs sm:text-sm leading-relaxed line-clamp-2 sm:line-clamp-3 group-hover:text-zinc-300 transition-colors duration-300">
                  {d.overview}
                </p>
              )}
            </Link>
            <Link
              to={`/${d.media_type || title}/datails/${d.id}`}
              className="inline-block mt-2 sm:mt-3 text-xs sm:text-sm text-indigo-400 hover:text-indigo-300 font-semibold transition-colors duration-200"
            >
              View Details →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Horizontalcrads;
