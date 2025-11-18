import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from '../utils/axios';
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
            const { data } = await axios.get(`/reviews/${mediaType}/${movieId}`, {
                params: { page: currentPage },
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
        <div className="mt-10">
            <div className="mb-6">
                <h2 className="text-3xl font-bold text-white mb-2">Reviews & Ratings</h2>
                <div className="flex items-center gap-4">
                    {renderStars(averageRating / 2)}
                    <span className="text-zinc-400">({ratingCount} {ratingCount === 1 ? 'review' : 'reviews'})</span>
                </div>
            </div>

            {reviews.length > 0 ? (
                <>
                    <div className="space-y-4">
                        {reviews.map((review) => (
                            <div key={review._id} className="bg-zinc-900 p-6 rounded-lg">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-[#6556CD] flex items-center justify-center text-white font-semibold">
                                            {review.userId?.username?.charAt(0).toUpperCase() || 'U'}
                                        </div>
                                        <div>
                                            <h4 className="text-white font-semibold">
                                                {review.userId?.username || 'Anonymous'}
                                            </h4>
                                            <p className="text-zinc-400 text-sm">
                                                {new Date(review.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    {renderStars(review.rating / 2)}
                                </div>
                                {review.review && (
                                    <p className="text-zinc-300 mt-3">{review.review}</p>
                                )}
                            </div>
                        ))}
                    </div>
                    {hasMore && (
                        <button
                            onClick={() => fetchReviews(page + 1)}
                            className="mt-6 px-6 py-3 bg-[#6556CD] text-white rounded-lg hover:bg-[#5546C0] transition-colors"
                        >
                            Load More Reviews
                        </button>
                    )}
                </>
            ) : (
                <p className="text-zinc-400 text-center py-8">No reviews yet. Be the first to review!</p>
            )}
        </div>
    );
});

Reviews.displayName = 'Reviews';

export default Reviews;

