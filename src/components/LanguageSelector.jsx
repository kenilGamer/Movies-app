import React, { useState, useEffect } from 'react';
import { getLanguage, setLanguage, getAvailableLanguages } from '../utils/i18n';
import { API_BASE_URL } from '../utils/config';
import axios from 'axios';
import { toast } from 'react-toastify';

const LanguageSelector = React.memo(() => {
    const [currentLang, setCurrentLang] = useState(getLanguage());
    const languages = getAvailableLanguages();

    useEffect(() => {
        const handleLanguageChange = () => {
            setCurrentLang(getLanguage());
        };

        window.addEventListener('languagechange', handleLanguageChange);
        return () => {
            window.removeEventListener('languagechange', handleLanguageChange);
        };
    }, []);

    const handleLanguageChange = async (langCode) => {
        setLanguage(langCode);
        setCurrentLang(langCode);

        // Update user preference in backend
        try {
            const token = localStorage.getItem('token');
            if (token) {
                await axios.put(
                    `${API_BASE_URL}/settings`,
                    { preferredLanguage: langCode },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            }
        } catch (error) {
            console.error('Error updating language preference:', error);
        }
    };

    return (
        <select
            value={currentLang}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="px-4 py-2 bg-zinc-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6556CD]"
        >
            {languages.map(lang => (
                <option key={lang.code} value={lang.code}>
                    {lang.name}
                </option>
            ))}
        </select>
    );
});

LanguageSelector.displayName = 'LanguageSelector';

export default LanguageSelector;

