import React from "react";
import { Link } from "react-router-dom";

function Card({ data, title }) {
  return (
    <div className="flex flex-wrap bg-[#0f0b20] w-full h-full px-[3%] mt-10 items-center justify-between">
      {data.map((c, i) => (
        <Link key={i} to={`/${c.media_type || title}/datails/${c.id}`} className="w-[22vw] relative">
          <img
            className="min-h-[40vh] min-w-full object-cover shadow-lg shadow-black "
            src={`https://image.tmdb.org/t/p/original/${
              c.poster_path || c.backdrop_path || c.profile_path
            }`}
            alt=""
          />
          <h1 className="text-2xl text-zinc-400 font-semibold p-2 mb-10 text-center ">
            {c.titlel || c.original_name || c.original_title}
          </h1>
          {c.vote_average &&  <div className="text-white w-[7vh] h-[7vh] flex items-center justify-center bg-yellow-700 absolute bottom-[14%] -right-2 rounded-full ">{(c.vote_average * 10).toFixed()} <sup>%</sup></div>}
         
        </Link>
      ))}
    </div>
  );
}

export default Card;
