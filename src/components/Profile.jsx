import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import axios2 from '../utils/axios';
import Sidenav from '../partials/sidenav';
import Flashmessage from './Flashmessage';
const Profile = () => {
  const [profileData, setProfileData] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const navigate = useNavigate();
  const [wallpaper, setWallpaper] = useState(null);
  const [getError, setError] = useState(null);
  const [errorKey, setErrorKey] = useState(null);
  const getHeaderWallpaper = async () => {
    try {
      const { data } = await axios2.get('trending/all/day');
      console.log("wallpaper", data);
      if (data.results && data.results.length > 0) {
        const filteredResults = data.results.filter(item => item.genre_ids.includes(16));
        console.log("filteredResults", filteredResults);
        const randomIndex = Math.floor(Math.random() * filteredResults.length);
        setWallpaper(`https://image.tmdb.org/t/p/original/${filteredResults[randomIndex].backdrop_path}`);
      } else {
        setError("No results found");
        console.error("No results found");
      }
    } catch (error) {
      setError("Error fetching wallpaper");
      console.error(error);
    }
  };
  const getProfile = async () => {
    try {
      const token = localStorage.getItem('token'); // Or wherever you're storing the token
      console.log("profile", token);
      if (!token) {
        console.log('No token found. Redirecting to login.');
        navigate("/login"); // Redirect to login if no token is found
        return;
      }

      const response = await axios.get('http://localhost:3000/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      setProfileData(response.data);
    } catch (error) {
      console.error('Error fetching profile:', error.response?.data || error.message);
      if (error.response?.status === 401) {
        navigate("/login");
        console.log('User is not authenticated. Redirecting to login.');
      }
    }
  };
  const fetchProtectedData = async () => {
    const token = localStorage.getItem('token');
    console.log("Sending token:", token);
    try {
      const response = await axios.get('http://localhost:3000/api/protected-endpoint', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      console.log("Protected data response:", response.data);
    } catch (error) {
      console.error('Error fetching protected data:', error.response?.data || error.message);
    }
  };
  

  useEffect(() => {
    getHeaderWallpaper();
    getProfile(); // Fetch profile data on component mount
    fetchProtectedData();
  }, []);



  useEffect(() => {
    // You can use this effect to fetch user data if needed.
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      // Optionally, upload the file immediately or handle it differently
      handleFileUpload(file);
    }
  };

  const handleFileUpload = async (file) => {
    const formData = new FormData();
    formData.append('image', file);

    try {
      await axios.post('/file', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      // Update the profile image or handle success
      console.log('File uploaded successfully');
    } catch (error) {
      console.error('Error uploading file', error);
    }
  };

  return (
    <>
    <Sidenav />
    {getError && <Flashmessage errorKey={errorKey} getError={getError} />}
    <div
      style={{
        background: `url(${wallpaper})`,  
      }}
      className="w-screen h-screen"
    >
        <div
        style={{
          background: `url(${wallpaper})`,
          objectFit: "cover",
        } }className='w-full h-full'
        >
      <form action="/file" method="post" id="uplogo" encType="multipart/form-data" hidden>
        <input type="file" name="image" id="avatar" onChange={handleFileChange} />
      </form>

      <div className="profdets flex flex-col items-center mt-20">
        <div className="relative">
          <span
            id="logo"
            className="w-6 h-6 absolute bottom-0 right-2 rounded-full flex items-center justify-center bg-zinc-200"
            onClick={() => document.getElementById('avatar').click()}
          >
            <i className="ri-pencil-fill text-zinc-700"></i>
          </span>
          <div className="w-28 h-28 bg-blue-100 rounded-full overflow-hidden">
            <img
              className="w-full h-full object-cover"
              src={`http://localhost:30000/${profileData?.avatar}`}
              alt="Profile"
            />
          </div>
        </div>
        <h1 className="text-3xl mt-3 font-semibold">{profileData?.username}</h1>
        <p>{profileData?.email}</p>
        <h2>@{profileData?.username}</h2>
        <a href="/files" className="px-5 mt-3 py-3 bg-blue-300 rounded-full">
          Edit
        </a>
        <a href="/add" className="px-10 py-2 rounded-lg bg-red-600 text-xs font-semibold mt-3">
          Add New Post
        </a>
      </div>

      <div className="cards flex flex-wrap gap-10 px-10 mt-10">
        <div>
          <div className="w-52 h-40 bg-red-400 rounded-lg">
            <img
              className="w-full h-full object-cover"
              src={`http://localhost:3000/uploads/${profileData?.avatar}`}
              alt="Post"
            />
          </div>
          <a href="/show/posts" className="inline-block mt-5 text-lg">
            all pins
          </a>
          <h5 className="text-sm">{profileData?.posts?.length} pings</h5>
        </div>
      </div>
      </div>
      </div>
      </>

  );
};

export default Profile;
