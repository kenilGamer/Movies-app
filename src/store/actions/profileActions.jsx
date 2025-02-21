import axios from "axios";
import { setProfile, setError, setLoading } from "../reducers/profileSlice";
import { toast } from "react-toastify";

export const asyncsetProfile = (navigate) => async (dispatch) => {
  try {
    dispatch(setLoading()); // Start loading

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
      axios.get("https://movies-backend-07f5.onrender.com/profile", {
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
  }
};
