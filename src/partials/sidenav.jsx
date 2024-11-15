import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AiOutlineFire } from "react-icons/ai";
import { SiCodemagic } from "react-icons/si";
import { MdOutlineMovieFilter } from "react-icons/md";
import { MdTv } from "react-icons/md";
import { RiTeamFill } from "react-icons/ri";
import axios from 'axios';
import { HiMenu } from "react-icons/hi";
import { IoMdClose } from "react-icons/io";
import { IoLogOut } from "react-icons/io5";
import { CgProfile } from "react-icons/cg";
import { useNavigate } from 'react-router-dom';
function Sidenav() {
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const navigate = useNavigate();
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('history');
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  return (
    <div className='relative  z-10'>
      <div className="md:hidden flex items-center justify-start ">
       <span>
       <button onClick={toggleMenu} className="text-xl text-white focus:outline-none p-2 rounded-lg absolute top-2 left-0 z-[1000]">
          {isMenuOpen ? <HiMenu/>  : <IoMdClose/>}
        </button>
       </span>
      </div>
     {isMobile === false ? ( <div className={` max-w-full overflow-hidden h-[100vh] border-r-[1px] p-1 sticky `}>
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
            <h1 className='text-white font-semibold text-md  md:mt-2 px-5 py-3 text-nowrap'>Account Information</h1>
            <Link to={`/profile`} className='hover:bg-[#6556cd] px-5 rounded-lg py-4 duration-500 flex items-center gap-2'><CgProfile/>Profile</Link>     
            <button onClick={handleLogout} className='hover:bg-[#5142b1] px-5 rounded-lg py-4 duration-500 flex items-center gap-2'><IoLogOut/>Logout</button>
          </nav>
        </div>
      </div>):(
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
            <h1 className='text-white font-semibold text-md  md:mt-2 px-5 py-3 text-nowrap'>Account Information</h1>
            <Link to={`/profile`} className='hover:bg-[#6556cd] px-5 rounded-lg py-4 duration-500 flex items-center gap-2'><CgProfile/>Profile</Link>     
            <button onClick={handleLogout} className='hover:bg-[#5142b1] px-5 rounded-lg py-4 duration-500 flex items-center gap-2'><IoLogOut/>Logout</button>
           </nav>
         </div>
       </div>
      )}
    </div>
  );
}

export default Sidenav;
