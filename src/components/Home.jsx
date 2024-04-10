/* eslint-disable no-unused-vars */
import React, { useEffect } from 'react'
import Sidenav from '../partials/sidenav'
import Topnev from '../partials/topnev'
import { useState } from 'react'
import axios from '../utils/axios'
import Headers from '../partials/headers'
import { RiH1 } from 'react-icons/ri'
import Horizontalcrads from '../partials/Horizontalcrads'
import Dropdown from '../partials/Dropdown'
import Loading from './Loading'
function Home() {

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const [wallpaper,setwallpaper] = useState(null)
  const [trending, settrending] = useState(null)
  const [category, setcategory] = useState("all")
  const GetHeaderWallpaper = async () => {
    try {
      const {data} = await axios.get(`/trending/all/day`);
      let randomdata = data.results[(Math.random() * data.results.length).toFixed()]
      setwallpaper(randomdata);
    } catch (error) {
      console.log(error);
    }
  }

  const GetTrending = async () => {
    try {
      const {data} = await axios.get(`/trending/${category}/day`);
      settrending(data.results);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(()=>{
    !wallpaper && GetHeaderWallpaper()
    GetTrending()
  },[category])
  return wallpaper && trending ? (
    document.title = "Home page for godcraft",
  <>
    <Sidenav/>
    <div className={`${isMenuOpen ? `w-[100%]` : `md:w-[100%]`} h-full overflow-auto overflow-x-hidden`}>
      <Topnev />
      <Headers data={wallpaper}/>

      <div className="mt-5 flex justify-between p-3">
        <h1 className="text-3xl uppercase text-center font-bold ">
          Trendings
        </h1>
        <Dropdown title="filter" options={["tv","movie","all"]} func={(e)=> setcategory(e.target.value)} />
      </div>

      <Horizontalcrads data={trending} />
    </div>
  </>
  ): <Loading/>
}

export default Home