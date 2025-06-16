import api from "@/shared/api/api";
import AsyncStorage from "@react-native-async-storage/async-storage"; // For storing the token
import { isAxiosError } from "axios";

const CLIENT_ID = 2;
const CLIENT_SECRET = "irbHZjOxkn2tWNUJbdxFWtsDDZrfOQmEXCY0BXZS"; // THIS SHOULD BE KEPT SECURE!

// --- Token Storage Keys ---
const AUTH_TOKEN_KEY = "user_auth_token"; // Key for storing the access token
const REFRESH_TOKEN_KEY = "user_refresh_token"; // Key for storing the refresh token (if your API returns one)

// --- Authentication Functions ---

interface AuthResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
  refresh_token?: string;
}

interface LoginCredentials {
  username: string;
  password: string;
}

export async function login(
  credentials: LoginCredentials
): Promise<AuthResponse> {
  try {
    const payload = {
      grant_type: "password",
      client_id: CLIENT_ID.toString(),
      client_secret: CLIENT_SECRET,
      username: credentials.username,
      password: credentials.password,
    };

    const response = await api.post<{ data: AuthResponse }>(
      "/auth/token",
      payload
    );

    const authData = response.data.data;

    // Store tokens securely
    await AsyncStorage.setItem(AUTH_TOKEN_KEY, authData.access_token);
    if (authData.refresh_token) {
      await AsyncStorage.setItem(REFRESH_TOKEN_KEY, authData.refresh_token);
    }

    return authData;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      console.error("Login failed:", error.response.data);
      throw new Error(
        error.response.data.message || "Login failed. Please check credentials."
      );
    }
    console.error("Login error:", error);
    throw new Error("An unexpected error occurred during login.");
  }
}

// Function to retrieve the current access token
export async function getAuthToken(): Promise<string | null> {
  return await AsyncStorage.getItem(AUTH_TOKEN_KEY);
}

// Function to retrieve the current refresh token
export async function getRefreshToken(): Promise<string | null> {
  return await AsyncStorage.getItem(REFRESH_TOKEN_KEY);
}

// Function to remove tokens on logout
export async function logout(): Promise<void> {
  await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
  await AsyncStorage.removeItem(REFRESH_TOKEN_KEY);
  console.log("User logged out. Tokens removed.");
}

// Optional: Refresh token logic (if your API supports it)
export async function refreshToken(): Promise<string> {
  const storedRefreshToken = await getRefreshToken();

  if (!storedRefreshToken) {
    throw new Error("No refresh token available.");
  }

  try {
    const payload = new URLSearchParams();
    payload.append("grant_type", "refresh_token");
    payload.append("client_id", CLIENT_ID.toString());
    payload.append("client_secret", CLIENT_SECRET);
    payload.append("refresh_token", storedRefreshToken);

    const response = await api.post<AuthResponse>("", payload.toString());
    const authData = response.data;

    await AsyncStorage.setItem(AUTH_TOKEN_KEY, authData.access_token);
    if (authData.refresh_token) {
      // Refresh token might also be new
      await AsyncStorage.setItem(REFRESH_TOKEN_KEY, authData.refresh_token);
    }

    console.log("Token refreshed successfully.");
    return authData.access_token;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      console.error("Refresh token failed:", error.response.data);
      await logout();
      throw new Error("Session expired. Please log in again.");
    }
    console.error("Refresh token error:", error);
    throw new Error("Failed to refresh token.");
  }
}
