import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../utils/config';
import { toast } from 'react-toastify';
import Loading from './Loading';
import { FaStar } from 'react-icons/fa';

const Reviews = React.memo(({ movieId, mediaType }) => {
    const [reviews, setReviews] = useState([]);
    const [averageRating, setAverageRating] = useState(0);
    const [ratingCount, setRatingCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);
    const abortControllerRef = useRef(null);

    const fetchReviews = useCallback(async (currentPage = 1) => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        abortControllerRef.current = new AbortController();
        setIsLoading(true);

        try {
            const token = localStorage.getItem('token');
            const headers = token ? { Authorization: `Bearer ${token}` } : {};
            
            const { data } = await axios.get(`${API_BASE_URL}/api/reviews/${mediaType}/${movieId}`, {
                params: { page: currentPage },
                headers,
                signal: abortControllerRef.current.signal
            });

            if (currentPage === 1) {
                setReviews(data.reviews || []);
            } else {
                setReviews(prev => [...prev, ...(data.reviews || [])]);
            }

            setAverageRating(parseFloat(data.averageRating) || 0);
            setRatingCount(data.ratingCount || 0);
            setHasMore(data.pagination.page < data.pagination.totalPages);
            setPage(currentPage);
        } catch (error) {
            if (error.name !== 'CanceledError' && error.code !== 'ERR_CANCELED') {
                console.error('Error fetching reviews:', error);
                toast.error('Failed to load reviews');
            }
        } finally {
            setIsLoading(false);
        }
    }, [movieId, mediaType]);

    useEffect(() => {
        fetchReviews(1);
        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, [movieId, mediaType]);

    const renderStars = (rating, size = 'base', outlined = false) => {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
        
        const sizeClasses = {
            sm: 'text-sm',
            base: 'text-base',
            lg: 'text-lg',
            xl: 'text-xl',
            '2xl': 'text-2xl',
            '3xl': 'text-3xl',
            '4xl': 'text-4xl',
            '5xl': 'text-5xl',
            '6xl': 'text-6xl'
        };

        return (
            <div className="flex items-center gap-1 sm:gap-1.5">
                {[...Array(fullStars)].map((_, i) => (
                    <FaStar 
                        key={i} 
                        className={`${sizeClasses[size]} text-yellow-400 fill-current drop-shadow-lg`}
                    />
                ))}
                {hasHalfStar && (
                    <div className="relative">
                        <FaStar className={`${sizeClasses[size]} text-yellow-400 fill-current drop-shadow-lg`} style={{ clipPath: 'inset(0 50% 0 0)' }} />
                        <FaStar className={`${sizeClasses[size]} text-zinc-600 fill-current absolute top-0 left-0`} style={{ clipPath: 'inset(0 0 0 50%)' }} />
                    </div>
                )}
                {[...Array(emptyStars)].map((_, i) => (
                    <FaStar 
                        key={i} 
                        className={`${sizeClasses[size]} ${outlined ? 'text-yellow-400/30' : 'text-zinc-600'} fill-current`}
                        style={outlined ? { 
                            filter: 'drop-shadow(0 0 1px rgba(250, 204, 21, 0.5))',
                            WebkitTextStroke: '1px rgba(250, 204, 21, 0.4)'
                        } : {}}
                    />
                ))}
            </div>
        );
    };

    if (isLoading && reviews.length === 0) {
        return <Loading />;
    }

    const displayRating = averageRating > 0 ? (averageRating / 2).toFixed(1) : '0.0';

    return (
        <div className="mt-6 sm:mt-10 px-2 sm:px-0">
            {/* Header Section */}
            <div className="mb-6 sm:mb-8">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6 tracking-tight">
                    Reviews & Ratings
                </h2>
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                    <div className="flex items-center gap-3 sm:gap-4">
                        {renderStars(averageRating / 2, 'lg', averageRating === 0)}
                        <span className="text-base sm:text-lg text-white font-medium">
                            {displayRating} <span className="text-zinc-400 font-normal">({ratingCount} {ratingCount === 1 ? 'review' : 'reviews'})</span>
                        </span>
                    </div>
                </div>
            </div>

            {reviews.length > 0 ? (
                <>
                    <div className="space-y-4 sm:space-y-5">
                        {reviews.map((review) => (
                            <div 
                                key={review._id} 
                                className="group bg-gradient-to-br from-zinc-900/95 to-zinc-800/80 backdrop-blur-md p-5 sm:p-6 rounded-xl sm:rounded-2xl border border-zinc-800/50 shadow-lg shadow-black/20 hover:shadow-xl hover:shadow-indigo-500/10 hover:border-indigo-500/30 transition-all duration-300"
                            >
                                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                                    <div className="flex items-center gap-3 sm:gap-4">
                                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold text-base sm:text-lg flex-shrink-0 shadow-lg ring-2 ring-white/10">
                                            {review.userId?.username?.charAt(0).toUpperCase() || 'U'}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <h4 className="text-white font-semibold text-base sm:text-lg truncate mb-1">
                                                {review.userId?.username || 'Anonymous'}
                                            </h4>
                                            <p className="text-zinc-400 text-sm">
                                                {new Date(review.createdAt).toLocaleDateString('en-US', { 
                                                    year: 'numeric', 
                                                    month: 'long', 
                                                    day: 'numeric' 
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex-shrink-0">
                                        {renderStars(review.rating / 2, 'base')}
                                    </div>
                                </div>
                                {review.review && (
                                    <p className="text-zinc-300 mt-4 text-sm sm:text-base leading-relaxed break-words whitespace-pre-wrap">
                                        {review.review}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                    {hasMore && (
                        <div className="text-center mt-8">
                            <button
                                onClick={() => fetchReviews(page + 1)}
                                className="px-8 sm:px-10 py-3 sm:py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-500 hover:to-purple-500 active:scale-95 transition-all duration-300 font-semibold text-base sm:text-lg shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/50 touch-manipulation"
                            >
                                Load More Reviews
                            </button>
                        </div>
                    )}
                </>
            ) : (
                <div className="relative text-center py-12 sm:py-16 md:py-20 animate-fadeIn">
                    {/* Large Glowing Star */}
                    <div className="relative inline-block mb-6 sm:mb-8">
                        <div className="absolute inset-0 blur-2xl bg-yellow-400/30 rounded-full animate-pulse"></div>
                        <div className="relative">
                            <FaStar className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-yellow-400 fill-current drop-shadow-2xl transform rotate-12 animate-pulse" 
                                style={{
                                    filter: 'drop-shadow(0 0 20px rgba(250, 204, 21, 0.6)) drop-shadow(0 0 40px rgba(250, 204, 21, 0.4))',
                                }}
                            />
                        </div>
                    </div>
                    
                    <p className="text-xl sm:text-2xl md:text-3xl text-white font-semibold mb-3 sm:mb-4">
                        No reviews yet.
                    </p>
                    <p className="text-base sm:text-lg md:text-xl text-zinc-400">
                        Be the first to share your thoughts!
                    </p>
                </div>
            )}
        </div>
    );
});

Reviews.displayName = 'Reviews';

export default Reviews;

