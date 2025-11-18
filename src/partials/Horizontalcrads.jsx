import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaStar, FaCalendarAlt, FaFilm, FaTv, FaArrowRight, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Dropdown from "./Dropdown";
import noimage from "/noimage.jpeg";

function Horizontalcrads({ data, title }) {
  const [imageErrors, setImageErrors] = useState({});
  const scrollContainerRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

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

  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScrollButtons();
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScrollButtons);
      window.addEventListener('resize', checkScrollButtons);
      return () => {
        container.removeEventListener('scroll', checkScrollButtons);
        window.removeEventListener('resize', checkScrollButtons);
      };
    }
  }, [data]);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      const cardWidth = scrollContainerRef.current.querySelector('div[class*="flex-shrink-0"]')?.offsetWidth || 300;
      scrollContainerRef.current.scrollBy({
        left: -cardWidth - 24,
        behavior: 'smooth'
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      const cardWidth = scrollContainerRef.current.querySelector('div[class*="flex-shrink-0"]')?.offsetWidth || 300;
      scrollContainerRef.current.scrollBy({
        left: cardWidth + 24,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="relative w-full group">
      {/* Left Scroll Button */}
      {showLeftArrow && (
        <button
          onClick={scrollLeft}
          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 bg-black/80 sm:bg-black/70 hover:bg-black/90 backdrop-blur-md rounded-full flex items-center justify-center text-white shadow-xl border border-white/10 hover:border-indigo-500/50 transition-all duration-300 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 hover:scale-110 active:scale-95 touch-manipulation"
          aria-label="Scroll left"
        >
          <FaChevronLeft className="text-lg sm:text-xl" />
        </button>
      )}

      {/* Right Scroll Button */}
      {showRightArrow && (
        <button
          onClick={scrollRight}
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 bg-black/80 sm:bg-black/70 hover:bg-black/90 backdrop-blur-md rounded-full flex items-center justify-center text-white shadow-xl border border-white/10 hover:border-indigo-500/50 transition-all duration-300 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 hover:scale-110 active:scale-95 touch-manipulation"
          aria-label="Scroll right"
        >
          <FaChevronRight className="text-lg sm:text-xl" />
        </button>
      )}

      {/* Scroll Container */}
      <div 
        ref={scrollContainerRef}
        className="w-full overflow-x-auto pb-4 mb-6 scrollbar-hide scroll-smooth snap-x snap-mandatory"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        <div className="flex gap-4 sm:gap-5 md:gap-6 min-w-max px-2 sm:px-4 md:px-6">
        {data.map((d, i) => {
          const rating = d.vote_average ? Math.round(d.vote_average * 10) : null;
          const releaseYear = formatDate(d.release_date || d.first_air_date);
          const mediaType = d.media_type || title;
          const imageUrl = imageErrors[i] 
            ? noimage 
            : (d.backdrop_path || d.poster_path || d.profile_path
              ? `https://image.tmdb.org/t/p/w780/${d.backdrop_path || d.poster_path || d.profile_path}`
              : noimage);

          return (
            <div 
              key={`${d.id}-${i}`} 
              className="flex-shrink-0 w-[90vw] sm:w-[55vw] md:w-[42vw] lg:w-[35vw] xl:w-[30vw] 2xl:w-[26vw] group snap-start"
            >
              <Link
                to={`/${mediaType}/datails/${d.id}`}
                className="block transform transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              >
                <div className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 backdrop-blur-sm border border-zinc-800/50 shadow-xl shadow-black/40 group-hover:shadow-2xl group-hover:shadow-indigo-500/30 group-hover:border-indigo-500/50 transition-all duration-500">
                  {/* Image Container */}
                  <div className="aspect-video w-full relative overflow-hidden">
                    <img
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      src={imageUrl}
                      alt={d.title || d.original_name || d.original_title || "Poster"}
                      loading="lazy"
                      onError={() => handleImageError(i)}
                    />
                    
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/98 via-black/60 to-black/20"></div>
                    
                    {/* Rating Badge */}
                    {rating && (
                      <div className={`absolute top-3 right-3 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center ${getRatingColor(rating)}/95 backdrop-blur-md rounded-full shadow-xl border-2 border-white/20 transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-6`}>
                        <div className="flex items-center gap-0.5">
                          <FaStar className="text-[0.7em] sm:text-[0.8em] text-white" />
                          <span className="text-[0.7em] sm:text-[0.8em] font-bold text-white">
                            {rating}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Media Type Badge */}
                    <div className="absolute top-3 left-3 px-2.5 py-1.5 bg-black/70 backdrop-blur-md rounded-lg border border-white/10">
                      {mediaType === 'tv' || mediaType === 'tvshow' ? (
                        <FaTv className="text-sm text-indigo-400" />
                      ) : (
                        <FaFilm className="text-sm text-indigo-400" />
                      )}
                    </div>

                    {/* Bottom Info Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
                      <h1 className="text-base sm:text-lg md:text-xl font-bold text-white mb-2 line-clamp-2 drop-shadow-lg">
                        {d.title || d.original_name || d.original_title}
                      </h1>
                      
                      {/* Meta Info */}
                      <div className="flex items-center gap-3 text-xs sm:text-sm text-white/90 mb-2">
                        {releaseYear && (
                          <div className="flex items-center gap-1.5">
                            <FaCalendarAlt className="text-[0.8em]" />
                            <span>{releaseYear}</span>
                          </div>
                        )}
                        {rating && (
                          <div className="flex items-center gap-1.5">
                            <FaStar className="text-[0.8em] text-yellow-400" />
                            <span>{rating}%</span>
                          </div>
                        )}
                      </div>

                      {/* Overview */}
                      {d.overview && (
                        <p className="text-xs sm:text-sm text-white/80 line-clamp-2 sm:line-clamp-3 leading-relaxed drop-shadow-md">
                          {d.overview}
                        </p>
                      )}
                    </div>

                    {/* Shine Effect */}
                    <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                  </div>
                </div>
              </Link>
              
              {/* View Details Link */}
              <Link
                to={`/${mediaType}/datails/${d.id}`}
                className="inline-flex items-center gap-2 mt-3 sm:mt-4 text-xs sm:text-sm text-indigo-400 hover:text-indigo-300 font-semibold transition-all duration-300 group/link"
              >
                <span>View Details</span>
                <FaArrowRight className="transform transition-transform duration-300 group-hover/link:translate-x-1" />
              </Link>
            </div>
          );
        })}
        </div>
      </div>
    </div>
  );
}

export default Horizontalcrads;
