import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AiOutlineFire } from "react-icons/ai";
import { SiCodemagic } from "react-icons/si";
import { MdOutlineMovieFilter, MdMovie } from "react-icons/md";
import { MdTv, MdSettings } from "react-icons/md";
import { RiTeamFill, RiNotificationLine } from "react-icons/ri";
import { FaCrown } from "react-icons/fa";
import { HiMenu } from "react-icons/hi";
import { IoIosHome, IoMdClose } from "react-icons/io";
import { IoLogOut } from "react-icons/io5";
import { CgProfile } from "react-icons/cg";
import { useNavigate } from 'react-router-dom';
function Sidenav() {
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768) {
        setIsMenuOpen(true);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('history');
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const navItems = [
    { path: '/', label: 'Home', icon: <IoIosHome />, section: 'feeds' },
    { path: '/trending', label: 'Trending', icon: <AiOutlineFire />, section: 'feeds' },
    { path: '/popular', label: 'Popular', icon: <SiCodemagic className='mt-2' />, section: 'feeds' },
    { path: '/movie', label: 'Movies', icon: <MdOutlineMovieFilter />, section: 'feeds' },
    { path: '/bollywood', label: 'Bollywood', icon: <MdMovie className='text-orange-400' />, section: 'feeds' },
    { path: '/tv', label: 'Tv Shows', icon: <MdTv />, section: 'feeds' },
    { path: '/search', label: 'Search', icon: <i className="ri-search-line"></i>, section: 'feeds' },
    { path: '/watchlist', label: 'Watchlist', icon: <i className="ri-bookmark-line"></i>, section: 'feeds' },
    { path: '/favorites', label: 'Favorites', icon: <i className="ri-heart-line"></i>, section: 'feeds' },
    { path: '/collections', label: 'Collections', icon: <i className="ri-folder-line"></i>, section: 'feeds' },
    { path: '/premium', label: 'Premium', icon: <FaCrown className='text-yellow-400' />, section: 'feeds' },
    { path: '/people', label: 'People', icon: <RiTeamFill className='mt-1' />, section: 'feeds' },
  ];

  const accountItems = [
    { path: '/profile', label: 'Profile', icon: <CgProfile /> },
    { path: '/notifications', label: 'Notifications', icon: <RiNotificationLine /> },
    { path: '/settings', label: 'Settings', icon: <MdSettings /> },
  ];

  const renderNavItem = (item) => (
    <Link
      key={item.path}
      to={item.path}
      onClick={() => isMobile && setIsMenuOpen(false)}
      className={`px-5 rounded-lg py-3 duration-300 flex items-center gap-2 transition-all ${
        isActive(item.path)
          ? 'bg-[#6556cd] text-white shadow-lg shadow-[#6556cd]/50'
          : 'hover:bg-[#6556cd]/50 text-zinc-300 hover:text-white'
      }`}
    >
      <span className="flex-shrink-0">{item.icon}</span>
      <span className="text-nowrap">{item.label}</span>
    </Link>
  );

  const renderAccountItem = (item) => (
    <Link
      key={item.path}
      to={item.path}
      onClick={() => isMobile && setIsMenuOpen(false)}
      className={`px-5 rounded-lg py-3 duration-300 flex items-center gap-2 transition-all ${
        isActive(item.path)
          ? 'bg-[#6556cd] text-white shadow-lg shadow-[#6556cd]/50'
          : 'hover:bg-[#6556cd]/50 text-zinc-300 hover:text-white'
      }`}
    >
      <span className="flex-shrink-0">{item.icon}</span>
      <span>{item.label}</span>
    </Link>
  );

  return (
    <div className='relative z-10'>
      {/* Mobile Menu Toggle */}
      {isMobile && (
        <button
          onClick={toggleMenu}
          className="fixed top-4 left-4 z-[1000] text-white bg-[#6556cd] p-3 rounded-lg shadow-lg hover:bg-[#5546C0] transition-colors"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <HiMenu className="text-2xl" /> : <IoMdClose className="text-2xl" />}
        </button>
      )}

      {/* Sidebar */}
      <div
        className={`
          ${isMobile
            ? `fixed top-0 left-0 h-full w-64 bg-[#0f0b20] border-r border-zinc-800 transform transition-transform duration-300 z-[999] ${
                isMenuOpen ? '-translate-x-full' : 'translate-x-0'
              }`
            : 'max-w-full overflow-hidden h-[100vh] border-r-[1px] border-zinc-800 p-1 sticky'
          }
        `}
      >
        <div className='flex flex-col h-full text-xl'>
          {/* Logo Section */}
          <div className='w-full p-4 border-b border-zinc-800'>
            <h1 className='flex items-center justify-start tracking-wider font-bold font1 uppercase text-white'>
              <video
                src="/logo.webm"
                className='md:w-[5vw] max-sm:w-[20vw] w-[10vw]'
                autoPlay
                loop
                muted
              ></video>
              <span className="ml-2">godcrafts</span>
            </h1>
          </div>

          {/* Navigation Items */}
          <nav className='flex-1 overflow-y-auto py-4'>
            <h1 className='text-white font-semibold text-lg px-5 py-3 mb-2'>New Feeds</h1>
            <div className='space-y-1 px-2'>
              {navItems.map(renderNavItem)}
            </div>
          </nav>

          {/* Divider */}
          <hr className='border-zinc-800 my-2' />

          {/* Account Section */}
          <nav className='pb-4'>
            <h1 className='text-white font-semibold text-md px-5 py-3 text-nowrap'>
              Account Information
            </h1>
            <div className='space-y-1 px-2'>
              {accountItems.map(renderAccountItem)}
              <button
                onClick={handleLogout}
                className='w-full px-5 rounded-lg py-3 duration-300 flex items-center gap-2 hover:bg-red-600/20 text-zinc-300 hover:text-red-400 transition-all'
              >
                <IoLogOut className="flex-shrink-0" />
                <span>Logout</span>
              </button>
            </div>
          </nav>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isMobile && !isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[998]"
          onClick={() => setIsMenuOpen(true)}
        />
      )}
    </div>
  );
}

export default Sidenav;
