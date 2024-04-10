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

  const navigate = useNavigate();
  const [category, setcategory] = useState("now_playing");
  const [movie, setmovie] = useState([]);
  const [page, setpage] = useState(1);
  const [hasMore, sethasMore] = useState(true);

  const GetMovie = async () => {
    try {
      const { data } = await axios.get(
        `/movie/${category}?language=en-US&page=${page}`
      );
      if (data.results.length > 0) {
        setmovie((prevState) => [...prevState, ...data.results]);
        setpage(page + 1);
      } else {
        sethasMore(false);
      }
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  const refershHandler = () => {
    if (movie.length === 0) {
      GetMovie();
    } else {
      setpage(1);
      setmovie([]);
      GetMovie();
    }
  };

  useEffect(() => {
    refershHandler();
  }, [category]);

  return movie.length > 0 ? (
    <div className="w-full min-h-screen   py-3 select-auto ">
      <div className="w-full flex max-sm:flex-col sm:items-center gap-4 px-[3%]">
        <h1
          onClick={() => navigate(-1)}
          className="text-2xl font-semibold hover:text-blue-500 flex items-center text-zinc-400"
        >
          <FaLongArrowAltLeft className="" /> Movies
        </h1>
        <Topnev lef={40} />
        <Dropdown
          title="Category"
          options={["popular", "top_rated", "upcoming", "now_playing"]}
          func={(e) => setcategory(e.target.value)}
        />
      </div>
      <InfiniteScroll
        dataLength={movie.length}
        next={GetMovie}
        hasMore={hasMore}
        loader={<h1>Loading...</h1>}
      >
        <Card data={movie} title="movie" />
      </InfiniteScroll>
      {/* Render trending content */}
    </div>
  ) : (
    <Loading />
  );
}

export default Movies;
{
  /* <InfiniteScroll
dataLength={movie.length}
next={GetMovie}
hasMore={hasMore}
loader={<h1>Loading...</h1>}
>
<Card data={movie} title="movie" />
</InfiniteScroll> */
}

{
  /* <Dropdown
title="Category"
options={[
    "popular",
    "top_rated",
    "upcoming",
    "now_playing",
]}
func={(e) => setcategory(e.target.value)}
/> */
}
