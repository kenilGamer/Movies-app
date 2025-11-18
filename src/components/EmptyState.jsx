import React from 'react';
import { useNavigate } from 'react-router-dom';

const EmptyState = ({ 
    icon, 
    title, 
    description, 
    actionLabel, 
    actionPath,
    onAction 
}) => {
    const navigate = useNavigate();

    const handleAction = () => {
        if (onAction) {
            onAction();
        } else if (actionPath) {
            navigate(actionPath);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 py-12 animate-fadeIn">
            <div className="mb-6 p-6 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full">
                {icon || (
                    <svg 
                        className="w-24 h-24 text-indigo-500/50" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                    >
                        <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={1.5} 
                            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" 
                        />
                    </svg>
                )}
            </div>
            <h3 className="text-2xl font-bold text-white mb-2 text-center">
                {title || "Nothing here yet"}
            </h3>
            <p className="text-zinc-400 text-center max-w-md mb-8">
                {description || "Start exploring to add items to your collection"}
            </p>
            {(actionLabel && (actionPath || onAction)) && (
                <button
                    onClick={handleAction}
                    className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                    {actionLabel}
                </button>
            )}
        </div>
    );
};

export default EmptyState;

