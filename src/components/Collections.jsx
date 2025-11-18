import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaLongArrowAltLeft, FaPlus } from 'react-icons/fa';
import Topnev from '../partials/topnev';
import axios from '../utils/axios';
import Loading from './Loading';
import { API_BASE_URL } from '../utils/config';
import { toast } from 'react-toastify';

const Collections = React.memo(() => {
    const navigate = useNavigate();
    const [collections, setCollections] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const abortControllerRef = useRef(null);

    const fetchCollections = useCallback(async () => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        
        abortControllerRef.current = new AbortController();
        setIsLoading(true);
        
        try {
            const token = localStorage.getItem('token');
            const { data } = await axios.get(`${API_BASE_URL}/api/collections`, {
                headers: { Authorization: `Bearer ${token}` },
                signal: abortControllerRef.current.signal
            });
            
            setCollections(data.collections || []);
        } catch (error) {
            if (error.name !== 'CanceledError' && error.code !== 'ERR_CANCELED') {
                console.error('Error fetching collections:', error);
                toast.error('Failed to load collections');
            }
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCollections();
        
        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, [fetchCollections]);

    const handleBack = useCallback(() => {
        navigate(-1);
    }, [navigate]);

    const handleDelete = useCallback(async (collectionId) => {
        if (!window.confirm('Are you sure you want to delete this collection?')) {
            return;
        }

        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${API_BASE_URL}/api/collections/${collectionId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('Collection deleted');
            fetchCollections();
        } catch (error) {
            console.error('Error deleting collection:', error);
            toast.error('Failed to delete collection');
        }
    }, [fetchCollections]);

    return (
        <div className='w-full min-h-screen py-3 select-auto overflow-hidden overflow-y-auto'>
            <div className='w-full flex items-center gap-4 px-[3%] mb-6'>
                <h1 onClick={handleBack} className='text-2xl font-semibold hover:text-blue-500 flex items-center text-zinc-400 cursor-pointer'>
                    <FaLongArrowAltLeft /> My Collections
                </h1>
                <Topnev />
                <Link
                    to="/collections/create"
                    className="ml-auto px-4 py-2 bg-[#6556CD] text-white rounded-lg hover:bg-[#5546C0] transition-colors flex items-center gap-2"
                >
                    <FaPlus /> Create Collection
                </Link>
            </div>
            {isLoading ? (
                <Loading />
            ) : collections.length > 0 ? (
                <div className="px-[3%] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {collections.map((collection) => (
                        <Link
                            key={collection._id}
                            to={`/collections/${collection._id}`}
                            className="bg-zinc-900 p-6 rounded-lg hover:bg-zinc-800 transition-colors"
                        >
                            <h3 className="text-xl font-bold text-white mb-2">{collection.name}</h3>
                            <p className="text-zinc-400 text-sm mb-4 line-clamp-2">
                                {collection.description || 'No description'}
                            </p>
                            <div className="flex items-center justify-between">
                                <span className="text-zinc-500 text-sm">
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
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center h-64">
                    <p className="text-zinc-400 text-xl mb-4">You don't have any collections yet</p>
                    <Link
                        to="/collections/create"
                        className="px-6 py-3 bg-[#6556CD] text-white rounded-lg hover:bg-[#5546C0] transition-colors"
                    >
                        Create Your First Collection
                    </Link>
                </div>
            )}
        </div>
    );
});

Collections.displayName = 'Collections';

export default Collections;

