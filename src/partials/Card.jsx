import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaStar, FaCalendarAlt, FaFilm, FaTv, FaPlay, FaHeart, FaBookmark } from "react-icons/fa";
import noimage from "/noimage.jpeg";

function Card({ data, title }) {
  const [imageErrors, setImageErrors] = useState({});
  const [imageLoaded, setImageLoaded] = useState({});

  const handleImageError = (index) => {
    setImageErrors(prev => ({ ...prev, [index]: true }));
  };

  const handleImageLoad = (index) => {
    setImageLoaded(prev => ({ ...prev, [index]: true }));
  };

  const getRatingColor = (rating) => {
    if (rating >= 70) return "bg-green-500";
    if (rating >= 50) return "bg-yellow-500";
    return "bg-red-500";
  };

  const formatDate = (dateString) => {
    if (!dateString) return null;
    return new Date(dateString).getFullYear();
  };

  return (
    <div className="w-full px-2 sm:px-[1%] mt-6 sm:mt-10">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-5 lg:gap-6">
        {data.map((c, i) => {
          const rating = c.vote_average ? Math.round(c.vote_average * 10) : null;
          const releaseYear = formatDate(c.release_date || c.first_air_date);
          const mediaType = c.media_type || title;
          const imageUrl = imageErrors[i] 
            ? noimage 
            : (c.poster_path || c.backdrop_path || c.profile_path 
              ? `https://image.tmdb.org/t/p/w500/${c.poster_path || c.backdrop_path || c.profile_path}` 
              : noimage);

          return (
            <Link 
              key={`${c.id}-${i}`} 
              to={`/${mediaType}/datails/${c.id}`} 
              className="group cursor-pointer transform transition-all duration-300 hover:scale-[1.03] active:scale-[0.98]"
            >
              <div className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 backdrop-blur-sm border border-zinc-800/50 shadow-lg shadow-black/30 group-hover:shadow-2xl group-hover:shadow-indigo-500/30 group-hover:border-indigo-500/50 transition-all duration-500">
                {/* Image Container */}
                <div className="aspect-[2/3] w-full relative overflow-hidden">
                  <img
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    src={imageUrl}
                    alt={c.title || c.original_name || c.original_title || "Poster"}
                    loading="lazy"
                    onError={() => handleImageError(i)}
                  />
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  {/* Rating Badge */}
                  {rating && (
                    <div className={`absolute top-2 right-2 sm:top-3 sm:right-3 w-9 h-9 sm:w-11 sm:h-11 flex items-center justify-center ${getRatingColor(rating)}/95 backdrop-blur-md rounded-full shadow-xl border-2 border-white/20 transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-6`}>
                      <div className="flex items-center gap-0.5">
                        <FaStar className="text-[0.6em] sm:text-[0.7em] text-white" />
                        <span className="text-[0.65em] sm:text-[0.75em] font-bold text-white">
                          {rating}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Media Type Badge */}
                  <div className="absolute top-2 left-2 sm:top-3 sm:left-3 px-2 py-1 bg-black/70 backdrop-blur-md rounded-lg border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {mediaType === 'tv' || mediaType === 'tvshow' ? (
                      <FaTv className="text-xs sm:text-sm text-indigo-400" />
                    ) : (
                      <FaFilm className="text-xs sm:text-sm text-indigo-400" />
                    )}
                  </div>

                  {/* Hover Info Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 bg-gradient-to-t from-black/95 to-transparent">
                    {releaseYear && (
                      <div className="flex items-center gap-2 text-white/90 mb-2">
                        <FaCalendarAlt className="text-xs sm:text-sm" />
                        <span className="text-xs sm:text-sm font-medium">{releaseYear}</span>
                      </div>
                    )}
                    {c.overview && (
                      <p className="text-xs sm:text-sm text-white/80 line-clamp-2 leading-relaxed">
                        {c.overview}
                      </p>
                    )}
                  </div>
                </div>

                {/* Title Section */}
                <div className="p-3 sm:p-4">
                  <h1 className="text-xs sm:text-sm md:text-base font-bold text-zinc-200 group-hover:text-white transition-colors duration-300 line-clamp-2 min-h-[2.5em] leading-tight">
                    {c.title || c.original_name || c.original_title || c.name}
                  </h1>
                  
                  {/* Additional Info */}
                  <div className="mt-2 flex items-center gap-2 text-xs text-zinc-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {releaseYear && (
                      <span className="flex items-center gap-1">
                        <FaCalendarAlt className="text-[0.7em]" />
                        {releaseYear}
                      </span>
                    )}
                    {rating && (
                      <span className="flex items-center gap-1">
                        <FaStar className="text-[0.7em] text-yellow-500" />
                        {rating}%
                      </span>
                    )}
                  </div>
                </div>

                {/* Shine Effect */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default Card;
