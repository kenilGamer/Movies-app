import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import axios2 from "../utils/axios";
import Sidenav from "../partials/sidenav";
import Flashmessage from "./Flashmessage";
import HistoryCard from "../partials/HistoryCard";
import Loading from "./Loading";

const Profile = () => {
  const [profileData, setProfileData] = useState(null);
  const [wallpaper, setWallpaper] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [getError, setError] = useState(null);
  const [movieHistory, setMovieHistory] = useState([]);
  const navigate = useNavigate();

  // Fetch trending movie wallpaper
  document.title = `Profile | Godcrafts`;
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
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch profile data
  const getProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const authToken = localStorage.getItem("authToken");
      if (!token || !authToken) {
        console.log(token, authToken);
        setError("No token found");
        navigate("/login");
        return;
      }

      const response = await axios.get("https://movies-backend-07f5.onrender.com/profile", {
        headers: { Authorization: `Bearer ${token || authToken}` },
      });
      console.log(response.data);
      setProfileData(response.data);
    } catch (error) {
      console.error("Error fetching profile:", error);
      if (error.response?.status === 401) {
        navigate("/login");
      }
    } finally {
      setIsLoading(false);
    }
  };


  useEffect(() => {
   
  }, []);

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
    getProfile();
    setIsLoading(true);
    getHeaderWallpaper();
  }, [getProfile]);
  const avatar = `https://movies-backend-07f5.onrender.com/${profileData?.avatar}`;

  return isLoading ? (
    <Loading />
  ) : (
    <>
      <Sidenav />
      {getError && <Flashmessage message={getError} />}
   
      <div
        className="w-screen min-h-screen bg-cover bg-center overflow-hidden  overflow-y-auto relative"
        style={{ backgroundImage: `url(${wallpaper})` }}
      >
           <nav className="absolute top-0 left-0 w-full flex items-center justify-between p-5 z-10">
        <h1 className="text-3xl font-semibold">Profile</h1>
        
        <Link to="/settings" className="bg-red-500 text-white px-3 py-2 rounded-md">settings</Link>
      </nav>
        <div className="profdets flex min-h-full flex-col  bg-black/15 backdrop-blur-[2px] p-5 items-center">
          {/* Profile Information */}
          <div className="flex flex-col items-center">
            <img
              src={`${profileData?.googleProfile || avatar}`}
              alt="profile"
              className="w-[150px] h-[150px] rounded-full object-cover bg-red-300"
            />
          </div>
          <h1 className="text-3xl mt-3 font-semibold">{profileData?.username}</h1>
          <p>{profileData?.email}</p>

          {/* Movie History Section */}
          <div className="movie-history w-full  min-h-full mt-5">
            <h2 className="text-2xl font-semibold">Watched history</h2>
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
