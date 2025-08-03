import React from 'react';
import logo from '../assets/logocircular.png';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { Link } from 'react-router-dom'; // assuming you're using React Router

const Home = () => {
  const handleSuccess = async (googleRes) => {
    console.log(googleRes.credential);
    try {
      const idToken = googleRes.credential;
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/google`, { googletoken: idToken });
      alert("Login successful");
      console.log(res);
    } catch (error) {
      console.log("Error in login", error);
    }
  };

  const handleError = (err) => {
    console.log("Error in login", err);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-100 flex items-center justify-center p-2 sm:p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-blue-100 to-transparent rounded-full opacity-30 blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-gradient-to-tr from-gray-100 to-transparent rounded-full opacity-40 blur-2xl"></div>
      </div>

      {/* Main content card */}
      <div className="relative bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="flex justify-center mb-6">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-800 rounded-full flex items-center justify-center">
            <img src={logo} alt="NIT Calicut" className="w-10 h-10 sm:w-14 sm:h-14 object-contain" />
          </div>
        </div>
       
        {/* Google login button */}
        <GoogleLogin  onSuccess={handleSuccess} onError={handleError} />
      
        {/* Text links below */}
        <div className="mt-6 text-center text-sm text-gray-500 space-y-2">
          <p>
            <Link to="/forgot-password" className="text-blue-600 hover:underline text-xs sm:text-sm">
              Forgot password?
            </Link>
          </p>
          <p>
            <Link to="/register" className="text-blue-600 hover:underline text-xs sm:text-sm">
              New user? Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
