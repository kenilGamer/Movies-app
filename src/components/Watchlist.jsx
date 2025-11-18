import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import { FaLongArrowAltLeft } from "react-icons/fa";
import Topnev from '../partials/topnev';
import axios from '../utils/axios';
import Loading from './Loading';
import Card from '../partials/Card';
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
        <div className='w-full min-h-screen py-3 select-auto overflow-hidden overflow-y-auto'>
            <div className='w-full flex items-center gap-4 px-[3%]'>
                <h1 onClick={handleBack} className='text-2xl font-semibold hover:text-blue-500 flex items-center text-zinc-400 cursor-pointer'>
                    <FaLongArrowAltLeft /> My Watchlist
                </h1>
                <Topnev />
            </div>
            {isLoading ? (
                <Loading />
            ) : movies.length > 0 ? (
                <Card data={movies} title="watchlist" />
            ) : (
                <div className="flex items-center justify-center h-64">
                    <p className="text-zinc-400 text-xl">Your watchlist is empty</p>
                </div>
            )}
        </div>
    );
});

Watchlist.displayName = 'Watchlist';

export default Watchlist;

