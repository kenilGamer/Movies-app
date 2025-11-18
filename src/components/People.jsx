import React, { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import Card from '../partials/Card';
import Dropdown from '../partials/Dropdown';
import Topnev from '../partials/topnev';
import axios from '../utils/axios';
import { useNavigate } from 'react-router-dom';
import Loading from './Loading';
import { FaLongArrowAltLeft } from 'react-icons/fa';

function People() {
    const navigate = useNavigate();
    const [category, setCategory] = useState("popular");
    const [people, setPeople] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    document.title = `People | Godcrfts`;
    const fetchPeople = async () => {
        try {
            const response = await axios.get(`/person/${category}?page=${page}`);
            const data = response.data;
            if (data.results.length > 0) {
                setPeople(prevState => [...prevState, ...data.results]);
                setPage(page + 1);
            } else {
                setHasMore(false);
            }
        } catch (error) {
            console.error("Error fetching people: ", error);
            setHasMore(false);
        }
    };

    const refreshPeople = () => {
        if (people.length === 0) {
            fetchPeople();
        } else {
            setPage(1);
            setPeople([]);
            fetchPeople();
        }
    };

    useEffect(() => {
        refreshPeople();
    }, [category]);

    return people.length > 0 ? (
        <div className="w-full min-h-screen py-3 select-auto animate-fadeIn">
            <div className="w-full flex max-sm:flex-col sm:items-center gap-4 px-[3%] mb-6">
                <h1 
                    onClick={() => navigate(-1)} 
                    className="text-2xl sm:text-3xl font-bold hover:text-indigo-400 flex items-center gap-2 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 cursor-pointer transition-all duration-300 group"
                >
                    <FaLongArrowAltLeft className="text-zinc-400 group-hover:text-indigo-400 group-hover:-translate-x-1 transition-all duration-300" /> 
                    <span>People</span>
                    <small className="ml-2 text-sm sm:text-base text-zinc-500 font-normal">
                        ({category})
                    </small>
                </h1>
                <div className="flex items-center flex-1">
                    <Topnev />
                </div>
                <Dropdown title="Category" options={["popular"]} func={(e) => setCategory(e.target.value)} />
            </div>

            <InfiniteScroll
                dataLength={people.length}
                next={fetchPeople}
                hasMore={hasMore}
                loader={
                    <div className="flex justify-center items-center py-8">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                        <span className="ml-4 text-zinc-400">Loading more people...</span>
                    </div>
                }
            >
                <Card data={people} title="People" />
            </InfiniteScroll>
        </div>
    ) : (
        <Loading />
    );
}

export default People;