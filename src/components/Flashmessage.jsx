import React, { useEffect, useState } from 'react';
import { IoClose, IoCheckmarkCircle, IoAlertCircle, IoInformationCircle } from 'react-icons/io5';

function Flashmessage({ getError, errorKey, duration = 5000, type = 'error' }) {
    const [visible, setVisible] = useState(false);
    const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
        if (getError) {
            setVisible(true);
            setIsExiting(false);
            const timer = setTimeout(() => {
                setIsExiting(true);
                setTimeout(() => setVisible(false), 300);
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [getError, duration, errorKey]);

    const handleClose = () => {
        setIsExiting(true);
        setTimeout(() => setVisible(false), 300);
    };

    if (!visible) return null;

    const typeConfig = {
        error: {
            bg: 'bg-red-500/10 border-red-500/50',
            text: 'text-red-400',
            icon: <IoAlertCircle className="text-red-400" />,
            gradient: 'from-red-500/20 to-red-600/10'
        },
        success: {
            bg: 'bg-green-500/10 border-green-500/50',
            text: 'text-green-400',
            icon: <IoCheckmarkCircle className="text-green-400" />,
            gradient: 'from-green-500/20 to-green-600/10'
        },
        info: {
            bg: 'bg-blue-500/10 border-blue-500/50',
            text: 'text-blue-400',
            icon: <IoInformationCircle className="text-blue-400" />,
            gradient: 'from-blue-500/20 to-blue-600/10'
        },
        warning: {
            bg: 'bg-yellow-500/10 border-yellow-500/50',
            text: 'text-yellow-400',
            icon: <IoAlertCircle className="text-yellow-400" />,
            gradient: 'from-yellow-500/20 to-yellow-600/10'
        }
    };

    const config = typeConfig[type] || typeConfig.error;

    return (
        <div
            className={`fixed top-4 right-4 max-md:left-4 max-md:right-4 z-[9999] transform transition-all duration-300 ${
                isExiting ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'
            }`}
        >
            <div
                className={`${config.bg} border backdrop-blur-md rounded-xl shadow-2xl p-4 max-w-md w-full flex items-start gap-3 animate-slideInRight`}
            >
                <div className={`flex-shrink-0 text-xl ${config.text}`}>
                    {config.icon}
                </div>
                <div className="flex-1 min-w-0">
                    <p className={`${config.text} font-medium text-sm leading-relaxed break-words`}>
                        {getError}
                    </p>
                </div>
                <button
                    onClick={handleClose}
                    className={`flex-shrink-0 ${config.text} hover:opacity-70 transition-opacity p-1 rounded hover:bg-white/5`}
                    aria-label="Close"
                >
                    <IoClose className="text-lg" />
                </button>
            </div>
        </div>
    );
}

export default Flashmessage;
