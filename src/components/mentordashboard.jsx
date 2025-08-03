import React, { useState } from "react";
import axios from "axios";

const MentorDashboard = () => {
  const [mentees, setMentees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasFetched, setHasFetched] = useState(false);
  const [expandedMenteeId, setExpandedMenteeId] = useState(null);

  const handleGetAssignedMentees = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/getmymentees`, {
        withCredentials: true,
      });
      const data = res.data;
      if (data.message === "FAILED") {
        setMentees([]);
        setError("You have not been assigned any mentees yet. We'll notify you once mentees are assigned.");
      } else if (data.message === "SUCCESS") {
        setMentees(data.mentees);
      }
      setHasFetched(true);
    } catch (error) {
      console.error("Error fetching assigned mentees:", error);
      setError("Failed to fetch assigned mentees. Please try again later.");
      setHasFetched(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-12">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Welcome, Mentor!
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-yellow-400 mx-auto mb-6"></div>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Thank you for joining the{" "}
            <span className="font-semibold text-blue-600">
              NIT Calicut Alumni Mentoring Programme
            </span>
            . Your expertise will guide the next generation of engineers. Use this
            dashboard to view your assigned mentees and start making an impact!
          </p>
        </div>

        {/* Action Section */}
        <div className="flex justify-center mb-12">
          <button
            onClick={handleGetAssignedMentees}
            disabled={loading}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg shadow-md hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Loading..." : "View My Assigned Mentees"}
          </button>
        </div>

        {/* Mentees Display */}
        <div className="max-w-5xl mx-auto">
          {loading && (
            <div className="flex justify-center items-center">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
          {!loading && hasFetched && error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg text-center">
              {error}
            </div>
          )}
          {!loading && hasFetched && !error && mentees.length === 0 && (
            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-lg text-center">
              No mentees assigned yet. Check back later or contact the program
              coordinator.
            </div>
          )}
          {!loading && hasFetched && !error && mentees.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {mentees.map((mentee) => (
                <div
                  key={mentee.id}
                  className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer border border-gray-200"
                  onClick={() => setExpandedMenteeId(expandedMenteeId === mentee.id ? null : mentee.id)}
                >
                  <div className="flex items-center mb-4">
                    {mentee.user.photo_url ? (
                      <img
                        src={mentee.user.photo_url}
                        alt={mentee.user.fullname}
                        className="w-12 h-12 rounded-full object-cover border-2 border-blue-200"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-lg">
                        {mentee.user.fullname.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <h3 className="ml-4 text-xl font-semibold text-gray-800">
                      {mentee.user.fullname}
                    </h3>
                  </div>
                     <p className="text-gray-600 mb-2">
                       <span className="font-medium">Broad Areas:</span> {mentee.broad_area_of_interest?.join(", ") || "Not specified"}
                  </p>
                     <p className="text-gray-600">
                       <span className="font-medium">Narrow Areas:</span> {mentee.narrow_area_of_interest?.join(", ") || "Not specified"}
                  </p>
                  {expandedMenteeId === mentee.id && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-gray-700">
                        <span className="font-medium">Email:</span>{" "}
                        <a
                          href={`mailto:${mentee.user.email}`}
                          className="text-indigo-600 hover:underline"
                        >
                          {mentee.user.email}
                        </a>
                      </p>
                      <p className="text-gray-700">
                        <span className="font-medium">Personal Email:</span>{" "}
                        <a
                          href={`mailto:${mentee.personal_email}`}
                          className="text-indigo-600 hover:underline"
                        >
                          {mentee.personal_email}
                        </a>
                      </p>
                      <p className="text-gray-700">
                        <span className="font-medium">Phone:</span>{" "}
                        {mentee.phone_no || "Not provided"}
                      </p>
                      <p className="text-gray-700">
                        <span className="font-medium">Roll No:</span>{" "}
                        {mentee.roll_no || "Not specified"}
                      </p>
                      <p className="text-gray-700">
                        <span className="font-medium">Year of Admission:</span>{" "}
                        {mentee.year_of_admission || "Not specified"}
                      </p>
                      <p className="text-gray-700">
                        <span className="font-medium">Degree:</span>{" "}
                        {mentee.degree || "Not specified"}
                      </p>
                      <p className="text-gray-700">
                        <span className="font-medium">Branch:</span>{" "}
                        {mentee.branch || "Not specified"}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Additional Info */}
        <div className="mt-12 text-center">
          <p className="text-gray-500 italic">
            Your role as a mentor is crucial in shaping future leaders. Check your
            email for program updates and mentoring guidelines.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MentorDashboard;