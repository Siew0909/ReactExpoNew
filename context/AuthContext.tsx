import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { createContext, useContext, useEffect, useState } from "react";
import { Role, loginAccounts, persons } from "@/constants/persons";
interface AuthProps {
  authState?: {
    // token: string | null;
    authenticated: boolean | null;
    roles: Role[] | null;
    username: string | null;
    fullname?: string;
    email?: string;
    contact?: string;
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
const router = useRouter();

const AuthContext = createContext<AuthProps>({});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }: any) => {
  const [authState, setAuthState] = useState<{
    username: string | null;
    authenticated: boolean | null;
    roles: Role[] | null;
    fullname?: string;
    email?: string;
    contact?: string;

  }>({ username: null, authenticated: null, roles: null });

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
          roles: null,
        });
      }
    };

    initAuth();
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const user = loginAccounts.find(
        (u) => u.username === username && u.password === password
      );

      if (!user) {
        return { error: true, msg: "Invalid credentials" };
      }
      const person = persons.find((p) => p.id === user.personId);

      const newState = {
        authenticated: true,
        username: username,
        roles: user.roles as Role[],
        fullname: person?.fullname,
        email: person?.email,
        contact: person?.contact_no,
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
      roles: null,
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
