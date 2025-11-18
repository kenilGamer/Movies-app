import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaStar, FaCalendarAlt } from "react-icons/fa";
import noimage from "/noimage.jpeg";

function HistoryCard({ data, title }) {
  document.title = `Profile | Godcrfts`;
  const [imageErrors, setImageErrors] = useState({});

  const handleImageError = (index) => {
    setImageErrors(prev => ({ ...prev, [index]: true }));
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
    <div className="min-w-full flex overflow-x-auto mb-3 scrollbar-hide gap-4 sm:gap-6 scroll-smooth px-2 sm:px-4">
      {data.map((c, i) => {
        const rating = c.vote_average ? Math.round(c.vote_average * 10) : null;
        const releaseYear = formatDate(c.release_date || c.first_air_date);
        const imageUrl = imageErrors[i] 
          ? noimage 
          : (c.poster_path || c.backdrop_path || c.profile_path 
            ? `https://image.tmdb.org/t/p/original/${c.poster_path || c.backdrop_path || c.profile_path}` 
            : noimage);

        return (
          <Link 
            key={`${c.id}-${i}`} 
            to={`/${c.media_type || title}/datails/${c.id}`} 
            className="min-w-[18em] sm:min-w-[20em] md:min-w-[22em] group flex-shrink-0"
          >
            <div className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 backdrop-blur-sm border border-zinc-800/50 shadow-xl shadow-black/40 group-hover:shadow-2xl group-hover:shadow-indigo-500/30 group-hover:border-indigo-500/50 transition-all duration-500 transform group-hover:scale-[1.02]">
              {/* Image Container */}
              <div className="h-[60vh] w-full relative overflow-hidden">
                <img
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  src={imageUrl}
                  alt={c.title || c.original_name || c.original_title || "Poster"}
                  loading="lazy"
                  onError={() => handleImageError(i)}
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Rating Badge */}
                {rating && (
                  <div className={`absolute top-3 right-3 w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center ${getRatingColor(rating)}/95 backdrop-blur-md rounded-full shadow-xl border-2 border-white/20 transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-6`}>
                    <div className="flex items-center gap-0.5">
                      <FaStar className="text-[0.7em] sm:text-[0.8em] text-white" />
                      <span className="text-[0.7em] sm:text-[0.8em] font-bold text-white">
                        {rating}
                      </span>
                    </div>
                  </div>
                )}

                {/* Hover Info Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 bg-gradient-to-t from-black/95 to-transparent">
                  {releaseYear && (
                    <div className="flex items-center gap-2 text-white/90 mb-2">
                      <FaCalendarAlt className="text-sm" />
                      <span className="text-sm font-medium">{releaseYear}</span>
                    </div>
                  )}
                  {c.overview && (
                    <p className="text-sm text-white/80 line-clamp-3 leading-relaxed">
                      {c.overview}
                    </p>
                  )}
                </div>

                {/* Shine Effect */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
              </div>

              {/* Title Section */}
              <div className="p-4 sm:p-5">
                <h1 className="text-lg sm:text-xl md:text-2xl text-zinc-200 group-hover:text-white font-bold transition-colors duration-300 text-center line-clamp-2">
                  {c.title || c.original_name || c.original_title}
                </h1>
                
                {/* Additional Info */}
                {(releaseYear || rating) && (
                  <div className="mt-3 flex items-center justify-center gap-4 text-sm text-zinc-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {releaseYear && (
                      <span className="flex items-center gap-1.5">
                        <FaCalendarAlt className="text-xs" />
                        {releaseYear}
                      </span>
                    )}
                    {rating && (
                      <span className="flex items-center gap-1.5">
                        <FaStar className="text-xs text-yellow-500" />
                        {rating}%
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

export default HistoryCard;
