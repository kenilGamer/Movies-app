import React, { useState, useEffect, useRef, useCallback } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { FaTimes, FaPlay, FaPause, FaSpinner, FaVolumeUp, FaVolumeMute, FaExpand, FaCompress, FaForward, FaBackward } from "react-icons/fa";
import NotFound from "../components/notfound";
import Loading from "../components/Loading";

function Trailer() {
  document.title = `Trailer | Godcrfts`;
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const category = pathname.includes("movie") ? "movie" : "tv";
  const ytvideos = useSelector((state) => state[category]?.info?.videos);
  const detail = useSelector((state) => state[category]?.info?.detail);
  const [isLoading, setIsLoading] = useState(true);
  const [videoError, setVideoError] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(100);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [playerReady, setPlayerReady] = useState(false);
  const timeoutRef = useRef(null);
  const controlsTimeoutRef = useRef(null);
  const iframeRef = useRef(null);
  const containerRef = useRef(null);
  const playerReadyTimeoutRef = useRef(null);

  useEffect(() => {
    // Reset loading state when video changes
    if (ytvideos?.key) {
      setIsLoading(true);
      setVideoError(false);
      
      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      // Fallback: hide loading after 3 seconds if iframe doesn't fire onLoad
      timeoutRef.current = setTimeout(() => {
        setIsLoading(false);
      }, 3000);
      
      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
    }
  }, [ytvideos?.key]);

  const handleClose = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const handleVideoLoad = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsLoading(false);
    // Give YouTube player time to initialize
    playerReadyTimeoutRef.current = setTimeout(() => {
      setPlayerReady(true);
    }, 1000);
  };

  const handleVideoError = () => {
    setIsLoading(false);
    setVideoError(true);
  };

  // Helper function to send command to YouTube iframe
  const sendYouTubeCommand = useCallback((func, args = "") => {
    if (!iframeRef.current?.contentWindow || !playerReady) {
      // Retry after a short delay if player not ready
      setTimeout(() => {
        if (iframeRef.current?.contentWindow) {
          iframeRef.current.contentWindow.postMessage(
            JSON.stringify({ event: "command", func, args }),
            "https://www.youtube.com"
          );
        }
      }, 100);
      return;
    }
    
    try {
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify({ event: "command", func, args }),
        "https://www.youtube.com"
      );
    } catch (error) {
      console.error("Error sending YouTube command:", error);
    }
  }, [playerReady]);

  // Define all control functions first
  const exitFullscreen = useCallback(() => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (!isFullscreen) {
      if (containerRef.current?.requestFullscreen) {
        containerRef.current.requestFullscreen();
      } else if (containerRef.current?.webkitRequestFullscreen) {
        containerRef.current.webkitRequestFullscreen();
      } else if (containerRef.current?.msRequestFullscreen) {
        containerRef.current.msRequestFullscreen();
      }
    } else {
      exitFullscreen();
    }
  }, [isFullscreen, exitFullscreen]);

  const togglePlayPause = useCallback(() => {
    setIsPlaying(prev => {
      const newState = !prev;
      sendYouTubeCommand(newState ? "playVideo" : "pauseVideo");
      return newState;
    });
  }, [sendYouTubeCommand]);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => {
      const newState = !prev;
      sendYouTubeCommand(newState ? "mute" : "unMute");
      return newState;
    });
  }, [sendYouTubeCommand]);

  const changeVolume = useCallback((delta) => {
    setVolume(prevVolume => {
      const newVolume = Math.max(0, Math.min(100, prevVolume + delta));
      setIsMuted(newVolume === 0);
      sendYouTubeCommand("setVolume", [newVolume]);
      return newVolume;
    });
  }, [sendYouTubeCommand]);

  const seek = useCallback((seconds) => {
    sendYouTubeCommand("seekBy", [seconds, true]);
  }, [sendYouTubeCommand]);

  const changePlaybackRate = useCallback((rate) => {
    setPlaybackRate(rate);
    sendYouTubeCommand("setPlaybackRate", [rate]);
  }, [sendYouTubeCommand]);

  // Handle keyboard controls
  useEffect(() => {
    const handleKeyPress = (e) => {
      // Don't handle if user is typing in an input
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') {
        return;
      }
      
      if (e.key === "Escape") {
        if (isFullscreen) {
          exitFullscreen();
        } else {
          handleClose();
        }
      } else if (e.key === " " || e.key === "k" || e.key === "K") {
        e.preventDefault();
        togglePlayPause();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        seek(-10);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        seek(10);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        changeVolume(5);
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        changeVolume(-5);
      } else if (e.key === "f" || e.key === "F") {
        e.preventDefault();
        toggleFullscreen();
      } else if (e.key === "m" || e.key === "M") {
        e.preventDefault();
        toggleMute();
      }
    };
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [isFullscreen, togglePlayPause, seek, changeVolume, toggleFullscreen, toggleMute, exitFullscreen, handleClose]);

  // Auto-hide controls
  useEffect(() => {
    if (showControls) {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [showControls]);

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement || !!document.webkitFullscreenElement || !!document.msFullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("msfullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("webkitfullscreenchange", handleFullscreenChange);
      document.removeEventListener("msfullscreenchange", handleFullscreenChange);
    };
  }, []);

  // Listen for YouTube player events via postMessage
  useEffect(() => {
    const handleMessage = (event) => {
      // Only accept messages from YouTube
      if (event.origin !== "https://www.youtube.com") return;
      
      try {
        const data = typeof event.data === "string" ? JSON.parse(event.data) : event.data;
        
        // Handle YouTube player events
        if (data.event === "onStateChange") {
          // YouTube player states: -1 (unstarted), 0 (ended), 1 (playing), 2 (paused), 3 (buffering), 5 (cued)
          if (data.info === 1) {
            setIsPlaying(true);
          } else if (data.info === 2 || data.info === 0) {
            setIsPlaying(false);
          }
        } else if (data.event === "onVolumeChange") {
          if (data.info !== undefined) {
            setVolume(data.info.volume);
            setIsMuted(data.info.muted);
          }
        } else if (data.event === "onPlaybackRateChange") {
          if (data.info !== undefined) {
            setPlaybackRate(data.info.playbackRate);
          }
        }
      } catch (error) {
        // Ignore parsing errors
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
      if (playerReadyTimeoutRef.current) clearTimeout(playerReadyTimeoutRef.current);
    };
  }, []);

  if (!ytvideos || !ytvideos.key) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md">
        <div className="text-center">
          <NotFound />
          <button
            onClick={handleClose}
            className="mt-6 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-semibold shadow-lg shadow-indigo-500/50 transition-all duration-300 transform hover:scale-105"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md animate-fadeIn">
      {/* Backdrop overlay */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={handleClose}
        aria-label="Close trailer"
      ></div>

      {/* Close button */}
      <button
        onClick={handleClose}
        className="absolute top-4 right-4 sm:top-6 sm:right-6 z-50 p-3 sm:p-4 bg-zinc-900/80 hover:bg-red-600/80 backdrop-blur-md rounded-full text-white transition-all duration-300 transform hover:scale-110 active:scale-95 shadow-lg shadow-black/50 group"
        aria-label="Close trailer"
      >
        <FaTimes className="text-xl sm:text-2xl group-hover:rotate-90 transition-transform duration-300" />
      </button>

      {/* Video container */}
      <div className="relative w-full max-w-7xl mx-4 sm:mx-6 lg:mx-8 z-40">
        {/* Video info header */}
        {detail && (
          <div className="mb-4 sm:mb-6 text-center animate-slideInDown">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              {detail.title || detail.name || "Trailer"}
            </h2>
            <p className="text-zinc-400 text-sm sm:text-base">Watch Trailer</p>
          </div>
        )}

        {/* Video wrapper */}
        <div 
          ref={containerRef}
          className="relative w-full bg-black rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl shadow-black/80 border-2 border-zinc-800/50 group"
          onMouseMove={() => setShowControls(true)}
          onMouseLeave={() => setShowControls(false)}
        >
          {/* Loading state */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/90 z-10">
              <div className="text-center">
                <FaSpinner className="w-12 h-12 sm:w-16 sm:h-16 text-indigo-500 animate-spin mx-auto mb-4" />
                <p className="text-white text-sm sm:text-base font-medium">Loading trailer...</p>
              </div>
            </div>
          )}

          {/* Error state */}
          {videoError && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/90 z-10">
              <div className="text-center p-6">
                <FaPlay className="w-16 h-16 text-red-500 mx-auto mb-4 opacity-50" />
                <p className="text-white text-lg font-semibold mb-2">Failed to load trailer</p>
                <p className="text-zinc-400 text-sm mb-4">The video could not be loaded</p>
                <button
                  onClick={() => {
                    setVideoError(false);
                    setIsLoading(true);
                    // Force reload by changing key
                    window.location.reload();
                  }}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
                >
                  Retry
                </button>
              </div>
            </div>
          )}

          {/* Video iframe */}
          <div className="relative w-full" style={{ paddingBottom: "56.25%" }}> {/* 16:9 aspect ratio */}
            <iframe
              ref={iframeRef}
              src={`https://www.youtube.com/embed/${ytvideos.key}?autoplay=1&rel=0&modestbranding=1&playsinline=1&controls=1&enablejsapi=1&origin=${encodeURIComponent(window.location.origin)}&widget_referrer=${encodeURIComponent(window.location.origin)}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              frameBorder="0"
              className="absolute top-0 left-0 w-full h-full rounded-xl sm:rounded-2xl"
              onLoad={handleVideoLoad}
              onError={handleVideoError}
              title="Trailer"
              id="youtube-player"
            />
          </div>

          {/* Custom Controls Overlay */}
          <div 
            className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-4 sm:p-6 transition-opacity duration-300 ${
              showControls ? 'opacity-100' : 'opacity-0'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto">
              {/* Left controls */}
              <div className="flex items-center gap-3 sm:gap-4">
                {/* Play/Pause */}
                <button
                  onClick={togglePlayPause}
                  className="p-2 sm:p-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full text-white transition-all duration-300 transform hover:scale-110 active:scale-95"
                  aria-label={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? (
                    <FaPause className="text-base sm:text-lg" />
                  ) : (
                    <FaPlay className="text-base sm:text-lg" />
                  )}
                </button>

                {/* Volume control */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={toggleMute}
                    className="p-2 sm:p-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full text-white transition-all duration-300 transform hover:scale-110 active:scale-95"
                    aria-label={isMuted ? "Unmute" : "Mute"}
                  >
                    {isMuted || volume === 0 ? (
                      <FaVolumeMute className="text-base sm:text-lg" />
                    ) : (
                      <FaVolumeUp className="text-base sm:text-lg" />
                    )}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={volume}
                    onChange={(e) => {
                      const newVolume = parseInt(e.target.value);
                      setVolume(newVolume);
                      setIsMuted(newVolume === 0);
                      sendYouTubeCommand("setVolume", [newVolume]);
                    }}
                    className="w-20 sm:w-24 h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                  />
                  <span className="text-white text-xs sm:text-sm font-medium w-8">{volume}%</span>
                </div>

                {/* Playback speed */}
                <div className="hidden sm:flex items-center gap-2">
                  <select
                    value={playbackRate}
                    onChange={(e) => changePlaybackRate(parseFloat(e.target.value))}
                    className="px-2 py-1.5 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg text-white text-xs sm:text-sm border border-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                  >
                    <option value="0.25">0.25x</option>
                    <option value="0.5">0.5x</option>
                    <option value="0.75">0.75x</option>
                    <option value="1">1x</option>
                    <option value="1.25">1.25x</option>
                    <option value="1.5">1.5x</option>
                    <option value="1.75">1.75x</option>
                    <option value="2">2x</option>
                  </select>
                </div>
              </div>

              {/* Right controls */}
              <div className="flex items-center gap-3 sm:gap-4">
                {/* Seek buttons */}
                <div className="hidden sm:flex items-center gap-2">
                  <button
                    onClick={() => seek(-10)}
                    className="p-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full text-white transition-all duration-300 transform hover:scale-110 active:scale-95"
                    aria-label="Rewind 10 seconds"
                  >
                    <FaBackward className="text-sm" />
                  </button>
                  <button
                    onClick={() => seek(10)}
                    className="p-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full text-white transition-all duration-300 transform hover:scale-110 active:scale-95"
                    aria-label="Forward 10 seconds"
                  >
                    <FaForward className="text-sm" />
                  </button>
                </div>

                {/* Fullscreen */}
                <button
                  onClick={toggleFullscreen}
                  className="p-2 sm:p-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full text-white transition-all duration-300 transform hover:scale-110 active:scale-95"
                  aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
                >
                  {isFullscreen ? (
                    <FaCompress className="text-base sm:text-lg" />
                  ) : (
                    <FaExpand className="text-base sm:text-lg" />
                  )}
                </button>
              </div>
            </div>

            {/* Keyboard shortcuts hint */}
            <div className="mt-3 sm:mt-4 text-center">
              <p className="text-white/60 text-xs">
                <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-[0.7rem]">Space</kbd> Play/Pause • 
                <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-[0.7rem] ml-1">←</kbd><kbd className="px-1.5 py-0.5 bg-white/10 rounded text-[0.7rem]">→</kbd> Seek • 
                <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-[0.7rem] ml-1">↑</kbd><kbd className="px-1.5 py-0.5 bg-white/10 rounded text-[0.7rem]">↓</kbd> Volume • 
                <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-[0.7rem] ml-1">F</kbd> Fullscreen • 
                <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-[0.7rem] ml-1">M</kbd> Mute
              </p>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-4 sm:mt-6 text-center animate-slideInUp">
          <p className="text-zinc-400 text-xs sm:text-sm">
            Press <kbd className="px-2 py-1 bg-zinc-800/50 rounded text-zinc-300 font-mono">ESC</kbd> or click outside to close
          </p>
        </div>
      </div>
    </div>
  );
}

export default Trailer;
