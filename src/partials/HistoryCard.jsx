import React from "react";
import { Link } from "react-router-dom";
import noimage from "/noimage.jpeg";

function HistoryCard({ data, title }) {
  document.title = `Profile | Godcrfts`;
  const handleDragStart = (e) => {
    e.preventDefault();
    const scroll = e.target.scrollLeft + 100;
    console.log(scroll);
  };

  return (
      <div onDragStart={handleDragStart} className="min-w-full flex overflow-x-auto mb-3 scroll gap-10 ">
      {data.map((c, i) => (
        <Link key={i} to={`/${c.media_type || title}/datails/${c.id}`} className="min-w-[20em] rounded-xl sm:p-1">
          <img
            className=" h-[60vh] w-full object-cover shadow-lg shadow-black rounded-xl"
            src={ c.poster_path || c.backdrop_path || c.profile_path ? `https://image.tmdb.org/t/p/original/${c.poster_path || c.backdrop_path || c.profile_path}` : noimage}
            alt=""
          />
          <h1 className="text-2xl text-zinc-400 font-semibold p-2 mb-10 text-center">
            {c.titlel || c.original_name || c.original_title}
          </h1>
          {/* {c.vote_average &&  <div className="text-white w-[7vh] h-[7vh] flex items-center justify-center bg-yellow-700 absolute bottom-[14%] -right-2 rounded-full ">{(c.vote_average * 10).toFixed()} <sup>%</sup></div>} */}
        </Link>
      ))}
    </div>
  );
}

export default HistoryCard;
