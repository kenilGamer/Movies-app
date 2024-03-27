import React from "react";
import { Link } from "react-router-dom";
import Dropdown from "./Dropdown";

function Horizontalcrads({ data }) {
  return (
      <div className="min-w-full flex overflow-x-auto mb-3 px-2">
        {data.map((d, i) => (
          <Link to={`/${d.media_type || d.title}/datails/${d.id}`} key={i} className="min-w-[30%] mr-3 p-1">
            <img className="w-full object-cover  " src={`https://image.tmdb.org/t/p/original/${d.backdrop_path || d.profile_path}`} alt="" />
            <h1 className="text-xl text-center mt-3 font-black ">
              {d.titlel || d.original_name || d.original_title}
            </h1>
            <p className="mt-3 ">
              {d.overview.slice(0, 200)}...
              <Link to className="text-zinc-300">more</Link>
              
            </p>
          </Link>
        ))}
      </div>
  );
}

export default Horizontalcrads;
