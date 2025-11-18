import React, { useEffect, useState } from "react";
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
import { addToWatchlist, removeFromWatchlist, addToFavorites, removeFromFavorites, checkItemStatus } from "../utils/watchlistUtils";
import Reviews from "../components/Reviews";
import ReviewForm from "../components/ReviewForm";
import ShareButton from "../components/ShareButton";

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
      if (localStorage.getItem("token") !== undefined){
        localStorage.setItem("history", JSON.stringify(historyArray));
      }
    }
  } catch (error) {
    console.error("Error adding to history:", error);
  }
};

  

// Watchlist and Favorites buttons component
const WatchlistButtons = ({ movieId, mediaType }) => {
    const [inWatchlist, setInWatchlist] = useState(false);
    const [inFavorites, setInFavorites] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkStatus = async () => {
            try {
                const status = await checkItemStatus(movieId, mediaType);
                setInWatchlist(status.inWatchlist);
                setInFavorites(status.inFavorites);
            } catch (error) {
                console.error('Error checking status:', error);
            } finally {
                setLoading(false);
            }
        };
        checkStatus();
    }, [movieId, mediaType]);

    const handleWatchlist = async () => {
        try {
            if (inWatchlist) {
                await removeFromWatchlist(movieId, mediaType);
                setInWatchlist(false);
            } else {
                await addToWatchlist(movieId, mediaType);
                setInWatchlist(true);
            }
        } catch (error) {
            console.error('Error toggling watchlist:', error);
        }
    };

    const handleFavorites = async () => {
        try {
            if (inFavorites) {
                await removeFromFavorites(movieId, mediaType);
                setInFavorites(false);
            } else {
                await addToFavorites(movieId, mediaType);
                setInFavorites(true);
            }
        } catch (error) {
            console.error('Error toggling favorites:', error);
        }
    };

    if (loading) return null;

    return (
        <>
            <button
                onClick={handleWatchlist}
                className={`p-5 rounded-lg flex items-center gap-2 ${inWatchlist ? 'bg-green-600' : 'bg-[#6556CD]'} hover:opacity-80 transition-opacity`}
            >
                <i className={`text-xl ${inWatchlist ? 'ri-bookmark-fill' : 'ri-bookmark-line'}`}></i>
                {inWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
            </button>
            <button
                onClick={handleFavorites}
                className={`p-5 rounded-lg flex items-center gap-2 ${inFavorites ? 'bg-red-600' : 'bg-[#6556CD]'} hover:opacity-80 transition-opacity`}
            >
                <i className={`text-xl ${inFavorites ? 'ri-heart-fill' : 'ri-heart-line'}`}></i>
                {inFavorites ? 'Favorited' : 'Add to Favorites'}
            </button>
        </>
    );
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
                    type: "movie",
                    media_type: "movie",
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

                   <div className="flex max-md:flex-col max-md:items-center gap-5 max-md:justify-center flex-wrap">
                   <Link
                        className="p-5 bg-[#6556CD] rounded-lg"
                        to={`${pathname}/trailer`}
                    >
                        <i className="text-xl ri-play-fill mr-3 "></i>
                        Play Trailer
                    </Link>
                    <Link
                        className="p-5  bg-[#6556CD] rounded-lg"
                        to={`/movie/datails/${id}/moviepalyer`}
                    >
                        <i className="text-xl ri-play-fill mr-3 "></i>
                        Watch Now
                    </Link>
                    <WatchlistButtons movieId={parseInt(id)} mediaType="movie" />
                    <ShareButton
                        movieId={parseInt(id)}
                        mediaType="movie"
                        title={info.detail?.title || info.detail?.name}
                        description={info.detail?.overview}
                        posterPath={info.detail?.poster_path}
                    />
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

            {/* Part 4 Reviews */}
            <hr className="mt-10 mb-5 border-none h-[2px] bg-zinc-500" />
            <Reviews movieId={parseInt(id)} mediaType="movie" />
            <ReviewForm movieId={parseInt(id)} mediaType="movie" />

            {/* Part 5 Recommendations and Similar Stuff */}
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