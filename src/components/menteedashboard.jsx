import React, { useState } from "react";
import axios from "axios";

const MenteeDashboard = () => {
  const [mentor, setMentor] = useState(null);
  const [message, setMessage] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const handleGetAssignedMentees = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/getmymentors`, {
        withCredentials: true,
      });
      const data = res.data;
      if (data.message === "FAILED") {
        setMessage("You have not been assigned a mentor yet.");
        setMentor(null);
      } else if (data.message === "SUCCESS") {
        setMentor(data.mentor);
        setMessage(null);
        setShowDetails(false);
      }
    } catch (error) {
      console.error("Error fetching assigned mentor:", error);
      setMessage("Failed to fetch assigned mentor. Please try again.");
      setMentor(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-2 sm:p-0">
      <div className="w-full py-8 sm:py-12">
        <div className="text-center mb-12">
          <h1 className="text-xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Welcome, Mentee!
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-yellow-400 to-blue-500 mx-auto mb-6"></div>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Thank you for joining the{' '}
            <span className="font-semibold text-blue-600">
              NIT Calicut Alumni Mentoring Programme
            </span>
            . Your registration has been successfully completed. Use this dashboard to view your assigned mentor and get started on your mentoring journey!
          </p>
        </div>

        <div className="flex justify-center mb-12">
          <button
            onClick={handleGetAssignedMentees}
            className="px-3 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-semibold rounded-lg shadow-md hover:from-indigo-700 hover:to-blue-700 transition-all duration-300 text-xs sm:text-base"
          >
            Get My Assigned Mentor
          </button>
        </div>

        {message && (
          <p className="text-center text-red-500 mb-4">{message}</p>
        )}

        {/* Mentor Card if assigned */}
        {mentor && (
          <div
            className="bg-white rounded-lg shadow-lg p-3 sm:p-5 cursor-pointer hover:shadow-xl transition duration-200 max-w-md mx-auto text-xs sm:text-base"
            onClick={() => setShowDetails(!showDetails)}
          >
            <div className="flex items-center mb-4">
              {mentor.user.photo_url ? (
                <img
                  src={mentor.user.photo_url}
                  alt={mentor.user.fullname}
                  className="w-8 h-8 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-indigo-200"
                />
              ) : (
                <div className="w-8 h-8 sm:w-12 sm:h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-xs sm:text-lg">
                  {mentor.user.fullname.charAt(0).toUpperCase()}
                </div>
              )}
              <h2 className="ml-2 sm:ml-4 text-base sm:text-xl font-semibold text-gray-800">
                {mentor.user.fullname}
              </h2>
            </div>
            <p className="text-gray-600">
              <span className="font-medium">Broad Areas:</span>{" "}
              {mentor.broad_area_of_expertise?.join(", ") || "Not specified"}
            </p>
            <p className="text-gray-600">
              <span className="font-medium">Narrow Areas:</span>{" "}
              {mentor.narrow_area_of_expertise?.join(", ") || "Not specified"}
            </p>
            {showDetails && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-gray-700">
                  <span className="font-medium">Email:</span>{" "}
                  <a
                    href={`mailto:${mentor.user.email}`}
                    className="text-indigo-600 hover:underline"
                  >
                    {mentor.user.email}
                  </a>
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">Phone:</span>{" "}
                  {mentor.phone_no || "Not provided"}
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">Year Graduated:</span>{" "}
                  {mentor.year_graduated || "Not specified"}
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">Highest Degree at NITC:</span>{" "}
                  {mentor.highest_degree_at_nitc || "Not specified"}
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">Department:</span>{" "}
                  {mentor.department || "Not specified"}
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">Mentoring Type:</span>{" "}
                  {mentor.mentoring_type || "Not specified"}
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">Mentee Capacity:</span>{" "}
                  {mentor.mentee_capacity || "Not specified"}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Welcome/Info Section if no mentor assigned */}
        {!mentor && (
          <>
            
            <div className="text-center mt-16">
              <p className="text-lg text-gray-500 font-light italic">
                We look forward to your journey with our mentoring community.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MenteeDashboard;