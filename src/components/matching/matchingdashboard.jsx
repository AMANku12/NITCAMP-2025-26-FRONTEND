import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function MatchingDashboard() {
  const navigate = useNavigate();
  const [view, setView] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [matchedUsers, setMatchedUsers] = useState([]);
  const [unmatchedMentees, setUnmatchedMentees] = useState([]);
  const [unmatchedMentors, setUnmatchedMentors] = useState([]);

  const getMatchedUsers = async () => {
    setIsLoading(true);
    setView('matchedUsers');
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/admin/getmatchedusers`, { withCredentials: true });
      if (res.status === 200) {
        const { matchedUsers } = res.data;
        setMatchedUsers(matchedUsers);
      }
    } catch (error) {
      console.log(error);
      if (error.response?.data?.error === "No matched users") {
        setMatchedUsers([]);
        alert("No matched users found");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getUnmatchedMentees = async () => {
    setIsLoading(true);
    setView('unmatchedMentees');
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/admin/getunmatchedmentees`, { withCredentials: true });
      if (res.status === 200) {
        const { unmatchedMentees } = res.data;
        setUnmatchedMentees(unmatchedMentees);
      }
    } catch (error) {
      console.log(error);
      if (error.response?.data?.error === "No unmatched mentees found") {
        setUnmatchedMentees([]);
        alert("No unmatched mentees found");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getUnmatchedMentors = async () => {
    setIsLoading(true);
    setView('unmatchedMentors');
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/admin/getunmatchedmentors`, { withCredentials: true });
      if (res.status === 200) {
        const { unmatchedMentors } = res.data;
        setUnmatchedMentors(unmatchedMentors);
      }
    } catch (error) {
      console.log(error);
      if (error.response?.data?.error === "No unmatched mentors found") {
        setUnmatchedMentors([]);
        alert("No unmatched mentors found");
      }
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="text-white p-2 sm:p-4 md:p-8 bg-black min-h-screen">
      <h1 className="text-lg sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6">Matching Dashboard</h1>
      
      {/* Buttons */}
      <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-4 mb-6 sm:mb-8">
        <button
          onClick={getMatchedUsers}
          className="px-4 sm:px-6 py-2 sm:py-3 bg-white text-black rounded-xl font-semibold text-xs sm:text-base md:text-lg hover:bg-gray-200 transition-colors duration-200"
        >
          Matched Users
        </button>
        <button
          onClick={getUnmatchedMentees}
          className="px-4 sm:px-6 py-2 sm:py-3 bg-white text-black rounded-xl font-semibold text-xs sm:text-base md:text-lg hover:bg-gray-200 transition-colors duration-200"
        >
          Unmatched Mentees
        </button>
        <button
          onClick={getUnmatchedMentors}
          className="px-4 sm:px-6 py-2 sm:py-3 bg-white text-black rounded-xl font-semibold text-xs sm:text-base md:text-lg hover:bg-gray-200 transition-colors duration-200"
        >
          Unmatched Mentors
        </button>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-t-4 border-b-4 border-white"></div>
        </div>
      )}

      {/* Matched Users Table */}
      {view === 'matchedUsers' && !isLoading && (
        <div className="bg-gray-900 rounded-xl p-2 sm:p-6 shadow-lg">
          <h2 className="text-base sm:text-xl font-semibold mb-2 sm:mb-4">Matched Users</h2>
          {matchedUsers.length === 0 ? (
            <p className="text-gray-400 text-xs sm:text-base">No matched users found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="bg-gray-800">
                    <th className="p-2 sm:p-3 font-semibold">Mentor ID</th>
                    <th className="p-2 sm:p-3 font-semibold">Mentee ID</th>
                    <th className="p-2 sm:p-3 font-semibold">Common Areas</th>
                    <th className="p-2 sm:p-3 font-semibold">Matched Date</th>
                  </tr>
                </thead>
                <tbody>
                  {matchedUsers.map((match, index) => (
                    <tr
                      key={match.id}
                      className={`border-b border-gray-700 ${index % 2 === 0 ? 'bg-gray-900' : 'bg-gray-850'}`}
                    >
                      <td className="p-2 sm:p-3">{match.mentor_user_id}</td>
                      <td className="p-2 sm:p-3">{match.mentee_user_id}</td>
                      <td className="p-2 sm:p-3">{match.common_areas.join(', ')}</td>
                      <td className="p-2 sm:p-3">
                        {new Date(match.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Unmatched Mentees Table */}
      {view === 'unmatchedMentees' && !isLoading && (
        <div className="bg-gray-900 rounded-xl p-2 sm:p-6 shadow-lg">
          <h2 className="text-base sm:text-xl font-semibold mb-2 sm:mb-4">Unmatched Mentees</h2>
          {unmatchedMentees.length === 0 ? (
            <p className="text-gray-400 text-xs sm:text-base">No unmatched mentees found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="bg-gray-800">
                    <th className="p-2 sm:p-3 font-semibold">User ID</th>
                    <th className="p-2 sm:p-3 font-semibold">Broad Area of Interest</th>
                    <th className="p-2 sm:p-3 font-semibold">Narrow Area of Interest</th>
                  </tr>
                </thead>
                <tbody>
                  {unmatchedMentees.map((mentee, index) => (
                    <tr
                      key={mentee.user_id}
                      className={`border-b border-gray-700 ${index % 2 === 0 ? 'bg-gray-900' : 'bg-gray-850'}`}
                    >
                      <td className="p-2 sm:p-3">{mentee.user_id}</td>
                      <td className="p-2 sm:p-3">{mentee.broad_area_of_interest || 'N/A'}</td>
                      <td className="p-2 sm:p-3">{mentee.narrow_area_of_interest || 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Unmatched Mentors Table */}
      {view === 'unmatchedMentors' && !isLoading && (
        <div className="bg-gray-900 rounded-xl p-2 sm:p-6 shadow-lg">
          <h2 className="text-base sm:text-xl font-semibold mb-2 sm:mb-4">Unmatched Mentors</h2>
          {unmatchedMentors.length === 0 ? (
            <p className="text-gray-400 text-xs sm:text-base">No unmatched mentors found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="bg-gray-800">
                    <th className="p-2 sm:p-3 font-semibold">User ID</th>
                    <th className="p-2 sm:p-3 font-semibold">Mentee Capacity</th>
                    <th className="p-2 sm:p-3 font-semibold">Broad Area of Expertise</th>
                    <th className="p-2 sm:p-3 font-semibold">Narrow Area of Expertise</th>
                  </tr>
                </thead>
                <tbody>
                  {unmatchedMentors.map((mentor, index) => (
                    <tr
                      key={mentor.user_id}
                      className={`border-b border-gray-700 ${index % 2 === 0 ? 'bg-gray-900' : 'bg-gray-850'}`}
                    >
                      <td className="p-2 sm:p-3">{mentor.user_id}</td>
                      <td className="p-2 sm:p-3">{mentor.mentee_capacity || 0}</td>
                      <td className="p-2 sm:p-3">{mentor.broad_area_of_expertise || 'N/A'}</td>
                      <td className="p-2 sm:p-3">{mentor.narrow_area_of_expertise || 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}