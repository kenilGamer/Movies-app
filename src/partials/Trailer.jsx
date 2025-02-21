import React from "react";
import ReactPlayer from "react-player";
import { useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import NotFound from "../components/notfound";
function Trailer() {
  document.title = `Trailer | Godcrfts`;
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const category = pathname.includes("movie") ? "movie" : "tv";
  const ytvideos = useSelector((state) => state[category].info.videos);
  
  console.log(ytvideos.key);
  return (
    <div className="absolute overflow-hidden w-screen h-screen flex items-center justify-center bg-[#000000f5] top-0 left-0 ">
      <Link
        onClick={() => navigate(-1)}
        className="hover:text-[#6556CD] absolute text-2xl top-[5%] right-[5%] ri-close-fill"
      ></Link>
    {ytvideos ?  
    <iframe src={`https://www.youtube.com/embed/${ytvideos.key}`} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" frameborder="0" allowfullscreen className="w-full h-full m-2"></iframe>
      :(
        <NotFound/>
      )}
    
    </div>
  )
}

export default Trailer;
