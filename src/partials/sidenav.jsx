import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AiOutlineFire } from "react-icons/ai";
import { SiCodemagic } from "react-icons/si";
import { MdOutlineMovieFilter } from "react-icons/md";
import { MdTv } from "react-icons/md";
import { RiTeamFill } from "react-icons/ri";
import { HiOutlinePhoneIncoming } from "react-icons/hi";
import { MdInfoOutline } from "react-icons/md";
import axios from 'axios';
import { HiMenu } from "react-icons/hi";
import { IoMdClose } from "react-icons/io";
function Sidenav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className='relative '>
      <div className="md:hidden flex items-center justify-start ">
       <span>
       <button onClick={toggleMenu} className="text-xl text-white focus:outline-none">
          {isMenuOpen ? <IoMdClose/> : <HiMenu/>}
        </button>
       </span>
      </div>
      <div className={` max-w-full overflow-hidden h-[95vh] border-r-[1px] p-1 sticky ${isMenuOpen ? 'hidden' : '' }`}>
        <div className='flex flex-col text-xl'>
          <div className='w-full h-full'>
          <h1 className='flex items-center sm:justify-center md-sm:text-[30vw] md:text-xl tracking-wider font-bold font1 uppercase'>
            <video src="/logo.webm" className='md:w-[5vw] max-sm:w-[20vw] w-[10vw] ' autoPlay loop muted></video>
            godcrafts
          </h1>
          </div>
          <nav>
            <h1 className='text-white font-semibold text-lg p-5 '>New Feeds</h1>
            <Link to={`/trending`} className='hover:bg-[#6556cd] px-5 rounded-lg py-3 duration-500 flex items-center gap-2'><AiOutlineFire />Trending</Link>
            <Link to={`/popular`} className='hover:bg-[#6556cd] px-5 rounded-lg py-3 duration-500 flex items-center gap-2'><SiCodemagic className='mt-2'/>Popular</Link>          
            <Link to={`/movie`} className='hover:bg-[#6556cd] px-5 rounded-lg py-3 duration-500 flex items-center gap-2'><MdOutlineMovieFilter/>Movies</Link>
            <Link to={`/tv`} className='hover:bg-[#6556cd] px-5 rounded-lg py-3 duration-500 flex text-nowrap  items-center gap-2'><MdTv/>Tv Shows</Link>
            <Link to={`/people`} className='hover:bg-[#6556cd] px-5 rounded-lg duration-500 flex items-center gap-2 md:mb-2 py-3'><RiTeamFill className='mt-1'/> People</Link>
          </nav>
          <hr />
          <nav className='text-md'>
            <h1 className='text-white font-semibold text-md  md:mt-2 px-5 py-3 text-nowrap'>Website Information</h1>
            <Link className='hover:bg-[#6556cd] px-5 rounded-lg py-4 duration-500 flex items-center gap-2'><MdInfoOutline/>About</Link>    
            <Link className='hover:bg-[#5142b1] px-5 rounded-lg py-4 duration-500 flex items-center gap-2'><HiOutlinePhoneIncoming/>Contact</Link>
          </nav>
        </div>
      </div>
    </div>
  );
}

export default Sidenav;
