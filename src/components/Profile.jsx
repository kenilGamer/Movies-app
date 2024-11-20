import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios2 from "../utils/axios";
import Sidenav from "../partials/sidenav";
import Flashmessage from "./Flashmessage";
import HistoryCard from "../partials/HistoryCard";
import Loading from "./Loading";
import { useDispatch, useSelector } from "react-redux";
import { asyncsetProfile } from "../store/actions/profileActions";

const Profile = () => {
  const [wallpaper, setWallpaper] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [getError, setError] = useState(null);
  const [movieHistory, setMovieHistory] = useState([]);
  const [profileData, setProfileData] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Access profile data and error from Redux state
  const profile = useSelector((state) => state.profile.profile);
  const error = useSelector((state) => state.profile.error);

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
        setError("No wallpaper results found");
      }
    } catch (error) {
      setError("Error fetching wallpaper");
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
      setIsLoading(true);
      await getHeaderWallpaper();
      setIsLoading(false);
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
    }
  }, [profile]);

  if (error) {
    // Handle errors, like redirecting to login if unauthorized
    if (error === "Unauthorized access") {
      navigate("/login");
    }
    return <div>{error}</div>;
  }

  const avatar = `https://movies-backend-07f5.onrender.com/${profileData?.avatar}`;
  const googleProfile = profileData?.googleProfile;
  const defaultProfile = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";

  return isLoading ? (
    <Loading />
  ) : (
    <>
      <Sidenav />
      {getError && <Flashmessage message={getError} />}
      <div
        className="w-screen min-h-screen bg-cover bg-center overflow-hidden overflow-y-auto relative"
        style={{ backgroundImage: `url(${wallpaper})` }}
      >
        <nav className="absolute top-0 left-0 w-full flex items-center justify-between p-5 z-10">
          <h1 className="text-3xl font-semibold">Profile</h1>
          <Link to="/settings" className="bg-red-500 text-white px-3 py-2 rounded-md">
            Settings
          </Link>
        </nav>
        <div className="profdets flex min-h-full flex-col bg-black/15 backdrop-blur-[2px] p-5 items-center">
          {/* Profile Information */}
          <div className="flex flex-col items-center">
            <img
              src={`${googleProfile || avatar || defaultProfile}`}
              alt="profile"
              className="w-[150px] h-[150px] rounded-full object-cover bg-transparent border-2 border-white"
            />
          </div>
          <h1 className="text-3xl mt-3 font-semibold">{profileData?.username}</h1>
          <p>{profileData?.email}</p>

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
