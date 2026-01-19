
import React from "react";
import ReactPlayer from "react-player";
import { useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import NotFound from "../components/notfound";
import axios from "axios";
import { FaTimes } from "react-icons/fa";
// import plugin from "tailwindcss";
function MoviePalyer() {
    
      document.title = `Movie Player | Godcrfts`;
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
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 backdrop-blur-md overflow-hidden">
          {/* Close button */}
          <button
            onClick={() => navigate(-1)}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 z-[10000] p-3 sm:p-4 bg-zinc-900/80 hover:bg-red-600/80 backdrop-blur-md rounded-full text-white transition-all duration-300 transform hover:scale-110 active:scale-95 shadow-lg shadow-black/50 group"
            aria-label="Close player"
          >
            <FaTimes className="text-xl sm:text-2xl group-hover:rotate-90 transition-transform duration-300" />
          </button>
          
          {/* Video container */}
          <div className="relative w-full h-full max-w-7xl mx-auto p-2 sm:p-4 z-[9999]">
            {movieid ?  
              <iframe 
                src={`https://www.2embed.stream/embed/movie/${movieid}`}  
                className="w-full h-full rounded-lg sm:rounded-xl border-2 border-zinc-800/50 shadow-2xl"
                allowFullScreen
                frameBorder="0"
                title="Movie Player"
              />
            :(
              <div className="flex items-center justify-center h-full">
                <NotFound/>
              </div>
            )}
          </div>
        </div>
      )
    }
    
    
export default MoviePalyer