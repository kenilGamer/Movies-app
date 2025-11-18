import React, { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import { useNavigate } from "react-router-dom";
import { FaLongArrowAltLeft } from "react-icons/fa";
import Sidenav from '../partials/sidenav';
import Topnev from '../partials/topnev';
import Dropdown from '../partials/Dropdown';
import axios from '../utils/axios';
import Loading from './Loading';
import Card from '../partials/Card';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useDebounce } from '../utils/useDebounce';

const Bollywood = React.memo(() => {
    const navigate = useNavigate();
    const [category, setCategory] = useState("trending"); // trending, popular
    const [movies, setMovies] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const abortControllerRef = useRef(null);

    // Debounce category changes
    const debouncedCategory = useDebounce(category, 300);

    // Memoize document title
    useMemo(() => {
        document.title = `Godcraft | Bollywood Movies`;
    }, []);

    const fetchBollywoodMovies = useCallback(async (currentPage = page, currentCategory = category) => {
        // Cancel previous request if exists
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        
        abortControllerRef.current = new AbortController();
        setIsLoading(true);
        setError(null);
        
        try {
            let endpoint;
            if (currentCategory === 'trending') {
                endpoint = `/bollywood/trending?page=${currentPage}`;
            } else {
                endpoint = `/bollywood?page=${currentPage}`;
            }
            
            console.log('Fetching Bollywood movies from:', endpoint);
            const { data } = await axios.get(endpoint, {
                signal: abortControllerRef.current.signal
            });
            
            console.log('Bollywood API response:', data);
            
            if (data && data.results) {
                if (data.results.length > 0) {
                    if (currentPage === 1) {
                        setMovies(data.results);
                    } else {
                        setMovies((prevState) => [...prevState, ...data.results]);
                    }
                    setPage(currentPage + 1);
                    setHasMore(data.page < data.total_pages);
                } else {
                    // No results but valid response
                    if (currentPage === 1) {
                        setMovies([]);
                    }
                    setHasMore(false);
                    if (currentPage === 1) {
                        setError('No Bollywood movies found. Try switching categories or check back later.');
                    }
                }
            } else {
                // Invalid response structure
                setError('Invalid response from server. Please try again.');
                setHasMore(false);
            }
        } catch (error) {
            if (error.name !== 'CanceledError' && error.code !== 'ERR_CANCELED') {
                console.error('Error fetching Bollywood movies:', error);
                const errorMessage = error.response?.data?.message || 
                                   error.response?.data?.error || 
                                   error.message || 
                                   'Failed to load Bollywood movies. Please check your connection and try again.';
                setError(errorMessage);
                setHasMore(false);
            }
        } finally {
            setIsLoading(false);
        }
    }, [category, page]);

    const refreshMovies = useCallback(() => {
        setPage(1);
        setMovies([]);
        setHasMore(true);
        fetchBollywoodMovies(1, category);
    }, [category, fetchBollywoodMovies]);

    // Handle category change
    useEffect(() => {
        if (debouncedCategory === category) {
            refreshMovies();
        }
    }, [debouncedCategory]);

    // Initial load
    useEffect(() => {
        fetchBollywoodMovies(1, category);
        
        // Cleanup on unmount
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
            fetchBollywoodMovies();
        }
    }, [fetchBollywoodMovies, isLoading, hasMore]);

    // Show error state
    if (error && movies.length === 0 && !isLoading) {
        return (
            <>
                <Sidenav />
                <div className="w-full min-h-screen flex items-center justify-center">
                    <div className="text-center max-w-md mx-auto px-4">
                        <p className="text-red-400 mb-4 text-lg">{error}</p>
                        <div className="flex gap-3 justify-center">
                            <button 
                                onClick={() => {
                                    setError(null);
                                    setPage(1);
                                    setMovies([]);
                                    setHasMore(true);
                                    fetchBollywoodMovies(1, category);
                                }}
                                className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
                            >
                                Retry
                            </button>
                            <button 
                                onClick={() => {
                                    setError(null);
                                    setCategory(category === 'trending' ? 'popular' : 'trending');
                                    setPage(1);
                                    setMovies([]);
                                    setHasMore(true);
                                }}
                                className="px-6 py-3 bg-zinc-700 text-white rounded-lg hover:bg-zinc-600 transition-colors duration-200"
                            >
                                Try {category === 'trending' ? 'Popular' : 'Trending'}
                            </button>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    // Show loading only if we're actually loading and have no data
    if (isLoading && movies.length === 0) {
        return <Loading />;
    }

    return (
        <>
            {/* <Sidenav /> */}
            <div className='w-full min-h-screen py-3 select-auto animate-fadeIn'>
                <div className='w-full flex max-sm:flex-col sm:items-center gap-4 px-[3%] mb-6'>
                    <h1 
                        onClick={handleBack} 
                        className='text-2xl sm:text-3xl font-bold hover:text-indigo-400 flex items-center gap-2 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 cursor-pointer transition-all duration-300 group'
                    >
                        <FaLongArrowAltLeft className="text-zinc-400 group-hover:text-indigo-400 group-hover:-translate-x-1 transition-all duration-300" /> 
                        <span>Bollywood Movies</span>
                    </h1>
                    <Topnev />
                    <Dropdown 
                        title="Category" 
                        options={["trending", "popular"]} 
                        func={handleCategoryChange} 
                    />
                </div>
                {movies.length > 0 ? (
                    <InfiniteScroll
                        dataLength={movies.length}
                        next={loadMore}
                        hasMore={hasMore}
                        loader={
                            <div className="flex justify-center items-center py-8">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                                <span className="ml-4 text-zinc-400">Loading more movies...</span>
                            </div>
                        }
                    >
                        <Card data={movies} title="movie" />
                    </InfiniteScroll>
                ) : !isLoading ? (
                    <div className="text-center py-12">
                        <p className="text-zinc-400 text-xl mb-4">No Bollywood movies found</p>
                        {error && (
                            <p className="text-zinc-500 text-sm mb-4">{error}</p>
                        )}
                        <button 
                            onClick={() => {
                                setCategory(category === 'trending' ? 'popular' : 'trending');
                                setPage(1);
                                setMovies([]);
                                setHasMore(true);
                                setError(null);
                            }}
                            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
                        >
                            Try {category === 'trending' ? 'Popular' : 'Trending'} Movies
                        </button>
                    </div>
                ) : null}
            </div>
        </>
    );
});

Bollywood.displayName = 'Bollywood';

export default Bollywood;

