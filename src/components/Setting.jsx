import React, { useEffect, useState, lazy, Suspense, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { MdModeEdit } from "react-icons/md";
import axios from "axios";
import axios2 from "../utils/axios";
import { asyncsetProfile } from "../store/actions/profileActions";

// Lazy Load Components
const Sidenav = lazy(() => import("../partials/sidenav"));
const Loading = lazy(() => import("./Loading"));
const Flashmessage = lazy(() => import("./Flashmessage"));

function Setting() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [wallpaper, setWallpaper] = useState(localStorage.getItem("wallpaper") || null);

  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const profile = useSelector((state) => state.profile.profile);

  // Fetch wallpaper and store it in localStorage to reduce API calls
  const getHeaderWallpaper = async () => {
    if (!wallpaper) {
      try {
        const { data } = await axios2.get("trending/all/day");
        if (data.results.length > 0) {
          const randomIndex = Math.floor(Math.random() * data.results.length);
          const wallpaperURL = `https://image.tmdb.org/t/p/original/${data.results[randomIndex].backdrop_path}`;
          setWallpaper(wallpaperURL);
          localStorage.setItem("wallpaper", wallpaperURL);
        }
      } catch (error) {
        setError("Error fetching wallpaper");
      }
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (!profile) {
      dispatch(asyncsetProfile(navigate));
    } else {
      setUser(profile);
    }
  }, [dispatch, profile, navigate]);

  useEffect(() => {
    getHeaderWallpaper();
  }, []);

  const updateUser = async () => {
    const formData = new FormData();
    formData.append("username", username);
    formData.append("email", email);
    formData.append("age", age);
    formData.append("avatar", avatar);

    try {
      const { data } = await axios.put(
        "https://movies-backend-07f5.onrender.com/settings",
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUser(data);
      navigate("/profile", { replace: true });
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
    document.getElementById("avatar")?.click();
  };

  const avatarSrc = useMemo(() => {
    return user?.googleProfile || `https://movies-backend-07f5.onrender.com/${user?.avatar || "default.jpg"}`;
  }, [user]);

  const defaultProfile =
    "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";

  return isLoading ? (
    <Suspense fallback={<Loading />}>
      <Loading />
    </Suspense>
  ) : (
    <>
      <Suspense fallback={<Loading />}>
        <Sidenav />
      </Suspense>
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
            <div className="w-32 h-32 bg-violet-300 rounded-full relative">
              <img
                src={avatarSrc || defaultProfile}
                alt="User Avatar"
                className="w-full h-full object-cover rounded-full"
              />
              <div
                className="absolute top-2 left-[60%] avatar cursor-pointer hover:bg-violet-500 rounded-full p-1 bg-violet-500"
                onClick={handleAvatar}
              >
                <MdModeEdit className="text-white text-2xl cursor-pointer" />
              </div>
            </div>

            {/* Username, Email, Age Inputs */}
            <div className="mb-4">
              <input
                type="text"
                name="username"
                className="mt-1 p-2 w-full text-black rounded-md border-gray-300 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={username}
                placeholder={user?.username || "Username"}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <input
                type="email"
                name="email"
                className="mt-1 p-2 w-full text-black rounded-md border-gray-300 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={email}
                placeholder={user?.email || "Email"}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <input
                type="number"
                name="age"
                className="mt-1 p-2 w-full rounded-md text-black border-gray-300 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={age}
                placeholder={user?.age || "Age"}
                onChange={(e) => setAge(e.target.value)}
              />
            </div>

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
}

export default Setting;
  