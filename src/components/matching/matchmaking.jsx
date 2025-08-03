import React, { useState } from "react";
import axios from "axios";

export default function Matchmaking() {
  const [matchedUsers, setMatchedUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleMatchUsers = async () => {
    setIsLoading(true);
    setErrorMessage("");
    setMatchedUsers([]);
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/admin/matchusers`, { withCredentials: true });
      if (res.status === 200) {
        const { matchedUsers } = res.data;
        setMatchedUsers(matchedUsers);
        if (matchedUsers.length === 0) {
          setErrorMessage("No new matches were made.");
        }
      }
    } catch (error) {
      console.error("Error matching users:", error);
      if (error.response?.data?.error) {
        setErrorMessage(error.response.data.error);
      } else {
        setErrorMessage("An error occurred while matching users.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="text-white p-2 sm:p-4 md:p-8 bg-black min-h-screen font-sans">
      <h1 className="text-lg sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6 text-center">Matchmaking</h1>

      <div className="flex justify-center mb-6 sm:mb-8">
        <button
          onClick={handleMatchUsers}
          disabled={isLoading}
          className={`px-4 sm:px-8 py-2 sm:py-4 bg-white text-black rounded-xl font-semibold text-xs sm:text-lg transition-all duration-200 ${
            isLoading ? "scale-95 opacity-50 cursor-not-allowed" : "hover:bg-gray-200 scale-100"
          }`}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-4 w-4 sm:h-6 sm:w-6 border-t-2 border-b-2 border-gray-900 mr-2"></div>
              Matching...
            </div>
          ) : (
            "Match Users"
          )}
        </button>
      </div>

      {errorMessage && (
        <div className="text-red-500 text-center mb-4 sm:mb-6 text-xs sm:text-base">{errorMessage}</div>
      )}

      {matchedUsers.length > 0 && (
        <div className="bg-gray-900 rounded-xl p-2 sm:p-4 shadow-lg max-w-md sm:max-w-4xl mx-auto">
          <h2 className="text-base sm:text-xl font-semibold mb-2 sm:mb-4 text-center">Newly Matched Users</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-base">
              <thead>
                <tr className="bg-gray-800">
                  <th className="p-2 sm:p-3 font-semibold">Mentee ID</th>
                  <th className="p-2 sm:p-3 font-semibold">Mentor ID</th>
                  <th className="p-2 sm:p-3 font-semibold">Common Areas</th>
                  <th className="p-2 sm:p-3 font-semibold">Matched Date</th>
                </tr>
              </thead>
              <tbody>
                {matchedUsers.map((match, index) => (
                  <tr
                    key={match.id}
                    className={`border-b border-gray-700 ${index % 2 === 0 ? "bg-gray-900" : "bg-gray-850"}`}
                  >
                    <td className="p-2 sm:p-3">{match.mentee_user_id}</td>
                    <td className="p-2 sm:p-3">{match.mentor_user_id}</td>
                    <td className="p-2 sm:p-3 whitespace-normal">{match.common_areas.join(", ")}</td>
                    <td className="p-2 sm:p-3">{new Date(match.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}