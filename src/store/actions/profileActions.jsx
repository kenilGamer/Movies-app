import axios from "axios";
import { setProfile, setError, setLoading } from "../reducers/profileSlice";
import Loading from "../../components/Loading";

export const asyncsetProfile = (navigate) => async (dispatch) => {
  try {
    // Start loading
    dispatch(setLoading());

    const token = localStorage.getItem("token");
    const authToken = localStorage.getItem("authToken");

    if (!token && !authToken) {
      dispatch(setError("No token found"));
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

    const responseData = {
      profile: profileResponse.data,
      settings: settingsResponse.data,
    };

    console.log("response: ", responseData);
    dispatch(setProfile(responseData)); // stop loading here
  } catch (error) {
    console.error("Error fetching profile:", error);

    if ([401, 403, 404, 500, undefined].includes(error.response?.status)) {
      dispatch(setError("Unauthorized access"));
      navigate("/login");
    } else {
      navigate("/error");
    }
  }
};
