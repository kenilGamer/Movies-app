/**
 * Helper functions for Bollywood movie filtering and processing
 */

/**
 * Check if a movie is a Bollywood/Hindi movie
 * @param {Object} movie - Movie object from TMDB API
 * @returns {boolean}
 */
export const isBollywoodMovie = (movie) => {
  return (
    movie.original_language === 'hi' ||
    movie.origin_country?.includes('IN') ||
    movie.production_countries?.some(country => country.iso_3166_1 === 'IN')
  );
};

/**
 * Filter movies to only include Bollywood/Hindi movies
 * @param {Array} movies - Array of movie objects
 * @returns {Array} - Filtered array of Bollywood movies
 */
export const filterBollywoodMovies = (movies) => {
  if (!Array.isArray(movies)) return [];
  return movies.filter(isBollywoodMovie);
};

/**
 * Get Bollywood genre IDs (from TMDB)
 * Common Bollywood genres: Drama (18), Romance (10749), Comedy (35), Action (28)
 */
export const BOLLYWOOD_GENRES = {
  DRAMA: 18,
  ROMANCE: 10749,
  COMEDY: 35,
  ACTION: 28,
  THRILLER: 53,
  FAMILY: 10751
};

/**
 * Format movie data for display
 * @param {Object} movie - Movie object
 * @returns {Object} - Formatted movie object
 */
export const formatBollywoodMovie = (movie) => {
  return {
    ...movie,
    isBollywood: true,
    displayTitle: movie.title || movie.original_title,
    displayLanguage: 'Hindi'
  };
};

export default {
  isBollywoodMovie,
  filterBollywoodMovies,
  BOLLYWOOD_GENRES,
  formatBollywoodMovie
};

