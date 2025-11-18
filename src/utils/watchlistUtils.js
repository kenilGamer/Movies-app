import axios from './axios';
import { API_BASE_URL } from './config';
import { toast } from 'react-toastify';

/**
 * Add item to watchlist
 */
export const addToWatchlist = async (movieId, mediaType) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(
      `${API_BASE_URL}/api/user/watchlist`,
      { movieId, mediaType },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    toast.success('Added to watchlist');
    return response.data;
  } catch (error) {
    if (error.response?.status === 400 && error.response.data.error === 'Item already in watchlist') {
      toast.info('Already in watchlist');
    } else {
      toast.error('Failed to add to watchlist');
    }
    throw error;
  }
};

/**
 * Remove item from watchlist
 */
export const removeFromWatchlist = async (movieId, mediaType) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.delete(
      `${API_BASE_URL}/api/user/watchlist/${movieId}/${mediaType}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    toast.success('Removed from watchlist');
    return response.data;
  } catch (error) {
    toast.error('Failed to remove from watchlist');
    throw error;
  }
};

/**
 * Add item to favorites
 */
export const addToFavorites = async (movieId, mediaType) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(
      `${API_BASE_URL}/api/user/favorites`,
      { movieId, mediaType },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    toast.success('Added to favorites');
    return response.data;
  } catch (error) {
    if (error.response?.status === 400 && error.response.data.error === 'Item already in favorites') {
      toast.info('Already in favorites');
    } else {
      toast.error('Failed to add to favorites');
    }
    throw error;
  }
};

/**
 * Remove item from favorites
 */
export const removeFromFavorites = async (movieId, mediaType) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.delete(
      `${API_BASE_URL}/api/user/favorites/${movieId}/${mediaType}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    toast.success('Removed from favorites');
    return response.data;
  } catch (error) {
    toast.error('Failed to remove from favorites');
    throw error;
  }
};

/**
 * Check if item is in watchlist/favorites
 */
export const checkItemStatus = async (movieId, mediaType) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(
      `${API_BASE_URL}/api/user/check/${movieId}/${mediaType}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    return { inWatchlist: false, inFavorites: false };
  }
};

