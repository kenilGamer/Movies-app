import React, { useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaLongArrowAltLeft } from 'react-icons/fa';
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
        <div className='w-full min-h-screen py-3 select-auto overflow-hidden overflow-y-auto'>
            <div className='w-full flex items-center gap-4 px-[3%] mb-6'>
                <h1 onClick={() => navigate(-1)} className='text-2xl font-semibold hover:text-blue-500 flex items-center text-zinc-400 cursor-pointer'>
                    <FaLongArrowAltLeft /> {id ? 'Edit Collection' : 'Create Collection'}
                </h1>
                <Topnev />
            </div>
            <div className="max-w-2xl mx-auto px-[3%]">
                <form onSubmit={handleSubmit} className="bg-zinc-900 p-6 rounded-lg space-y-6">
                    <div>
                        <label className="block text-white font-semibold mb-2">Collection Name *</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="My Favorite Movies"
                            className="w-full p-3 bg-zinc-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6556CD]"
                            maxLength={100}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-white font-semibold mb-2">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Describe your collection..."
                            className="w-full p-3 bg-zinc-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6556CD] resize-none"
                            rows="4"
                            maxLength={500}
                        />
                        <p className="text-zinc-400 text-sm mt-1">{description.length}/500 characters</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            id="isPublic"
                            checked={isPublic}
                            onChange={(e) => setIsPublic(e.target.checked)}
                            className="w-5 h-5 rounded bg-zinc-800 border-zinc-700 text-[#6556CD] focus:ring-[#6556CD]"
                        />
                        <label htmlFor="isPublic" className="text-white cursor-pointer">
                            Make this collection public
                        </label>
                    </div>
                    <div className="flex gap-4">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-6 py-3 bg-[#6556CD] text-white rounded-lg hover:bg-[#5546C0] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {isSubmitting ? 'Creating...' : 'Create Collection'}
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="px-6 py-3 bg-zinc-700 text-white rounded-lg hover:bg-zinc-600 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
});

CreateCollection.displayName = 'CreateCollection';

export default CreateCollection;

