import React, { useEffect, useLayoutEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { asyncloadmovie, removemovie } from "../store/actions/movieActions";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FaLongArrowAltLeft } from "react-icons/fa";
import { FaEarthAmericas } from "react-icons/fa6";
import { HiOutlineExternalLink } from "react-icons/hi";
import { FaImdb } from "react-icons/fa";
import Loading from "../components/Loading";
function Moviedatails({}) {
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
  return info ? (
    <div
      style={{
        background: `linear-gradient(rgba(0,0,0,0.4),rgba(0,0,0,0.7),rgba(0,0,0,0.9)), url(https://image.tmdb.org/t/p/original/${info.detail.backdrop_path})  `,
        objectFit: "cover",
        backgroundPosition: "center",
        backgroundSize: "cover",
        // scale: "0.9",
        backgroundRepeat: "no-repeat",
      }}
      className="w-screen h-screen px-[5%] "
    >
      <nav className="w-full h-[10vh] text-2xl flex gap-10 items-center">
        <Link
          onClick={() => navigate(-1)}
          className="text-2xl font-semibold hover:text-blue-500 flex items-center"
        >
          <FaLongArrowAltLeft className="" /> Trending
        </Link>

        <Link target="_blank" to={info.detail.homepage}>
          <HiOutlineExternalLink />
        </Link>

        <Link
          target="_blank"
          to={`https://www.wikidata.org/wiki/${info.externalid.wikidata_id}`}
        >
          <FaEarthAmericas />
        </Link>

        <Link
          target="_blank"
          to={`https://www.imdb.com/title/${info.externalid.imdb_id}/`}
        >
          <FaImdb />
        </Link>
      </nav>

      <div className="w-full flex">
       <div>
       <img
          className="shadow-[8px_17px_38px_2px_rgba(0,0,0,.5)] h-[50vh] object-cover"
          src={`https://image.tmdb.org/t/p/original/${
            info.detail.poster_path || info.detail.backdrop_path
          }`}
          alt=""
        />
        <div className="mt-5 flex gap-3">
          {info.watchproviders && info.watchproviders.flatrate && info.watchproviders.flatrate.map(w => 
          <img
          className="w-[5vh] h-[5vh] object-cover rounded-lg "
          src={`https://image.tmdb.org/t/p/original/${
            w.logo_path
          }`}
          alt=""
        />)}
        {info.watchproviders && 
        info.watchproviders.rent && 
        info.watchproviders.rent.map(w => 
          <img
          className="w-[5vh] h-[5vh] object-cover rounded-lg "
          src={`https://image.tmdb.org/t/p/original/${
            w.logo_path
          }`}
          alt=""
        />)}
         {info.watchproviders && 
        info.watchproviders.buy && 
        info.watchproviders.buy.map(w => 
          <img
          className="w-[5vh] h-[5vh] object-cover rounded-lg "
          src={`https://image.tmdb.org/t/p/original/${
            w.logo_path
          }`}
          alt=""
        />)}
        </div>
       </div>
      </div>
    </div>
  ) : (
    <Loading />
  );
}

export default Moviedatails;
