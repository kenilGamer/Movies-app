import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaHome, FaArrowLeft, FaSearch } from 'react-icons/fa';

const NotFound = () => {
    const navigate = useNavigate();
    document.title = `Not Found | Godcrafts`;

    return (
        <div className="w-screen h-screen flex flex-col justify-center items-center bg-gradient-to-br from-[#0f0b20] via-[#1a1430] to-[#0f0b20] text-white relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>

            <div className="relative z-10 flex flex-col items-center justify-center px-4 text-center animate-fadeIn">
                {/* 404 Text */}
                <div className="mb-8">
                    <h1 className="text-9xl md:text-[12rem] font-extrabold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-pulse">
                        404
                    </h1>
                </div>

                {/* Error Message */}
                <div className="mb-8 space-y-4">
                    <h2 className="text-3xl md:text-4xl font-bold text-white">
                        Page Not Found
                    </h2>
                    <p className="text-xl text-zinc-400 max-w-md">
                        Oops! The page you're looking for doesn't exist or has been moved.
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 mt-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
                    >
                        <FaArrowLeft /> Go Back
                    </button>
                    <Link
                        to="/"
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
                    >
                        <FaHome /> Go Home
                    </Link>
                    <Link
                        to="/search"
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
                    >
                        <FaSearch /> Search
                    </Link>
                </div>

                {/* Decorative elements */}
                <div className="mt-16 flex gap-2">
                    {[...Array(5)].map((_, i) => (
                        <div
                            key={i}
                            className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"
                            style={{ animationDelay: `${i * 0.1}s` }}
                        ></div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default NotFound;
