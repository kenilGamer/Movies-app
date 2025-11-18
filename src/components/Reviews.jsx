import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../utils/config';
import { toast } from 'react-toastify';
import Loading from './Loading';

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

    const renderStars = (rating) => {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

        return (
            <div className="flex items-center gap-1">
                {[...Array(fullStars)].map((_, i) => (
                    <i key={i} className="ri-star-fill text-yellow-400"></i>
                ))}
                {hasHalfStar && <i className="ri-star-half-fill text-yellow-400"></i>}
                {[...Array(emptyStars)].map((_, i) => (
                    <i key={i} className="ri-star-line text-yellow-400"></i>
                ))}
                <span className="ml-2 text-zinc-400">{rating.toFixed(1)}</span>
            </div>
        );
    };

    if (isLoading && reviews.length === 0) {
        return <Loading />;
    }

    return (
        <div className="mt-6 sm:mt-10 px-2 sm:px-0">
            <div className="mb-4 sm:mb-6">
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4">Reviews & Ratings</h2>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                    {renderStars(averageRating / 2)}
                    <span className="text-sm sm:text-base text-zinc-400">({ratingCount} {ratingCount === 1 ? 'review' : 'reviews'})</span>
                </div>
            </div>

            {reviews.length > 0 ? (
                <>
                    <div className="space-y-3 sm:space-y-4">
                        {reviews.map((review) => (
                            <div key={review._id} className="bg-zinc-900/90 backdrop-blur-sm p-4 sm:p-6 rounded-lg sm:rounded-xl border border-zinc-800">
                                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4 mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#6556CD] flex items-center justify-center text-white font-semibold text-sm sm:text-base flex-shrink-0">
                                            {review.userId?.username?.charAt(0).toUpperCase() || 'U'}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <h4 className="text-white font-semibold text-sm sm:text-base truncate">
                                                {review.userId?.username || 'Anonymous'}
                                            </h4>
                                            <p className="text-zinc-400 text-xs sm:text-sm">
                                                {new Date(review.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex-shrink-0">
                                        {renderStars(review.rating / 2)}
                                    </div>
                                </div>
                                {review.review && (
                                    <p className="text-zinc-300 mt-3 text-sm sm:text-base leading-relaxed break-words">{review.review}</p>
                                )}
                            </div>
                        ))}
                    </div>
                    {hasMore && (
                        <div className="text-center mt-6">
                            <button
                                onClick={() => fetchReviews(page + 1)}
                                className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-[#6556CD] text-white rounded-lg hover:bg-[#5546C0] active:bg-[#4535B0] transition-colors font-semibold text-base sm:text-lg touch-manipulation"
                            >
                                Load More Reviews
                            </button>
                        </div>
                    )}
                </>
            ) : (
                <div className="text-center py-8 animate-fadeIn">
                    <div className="text-6xl mb-4">⭐</div>
                    <p className="text-zinc-400 text-base sm:text-lg">No reviews yet.</p>
                    <p className="text-zinc-500 text-sm sm:text-base mt-2">Be the first to share your thoughts!</p>
                </div>
            )}
        </div>
    );
});

Reviews.displayName = 'Reviews';

export default Reviews;

