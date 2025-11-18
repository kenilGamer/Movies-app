import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../utils/config';
import { toast } from 'react-toastify';

const ReviewForm = React.memo(({ movieId, mediaType, onReviewSubmit, existingReview }) => {
    const [rating, setRating] = useState(existingReview?.rating || 0);
    const [review, setReview] = useState(existingReview?.review || '');
    const [hoveredRating, setHoveredRating] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (existingReview) {
            setRating(existingReview.rating);
            setReview(existingReview.review || '');
        }
    }, [existingReview]);

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        
        if (rating === 0) {
            toast.error('Please select a rating');
            return;
        }

        setIsSubmitting(true);
        try {
            const token = localStorage.getItem('token');
            const { data } = await axios.post(
                `${API_BASE_URL}/api/reviews`,
                { movieId, mediaType, rating, review },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            
            toast.success(existingReview ? 'Review updated!' : 'Review submitted!');
            if (onReviewSubmit) {
                onReviewSubmit(data.review);
            }
            if (!existingReview) {
                setRating(0);
                setReview('');
            }
        } catch (error) {
            console.error('Error submitting review:', error);
            toast.error('Failed to submit review');
        } finally {
            setIsSubmitting(false);
        }
    }, [movieId, mediaType, rating, review, existingReview, onReviewSubmit]);

    const renderStarInput = () => {
        return (
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
                        <button
                            key={value}
                            type="button"
                            onClick={() => setRating(value)}
                            onMouseEnter={() => setHoveredRating(value)}
                            onMouseLeave={() => setHoveredRating(0)}
                            className={`text-xl sm:text-2xl transition-colors touch-manipulation ${
                                (hoveredRating || rating) >= value
                                    ? 'text-yellow-400'
                                    : 'text-zinc-600'
                            }`}
                            aria-label={`Rate ${value} out of 10`}
                        >
                            <i className="ri-star-fill"></i>
                        </button>
                    ))}
                </div>
                <span className="text-sm sm:text-base text-zinc-400 font-semibold">({rating}/10)</span>
            </div>
        );
    };

    return (
        <div className="mt-6 sm:mt-10 bg-zinc-900/90 backdrop-blur-sm p-4 sm:p-6 rounded-lg sm:rounded-xl border border-zinc-800">
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">
                {existingReview ? 'Edit Your Review' : 'Write a Review'}
            </h3>
            <form onSubmit={handleSubmit}>
                <div className="mb-4 sm:mb-6">
                    <label className="block text-white font-semibold mb-3 text-sm sm:text-base">Rating *</label>
                    {renderStarInput()}
                </div>
                <div className="mb-4 sm:mb-6">
                    <label className="block text-white font-semibold mb-2 text-sm sm:text-base">Review (Optional)</label>
                    <textarea
                        value={review}
                        onChange={(e) => setReview(e.target.value)}
                        placeholder="Share your thoughts about this movie/show..."
                        className="w-full p-3 sm:p-4 text-sm sm:text-base bg-zinc-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6556CD] resize-none"
                        rows="4"
                        maxLength={5000}
                    />
                    <p className="text-zinc-400 text-xs sm:text-sm mt-2">{review.length}/5000 characters</p>
                </div>
                <button
                    type="submit"
                    disabled={isSubmitting || rating === 0}
                    className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-[#6556CD] text-white rounded-lg hover:bg-[#5546C0] active:bg-[#4535B0] disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold text-base sm:text-lg touch-manipulation"
                >
                    {isSubmitting ? 'Submitting...' : existingReview ? 'Update Review' : 'Submit Review'}
                </button>
            </form>
        </div>
    );
});

ReviewForm.displayName = 'ReviewForm';

export default ReviewForm;

