// src/components/PrivateRoute.jsx
import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import axios from "axios";

const PrivateRoute = ({ allowedRoles = [] }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    const verifySession = async () => {
      try {
        // Verify session with backend
        await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/verify-session`, {
          withCredentials: true,
        });
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Session verification failed:", error);
        setIsAuthenticated(false);
        localStorage.removeItem("user");
        localStorage.removeItem("menteeData");
        localStorage.removeItem("mentorData");
        localStorage.removeItem("admin");
      }
    };
    verifySession();
  }, []);

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