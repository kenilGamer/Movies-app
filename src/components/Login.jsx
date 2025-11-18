import React, { useState, useRef, useEffect } from "react";
import { Link, parsePath, useNavigate } from "react-router-dom";
import { MdModeEdit } from "react-icons/md";
import Sidenav from "../partials/sidenav";
import axios2 from "../utils/axios";
import axios from "axios";
import Loading from "./Loading";
import FlashMessage from "./Flashmessage";
import { FcGoogle } from "react-icons/fc";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../utils/config";
function Login() {
  const [wallpaper, setWallpaper] = useState(null);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [getError, setError] = useState(null);
  const [errorKey, setErrorKey] = useState(0);


  const getHeaderWallpaper = async () => {
    try {
      const { data } = await axios2.get('/trending/all/day');
      if (data.results && data.results.length > 0) {
        const randomIndex = Math.floor(Math.random() * data.results.length);
        setWallpaper(`https://image.tmdb.org/t/p/original/${data.results[randomIndex].backdrop_path}`);
      } else {
        setError("No results found");
        console.error("No results found");
      }
    } catch (error) {
      setError("Error fetching wallpaper");
      console.error(error);
    }
  };

  useEffect(() => {

    const token = localStorage.getItem('token');
    if (token) {
      navigate('/profile');
    }
    if (!wallpaper) getHeaderWallpaper();
  }, []);


const handleSubmit = async (e) => {
  
  e.preventDefault();
  try {
    const response = await axios.post(`${API_BASE_URL}/api/login`, {
      username: username || email,
      password: password
    });
    console.log(response.data);
    if (response.data.message !== 'Logged in successfully') {
      setErrorKey((prevKey) => prevKey + 1);
      setError("Invalid username or password");
      toast.error("Invalid username or password");
      console.log("Failed to login");
    } else {
      console.log(response.data.token);
      localStorage.setItem('token', response.data.token, { expires: "1d", deleted: true });
      console.log(localStorage.getItem('token'));
      toast.success("Logged in successfully");
      navigate("/profile");
    }
  } catch (error) {
    // setErrorKey((prevKey) => prevKey + 1);
    // setError(error.response.data);
    toast.error(error.response.data);
    console.error('Error logging in:', error);
  }
};

const handleGoogleLogin = async () => {
  try {
     window.location.href = `${API_BASE_URL}/auth/google`;
  } catch (error) {
    console.error('Error with Google login:', error);
    toast.error('Failed to redirect to Google login');
  }
  const user = await axios.get(`${API_BASE_URL}/auth/google/callback`);
  toast.success("Logged in with Google successfully");
  console.log(user);
  navigate('/');
};

useEffect(() => {
  // Extract token from URL
  const params = new URLSearchParams(window.location.search);
  const authToken = params.get("token");
  
  // If token is found in URL, save it to local storage and redirect to profile page
  if (authToken) {
    localStorage.setItem("token", authToken, { expires:"1d"});
    navigate("/profile", { replace: true });
  }
}, [navigate]);
  if (!wallpaper) return <Loading />;

  return (
    <>
      <Sidenav />

      {getError && <FlashMessage errorKey={errorKey} getError={getError} />}
      <div
        style={{
          background: `linear-gradient(rgba(0,0,0,0.4),rgba(0,0,0,0.7),rgba(0,0,0,0.9)), url(${wallpaper})`,
          objectFit: "cover",
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
        className="w-full min-h-screen flex items-center justify-center bg-cover bg-center p-4"
        >
        <div className="w-[20em] h-auto min-h-[30em] bg-[#ffffff68] rounded-2xl backdrop-blur-md bg-opacity-50 box-shadow-md shadow-2xl shadow-white/20 flex flex-col items-center justify-center p-8 transition-all duration-300 hover:shadow-white/30">
          <h1 className="text-3xl font-bold text-white mb-6 tracking-wide">Login Page</h1>
          <form
            method="post"
            encType="multipart/form-data"
            onSubmit={handleSubmit}
            className="space-y-5 flex flex-col items-center justify-center relative w-full"
          >   
         
            <div className="mb-4 w-full relative group">
              <input
                type="text"
                name="username"
                id="username"
                className="mt-1 p-3 w-full text-black rounded-lg border-2 border-transparent shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all duration-300 bg-white/95 hover:bg-white placeholder:text-gray-500"
                value={username || email}
                placeholder="Username or Email"
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none"></div>
            </div>
            <div className="mb-4 w-full relative group">
              <input
                type="password"
                name="password"
                id="password"
                className="mt-1 p-3 w-full rounded-lg text-black border-2 border-transparent shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all duration-300 bg-white/95 hover:bg-white placeholder:text-gray-500"
                value={password}
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none"></div>
            </div>
            <a href="/forgot-password" className="self-end">
              <p className="text-white hover:text-indigo-300 transition-colors duration-200 text-sm underline-offset-2 hover:underline">Forgot Password?</p>
            </a>
            <div className="w-full space-y-3">
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-lg text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transform transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              >
               Login
              </button>
              <Link to="/signup" className="mt-4 block text-center">
                <p className="text-white hover:text-indigo-300 transition-colors duration-200 text-sm">Don't have an account? <span className="font-semibold underline underline-offset-2">Signup</span></p>
              </Link>
            </div>
          </form>
          <div className="flex items-center justify-center w-full my-4">
            <div className="flex-1 h-px bg-white/30"></div>
            <span className="px-4 text-white text-sm">or</span>
            <div className="flex-1 h-px bg-white/30"></div>
          </div>
          <button 
            onClick={handleGoogleLogin} 
            className="mt-2 flex items-center justify-center gap-2 bg-white px-8 py-3 text-3xl rounded-full shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-110 active:scale-95"
          >
            <FcGoogle/>
            <span className="text-sm font-medium text-gray-700">Continue with Google</span>
          </button>
        </div>
      </div>
    </>
  );
}

export default Login;