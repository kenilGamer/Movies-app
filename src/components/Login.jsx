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
        <div className="w-full max-w-md h-auto min-h-[32em] bg-gradient-to-br from-zinc-900/95 to-zinc-800/95 backdrop-blur-xl border border-zinc-700/50 rounded-2xl shadow-2xl shadow-black/50 flex flex-col items-center justify-center p-6 sm:p-8 transition-all duration-300 hover:shadow-indigo-500/20 hover:border-indigo-500/50">
          <div className="mb-6 text-center">
            <h1 className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 mb-2 tracking-wide">Welcome Back</h1>
            <p className="text-zinc-400 text-sm sm:text-base">Sign in to continue to GODCRAFTS</p>
          </div>
          <form
            method="post"
            encType="multipart/form-data"
            onSubmit={handleSubmit}
            className="space-y-5 flex flex-col items-center justify-center relative w-full"
          >   
         
            <div className="mb-4 w-full relative group">
              <label htmlFor="username" className="block text-sm font-medium text-zinc-300 mb-2">Username or Email</label>
              <input
                type="text"
                name="username"
                id="username"
                className="w-full p-3 sm:p-4 text-white bg-zinc-800/50 border border-zinc-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all duration-300 placeholder:text-zinc-500 hover:border-zinc-600"
                value={username || email}
                placeholder="Enter your username or email"
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="mb-4 w-full relative group">
              <label htmlFor="password" className="block text-sm font-medium text-zinc-300 mb-2">Password</label>
              <input
                type="password"
                name="password"
                id="password"
                className="w-full p-3 sm:p-4 text-white bg-zinc-800/50 border border-zinc-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all duration-300 placeholder:text-zinc-500 hover:border-zinc-600"
                value={password}
                placeholder="Enter your password"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="w-full flex items-center justify-between mb-4">
              <a href="/forgot-password" className="text-indigo-400 hover:text-indigo-300 transition-colors duration-200 text-sm font-medium">
                Forgot Password?
              </a>
            </div>
            <div className="w-full space-y-3">
              <button
                type="submit"
                className="w-full flex justify-center items-center gap-2 py-3 sm:py-4 px-4 border border-transparent rounded-xl shadow-lg text-sm sm:text-base font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transform transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] hover:shadow-xl hover:shadow-indigo-500/50"
              >
                <span>Login</span>
              </button>
              <Link to="/signup" className="mt-4 block text-center">
                <p className="text-zinc-400 hover:text-indigo-300 transition-colors duration-200 text-sm">
                  Don't have an account? <span className="font-semibold text-indigo-400 underline underline-offset-2">Sign up</span>
                </p>
              </Link>
            </div>
          </form>
          <div className="flex items-center justify-center w-full my-6">
            <div className="flex-1 h-px bg-zinc-700/50"></div>
            <span className="px-4 text-zinc-500 text-sm font-medium">or</span>
            <div className="flex-1 h-px bg-zinc-700/50"></div>
          </div>
          <button 
            onClick={handleGoogleLogin} 
            type="button"
            className="w-full flex items-center justify-center gap-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-zinc-700/50 px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] group"
          >
            <FcGoogle className="text-2xl"/>
            <span className="text-sm sm:text-base font-medium text-white group-hover:text-indigo-300 transition-colors">Continue with Google</span>
          </button>
        </div>
      </div>
    </>
  );
}

export default Login;