import React, { useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaLongArrowAltLeft, FaFolder, FaSave, FaTimes, FaGlobe, FaLock } from 'react-icons/fa';
import Topnev from '../partials/topnev';
import axios from '../utils/axios';
import { API_BASE_URL } from '../utils/config';
import { toast } from 'react-toastify';

const CreateCollection = React.memo(() => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [isPublic, setIsPublic] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        
        if (!name.trim()) {
            toast.error('Collection name is required');
            return;
        }

        setIsSubmitting(true);
        try {
            const token = localStorage.getItem('token');
            const { data } = await axios.post(
                `${API_BASE_URL}/api/collections`,
                { name: name.trim(), description: description.trim(), isPublic },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            
            toast.success('Collection created!');
            if (id) {
                // If editing, redirect to collection detail
                navigate(`/collections/${data.collection._id}`);
            } else {
                navigate('/collections');
            }
        } catch (error) {
            console.error('Error creating collection:', error);
            toast.error('Failed to create collection');
        } finally {
            setIsSubmitting(false);
        }
    }, [name, description, isPublic, navigate, id]);

    return (
        <div className='w-full min-h-screen py-3 select-auto overflow-hidden overflow-y-auto animate-fadeIn'>
            <div className='w-full flex max-sm:flex-col sm:items-center gap-4 px-[3%] mb-6 sm:mb-8'>
                <h1 
                    onClick={() => navigate(-1)} 
                    className='text-2xl sm:text-3xl font-bold hover:text-indigo-400 flex items-center gap-2 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 cursor-pointer transition-all duration-300 group'
                >
                    <FaLongArrowAltLeft className="text-zinc-400 group-hover:text-indigo-400 group-hover:-translate-x-1 transition-all duration-300" /> 
                    <span>{id ? 'Edit Collection' : 'Create Collection'}</span>
                </h1>
                <Topnev />
            </div>
            <div className="max-w-2xl mx-auto px-4 sm:px-[3%]">
                <form onSubmit={handleSubmit} className="bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 backdrop-blur-md border border-zinc-800/50 rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-xl shadow-black/30 space-y-6">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                            <FaFolder className="text-white text-2xl" />
                        </div>
                        <div>
                            <h2 className="text-xl sm:text-2xl font-bold text-white">
                                {id ? 'Edit Collection' : 'New Collection'}
                            </h2>
                            <p className="text-zinc-400 text-sm sm:text-base">
                                {id ? 'Update your collection details' : 'Organize your favorite content'}
                            </p>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="name" className="block text-white font-semibold mb-2 text-sm sm:text-base">
                            Collection Name <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="My Favorite Movies"
                            className="w-full p-3 sm:p-4 bg-zinc-800/50 border border-zinc-700/50 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 placeholder:text-zinc-500"
                            maxLength={100}
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-white font-semibold mb-2 text-sm sm:text-base">
                            Description
                        </label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Describe your collection..."
                            className="w-full p-3 sm:p-4 bg-zinc-800/50 border border-zinc-700/50 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none transition-all duration-300 placeholder:text-zinc-500"
                            rows="4"
                            maxLength={500}
                        />
                        <p className="text-zinc-400 text-xs sm:text-sm mt-2">
                            {description.length}/500 characters
                        </p>
                    </div>

                    <div className="bg-zinc-800/30 rounded-xl p-4 border border-zinc-700/50">
                        <label htmlFor="isPublic" className="flex items-center gap-3 cursor-pointer group">
                            <div className="relative">
                                <input
                                    type="checkbox"
                                    id="isPublic"
                                    checked={isPublic}
                                    onChange={(e) => setIsPublic(e.target.checked)}
                                    className="sr-only"
                                />
                                <div className={`w-12 h-6 rounded-full transition-all duration-300 ${
                                    isPublic ? 'bg-indigo-600' : 'bg-zinc-700'
                                }`}>
                                    <div className={`w-5 h-5 bg-white rounded-full transition-transform duration-300 transform ${
                                        isPublic ? 'translate-x-6' : 'translate-x-0.5'
                                    } mt-0.5`}></div>
                                </div>
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2 text-white font-medium">
                                    {isPublic ? (
                                        <>
                                            <FaGlobe className="text-green-400" />
                                            <span>Public Collection</span>
                                        </>
                                    ) : (
                                        <>
                                            <FaLock className="text-zinc-400" />
                                            <span>Private Collection</span>
                                        </>
                                    )}
                                </div>
                                <p className="text-zinc-400 text-xs sm:text-sm mt-1">
                                    {isPublic 
                                        ? 'Anyone can view this collection' 
                                        : 'Only you can view this collection'}
                                </p>
                            </div>
                        </label>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 px-6 py-3 sm:py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-semibold shadow-lg shadow-indigo-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 sm:gap-3 text-sm sm:text-base"
                        >
                            <FaSave className="text-base sm:text-lg" />
                            <span>{isSubmitting ? 'Creating...' : id ? 'Update Collection' : 'Create Collection'}</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="px-6 py-3 sm:py-4 bg-zinc-700/50 hover:bg-zinc-600/50 text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 sm:gap-3 text-sm sm:text-base border border-zinc-600/50"
                        >
                            <FaTimes className="text-base sm:text-lg" />
                            <span>Cancel</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
});

CreateCollection.displayName = 'CreateCollection';

export default CreateCollection;

