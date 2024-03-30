import React from "react";
import { Link } from "react-router-dom";
import { GrAnnounce } from "react-icons/gr";
import { MdMovieFilter } from "react-icons/md";
function Headers({ data }) {
//   console.log(data);
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
      className="w-full h-[85vh] mt-4 flex flex-col justify-end items-start p-[3%]"
    >
      <div className="w-[50%]">
        <h1 className="text-5xl font-black ">
          {data.titlel || data.original_name || data.original_title}
        </h1>
        <p className="mt-3">
          {data.overview.slice(0, 200)}...
          <Link to={`/${data.media_type || title}/datails/${data.id}`} className="text-blue-500">more</Link>
        </p>
        <p className="flex items-center gap-10 text-lg">
          <span className="flex gap-2 items-center">
            {" "}
            <GrAnnounce />
            {data.release_date || "no information"}
          </span>
          <span className="flex gap-2 items-center">
          <MdMovieFilter className="mt-1" />
            {data.media_type}
          </span>
        </p>
      </div>
        <Link to={`/${data.media_type || title}/datails/${data.id}/trailer`} className="bg-[#6556cd] px-7 py-3 rounded-full mt-5">Watch Trailer</Link>
    </div>
  );
}

export default Headers;
