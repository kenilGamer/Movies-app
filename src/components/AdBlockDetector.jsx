import React, { useState, useEffect } from 'react';
import { useAdBlock } from '../utils/useAdBlock';
import { FaTimes, FaShieldAlt, FaExclamationTriangle } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const AdBlockDetector = () => {
  const adBlockDetected = useAdBlock();
  const [showWarning, setShowWarning] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Check if user has dismissed the warning before
    const dismissedStatus = localStorage.getItem('adblock-warning-dismissed');
    if (dismissedStatus === 'true') {
      setDismissed(true);
    }

    // Show warning if ad blocker is detected and not dismissed
    if (adBlockDetected && !dismissed) {
      // Delay showing the warning by 2 seconds to avoid interrupting initial page load
      const timer = setTimeout(() => {
        setShowWarning(true);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [adBlockDetected, dismissed]);

  const handleDismiss = () => {
    setShowWarning(false);
    setDismissed(true);
    localStorage.setItem('adblock-warning-dismissed', 'true');
  };

  const handleDismissPermanently = () => {
    setShowWarning(false);
    setDismissed(true);
    localStorage.setItem('adblock-warning-dismissed', 'permanent');
  };

  if (!adBlockDetected || dismissed || !showWarning) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-96 z-[10000] animate-slideInUp">
      <div className="bg-gradient-to-br from-yellow-900/95 to-orange-900/95 backdrop-blur-md rounded-xl shadow-2xl border-2 border-yellow-500/50 p-4 sm:p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-500/20 rounded-lg">
              <FaShieldAlt className="text-yellow-400 text-xl" />
            </div>
            <div>
              <h3 className="text-white font-bold text-base sm:text-lg flex items-center gap-2">
                <FaExclamationTriangle className="text-yellow-400" />
                Ad Blocker Detected
              </h3>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
            aria-label="Close warning"
          >
            <FaTimes className="text-white/80 hover:text-white text-sm" />
          </button>
        </div>

        {/* Content */}
        <div className="mb-4">
          <p className="text-white/90 text-sm leading-relaxed mb-3">
            We've detected that you're using an ad blocker. Some features may not work correctly, and we rely on ads to keep our service free.
          </p>
          <div className="flex flex-col sm:flex-row gap-2">
            <Link
              to="/premium"
              className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-lg text-sm font-semibold transition-all duration-300 transform hover:scale-105 text-center"
            >
              Go Ad-Free with Premium
            </Link>
            <button
              onClick={handleDismissPermanently}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Dismiss
            </button>
          </div>
        </div>

        {/* Footer */}
        <p className="text-white/60 text-xs">
          Please consider disabling your ad blocker or upgrading to Premium for the best experience.
        </p>
      </div>
    </div>
  );
};

export default AdBlockDetector;
