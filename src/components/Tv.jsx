import React, { useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component';
import Card from '../partials/Card';
import Dropdown from '../partials/Dropdown';
import Topnev from '../partials/topnev';
import axios from '../utils/axios';
import { useNavigate } from 'react-router-dom';
import Loading from './Loading';
import { FaLongArrowAltLeft } from 'react-icons/fa';

function Tv() {
    document.title = "Godcrfts | tvs";

    const navigate = useNavigate();
    const [category, setcategory] = useState("airing_today");
    const [tv, settv] = useState([]);
    const [page, setpage] = useState(1);
    const [hasMore, sethasMore] = useState(true);

    const Gettv = async () => {
        try {
            const { data } = await axios.get(`/tv/${category}?page=${page}`);
            if (data.results.length > 0) {
                settv((prevState) => [...prevState, ...data.results]);
                setpage(page + 1);
            } else {
                sethasMore(false);
            }
        } catch (error) {
            console.log("Error: ", error);
        }
    };

    const refershHandler = () => {
        if (tv.length === 0) {
            Gettv();
        } else {
            setpage(1);
            settv([]);
            Gettv();
        }
    };

    useEffect(() => {
        refershHandler();
    }, [category]);

    return tv.length > 0 ? (
        <div className="w-screen h-screen ">
            <div className=" px-[5%] w-full flex items-center justify-between ">
                <h1 className=" text-2xl font-semibold text-zinc-400">
                    <i
                        onClick={() => navigate(-1)}
                        className="hover:text-[#6556CD] ri-arrow-left-line"
                    ></i>{" "}
                    tv
                    <small className="ml-2 text-sm text-zinc-600">
                        ({category})
                    </small>
                </h1>
                <div className="flex max-md:flex-col items-center w-[80%]">
                    <Topnev />
                    <Dropdown
                        title="Category"
                        options={[
                            "on_the_air",
                            "popular",
                            "top_rated",
                            "airing_today",
                        ]}
                        func={(e) => setcategory(e.target.value)}
                    />
                    <div className="w-[2%]"></div>
                </div>
            </div>

            <InfiniteScroll
                dataLength={tv.length}
                next={Gettv}
                hasMore={hasMore}
                loader={<h1>Loading...</h1>}
            >
                <Card data={tv} title="tv" />
            </InfiniteScroll>
        </div>
    ) : (
        <Loading />
    );
}

export default Tv