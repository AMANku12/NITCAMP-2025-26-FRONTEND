import React, { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";

// Components & Pages
import Homepage from "./components/Homepage";
import Home from "./components/Home";
import Navbar from "./components/Navbar";
import Footer from "./components/footer";
// import Events from "./components/Events";
import Menteeprofile from "./components/menteeprofile.jsx";
import About from "./components/about.jsx";
import Choice from "./components/Choice.jsx";
import Login from "./components/login.jsx";
import MenteeRegistrationForm from "./components/menteeregister.jsx";
import MentorRegistrationForm from "./components/mentoregister.jsx";
import MenteeinterestsForm from "./components/menteeinterests.jsx";
import MentorinterestsForm from "./components/mentorinterests.jsx";
import Adminlogin from "./components/adminlogin.jsx";
import AdminPanel from "./components/adminpanel.jsx";
import Profile from "./components/profile.jsx";
import Mentorprofile from "./components/mentorprofile.jsx";
import MenteeDashboard from "./components/menteedashboard.jsx";
import MentorDashboard from "./components/mentordashboard.jsx";
import MentorWelcomePage from "./components/mentorwelcomepage.jsx";
import MenteeWelcomePage from "./components/menteewelcomepage.jsx";
import Matchmaking from "./components/matching/matchmaking.jsx";
import MatchingDashboard from "./components/matching/matchingdashboard.jsx";




// Placeholder pages
// const About = () => <div className="p-6">About Page (Coming soon)</div>;
// const Login = () => <div className="p-6">Login Page (Coming soon)</div>;

const App = () => {
  const location = useLocation();

  useEffect(() => {
    const verifySession = async () => {
      try {
        await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/verify-session`, {
          withCredentials: true,
        });
      } catch (error) {
        console.error("Session invalid, clearing local storage");
        localStorage.removeItem("user");
        localStorage.removeItem("menteeData");
        localStorage.removeItem("mentorData");
        localStorage.removeItem("admin");
      }
    };
    verifySession();
  }, []);
  
  // Check if we're on the /adminpge - if yes, hide the navbar
  const hideNavbarPaths = ["/home", "/adminpanel", "/adminlogin"];
  const shouldHideNavbar = hideNavbarPaths.includes(location.pathname);
  return (
    <>
      {/* Show navbar on all pages EXCEPT /home page */}
      {!shouldHideNavbar && <Navbar />}
      
      <main className="min-h-[80vh] pt-0 ">
        <Routes>
          {/* Public Routes */}
          <Route path="/home" element={<Home />} />
          <Route path="/" element={<Homepage />} />
          <Route path="/about" element={<About />} />
          <Route path="/adminlogin" element={< Adminlogin/>} />
          <Route path="/login" element={<Login />} />
          
          {/* Protected Routes */}
          <Route element={<PrivateRoute />}>
            <Route path="/choice" element={<Choice />} />
            <Route path="/menteeregister" element={<MenteeRegistrationForm/>} />
            <Route path="/menteeinterests" element={< MenteeinterestsForm/>} />
            <Route path="/mentoregister" element={<MentorRegistrationForm/>} />
            <Route path="/mentorinterests" element={< MentorinterestsForm/>} />
          </Route>
          
          <Route element={<PrivateRoute allowedRoles={["mentee"]} />}>
            <Route path="/menteeprofile" element={<Menteeprofile />} />
            <Route path="/menteedashboard" element={<MenteeDashboard />} />
            <Route path="/menteewelcomepage" element={<MenteeWelcomePage />} />
          </Route>
          
          <Route element={<PrivateRoute allowedRoles={["mentor"]} />}>
            <Route path="/mentorprofile" element={<Mentorprofile />} />
            <Route path="/mentordashboard" element={<MentorDashboard />} />
            <Route path="/mentorwelcomepage" element={<MentorWelcomePage />} />
          </Route>

          <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
            <Route path="/adminpanel" element={<AdminPanel />} />
          </Route>

          <Route element={<PrivateRoute allowedRoles={["mentor", "mentee"]} />}>
            <Route path="/profile" element={<Profile />} />
          </Route>
          
          
          
          <Route path="/matching" element={< MentorinterestsForm/>} />
          
          
        </Routes>
      </main>
      <Footer />
    </>
  );
};

export default App;
