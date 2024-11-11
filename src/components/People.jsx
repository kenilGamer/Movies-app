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
        <div className="w-screen h-screen">
            <div className="px-[5%] w-full flex items-center justify-between">
                <h1 className="text-2xl font-semibold text-zinc-400">
                    <FaLongArrowAltLeft onClick={() => navigate(-1)} className="hover:text-[#6556CD]" /> People
                    <small className="ml-2 text-sm text-zinc-600">
                        ({category})
                    </small>
                </h1>
                <div className="flex items-center w-[80%]">
                    <Topnev />
                </div>
            </div>

            <InfiniteScroll
                dataLength={people.length}
                next={fetchPeople}
                hasMore={hasMore}
                loader={<h1>Loading...</h1>}
            >
                <Card data={people} title="People" />
            </InfiniteScroll>
        </div>
    ) : (
        <Loading />
    );
}

export default People;