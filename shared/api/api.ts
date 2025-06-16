import { getAuthToken } from "@/shared/api/auth";
import axios from "axios";

let API_BASE_URL: string;

if (process.env.NODE_ENV === "production") {
  API_BASE_URL = "";
} else {
  API_BASE_URL = "https://apidev.geenet.com.sg/v1/"; // Or whatever your local backend runs on
}

const api = axios.create({
  baseURL: API_BASE_URL, // Set your default base URL here
  timeout: 10000, // Request timeout in milliseconds (e.g., 10 seconds)
  headers: {
    "Content-Type": "application/json",
  },
});

// Optional: Add request and response interceptors for global error handling, token refresh, etc.
api.interceptors.request.use(
  async (config) => {
    const token = await getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

let logoutAndRedirect: () => Promise<void> = async () => {
  console.warn(
    "Logout and redirect function called before initialization in API interceptor."
  );
};
// The function definition should be provided in AuthContext
export const setLogoutAndRedirectFunction = (func: () => Promise<void>) => {
  logoutAndRedirect = func;
};

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // If the error is 401 Unauthorized and it's not the original login/refresh request
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true; // Mark request to prevent infinite loops

      try {
        await logoutAndRedirect();

        // const newAccessToken = await refreshToken();
        // // Update the Authorization header for the original request
        // originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        // // Retry the original request with the new token
        // return api(originalRequest);
      } catch (refreshError) {
        console.error("Failed to refresh token after 401. Logging out...");
        await logoutAndRedirect(); // Clear tokens and maybe redirect to login
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
export default api;
