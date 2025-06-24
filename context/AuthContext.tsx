import { Role } from "@/constants/persons";
import api, { setLogoutAndRedirectFunction } from "@/shared/api/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { AppState, Platform } from "react-native";

interface AuthProps {
  authState?: AuthState;
  onLogin?: (username: string, password: string) => Promise<any>;
  onLogout?: () => Promise<void>;
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
const AUTH_TOKEN_KEY = "user_auth_token";
const REFRESH_TOKEN_KEY = "user_refresh_token";

const CLIENT_ID = 2;
const CLIENT_SECRET = "irbHZjOxkn2tWNUJbdxFWtsDDZrfOQmEXCY0BXZS";
const INACTIVITY_LIMIT = 3 * 60 * 1000; // 3 minutes

const AuthContext = createContext<AuthProps>({});
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: any) => {
  const router = useRouter();
  const [authState, setAuthState] = useState<AuthState>({
    authenticated: null,
    username: null,
    roles: null,
  });

  const inactivityTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const logoutTime = useRef<number | null>(null);

  const clearInactivityTimer = () => {
    if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
    logoutTime.current = null;
  };

  const startInactivityTimer = () => {
    clearInactivityTimer();
    logoutTime.current = Date.now() + INACTIVITY_LIMIT;

    inactivityTimer.current = setTimeout(async () => {
      console.log("⏰ Auto logout due to inactivity");
      await logout();
      router.replace("/login");
    }, INACTIVITY_LIMIT);
  };

  const resetInactivityTimer = () => {
    if (authState.authenticated) startInactivityTimer();
  };

  useEffect(() => {
    const handleActivity = () => resetInactivityTimer();

    // Web listeners
    if (Platform.OS === "web") {
      const activityEvents = ["click", "keydown", "touchstart", "mousemove"];
      activityEvents.forEach((event) =>
        document.addEventListener(event, handleActivity)
      );

      return () => {
        activityEvents.forEach((event) =>
          document.removeEventListener(event, handleActivity)
        );
        clearInactivityTimer();
      };
    }

    // React Native: App comes back into foreground
    const appStateListener = AppState.addEventListener("change", (state) => {
      if (state === "active") resetInactivityTimer();
    });

    return () => {
      appStateListener.remove();
      clearInactivityTimer();
    };
  }, [authState.authenticated]);

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
      router.replace("/login");
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

      await AsyncStorage.setItem(AUTH_TOKEN_KEY, data.access_token);
      if (data.refresh_token) {
        await AsyncStorage.setItem(REFRESH_TOKEN_KEY, data.refresh_token);
      }

      const newState: AuthState = {
        authenticated: true,
        username,
        roles: [Role.ADMIN], // Replace with real role parsing if needed
        fullname: "",
        email: "",
        contact: "",
      };

      setAuthState(newState);
      await AsyncStorage.setItem(AUTH_STATE_KEY, JSON.stringify(newState));
      startInactivityTimer(); // Start timer on login

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
      AUTH_TOKEN_KEY,
      REFRESH_TOKEN_KEY,
      AUTH_STATE_KEY,
    ]);
    setAuthState({ authenticated: false, username: null, roles: null });
    clearInactivityTimer();
  };

  return (
    <AuthContext.Provider
      value={{ onLogin: login, onLogout: logout, authState }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Optional: Provide token access helpers for api.ts
export const getAuthToken = async () => {
  return await AsyncStorage.getItem(AUTH_TOKEN_KEY);
};
export const getRefreshToken = async () => {
  return await AsyncStorage.getItem(REFRESH_TOKEN_KEY);
};
