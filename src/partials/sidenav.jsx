import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { AiOutlineFire } from "react-icons/ai";
import { SiCodemagic } from "react-icons/si";
import { MdOutlineMovieFilter } from "react-icons/md";
import { MdTv } from "react-icons/md";
import { RiTeamFill } from "react-icons/ri";
import { HiOutlinePhoneIncoming } from "react-icons/hi";
import { MdInfoOutline } from "react-icons/md";
import axios from 'axios';
function Sidenav() {

  return (
    <div className='w-[20%] h-screen border-r-[1px] p-3 sticky'>
      <h1 className='flex items-center text-[2vw] tracking-wider font-bold font1 uppercase'>
        {/* <img src="/public/logo.gif" alt="" /> */}
        <video src="/logo.webm" className='w-[5vw]'   autoPlay loop muted></video>
        godcrafts
        </h1>
        <nav className='flex flex-col text-xl'>
          <h1 className='text-white font-semibold text-xl p-5 '>New Feeds</h1>
          <Link to={`/trending`} className='hover:bg-[#6556cd] px-5 rounded-lg py-3 duration-500 flex items-center gap-2'><AiOutlineFire />Trending</Link>
          <Link to={`/popular`} className='hover:bg-[#6556cd] px-5 rounded-lg py-3 duration-500 flex items-center gap-2'><SiCodemagic className='mt-2'/>popular</Link>          
          <Link to={`/movies`} className='hover:bg-[#6556cd] px-5 rounded-lg py-3 duration-500 flex items-center gap-2'><MdOutlineMovieFilter/>Movies</Link>
          <Link to={`/ty`} className='hover:bg-[#6556cd] px-5 rounded-lg py-3 duration-500 flex items-center gap-2'><MdTv/> Tv shows</Link>
          <Link to={`/people`} className='hover:bg-[#6556cd] px-5  rounded-lg duration-500 flex items-center gap-2 mb-2 py-3'><RiTeamFill className='mt-1'/> people</Link>
        </nav>
        <hr />
        <nav className='flex flex-col text-xl'>
          <h1 className='text-white font-semibold text-xl mt-2 px-5 py-3 '>Website Information</h1>
          <Link className='hover:bg-[#6556cd] px-5 rounded-lg py-4 duration-500 flex items-center gap-2'><MdInfoOutline/>About</Link>    
          <Link className='hover:bg-[#5142b1] px-5 rounded-lg py-4  duration-500 flex items-center gap-2'><HiOutlinePhoneIncoming/>Contect Us</Link>
        </nav>
    </div>
  )
}

export default Sidenav