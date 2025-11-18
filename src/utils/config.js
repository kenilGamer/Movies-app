/**
 * Configuration utility for environment-based URLs
 * Uses Vite's import.meta.env for environment variables
 */

// Check if we're in production mode
const isProduction = import.meta.env.MODE === 'production' || 
                     import.meta.env.PROD || 
                     import.meta.env.VITE_PRODUCTION === 'production';

// Backend API base URL
export const API_BASE_URL = isProduction 
  ? 'https://movies-backend-07f5.onrender.com' 
  : 'http://localhost:3000';

// Frontend base URL
export const FRONTEND_BASE_URL = isProduction
  ? 'https://movies.godcarft.fun'
  : 'http://localhost:5173';

// Movie API base URL (for TMDB proxy)
export const MOVIE_API_BASE_URL = `${API_BASE_URL}/api/movies`;

export default {
  isProduction,
  API_BASE_URL,
  FRONTEND_BASE_URL,
  MOVIE_API_BASE_URL
};

