import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { asyncloadtv, removetv } from "../store/actions/tvActions";
import {
  Link,
  Outlet,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import HorizontalCards from "./Horizontalcrads";
import Loading from "../components/Loading";
import noimage from "/noimage.jpeg";

// Function to add a new item to the history in localStorage
const addToHistory = (newItem) => {
  // Retrieve the current history from localStorage (if any)
  const storedHistory = localStorage.getItem("history");

  // If history doesn't exist yet, create an empty array
  let historyArray = storedHistory ? JSON.parse(storedHistory) : [];

  // Check if the item already exists in history (to avoid duplicates)
  const isAlreadyInHistory = historyArray.some(
    (item) => item.id === newItem.id
  );

  if (!isAlreadyInHistory) {
    // If the item is not in history, add it to the array
    historyArray.push(newItem);

    // Optionally, limit the size of the history array (e.g., keep the last 10 items)
    if (historyArray.length > 10) {
      historyArray = historyArray.slice(-10); // Keep only the last 10 items
    }

    // Store the updated history back to localStorage as a JSON string
    localStorage.setItem("history", JSON.stringify(historyArray));
  }
};

function Tvdatails() {
  document.title = "godcraft | tv Details";
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const { info } = useSelector((state) => state.tv);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(asyncloadtv(id));

    return () => {
      dispatch(removetv());
    };
  }, [id]);

  useEffect(() => {
    if (info && info.detail) {
      try {
        // Create a new item object from the info.details
        const newItem = {
          id: info.detail.id, // Unique identifier for each show
          title: info.detail.name || info.detail.title || "Unknown",
          poster_path: info.detail.poster_path,
          release_date: info.detail.first_air_date || "N/A",
          overview: info.detail.overview || "No overview available",
          type: "tv",
          media_type: "tv",
          backdrop_path: info.detail.backdrop_path,
          vote_average: info.detail.vote_average,
        };

        // Call the addToHistory function to append the new item to history
        addToHistory(newItem);
      } catch (e) {
        console.error("Error adding to history:", e);
      }
    }
  }, [info]); // Trigger this whenever the `info` changes

  return info ? (
    <div
      style={{
        background: `linear-gradient(rgba(0,0,0,.2),rgba(0,0,0,.5), rgba(0,0,0,.8)), url(https://image.tmdb.org/t/p/original/${info.detail.backdrop_path})`,
        backgroundPosition: "center",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
      className="relative w-screen h-[100vh] px-[5%] overflow-hidden overflow-y-auto"
    >
      {/* Part 1 navigation */}
      <nav className="h-[10vh] w-full text-zinc-100 flex items-center gap-10 text-xl ">
        <Link
          onClick={() => navigate(-1)}
          className="hover:text-[#6556CD] ri-arrow-left-line"
        ></Link>
        <a target="_blank" href={info.detail.homepage}>
          <i className="ri-external-link-fill"></i>
        </a>
        <a
          target="_blank"
          href={`https://www.wikidata.org/wiki/${info.externalid.wikidata_id}`}
        >
          <i className="ri-earth-fill"></i>
        </a>

        <a
          target="_blank"
          href={`https://www.imdb.com/title/${info.externalid.imdb_id}/`}
        >
          imdb
        </a>
      </nav>

      {/* Part 2 Poster and details */}
      <div className="w-full flex max-sm:flex-col  items-center">
        <img
          className="shadow-[8px_17px_38px_2px_rgba(0,0,0,.5)] h-[50vh] object-cover"
          src={`https://image.tmdb.org/t/p/original/${
            info.detail.poster_path || info.detail.backdrop_path
          }`}
          alt=""
        />

        <div className="content ml-[5%] text-white">
          <h1 className="text-5xl font-black ">
            {info.detail.name ||
              info.detail.title ||
              info.detail.original_name ||
              info.detail.original_title}

            <small className="text-2xl font-bold text-zinc-200">
              ({info.detail.first_air_date.split("-")[0]})
            </small>
          </h1>

          <div className="mt-3 mb-5 flex  items-center gap-x-3">
            <span className="rounded-full text-xl font-semibold bg-yellow-600 text-white w-[5vh] h-[5vh] flex justify-center items-center">
              {(info.detail.vote_average * 10).toFixed()}{" "}
              <sup>%</sup>
            </span>
            <h1 className="w-[60px] font-semibold text-2xl leading-6">
              User Score
            </h1>
            <h1>{info.detail.first_air_date}</h1>
            <h1>
              {info.detail.genres.map((g) => g.name).join(",")}
            </h1>
            <h1>{info.detail.runtime}min</h1>
          </div>

          <h1 className="text-xl font-semibold italic text-zinc-200">
            {info.detail.tagline}
          </h1>

          <h1 className="text-2xl mb-3  mt-5">Overview</h1>
          <p>{info.detail.overview}</p>

          <h1 className="text-2xl mb-3  mt-5">tv Translated</h1>
          <p className="mb-10">{info.translations.join(", ")}</p>

          <Link
            className="p-5 bg-[#6556CD] rounded-lg"
            to={`${pathname}/trailer`}
          >
            <i className="text-xl ri-play-fill mr-3 "></i>
            Play Trailer
          </Link>
          <Link className="p-5 bg-[#6556CD] rounded-lg" to={`https://moviebypass.pro/watch/tv/${id}`}>
            <i className="text-xl ri-play-fill mr-3 "></i>
            Play Episodes
          </Link>
        </div>
      </div>

      {/* Part 3 Available on Platform */}
      <div className="w-[80%] flex flex-col gap-y-5 mt-10">
        {info.watchproviders && info.watchproviders.flatrate && (
          <div className="flex gap-x-10 items-center text-white">
            <h1>Available on Platfotms</h1>
            {info.watchproviders.flatrate.map((w, i) => (
              <img
                key={i}
                title={w.provider_name}
                className="w-[5vh] h-[5vh] object-cover rounded-md"
                src={`https://image.tmdb.org/t/p/original/${w.logo_path}`}
                alt=""
              />
            ))}
          </div>
        )}

        {info.watchproviders && info.watchproviders.rent && (
          <div className="flex gap-x-10 items-center text-white">
            <h1>Available on Rent</h1>
            {info.watchproviders.rent.map((w, i) => (
              <img
                key={i}
                title={w.provider_name}
                className="w-[5vh] h-[5vh] object-cover rounded-md"
                src={`https://image.tmdb.org/t/p/original/${w.logo_path}`}
                alt=""
              />
            ))}
          </div>
        )}

        {info.watchproviders && info.watchproviders.buy && (
          <div className="flex gap-x-10 items-center text-white">
            <h1>Available to Buy</h1>
            {info.watchproviders.buy.map((w, i) => (
              <img
                key={i}
                title={w.provider_name}
                className="w-[5vh] h-[5vh] object-cover rounded-md"
                src={`https://image.tmdb.org/t/p/original/${w.logo_path}`}
                alt=""
              />
            ))}
          </div>
        )}
      </div>

      {/* Part 4 Seasons */}
      <hr className="mt-10 mb-5 border-none h-[2px] bg-zinc-500" />
      <h1 className=" text-3xl font-bold text-white">Seasons</h1>
      <div className="flex gap-5 mt-5 overflow-x-auto">
        {info.detail.seasons.length > 0 ? (
          info.detail.seasons.map((s, i) => (
            <div key={i} className="group w-[18vw] h-[25vw] hover:scale-105 duration-300 hover:cursor-pointer">
              <img
                className="w-full h-full object-cover rounded-xl shadow-[8px_17px_38px_2px_rgba(0,0,0,.5)]"
                src={`https://image.tmdb.org/t/p/original/${s.poster_path || noimage}`}
                alt=""
              />
              <h1 className="text-xl text-white mt-3">{s.name}</h1>
              <h1 className="text-xl text-zinc-300">{s.episode_count} episodes</h1>
            </div>
          ))
        ) : (
          <h1>No Seasons Available</h1>
        )}
      </div>

      {/* Part 5 Recommendations */}
      <h1 className=" text-3xl font-bold text-white">Recommendations</h1>
      <HorizontalCards data={info.recommendations} />
      <hr className="mt-10 border-none h-[2px] bg-zinc-500" />
      <Outlet />
    </div>
  ) : (
    <Loading />
  );
}

export default Tvdatails;
