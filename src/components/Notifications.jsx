import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaLongArrowAltLeft } from 'react-icons/fa';
import Topnev from '../partials/topnev';
import axios from '../utils/axios';
import Loading from './Loading';
import { API_BASE_URL } from '../utils/config';
import { toast } from 'react-toastify';

const Notifications = React.memo(() => {
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [showUnreadOnly, setShowUnreadOnly] = useState(false);
    const abortControllerRef = useRef(null);

    const fetchNotifications = useCallback(async (unreadOnly = false) => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        
        abortControllerRef.current = new AbortController();
        setIsLoading(true);
        
        try {
            const token = localStorage.getItem('token');
            const { data } = await axios.get(`${API_BASE_URL}/api/notifications`, {
                params: { unreadOnly },
                headers: { Authorization: `Bearer ${token}` },
                signal: abortControllerRef.current.signal
            });
            
            setNotifications(data.notifications || []);
            setUnreadCount(data.unreadCount || 0);
        } catch (error) {
            if (error.name !== 'CanceledError' && error.code !== 'ERR_CANCELED') {
                console.error('Error fetching notifications:', error);
                toast.error('Failed to load notifications');
            }
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchNotifications(showUnreadOnly);
        
        // Poll for new notifications every 30 seconds
        const interval = setInterval(() => {
            fetchNotifications(showUnreadOnly);
        }, 30000);
        
        return () => {
            clearInterval(interval);
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, [showUnreadOnly, fetchNotifications]);

    const handleMarkAsRead = useCallback(async (notificationId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(
                `${API_BASE_URL}/api/notifications/${notificationId}/read`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchNotifications(showUnreadOnly);
        } catch (error) {
            console.error('Error marking notification as read:', error);
            toast.error('Failed to mark notification as read');
        }
    }, [showUnreadOnly, fetchNotifications]);

    const handleMarkAllAsRead = useCallback(async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(
                `${API_BASE_URL}/api/notifications/read-all`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success('All notifications marked as read');
            fetchNotifications(showUnreadOnly);
        } catch (error) {
            console.error('Error marking all as read:', error);
            toast.error('Failed to mark all as read');
        }
    }, [showUnreadOnly, fetchNotifications]);

    const handleDelete = useCallback(async (notificationId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(
                `${API_BASE_URL}/api/notifications/${notificationId}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success('Notification deleted');
            fetchNotifications(showUnreadOnly);
        } catch (error) {
            console.error('Error deleting notification:', error);
            toast.error('Failed to delete notification');
        }
    }, [showUnreadOnly, fetchNotifications]);

    const handleNotificationClick = useCallback((notification) => {
        if (!notification.read) {
            handleMarkAsRead(notification._id);
        }
        if (notification.movieId && notification.mediaType) {
            navigate(`/${notification.mediaType}/datails/${notification.movieId}`);
        }
    }, [navigate, handleMarkAsRead]);

    const handleBack = useCallback(() => {
        navigate(-1);
    }, [navigate]);

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'new_release':
                return 'ri-movie-line';
            case 'recommendation':
                return 'ri-lightbulb-line';
            case 'collection_update':
                return 'ri-folder-line';
            case 'review':
                return 'ri-star-line';
            default:
                return 'ri-notification-line';
        }
    };

    return (
        <div className='w-full min-h-screen py-3 select-auto overflow-hidden overflow-y-auto'>
            <div className='w-full flex items-center gap-4 px-[3%] mb-6'>
                <h1 onClick={handleBack} className='text-2xl font-semibold hover:text-blue-500 flex items-center text-zinc-400 cursor-pointer'>
                    <FaLongArrowAltLeft /> Notifications
                </h1>
                <Topnev />
                {unreadCount > 0 && (
                    <button
                        onClick={handleMarkAllAsRead}
                        className="ml-auto px-4 py-2 bg-[#6556CD] text-white rounded-lg hover:bg-[#5546C0] transition-colors"
                    >
                        Mark All as Read
                    </button>
                )}
            </div>

            <div className="px-[3%] mb-4">
                <button
                    onClick={() => setShowUnreadOnly(!showUnreadOnly)}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                        showUnreadOnly
                            ? 'bg-[#6556CD] text-white'
                            : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                    }`}
                >
                    {showUnreadOnly ? 'Show All' : 'Show Unread Only'}
                </button>
            </div>

            {isLoading ? (
                <Loading />
            ) : notifications.length > 0 ? (
                <div className="px-[3%] space-y-4">
                    {notifications.map((notification) => (
                        <div
                            key={notification._id}
                            onClick={() => handleNotificationClick(notification)}
                            className={`bg-zinc-900 p-6 rounded-lg cursor-pointer hover:bg-zinc-800 transition-colors ${
                                !notification.read ? 'border-l-4 border-[#6556CD]' : ''
                            }`}
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex items-start gap-4 flex-1">
                                    <i className={`${getNotificationIcon(notification.type)} text-2xl text-[#6556CD] mt-1`}></i>
                                    <div className="flex-1">
                                        <p className="text-white mb-1">{notification.message}</p>
                                        <p className="text-zinc-400 text-sm">
                                            {new Date(notification.createdAt).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    {!notification.read && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleMarkAsRead(notification._id);
                                            }}
                                            className="px-3 py-1 bg-[#6556CD] text-white rounded text-sm hover:bg-[#5546C0]"
                                        >
                                            Mark Read
                                        </button>
                                    )}
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDelete(notification._id);
                                        }}
                                        className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex items-center justify-center h-64">
                    <p className="text-zinc-400 text-xl">No notifications</p>
                </div>
            )}
        </div>
    );
});

Notifications.displayName = 'Notifications';

export default Notifications;

