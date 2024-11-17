import React, { useEffect, useState } from 'react';

function Flashmessage({ getError, errorKey, duration = 5000 }) {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (getError) {
            setVisible(true);
            const timer = setTimeout(() => setVisible(false), duration);
            return () => clearTimeout(timer);
        }
    }, [getError, duration, errorKey]);

    return (
        visible && (
            <div
                className="absolute top-2 max-md:left-1/2 transform max-md:-translate-x-1/2 right-2 text-[#D32F2F] text-center text-xl font-bold p-4 rounded-xl shadow-md transition-opacity duration-1000 opacity-100 hover:opacity-80 max-md:w-[90vw] max-md:text-sm"
                style={{
                    background: 'linear-gradient(135deg, #FFCDD2, #FFEBEE)',
                    maxWidth: '90%',
                    zIndex: 1000,
                }}
            >
                {getError}
                <button
                    className="ml-4 text-sm text-[#C62828] hover:text-[#B71C1C]"
                    onClick={() => setVisible(false)}
                >
                    ✕
                </button>
            </div>
        )
    );
}

export default Flashmessage;
