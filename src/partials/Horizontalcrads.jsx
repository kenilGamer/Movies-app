import React from "react";
import { Link } from "react-router-dom";
import Dropdown from "./Dropdown";
import noimage from "/noimage.jpeg";

function Horizontalcrads({ data, title }) {
  return (
    <div className="min-w-full flex overflow-x-auto mb-3 px-2">
      {data.map((d, i) => (
        <div key={i} className="min-w-[30%] mr-3 p-1">
          <Link
            to={`/${d.media_type || title}/datails/${d.id}`}
            className="block"
          >
            <img
              className="w-full object-cover"
              src={
                d.backdrop_path || d.profile_path
                  ? `https://image.tmdb.org/t/p/original/${d.backdrop_path || d.profile_path}`
                  : noimage
              }
              alt=""
            />
            <h1 className="text-xl text-center mt-3 font-black">
              {d.titlel || d.original_name || d.original_title}
            </h1>
            <p className="mt-3">{d.overview.slice(0, 200)}...</p>
          </Link>
          <Link
            to={`/${d.media_type || title}/datails/${d.id}`}
            className="text-zinc-300 block text-center mt-3"
          >
            more
          </Link>
        </div>
      ))}
    </div>
  );
}

export default Horizontalcrads;
