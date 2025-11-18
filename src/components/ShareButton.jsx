import React, { useState, useCallback } from 'react';
import { toast } from 'react-toastify';

const ShareButton = React.memo(({ movieId, mediaType, title, description, posterPath }) => {
    const [showMenu, setShowMenu] = useState(false);

    const shareUrl = `${window.location.origin}/${mediaType}/datails/${movieId}`;
    const shareText = `Check out ${title} on Godcraft Movie!`;

    const handleShare = useCallback((platform) => {
        const encodedUrl = encodeURIComponent(shareUrl);
        const encodedText = encodeURIComponent(shareText);
        const encodedTitle = encodeURIComponent(title || '');
        const imageUrl = posterPath ? `https://image.tmdb.org/t/p/original/${posterPath}` : '';

        let shareLink = '';

        switch (platform) {
            case 'facebook':
                shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
                break;
            case 'twitter':
                shareLink = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`;
                break;
            case 'whatsapp':
                shareLink = `https://wa.me/?text=${encodedText}%20${encodedUrl}`;
                break;
            case 'copy':
                navigator.clipboard.writeText(shareUrl).then(() => {
                    toast.success('Link copied to clipboard!');
                    setShowMenu(false);
                }).catch(() => {
                    toast.error('Failed to copy link');
                });
                return;
            default:
                return;
        }

        if (shareLink) {
            window.open(shareLink, '_blank', 'width=600,height=400');
            setShowMenu(false);
        }
    }, [shareUrl, shareText, title, posterPath]);

    return (
        <div className="relative">
            <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-5 bg-[#6556CD] rounded-lg flex items-center gap-2 hover:bg-[#5546C0] transition-colors"
            >
                <i className="ri-share-line text-xl"></i>
                Share
            </button>
            {showMenu && (
                <div className="absolute top-full left-0 mt-2 bg-zinc-900 rounded-lg shadow-xl border border-zinc-800 z-50 min-w-[200px]">
                    <button
                        onClick={() => handleShare('facebook')}
                        className="w-full px-4 py-3 text-left hover:bg-zinc-800 transition-colors flex items-center gap-3 rounded-t-lg"
                    >
                        <i className="ri-facebook-fill text-blue-500 text-xl"></i>
                        <span className="text-white">Facebook</span>
                    </button>
                    <button
                        onClick={() => handleShare('twitter')}
                        className="w-full px-4 py-3 text-left hover:bg-zinc-800 transition-colors flex items-center gap-3"
                    >
                        <i className="ri-twitter-fill text-blue-400 text-xl"></i>
                        <span className="text-white">Twitter</span>
                    </button>
                    <button
                        onClick={() => handleShare('whatsapp')}
                        className="w-full px-4 py-3 text-left hover:bg-zinc-800 transition-colors flex items-center gap-3"
                    >
                        <i className="ri-whatsapp-fill text-green-500 text-xl"></i>
                        <span className="text-white">WhatsApp</span>
                    </button>
                    <button
                        onClick={() => handleShare('copy')}
                        className="w-full px-4 py-3 text-left hover:bg-zinc-800 transition-colors flex items-center gap-3 rounded-b-lg"
                    >
                        <i className="ri-file-copy-line text-zinc-400 text-xl"></i>
                        <span className="text-white">Copy Link</span>
                    </button>
                </div>
            )}
            {showMenu && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowMenu(false)}
                />
            )}
        </div>
    );
});

ShareButton.displayName = 'ShareButton';

export default ShareButton;

