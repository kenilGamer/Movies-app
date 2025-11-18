import React, { useEffect, useState, useCallback, useRef } from 'react';
import axios from '../utils/axios';
import Card from '../partials/Card';
import Loading from './Loading';
import { API_BASE_URL } from '../utils/config';
import { toast } from 'react-toastify';

const Recommendations = React.memo(() => {
    const [recommendations, setRecommendations] = useState([]);
    const [reason, setReason] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const abortControllerRef = useRef(null);

    const fetchRecommendations = useCallback(async () => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        
        abortControllerRef.current = new AbortController();
        setIsLoading(true);
        
        try {
            const token = localStorage.getItem('token');
            const { data } = await axios.get(`${API_BASE_URL}/api/recommendations`, {
                headers: { Authorization: `Bearer ${token}` },
                signal: abortControllerRef.current.signal
            });
            
            setRecommendations(data.recommendations || []);
            setReason(data.reason || '');
        } catch (error) {
            if (error.name !== 'CanceledError' && error.code !== 'ERR_CANCELED') {
                console.error('Error fetching recommendations:', error);
                toast.error('Failed to load recommendations');
            }
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchRecommendations();
        
        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, [fetchRecommendations]);

    if (isLoading) {
        return <Loading />;
    }

    if (recommendations.length === 0) {
        return null;
    }

    return (
        <div className="mt-10">
            <h2 className="text-3xl font-bold text-white mb-2">Recommended For You</h2>
            {reason && (
                <p className="text-zinc-400 mb-6">{reason}</p>
            )}
            <Card data={recommendations} title="recommendations" />
        </div>
    );
});

Recommendations.displayName = 'Recommendations';

export default Recommendations;

