import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useDebounce } from '../utils/useDebounce';
import axios from '../utils/axios';
import { toast } from 'react-toastify';

const AdvancedFilters = React.memo(({ mediaType = 'movie', onFilterChange, initialFilters = {} }) => {
    const [genres, setGenres] = useState([]);
    const [selectedGenres, setSelectedGenres] = useState(initialFilters.genres || []);
    const [yearRange, setYearRange] = useState({
        min: initialFilters.yearMin || 1900,
        max: initialFilters.yearMax || new Date().getFullYear()
    });
    const [ratingRange, setRatingRange] = useState({
        min: initialFilters.ratingMin || 0,
        max: initialFilters.ratingMax || 10
    });
    const [languages, setLanguages] = useState([]);
    const [selectedLanguage, setSelectedLanguage] = useState(initialFilters.language || '');
    const [sortBy, setSortBy] = useState(initialFilters.sortBy || 'popularity.desc');
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    // Debounce filter changes
    const debouncedYearRange = useDebounce(yearRange, 500);
    const debouncedRatingRange = useDebounce(ratingRange, 500);

    // Fetch genres
    useEffect(() => {
        const fetchGenres = async () => {
            try {
                const response = await axios.get(`/discover/genres/${mediaType}`);
                setGenres(response.data.genres || []);
            } catch (error) {
                console.error('Error fetching genres:', error);
                toast.error('Failed to load genres');
            }
        };
        fetchGenres();
    }, [mediaType]);

    // Common languages
    useEffect(() => {
        const commonLanguages = [
            { code: 'en', name: 'English' },
            { code: 'hi', name: 'Hindi' },
            { code: 'es', name: 'Spanish' },
            { code: 'fr', name: 'French' },
            { code: 'de', name: 'German' },
            { code: 'it', name: 'Italian' },
            { code: 'ja', name: 'Japanese' },
            { code: 'ko', name: 'Korean' },
            { code: 'zh', name: 'Chinese' },
            { code: 'pt', name: 'Portuguese' },
            { code: 'ru', name: 'Russian' },
            { code: 'ar', name: 'Arabic' },
        ];
        setLanguages(commonLanguages);
    }, []);

    // Notify parent of filter changes
    useEffect(() => {
        if (onFilterChange) {
            const filters = {
                genres: selectedGenres,
                yearMin: debouncedYearRange.min,
                yearMax: debouncedYearRange.max,
                ratingMin: debouncedRatingRange.min,
                ratingMax: debouncedRatingRange.max,
                language: selectedLanguage,
                sortBy,
            };
            onFilterChange(filters);
        }
    }, [selectedGenres, debouncedYearRange, debouncedRatingRange, selectedLanguage, sortBy, onFilterChange]);

    const handleGenreToggle = useCallback((genreId) => {
        setSelectedGenres(prev => {
            if (prev.includes(genreId)) {
                return prev.filter(id => id !== genreId);
            } else {
                return [...prev, genreId];
            }
        });
    }, []);

    const handleReset = useCallback(() => {
        setSelectedGenres([]);
        setYearRange({
            min: 1900,
            max: new Date().getFullYear()
        });
        setRatingRange({ min: 0, max: 10 });
        setSelectedLanguage('');
        setSortBy('popularity.desc');
    }, []);

    const sortOptions = useMemo(() => [
        { value: 'popularity.desc', label: 'Popularity (High to Low)' },
        { value: 'popularity.asc', label: 'Popularity (Low to High)' },
        { value: 'vote_average.desc', label: 'Rating (High to Low)' },
        { value: 'vote_average.asc', label: 'Rating (Low to High)' },
        { value: 'release_date.desc', label: 'Release Date (Newest)' },
        { value: 'release_date.asc', label: 'Release Date (Oldest)' },
        { value: 'title.asc', label: 'Title (A-Z)' },
        { value: 'title.desc', label: 'Title (Z-A)' },
    ], []);

    const currentYear = new Date().getFullYear();

    return (
        <div className="mb-6">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full p-4 bg-gradient-to-r from-zinc-800/90 to-zinc-900/90 backdrop-blur-sm border border-zinc-700/50 text-white rounded-xl flex items-center justify-between hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-500/20 transition-all duration-300 group"
            >
                <span className="font-semibold text-base sm:text-lg flex items-center gap-2">
                    <span className="text-indigo-400">⚙️</span>
                    Advanced Filters
                </span>
                <span className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                    <i className={`ri-arrow-down-s-line text-xl text-zinc-400 group-hover:text-indigo-400`}></i>
                </span>
            </button>

            {isOpen && (
                <div className="mt-4 p-4 sm:p-6 bg-gradient-to-br from-zinc-900/95 to-zinc-800/95 backdrop-blur-md border border-zinc-700/50 rounded-xl shadow-2xl shadow-black/50 space-y-6 animate-fadeIn">
                    {/* Genres */}
                    <div>
                        <label className="block text-white font-semibold mb-3 text-base sm:text-lg flex items-center gap-2">
                            <span className="text-indigo-400">🎬</span>
                            Genres
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {genres.map(genre => (
                                <button
                                    key={genre.id}
                                    onClick={() => handleGenreToggle(genre.id)}
                                    className={`px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 transform hover:scale-105 active:scale-95 ${
                                        selectedGenres.includes(genre.id)
                                            ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/50'
                                            : 'bg-zinc-700/50 text-zinc-300 hover:bg-zinc-600 hover:text-white border border-zinc-600/50'
                                    }`}
                                >
                                    {genre.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Year Range */}
                    <div>
                        <label className="block text-white font-semibold mb-3 text-base sm:text-lg flex items-center gap-2">
                            <span className="text-indigo-400">📅</span>
                            Year Range: <span className="text-indigo-400">{yearRange.min}</span> - <span className="text-indigo-400">{yearRange.max}</span>
                        </label>
                        <div className="flex gap-3 sm:gap-4 items-center">
                            <div className="flex-1">
                                <input
                                    type="range"
                                    min="1900"
                                    max={currentYear}
                                    value={yearRange.min}
                                    onChange={(e) => setYearRange(prev => ({ ...prev, min: parseInt(e.target.value) }))}
                                    className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                />
                            </div>
                            <div className="flex-1">
                                <input
                                    type="range"
                                    min="1900"
                                    max={currentYear}
                                    value={yearRange.max}
                                    onChange={(e) => setYearRange(prev => ({ ...prev, max: parseInt(e.target.value) }))}
                                    className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                />
                            </div>
                        </div>
                        <div className="flex justify-between text-zinc-400 text-sm mt-2">
                            <span className="bg-zinc-800/50 px-2 py-1 rounded">{yearRange.min}</span>
                            <span className="bg-zinc-800/50 px-2 py-1 rounded">{yearRange.max}</span>
                        </div>
                    </div>

                    {/* Rating Range */}
                    <div>
                        <label className="block text-white font-semibold mb-3 text-base sm:text-lg flex items-center gap-2">
                            <span className="text-indigo-400">⭐</span>
                            Rating: <span className="text-indigo-400">{ratingRange.min.toFixed(1)}</span> - <span className="text-indigo-400">{ratingRange.max.toFixed(1)}</span>
                        </label>
                        <div className="flex gap-3 sm:gap-4 items-center">
                            <div className="flex-1">
                                <input
                                    type="range"
                                    min="0"
                                    max="10"
                                    step="0.1"
                                    value={ratingRange.min}
                                    onChange={(e) => setRatingRange(prev => ({ ...prev, min: parseFloat(e.target.value) }))}
                                    className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                />
                            </div>
                            <div className="flex-1">
                                <input
                                    type="range"
                                    min="0"
                                    max="10"
                                    step="0.1"
                                    value={ratingRange.max}
                                    onChange={(e) => setRatingRange(prev => ({ ...prev, max: parseFloat(e.target.value) }))}
                                    className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                />
                            </div>
                        </div>
                        <div className="flex justify-between text-zinc-400 text-sm mt-2">
                            <span className="bg-zinc-800/50 px-2 py-1 rounded">{ratingRange.min.toFixed(1)}</span>
                            <span className="bg-zinc-800/50 px-2 py-1 rounded">{ratingRange.max.toFixed(1)}</span>
                        </div>
                    </div>

                    {/* Language */}
                    <div>
                        <label className="block text-white font-semibold mb-3 text-base sm:text-lg flex items-center gap-2">
                            <span className="text-indigo-400">🌐</span>
                            Language
                        </label>
                        <select
                            value={selectedLanguage}
                            onChange={(e) => setSelectedLanguage(e.target.value)}
                            className="w-full p-3 bg-zinc-800/50 border border-zinc-700/50 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300"
                        >
                            <option value="">All Languages</option>
                            {languages.map(lang => (
                                <option key={lang.code} value={lang.code}>
                                    {lang.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Sort By */}
                    <div>
                        <label className="block text-white font-semibold mb-3 text-base sm:text-lg flex items-center gap-2">
                            <span className="text-indigo-400">🔀</span>
                            Sort By
                        </label>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="w-full p-3 bg-zinc-800/50 border border-zinc-700/50 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300"
                        >
                            {sortOptions.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Reset Button */}
                    <button
                        onClick={handleReset}
                        className="w-full p-3 sm:p-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-300 font-semibold text-base sm:text-lg transform hover:scale-[1.02] active:scale-95 shadow-lg shadow-red-500/20"
                    >
                        🔄 Reset Filters
                    </button>
                </div>
            )}
        </div>
    );
});

AdvancedFilters.displayName = 'AdvancedFilters';

export default AdvancedFilters;

