import React from 'react';

const ProfilePage = () => {
  const handleMentorClick = () => {
    window.location.href = './mentorprofile';
  };

  const handleMenteeClick = () => {
    window.location.href = './menteeprofile';
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="bg-white p-8 max-w-sm w-full sm:max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-blue-950 mb-2">

          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Select the type of profile you'd like to view
          </p>
        </div>

        <div className="space-y-6">
          <button
            onClick={handleMentorClick}
            className="w-full bg-blue-950 text-white py-3 px-6 rounded-full font-medium hover:bg-blue-900 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-950 focus:ring-offset-2 text-base sm:text-lg"
          >
            Mentor Profile
          </button>
          
          <button
            onClick={handleMenteeClick}
            className="w-full border-2 border-blue-950 text-blue-950 py-3 px-6 rounded-full font-medium hover:bg-blue-950 hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-950 focus:ring-offset-2 text-base sm:text-lg"
          >
            Mentee Profile
          </button>
        </div>

        <div className="mt-8 text-center">
          <p className="text-red-500 text-xs">
            This is for test purpose
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;