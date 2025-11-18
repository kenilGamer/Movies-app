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
      className="w-full h-[85vh] mt-4 flex flex-col justify-end items-start p-[3%] rounded-lg overflow-hidden relative"
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
      <div className="md:w-[50%] relative z-10 animate-fadeIn">
        <h1 className="text-4xl md:text-5xl font-black text-white drop-shadow-2xl mb-4 leading-tight">
          {data.titlel || data.original_name || data.original_title}
        </h1>
        <p className="mt-3 text-zinc-200 text-base leading-relaxed drop-shadow-lg">
          {data.overview?.slice(0, 200)}...
          <Link to={`/${data.media_type || "title"}/datails/${data.id}`} className="text-indigo-400 hover:text-indigo-300 transition-colors duration-200 font-semibold ml-2 underline-offset-2 hover:underline">more</Link>
        </p>
        <div className="flex items-center gap-6 md:gap-10 text-lg mt-4 flex-wrap">
          <span className="flex gap-2 items-center text-zinc-300 bg-black/30 backdrop-blur-sm px-3 py-1 rounded-lg">
            <GrAnnounce className="text-indigo-400" />
            {data.release_date || "no information"}
          </span>
          <span className="flex gap-2 items-center text-zinc-300 bg-black/30 backdrop-blur-sm px-3 py-1 rounded-lg">
            <MdMovieFilter className="mt-1 text-indigo-400" />
            {data.media_type || "N/A"}
          </span>
        </div>
      </div>
        <Link 
          to={`/${data.media_type || "title"}/datails/${data.id}/trailer`} 
          className="bg-[#6556cd] hover:bg-[#5142b1] px-8 py-4 rounded-full mt-6 text-white font-semibold shadow-lg shadow-indigo-500/50 transform transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-indigo-500/70 active:scale-95 relative z-10"
        >
          Watch Trailer
        </Link>
    </div>
  );
}

export default Headers;
