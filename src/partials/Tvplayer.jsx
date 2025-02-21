
import React from "react";
import ReactPlayer from "react-player";
import { useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import NotFound from "../components/notfound";
import axios from "axios";
// import plugin from "tailwindcss";
function TvPalyer() {
    
      document.title = `TV stream | Godcrfts`;
      const navigate = useNavigate();
      const { pathname } = useLocation();
      const category = pathname.includes("movie") ? "movie" : "tv";
      const tvid = useSelector((state) => state[category].info.detail.id);
      const tvepid = useSelector((state) => state[category].info.detail.number_of_episodes);
      const tvsid = useSelector((state) => state[category].info.detail.number_of_seasons);
      console.log(tvid);
     
    //   console.log(ytvideos.key);
      return (
        <div className="absolute overflow-hidden w-screen h-screen flex items-center justify-center bg-[#000000f5] top-0 left-0">
          <Link
            onClick={() => navigate(-1)}
            className="hover:text-[#6556CD] absolute text-2xl top-[5%] right-[5%] ri-close-fill"
          ></Link>
        {tvid ?  
        // <ReactPlayer
        //     controls={true}
        //     url={`https://www.youtube.com/watch?v=${ytvideos.key}`}
        //     // height={500}
        //     // width={1100}
        //     className="w-full"
        //   />
        <iframe src={`https://www.2embed.stream/embed/tv/${tvid}/${tvsid}/${tvepid}`} className="w-full h-full m-2"></iframe>
          :(
            <NotFound/>
          )}
        
        </div>
      )
    }
    
    
export default TvPalyer