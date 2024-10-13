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
    const [popular, setPopular] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const handleCategoryChange = (event) => {
        setCategory(event.target.value);
    };

    document.title = `godcraft || popular ${category}`;

    const fetchPopular = async () => {
        try {
            const { data } = await axios.get(`${category}/popular?page=${page}`);
            if (data.results.length > 0) {
                setPopular((prevState) => [...prevState, ...data.results]);
                setPage(page + 1);
            } else {
                setHasMore(false);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const refreshHandler = () => {
        if (popular.length === 0) {
            fetchPopular();
        } else {
            setPage(1);
            setPopular([]);
            fetchPopular();
        }
    };

    useEffect(() => {
        refreshHandler();
    }, [category]);

    return popular.length > 0 ? (
        <div className='w-full min-h-screen py-3 select-auto overflow-hidden overflow-y-auto'>
            <div className='w-full flex items-center gap-4 px-[3%]'>
                <h1 onClick={() => navigate(-1)} className='text-2xl font-semibold hover:text-blue-500 flex items-center text-zinc-400'>
                    <FaLongArrowAltLeft /> Popular 
                </h1>
                <Topnev />
                <Dropdown title={`Category`} options={["movie", "tv"]} func={(e) => setCategory(e.target.value)} />
                {/* <Dropdown title={`Duration`} className="opacity-0 top-1" options={["week", "day"]} func={(e) => (e.target.value)}/> */}
            </div>
            <InfiniteScroll
                dataLength={popular.length}
                next={fetchPopular}
                hasMore={hasMore}
                loader={<h1>Loading...</h1>}
            >
                <Card data={popular} title={category} />
            </InfiniteScroll>
            {/* Render trending content */}
        </div>
    ) : <Loading />;
}

export default Popular;