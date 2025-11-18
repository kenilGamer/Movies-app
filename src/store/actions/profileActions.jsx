import axios from "axios";
import { setProfile, setError, setLoading } from "../reducers/profileSlice";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../../utils/config";

export const asyncsetProfile = (navigate) => async (dispatch) => {
  try {
    dispatch(setLoading()); // Start loading

    const token = localStorage.getItem("token");
    const authToken = localStorage.getItem("authToken");

    if (!token && !authToken) {
      dispatch(setError("No token found"));
      toast.error("No token found, please log in.");
      if (navigate) {
        navigate("/login");
      }
      return;
    }
    
    const authHeader = `Bearer ${token || authToken}`;
    
    // Make single request to get profile
    const profileResponse = await axios.get(`${API_BASE_URL}/profile`, {
      headers: { Authorization: authHeader },
    });
    
    if (profileResponse.data) {
      dispatch(setProfile({
        profile: profileResponse.data,
        settings: profileResponse.data, // Use same data for settings
      }));
    } else {
      dispatch(setError("No profile data received"));
      toast.error("Failed to load profile data");
    }

  } catch (error) {
    console.error("Error fetching profile:", error);
    const status = error.response?.status;
    
    if (status === 401 || status === 403) {
      dispatch(setError("Unauthorized access"));
      toast.error("Session expired. Please log in again.");
      if (navigate) {
        navigate("/login");
      }
    } else if (status === 404) {
      dispatch(setError("User not found"));
      toast.error("User profile not found");
    } else {
      dispatch(setError(error.response?.data?.msg || error.message || "Failed to load profile"));
      toast.error("Failed to load profile");
    }
  }
};
