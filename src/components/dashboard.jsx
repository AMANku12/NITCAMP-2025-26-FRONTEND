import { useState, useEffect } from 'react';
import { 
  User, 
  ChevronDown,
  Loader2,
  Users
} from 'lucide-react';

// API function matching your existing pattern
const apiCall = async (endpoint, data = null, method = 'GET') => {
  const config = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (data && method !== 'GET') {
    config.body = JSON.stringify(data);
  }

  config.credentials = 'include';

  const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}${endpoint}`, config);
  
  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
};

function Dashboard() {
  const [userData, setUserData] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Fetch user data and role on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      setApiError('');
      
      try {
        // Fetch user profile data
        const userResponse = await apiCall('/api/user/profile');
        const userData = userResponse.data || userResponse;
        
        setUserData(userData);
        setUserRole(userData.role);
        
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        setApiError('Failed to load dashboard data. Please refresh the page.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-gray-600 mx-auto mb-3" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-6 py-16">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-blue-600 mb-2">
            Welcome, {userData?.name || 'User'}
          </h1>
        </div>

        {/* API Error Display */}
        {apiError && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{apiError}</p>
          </div>
        )}

        {/* Dropdown Section */}
        <div className="flex justify-center">
          <div className="relative">
            {/* Dropdown Button */}
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center space-x-2 bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors duration-200 shadow-sm"
            >
              <Users className="w-5 h-5" />
              <span>Show My {userRole === 'mentee' ? 'Mentors' : 'Mentees'}</span>
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Content */}
            {isDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden z-50 min-w-max">
                <div className="p-4 text-center">
                  <p className="text-gray-600 text-sm">
                    Matching has not been started yet
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;