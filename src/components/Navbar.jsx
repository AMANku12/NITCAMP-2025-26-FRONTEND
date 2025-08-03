import { useState, useEffect, useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Home, Menu, X } from "lucide-react";

// Animation variants for the mobile menu
const ANIMATION_VARIANTS = {
  menu: {
    closed: { opacity: 0, height: 0 },
    open: { opacity: 1, height: "auto" },
  },
  menuItem: {
    closed: { opacity: 0, y: -10 },
    open: { opacity: 1, y: 0 },
  },
};

// Navigation items (excluding Dashboard)
const NAV_ITEMS = [
  { name: "Home", path: "/", icon: Home, showWhenLoggedOut: true },
  { name: "About Us", path: "/about", showWhenLoggedOut: true },
];

const Navbar = ({ isLoggedIn, user, isLoading, handleLogout }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Filter navigation items based on login status
  const filteredNav = useMemo(() => {
    if (isLoading) return [];
    return NAV_ITEMS.filter((item) =>
      isLoggedIn ? !item.showWhenLoggedOut : item.showWhenLoggedOut
    );
  }, [isLoggedIn, isLoading]);

  // Handle dashboard navigation
  const handleDashboard = () => {
    if (user.role === "mentor") {
      navigate("/mentordashboard");
    } else {
      navigate("/menteedashboard");
    }
  };

  return (
    <nav className="bg-blue-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-2xl font-bold">
              MyApp
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {filteredNav.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 text-sm font-medium ${
                  location.pathname === item.path
                    ? "text-white border-b-2 border-white"
                    : "text-blue-100 hover:text-white"
                }`}
              >
                {item.name}
              </Link>
            ))}
            {isLoggedIn && user ? (
              <div className="flex items-center gap-4">
                {["mentor", "mentee"].includes(user.role) && (
                  <button
                    onClick={handleDashboard}
                    className="px-4 py-2 text-white font-medium hover:bg-blue-800 rounded"
                  >
                    Dashboard
                  </button>
                )}
                {user.role === "newuser" && (
                  <Link
                    to="/choice"
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    Register
                  </Link>
                )}
                <span>{user.fullname.split(" ")[0]}</span>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-red-400 hover:text-red-300"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 text-white font-medium hover:bg-blue-800 rounded"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-white focus:outline-none"
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
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
                  <span className="text-white font-medium">
                    {user.fullname.split(" ")[0]}
                  </span>
                </div>
              )}

              {isLoggedIn && ["mentor", "mentee"].includes(user.role) && (
                <motion.div
                  variants={ANIMATION_VARIANTS.menuItem}
                  transition={{ delay: 0 }}
                >
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      handleDashboard();
                    }}
                    className="relative block px-4 py-3 text-blue-100 hover:text-white transition-colors duration-200 group"
                  >
                    Dashboard
                    <div className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-white group-hover:w-full group-hover:left-0 transition-all duration-300 ease-out" />
                  </button>
                </motion.div>
              )}

              {!isLoggedIn &&
                filteredNav.map((item, i) => (
                  <motion.div
                    key={item.path}
                    variants={ANIMATION_VARIANTS.menuItem}
                    transition={{ delay: i * 0.05 }}
                  >
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
                      {location.pathname === item.path ? (
                        <motion.div
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-white"
                          initial={false}
                          transition={{
                            type: "spring",
                            stiffness: 500,
                            damping: 30,
                          }}
                        />
                      ) : (
                        <div className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-white group-hover:w-full group-hover:left-0 transition-all duration-300 ease-out" />
                      )}
                    </Link>
                  </motion.div>
                ))}

              {!isLoggedIn && (
                <motion.div
                  variants={ANIMATION_VARIANTS.menuItem}
                  transition={{ delay: filteredNav.length * 0.05 }}
                >
                  <Link
                    to="/login"
                    onClick={() => setMenuOpen(false)}
                    className="relative block px-4 py-3 text-blue-100 hover:text-white transition-colors duration-200 group"
                  >
                    Login
                    <div className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-white group-hover:w-full group-hover:left-0 transition-all duration-300 ease-out" />
                  </Link>
                </motion.div>
              )}

              {isLoggedIn && user && user.role === "newuser" && (
                <motion.div
                  variants={ANIMATION_VARIANTS.menuItem}
                  transition={{
                    delay: ["mentor", "mentee"].includes(user.role) ? 1 : 0 * 0.05,
                  }}
                >
                  <Link
                    to="/choice"
                    onClick={() => setMenuOpen(false)}
                    className="relative block px-4 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white font-semibold rounded-full shadow-md hover:from-green-600 hover:to-blue-700 hover:scale-105 transition-all duration-200"
                  >
                    Register
                  </Link>
                </motion.div>
              )}

              {isLoggedIn && ["mentor", "mentee"].includes(user.role) && (
                <motion.div
                  variants={ANIMATION_VARIANTS.menuItem}
                  transition={{ delay: 1 * 0.05 }}
                >
                  <Link
                    to={
                      user.role === "mentor" ? "/mentorprofile" : "/menteeprofile"
                    }
                    onClick={() => setMenuOpen(false)}
                    className="relative block px-4 py-3 text-blue-100 hover:text-white transition-colors duration-200 group"
                  >
                    Profile
                    <div className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-white group-hover:w-full group-hover:left-0 transition-all duration-300 ease-out" />
                  </Link>
                </motion.div>
              )}

              {isLoggedIn && (
                <motion.div
                  variants={ANIMATION_VARIANTS.menuItem}
                  transition={{
                    delay: ["mentor", "mentee"].includes(user.role) ? 2 : 1 * 0.05,
                  }}
                >
                  <button
                    onClick={handleLogout}
                    className="relative w-full text-left px-4 py-3 text-red-400 hover:text-red-300 transition-colors duration-200 group"
                  >
                    Logout
                    <div className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-red-400 group-hover:w-full group-hover:left-0 transition-all duration-300 ease-out" />
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;