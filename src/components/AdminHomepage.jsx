import { useState, useEffect } from 'react';

/**
 * Analytics Panel Component
 * Displays key metrics in a clean responsive layout with blue-950 background
 * Currently uses sample data - replace with actual API calls when backend is ready
 */
export default function AdminHomepage() {
  // State for storing analytics data
  const [analyticsData, setAnalyticsData] = useState({
    noOfUsers: 0,
    noOfMentors: 0,
    noOfMentees: 0,
    matchedUsers: 0,
    unmatchedMentees: 0
  });

  // Loading state for better UX (currently simulated)
  const [isLoading, setIsLoading] = useState(true);
  
  // Animated values for counter animation
  const [animatedValues, setAnimatedValues] = useState({});

  // Fetch analytics data from backend
  const fetchAnalyticsData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/admin/homepage`, {
        credentials: 'include'
      });
      const result = await res.json();
      // Adjust these keys based on your backend response structure
      const data = result.data || {};
      
      setAnalyticsData({
        noOfUsers: data.noOfUsers || 0,
        noOfMentors: data.noOfMentors || 0,
        noOfMentees: data.noOfMentees || 0,
        matchedUsers: data.matchedUsers || 0,
        unmatchedMentees: data.unmatchedMentees || 0
      });
      setIsLoading(false);

      // Animate counters
      Object.entries({
        noOfUsers: data.noOfUsers || 0,
        noOfMentors: data.noOfMentors || 0,
        noOfMentees: data.noOfMentees || 0,
        matchedUsers: data.matchedUsers || 0,
        unmatchedMentees: data.unmatchedMentees || 0
      }).forEach(([key, value], index) => {
        setTimeout(() => {
          animateCounter(value, key);
        }, index * 150);
      });
    } catch (err) {
      setIsLoading(false);
      // fallback to zeros if error
      setAnalyticsData({
        noOfUsers: 0,
        noOfMentors: 0,
        noOfMentees: 0,
        matchedUsers: 0,
        unmatchedMentees: 0
      });
    }
  };

  /**
   * Counter animation function for smooth number transitions
   * Creates a smooth counting effect from 0 to target value
   */
  const animateCounter = (targetValue, key, duration = 1500) => {
    const startTime = Date.now();
    const startValue = 0;

    const updateCounter = () => {
      const currentTime = Date.now();
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth animation (ease-out-quart)
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentValue = Math.floor(startValue + (targetValue - startValue) * easeOutQuart);
      
      setAnimatedValues(prev => ({
        ...prev,
        [key]: currentValue
      }));

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      }
    };

    requestAnimationFrame(updateCounter);
  };

  // Load sample data on component mount
  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  /**
   * Analytics metrics configuration
   * Each metric defines its display properties and backend data source
   */
  const metrics = [
    {
      id: 'noOfUsers',
      label: 'TOTAL USERS',
      value: analyticsData.noOfUsers,
      description: 'Total number of registered users'
    },
    {
      id: 'noOfMentors',
      label: 'MENTORS',
      value: analyticsData.noOfMentors,
      description: 'Total number of registered mentors'
    },
    {
      id: 'noOfMentees',
      label: 'MENTEES',
      value: analyticsData.noOfMentees,
      description: 'Total number of registered mentees'
    },
    {
      id: 'matchedUsers',
      label: 'MATCHED PAIRS',
      value: analyticsData.matchedUsers,
      description: 'Successfully matched mentor-mentee pairs'
    },
    {
      id: 'unmatchedMentees',
      label: 'UNMATCHED MENTEES',
      value: analyticsData.unmatchedMentees,
      description: 'Mentees awaiting mentor assignment'
    }
  ];

  /**
   * Handle metric card click
   */
  const handleMetricClick = (metric) => {
    console.log(`Clicked on ${metric.id}:`, metric);
  };

  /**
   * Refresh data handler
   */
  const handleRefresh = () => {
    fetchAnalyticsData();
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-blue-950 p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-7xl mx-auto">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-white text-2xl sm:text-3xl lg:text-4xl font-bold">Analytics</h1>
            <div className="h-1 bg-white w-24 sm:w-32 mt-2"></div>
          </div>
          
          <div className="bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-lg max-w-5xl mx-auto">
            {/* Mobile: Single column, Tablet: 2-3 columns, Desktop: 5 columns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 divide-y sm:divide-y-0 sm:divide-x divide-gray-300">
              {[...Array(5)].map((_, index) => (
                <div
                  key={index}
                  className={`
                    p-4 sm:p-5 lg:p-6 xl:p-7
                    text-center
                    ${index < 2 ? 'sm:border-b sm:border-gray-300 lg:border-b-0' : ''}
                    ${index >= 2 && index < 4 ? 'sm:border-t sm:border-gray-300 lg:border-t-0' : ''}
                    ${index === 4 ? 'sm:col-span-2 lg:col-span-1 sm:border-t sm:border-gray-300 lg:border-t-0' : ''}
                  `}
                >
                  <div className="animate-pulse">
                    <div className="h-3 bg-gray-200 rounded mb-3 sm:mb-4"></div>
                    <div className="h-6 sm:h-8 lg:h-10 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-950 p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-7xl mx-auto">
        {/* Analytics Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-white text-2xl sm:text-3xl lg:text-4xl font-bold">Analytics</h1>
          <div className="h-1 bg-white w-24 sm:w-32 mt-2"></div>
        </div>

        {/* Analytics Grid Panel */}
        <div className="bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-lg max-w-5xl mx-auto">
          {/* Responsive Grid: 1 col mobile, 2 cols tablet, 5 cols desktop */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 divide-y sm:divide-y-0 sm:divide-x divide-gray-300">
            {metrics.map((metric, index) => (
              <div
                key={metric.id}
                className={`
                  p-4 sm:p-5 lg:p-6 xl:p-7
                  text-center 
                  hover:bg-gray-50 
                  transition-all duration-300 
                  cursor-pointer
                  group
                  relative
                  ${index < 2 ? 'sm:border-b sm:border-gray-300 lg:border-b-0' : ''}
                  ${index >= 2 && index < 4 ? 'sm:border-t sm:border-gray-300 lg:border-t-0' : ''}
                  ${index === 4 ? 'sm:col-span-2 lg:col-span-1 sm:border-t sm:border-gray-300 lg:border-t-0' : ''}
                `}
                onClick={() => handleMetricClick(metric)}
                title={metric.description}
              >
                {/* Metric Label */}
                <div className="text-gray-800 text-xs sm:text-sm font-bold mb-3 sm:mb-4 lg:mb-5 tracking-wide leading-tight">
                  {metric.label}
                </div>
                
                {/* Animated Metric Value */}
                <div className="text-gray-900 text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold group-hover:text-blue-600 transition-colors">
                  {animatedValues[metric.id] !== undefined 
                    ? animatedValues[metric.id].toLocaleString() 
                    : '0'
                  }
                </div>
                
                {/* Removed hover hint and mobile tap indicator */}
              </div>
            ))}
          </div>
        </div>

        {/* Data Info Footer */}
        <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0 text-sm text-gray-300">
          <div className="order-2 sm:order-1">
            Data loaded from backend
          </div>
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="order-1 sm:order-2 text-white hover:text-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-blue-800 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-medium"
          >
            {isLoading ? 'Loading...' : 'Refresh Data'}
          </button>
        </div>

        {/* Mobile-specific metrics summary */}
        <div className="mt-6 sm:hidden">
          <div className="bg-blue-900 rounded-xl p-4 text-white">
            <h3 className="font-semibold mb-2 text-sm">Quick Summary</h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>Total Users: {analyticsData.noOfUsers.toLocaleString()}</div>
              <div>Match Rate: {analyticsData.matchedUsers > 0 && analyticsData.noOfMentees > 0 ? Math.round((analyticsData.matchedUsers / analyticsData.noOfMentees) * 100) : 0}%</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}