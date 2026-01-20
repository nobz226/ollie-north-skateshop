"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface AdminSession {
  adminId: string;
  username: string;
  timestamp: number;
}

export function useAdminAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [adminSession, setAdminSession] = useState<AdminSession | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check for admin session in localStorage
    const sessionData = localStorage.getItem("adminSession");
    
    if (!sessionData) {
      setIsAuthenticated(false);
      setIsLoading(false);
      return;
    }

    try {
      const session: AdminSession = JSON.parse(sessionData);
      
      // Check if session is less than 24 hours old
      const sessionAge = Date.now() - session.timestamp;
      const MAX_SESSION_AGE = 24 * 60 * 60 * 1000; // 24 hours
      
      if (sessionAge > MAX_SESSION_AGE) {
        // Session expired
        localStorage.removeItem("adminSession");
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }
      
      setAdminSession(session);
      setIsAuthenticated(true);
      setIsLoading(false);
    } catch (error) {
      console.error("Error parsing admin session:", error);
      localStorage.removeItem("adminSession");
      setIsAuthenticated(false);
      setIsLoading(false);
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("adminSession");
    setIsAuthenticated(false);
    setAdminSession(null);
    router.push("/admin/login");
  };

  const requireAuth = () => {
    if (!isLoading && !isAuthenticated) {
      router.push("/admin/login");
    }
  };

  return {
    isAuthenticated,
    isLoading,
    adminSession,
    logout,
    requireAuth,
  };
}