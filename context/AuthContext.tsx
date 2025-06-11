import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { createContext, useContext, useEffect, useState } from "react";

export enum Role {
  ADMIN = "admin",
  USER = "user",
}

interface AuthProps {
  authState?: {
    // token: string | null;
    authenticated: boolean | null;
    role: Role | null;
  };
  onRegister?: (username: string, password: string) => Promise<any>;
  onLogin?: (
    username: string,
    password: string
    // client_id: number,
    // client_secret: string
  ) => Promise<any>;
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
    username: string | null;
    authenticated: boolean | null;
    role: Role | null;
  }>({ username: null, authenticated: null, role: null });

  useEffect(() => {
    // Simulate loading auth state from storage or API
    const initAuth = async () => {
      const storedState = await AsyncStorage.getItem("authState");
      if (storedState) {
        setAuthState(JSON.parse(storedState));
      } else {
        setAuthState({
          authenticated: false,
          username: null,
          role: null,
        });
      }
    };

    initAuth();
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const newState = {
        authenticated: true,
        username: username,
        role: username === "admin" ? Role.ADMIN : Role.USER,
      };
      setAuthState(newState);
      await AsyncStorage.setItem("authState", JSON.stringify(newState));

      return { success: true };
    } catch (e) {
      return {
        error: true,
        msg: (e as any).response?.data?.msg || "Unknown error",
      };
    }
  };

  const logout = async () => {
    setAuthState({
      authenticated: false,
      username: null,
      role: null,
    });
    await AsyncStorage.removeItem("authState");
  };

  const value = {
    // onRegister: register,
    onLogin: login,
    onLogout: logout,
    authState,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
