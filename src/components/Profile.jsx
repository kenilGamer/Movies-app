import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios2 from "../utils/axios";
import Sidenav from "../partials/sidenav";
import Flashmessage from "./Flashmessage";
import HistoryCard from "../partials/HistoryCard";
import Loading from "./Loading";
import { useDispatch, useSelector } from "react-redux";
import { asyncsetProfile } from "../store/actions/profileActions";
import { toast } from "react-toastify";

const Profile = () => {
  const [wallpaper, setWallpaper] = useState(null);
  const [getError, setGetError] = useState(null);
  const [movieHistory, setMovieHistory] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux state
  const profile = useSelector((state) => state.profile.profile);
  const error = useSelector((state) => state.profile.error);
  const isLoading = useSelector((state) => state.profile.loading);

  document.title = `Profile | Godcrafts`;

  // Fetch trending movie wallpaper
  const getHeaderWallpaper = async () => {
    try {
      const { data } = await axios2.get("trending/all/day");
      if (data.results?.length > 0) {
        const randomIndex = Math.floor(Math.random() * data.results.length);
        setWallpaper(
          `https://image.tmdb.org/t/p/original/${data.results[randomIndex].backdrop_path}`
        );
      } else {
        setGetError("No wallpaper found.");
      }
    } catch (error) {
      setGetError("Error fetching wallpaper.");
      console.error(error);
    }
  };

  // Load movie history from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem("history");
    if (savedHistory) {
      setMovieHistory(JSON.parse(savedHistory) || []);
    }
    getHeaderWallpaper();
  }, []);

  // Fetch profile data from Redux
  useEffect(() => {
    dispatch(asyncsetProfile(navigate));
  }, [dispatch, navigate]);

  // Handle profile state updates
  useEffect(() => {
    if (profile) {
      toast.success("Profile loaded successfully");
    } else {
      toast.error("Profile not loaded");
    }
  }, [profile]);

  // Redirect if unauthorized
  useEffect(() => {
    if (error) {
      toast.error(error);
      if (error === "Unauthorized access") {
        setTimeout(() => navigate("/login"), 2000);
      }
    }
  }, [error, navigate]);

  if (isLoading) {
    return <Loading />;
  }

  // Profile picture selection
  const avatar = `https://movies-backend-07f5.onrender.com/${profile?.avatar}`;
  const defaultProfile = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";
  const profileImage = profile?.googleProfile || avatar || defaultProfile;

  return (
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
              src={profileImage}
              alt="profile"
              className="w-[150px] h-[150px] rounded-full object-cover bg-transparent border-2 border-white"
            />
          </div>
          <h1 className="text-3xl mt-3 font-semibold">{profile?.username}</h1>
          <p>{profile?.email}</p>

          {/* Movie History Section */}
          <div className="movie-history w-full min-h-full mt-5">
            <h2 className="text-2xl font-semibold">Watched History</h2>
            {movieHistory.length === 0 ? (
              <p>No movies watched yet.</p>
            ) : (
              <HistoryCard data={movieHistory} />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
