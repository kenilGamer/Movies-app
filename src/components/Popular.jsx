import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { FaLongArrowAltLeft } from "react-icons/fa";
import Topnev from '../partials/topnev';
import Dropdown from '../partials/Dropdown';
import axios from '../utils/axios';
import Loading from './Loading';
import Card from '../partials/Card';
import InfiniteScroll from 'react-infinite-scroll-component';
function Popular() {
    const navigate = useNavigate();
    const [category, setCategory] = useState("movie");
    const [popular, setpopular] = useState([]);
    const [page, setpage] = useState(1)
    const [hasmore, sethasmore] = useState(true)
    const handleCategoryChange = (event) => {
        setCategory(event.target.value);
      };
      document.title = "godcraft || popular " + category
      const Getpopular = async () => {
        try {
          const { data } = await axios.get(`${category}/popular?page=${page}`);
          // setpopular(data.results);
          if (data.results.length > 0) {
            setpopular((prevState)=> [...prevState,...data.results])
            setpage(page + 1)
          }else{
            sethasmore(false)
          }
        } catch (error) {
          console.log(error);
        }
      };
      const refershHandler =  () => {
        if(popular.length === 0){
          Getpopular()
        }else{
          setpage(1)
          setpopular([])
          Getpopular()
        }
      }
      useEffect(() => {
        refershHandler()
      }, [category]);
    
      return popular.length > 0 ? (
        <div className='w-full min-h-screen  py-3 select-auto overflow-hidden overflow-y-auto '>
          <div className='w-full flex items-center gap-4 px-[3%]'>
            <h1 onClick={() => navigate(-1)} className='text-2xl font-semibold hover:text-blue-500 flex items-center text-zinc-400'>
              <FaLongArrowAltLeft className='' /> Popular 
            </h1>
            <Topnev />
            <Dropdown title={`Category`} options={["movie", "tv"]} func={(e)=> setCategory(e.target.value)} />
            {/* <Dropdown title={`Duration`} className="opacity-0 top-1" options={["week", "day"]} func={(e)=> (e.target.value)}/> */}
          </div>
          <InfiniteScroll
          dataLength={popular.length}
          next={Getpopular}
          hasMore={hasmore}
          loader={<h1>loading</h1>}
          >
          <Card data={popular} title={category} />
          </InfiniteScroll>
          {/* Render trending content */}
        </div>
      ) : <Loading />;
}

export default Popular