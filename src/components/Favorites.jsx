import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import { FaLongArrowAltLeft, FaHeart } from "react-icons/fa";
import Topnev from '../partials/topnev';
import Sidenav from '../partials/sidenav';
import axios from '../utils/axios';
import Loading from './Loading';
import Card from '../partials/Card';
import EmptyState from './EmptyState';
import { API_BASE_URL } from '../utils/config';
import { toast } from 'react-toastify';

const Favorites = React.memo(() => {
    const navigate = useNavigate();
    const [favorites, setFavorites] = useState([]);
    const [movies, setMovies] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const abortControllerRef = useRef(null);

    const fetchFavorites = useCallback(async () => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        
        abortControllerRef.current = new AbortController();
        setIsLoading(true);
        
        try {
            const token = localStorage.getItem('token');
            const { data } = await axios.get(`${API_BASE_URL}/api/user/favorites`, {
                headers: { Authorization: `Bearer ${token}` },
                signal: abortControllerRef.current.signal
            });
            
            setFavorites(data.favorites || []);
            
            // Fetch movie/TV details for each item
            if (data.favorites && data.favorites.length > 0) {
                const moviePromises = data.favorites.map(async (item) => {
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
                console.error('Error fetching favorites:', error);
                toast.error('Failed to load favorites');
            }
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchFavorites();
        
        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, [fetchFavorites]);

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
                        className='text-2xl font-semibold hover:text-red-400 flex items-center gap-2 text-zinc-300 cursor-pointer transition-colors group'
                    >
                        <FaLongArrowAltLeft className="group-hover:-translate-x-1 transition-transform" /> 
                        <span className="flex items-center gap-2">
                            <FaHeart className="text-red-500 animate-pulse" />
                            My Favorites
                        </span>
                    </h1>
                    <Topnev />
                </div>
                {isLoading ? (
                    <Loading message="Loading your favorites..." fullScreen={false} />
                ) : movies.length > 0 ? (
                    <div className="px-[3%] animate-fadeIn">
                        <Card data={movies} title="favorites" />
                    </div>
                ) : (
                    <EmptyState
                        icon={<FaHeart className="w-24 h-24 text-red-500/50" />}
                        title="No Favorites Yet"
                        description="Show some love! Add movies and TV shows to your favorites by clicking the heart icon on any title."
                        actionLabel="Discover Content"
                        actionPath="/trending"
                    />
                )}
            </div>
        </>
    );
});

Favorites.displayName = 'Favorites';

export default Favorites;

