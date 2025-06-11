// context/AuthContext.tsx

import React, { createContext, useContext, useState, useEffect } from "react";
import { users } from "@/constants/users";

interface AuthState {
  authenticated: boolean | null;
  user: string | null;
  roles: string[];
}

interface AuthContextType {
  authState: AuthState;
  login: (username: string, password: string) => Promise<boolean>;
  onLogout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>({
    authenticated: null,
    user: null,
    roles: [],
  });

  useEffect(() => {
    // Example: load from storage if needed
    setAuthState({
      authenticated: false,
      user: null,
      roles: [],
    });
  }, []);

  const login = async (username: string, password: string) => {
    const foundUser = users.find(
      (u) => u.username === username && u.password === password
    );

    if (foundUser) {
      setAuthState({
        authenticated: true,
        user: foundUser.username,
        roles: foundUser.roles,
      });
      return true;
    } else {
      setAuthState({
        authenticated: false,
        user: null,
        roles: [],
      });
      return false;
    }
  };

  const onLogout = () => {
    setAuthState({
      authenticated: false,
      user: null,
      roles: [],
    });
  };

  return (
    <AuthContext.Provider value={{ authState, login, onLogout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
