import React from 'react';
import logo from '../assets/logocircular.png';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const Login = () => {
  const navigate = useNavigate();

  const handleBypass = ()=>{
    const user = {
      fullname: "Guest User",
      email: "amanupadhyay986@gmail.com",
      role: "newuser",
      photo_url: "https://example.com/guest-photo.jpg",
      id: 1
    }
    localStorage.setItem("user", JSON.stringify(user));
    document.cookie = `token=guest_token; path=/;`;
    navigate("/choice");
    alert("Bypassed login as Guest User");
  }

  const handleSuccess = async (googleRes) => {
    console.log("✅ Google Credential Received:", googleRes.credential);
    try {
      const idToken = googleRes.credential;
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/googleauth`,
        { googletoken: idToken },
        { withCredentials: true }
      );

      const response = res.data;
      const { message, user, exist, role, roleData } = response;

      // do not put this feature now
      // if (message === "Account deactivated by the user") {
      //   console.log(" Account is deactivated");
      //   // TODO: Navigate to reactivation page
      //   // navigate("/activatemyaccount");
      //   return;
      // }

      if (message === "SUCCESS") {
        localStorage.setItem("user", JSON.stringify(user));

        if (exist) {
          switch (role) {
            case "newuser":
              alert("Login Successful: Please complete registration");
              navigate("/choice");
              break;
            case "admin":
              alert("Login Successful: Welcome, Admin");
              navigate("/adminpanel");
              break;
            case "mentor":
              localStorage.setItem("mentorData", JSON.stringify(roleData));
              alert("Login Successful: Welcome Mentor");
              navigate("/mentordashboard");
              break;
            case "mentee":
              localStorage.setItem("menteeData", JSON.stringify(roleData));
              alert("Login Successful: Welcome Mentee");
              navigate("/menteedashboard");
              break;
            default:
              alert("Unknown role. Contact support.");
          }
        } else {
          // First time login
          alert("Login Successful: Please choose your role");
          navigate("/choice");
        }
        
      } else if (message === "User login success but role data was not found") {
        localStorage.setItem("user", JSON.stringify(user));
        console.warn(" Role data missing. Treating user as new.");
        alert("Login Successful: Please choose your role");
        navigate("/choice");
      } else {
        throw new Error("Internal Server Error");
      }
    } catch (error) {
      console.error(" Error in login:", error);
      alert("Login failed: Internal server error");
    }
  };

  const handleError = (err) => {
    console.error(" Google login failed:", err);
    alert("Login failed. Please try again.");
    // TODO: Replace alert with custom UI notification
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-100 flex items-center justify-center p-2 sm:p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-blue-100 to-transparent rounded-full opacity-30 blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-gradient-to-tr from-gray-100 to-transparent rounded-full opacity-40 blur-2xl"></div>
      </div>

      <div className="relative bg-white rounded-2xl p-8 w-full max-w-md shadow-xl z-10">
        <div className="flex justify-center mb-6">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-800 rounded-full flex items-center justify-center overflow-hidden">
            <img
              src={logo}
              alt="NIT Calicut"
              className="w-10 h-10 sm:w-full sm:h-full object-contain rounded-full"
            />
          </div>
        </div>

        {/* Google login button */}


        <GoogleLogin onSuccess={handleSuccess} onError={handleError} />
      
      </div>
    </div>
  );
};

export default Login;
