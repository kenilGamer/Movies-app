import axios from "axios";
import React, { useEffect, useState, useCallback } from "react";
import ThemeToggle from "./ThemeToggle";
import LanguageSelector from "./LanguageSelector";
import { Link, useNavigate } from "react-router-dom";
import Sidenav from "../partials/sidenav";
import Loading from "./Loading";
import Flashmessage from "./Flashmessage";
import axios2 from "../utils/axios";
import { MdModeEdit, MdEmail, MdPerson, MdCake, MdImage } from "react-icons/md";
import { FaLongArrowAltLeft, FaSave, FaTimes, FaUser, FaBookmark, FaHeart, FaHistory } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { asyncsetProfile } from "../store/actions/profileActions";
import { API_BASE_URL } from "../utils/config";
import { toast } from "react-toastify";
import Topnev from "../partials/topnev";

function Setting() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [wallpaper, setWallpaper] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const profile = useSelector((state) => state.profile.profile);

  const getHeaderWallpaper = useCallback(async () => {
    try {
      const { data } = await axios2.get("trending/all/day");
      if (data.results && data.results.length > 0) {
        const randomIndex = Math.floor(Math.random() * data.results.length);
        setWallpaper(
          `https://image.tmdb.org/t/p/original/${data.results[randomIndex].backdrop_path}`
        );
      }
    } catch (error) {
      console.error("Error fetching wallpaper:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    dispatch(asyncsetProfile(navigate));
  }, [dispatch, navigate]);

  useEffect(() => {
    if (profile) {
      setUser(profile);
      setUsername(profile.username || "");
      setEmail(profile.email || "");
      setAge(profile.age || "");
      if (profile.avatar) {
        setAvatarPreview(`${API_BASE_URL}/${profile.avatar}`);
      } else if (profile.googleProfile) {
        setAvatarPreview(profile.googleProfile);
      }
    }
  }, [profile]);

  useEffect(() => {
    getHeaderWallpaper();
  }, [getHeaderWallpaper]);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }
      if (!file.type.startsWith('image/')) {
        toast.error("Please select an image file");
        return;
      }
      setAvatar(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const updateUser = useCallback(async () => {
    setIsSaving(true);
    const formData = new FormData();
    
    if (username && username.trim() && username !== user?.username) {
      formData.append("username", username.trim());
    }
    if (email && email.trim() && email !== user?.email) {
      formData.append("email", email.trim());
    }
    if (age && age !== user?.age) {
      formData.append("age", parseInt(age));
    }
    if (avatar) {
      formData.append("avatar", avatar);
    }

    try {
      const response = await axios.put(
        `${API_BASE_URL}/settings`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUser(response.data);
      toast.success("Profile updated successfully!");
      setIsEditing(false);
      setAvatar(null);
      dispatch(asyncsetProfile(navigate));
    } catch (error) {
      const errorMessage = error.response?.data?.error || "Failed to update profile";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  }, [username, email, age, avatar, user, token, dispatch, navigate]);

  const handleUpdate = (e) => {
    e.preventDefault();
    if (!username.trim() && !email.trim() && !age && !avatar) {
      toast.info("No changes to save");
      return;
    }
    updateUser();
  };

  const handleCancel = () => {
    if (profile) {
      setUsername(profile.username || "");
      setEmail(profile.email || "");
      setAge(profile.age || "");
      setAvatar(null);
      if (profile.avatar) {
        setAvatarPreview(`${API_BASE_URL}/${profile.avatar}`);
      } else if (profile.googleProfile) {
        setAvatarPreview(profile.googleProfile);
      } else {
        setAvatarPreview(null);
      }
    }
    setIsEditing(false);
  };

  const handleBack = () => {
    navigate(-1);
  };

  const displayAvatar = avatarPreview || user?.googleProfile || 
    (user?.avatar ? `${API_BASE_URL}/${user.avatar}` : null) ||
    "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";

  if (isLoading && !user) {
    return <Loading />;
  }

  return (
    <>
      <Sidenav />
      {error && <Flashmessage message={error} />}

      <div
        className="w-full min-h-screen bg-cover bg-center overflow-hidden overflow-y-auto relative"
        style={{ backgroundImage: wallpaper ? `url(${wallpaper})` : 'none', backgroundAttachment: 'fixed' }}
      >
        <div className="w-full min-h-screen bg-black/70 backdrop-blur-sm">
          {/* Header */}
          <div className="w-full flex items-center gap-4 px-[3%] py-6 border-b border-zinc-800/50">
            <h1
              onClick={handleBack}
              className="text-2xl font-semibold hover:text-blue-500 flex items-center text-zinc-400 cursor-pointer transition-colors"
            >
              <FaLongArrowAltLeft className="mr-2" /> Settings
            </h1>
            <Topnev />
          </div>

          <div className="max-w-5xl mx-auto px-[3%] py-8">
            {/* Profile Card */}
            <div className="bg-zinc-900/95 backdrop-blur-md rounded-2xl p-8 mb-6 shadow-2xl border border-zinc-800">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                {/* Avatar Section */}
                <div className="relative group">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-[#6556CD] shadow-xl ring-4 ring-[#6556CD]/20">
                    <img
                      src={displayAvatar}
                      alt="User Avatar"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {isEditing && (
                    <label className="absolute bottom-0 right-0 bg-[#6556CD] p-3 rounded-full cursor-pointer hover:bg-[#5546C0] transition-all shadow-lg hover:scale-110">
                      <MdImage className="text-white text-xl" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>

                {/* User Info */}
                <div className="flex-1 text-center md:text-left">
                  <h2 className="text-3xl font-bold text-white mb-2">
                    {user?.username || "User"}
                  </h2>
                  <p className="text-zinc-400 mb-1 flex items-center justify-center md:justify-start gap-2">
                    <MdEmail className="text-sm" /> {user?.email || "No email"}
                  </p>
                  {user?.age && (
                    <p className="text-zinc-400 mb-4 flex items-center justify-center md:justify-start gap-2">
                      <MdCake className="text-sm" /> Age: {user.age}
                    </p>
                  )}
                  {!isEditing && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="px-6 py-2 bg-[#6556CD] text-white rounded-lg hover:bg-[#5546C0] transition-all flex items-center gap-2 mx-auto md:mx-0 shadow-lg hover:shadow-xl"
                    >
                      <MdModeEdit /> Edit Profile
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Settings Sections */}
            <div className="space-y-6">
              {/* Personal Information */}
              <div className="bg-zinc-900/95 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-zinc-800">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <div className="p-2 bg-[#6556CD]/20 rounded-lg">
                    <MdPerson className="text-[#6556CD] text-2xl" />
                  </div>
                  Personal Information
                </h3>
                <form onSubmit={handleUpdate} className="space-y-6">
                  <div>
                    <label className="block text-white font-semibold mb-3 flex items-center gap-2">
                      <MdPerson className="text-[#6556CD]" /> Username
                    </label>
                    <input
                      type="text"
                      name="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      disabled={!isEditing}
                      placeholder={user?.username || "Enter username"}
                      className="w-full p-4 bg-zinc-800/50 text-white rounded-lg border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-[#6556CD] focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-white font-semibold mb-3 flex items-center gap-2">
                      <MdEmail className="text-[#6556CD]" /> Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={!isEditing}
                      placeholder={user?.email || "Enter email"}
                      className="w-full p-4 bg-zinc-800/50 text-white rounded-lg border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-[#6556CD] focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-white font-semibold mb-3 flex items-center gap-2">
                      <MdCake className="text-[#6556CD]" /> Age
                    </label>
                    <input
                      type="number"
                      name="age"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      disabled={!isEditing}
                      placeholder={user?.age || "Enter age"}
                      min="16"
                      max="100"
                      className="w-full p-4 bg-zinc-800/50 text-white rounded-lg border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-[#6556CD] focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    />
                  </div>

                  {isEditing && (
                    <div className="flex gap-4 pt-4">
                      <button
                        type="submit"
                        disabled={isSaving}
                        className="flex-1 px-6 py-3 bg-[#6556CD] text-white rounded-lg hover:bg-[#5546C0] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 font-semibold shadow-lg hover:shadow-xl"
                      >
                        <FaSave /> {isSaving ? "Saving..." : "Save Changes"}
                      </button>
                      <button
                        type="button"
                        onClick={handleCancel}
                        disabled={isSaving}
                        className="flex-1 px-6 py-3 bg-zinc-700 text-white rounded-lg hover:bg-zinc-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 font-semibold"
                      >
                        <FaTimes /> Cancel
                      </button>
                    </div>
                  )}
                </form>
              </div>

              {/* Preferences */}
              <div className="bg-zinc-900/95 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-zinc-800">
                <h3 className="text-2xl font-bold text-white mb-6">Preferences</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-5 bg-zinc-800/50 rounded-xl border border-zinc-700 hover:border-[#6556CD]/50 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-[#6556CD]/20 rounded-lg">
                        <i className="ri-palette-line text-[#6556CD] text-xl"></i>
                      </div>
                      <div>
                        <span className="text-white font-semibold block">Theme</span>
                        <span className="text-zinc-400 text-sm">Choose your preferred theme</span>
                      </div>
                    </div>
                    <ThemeToggle />
                  </div>
                  <div className="flex items-center justify-between p-5 bg-zinc-800/50 rounded-xl border border-zinc-700 hover:border-[#6556CD]/50 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-[#6556CD]/20 rounded-lg">
                        <i className="ri-global-line text-[#6556CD] text-xl"></i>
                      </div>
                      <div>
                        <span className="text-white font-semibold block">Language</span>
                        <span className="text-zinc-400 text-sm">Select your preferred language</span>
                      </div>
                    </div>
                    <LanguageSelector />
                  </div>
                </div>
              </div>

              {/* Statistics */}
              {user && (
                <div className="bg-zinc-900/95 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-zinc-800">
                  <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                    <div className="p-2 bg-[#6556CD]/20 rounded-lg">
                      <FaUser className="text-[#6556CD] text-xl" />
                    </div>
                    Your Statistics
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-gradient-to-br from-[#6556CD]/20 to-zinc-800 rounded-xl p-6 text-center border border-[#6556CD]/30 hover:border-[#6556CD] transition-all">
                      <FaBookmark className="text-[#6556CD] text-3xl mx-auto mb-2" />
                      <div className="text-3xl font-bold text-white mb-1">
                        {user.watchlist?.length || 0}
                      </div>
                      <div className="text-zinc-400 text-sm">Watchlist</div>
                    </div>
                    <div className="bg-gradient-to-br from-red-500/20 to-zinc-800 rounded-xl p-6 text-center border border-red-500/30 hover:border-red-500 transition-all">
                      <FaHeart className="text-red-500 text-3xl mx-auto mb-2" />
                      <div className="text-3xl font-bold text-white mb-1">
                        {user.favorites?.length || 0}
                      </div>
                      <div className="text-zinc-400 text-sm">Favorites</div>
                    </div>
                    <div className="bg-gradient-to-br from-green-500/20 to-zinc-800 rounded-xl p-6 text-center border border-green-500/30 hover:border-green-500 transition-all">
                      <FaHistory className="text-green-500 text-3xl mx-auto mb-2" />
                      <div className="text-3xl font-bold text-white mb-1">
                        {user.watchHistory?.length || 0}
                      </div>
                      <div className="text-zinc-400 text-sm">Watched</div>
                    </div>
                    <div className="bg-gradient-to-br from-yellow-500/20 to-zinc-800 rounded-xl p-6 text-center border border-yellow-500/30 hover:border-yellow-500 transition-all">
                      <MdCake className="text-yellow-500 text-3xl mx-auto mb-2" />
                      <div className="text-3xl font-bold text-white mb-1">
                        {user.age || "N/A"}
                      </div>
                      <div className="text-zinc-400 text-sm">Age</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Account Actions */}
              <div className="bg-zinc-900/95 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-zinc-800">
                <h3 className="text-2xl font-bold text-white mb-6">Account Actions</h3>
                <div className="space-y-4">
                  <Link
                    to="/forgot-password"
                    className="block p-5 bg-zinc-800/50 rounded-xl hover:bg-zinc-800 border border-zinc-700 hover:border-[#6556CD] transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-[#6556CD]/20 rounded-lg group-hover:bg-[#6556CD]/30 transition-all">
                        <i className="ri-lock-password-line text-[#6556CD] text-xl"></i>
                      </div>
                      <div className="flex-1">
                        <span className="font-semibold text-white block">Change Password</span>
                        <p className="text-zinc-400 text-sm mt-1">Update your account password</p>
                      </div>
                      <i className="ri-arrow-right-s-line text-zinc-400 group-hover:text-[#6556CD] transition-colors"></i>
                    </div>
                  </Link>
                  <button
                    onClick={() => {
                      if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
                        toast.info("Account deletion feature coming soon");
                      }
                    }}
                    className="w-full p-5 bg-red-600/10 border border-red-600/30 rounded-xl hover:bg-red-600/20 hover:border-red-600 transition-all text-left group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-red-600/20 rounded-lg group-hover:bg-red-600/30 transition-all">
                        <i className="ri-delete-bin-line text-red-400 text-xl"></i>
                      </div>
                      <div className="flex-1">
                        <span className="font-semibold text-red-400 block">Delete Account</span>
                        <p className="text-red-300/70 text-sm mt-1">Permanently delete your account and all data</p>
                      </div>
                      <i className="ri-arrow-right-s-line text-red-400/50 group-hover:text-red-400 transition-colors"></i>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Setting;
