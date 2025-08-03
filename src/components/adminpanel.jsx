import { useState } from 'react';
import AnalyticsPanel from './AdminHomepage.jsx';
import MenteesDatabase from './matching/menteedatabse.jsx';
import MentorsDatabase from './matching/mentordatabase.jsx';
import { useNavigate } from 'react-router-dom';
import { useCallback } from 'react';
import axios from 'axios';
import MatchingDashboard from './matching/matchingdashboard.jsx';
import Matchmaking from './matching/matchmaking.jsx';
import AdminHomepage from './AdminHomepage.jsx';

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('Homepage');
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  
  const tabs = ['Homepage', 'Mentee Database', 'Mentor Database', 'Matching Dashboard', 'Matching', 'Logout'];
  
    const handleLogout = useCallback(async () => {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/logout`, {}, { withCredentials: true });
      localStorage.removeItem("user");
      localStorage.removeItem("menteeData");
      localStorage.removeItem("mentorData");
      localStorage.removeItem("admin");
      setIsLoggedIn(false);
      setUser(null);
      alert("Logout successful");
      navigate("/");
    }, [navigate]);

  const handleTabClick = async (tab) => {
    if (tab === 'Logout') {
      await handleLogout();
    } else {
      setActiveTab(tab);
    }
  };
  
  return (
    <div className="min-h-screen bg-black flex relative overflow-x-hidden" style={{ fontFamily: 'Arial, sans-serif' }}>
      {/* Sidebar */}
      <div className="w-28 sm:w-36 md:w-44 lg:w-56 bg-black p-3 sm:p-4">
        <div className="space-y-2 sm:space-y-4">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabClick(tab)}
              className={`w-full py-2 text-xs sm:text-sm font-semibold text-center rounded-md transition-colors duration-200 ${
                activeTab === tab
                  ? 'bg-white text-black'
                  : 'text-white hover:bg-gray-800'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 p-4 sm:p-6 md:p-8">
        {activeTab === 'Homepage' && <AdminHomepage />}
        {activeTab === 'Mentee Database' && <MenteesDatabase />}
        {activeTab === 'Mentor Database' && <MentorsDatabase />}
        {activeTab === 'Matching Dashboard' && <MatchingDashboard />}
        {activeTab === 'Matching' && <Matchmaking />}
      </div>
    </div>
  );
}