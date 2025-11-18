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
                className="w-full p-4 bg-zinc-800 text-white rounded-lg flex items-center justify-between hover:bg-zinc-700 transition-colors"
            >
                <span className="font-semibold">Advanced Filters</span>
                <i className={`ri-arrow-${isOpen ? 'up' : 'down'}-s-line text-xl`}></i>
            </button>

            {isOpen && (
                <div className="mt-4 p-6 bg-zinc-900 rounded-lg space-y-6">
                    {/* Genres */}
                    <div>
                        <label className="block text-white font-semibold mb-3">Genres</label>
                        <div className="flex flex-wrap gap-2">
                            {genres.map(genre => (
                                <button
                                    key={genre.id}
                                    onClick={() => handleGenreToggle(genre.id)}
                                    className={`px-4 py-2 rounded-full text-sm transition-colors ${
                                        selectedGenres.includes(genre.id)
                                            ? 'bg-[#6556CD] text-white'
                                            : 'bg-zinc-700 text-zinc-300 hover:bg-zinc-600'
                                    }`}
                                >
                                    {genre.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Year Range */}
                    <div>
                        <label className="block text-white font-semibold mb-3">
                            Year Range: {yearRange.min} - {yearRange.max}
                        </label>
                        <div className="flex gap-4 items-center">
                            <input
                                type="range"
                                min="1900"
                                max={currentYear}
                                value={yearRange.min}
                                onChange={(e) => setYearRange(prev => ({ ...prev, min: parseInt(e.target.value) }))}
                                className="flex-1"
                            />
                            <input
                                type="range"
                                min="1900"
                                max={currentYear}
                                value={yearRange.max}
                                onChange={(e) => setYearRange(prev => ({ ...prev, max: parseInt(e.target.value) }))}
                                className="flex-1"
                            />
                        </div>
                        <div className="flex justify-between text-zinc-400 text-sm mt-2">
                            <span>{yearRange.min}</span>
                            <span>{yearRange.max}</span>
                        </div>
                    </div>

                    {/* Rating Range */}
                    <div>
                        <label className="block text-white font-semibold mb-3">
                            Rating: {ratingRange.min} - {ratingRange.max}
                        </label>
                        <div className="flex gap-4 items-center">
                            <input
                                type="range"
                                min="0"
                                max="10"
                                step="0.1"
                                value={ratingRange.min}
                                onChange={(e) => setRatingRange(prev => ({ ...prev, min: parseFloat(e.target.value) }))}
                                className="flex-1"
                            />
                            <input
                                type="range"
                                min="0"
                                max="10"
                                step="0.1"
                                value={ratingRange.max}
                                onChange={(e) => setRatingRange(prev => ({ ...prev, max: parseFloat(e.target.value) }))}
                                className="flex-1"
                            />
                        </div>
                        <div className="flex justify-between text-zinc-400 text-sm mt-2">
                            <span>{ratingRange.min.toFixed(1)}</span>
                            <span>{ratingRange.max.toFixed(1)}</span>
                        </div>
                    </div>

                    {/* Language */}
                    <div>
                        <label className="block text-white font-semibold mb-3">Language</label>
                        <select
                            value={selectedLanguage}
                            onChange={(e) => setSelectedLanguage(e.target.value)}
                            className="w-full p-3 bg-zinc-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6556CD]"
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
                        <label className="block text-white font-semibold mb-3">Sort By</label>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="w-full p-3 bg-zinc-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6556CD]"
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
                        className="w-full p-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                        Reset Filters
                    </button>
                </div>
            )}
        </div>
    );
});

AdvancedFilters.displayName = 'AdvancedFilters';

export default AdvancedFilters;

