import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import { FaLongArrowAltLeft, FaBookmark } from "react-icons/fa";
import Topnev from '../partials/topnev';
import Sidenav from '../partials/sidenav';
import axios from '../utils/axios';
import Loading from './Loading';
import Card from '../partials/Card';
import EmptyState from './EmptyState';
import { API_BASE_URL } from '../utils/config';
import { toast } from 'react-toastify';

const Watchlist = React.memo(() => {
    const navigate = useNavigate();
    const [watchlist, setWatchlist] = useState([]);
    const [movies, setMovies] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const abortControllerRef = useRef(null);

    const fetchWatchlist = useCallback(async () => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        
        abortControllerRef.current = new AbortController();
        setIsLoading(true);
        
        try {
            const token = localStorage.getItem('token');
            const { data } = await axios.get(`${API_BASE_URL}/api/user/watchlist`, {
                headers: { Authorization: `Bearer ${token}` },
                signal: abortControllerRef.current.signal
            });
            
            setWatchlist(data.watchlist || []);
            
            // Fetch movie/TV details for each item
            if (data.watchlist && data.watchlist.length > 0) {
                const moviePromises = data.watchlist.map(async (item) => {
                    try {
                        const response = await axios.get(`/${item.mediaType}/${item.movieId}`, {
                            signal: abortControllerRef.current.signal
                        });
                        return response.data;
                    } catch (error) {
                        console.error(`Error fetching ${item.mediaType} ${item.movieId}:`, error);
                        return null;
                    }
                });
                
                const movieData = await Promise.all(moviePromises);
                setMovies(movieData.filter(m => m !== null));
            } else {
                setMovies([]);
            }
        } catch (error) {
            if (error.name !== 'CanceledError' && error.code !== 'ERR_CANCELED') {
                console.error('Error fetching watchlist:', error);
                toast.error('Failed to load watchlist');
            }
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchWatchlist();
        
        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, [fetchWatchlist]);

    const handleBack = useCallback(() => {
        navigate(-1);
    }, [navigate]);

    return (
        <>
            <Sidenav />
            <div className='w-full min-h-screen py-3 select-auto overflow-hidden overflow-y-auto bg-[#0f0b20]'>
                <div className='w-full flex items-center gap-4 px-[3%] mb-6'>
                    <h1 
                        onClick={handleBack} 
                        className='text-2xl font-semibold hover:text-indigo-400 flex items-center gap-2 text-zinc-300 cursor-pointer transition-colors group'
                    >
                        <FaLongArrowAltLeft className="group-hover:-translate-x-1 transition-transform" /> 
                        <span className="flex items-center gap-2">
                            <FaBookmark className="text-indigo-500" />
                            My Watchlist
                        </span>
                    </h1>
                    <Topnev />
                </div>
                {isLoading ? (
                    <Loading message="Loading your watchlist..." fullScreen={false} />
                ) : movies.length > 0 ? (
                    <div className="px-[3%] animate-fadeIn">
                        <Card data={movies} title="watchlist" />
                    </div>
                ) : (
                    <EmptyState
                        icon={<FaBookmark className="w-24 h-24 text-indigo-500/50" />}
                        title="Your Watchlist is Empty"
                        description="Start adding movies and TV shows to your watchlist to watch them later. Browse our collection and save your favorites!"
                        actionLabel="Browse Movies"
                        actionPath="/movie"
                    />
                )}
            </div>
        </>
    );
});

Watchlist.displayName = 'Watchlist';

export default Watchlist;

