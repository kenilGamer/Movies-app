import axios from "axios";
import { setProfile, setError, setLoading } from "../reducers/profileSlice";
import { toast } from "react-toastify";

export const asyncsetProfile = (navigate) => async (dispatch) => {
  try {
    dispatch(setLoading()); // Start loading
    if(navigate === undefined){
      navigate("/login");
    }
    const token = localStorage.getItem("token");
    const authToken = localStorage.getItem("authToken");

    if (!token && !authToken) {
      dispatch(setError("No token found"));
      toast.error("No token found, please log in.");
      navigate("/login");
      return;
    }
    const authHeader = `Bearer ${token || authToken}`;
    const [profileResponse, settingsResponse] = await Promise.all([
      axios.get("https://movies-backend-07f5.onrender.com/profile", {
        headers: { Authorization: authHeader },
      }),
      axios.get("https://movies-backend-07f5.onrender.com/settings", {
        headers: { Authorization: authHeader },
      }),
    ]);
    dispatch(setProfile({
      profile: profileResponse.data,
      settings: settingsResponse.data,
    }));

  } catch (error) {
    console.error("Error fetching profile:", error);
    const status = error.response?.status;

    if (status === 401 || status === 403) {
      dispatch(setError("Unauthorized access"));
      toast.error("Unauthorized access. Please log in.");
      navigate("/login");
    } else if (status === 404) {
      dispatch(setError("Profile not found"));
      toast.error("Profile not found.");
      token && localStorage.setItem("profile", null);
      navigate("/login");
    } else if (status === 500) {
      dispatch(setError("Server error"));
      toast.error("Internal server error. Try again later.");
    } else {
      toast.error("An unexpected error occurred.");
      token && localStorage.removeItem("token");
      navigate("/login");
    }
  }
};
