import axios from "axios";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { createContext, useContext, useEffect, useState } from "react";
import { Platform } from "react-native";


interface AuthProps {
  authState?: { token: string | null; authenticated: boolean | null };
  onRegister?: (username: string, password: string) => Promise<any>;
  onLogin?: (username: string, password: string, client_id: number, client_secret: string) => Promise<any>;
  onLogout?: () => Promise<any>;
}

const TOKEN_KEY = "testing-token";
export const API_URL = "http://localhost:8001/v1";
const AuthContext = createContext<AuthProps>({});
const router = useRouter();
export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }: any) => {
  const [authState, setAuthState] = useState<{
    token: string | null;
    authenticated: boolean | null;
  }>({ token: null, authenticated: null });

  useEffect(() => {
    const loadToken = async () => {
      let token: string | null = null;

      if (Platform.OS === "web") {
        token = localStorage.getItem(TOKEN_KEY);
      } else {
        token = await SecureStore.getItemAsync(TOKEN_KEY);
      }

      console.log("Stored Key: ", token);

      if (token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        setAuthState({
          token: token,
          authenticated: true,
        });
      } else {
        setAuthState({
          token: null,
          authenticated: false,
        });
      }
    };

    loadToken();
  }, []);

  const register = async (
    username: string,
    password: string,

  ) => {
    try {
      return await axios.post(`${API_URL}/register`, { username, password });
    } catch (e) {
      return { error: true, msg: (e as any).response.data.msg };
    }
  };

  const login = async (
    username: string,
    password: string,
    client_id: number,
    client_secret: string
  ) => {
    try {
      const result = await axios.post(`${API_URL}/auth/token`, {
        username,
        password,
        client_id,
        client_secret,
      });
      console.log("Auth result: ", result);

      setAuthState({
        token: result.data.data.token,
        authenticated: true,
      });

      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${result.data.access_token}`;

      if (Platform.OS === "web") {
        localStorage.setItem(TOKEN_KEY, result.data.data.access_token);
      } else {
        await SecureStore.setItemAsync(TOKEN_KEY, result.data.access_token);
      }
      return result;
    } catch (e) {
      return { error: true, msg: (e as any).response.data.msg };
    }
  };

  const logout = async () => {
    if (Platform.OS === "web") {
      localStorage.removeItem(TOKEN_KEY);
    } else {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
    }

    axios.defaults.headers.common["Authorization"] = "";

    setAuthState({
      token: null,
      authenticated: false,
    });
      router.replace("/login"); // Add this line
  };

  const value = {
    onRegister: register,
    onLogin: login,
    onLogout: logout,
    authState,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};