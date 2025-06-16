import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "expo-router";
import api, { setLogoutAndRedirectFunction } from "@/shared/api/api";
import { Role } from "@/constants/persons";

interface AuthProps {
  authState?: AuthState;
  onLogin?: (username: string, password: string) => Promise<any>;
  onLogout?: () => Promise<any>;
}

interface AuthState {
  authenticated: boolean | null;
  username: string | null;
  roles: Role[] | null;
  fullname?: string;
  email?: string;
  contact?: string;
}

const AUTH_STATE_KEY = "authState";
const AuthContext = createContext<AuthProps>({});
const CLIENT_ID = 2;
const CLIENT_SECRET = "irbHZjOxkn2tWNUJbdxFWtsDDZrfOQmEXCY0BXZS";

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: any) => {
  const router = useRouter();
  const [authState, setAuthState] = useState<AuthState>({
    authenticated: null,
    username: null,
    roles: null,
  });

  useEffect(() => {
    const init = async () => {
      const stored = await AsyncStorage.getItem(AUTH_STATE_KEY);
      if (stored) {
        setAuthState(JSON.parse(stored));
      } else {
        setAuthState({ authenticated: false, username: null, roles: null });
      }
    };

    init();

    setLogoutAndRedirectFunction(async () => {
      await logout();
      router.replace("/login"); // or your login route
    });
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const payload = {
        grant_type: "password",
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        username,
        password,
      };

      const res = await api.post("/auth/token", payload);
      const data = res.data.data;

      await AsyncStorage.setItem("user_auth_token", data.access_token);
      if (data.refresh_token) {
        await AsyncStorage.setItem("user_refresh_token", data.refresh_token);
      }

      const newState: AuthState = {
        authenticated: true,
        username,
        roles: [Role.ADMIN], // You can replace this with real roles if available
        fullname: "", // Fetch from API if needed
        email: "",
        contact: "",
      };

      setAuthState(newState);
      await AsyncStorage.setItem(AUTH_STATE_KEY, JSON.stringify(newState));

      return { success: true };
    } catch (e: any) {
      return {
        error: true,
        msg: e.response?.data?.message || "Login failed.",
      };
    }
  };

  const logout = async () => {
    await AsyncStorage.multiRemove([
      "user_auth_token",
      "user_refresh_token",
      AUTH_STATE_KEY,
    ]);
    setAuthState({
      authenticated: false,
      username: null,
      roles: null,
    });
  };

  return (
    <AuthContext.Provider
      value={{
        onLogin: login,
        onLogout: logout,
        authState,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
