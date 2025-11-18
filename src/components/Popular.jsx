import React, { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import { useNavigate } from "react-router-dom";
import { FaLongArrowAltLeft } from "react-icons/fa";
import Topnev from '../partials/topnev';
import Dropdown from '../partials/Dropdown';
import axios from '../utils/axios';
import Loading from './Loading';
import Card from '../partials/Card';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useDebounce } from '../utils/useDebounce';

const Popular = React.memo(() => {
    const navigate = useNavigate();
    const [category, setCategory] = useState("movie");
    const [popular, setPopular] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const abortControllerRef = useRef(null);

    // Debounce category changes
    const debouncedCategory = useDebounce(category, 300);

    // Memoize document title
    useMemo(() => {
        document.title = `godcraft || popular ${category}`;
    }, [category]);

    const fetchPopular = useCallback(async (currentPage = page, currentCategory = category) => {
        // Cancel previous request if exists
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        
        abortControllerRef.current = new AbortController();
        setIsLoading(true);
        
        try {
            const { data } = await axios.get(`${currentCategory}/popular?page=${currentPage}`, {
                signal: abortControllerRef.current.signal
            });
            
            if (data.results && data.results.length > 0) {
                if (currentPage === 1) {
                    setPopular(data.results);
                } else {
                    setPopular((prevState) => [...prevState, ...data.results]);
                }
                setPage(currentPage + 1);
                setHasMore(true);
            } else {
                setHasMore(false);
            }
        } catch (error) {
            if (error.name !== 'CanceledError') {
                console.error('Error fetching popular:', error);
                setHasMore(false);
            }
        } finally {
            setIsLoading(false);
        }
    }, [category, page]);

    const refreshHandler = useCallback(() => {
        setPage(1);
        setPopular([]);
        setHasMore(true);
        fetchPopular(1, category);
    }, [category, fetchPopular]);

    // Handle category change
    useEffect(() => {
        if (debouncedCategory === category) {
            refreshHandler();
        }
    }, [debouncedCategory]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, []);

    const handleCategoryChange = useCallback((event) => {
        setCategory(event.target.value);
    }, []);

    const handleBack = useCallback(() => {
        navigate(-1);
    }, [navigate]);

    const loadMore = useCallback(() => {
        if (!isLoading && hasMore) {
            fetchPopular();
        }
    }, [fetchPopular, isLoading, hasMore]);

    return popular.length > 0 ? (
        <div className='w-full min-h-screen py-3 select-auto overflow-hidden overflow-y-auto'>
            <div className='w-full flex items-center gap-4 px-[3%]'>
                <h1 onClick={handleBack} className='text-2xl font-semibold hover:text-blue-500 flex items-center text-zinc-400 cursor-pointer'>
                    <FaLongArrowAltLeft /> Popular 
                </h1>
                <Topnev />
                <Dropdown title={`Category`} options={["movie", "tv"]} func={handleCategoryChange} />
            </div>
            <InfiniteScroll
                dataLength={popular.length}
                next={loadMore}
                hasMore={hasMore}
                loader={<h1>Loading...</h1>}
            >
                <Card data={popular} title={category} />
            </InfiniteScroll>
        </div>
    ) : <Loading />;
});

Popular.displayName = 'Popular';

export default Popular;