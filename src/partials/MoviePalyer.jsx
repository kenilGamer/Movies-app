
import React from "react";
import ReactPlayer from "react-player";
import { useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import NotFound from "../components/notfound";
import axios from "axios";
// import plugin from "tailwindcss";
function MoviePalyer() {
    
      document.title = `Trailer | Godcrfts`;
      const navigate = useNavigate();
      const { pathname } = useLocation();
      const category = pathname.includes("movie") ? "movie" : "tv";
      const movieid = useSelector((state) => state[category].info.externalid.id);

   
     const callapi = async () => {
        const movieapi = await axios.get(` https://www.2embed.skin/
/embed/950396`);
        console.log(movieapi);
     }
     callapi();
      
    //   console.log(ytvideos.key);
      return (
        <div className="absolute overflow-hidden w-screen h-screen flex items-center justify-center bg-[#000000f5] top-0 left-0">
          <Link
            onClick={() => navigate(-1)}
            className="hover:text-[#6556CD] absolute text-2xl top-[5%] right-[5%] ri-close-fill"
          ></Link>
        {movieid ?  
        // <ReactPlayer
        //     controls={true}
        //     url={`https://www.youtube.com/watch?v=${ytvideos.key}`}
        //     // height={500}
        //     // width={1100}
        //     className="w-full"
        //   />
        <iframe src={`https://www.2embed.stream/embed/movie/${movieid}`}  className="w-full h-full m-2"></iframe>
          :(
            <NotFound/>
          )}
        
        </div>
      )
    }
    
    
export default MoviePalyer