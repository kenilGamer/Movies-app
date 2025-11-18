import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FaLongArrowAltLeft, FaSearch } from 'react-icons/fa';
import Topnev from '../partials/topnev';
import axios from '../utils/axios';
import Loading from './Loading';
import Card from '../partials/Card';
import { useDebounce } from '../utils/useDebounce';
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
            const endpoint = searchType === 'all' ? '/search' : `/search/${searchType}`;
            const { data } = await axios.get(endpoint, {
                params: { query: searchQuery.trim(), page: currentPage },
                signal: abortControllerRef.current.signal
            });

            if (currentPage === 1) {
                setResults(data.results || []);
            } else {
                setResults(prev => [...prev, ...(data.results || [])]);
            }

            setHasMore(data.page < data.total_pages);
            setPage(currentPage);
        } catch (error) {
            if (error.name !== 'CanceledError' && error.code !== 'ERR_CANCELED') {
                console.error('Search error:', error);
                toast.error('Failed to search');
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
        <div className='w-full min-h-screen py-3 select-auto overflow-hidden overflow-y-auto'>
            <div className='w-full flex items-center gap-4 px-[3%] mb-4'>
                <h1 onClick={handleBack} className='text-2xl font-semibold hover:text-blue-500 flex items-center text-zinc-400 cursor-pointer'>
                    <FaLongArrowAltLeft /> Search
                </h1>
                <Topnev />
            </div>

            {/* Search Bar */}
            <div className='px-[3%] mb-6'>
                <form onSubmit={handleSearch} className='flex gap-4'>
                    <div className='flex-1 relative'>
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search movies, TV shows, people..."
                            className='w-full p-4 pr-12 bg-zinc-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6556CD]'
                        />
                        <FaSearch className='absolute right-4 top-1/2 transform -translate-y-1/2 text-zinc-400' />
                    </div>
                    <button
                        type="submit"
                        className='px-6 py-4 bg-[#6556CD] text-white rounded-lg hover:bg-[#5546C0] transition-colors'
                    >
                        Search
                    </button>
                </form>
            </div>

            {/* Tabs */}
            {query && (
                <div className='px-[3%] mb-4 flex gap-2 border-b border-zinc-700'>
                    {['all', 'movie', 'tv', 'person'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => handleTabChange(tab)}
                            className={`px-4 py-2 capitalize transition-colors ${
                                activeTab === tab
                                    ? 'border-b-2 border-[#6556CD] text-[#6556CD]'
                                    : 'text-zinc-400 hover:text-white'
                            }`}
                        >
                            {tab === 'all' ? 'All' : tab === 'tv' ? 'TV Shows' : tab}
                        </button>
                    ))}
                </div>
            )}

            {/* Results */}
            {isLoading && results.length === 0 ? (
                <Loading />
            ) : query && filteredResults.length > 0 ? (
                <>
                    <Card data={filteredResults} title={activeTab === 'all' ? 'search' : activeTab} />
                    {hasMore && (
                        <div className='text-center mt-6'>
                            <button
                                onClick={loadMore}
                                disabled={isLoading}
                                className='px-6 py-3 bg-[#6556CD] text-white rounded-lg hover:bg-[#5546C0] disabled:opacity-50'
                            >
                                {isLoading ? 'Loading...' : 'Load More'}
                            </button>
                        </div>
                    )}
                </>
            ) : query && !isLoading ? (
                <div className="flex items-center justify-center h-64">
                    <p className="text-zinc-400 text-xl">No results found</p>
                </div>
            ) : (
                <div className="flex items-center justify-center h-64">
                    <p className="text-zinc-400 text-xl">Start typing to search...</p>
                </div>
            )}
        </div>
    );
});

Search.displayName = 'Search';

export default Search;

