import React from "react";
import ReactPlayer from "react-player";
import { useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import NotFound from "../components/notfound";
// import plugin from "tailwindcss";

function Trailer() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const category = pathname.includes("movie") ? "movie" : "tv";
  const ytvideos = useSelector((state) => state[category].info.videos);
  console.log(ytvideos);
  return (
    <div className="absolute overflow-hidden w-screen h-screen flex items-center justify-center bg-[#000000f5] top-0 left-0 ">
      <Link
        onClick={() => navigate(-1)}
        className="hover:text-[#6556CD] absolute text-2xl top-[5%] right-[5%] ri-close-fill"
      ></Link>
    {ytvideos ? <ReactPlayer
        controls={true}
        url={`https://www.youtube.com/watch?v=${ytvideos.key}`}
        // height={500}
        // width={1100}
        className="w-full"
      />:(
        <NotFound/>
      )}
    
    </div>
  )
}

export default Trailer;
