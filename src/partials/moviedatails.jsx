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
import { FaArrowLeft, FaStar, FaPlay, FaBookmark, FaHeart, FaExternalLinkAlt, FaGlobe, FaImdb, FaClock, FaCalendarAlt } from "react-icons/fa";
import HorizontalCards from "./Horizontalcrads";
import Loading from "../components/Loading";
import noimage from "/noimage.jpeg";
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
                className={`px-4 sm:px-6 py-3 sm:py-4 rounded-xl flex items-center gap-2 sm:gap-3 font-semibold text-sm sm:text-base transition-all duration-300 transform hover:scale-105 active:scale-95 ${
                    inWatchlist 
                        ? 'bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg shadow-green-500/50' 
                        : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg shadow-indigo-500/50'
                }`}
            >
                <FaBookmark className={`text-base sm:text-lg ${inWatchlist ? 'fill-current' : ''}`} />
                <span className="hidden sm:inline">{inWatchlist ? 'In Watchlist' : 'Add to Watchlist'}</span>
                <span className="sm:hidden">{inWatchlist ? 'Saved' : 'Save'}</span>
            </button>
            <button
                onClick={handleFavorites}
                className={`px-4 sm:px-6 py-3 sm:py-4 rounded-xl flex items-center gap-2 sm:gap-3 font-semibold text-sm sm:text-base transition-all duration-300 transform hover:scale-105 active:scale-95 ${
                    inFavorites 
                        ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg shadow-red-500/50' 
                        : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg shadow-indigo-500/50'
                }`}
            >
                <FaHeart className={`text-base sm:text-lg ${inFavorites ? 'fill-current' : ''}`} />
                <span className="hidden sm:inline">{inFavorites ? 'Favorited' : 'Add to Favorites'}</span>
                <span className="sm:hidden">{inFavorites ? 'Liked' : 'Like'}</span>
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
            className="relative w-screen min-h-screen px-4 sm:px-[5%] overflow-hidden overflow-y-auto"
        >
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black/90 pointer-events-none"></div>
            
            {/* Part 1 navigation */}
            <nav className="relative z-10 h-[10vh] w-full text-zinc-100 flex items-center gap-4 sm:gap-6 md:gap-10 text-lg sm:text-xl backdrop-blur-sm bg-black/20 rounded-b-xl">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 sm:p-3 rounded-lg hover:bg-white/10 transition-all duration-300 hover:scale-110 active:scale-95 group"
                    aria-label="Go back"
                >
                    <FaArrowLeft className="text-xl sm:text-2xl group-hover:text-indigo-400 transition-colors" />
                </button>
                {info.detail.homepage && (
                    <a 
                        target="_blank" 
                        rel="noopener noreferrer"
                        href={info.detail.homepage}
                        className="p-2 sm:p-3 rounded-lg hover:bg-white/10 transition-all duration-300 hover:scale-110 active:scale-95 group"
                        aria-label="Official website"
                    >
                        <FaExternalLinkAlt className="text-xl sm:text-2xl group-hover:text-indigo-400 transition-colors" />
                    </a>
                )}
                {info.externalid?.wikidata_id && (
                    <a
                        target="_blank"
                        rel="noopener noreferrer"
                        href={`https://www.wikidata.org/wiki/${info.externalid.wikidata_id}`}
                        className="p-2 sm:p-3 rounded-lg hover:bg-white/10 transition-all duration-300 hover:scale-110 active:scale-95 group"
                        aria-label="Wikidata"
                    >
                        <FaGlobe className="text-xl sm:text-2xl group-hover:text-indigo-400 transition-colors" />
                    </a>
                )}
                {info.externalid?.imdb_id && (
                    <a
                        target="_blank"
                        rel="noopener noreferrer"
                        href={`https://www.imdb.com/title/${info.externalid.imdb_id}/`}
                        className="px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-yellow-600 hover:bg-yellow-500 transition-all duration-300 hover:scale-105 active:scale-95 font-bold text-sm sm:text-base flex items-center gap-2"
                        aria-label="IMDb"
                    >
                        <FaImdb className="text-lg sm:text-xl" />
                        <span className="hidden sm:inline">IMDb</span>
                    </a>
                )}
            </nav>

            {/* Part 2 Poster and details */}
            <div className="relative z-10 w-full flex max-sm:flex-col gap-6 sm:gap-8 px-2 sm:px-4 items-start sm:items-center mt-4 sm:mt-8">
                {/* Poster */}
                <div className="flex-shrink-0 max-sm:mx-auto">
                    <img
                        className="shadow-2xl rounded-xl sm:rounded-2xl h-[60vh] sm:h-[70vh] object-cover border-4 border-white/10 hover:border-indigo-500/50 transition-all duration-300"
                        src={`https://image.tmdb.org/t/p/original/${
                            info.detail.poster_path || info.detail.backdrop_path
                        }`}
                        alt={info.detail.title || info.detail.name}
                        onError={(e) => {
                            e.target.src = noimage;
                        }}
                    />
                </div>

                {/* Content */}
                <div className="content flex-1 px-2 sm:px-5 text-white">
                    {/* Title */}
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-2 sm:mb-4 leading-tight bg-gradient-to-r from-white via-zinc-100 to-zinc-200 bg-clip-text text-transparent">
                        {info.detail.name ||
                            info.detail.title ||
                            info.detail.original_name ||
                            info.detail.original_title}
                        {info.detail.release_date && (
                            <span className="block sm:inline sm:ml-3 text-2xl sm:text-3xl md:text-4xl font-bold text-zinc-300">
                                ({info.detail.release_date.split("-")[0]})
                            </span>
                        )}
                    </h1>

                    {/* Meta Info */}
                    <div className="mt-4 sm:mt-6 mb-6 flex flex-wrap items-center gap-3 sm:gap-4">
                        {/* Rating */}
                        <div className="flex items-center gap-2 sm:gap-3 bg-black/40 backdrop-blur-md px-3 sm:px-4 py-2 rounded-xl border border-white/10">
                            <div className="flex items-center gap-1">
                                <FaStar className="text-yellow-400 text-base sm:text-lg" />
                                <span className="text-lg sm:text-xl font-bold text-white">
                                    {(info.detail.vote_average * 10).toFixed(0)}
                                </span>
                                <span className="text-sm sm:text-base text-zinc-300">%</span>
                            </div>
                            <span className="text-xs sm:text-sm text-zinc-400 hidden sm:inline">User Score</span>
                        </div>

                        {/* Release Date */}
                        {info.detail.release_date && (
                            <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 sm:px-4 py-2 rounded-xl border border-white/10">
                                <FaCalendarAlt className="text-indigo-400 text-sm sm:text-base" />
                                <span className="text-sm sm:text-base">{info.detail.release_date}</span>
                            </div>
                        )}

                        {/* Runtime */}
                        {info.detail.runtime && (
                            <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 sm:px-4 py-2 rounded-xl border border-white/10">
                                <FaClock className="text-indigo-400 text-sm sm:text-base" />
                                <span className="text-sm sm:text-base">{info.detail.runtime} min</span>
                            </div>
                        )}

                        {/* Genres */}
                        {info.detail.genres && info.detail.genres.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {info.detail.genres.map((g, idx) => (
                                    <span 
                                        key={idx}
                                        className="px-3 py-1.5 bg-indigo-600/30 backdrop-blur-sm rounded-lg text-xs sm:text-sm font-medium border border-indigo-500/30"
                                    >
                                        {g.name}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Tagline */}
                    {info.detail.tagline && (
                        <p className="text-lg sm:text-xl md:text-2xl font-semibold italic text-zinc-300 mb-4 sm:mb-6">
                            "{info.detail.tagline}"
                        </p>
                    )}

                    {/* Overview */}
                    <div className="mb-6 sm:mb-8">
                        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                            Overview
                        </h2>
                        <p className="text-base sm:text-lg text-zinc-200 leading-relaxed">
                            {info.detail.overview}
                        </p>
                    </div>

                    {/* Translations */}
                    {info.translations && info.translations.length > 0 && (
                        <div className="mb-6 sm:mb-8">
                            <h2 className="text-xl sm:text-2xl font-bold mb-3 text-zinc-300">Available Languages</h2>
                            <div className="flex flex-wrap gap-2">
                                {info.translations.map((lang, idx) => (
                                    <span 
                                        key={idx}
                                        className="px-3 py-1.5 bg-zinc-800/50 backdrop-blur-sm rounded-lg text-sm border border-zinc-700/50"
                                    >
                                        {lang}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-wrap max-md:justify-center gap-3 sm:gap-4 mb-6 sm:mb-8">
                        <Link
                            className="px-5 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-xl font-semibold text-white shadow-lg shadow-indigo-500/50 transform transition-all duration-300 hover:scale-105 hover:shadow-xl active:scale-95 flex items-center gap-2 sm:gap-3 text-sm sm:text-base"
                            to={`${pathname}/trailer`}
                        >
                            <FaPlay className="text-base sm:text-lg" />
                            <span>Play Trailer</span>
                        </Link>
                        <Link
                            className="px-5 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 rounded-xl font-semibold text-white shadow-lg shadow-green-500/50 transform transition-all duration-300 hover:scale-105 hover:shadow-xl active:scale-95 flex items-center gap-2 sm:gap-3 text-sm sm:text-base"
                            to={`/movie/datails/${id}/moviepalyer`}
                        >
                            <FaPlay className="text-base sm:text-lg" />
                            <span>Watch Now</span>
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
            {info.watchproviders && (info.watchproviders.flatrate || info.watchproviders.rent || info.watchproviders.buy) && (
                <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col gap-6 sm:gap-8 mt-8 sm:mt-12 mb-8 sm:mb-12 px-4 sm:px-6">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-4">
                        Where to Watch
                    </h2>
                    
                    {info.watchproviders.flatrate && (
                        <div className="bg-zinc-900/50 backdrop-blur-md rounded-xl p-4 sm:p-6 border border-zinc-800/50">
                            <h3 className="text-lg sm:text-xl font-semibold text-white mb-4 flex items-center gap-2">
                                <span className="text-green-400">●</span>
                                Stream Now
                            </h3>
                            <div className="flex flex-wrap gap-4 sm:gap-6">
                                {info.watchproviders.flatrate.map((w, i) => (
                                    <div
                                        key={i}
                                        className="group relative"
                                        title={w.provider_name}
                                    >
                                        <img
                                            className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-lg border-2 border-zinc-700/50 group-hover:border-indigo-500/50 transition-all duration-300 transform group-hover:scale-110"
                                            src={`https://image.tmdb.org/t/p/original/${w.logo_path}`}
                                            alt={w.provider_name}
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                            }}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {info.watchproviders.rent && (
                        <div className="bg-zinc-900/50 backdrop-blur-md rounded-xl p-4 sm:p-6 border border-zinc-800/50">
                            <h3 className="text-lg sm:text-xl font-semibold text-white mb-4 flex items-center gap-2">
                                <span className="text-yellow-400">●</span>
                                Rent
                            </h3>
                            <div className="flex flex-wrap gap-4 sm:gap-6">
                                {info.watchproviders.rent.map((w, i) => (
                                    <div
                                        key={i}
                                        className="group relative"
                                        title={w.provider_name}
                                    >
                                        <img
                                            className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-lg border-2 border-zinc-700/50 group-hover:border-yellow-500/50 transition-all duration-300 transform group-hover:scale-110"
                                            src={`https://image.tmdb.org/t/p/original/${w.logo_path}`}
                                            alt={w.provider_name}
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                            }}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {info.watchproviders.buy && (
                        <div className="bg-zinc-900/50 backdrop-blur-md rounded-xl p-4 sm:p-6 border border-zinc-800/50">
                            <h3 className="text-lg sm:text-xl font-semibold text-white mb-4 flex items-center gap-2">
                                <span className="text-blue-400">●</span>
                                Buy
                            </h3>
                            <div className="flex flex-wrap gap-4 sm:gap-6">
                                {info.watchproviders.buy.map((w, i) => (
                                    <div
                                        key={i}
                                        className="group relative"
                                        title={w.provider_name}
                                    >
                                        <img
                                            className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-lg border-2 border-zinc-700/50 group-hover:border-blue-500/50 transition-all duration-300 transform group-hover:scale-110"
                                            src={`https://image.tmdb.org/t/p/original/${w.logo_path}`}
                                            alt={w.provider_name}
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                            }}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Part 4 Reviews */}
            <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 mt-8 sm:mt-12 mb-8 sm:mb-12">
                <div className="h-px bg-gradient-to-r from-transparent via-zinc-600 to-transparent mb-8 sm:mb-10"></div>
                <Reviews movieId={parseInt(id)} mediaType="movie" />
                <ReviewForm movieId={parseInt(id)} mediaType="movie" />
            </div>

            {/* Part 5 Recommendations and Similar Stuff */}
            <div className="relative z-10 w-full px-4 sm:px-6 mt-8 sm:mt-12 mb-8 sm:mb-12">
                <div className="h-px bg-gradient-to-r from-transparent via-zinc-600 to-transparent mb-6 sm:mb-8"></div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-8 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Recommendations & Similar
                </h2>
                <HorizontalCards
                    title="movie"
                    data={
                        info.recommendations && info.recommendations.length > 0
                            ? info.recommendations
                            : info.similar || []
                    }
                />
            </div>
            <Outlet />
        </div>
    ) : (
        <Loading />
    );
};

export default Moviedetails;