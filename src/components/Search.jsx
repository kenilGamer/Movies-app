import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FaLongArrowAltLeft, FaSearch } from 'react-icons/fa';
import Sidenav from '../partials/sidenav';
import Topnev from '../partials/topnev';
import axios from 'axios';
import Loading from './Loading';
import Card from '../partials/Card';
import EmptyState from './EmptyState';
import { useDebounce } from '../utils/useDebounce';
import { API_BASE_URL } from '../utils/config';
import { toast } from 'react-toastify';

const Search = React.memo(() => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [query, setQuery] = useState(searchParams.get('q') || '');
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('all'); // all, movie, tv, person
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);
    const abortControllerRef = useRef(null);

    const debouncedQuery = useDebounce(query, 500);

    const performSearch = useCallback(async (searchQuery, searchType = 'all', currentPage = 1) => {
        if (!searchQuery || searchQuery.trim().length === 0) {
            setResults([]);
            setIsLoading(false);
            return;
        }

        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        abortControllerRef.current = new AbortController();
        setIsLoading(true);

        try {
            const endpoint = searchType === 'all' ? '/api/search' : `/api/search/${searchType}`;
            const token = localStorage.getItem('token');
            const headers = token ? { Authorization: `Bearer ${token}` } : {};
            
            const { data } = await axios.get(`${API_BASE_URL}${endpoint}`, {
                params: { query: searchQuery.trim(), page: currentPage },
                headers,
                signal: abortControllerRef.current.signal
            });

            // Handle response data
            if (data && data.results) {
                if (currentPage === 1) {
                    setResults(data.results || []);
                } else {
                    setResults(prev => [...prev, ...(data.results || [])]);
                }
                setHasMore(data.page < data.total_pages);
                setPage(currentPage);
            } else {
                // Empty results
                if (currentPage === 1) {
                    setResults([]);
                }
                setHasMore(false);
            }
        } catch (error) {
            if (error.name !== 'CanceledError' && error.code !== 'ERR_CANCELED') {
                if (import.meta.env.DEV) {
                    console.error('Search error:', error);
                }
                // Handle 429 (Too Many Requests)
                if (error.response && error.response.status === 429) {
                    const retryAfter = error.response.data?.error?.retry_after || 
                                     error.response.headers['retry-after'] || 
                                     15;
                    toast.error(`Too many requests. Please wait ${retryAfter} seconds before searching again.`, {
                        autoClose: Math.min(retryAfter * 1000, 10000)
                    });
                    setResults([]);
                    setHasMore(false);
                } 
                // If it's a 404, treat as no results instead of error
                else if (error.response && error.response.status === 404) {
                    setResults([]);
                    setHasMore(false);
                } else {
                    toast.error('Failed to search. Please try again.');
                }
            }
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Update URL when query changes
    useEffect(() => {
        if (debouncedQuery) {
            setSearchParams({ q: debouncedQuery });
            performSearch(debouncedQuery, activeTab, 1);
        } else {
            setResults([]);
            setSearchParams({});
        }
    }, [debouncedQuery, activeTab]);

    // Load initial query from URL
    useEffect(() => {
        const urlQuery = searchParams.get('q');
        if (urlQuery && urlQuery !== query) {
            setQuery(urlQuery);
        }
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (query.trim()) {
            performSearch(query, activeTab, 1);
        }
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setPage(1);
        if (debouncedQuery) {
            performSearch(debouncedQuery, tab, 1);
        }
    };

    const loadMore = useCallback(() => {
        if (!isLoading && hasMore && debouncedQuery) {
            performSearch(debouncedQuery, activeTab, page + 1);
        }
    }, [debouncedQuery, activeTab, page, hasMore, isLoading, performSearch]);

    const handleBack = useCallback(() => {
        navigate(-1);
    }, [navigate]);

    // Filter results by type for tabs
    const filteredResults = useMemo(() => {
        if (activeTab === 'all') return results;
        return results.filter(item => {
            if (activeTab === 'movie') return item.media_type === 'movie';
            if (activeTab === 'tv') return item.media_type === 'tv';
            if (activeTab === 'person') return item.media_type === 'person';
            return true;
        });
    }, [results, activeTab]);

    return (
        <>
            <Sidenav />
            <div className='w-full min-h-screen py-3 select-auto overflow-hidden overflow-y-auto bg-[#0f0b20]'>
                <div className='w-full flex items-center gap-4 px-[3%] mb-4'>
                    <h1 
                        onClick={handleBack} 
                        className='text-2xl font-semibold hover:text-indigo-400 flex items-center gap-2 text-zinc-300 cursor-pointer transition-colors group'
                    >
                        <FaLongArrowAltLeft className="group-hover:-translate-x-1 transition-transform" /> 
                        <span className="flex items-center gap-2">
                            <FaSearch className="text-indigo-500" />
                            Search
                        </span>
                    </h1>
                    <Topnev />
                </div>

            {/* Search Bar */}
            <div className='px-4 sm:px-[3%] mb-4 sm:mb-6'>
                <form onSubmit={handleSearch} className='flex flex-col sm:flex-row gap-3 sm:gap-4'>
                    <div className='flex-1 relative'>
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search movies, TV shows, people..."
                            className='w-full p-3 sm:p-4 pr-12 text-base sm:text-lg bg-zinc-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6556CD]'
                        />
                        <FaSearch className='absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-zinc-400 text-lg sm:text-xl' />
                    </div>
                    <button
                        type="submit"
                        className='w-full sm:w-auto px-6 py-3 sm:py-4 bg-[#6556CD] text-white rounded-lg hover:bg-[#5546C0] active:bg-[#4535B0] transition-colors font-semibold text-base sm:text-lg'
                    >
                        Search
                    </button>
                </form>
            </div>

            {/* Tabs */}
            {query && (
                <div className='px-4 sm:px-[3%] mb-4 overflow-x-auto scrollbar-hide'>
                    <div className='flex gap-2 sm:gap-3 min-w-max bg-zinc-900/50 backdrop-blur-sm border border-zinc-800/50 rounded-xl p-1'>
                        {['all', 'movie', 'tv', 'person'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => handleTabChange(tab)}
                                className={`px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base capitalize transition-all duration-300 whitespace-nowrap rounded-lg font-medium ${
                                    activeTab === tab
                                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/50 transform scale-105'
                                        : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
                                }`}
                            >
                                {tab === 'all' ? 'All' : tab === 'tv' ? 'TV Shows' : tab}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Results */}
            {isLoading && results.length === 0 ? (
                <Loading />
            ) : query && filteredResults.length > 0 ? (
                <>
                    <Card data={filteredResults} title={activeTab === 'all' ? 'search' : activeTab} />
                    {hasMore && (
                        <div className='text-center mt-6 px-4'>
                            <button
                                onClick={loadMore}
                                disabled={isLoading}
                                className='w-full sm:w-auto px-8 py-3 sm:py-4 bg-[#6556CD] text-white rounded-lg hover:bg-[#5546C0] active:bg-[#4535B0] disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold text-base sm:text-lg'
                            >
                                {isLoading ? 'Loading...' : 'Load More'}
                            </button>
                        </div>
                    )}
                </>
            ) : query && !isLoading ? (
                <EmptyState
                    icon={<FaSearch className="w-24 h-24 text-indigo-500/50" />}
                    title={`No results found for "${query}"`}
                    description="Try a different search term or check your spelling"
                />
            ) : (
                <EmptyState
                    icon={<FaSearch className="w-24 h-24 text-indigo-500/50" />}
                    title="Start Searching"
                    description="Search for movies, TV shows, or people. Type in the search bar above to get started."
                />
            )}
            </div>
        </>
    );
});

Search.displayName = 'Search';

export default Search;

