import React, { createContext, useContext, useEffect, useState } from "react";
import { useGetMe, useLogout } from "@workspace/api-client-react";
import { Student } from "@workspace/api-client-react";

interface AuthContextType {
  user: Student | null;
  isLoading: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data: user, isLoading, refetch } = useGetMe({
    query: {
      queryKey: ["me"],
      retry: false,
      staleTime: Infinity,
    },
  });

  const logoutMutation = useLogout();

  const handleLogout = async () => {
    await logoutMutation.mutateAsync();
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ user: user || null, isLoading, logout: handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
