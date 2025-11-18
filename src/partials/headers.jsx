import React from "react";
import { Link } from "react-router-dom";
import { GrAnnounce } from "react-icons/gr";
import { MdMovieFilter } from "react-icons/md";
function Headers({ data }) {
//   console.log(data);
  if (!data) return null;
  
  return (
    <div
      style={{
        background: `linear-gradient(rgba(0,0,0,0.4),rgba(0,0,0,0.7),rgba(0,0,0,0.9)), url(https://image.tmdb.org/t/p/original/${
      data.backdrop_path || data.profile_path
        })  `,
        objectFit: "cover",
        backgroundPosition: "center",
        backgroundSize: "cover",
        scale: "0.9",
        backgroundRepeat: "no-repeat"
      }}
      className="w-full h-[85vh] mt-4 flex flex-col justify-end items-start p-[3%] rounded-xl sm:rounded-2xl overflow-hidden relative group"
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-black/30"></div>
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-t from-indigo-900/20 via-transparent to-transparent"></div>
      <div className="md:w-[50%] relative z-10 animate-fadeIn">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white drop-shadow-2xl mb-4 leading-tight bg-gradient-to-r from-white via-zinc-100 to-zinc-200 bg-clip-text text-transparent">
          {data.titlel || data.original_name || data.original_title}
        </h1>
        <p className="mt-3 text-zinc-200 text-sm sm:text-base leading-relaxed drop-shadow-lg line-clamp-3">
          {data.overview?.slice(0, 200)}...
          <Link to={`/${data.media_type || "title"}/datails/${data.id}`} className="text-indigo-400 hover:text-indigo-300 transition-colors duration-200 font-semibold ml-2 underline-offset-2 hover:underline">more</Link>
        </p>
        <div className="flex items-center gap-4 sm:gap-6 md:gap-10 text-sm sm:text-lg mt-4 flex-wrap">
          <span className="flex gap-2 items-center text-zinc-200 bg-black/40 backdrop-blur-md px-3 sm:px-4 py-2 rounded-lg border border-white/10 hover:border-indigo-500/50 transition-all duration-300">
            <GrAnnounce className="text-indigo-400 text-base sm:text-lg" />
            <span className="font-medium">{data.release_date || "no information"}</span>
          </span>
          <span className="flex gap-2 items-center text-zinc-200 bg-black/40 backdrop-blur-md px-3 sm:px-4 py-2 rounded-lg border border-white/10 hover:border-indigo-500/50 transition-all duration-300">
            <MdMovieFilter className="text-indigo-400 text-base sm:text-lg" />
            <span className="font-medium capitalize">{data.media_type || "N/A"}</span>
          </span>
          {data.vote_average && (
            <span className="flex gap-2 items-center text-zinc-200 bg-black/40 backdrop-blur-md px-3 sm:px-4 py-2 rounded-lg border border-white/10 hover:border-indigo-500/50 transition-all duration-300">
              <span className="text-yellow-400">⭐</span>
              <span className="font-medium">{(data.vote_average * 10).toFixed(0)}%</span>
            </span>
          )}
        </div>
      </div>
        <Link 
          to={`/${data.media_type || "title"}/datails/${data.id}/trailer`} 
          className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 px-6 sm:px-8 py-3 sm:py-4 rounded-full mt-6 text-white font-semibold shadow-lg shadow-indigo-500/50 transform transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-indigo-500/70 active:scale-95 relative z-10 text-sm sm:text-base"
        >
          ▶ Watch Trailer
        </Link>
    </div>
  );
}

export default Headers;
