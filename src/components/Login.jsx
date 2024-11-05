import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MdModeEdit } from "react-icons/md";
import Sidenav from "../partials/sidenav";
import axios2 from "../utils/axios";
import axios from "axios";
import Loading from "./Loading";
function Login() {
  const [wallpaper, setWallpaper] = useState(null);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [password, setPassword] = useState("");
  const [age, setAge] = useState("");
  const [data, setData] = useState(null);
  const getHeaderWallpaper = async () => {
    try {
      const { data } = await axios2.get('/trending/all/day');
      setData(data);
      if (data.results && data.results.length > 0) {
        const randomIndex = Math.floor(Math.random() * data.results.length);
        setWallpaper(`https://image.tmdb.org/t/p/original/${data.results[randomIndex].backdrop_path}`);
      } else {
        console.error("No results found");
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!wallpaper) getHeaderWallpaper();
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/api/login', 
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          username: username || email, password: password
        });
        console.log(response.data, localStorage.getItem('token'));
      if (!response.data.success) {
        console.log("Failed to login");
      }
      console.log(response.data.token);
      localStorage.setItem('token', response.data.token);
      navigate("/home");
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };
  const handleEdit = () => {
    const fileInput = document.getElementById("avatar");
    console.log(fileInput);
    if (fileInput) {
      fileInput.click();
    } else {
      console.log("File input not found");
    }
  };
  if (!wallpaper) return <Loading />;

  return (
    <>
      <Sidenav />

      <div
        style={{
          background: `linear-gradient(rgba(0,0,0,0.4),rgba(0,0,0,0.7),rgba(0,0,0,0.9)), url(${wallpaper})`,
          objectFit: "cover",
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
        className="w-full h-full flex items-center justify-center bg-cover bg-center"
      >
        <div className="w-[25em] h-[35em] bg-[#ffffff68] rounded-xl backdrop-blur-sm bg-opacity-50 box-shadow-md shadow-white flex flex-col items-center justify-center">
          <h1 className="text-2xl font-bold text-white mb-4">Login Page</h1>
          <form
            method="post"
            encType="multipart/form-data"
            onSubmit={handleSubmit}
            className="space-y-4 flex flex-col items-center justify-center relative"
          >   
         
            <div className="mb-4">
            
              <input
                type="text"
                name="username"
                id="username"
                className="mt-1 p-2  w-full text-black rounded-md border-gray-300 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={username}
                placeholder="Username or Email"
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
        
              <input
                type="password"
                name="password"
                id="password"
                className="mt-1 p-2 w-full rounded-md text-black border-gray-300 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={password}
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <a href="/forgot-password">
              <p className="text-white">Forgot Password?</p>
            </a>
            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
               Login
              </button>
              <a href="/" className="mt-4 block">
                <p className="text-white">Signup Page</p>
              </a>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Login;