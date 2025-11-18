import axios from './axios';
import { API_BASE_URL } from './config';
import { toast } from 'react-toastify';

/**
 * Get user's collections
 */
export const getUserCollections = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_BASE_URL}/api/collections`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data.collections || [];
  } catch (error) {
    console.error('Error fetching collections:', error);
    return [];
  }
};

/**
 * Add item to collection
 */
export const addToCollection = async (collectionId, movieId, mediaType) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(
      `${API_BASE_URL}/api/collections/${collectionId}/items`,
      { movieId, mediaType },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    toast.success('Added to collection');
    return response.data;
  } catch (error) {
    if (error.response?.status === 400 && error.response.data.error === 'Item already in collection') {
      toast.info('Already in collection');
    } else {
      toast.error('Failed to add to collection');
    }
    throw error;
  }
};

/**
 * Remove item from collection
 */
export const removeFromCollection = async (collectionId, movieId, mediaType) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.delete(
      `${API_BASE_URL}/api/collections/${collectionId}/items/${movieId}/${mediaType}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    toast.success('Removed from collection');
    return response.data;
  } catch (error) {
    toast.error('Failed to remove from collection');
    throw error;
  }
};

