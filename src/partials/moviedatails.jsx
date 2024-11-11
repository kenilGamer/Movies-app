import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { asyncloadmovie, removemovie } from "../store/actions/movieActions";
import {
    Link,
    Outlet,
    useLocation,
    useNavigate,
    useParams,
} from "react-router-dom";
import HorizontalCards from "./Horizontalcrads";
import Loading from "../components/Loading";
import noimage from "/noimage.jpeg"; // Added import for noimage

// Function to add a new item to the history in localStorage
const addToHistory = (movie) => {
  try {
    // Retrieve the history from localStorage
    let historyArray = JSON.parse(localStorage.getItem("history"));
    
    // If the history is null or not an array, initialize it as an empty array
    if (!Array.isArray(historyArray)) {
      historyArray = [];
    }

    // Check if the movie is already in history
    const isMovieInHistory = historyArray.some((item) => item.id === movie.id);
    
    if (!isMovieInHistory) {
      // Add the movie to history
      historyArray.push(movie);
      // Save it back to localStorage
      localStorage.setItem("history", JSON.stringify(historyArray));
    }
  } catch (error) {
    console.error("Error adding to history:", error);
  }
};

  

const Moviedetails = () => {
    document.title = "godcraft | Movie Details";

    const { pathname } = useLocation();
    const navigate = useNavigate();
    const { id } = useParams();
    const { info } = useSelector((state) => state.movie);
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(asyncloadmovie(id));

        return () => {
            dispatch(removemovie());
        };
    }, [id]);

    useEffect(() => {
        if (info && info.detail) {
            try {
                // Create a new item object from the info.details
                const newItem = {
                    id: info.detail.id, // Unique identifier for each movie
                    title: info.detail.name || info.detail.title || "Unknown",
                    poster_path: info.detail.poster_path,
                    release_date: info.detail.release_date || "N/A",
                    overview: info.detail.overview || "No overview available",
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
            <div className="w-full flex max-sm:flex-col px-2 items-center
            ">
                <img
                    className="shadow-[8px_17px_38px_2px_rgba(0,0,0,.5)] h-[50vh] object-cover"
                    src={`https://image.tmdb.org/t/p/original/${
                        info.detail.poster_path || info.detail.backdrop_path
                    }`}
                    alt=""
                />

                <div className="content sm:ml-[5%] px-5 text-white">
                    <h1 className="sm:text-5xl text-3xl max-sm:text-center p-3 font-black ">
                        {info.detail.name ||
                            info.detail.title ||
                            info.detail.original_name ||
                            info.detail.original_title}

                        <small className="sm:text-2xl font-bold text-zinc-200">
                            ({info.detail.release_date.split("-")[0]})
                        </small>
                    </h1>

                    <div className="mt-3 mb-5 flex max-sm:flex-col  items-center gap-x-3">
                        <span className="rounded-full text-xl font-semibold bg-yellow-600 text-white w-[5vh] h-[5vh] flex justify-center items-center">
                            {(info.detail.vote_average * 10).toFixed()}{" "}
                            <sup>%</sup>
                        </span>
                        <h1 className="sm:w-[60px] font-semibold text-2xl leading-6">
                            User Score
                        </h1>
                        <h1>{info.detail.release_date}</h1>
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

                    <h1 className="text-2xl mb-3  mt-5">Movie Translated</h1>
                    <p className="mb-10">{info.translations.join(", ")}</p>

                   <div className="flex max-md:flex-col max-md:items-center gap-5 max-md:justify-center">
                   <Link
                        className="p-5 bg-[#6556CD] rounded-lg"
                        to={`${pathname}/trailer`}
                    >
                        <i className="text-xl ri-play-fill mr-3 "></i>
                        Play Trailer
                    </Link>
                    <Link
                        className="p-5 ml-5 bg-[#6556CD] rounded-lg"
                        to={`https://moviebypass.pro/watch/movie/${id}`}
                    >
                        <i className="text-xl ri-play-fill mr-3 "></i>
                        Watch Now
                    </Link>
                   </div>
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

            {/* Part 4 Recommendations and Similar Stuff */}
            <hr className="mt-10 mb-5 border-none h-[2px] bg-zinc-500" />
            <h1 className=" text-3xl font-bold text-white">
                Recommendations & Similar stuff
            </h1>
            <HorizontalCards
                title="movie"
                data={
                    info.recommendations.length > 0
                        ? info.recommendations
                        : info.similar
                }
            />
            <Outlet />
        </div>
    ) : (
        <Loading />
    );
};

export default Moviedetails;