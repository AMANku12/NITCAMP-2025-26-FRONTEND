import React, { useState, useEffect } from 'react';
import { User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Choice = () => {
  const [selectedRole, setSelectedRole] = useState('');
  const navigate = useNavigate();

  // ✅ Ensure only logged-in users access this page
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      navigate('/'); // if not logged in, redirect to login
    }
  }, [navigate]);

  const handleRoleSelect = (role) => {

    if(role === "mentee") {
      const user = JSON.parse(localStorage.getItem("user"));
      console.log(user);
      if(!user.email.includes("@nitc.ac.in")) {
        alert("You are not a nitc student");
        return;
      }else{
        setSelectedRole(role);
        localStorage.setItem("selectedRole", role);
        console.log(`Selected role: ${role}`);
        navigate("/menteeregister");
      }
    }else if(role === "mentor") {
      const user = JSON.parse(localStorage.getItem("user"));
      if(user.email.includes("@nitc.ac.in")) {
        alert("Sorry nit c students can't be mentors");
        return;
      }else{
        setSelectedRole(role);
        localStorage.setItem("selectedRole", role);
        console.log(`Selected role: ${role}`);
        navigate("/mentoregister");
      }
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-2 sm:p-4">
      <div className="p-4 sm:p-8 w-full max-w-2xl">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-arial text-blue-950 mb-2">
            Please Select Your Role
          </h1>
        </div>

        <div className="flex flex-col sm:flex-row gap-8 justify-center items-center">
          {/* Mentee Option */}
          <div
            onClick={() => handleRoleSelect('mentee')}
            className={`
              group cursor-pointer transition-all duration-300 transform hover:scale-105 
              ${selectedRole === 'mentee' ? 'ring-4 ring-blue-300' : ''}
            `}
          >
            <div className="bg-white rounded-2xl p-4 sm:p-8 w-40 h-40 sm:w-48 sm:h-48 flex flex-col items-center justify-center shadow-lg hover:shadow-xl">
              <div className="bg-blue-50 rounded-full p-4 sm:p-6 shadow-md group-hover:shadow-lg mb-4">
                <User size={36} className="sm:text-[48px] text-blue-950" />
              </div>
              <h3 className="text-base sm:text-xl font-medium text-blue-950 text-center">Mentee</h3>
            </div>
          </div>

          {/* Mentor Option */}
          <div
            onClick={() => handleRoleSelect('mentor')}
            className={`
              group cursor-pointer transition-all duration-300 transform hover:scale-105 
              ${selectedRole === 'mentor' ? 'ring-4 ring-blue-300' : ''}
            `}
          >
            <div className="bg-white rounded-2xl p-4 sm:p-8 w-40 h-40 sm:w-48 sm:h-48 flex flex-col items-center justify-center shadow-lg hover:shadow-xl">
              <div className="bg-blue-950 rounded-full p-4 sm:p-6 shadow-md group-hover:shadow-lg mb-4">
                <User size={36} className="sm:text-[48px] text-white" />
              </div>
              <h3 className="text-base sm:text-xl font-medium text-blue-950 text-center">Mentor</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Choice;
