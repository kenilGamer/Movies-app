import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axios';
import { API_BASE_URL } from '../utils/config';
import { getUserCollections, addToCollection } from '../utils/collectionUtils';
import { toast } from 'react-toastify';

const AddToCollection = React.memo(({ movieId, mediaType, onClose }) => {
    const navigate = useNavigate();
    const [collections, setCollections] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedCollection, setSelectedCollection] = useState('');

    useEffect(() => {
        const loadCollections = async () => {
            setIsLoading(true);
            const userCollections = await getUserCollections();
            setCollections(userCollections);
            setIsLoading(false);
        };
        loadCollections();
    }, []);

    const handleAdd = useCallback(async () => {
        if (!selectedCollection) {
            toast.error('Please select a collection');
            return;
        }

        try {
            await addToCollection(selectedCollection, movieId, mediaType);
            if (onClose) {
                onClose();
            }
        } catch (error) {
            console.error('Error adding to collection:', error);
        }
    }, [selectedCollection, movieId, mediaType, onClose]);

    if (isLoading) {
        return (
            <div className="bg-zinc-900 p-6 rounded-lg">
                <p className="text-zinc-400">Loading collections...</p>
            </div>
        );
    }

    return (
        <div className="bg-zinc-900 p-6 rounded-lg space-y-4">
            <h3 className="text-xl font-bold text-white mb-4">Add to Collection</h3>
            {collections.length > 0 ? (
                <>
                    <select
                        value={selectedCollection}
                        onChange={(e) => setSelectedCollection(e.target.value)}
                        className="w-full p-3 bg-zinc-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6556CD]"
                    >
                        <option value="">Select a collection</option>
                        {collections.map(collection => (
                            <option key={collection._id} value={collection._id}>
                                {collection.name} ({collection.items?.length || 0} items)
                            </option>
                        ))}
                    </select>
                    <div className="flex gap-4">
                        <button
                            onClick={handleAdd}
                            className="px-6 py-3 bg-[#6556CD] text-white rounded-lg hover:bg-[#5546C0] transition-colors"
                        >
                            Add
                        </button>
                        <button
                            onClick={() => navigate('/collections/create')}
                            className="px-6 py-3 bg-zinc-700 text-white rounded-lg hover:bg-zinc-600 transition-colors"
                        >
                            Create New
                        </button>
                        {onClose && (
                            <button
                                onClick={onClose}
                                className="px-6 py-3 bg-zinc-700 text-white rounded-lg hover:bg-zinc-600 transition-colors"
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </>
            ) : (
                <div className="text-center">
                    <p className="text-zinc-400 mb-4">You don't have any collections yet</p>
                    <button
                        onClick={() => navigate('/collections/create')}
                        className="px-6 py-3 bg-[#6556CD] text-white rounded-lg hover:bg-[#5546C0] transition-colors"
                    >
                        Create Collection
                    </button>
                </div>
            )}
        </div>
    );
});

AddToCollection.displayName = 'AddToCollection';

export default AddToCollection;

