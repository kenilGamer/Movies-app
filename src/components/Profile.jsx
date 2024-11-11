import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import axios2 from "../utils/axios";
import Sidenav from "../partials/sidenav";
import Flashmessage from "./Flashmessage";
import Card from "../partials/Card";

const Profile = () => {
  const [profileData, setProfileData] = useState(null);
  const [wallpaper, setWallpaper] = useState(null);
  const [getError, setError] = useState(null);
  const [movieHistory, setMovieHistory] = useState([]);
  const navigate = useNavigate();

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
        setError("No results found");
        console.error("No results found");
      }
    } catch (error) {
      setError("Error fetching wallpaper");
      console.error(error);
    }
  };

  // Fetch profile data
  const getProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await axios.get("http://localhost:3000/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProfileData(response.data);
    } catch (error) {
      console.error("Error fetching profile:", error);
      if (error.response?.status === 401) {
        navigate("/login");
      }
    }
  };

  // Load movie history from local storage and remove duplicates
  useEffect(() => {
    const savedHistory = localStorage.getItem("history");
    
    // Check if savedHistory is a valid JSON string and parse it
    try {
      const parsedHistory = savedHistory ? JSON.parse(savedHistory) : { data: [] };
  
      // Ensure it's an array within the 'data' property
      if (Array.isArray(parsedHistory.data)) {
        // Remove duplicates based on movie id
        const uniqueHistory = parsedHistory.data.filter((value, index, self) => 
          index === self.findIndex((t) => t.id === value.id)
        );
        setMovieHistory(uniqueHistory);
      } else {
        // If the 'data' is not an array, reset to an empty array
        setMovieHistory([]);
      }
    } catch (error) {
      console.error("Error parsing history:", error);
      setMovieHistory([]);
    }
  }, []);
  
  
  console.log(movieHistory);
  useEffect(() => {
    getHeaderWallpaper();
    getProfile();
  }, []);

  return (
    <>
      <Sidenav />
      {getError && <Flashmessage message={getError} />}
      <div
        className="w-screen h-screen bg-cover bg-center"
        style={{ backgroundImage: `url(${wallpaper})` }}
      >
        <div className="profdets flex flex-col items-center mt-20">
          {/* Profile Information */}
          <h1 className="text-3xl mt-3 font-semibold">{profileData?.username}</h1>
          <p>{profileData?.email}</p>

          {/* Movie History Section */}
          <div className="movie-history mt-10">
            <h2 className="text-2xl font-semibold">Watched history</h2>
            {movieHistory.length === 0 ? (
              <p>No movies watched yet.</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {/* {movieHistory.map((movie, index) => (
                  <div key={index} className="movie-card">
                    <img
                      className="w-full h-full object-cover rounded-lg"
                      src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                      alt={movie.title}
                    />
                    <p className="text-lg font-semibold">{movie.title}</p>
                  </div>
                ))} */}
              <Card data={movieHistory} />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
