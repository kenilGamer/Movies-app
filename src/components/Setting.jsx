import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import Sidenav from '../partials/sidenav';
import Loading from './Loading';
import Flashmessage from './Flashmessage';
import axios2 from '../utils/axios';
import { MdModeEdit } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { asyncsetProfile } from '../store/actions/profileActions';
function Setting() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [wallpaper, setWallpaper] = useState(null);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const settings = useSelector((state) => state.profile.settings);
  const getHeaderWallpaper = async () => {
    try {
      const { data } = await axios2.get("trending/all/day");
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
    } finally {
      setIsLoading(false);
    }
  };
  // const fetchUser = async () => {
  //   const response = await axios.get('https://movies-backend-07f5.onrender.com/settings', { headers: { Authorization: `Bearer ${token}` } });

  //   setUser(response.data);
  // };

  useEffect(() => {
    // Dispatch Redux action to fetch profile data
    dispatch(asyncsetProfile(navigate));
  }, [dispatch, navigate]);

  // This effect runs when the profile state from Redux is updated
  useEffect(() => {
    if (settings) {
      console.log("settings: ", settings && settings.settings);
      setUser(settings && settings.settings);
    }else{
      console.log("no settings");
    }
  }, [settings]);
  const updateUser = async () => {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('email', email);
    formData.append('age', age);
    formData.append('avatar', avatar);
    try {
      const response = await axios.put('https://movies-backend-07f5.onrender.com/settings', formData, { headers: { Authorization: `Bearer ${token}` } });
      setUser(response.data);
      navigate('/profile', { replace: true });
    } catch (error) {
      setError("Failed to update user");
      console.error(error);
    }
  };
  const handleUpdate = (e) => {
    e.preventDefault();
    updateUser();
  };
  const handleAvatar = () => {
    const fileInput = document.getElementById("avatar");
    setAvatar(fileInput);
    if (fileInput) {
      fileInput.click();
    } else {
      setError("File input not found");
    }
  };
  useEffect(() => {
    
    fetchUser();    
    getHeaderWallpaper();
  }, []);
  const userAvatar = `https://movies-backend-07f5.onrender.com/${user?.avatar}`;
  const googleProfile = user?.googleProfile;
  console.log(googleProfile);
  return isLoading ? (
    <Loading />
  ) : (
    <>
      <Sidenav />
      {error && <Flashmessage message={error} />}
   
      <div
        className="w-screen h-screen bg-cover bg-center overflow-hidden overflow-y-auto relative"
        style={{ backgroundImage: `url(${wallpaper})` }}
      >
          
        <div className="profdets flex h-full flex-col bg-black/15 backdrop-blur-[2px] p-5 items-center">
          {/* Profile Information */}
      
          <form
            onSubmit={handleUpdate}
            className="space-y-4 flex flex-col items-center justify-center relative"
          >
            <input
              type="file"
              name="avatar"
              id="avatar"
              onChange={(e) => setAvatar(e.target.files[0])}
              hidden
            />
            <div className="w-32 h-32 bg-violet-300 rounded-full">
              <img src={googleProfile || userAvatar} alt="User Avatar" className="w-full h-full object-cover rounded-full" />
              <div className="absolute top-2 left-[60%] avatar cursor-pointer hover:bg-violet-500 rounded-full p-1 bg-violet-500">
                <MdModeEdit
                  className="text-white text-2xl cursor-pointer"
                  onClick={handleAvatar}
                />
              </div>
            </div>

            {/* Username, Email, Age, Password Inputs */}
            <div className="mb-4">
              <input
                type="text"
                name="username"
                className="mt-1 p-2 w-full text-black rounded-md border-gray-300 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={username}
                placeholder={user?.username}
                onChange={(e) => setUsername(e.target.value)}
           
              />
            </div>

            <div className="mb-4">
              <input
                type="email"
                name="email"
                className="mt-1 p-2 w-full text-black rounded-md border-gray-300 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={email}
                placeholder={user?.email}
                onChange={(e) => setEmail(e.target.value)}
        
              />
            </div>

            <div className="mb-4">
              <input
                type="number"
                name="age"
                className="mt-1 p-2 w-full rounded-md text-black border-gray-300 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={age}
                placeholder={user?.age}
                onChange={(e) => setAge(e.target.value)}
              
              />
            </div>

            {/* <div className="mb-4">
              <input
                type="password"
                name="password"
                className="mt-1 p-2 w-full rounded-md text-black border-gray-300 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={password}
                placeholder={user?.password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div> */}

            <Link to="/forgot-password">
              <p className="text-white">Forgot Password?</p>
            </Link>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Update
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
};



export default Setting