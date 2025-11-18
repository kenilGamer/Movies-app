import React, { useState, useEffect, useCallback } from 'react';
import axios from '../utils/axios';
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
            <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
                    <button
                        key={value}
                        type="button"
                        onClick={() => setRating(value)}
                        onMouseEnter={() => setHoveredRating(value)}
                        onMouseLeave={() => setHoveredRating(0)}
                        className={`text-2xl transition-colors ${
                            (hoveredRating || rating) >= value
                                ? 'text-yellow-400'
                                : 'text-zinc-600'
                        }`}
                    >
                        <i className="ri-star-fill"></i>
                    </button>
                ))}
                <span className="ml-2 text-zinc-400">({rating}/10)</span>
            </div>
        );
    };

    return (
        <div className="mt-10 bg-zinc-900 p-6 rounded-lg">
            <h3 className="text-2xl font-bold text-white mb-4">
                {existingReview ? 'Edit Your Review' : 'Write a Review'}
            </h3>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-white font-semibold mb-2">Rating</label>
                    {renderStarInput()}
                </div>
                <div className="mb-4">
                    <label className="block text-white font-semibold mb-2">Review (Optional)</label>
                    <textarea
                        value={review}
                        onChange={(e) => setReview(e.target.value)}
                        placeholder="Share your thoughts about this movie/show..."
                        className="w-full p-4 bg-zinc-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6556CD] resize-none"
                        rows="5"
                        maxLength={5000}
                    />
                    <p className="text-zinc-400 text-sm mt-1">{review.length}/5000 characters</p>
                </div>
                <button
                    type="submit"
                    disabled={isSubmitting || rating === 0}
                    className="px-6 py-3 bg-[#6556CD] text-white rounded-lg hover:bg-[#5546C0] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    {isSubmitting ? 'Submitting...' : existingReview ? 'Update Review' : 'Submit Review'}
                </button>
            </form>
        </div>
    );
});

ReviewForm.displayName = 'ReviewForm';

export default ReviewForm;

