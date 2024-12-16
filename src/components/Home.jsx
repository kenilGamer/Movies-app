/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import Sidenav from '../partials/sidenav'
import Topnev from '../partials/topnev'
import axios from '../utils/axios'
import Headers from '../partials/headers'
import Horizontalcrads from '../partials/Horizontalcrads'
import Dropdown from '../partials/Dropdown'
import Loading from './Loading'
import { RiH1 } from 'react-icons/ri'

function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const [wallpaper, setWallpaper] = useState(null);
  const [trending, setTrending] = useState(null);
  const [category, setCategory] = useState("all");

  const setIsMenu = () => setIsMenuOpen(prevState => !prevState);

  const getHeaderWallpaper = async () => {
    try {
      const { data } = await axios.get(`/trending/all/day`);
      console.log(data);
      
      const randomIndex = Math.floor(Math.random() * data.results.length);
      setWallpaper(data.results[randomIndex]);
    } catch (error) {
      console.error(error);
    }
  };

  const getTrending = async () => {
    try {
      const { data } = await axios.get(`/trending/${category}/day`);
      setTrending(data.results);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!wallpaper) getHeaderWallpaper();
    getTrending();
  }, [category]);

  if (!wallpaper || !trending) return <Loading />;

  return (
    <>
      <Sidenav />
      <div className={`${isMenuOpen ? `w-[100%]` : `md:w-[100%]`} h-full overflow-auto overflow-x-hidden`}>
        <Topnev />
        <Headers data={wallpaper} />
        <div className="mt-5 flex justify-between p-3 max-sm:flex-col items-center">
          <h1 className="text-3xl uppercase text-center font-bold">
            Trendings
          </h1>
          <Dropdown title="filter" options={["tv", "movie", "all"]} func={(e) => setCategory(e.target.value)} />
        </div>
        <Horizontalcrads data={trending} />
      </div>
    </>
  );
}

export default Home
