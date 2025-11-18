import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaLongArrowAltLeft, FaPlus, FaFolder, FaLock, FaGlobe, FaTrash, FaEdit } from 'react-icons/fa';
import Topnev from '../partials/topnev';
import axios from '../utils/axios';
import Loading from './Loading';
import EmptyState from './EmptyState';
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
        <div className='w-full min-h-screen py-3 select-auto overflow-hidden overflow-y-auto animate-fadeIn'>
            <div className='w-full flex max-sm:flex-col sm:items-center gap-4 px-[3%] mb-6 sm:mb-8'>
                <h1 
                    onClick={handleBack} 
                    className='text-2xl sm:text-3xl font-bold hover:text-indigo-400 flex items-center gap-2 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 cursor-pointer transition-all duration-300 group'
                >
                    <FaLongArrowAltLeft className="text-zinc-400 group-hover:text-indigo-400 group-hover:-translate-x-1 transition-all duration-300" /> 
                    <span>My Collections</span>
                </h1>
                <Topnev />
                <Link
                    to="/collections/create"
                    className="ml-auto sm:ml-0 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-semibold shadow-lg shadow-indigo-500/50 transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center gap-2 sm:gap-3 text-sm sm:text-base"
                >
                    <FaPlus className="text-base sm:text-lg" />
                    <span>Create Collection</span>
                </Link>
            </div>
            {isLoading ? (
                <Loading />
            ) : collections.length > 0 ? (
                <div className="px-4 sm:px-[3%] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                    {collections.map((collection) => (
                        <div
                            key={collection._id}
                            className="group relative bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 backdrop-blur-sm border border-zinc-800/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:border-indigo-500/50 shadow-lg shadow-black/30 hover:shadow-2xl hover:shadow-indigo-500/20 transition-all duration-500"
                        >
                            <Link
                                to={`/collections/${collection._id}`}
                                className="block"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                                            <FaFolder className="text-white text-xl sm:text-2xl" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-lg sm:text-xl font-bold text-white mb-1 line-clamp-1 group-hover:text-indigo-400 transition-colors">
                                                {collection.name}
                                            </h3>
                                            <div className="flex items-center gap-2">
                                                {collection.isPublic ? (
                                                    <span className="flex items-center gap-1 text-xs text-green-400">
                                                        <FaGlobe className="text-[0.7em]" />
                                                        <span>Public</span>
                                                    </span>
                                                ) : (
                                                    <span className="flex items-center gap-1 text-xs text-zinc-500">
                                                        <FaLock className="text-[0.7em]" />
                                                        <span>Private</span>
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <p className="text-zinc-400 text-sm mb-4 line-clamp-2 leading-relaxed">
                                    {collection.description || 'No description provided'}
                                </p>
                                <div className="flex items-center justify-between pt-4 border-t border-zinc-800/50">
                                    <span className="text-zinc-500 text-sm font-medium">
                                        {collection.items?.length || 0} item{collection.items?.length !== 1 ? 's' : ''}
                                    </span>
                                    <span className="text-indigo-400 text-sm font-semibold group-hover:text-indigo-300 transition-colors">
                                        View →
                                    </span>
                                </div>
                            </Link>
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handleDelete(collection._id);
                                }}
                                className="absolute top-4 right-4 p-2 bg-red-600/20 hover:bg-red-600/40 rounded-lg text-red-400 hover:text-red-300 transition-all duration-300 opacity-0 group-hover:opacity-100 transform scale-90 group-hover:scale-100"
                                aria-label="Delete collection"
                            >
                                <FaTrash className="text-sm" />
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <EmptyState
                    icon={<FaFolder className="w-24 h-24 text-indigo-500/50" />}
                    title="No Collections Yet"
                    description="Create your first collection to organize your favorite movies and TV shows"
                    action={
                        <Link
                            to="/collections/create"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-semibold shadow-lg shadow-indigo-500/50 transition-all duration-300 transform hover:scale-105"
                        >
                            <FaPlus />
                            <span>Create Your First Collection</span>
                        </Link>
                    }
                />
            )}
        </div>
    );
});

Collections.displayName = 'Collections';

export default Collections;

