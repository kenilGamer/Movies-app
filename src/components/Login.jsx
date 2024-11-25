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
    const response = await axios.post('https://movies-backend-07f5.onrender.com/api/login', {
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
      localStorage.setItem('token', response.data.token, { expires: "1d" });
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
     window.location.href = 'https://movies-backend-07f5.onrender.com/auth/google';
  } catch (error) {
    console.error('Error with Google login:', error);
    toast.error('Failed to redirect to Google login');
  }
  const user = await axios.get('https://movies-backend-07f5.onrender.com/auth/google/callback');
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
        className="w-full h-full flex items-center justify-center bg-cover bg-center"
        >
        <div className="w-[20em] h-[30em] bg-[#ffffff68] rounded-xl backdrop-blur-sm bg-opacity-50 box-shadow-md shadow-white flex flex-col items-center justify-center">
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
                value={username || email}
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
              <Link to="/signup" className="mt-4 block">
                <p className="text-white">Signup Page</p>
              </Link>
            </div>
          </form>
          <h1 className="text-center">or</h1>
          <button onClick={handleGoogleLogin} className="mt-4 block bg-white px-20 p-1 text-3xl rounded-full"><FcGoogle/></button>
        </div>
      </div>
    </>
  );
}

export default Login;