import React from "react";
import { Link } from "react-router-dom";
import Dropdown from "./Dropdown";
import noimage from "/noimage.jpeg";

function Horizontalcrads({ data, title }) {
  return (
    <div className="min-w-full flex max-sm:flex-col overflow-x-auto mb-3 px-2 gap-4 scrollbar-hide">
      {data.map((d, i) => (
        <div key={i} className="sm:min-w-[30%] max-sm:w-[100%] mr-3 p-1 group">
          <Link
            to={`/${d.media_type || title}/datails/${d.id}`}
            className="block transform transition-all duration-300 hover:scale-[1.02]"
          >
            <div className="relative overflow-hidden rounded-lg shadow-lg shadow-black/50 group-hover:shadow-xl group-hover:shadow-black/70 transition-all duration-300">
              <img
                className="w-full h-[40vh] object-cover transition-transform duration-500 group-hover:scale-110"
                src={
                  d.backdrop_path || d.profile_path
                    ? `https://image.tmdb.org/t/p/original/${d.backdrop_path || d.profile_path}`
                    : noimage
                }
                alt={d.titlel || d.original_name || d.original_title || "Content poster"}
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <h1 className="text-xl text-center mt-4 font-black w-full sm:text-nowrap text-zinc-300 group-hover:text-white transition-colors duration-300">
              {d.titlel || d.original_name || d.original_title}
            </h1>
            <p className="mt-3 text-zinc-400 text-sm leading-relaxed line-clamp-3 group-hover:text-zinc-300 transition-colors duration-300">{d.overview?.slice(0, 200)}...</p>
          </Link>
          <Link
            to={`/${d.media_type || title}/datails/${d.id}`}
            className="text-zinc-300 block text-center mt-4 font-semibold hover:text-indigo-400 transition-colors duration-200 underline-offset-2 hover:underline"
          >
            Read more →
          </Link>
        </div>
      ))}
    </div>
  );
}

export default Horizontalcrads;
