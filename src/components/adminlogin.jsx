import { useState } from 'react';

export default function AdminLogin() {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Test credentials
  const TEST_CREDENTIALS = {
    username: 'dikshit',
    password: 'dikshit'
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }
    
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const redirectToAdminPanel = () => {
    // Using window.location for navigation
    window.location.href = '/adminpanel';
    
    // Alternative approaches for different routing setups:
    // For React Router: navigate('/adminpanel');
    // For Next.js: router.push('/adminpanel');
  };

  const redirectToHomepage = () => {
    // Redirect to homepage/user menu
    window.location.href = '/';
    
    // Alternative approaches for different routing setups:
    // For React Router: navigate('/');
    // For Next.js: router.push('/');
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      console.log('Login attempt:', formData);
      
      // Check test credentials first (for development/testing)
      if (formData.username === TEST_CREDENTIALS.username && 
          formData.password === TEST_CREDENTIALS.password) {
        console.log('Login successful with test credentials');
        
        // Simulate API delay for realistic UX
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Store login state in memory (since localStorage isn't supported)
        console.log('Admin logged in successfully');
        
        // Redirect to admin panel instead of showing alert
        redirectToAdminPanel();
        return;
      }
      
      // Simulate API call for actual backend authentication
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Add your actual login logic here
      // Example:
      // const response = await fetch('/api/admin/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData)
      // });
      // 
      // if (response.ok) {
      //   const data = await response.json();
      //   // Handle successful login
      //   redirectToAdminPanel();
      // } else {
      //   // Handle login failure
      //   setErrors({ general: 'Invalid credentials' });
      // }
      
      // For now, show error for non-test credentials
      setErrors({
        general: 'Invalid credentials. Try username: dikshit, password: dikshit'
      });
      
    } catch (error) {
      console.error('Login failed:', error);
      setErrors({
        general: 'Login failed. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="min-h-screen bg-blue-950 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden" style={{ fontFamily: 'Arial, sans-serif' }}>
      
      {/* Decorative Elements - Responsive */}
      <div className="absolute top-0 right-0 w-48 h-48 sm:w-64 sm:h-64 lg:w-96 lg:h-96 bg-gray-400 rounded-full opacity-20 transform translate-x-24 sm:translate-x-32 lg:translate-x-48 -translate-y-24 sm:-translate-y-32 lg:-translate-y-48"></div>
      
      <div className="absolute bottom-0 left-0 w-32 h-32 sm:w-48 sm:h-48 lg:w-64 lg:h-64 bg-gray-500 rounded-full opacity-10 transform -translate-x-16 sm:-translate-x-24 lg:-translate-x-32 translate-y-16 sm:translate-y-24 lg:translate-y-32"></div>
      
      {/* Main Login Container */}
      <div className="w-full max-w-xs sm:max-w-sm lg:max-w-md xl:max-w-lg relative z-10">
        
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8 lg:mb-10">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-normal text-white">
            Admin Credentials
          </h1>
          <div className="w-16 sm:w-20 lg:w-24 h-0.5 bg-white mx-auto mt-2 sm:mt-3 opacity-60"></div>
        </div>

        {/* Login Form */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 border border-white/10 shadow-2xl">
          <div className="space-y-4 sm:space-y-6">
            
            {/* General Error Message */}
            {errors.general && (
              <div className="bg-red-500/10 border border-red-400/20 rounded-lg p-3 sm:p-4">
                <p className="text-red-300 text-xs sm:text-sm text-center">
                  {errors.general}
                </p>
              </div>
            )}
            
            {/* Username Field */}
            <div>
              <label className="block text-white text-sm sm:text-base mb-2 sm:mb-3 font-medium">
                User Name*
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                placeholder="Admin Username..."
                className={`
                  w-full px-4 sm:px-5 lg:px-6 
                  py-3 sm:py-3.5 lg:py-4 
                  bg-white rounded-full 
                  text-gray-800 text-sm sm:text-base
                  placeholder-gray-400 
                  focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50
                  transition-all duration-200
                  ${errors.username ? 'ring-2 ring-red-400' : ''}
                `}
                disabled={isLoading}
              />
              {errors.username && (
                <p className="text-red-300 text-xs sm:text-sm mt-1 sm:mt-2">
                  {errors.username}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-white text-sm sm:text-base mb-2 sm:mb-3 font-medium">
                Password*
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                placeholder="Enter Password..."
                className={`
                  w-full px-4 sm:px-5 lg:px-6 
                  py-3 sm:py-3.5 lg:py-4 
                  bg-white rounded-full 
                  text-gray-800 text-sm sm:text-base
                  placeholder-gray-400 
                  focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50
                  transition-all duration-200
                  ${errors.password ? 'ring-2 ring-red-400' : ''}
                `}
                disabled={isLoading}
              />
              {errors.password && (
                <p className="text-red-300 text-xs sm:text-sm mt-1 sm:mt-2">
                  {errors.password}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-2 sm:pt-4 flex justify-center sm:justify-end">
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className={`
                  bg-white text-black 
                  text-sm sm:text-base font-medium
                  py-3 sm:py-3.5 lg:py-4 
                  px-8 sm:px-10 lg:px-12 
                  rounded-full 
                  focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50
                  transition-all duration-200 
                  hover:bg-gray-100 hover:shadow-lg
                  disabled:opacity-70 disabled:cursor-not-allowed
                  transform hover:scale-105 active:scale-95
                  w-full sm:w-auto
                  ${isLoading ? 'cursor-wait' : ''}
                `}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
                    <span>Processing...</span>
                  </div>
                ) : (
                  'Proceed'
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Back to User Menu Button */}
        <div className="text-center mt-4 sm:mt-6">
          <button
            onClick={redirectToHomepage}
            className="
              bg-white/10 text-white border border-white/20
              text-xs sm:text-sm font-medium
              py-2 sm:py-2.5 
              px-6 sm:px-8 
              rounded-full 
              focus:outline-none focus:ring-2 focus:ring-white/30 focus:ring-opacity-50
              transition-all duration-200 
              hover:bg-white/20 hover:border-white/30
              transform hover:scale-105 active:scale-95
              backdrop-blur-sm
            "
          >
            ← Back to User Menu
          </button>
        </div>

        {/* Footer Info - Only visible on larger screens */}
        <div className="text-center mt-6 sm:mt-8 hidden sm:block">
          <p className="text-white/60 text-xs sm:text-sm">
            Secure admin access • Protected login
          </p>
          <p className="text-white/40 text-xs mt-1">
            Test: username & password = "dikshit"
          </p>
        </div>

        {/* Mobile-specific help text */}
        <div className="text-center mt-4 sm:hidden">
          <p className="text-white/50 text-xs">
            Enter your admin credentials to continue
          </p>
          <p className="text-white/30 text-xs mt-1">
            Test: dikshit/dikshit
          </p>
        </div>
      </div>
    </div>
  );
}