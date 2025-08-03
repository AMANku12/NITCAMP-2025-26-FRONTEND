// src/components/Navbar.jsx
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Home } from "lucide-react";
import logo from "../assets/logo2.png";
import axios from "axios";
              
const NAV_ITEMS = [
  { name: "Home", path: "/", icon: Home, showWhenLoggedOut: true },
  { name: "Dashboard", path: "/dashboard", showWhenLoggedOut: false },
  { name: "About Us", path: "/about", showWhenLoggedOut: true },
];

const ANIMATION_VARIANTS = {
  navbar: {
    initial: { y: -60, opacity: 0 },
    animate: { y: 0, opacity: 1, transition: { duration: 0.4, ease: "easeOut" } },
  },
  menu: {
    open: { opacity: 1, height: "auto", transition: { duration: 0.3, ease: "easeInOut" } },
    closed: { opacity: 0, height: 0, transition: { duration: 0.3, ease: "easeInOut" } },
  },
  menuItem: {
    open: { x: 0, opacity: 1 },
    closed: { x: -30, opacity: 0 },
  },
};

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  const refreshUser = useCallback(() => {
    const raw = localStorage.getItem("user");
    if (raw) {
      setUser(JSON.parse(raw));
      setIsLoggedIn(true);
    } else {
      setUser(null);
      setIsLoggedIn(false);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    refreshUser();
    const onStorage = (e) => {
      if (e.key === "user") refreshUser();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [location.pathname, refreshUser]);

  const handleLogout = useCallback(async () => {
    await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/logout`, {}, { withCredentials: true });
    localStorage.removeItem("user");
    localStorage.removeItem("menteeData");
    localStorage.removeItem("mentorData");
    localStorage.removeItem("admin");
    setIsLoggedIn(false);
    setUser(null);
    alert("Logout successful");
    navigate("/");
    // navigate("/login");
  }, [navigate]);

  const handleDashboard = useCallback(() => {
    if(user.role === "mentor"){
      navigate("/mentordashboard");
    }else{
      navigate("/menteedashboard");
    }
  }, [navigate, user]);

  const filteredNav = useMemo(() => {
    if (isLoading) return [];
    return NAV_ITEMS.filter(item =>
      isLoggedIn ? !item.showWhenLoggedOut : item.showWhenLoggedOut
    );
  }, [isLoggedIn, isLoading]);

  if (isLoading) {
    return <div className="fixed top-0 left-0 right-0 bg-blue-900 h-20 animate-pulse" />;
  }

  return (
    <>
      <motion.nav {...ANIMATION_VARIANTS.navbar}
        className="fixed w-full bg-blue-950/95 backdrop-blur-md z-50 border-b border-blue-800"
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link to="/" className="flex items-center" aria-label="Home">
              <img src={logo} alt="Logo" className="h-12 w-auto" />
            </Link>

            <div className="flex items-center space-x-8">
              {isLoggedIn && user ? (
                <div className="relative flex items-center gap-4">
                  {["mentor", "mentee"].includes(user.role) && (
                    <button
                      onClick={handleDashboard}
                      className="px-5 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-full shadow-md hover:from-blue-600 hover:to-indigo-700 hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                      Dashboard
                    </button>
                  )}
                  {/* Register link for newuser */}
                  {user.role === "newuser" && (
                    <Link
                      to="/choice"
                      className="px-5 py-2 bg-gradient-to-r from-green-500 to-blue-500 text-white font-semibold rounded-full shadow-md hover:from-green-600 hover:to-blue-700 hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-400"
                    >
                      Register
                    </Link>
                  )}
                  <button
                    onClick={() => setDropdownOpen(o => !o)}
                    className="flex items-center gap-2 px-3 py-2 text-blue-100 hover:text-white transition-colors duration-200"
                  >
                    <img
                      src={user.photo_url}
                      alt={user.fullname}
                      className="w-8 h-8 rounded-full object-cover border-2 border-blue-300"
                    />
                    <span>{user.fullname.split(" ")[0]}</span>
                  </button>
                  <AnimatePresence>
                    {dropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute left-0 right-0 top-full mt-2 w-44 bg-white rounded-lg shadow-lg z-50"
                        style={{ minWidth: '11rem' }}
                      >
                        <ul>
                          {["mentor", "mentee"].includes(user.role) && (
                            <li>
                              <Link
                                to={user.role === "mentor" ? "/mentorprofile" : "/menteeprofile"}
                                className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-800 transition-colors duration-200"
                              >
                                Profile
                              </Link>
                            </li>
                          )}
                          <li>
                            <button
                              onClick={handleLogout}
                              className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition-colors duration-200"
                            >
                              Logout
                            </button>
                          </li>
                        </ul>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <>
                  {filteredNav.map(item => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`relative px-4 py-2 text-sm font-medium transition-colors duration-200 group ${
                        location.pathname === item.path
                          ? "text-white"
                          : "text-blue-100 hover:text-white"
                      }`}
                    >
                      {item.name}
                      {/* Active underline */}
                      {location.pathname === item.path && (
                        <motion.div
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-white"
                          layoutId="activeTab"
                          initial={false}
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        />
                      )}
                      {/* Hover underline */}
                      {location.pathname !== item.path && (
                        <div className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-white group-hover:w-full group-hover:left-0 transition-all duration-300 ease-out" />
                      )}
                    </Link>
                  ))}
                  <Link
                    to="/login"
                    className="relative px-4 py-2 text-white font-medium transition-colors duration-200 group"
                  >
                    Login
                    <div className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-white group-hover:w-full group-hover:left-0 transition-all duration-300 ease-out" />
                  </Link>
                </>
              )}
            </div>

            <button
              onClick={() => setMenuOpen(o => !o)}
              className="md:hidden p-2 text-white"
              aria-label="Toggle menu"
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial="closed"
              animate="open"
              exit="closed"
              variants={ANIMATION_VARIANTS.menu}
              className="md:hidden bg-blue-900/95 backdrop-blur-md border-t border-blue-800"
            >
              <div className="px-4 py-4 space-y-2">
                {isLoggedIn && user && (
                  <div className="flex items-center gap-3 px-4 py-2 border-b border-blue-800 mb-2">
                    <img
                      src={user.photo_url}
                      alt={user.fullname}
                      className="w-10 h-10 rounded-full object-cover border-2 border-blue-300"
                    />
                    <span className="text-white font-medium">{user.fullname}</span>
                  </div>
                )}
                {filteredNav.map((item, i) => (
                  <motion.div key={item.path} variants={ANIMATION_VARIANTS.menuItem} transition={{ delay: i * 0.05 }}>
                    <Link
                      to={item.path}
                      onClick={() => setMenuOpen(false)}
                      className={`relative flex items-center gap-2 px-4 py-3 text-base font-medium transition-colors duration-200 group ${
                        location.pathname === item.path
                          ? "text-white"
                          : "text-blue-100 hover:text-white"
                      }`}
                    >
                      {item.name}
                      {/* Active underline for mobile */}
                      {location.pathname === item.path && (
                        <motion.div
                          className="absolute bottom-1 left-4 right-4 h-0.5 bg-white"
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          transition={{ duration: 0.3 }}
                        />
                      )}
                      {/* Hover underline for mobile */}
                      {location.pathname !== item.path && (
                        <div className="absolute bottom-1 left-1/2 w-0 h-0.5 bg-white group-hover:w-3/4 group-hover:left-4 transition-all duration-300 ease-out" />
                      )}
                    </Link>
                  </motion.div>
                ))}
                {/* Register link for newuser in mobile menu */}
                {isLoggedIn && user && user.role === "newuser" && (
                  <motion.div variants={ANIMATION_VARIANTS.menuItem} transition={{ delay: (filteredNav.length) * 0.05 }}>
                    <Link
                      to="/choice"
                      onClick={() => setMenuOpen(false)}
                      className="relative block px-4 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white font-semibold rounded-full shadow-md hover:from-green-600 hover:to-blue-700 hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-400"
                    >
                      Register
                    </Link>
                  </motion.div>
                )}
                {isLoggedIn && (
                  <>
                    {["mentor", "mentee"].includes(user.role) && (
                      <motion.div variants={ANIMATION_VARIANTS.menuItem} transition={{ delay: (filteredNav.length + 1) * 0.05 }}>
                        <Link
                          to={user.role === "mentor" ? "/mentorprofile" : "/menteeprofile"}
                          onClick={() => setMenuOpen(false)}
                          className="relative block px-4 py-3 text-blue-100 hover:text-white transition-colors duration-200 group"
                        >
                          Profile
                          <div className="absolute bottom-1 left-1/2 w-0 h-0.5 bg-white group-hover:w-3/4 group-hover:left-4 transition-all duration-300 ease-out" />
                        </Link>
                      </motion.div>
                    )}
                    <motion.div variants={ANIMATION_VARIANTS.menuItem} transition={{ delay: (filteredNav.length + 2) * 0.05 }}>
                      <button
                        onClick={handleLogout}
                        className="relative w-full text-left px-4 py-3 text-red-400 hover:text-red-300 transition-colors duration-200 group"
                      >
                        Logout
                        <div className="absolute bottom-1 left-1/2 w-0 h-0.5 bg-red-400 group-hover:w-3/4 group-hover:left-4 transition-all duration-300 ease-out" />
                      </button>
                    </motion.div>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
      <div className="h-20" />
    </>
  );
}