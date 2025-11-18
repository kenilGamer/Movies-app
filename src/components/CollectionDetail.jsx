import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { FaLongArrowAltLeft, FaFolder, FaLock, FaGlobe, FaTrash, FaEdit } from 'react-icons/fa';
import Topnev from '../partials/topnev';
import axios from '../utils/axios';
import Loading from './Loading';
import Card from '../partials/Card';
import EmptyState from './EmptyState';
import { API_BASE_URL } from '../utils/config';
import { toast } from 'react-toastify';

const CollectionDetail = React.memo(() => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [collection, setCollection] = useState(null);
    const [movies, setMovies] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const abortControllerRef = useRef(null);

    const fetchCollection = useCallback(async () => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        
        abortControllerRef.current = new AbortController();
        setIsLoading(true);
        
        try {
            const token = localStorage.getItem('token');
            const { data } = await axios.get(`${API_BASE_URL}/api/collections/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
                signal: abortControllerRef.current.signal
            });
            
            setCollection(data.collection);
            
            // Fetch movie/TV details for each item
            if (data.collection.items && data.collection.items.length > 0) {
                const moviePromises = data.collection.items.map(async (item) => {
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
                console.error('Error fetching collection:', error);
                toast.error('Failed to load collection');
            }
        } finally {
            setIsLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchCollection();
        
        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, [fetchCollection]);

    const handleBack = useCallback(() => {
        navigate(-1);
    }, [navigate]);

    const handleRemoveItem = useCallback(async (movieId, mediaType) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${API_BASE_URL}/api/collections/${id}/items/${movieId}/${mediaType}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('Item removed from collection');
            fetchCollection();
        } catch (error) {
            console.error('Error removing item:', error);
            toast.error('Failed to remove item');
        }
    }, [id, fetchCollection]);

    if (isLoading) {
        return <Loading />;
    }

    if (!collection) {
        return (
            <div className="flex items-center justify-center h-64">
                <p className="text-zinc-400 text-xl">Collection not found</p>
            </div>
        );
    }

    return (
        <div className='w-full min-h-screen py-3 select-auto overflow-hidden overflow-y-auto animate-fadeIn'>
            <div className='w-full flex max-sm:flex-col sm:items-center gap-4 px-[3%] mb-6 sm:mb-8'>
                <h1 
                    onClick={handleBack} 
                    className='text-2xl sm:text-3xl font-bold hover:text-indigo-400 flex items-center gap-2 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 cursor-pointer transition-all duration-300 group'
                >
                    <FaLongArrowAltLeft className="text-zinc-400 group-hover:text-indigo-400 group-hover:-translate-x-1 transition-all duration-300" /> 
                    <span>{collection.name}</span>
                </h1>
                <Topnev />
            </div>
            <div className="px-4 sm:px-[3%] mb-6 sm:mb-8">
                <div className="bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 backdrop-blur-md border border-zinc-800/50 rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-xl shadow-black/30">
                    <div className="flex items-start gap-4 sm:gap-6">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                            <FaFolder className="text-white text-2xl sm:text-3xl" />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-start justify-between mb-3">
                                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">
                                    {collection.name}
                                </h2>
                                <div className="flex items-center gap-2">
                                    {collection.isPublic ? (
                                        <span className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600/20 border border-green-500/30 rounded-lg text-green-400 text-xs sm:text-sm font-medium">
                                            <FaGlobe className="text-[0.8em]" />
                                            <span>Public</span>
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-700/50 border border-zinc-600/50 rounded-lg text-zinc-400 text-xs sm:text-sm font-medium">
                                            <FaLock className="text-[0.8em]" />
                                            <span>Private</span>
                                        </span>
                                    )}
                                </div>
                            </div>
                            {collection.description && (
                                <p className="text-zinc-300 text-base sm:text-lg mb-4 leading-relaxed">
                                    {collection.description}
                                </p>
                            )}
                            <div className="flex items-center gap-4 sm:gap-6">
                                <span className="text-zinc-400 text-sm sm:text-base font-medium">
                                    {collection.items?.length || 0} item{collection.items?.length !== 1 ? 's' : ''}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {movies.length > 0 ? (
                <Card data={movies} title="collection" />
            ) : (
                <EmptyState
                    icon={<FaFolder className="w-24 h-24 text-indigo-500/50" />}
                    title="This Collection is Empty"
                    description="Start adding movies and TV shows to your collection"
                />
            )}
        </div>
    );
});

CollectionDetail.displayName = 'CollectionDetail';

export default CollectionDetail;

