// Simple i18n implementation
const translations = {
  en: {
    home: 'Home',
    trending: 'Trending',
    popular: 'Popular',
    movies: 'Movies',
    tvShows: 'TV Shows',
    search: 'Search',
    watchlist: 'Watchlist',
    favorites: 'Favorites',
    collections: 'Collections',
    profile: 'Profile',
    settings: 'Settings',
    notifications: 'Notifications',
    logout: 'Logout',
    login: 'Login',
    signup: 'Sign Up',
    playTrailer: 'Play Trailer',
    watchNow: 'Watch Now',
    addToWatchlist: 'Add to Watchlist',
    addToFavorites: 'Add to Favorites',
    overview: 'Overview',
    cast: 'Cast',
    recommendations: 'Recommendations',
    reviews: 'Reviews',
    writeReview: 'Write a Review',
    share: 'Share',
    noResults: 'No results found',
    loading: 'Loading...',
    error: 'An error occurred',
  },
  hi: {
    home: 'होम',
    trending: 'ट्रेंडिंग',
    popular: 'लोकप्रिय',
    movies: 'फिल्में',
    tvShows: 'टीवी शो',
    search: 'खोजें',
    watchlist: 'वॉचलिस्ट',
    favorites: 'पसंदीदा',
    collections: 'संग्रह',
    profile: 'प्रोफ़ाइल',
    settings: 'सेटिंग्स',
    notifications: 'सूचनाएं',
    logout: 'लॉगआउट',
    login: 'लॉगिन',
    signup: 'साइन अप',
    playTrailer: 'ट्रेलर चलाएं',
    watchNow: 'अभी देखें',
    addToWatchlist: 'वॉचलिस्ट में जोड़ें',
    addToFavorites: 'पसंदीदा में जोड़ें',
    overview: 'अवलोकन',
    cast: 'कलाकार',
    recommendations: 'सुझाव',
    reviews: 'समीक्षाएं',
    writeReview: 'समीक्षा लिखें',
    share: 'साझा करें',
    noResults: 'कोई परिणाम नहीं मिला',
    loading: 'लोड हो रहा है...',
    error: 'एक त्रुटि हुई',
  },
  es: {
    home: 'Inicio',
    trending: 'Tendencias',
    popular: 'Popular',
    movies: 'Películas',
    tvShows: 'Programas de TV',
    search: 'Buscar',
    watchlist: 'Lista de seguimiento',
    favorites: 'Favoritos',
    collections: 'Colecciones',
    profile: 'Perfil',
    settings: 'Configuración',
    notifications: 'Notificaciones',
    logout: 'Cerrar sesión',
    login: 'Iniciar sesión',
    signup: 'Registrarse',
    playTrailer: 'Reproducir tráiler',
    watchNow: 'Ver ahora',
    addToWatchlist: 'Agregar a lista',
    addToFavorites: 'Agregar a favoritos',
    overview: 'Resumen',
    cast: 'Reparto',
    recommendations: 'Recomendaciones',
    reviews: 'Reseñas',
    writeReview: 'Escribir reseña',
    share: 'Compartir',
    noResults: 'No se encontraron resultados',
    loading: 'Cargando...',
    error: 'Ocurrió un error',
  },
};

let currentLanguage = localStorage.getItem('language') || 'en';

export const setLanguage = (lang) => {
  if (translations[lang]) {
    currentLanguage = lang;
    localStorage.setItem('language', lang);
    window.dispatchEvent(new Event('languagechange'));
  }
};

export const getLanguage = () => currentLanguage;

export const t = (key) => {
  return translations[currentLanguage]?.[key] || translations.en[key] || key;
};

export const getAvailableLanguages = () => {
  return Object.keys(translations).map(code => ({
    code,
    name: {
      en: 'English',
      hi: 'हिंदी',
      es: 'Español',
    }[code] || code,
  }));
};

