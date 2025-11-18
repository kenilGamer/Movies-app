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
        <div className='w-full min-h-screen py-3 select-auto overflow-hidden overflow-y-auto animate-fadeIn'>
            <div className='w-full flex max-sm:flex-col sm:items-center gap-4 px-[3%] mb-6'>
                <h1 
                    onClick={handleBack} 
                    className='text-2xl sm:text-3xl font-bold hover:text-indigo-400 flex items-center gap-2 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 cursor-pointer transition-all duration-300 group'
                >
                    <FaLongArrowAltLeft className="text-zinc-400 group-hover:text-indigo-400 group-hover:-translate-x-1 transition-all duration-300" /> 
                    <span>Popular</span>
                </h1>
                <Topnev />
                <Dropdown title={`Category`} options={["movie", "tv"]} func={handleCategoryChange} />
            </div>
            <InfiniteScroll
                dataLength={popular.length}
                next={loadMore}
                hasMore={hasMore}
                loader={
                    <div className="flex justify-center items-center py-8">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                        <span className="ml-4 text-zinc-400">Loading more...</span>
                    </div>
                }
            >
                <Card data={popular} title={category} />
            </InfiniteScroll>
        </div>
    ) : <Loading />;
});

Popular.displayName = 'Popular';

export default Popular;