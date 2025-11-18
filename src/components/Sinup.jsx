import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdModeEdit } from "react-icons/md";
import Sidenav from "../partials/sidenav";
import axios2 from "../utils/axios";
import axios from "axios";
import Loading from "./Loading";
import Flashmessage from "./Flashmessage";
import { FcGoogle } from "react-icons/fc";
import { FaGoogle } from "react-icons/fa";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../utils/config";
function Signup() {
  const [wallpaper, setWallpaper] = useState(null);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [password, setPassword] = useState("");
  const [age, setAge] = useState("");
  const [data, setData] = useState(null);
  const [errorKey, setErrorKey] = useState(0);
  const [getError, setGetError] = useState(null);
  document.title = `Signup | Godcrfts`;
  const getHeaderWallpaper = async () => {
    try {
      const { data } = await axios2.get("/trending/all/day");
      setData(data);
      if (data.results && data.results.length > 0) {
        const randomIndex = Math.floor(Math.random() * data.results.length);
        setWallpaper(
          `https://image.tmdb.org/t/p/original/${data.results[randomIndex].backdrop_path}`
        );
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
    const randomId =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);
    // Create FormData
    const formData = new FormData();
    formData.append("username", username);
    formData.append("email", email);
    formData.append("age", age);
    formData.append("password", password);
    formData.append("googleId", randomId);
    console.log(randomId);
    // Append avatar if available
    if (avatar) {
      formData.append("avatar", avatar);
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/signup`,
        formData, // Use formData, not a regular object
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Make sure the token is set
          },
        }
      );

      if (!response.data.success) {
        setErrorKey((prevKey) => prevKey + 1);
        setGetError(response.data.message);
        console.log("Failed to sign up");
      }
      toast.success(response.data.message);
      const token = response.data.token;
      localStorage.setItem("token", token, { expires: "1d" });
      // console.log(response.data);
      navigate("/"); // Redirect to login page after successful signup
    } catch (error) {
      setErrorKey((prevKey) => prevKey + 1);
      setGetError(error.response.data);
      console.error("Error signing up:", error);
    }
  };
  const handleGoogleSignup = async () => {
    try {
      // Trigger the authentication process by calling the backend route
      window.location.href = `${API_BASE_URL}/auth/google`; // This will redirect to Google's OAuth page
    } catch (error) {
      console.error("Error with Google signup:", error);
    }
  };

  useEffect(() => {
    // Extract token from URL
    const params = new URLSearchParams(window.location.search);
    const authToken = params.get("token");
    if (authToken) {
      localStorage.setItem("token", authToken, { expires: "1d" });
      navigate("/profile", { replace: true });
    }
  }, [navigate]);

  const handleAvatar = () => {
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
      {getError && <Flashmessage errorKey={errorKey} getError={getError} />}
      <div
        style={{
          background: `linear-gradient(rgba(0,0,0,0.4),rgba(0,0,0,0.7),rgba(0,0,0,0.9)), url(${wallpaper})`,
          objectFit: "cover",
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
        className="w-full h-full flex items-center justify-center bg-cover bg-center"
      >
        <div className="w-full max-w-md min-h-[42em] bg-gradient-to-br from-zinc-900/95 to-zinc-800/95 backdrop-blur-xl border border-zinc-700/50 rounded-2xl shadow-2xl shadow-black/50 flex flex-col items-center justify-center p-6 sm:p-8 transition-all duration-300 hover:shadow-indigo-500/20 hover:border-indigo-500/50 overflow-y-auto">
          <div className="mb-6 text-center">
            <h1 className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 mb-2 tracking-wide">Create Account</h1>
            <p className="text-zinc-400 text-sm sm:text-base">Join GODCRAFTS today</p>
          </div>
          <form
            onSubmit={handleSubmit}
            className="space-y-4 flex flex-col items-center justify-center relative"
          >
            <input
              type="file"
              name="avatar"
              id="avatar"
              accept="image/*"
              onChange={(e) => setAvatar(e.target.files[0])}
              hidden
            />
            <div className="relative mb-4 group">
              <div className="w-24 h-24 sm:w-28 sm:h-28 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center overflow-hidden border-4 border-zinc-700/50 shadow-lg">
                {avatar ? (
                  <img 
                    src={URL.createObjectURL(avatar)} 
                    alt="Avatar preview" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-3xl sm:text-4xl text-white font-bold">
                    {(username || email || 'U').charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={handleAvatar}
                className="absolute bottom-0 right-0 w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-110 active:scale-95 border-2 border-zinc-900"
              >
                <MdModeEdit className="text-white text-sm sm:text-base" />
              </button>
            </div>

            {/* Username, Email, Age, Password Inputs */}
            <div className="mb-4 w-full">
              <label htmlFor="username" className="block text-sm font-medium text-zinc-300 mb-2">Username</label>
              <input
                type="text"
                name="username"
                id="username"
                className="w-full p-3 sm:p-4 text-white bg-zinc-800/50 border border-zinc-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all duration-300 placeholder:text-zinc-500 hover:border-zinc-600"
                value={username}
                placeholder="Choose a username"
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="mb-4 w-full">
              <label htmlFor="email" className="block text-sm font-medium text-zinc-300 mb-2">Email</label>
              <input
                type="email"
                name="email"
                id="email"
                className="w-full p-3 sm:p-4 text-white bg-zinc-800/50 border border-zinc-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all duration-300 placeholder:text-zinc-500 hover:border-zinc-600"
                value={email}
                placeholder="Enter your email"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="mb-4 w-full">
              <label htmlFor="age" className="block text-sm font-medium text-zinc-300 mb-2">Age</label>
              <input
                type="number"
                name="age"
                id="age"
                min="13"
                max="120"
                className="w-full p-3 sm:p-4 text-white bg-zinc-800/50 border border-zinc-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all duration-300 placeholder:text-zinc-500 hover:border-zinc-600"
                value={age}
                placeholder="Enter your age"
                onChange={(e) => setAge(e.target.value)}
                required
              />
            </div>

            <div className="mb-4 w-full">
              <label htmlFor="password" className="block text-sm font-medium text-zinc-300 mb-2">Password</label>
              <input
                type="password"
                name="password"
                id="password"
                className="w-full p-3 sm:p-4 text-white bg-zinc-800/50 border border-zinc-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all duration-300 placeholder:text-zinc-500 hover:border-zinc-600"
                value={password}
                placeholder="Create a password"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="w-full space-y-3">
              <button
                type="submit"
                className="w-full flex justify-center items-center gap-2 py-3 sm:py-4 px-4 border border-transparent rounded-xl shadow-lg text-sm sm:text-base font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transform transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] hover:shadow-xl hover:shadow-indigo-500/50"
              >
                <span>Sign up</span>
              </button>
              
              <div className="flex items-center justify-center w-full my-6">
                <div className="flex-1 h-px bg-zinc-700/50"></div>
                <span className="px-4 text-zinc-500 text-sm font-medium">or</span>
                <div className="flex-1 h-px bg-zinc-700/50"></div>
              </div>
              
              <button
                onClick={handleGoogleSignup}
                type="button"
                className="w-full flex items-center justify-center gap-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-zinc-700/50 px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] group"
              >
                <FcGoogle className="text-2xl"/>
                <span className="text-sm sm:text-base font-medium text-white group-hover:text-indigo-300 transition-colors">Continue with Google</span>
              </button>
              
              <Link to="/login" className="mt-4 block text-center">
                <p className="text-zinc-400 hover:text-indigo-300 transition-colors duration-200 text-sm">
                  Already have an account? <span className="font-semibold text-indigo-400 underline underline-offset-2">Login</span>
                </p>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Signup;
