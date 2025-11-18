import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios2 from "../utils/axios";
import Sidenav from "../partials/sidenav";
import Flashmessage from "./Flashmessage";
import HistoryCard from "../partials/HistoryCard";
import Loading from "./Loading";  // Assuming Loading is a spinner component
import { useDispatch, useSelector } from "react-redux";
import { asyncsetProfile } from "../store/actions/profileActions";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../utils/config";

const Profile = () => {
  const [wallpaper, setWallpaper] = useState(null);
  const [getError, setGetError] = useState(null); // Renamed for clarity
  const [movieHistory, setMovieHistory] = useState([]);
  const [profileData, setProfileData] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Access profile data and error from Redux state
  const profile = useSelector((state) => state.profile.profile);
  const error = useSelector((state) => state.profile.error);
  const isLoading = useSelector((state) => state.profile.loading); // Loading state from Redux

  document.title = `Profile | Godcrafts`;
  // Fetch trending movie wallpaper
  const getHeaderWallpaper = async () => {
    try {
      const { data } = await axios2.get("trending/all/day");
      if (data.results && data.results.length > 0) {
        const randomIndex = Math.floor(Math.random() * data.results.length);
        setWallpaper(
          `https://image.tmdb.org/t/p/original/${data.results[randomIndex].backdrop_path}`
        );
      } else {
        setGetError("No wallpaper results found");
      }
    } catch (error) {
      setGetError("Error fetching wallpaper");
      console.error(error);
    }
  };

  // Initialize component
  useEffect(() => {
    // Load history from localStorage
    const savedHistory = localStorage.getItem("history");
    if (savedHistory) {
      try {
        const parsedHistory = JSON.parse(savedHistory) || [];
        setMovieHistory(parsedHistory);
      } catch (error) {
        console.error("Error parsing history:", error);
      }
    }

    const fetchData = async () => {
      await getHeaderWallpaper();
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Dispatch Redux action to fetch profile data
    dispatch(asyncsetProfile(navigate));
  }, [dispatch, navigate]);

  // This effect runs when the profile state from Redux is updated
  useEffect(() => {
    if (profile) {
      setProfileData(profile);
      if (import.meta.env.DEV) {
        console.log("Profile loaded:", profile);
      }
    } else {
      if (import.meta.env.DEV) {
        console.log("No profile data available");
      }
    }
  }, [profile]);

  if (error) {
    // Handle errors, like redirecting to login if unauthorized
    if (error === "Unauthorized access" || error === "No token found") {
      navigate("/login");
      return null;
    }
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button 
            onClick={() => dispatch(asyncsetProfile(navigate))}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Construct avatar URL properly
  const getAvatarUrl = () => {
    if (profileData?.googleProfile) {
      return profileData.googleProfile;
    }
    if (profileData?.avatar) {
      // Check if avatar is already a full URL
      if (profileData.avatar.startsWith('http://') || profileData.avatar.startsWith('https://')) {
        return profileData.avatar;
      }
      // Otherwise, construct the URL
      return `${API_BASE_URL}/${profileData.avatar}`;
    }
    return "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";
  };

  const avatarUrl = getAvatarUrl();

  return isLoading ? (
    <Loading /> // Show loading indicator if loading
  ) : (
    <>
      <Sidenav />
      {getError && <Flashmessage message={getError} />}
      <div
        className="w-screen min-h-screen bg-cover bg-center overflow-hidden overflow-y-auto relative"
        style={{ backgroundImage: `url(${wallpaper})` }}
      >
        <nav className="absolute top-0 left-0 w-full flex items-center justify-between p-5 z-[5]">
          <h1 className="text-3xl font-semibold text-transparent">Profile</h1>
          <Link to="/settings" className="bg-red-500 text-white px-3 py-2 rounded-md">
            Settings
          </Link>
        </nav>
        <div className="profdets flex min-h-full flex-col bg-black/15 backdrop-blur-[2px] p-5 items-center">
          {/* Profile Information */}
          <div className="flex flex-col items-center">
            <img
              src={avatarUrl}
              alt="profile"
              className="w-[150px] h-[150px] rounded-full object-cover bg-transparent border-2 border-white"
              onError={(e) => {
                // Fallback to default if image fails to load
                e.target.src = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";
              }}
            />
          </div>
          <h1 className="text-3xl mt-3 font-semibold text-white">{profileData?.username || "User"}</h1>
          <p className="text-zinc-300">{profileData?.email || "No email"}</p>

          {/* Movie History Section */}
          <div className="movie-history w-full min-h-full mt-5">
            <h2 className="text-2xl font-semibold">Watched History</h2>
            {movieHistory.length === 0 ? (
              <p>No movies watched yet.</p>
            ) : (
              <div>
                <HistoryCard data={movieHistory} />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
