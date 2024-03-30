import React, { useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component';
import Card from '../partials/Card';
import Dropdown from '../partials/Dropdown';
import Topnev from '../partials/topnev';
import axios from '../utils/axios';
import { useNavigate } from 'react-router-dom';
import Loading from './Loading';
import { FaLongArrowAltLeft } from 'react-icons/fa';

function Movies() {
    document.title = "Godcrfts | Movies";

    const navigate = useNavigate();
    const [category, setcategory] = useState("now_playing");
    const [movie, setmovie] = useState([]);
    const [page, setpage] = useState(1);
    const [hasMore, sethasMore] = useState(true);

    const GetMovie = async () => {
        try {
            const { data } = await axios.get(`/movie/${category}?language=en-US&page=${page}`);
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
        <div className="w-screen h-screen max-md:flex max-md:flex-col ">
            <div className=" px-[5%] w-full flex items-center justify-between flex-wrap ">
                <h1 className=" text-2xl font-semibold text-zinc-400">
                    <i
                        onClick={() => navigate(-1)}
                        className="hover:text-[#6556CD] ri-arrow-left-line"
                    ></i>{" "}
                    Movie
                    <small className="ml-2 text-sm text-zinc-600">
                        ({category})
                    </small>
                </h1>
                <div className="flex items-center flex-wrap w-[80%]">
                    <Topnev />
                    <Dropdown
                        title="Category"
                        options={[
                            "popular",
                            "top_rated",
                            "upcoming",
                            "now_playing",
                        ]}
                        func={(e) => setcategory(e.target.value)}
                    />
                    <div className="w-[2%]"></div>
                </div>
            </div>

            <InfiniteScroll
                dataLength={movie.length}
                next={GetMovie}
                hasMore={hasMore}
                loader={<h1>Loading...</h1>}
            >
                <Card data={movie} title="movie" />
            </InfiniteScroll>
        </div>
    ) : (
        <Loading />
    );
}

export default Movies