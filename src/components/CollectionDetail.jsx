import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { FaLongArrowAltLeft } from 'react-icons/fa';
import Topnev from '../partials/topnev';
import axios from '../utils/axios';
import Loading from './Loading';
import Card from '../partials/Card';
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
        <div className='w-full min-h-screen py-3 select-auto overflow-hidden overflow-y-auto'>
            <div className='w-full flex items-center gap-4 px-[3%] mb-6'>
                <h1 onClick={handleBack} className='text-2xl font-semibold hover:text-blue-500 flex items-center text-zinc-400 cursor-pointer'>
                    <FaLongArrowAltLeft /> {collection.name}
                </h1>
                <Topnev />
            </div>
            <div className="px-[3%] mb-6">
                <div className="bg-zinc-900 p-6 rounded-lg">
                    <h2 className="text-2xl font-bold text-white mb-2">{collection.name}</h2>
                    {collection.description && (
                        <p className="text-zinc-400 mb-4">{collection.description}</p>
                    )}
                    <div className="flex items-center gap-4">
                        <span className="text-zinc-500">
                            {collection.items?.length || 0} items
                        </span>
                        <span className={`text-xs px-2 py-1 rounded ${
                            collection.isPublic 
                                ? 'bg-green-600 text-white' 
                                : 'bg-zinc-700 text-zinc-300'
                        }`}>
                            {collection.isPublic ? 'Public' : 'Private'}
                        </span>
                    </div>
                </div>
            </div>
            {movies.length > 0 ? (
                <Card data={movies} title="collection" />
            ) : (
                <div className="flex items-center justify-center h-64">
                    <p className="text-zinc-400 text-xl">This collection is empty</p>
                </div>
            )}
        </div>
    );
});

CollectionDetail.displayName = 'CollectionDetail';

export default CollectionDetail;

