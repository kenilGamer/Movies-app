import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axios';
import { API_BASE_URL } from '../utils/config';

const NotificationBell = React.memo(() => {
    const navigate = useNavigate();
    const [unreadCount, setUnreadCount] = useState(0);
    const [showDropdown, setShowDropdown] = useState(false);
    const [recentNotifications, setRecentNotifications] = useState([]);
    const abortControllerRef = useRef(null);

    const fetchUnreadCount = useCallback(async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            const { data } = await axios.get(`${API_BASE_URL}/api/notifications/unread-count`, {
                headers: { Authorization: `Bearer ${token}` },
                signal: abortControllerRef.current?.signal
            });
            setUnreadCount(data.unreadCount || 0);
        } catch (error) {
            if (error.name !== 'CanceledError' && error.code !== 'ERR_CANCELED') {
                console.error('Error fetching unread count:', error);
            }
        }
    }, []);

    const fetchRecentNotifications = useCallback(async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            const { data } = await axios.get(`${API_BASE_URL}/api/notifications`, {
                params: { unreadOnly: true, limit: 5 },
                headers: { Authorization: `Bearer ${token}` },
                signal: abortControllerRef.current?.signal
            });
            setRecentNotifications(data.notifications || []);
        } catch (error) {
            if (error.name !== 'CanceledError' && error.code !== 'ERR_CANCELED') {
                console.error('Error fetching recent notifications:', error);
            }
        }
    }, []);

    useEffect(() => {
        fetchUnreadCount();
        const interval = setInterval(fetchUnreadCount, 30000); // Poll every 30 seconds
        
        return () => {
            clearInterval(interval);
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, [fetchUnreadCount]);

    useEffect(() => {
        if (showDropdown) {
            fetchRecentNotifications();
        }
    }, [showDropdown, fetchRecentNotifications]);

    const handleNotificationClick = (notification) => {
        setShowDropdown(false);
        if (notification.movieId && notification.mediaType) {
            navigate(`/${notification.mediaType}/datails/${notification.movieId}`);
        } else {
            navigate('/notifications');
        }
    };

    return (
        <div className="relative">
            <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="relative p-2 text-zinc-400 hover:text-white transition-colors"
            >
                <i className="ri-notification-line text-2xl"></i>
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>
            {showDropdown && (
                <div className="absolute right-0 mt-2 w-80 bg-zinc-900 rounded-lg shadow-xl border border-zinc-800 z-50 max-h-96 overflow-y-auto">
                    <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
                        <h3 className="text-white font-semibold">Notifications</h3>
                        <button
                            onClick={() => navigate('/notifications')}
                            className="text-[#6556CD] text-sm hover:underline"
                        >
                            View All
                        </button>
                    </div>
                    {recentNotifications.length > 0 ? (
                        <div className="divide-y divide-zinc-800">
                            {recentNotifications.map((notification) => (
                                <div
                                    key={notification._id}
                                    onClick={() => handleNotificationClick(notification)}
                                    className="p-4 hover:bg-zinc-800 cursor-pointer transition-colors"
                                >
                                    <p className="text-white text-sm mb-1">{notification.message}</p>
                                    <p className="text-zinc-400 text-xs">
                                        {new Date(notification.createdAt).toLocaleString()}
                                    </p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-4 text-center text-zinc-400 text-sm">
                            No new notifications
                        </div>
                    )}
                </div>
            )}
        </div>
    );
});

NotificationBell.displayName = 'NotificationBell';

export default NotificationBell;

