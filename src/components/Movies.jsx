import React, { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import Card from "../partials/Card";
import Dropdown from "../partials/Dropdown";
import Topnev from "../partials/topnev";
import axios from "../utils/axios";
import { useNavigate } from "react-router-dom";
import Loading from "./Loading";
import { FaLongArrowAltLeft } from "react-icons/fa";

function Movies() {
  document.title = "Godcrfts | Movies";
  const [history, setHistory] = useState([]);
  const navigate = useNavigate();
  const [category, setCategory] = useState("now_playing");
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  
  const fetchMovies = async () => {
    try {
      const { data } = await axios.get(`/movie/${category}?language=en-US&origin_country=IN&page=${page}`);
      if (data.results.length > 0) {
        localStorage.setItem("history", JSON.stringify([...history, ...data.results]));
        
        setHistory(prevState => [...prevState, ...data.results]);
        setMovies(prevState => [...prevState, ...data.results]);
        setPage(page + 1);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching movies: ", error);
    }
  };

  const refreshMovies = () => {
    if (movies.length === 0) {
      fetchMovies();
    } else {
      setPage(1);
      setMovies([]);
      fetchMovies();
    }
  };

  useEffect(() => {
    refreshMovies();
  }, [category]);

  return movies.length > 0 ? (
    <div className="w-full min-h-screen py-3 select-auto">
      <div className="w-full flex max-sm:flex-col sm:items-center gap-4 px-[3%]">
        <h1
          onClick={() => navigate(-1)}
          className="text-2xl font-semibold hover:text-blue-500 flex items-center text-zinc-400"
        >
          <FaLongArrowAltLeft /> Movies
        </h1>
        <Topnev left={40} />
        <Dropdown
          title="Category"
          options={["popular", "top_rated", "upcoming", "now_playing"]}
          onChange={(e) => setCategory(e.target.value)}
        />
      </div>
      <InfiniteScroll
        dataLength={movies.length}
        next={fetchMovies}
        hasMore={hasMore}
        loader={<h1>Loading...</h1>}
      >
        <Card data={movies} title="movie" />
      </InfiniteScroll>
    </div>
  ) : (
    <Loading />
  );
}

export default Movies;
