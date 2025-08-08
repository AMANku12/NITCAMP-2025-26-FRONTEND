// src/components/PrivateRoute.jsx
import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import axios from "axios";

const PrivateRoute = ({ allowedRoles = [] }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;

  useEffect(() => {
    const verifySession = async () => {
      // If bypassing session check, only verify if user data exists in localStorage
      if(import.meta.env.VITE_BYPASS_SESSION_CHECK === "true") {
        console.log(import.meta.env.VITE_BYPASS_SESSION_CHECK);
        console.warn("Bypassing session check as per environment variable.");
        if (user && user.email) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
        return;
      }

      // If no user data in localStorage, don't bother with backend verification
      if (!user || !user.email) {
        setIsAuthenticated(false);
        return;
      }

      try {
        // Verify session with backend
        await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/verify-session`, {
          withCredentials: true,
        });
        console.log("Session verified successfully.");
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Session verification failed:", error);
        setIsAuthenticated(false);
        // Only clear localStorage if the session is actually invalid
        if (error.response?.status === 401 || error.response?.status === 403) {
          localStorage.removeItem("user");
          localStorage.removeItem("menteeData");
          localStorage.removeItem("mentorData");
          localStorage.removeItem("admin");
        }
      }
    };
    verifySession();
  }, [user]);

  if (isAuthenticated === null) {
    return <div>Loading...</div>; // Or a loading spinner
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;