import { useState, useEffect } from 'react';

/**
 * Custom hook to detect if an ad blocker is enabled
 * @returns {boolean} - true if ad blocker is detected
 */
export const useAdBlock = () => {
  const [adBlockDetected, setAdBlockDetected] = useState(false);

  useEffect(() => {
    const checkAdBlock = () => {
      // Method 1: Create a fake ad element with common ad class names
      const fakeAd = document.createElement('div');
      fakeAd.innerHTML = '&nbsp;';
      fakeAd.className = 'adsbox';
      fakeAd.style.position = 'absolute';
      fakeAd.style.left = '-9999px';
      fakeAd.style.width = '1px';
      fakeAd.style.height = '1px';
      fakeAd.id = 'test-ad-block';
      document.body.appendChild(fakeAd);

      setTimeout(() => {
        const isBlocked = fakeAd.offsetHeight === 0 || 
                         fakeAd.offsetWidth === 0 ||
                         window.getComputedStyle(fakeAd).display === 'none';
        
        if (document.body.contains(fakeAd)) {
          document.body.removeChild(fakeAd);
        }

        // Set detection based on DOM element check only (no external script loading to avoid CSP violations)
        setAdBlockDetected(isBlocked);
      }, 100);
    };

    // Initial check
    checkAdBlock();

    // Re-check periodically (every 30 seconds)
    const interval = setInterval(checkAdBlock, 30000);

    return () => clearInterval(interval);
  }, []);

  return adBlockDetected;
};
