import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { FaLongArrowAltLeft } from "react-icons/fa";
import Topnev from '../partials/topnev';
import Dropdown from '../partials/Dropdown';
import axios from '../utils/axios';
import Loading from './Loading'; // Added import statement
import Card from '../partials/Card';
import InfiniteScroll from 'react-infinite-scroll-component';

const Trending = () => {
  const navigate = useNavigate();
  const [category, setCategory] = useState("all");
  const [duration, setDuration] = useState("day");
  const [trending, setTrending] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  document.title = `Trending | Godcrfts`;

  const handleCategoryChange = (event) => setCategory(event.target.value);
  const handleDurationChange = (event) => setDuration(event.target.value);

  const getTrending = async () => {
    try {
      const { data } = await axios.get(`/trending/${category}/${duration}?page=${page}`);
      if (data.results.length > 0) {
        setTrending((prevState) => [...prevState, ...data.results]);
        setPage(page + 1);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const refreshHandler = () => {
    if (trending.length === 0) {
      getTrending();
    } else {
      setPage(1);
      setTrending([]);
      getTrending();
    }
  };

  useEffect(() => {
    refreshHandler();
  }, [category, duration]);
  // console.log(trending);
  return (
    <div className='w-full min-h-screen py-3 select-auto animate-fadeIn'>
      <div className='w-full flex max-sm:flex-col sm:items-center gap-4 px-[3%] mb-6'>
        <h1 
          onClick={() => navigate(-1)} 
          className='text-2xl sm:text-3xl font-bold hover:text-indigo-400 flex items-center gap-2 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 cursor-pointer transition-all duration-300 group'
        >
          <FaLongArrowAltLeft className="text-zinc-400 group-hover:text-indigo-400 group-hover:-translate-x-1 transition-all duration-300" /> 
          <span>Trending</span>
        </h1>
        <Topnev lef={40} />
        <div className="flex flex-wrap gap-3 sm:gap-4">
          <Dropdown title={`Category`} options={["movie", "tv", "all"]} func={handleCategoryChange} />
          <Dropdown title={`Duration`} options={["week", "day"]} func={handleDurationChange} />
        </div>
      </div>
      <InfiniteScroll
        dataLength={trending.length}
        next={getTrending}
        hasMore={hasMore}
        loader={<Loading />} // Changed loader component
      >
        <Card data={trending} title={`Trending`} />
      </InfiniteScroll>
    </div>
  );
};

export default Trending;
