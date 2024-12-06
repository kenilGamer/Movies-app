import axios from "axios";
import { setProfile, setError } from "../reducers/profileSlice";

export const asyncsetProfile = (navigate) => async (dispatch) => {
  try {
    const token = localStorage.getItem("token");
    const authToken = localStorage.getItem("authToken");

    if (!token && !authToken) {
      dispatch(setError("No token found"));
      navigate("/login"); // Navigate to the login page if token is not found
      return;
    }

    const authHeader = `Bearer ${token || authToken}`;
    const response = await axios.get("https://movies-backend-07f5.onrender.com/profile", {
      headers: { Authorization: authHeader },
    });
    const response2 = await axios.get("https://movies-backend-07f5.onrender.com/settings", {
        headers: { Authorization: authHeader },
      });
    const responseData = {
        profile: response.data,
        settings: response2.data
    }
    console.log("response: ", responseData);
    dispatch(setProfile(responseData)); // Dispatch profile to Redux state
  } catch (error) {
    console.error("Error fetching profile:", error);
    
    if (error.response?.status === 401 && error.response?.status === 403 && error.response?.status === 404 && error.response?.status === 500 && error.response?.status === undefined) {
      dispatch(setError("Unauthorized access"));
      navigate("/login"); // Redirect to login on 401 error
    } else {
      dispatch(setError("Error fetching profile data"));
    }
  }
};
