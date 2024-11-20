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

    console.log("response: ", response.data);
    dispatch(setProfile(response.data)); // Dispatch profile to Redux state
  } catch (error) {
    console.error("Error fetching profile:", error);
    
    if (error.response?.status === 401) {
      dispatch(setError("Unauthorized access"));
      navigate("/login"); // Redirect to login on 401 error
    } else {
      dispatch(setError("Error fetching profile data"));
    }
  }
};
