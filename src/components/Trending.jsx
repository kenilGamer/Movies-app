import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { FaLongArrowAltLeft } from "react-icons/fa";
import Topnev from '../partials/topnev';
import Dropdown from '../partials/Dropdown';
import axios from '../utils/axios';
import Loading from './Loading';
import Card from '../partials/Card';
import InfiniteScroll from 'react-infinite-scroll-component';
function Trending() {
  const navigate = useNavigate();
  const [category, setCategory] = useState("all");
  const [duration, setDuration] = useState("day");
  const [trending, setTrending] = useState([]);
  const [page, setpage] = useState(1)
  const [hasmore, sethasmore] = useState(true)
  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
  };
  document.title = "godcraft || Trending " + category

  const handleDurationChange = (event) => {
    setDuration(event.target.value);
  };

  const GetTrending = async () => {
    try {
      const { data } = await axios.get(`/trending/${category}/${duration}?page=${page}`);
      // setTrending(data.results);
      if (data.results.length > 0) {
        setTrending((prevState)=> [...prevState,...data.results])
        setpage(page + 1)
      }else{
        sethasmore(false)
      }
    } catch (error) {
      console.log(error);
    }
  };
  const refershHandler =  () => {
    if(trending.length === 0){
      GetTrending()
    }else{
      setpage(1)
      setTrending([])
      GetTrending()
    }
  }
  useEffect(() => {
    refershHandler()
  }, [category, duration]);

  return trending.length > 0 ? (
    <div className='w-full min-h-screen  py-3 select-auto '>
      <div className='w-full flex max-sm:flex-col sm:items-center gap-4 px-[3%]'>
        <h1 onClick={() => navigate(-1)} className='text-2xl font-semibold hover:text-blue-500 flex items-center text-zinc-400'>
          <FaLongArrowAltLeft className='' /> Trending 
        </h1>
        <Topnev lef={40} />
        <Dropdown title={`Category`} options={["movie", "tv", "all"]} func={handleCategoryChange} />
        <Dropdown title={`Duration`} options={["week", "day"]} func={handleDurationChange} />
      </div>
      <InfiniteScroll
      dataLength={trending.length}
      next={GetTrending}
      hasMore={hasmore}
      loader={<h1>loading</h1>}
      >
      <Card data={trending} title={`trending`} />
      </InfiniteScroll>
      {/* Render trending content */}
    </div>
  ) : <Loading />;
}

export default Trending;
