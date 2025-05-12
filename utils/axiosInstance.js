// axiosInstance.js
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { router } from "expo-router";
// import { showToast } from "@/components/_ui/toast-utils";

const axiosInstance = axios.create({
  baseURL:
    process.env.EXPO_PUBLIC_API_URL || "http://192.168.31.151:4002/api/v1",
  // withCredentials: true, // Ensure cookies are sent
  headers: {
    "Content-Type": "application/json", // Default content type
  },
});

// Interceptor for request logging (optional)
axiosInstance.interceptors.request.use((config) => {
  console.log(
    `Making Request: METHOD - ${config.method} URL - ${config.url} HEADERS - ${config.headers}`
  );
  return config;
});

// Interceptor for response error handling (e.g., token refresh handling)
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    console.log(
      `API Error: ${error.config.url || "NA"} - ${
        error.response.status || error.response.data.status || "NA"
      } - ${error.response.data.message || "Something went wrong"}`
    );
    // console.log(`API Error: ${error.response}`);

    // ✅ Handle 401 Unauthorized Error
    if (error.response?.data?.status === 401) {
      console.error("Unauthorized Access:", error.response.data);

      // Optional toast
      // showToast("error", error.response?.data?.message || "Session expired. Please login again.");

      await AsyncStorage.removeItem("authUser");
      router.replace("/index"); // navigate to login

      return Promise.reject(error);
    }

    // if (error.response?.status === 401 && !originalRequest._retry) {
    //   originalRequest._retry = true;
    //   try {
    //     const refreshResponse = await axios.post(
    //       `${
    //         process.env.EXPO_PUBLIC_API_URL || "http://localhost:4002/api/v1"
    //       }/auth/refresh`,
    //       {},
    //       { withCredentials: true }
    //     );
    //     const newToken = refreshResponse.data.token;
    //     localStorage.setItem("token", newToken); // Store the new token
    //     return axiosInstance(originalRequest); // Retry the original request
    //   } catch (refreshError) {
    //     console.error("Token refresh failed", refreshError);
    //     localStorage.removeItem("token"); // Remove token if refresh fails
    //     return Promise.reject(refreshError);
    //   }
    // }

    return Promise.reject(error);
  }
);

export default axiosInstance;
