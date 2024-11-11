import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import axios2 from "../utils/axios";
import Sidenav from "../partials/sidenav";
import Flashmessage from "./Flashmessage";
import Card from "../partials/Card";
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
      const { data } = await axios2.get("trending/all/day?genre_ids=12");
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
      const token = localStorage.getItem("authToken");
      if (!token) {
        setError("No token found");
        navigate("/login");
        return;
      }

      const response = await axios.get("http://localhost:3000/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
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
    // Extract token from URL
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("authToken", token);
      navigate("/profile", { replace: true });
    }
  }, [navigate]);

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
  }, []);

  useEffect(() => {
    setIsLoading(true);
    getHeaderWallpaper();
    getProfile();
  }, []);
  const avatar = `http://localhost:3000/${profileData?.avatar}`;

  return isLoading ? (
    <Loading />
  ) : (
    <>
      <Sidenav />
      {getError && <Flashmessage message={getError} />}
      <div
        className="w-screen h-screen bg-cover bg-center overflow-hidden overflow-y-auto"
        style={{ backgroundImage: `url(${wallpaper})` }}
      >
        <div className="profdets flex h-full flex-col bg-black/15 backdrop-blur-[2px] p-5 items-center">
          {/* Profile Information */}
          <div className="flex flex-col items-center">
            <img
              src={`${profileData?.avatar || avatar}`}
              alt="profile"
              className="w-[150px] h-[150px] rounded-full"
            />
          </div>
          <h1 className="text-3xl mt-3 font-semibold">{profileData?.username}</h1>
          <p>{profileData?.email}</p>

          {/* Movie History Section */}
          <div className="movie-history w-full h-full mt-5">
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
