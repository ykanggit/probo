import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { buildEndpoint } from "@/utils";

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  checkAuth: () => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  const checkAuth = async (): Promise<boolean> => {
    try {
      // Make a request to an endpoint that requires authentication
      const response = await fetch(buildEndpoint("/console/v1/query"), {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          operationName: "CheckAuth",
          query: `query CheckAuth { viewer { id } }`,
          variables: {},
        }),
      });

      const authenticated =
        response.ok && !response.headers.get("WWW-Authenticate");
      setIsAuthenticated(authenticated);
      return authenticated;
    } catch (error) {
      setIsAuthenticated(false);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await fetch(buildEndpoint("/console/v1/auth/logout"), {
        method: "POST",
        credentials: "include",
      });
    } finally {
      setIsAuthenticated(false);
      navigate("/login");
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, isLoading, checkAuth, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
