import React, { useEffect } from 'react'
import { RiSearchEyeLine } from "react-icons/ri";
import { IoCloseSharp } from "react-icons/io5";
import { Link } from 'react-router-dom';
import { useState } from 'react';
import axios from '../utils/axios';
import { FaLeaf } from 'react-icons/fa';
function Topnev({lef}) {
  const [query,setquery] = useState("")
  const [searchs,setSearchs] = useState([])
  const GetSearchs = async () => {
    try {
      const response = await axios.get(`/search/multi?query=${query}`);// Log the entire response object to understand its structure
      setSearchs(response.data.results);
    } catch (error) {
      console.log(error);
    }
  }
  
  useEffect(()=>{
    GetSearchs()
  },[query])
  return (
    <div className='w-full h-[10vh]  relative flex sm:items-center justify-center'>
        {/* <IoCloseSharp className='text-3xl text-zinc-400'/> */}
       <div className='flex sm:items-center md:min-w-[40%] max-sm:w-[50vw] max-sm: max-sm:left-3 max-sm:absolute max-md:w-[70vw]'>
       <input onChange={((e)=>setquery(e.target.value))} value={query} className=' max-sm px-5 py-4 md:px-16 mt-5 outline-none text-zinc-200  font2 bg-[#20164d] rounded-full text-xl md:mx-1 flex items-center justify-center shadow-md shadow-[#000033] ' type="search" name="search" placeholder='search anything'/>
        <RiSearchEyeLine className={`text-3xl mt-5 text-zinc-400 -ml-16  `}/>
       </div>
       {/* ${lef && true ? "left-[34vw]" : " left-[52vw] "}/ */}
     {query.length > 0 &&  
      <div className='min-w-[40%] rounded-xl z-20 max-h-52 absolute top-[120%] py-3 px-1 bg-[#111] gap-2 flex flex-col overflow-auto'>
        {searchs.map((i,x)=>(
          <Link to={`/${i.media_type || title}/datails/${i.id}`} key={x} className=' hover:bg-[#6556cd] min-h-[15vh] overflow-hidden  duration-500  hover:border-none p-4 flex items-center justify-between px-10 border-[1px] rounded-full  w-full'>
            
          <span className=' max-sm:text-xs '>{i.titlel || i.original_name || i.original_title}</span>
          <img src={`https://image.tmdb.org/t/p/original/${i.poster_path || i.backdrop_path || i.profile_path}`} className='md:w-[10vw] max-sm:w-[20vw] rounded-xl overflow-hidden' alt={``} />
          </Link>
        ))}
       </div>}
    </div>
  )
}

export default Topnev