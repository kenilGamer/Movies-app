import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Profile() {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);

  const getProfile = async () => {
    try {
      const token = localStorage.getItem('token'); // Or wherever you're storing the token
      console.log("profile",token);
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

      setProfileData(response.data); // Store profile data in state
      console.log(response.data);
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
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Protected data response:", response.data);
    } catch (error) {
      console.error('Error fetching protected data:', error.response?.data || error.message);
    }
  };
  

  useEffect(() => {
    getProfile(); // Fetch profile data on component mount
    fetchProtectedData();
  }, []);

  return (
    <div>
      <h1>Profile</h1>
      {profileData ? (
        <div>
        </div>
      ) : (
        <p>Loading profile...</p>
      )}
    </div>
  );
}

export default Profile;
