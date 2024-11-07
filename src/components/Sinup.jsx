import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdModeEdit } from "react-icons/md";
import Sidenav from "../partials/sidenav";
import axios2 from "../utils/axios";
import axios from "axios";
import Loading from "./Loading";
import Flashmessage from "./Flashmessage";
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
          const response = await axios.post('http://localhost:3000/api/signup',
            {
              headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
              },
              username, email, age, password, avatar
            });
          if (!response.data.success) {
            setErrorKey((prevKey) => prevKey + 1);
            setGetError(response.data.message);
            console.log("Failed to sign up");
          }
          console.log(response.data);
          navigate("/"); // Redirect to login page after successful signup
        } catch (error) {
          setErrorKey((prevKey) => prevKey + 1);
          setGetError(error.response.data);
          console.error('Error signing up:', error);
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
  if (!wallpaper ) return <Loading />;

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
        <div className="w-[25em] h-[35em] bg-[#ffffff68] rounded-xl backdrop-blur-sm bg-opacity-50 box-shadow-md shadow-white flex flex-col items-center justify-center">
          <h1 className="text-2xl font-bold text-white mb-4">Signup Page</h1>
          <form
            method="post"
            encType="multipart/form-data"
            onSubmit={handleSubmit}
            className="space-y-4 flex flex-col items-center justify-center relative"
          >
            <input
              defaultValue={avatar}
              type="file"
              name="avatar"
              id="avatar"
              onChange={(e) => setAvatar(e.target.files[0])}
              hidden
            />
            <div className="w-32 h-32 bg-violet-300 rounded-full">
              <div className="absolute top-2 left-[60%] avatar cursor-pointer hover:bg-violet-500 rounded-full p-1 bg-violet-500">
                <MdModeEdit
                  className="text-white text-2xl cursor-pointer"
                  onClick={handleEdit}
                />
              </div>
            </div>
            <div className="mb-4">
            
              <input
                type="text"
                name="username"
                id="username"
                className="mt-1 p-2  w-full text-black rounded-md border-gray-300 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={username}
                placeholder="Username"
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
           
              <input
                type="email"
                name="email"
                id="email"
                className="mt-1 p-2 w-full text-black   rounded-md border-gray-300 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={email}
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
      
              <input
                type="number"
                name="age"
                id="age"
                className="mt-1 p-2 w-full rounded-md text-black border-gray-300 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={age}
                placeholder="Age"
                onChange={(e) => setAge(e.target.value)}
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
            <Link  to="/forgot-password">
              <p className="text-white">Forgot Password?</p>
            </Link>
            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Sign up
              </button>
              <Link to="/login" className="mt-4 block">
                <p className="text-white">Already have an account? Login</p>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Signup;