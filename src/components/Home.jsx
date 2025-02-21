/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useCallback } from "react";
import Sidenav from "../partials/sidenav";
import Topnev from "../partials/topnev";
import axios from "../utils/axios";
import Headers from "../partials/headers";
import Horizontalcrads from "../partials/Horizontalcrads";
import Dropdown from "../partials/Dropdown";
import Loading from "./Loading";

function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const [wallpaper, setWallpaper] = useState(null);
  const [trending, setTrending] = useState([]);
  const [category, setCategory] = useState("all");

  const toggleMenu = () => setIsMenuOpen(prev => !prev);

  // Fetch header wallpaper once on mount
  const getHeaderWallpaper = useCallback(async () => {
    try {
      const { data } = await axios.get(`/trending/all/day`);
      const randomIndex = Math.floor(Math.random() * data.results.length);
      setWallpaper(data.results[randomIndex]);
    } catch (error) {
      console.error("Error fetching wallpaper:", error);
    }
  }, []);

  // Fetch trending content based on category
  const getTrending = useCallback(async () => {
    try {
      const { data } = await axios.get(`/trending/${category}/day`);
      setTrending(data.results || []);
    } catch (error) {
      console.error("Error fetching trending data:", error);
    }
  }, [category]);

  useEffect(() => {
    getHeaderWallpaper();
  }, [getHeaderWallpaper]);

  useEffect(() => {
    getTrending();
  }, [getTrending]);

  if (!wallpaper || trending.length === 0) return <Loading />;

  return (
    <>
      <Sidenav />
      <div className={`${isMenuOpen ? "w-full" : "md:w-full"} h-full overflow-auto overflow-x-hidden`}>
        <Topnev />
        <Headers data={wallpaper} />
        <div className="mt-5 flex justify-between p-3 max-sm:flex-col items-center">
          <h1 className="text-3xl uppercase text-center font-bold">Trendings</h1>
          <Dropdown
            title="Filter"
            options={["tv", "movie", "all"]}
            onChange={(value) => setCategory(value)}
          />
        </div>
        <Horizontalcrads data={trending} />
      </div>
    </>
  );
}

export default Home;
