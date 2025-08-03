import { useState, useContext, createContext, useEffect } from 'react';
import { User, Phone, Mail, BookOpen, Calendar, GraduationCap, MessageSquare, CheckCircle, Loader2 } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Create Context for form data
const FormDataContext = createContext(null);

// Context Provider Component
const FormDataProvider = ({ children }) => {
  const [menteeFormData, setMenteeFormData] = useState({
    name: '',
    rollNo: '',
    phoneNo: '',
    personalEmail: '',
    department: '',
    yearOfAdmission: '',
    degree: '',
    expectations: ''
  });

  const updateMenteeFormData = (data) => {
    setMenteeFormData(prev => ({ ...prev, ...data }));
  };

  return (
    <FormDataContext.Provider value={{ menteeFormData, updateMenteeFormData }}>
      {children}
    </FormDataContext.Provider>
  );
};

// Custom hook to use form data context
const useFormData = () => {
  const context = useContext(FormDataContext);
  if (!context) {
    throw new Error('useFormData must be used within a FormDataProvider');
  }
  return context;
};

// API functions for actual backend calls
const apiCall = async (endpoint, data = null, method = 'GET') => {
  const config = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: true
  };

  if (data && method !== 'GET') {
    config.body = JSON.stringify(data);
  }

  // Include credentials for authentication if needed
  // config.credentials = 'include';

  const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}${endpoint}`, config);
  
  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
};

function MenteeRegistrationForm() {
  const navigate = useNavigate();

  // Use context for persistent form data
  const { menteeFormData, updateMenteeFormData } = useFormData();
  
  // Local state for form data (synced with context)
  const [formData, setFormData] = useState(menteeFormData);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const departments = [
    'Chemical Engineering',
    'Civil Engineering',
    'Computer Science and Engineering',
    'Electrical and Electronics Engineering',
    'Electronics and Communication Engineering',
    'Mechanical Engineering',
    'Production Engineering',
    'Architecture',
    'Mathematics',
    'Physics',
    'Chemistry',
    'Humanities and Social Sciences'
  ];

  const degrees = ['B.Tech', 'M.Tech', 'PhD', 'M.Sc', 'MBA'];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 64 }, (_, i) => currentYear - i);

  // Fetch initial info on component mount
  useEffect(() => {
    const fetchInitialInfo = async () => {
      setIsLoading(true);
      setApiError('');
      
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/menteeinitialinfo`, {
          withCredentials: true
        });
        
        // Extract data from response (adjust based on your API response structure)
        const userData = res.data.menteeExtraInfo || res;
        const { roll_no, year_of_admission, degree, branch } = userData;

        console.log(userData);

        const updatedData = {
          ...formData,
          name: JSON.parse(localStorage.getItem("user")).fullname,
          rollNo: roll_no || '',
          department: branch || '',
          yearOfAdmission: year_of_admission || '',
          degree: degree || ''
        };

        console.log(updatedData);

        setFormData(updatedData);
        updateMenteeFormData(updatedData);
        
      } catch (error) {
        console.error("Failed to fetch initial info:", error);
        setApiError('Failed to load initial information. Please refresh the page.');
        
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialInfo();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const updatedData = {
      ...formData,
      [name]: value
    };
    
    // Update local state
    setFormData(updatedData);
    
    // Update context (persistent state)
    updateMenteeFormData(updatedData);
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // Clear API error when user makes changes
    if (apiError) {
      setApiError('');
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Only validate editable fields for user input
    if (!formData.phoneNo.trim()) {
      newErrors.phoneNo = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phoneNo)) {
      newErrors.phoneNo = 'Phone number must be 10 digits';
    }

    if (!formData.personalEmail.trim()) {
      newErrors.personalEmail = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.personalEmail)) {
      newErrors.personalEmail = 'Email is invalid';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const sendFeedback = async () => {
    console.log("Sending feedback");
    console.log("formdata: ", formData);
    try {
      const content = formData.expectations;
      console.log("content: ", content);
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/feedback`, {content}, {withCredentials: true});
      console.log("Feedback sent:", res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    localStorage.setItem("menteeData", JSON.stringify(formData));

    setApiError('');

    await sendFeedback();
    console.log("Feedback sent");

    navigate('/menteeinterests');
  };

  const handleReset = () => {
    const resetData = {
      name: formData.name, // Keep pre-filled data
      rollNo: formData.rollNo,
      department: formData.department,
      yearOfAdmission: formData.yearOfAdmission,
      degree: formData.degree,
      phoneNo: '',
      personalEmail: '',
      expectations: ''
    };
    
    setFormData(resetData);
    updateMenteeFormData(resetData);
    setErrors({});
    setApiError('');
    setSubmitSuccess(false);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-2 sm:p-0">
        <div className="text-center">
          <Loader2 className="w-8 h-8 sm:w-12 sm:h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-blue-700 text-base sm:text-lg">Loading your information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-2 sm:p-0">
      <div className="w-full">
        {/* Form Container */}
        <div className="bg-white rounded-b-3xl shadow-2xl overflow-hidden">
          <div className="p-4 sm:p-8 lg:p-12">
            <div className="text-center mb-8">
              <h2 className="text-xl sm:text-3xl font-bold text-blue-900 mb-2">Mentee Registration</h2>
              <p className="text-blue-700 text-xs sm:text-base">Please provide the following details (all fields marked with * are compulsory)</p>
            </div>

            {/* API Error Display */}
            {apiError && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{apiError}</p>
              </div>
            )}

            {/* Success Message */}
            {submitSuccess && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-600 text-sm">✅ Registration successful! Redirecting to interests page...</p>
              </div>
            )}

            <div className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8 relative">
                {/* Connector Line */}
                <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-1 bg-blue-950 transform -translate-x-1/2 rounded-full">
                  <div className="absolute top-0 left-1/2 w-4 h-4 bg-blue-950 rounded-full transform -translate-x-1/2 border-4 border-white shadow-lg"></div>
                  <div className="absolute bottom-0 left-1/2 w-4 h-4 bg-blue-950 rounded-full transform -translate-x-1/2 border-4 border-white shadow-lg"></div>
                </div>

                {/* Left Column */}
                <div className="space-y-6">
                  <div className="relative">
                    <label className="block text-sm font-semibold text-blue-900 mb-2">
                      <User className="inline w-4 h-4 mr-1" />
                      Name <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      disabled
                      className="w-full px-2 sm:px-4 py-2 sm:py-3 rounded-2xl border-2 bg-gray-100 text-gray-700 cursor-not-allowed text-xs sm:text-base"
                      placeholder="Pre-filled from system"
                    />
                  </div>

                  <div className="relative">
                    <label className="block text-sm font-semibold text-blue-900 mb-2">
                      <Phone className="inline w-4 h-4 mr-1" />
                      Phone No <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phoneNo"
                      value={formData.phoneNo}
                      onChange={handleInputChange}
                      className={`w-full px-2 sm:px-4 py-2 sm:py-3 rounded-2xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-100 text-xs sm:text-base ${
                        errors.phoneNo 
                          ? 'border-red-400 bg-red-50' 
                          : formData.phoneNo.trim() 
                            ? 'border-blue-300 bg-blue-50' 
                            : 'border-gray-200 focus:border-blue-400'
                      }`}
                      placeholder="Enter 10-digit phone number"
                    />
                    {errors.phoneNo && <p className="text-red-600 text-xs mt-1">{errors.phoneNo}</p>}
                  </div>

                  <div className="relative">
                    <label className="block text-sm font-semibold text-blue-900 mb-2">
                      <BookOpen className="inline w-4 h-4 mr-1" />
                      Department <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      name="department"
                      value={formData.department}
                      disabled
                      className="w-full px-2 sm:px-4 py-2 sm:py-3 rounded-2xl border-2 bg-gray-100 text-gray-700 cursor-not-allowed text-xs sm:text-base"
                      placeholder="Pre-filled from system"
                    />
                  </div>

                  <div className="relative">
                    <label className="block text-sm font-semibold text-blue-900 mb-2">
                      <Calendar className="inline w-4 h-4 mr-1" />
                      Year of Admission <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      name="yearOfAdmission"
                      value={formData.yearOfAdmission}
                      disabled
                      className="w-full px-2 sm:px-4 py-2 sm:py-3 rounded-2xl border-2 bg-gray-100 text-gray-700 cursor-not-allowed text-xs sm:text-base"
                      placeholder="Pre-filled from system"
                    />
                  </div>

                  <div className="relative">
                    <label className="block text-sm font-semibold text-blue-900 mb-2">
                      <GraduationCap className="inline w-4 h-4 mr-1" />
                      Degree <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      name="degree"
                      value={formData.degree}
                      disabled
                      className="w-full px-2 sm:px-4 py-2 sm:py-3 rounded-2xl border-2 bg-gray-100 text-gray-700 cursor-not-allowed text-xs sm:text-base"
                      placeholder="Pre-filled from system"
                    />
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  <div className="relative">
                    <label className="block text-sm font-semibold text-blue-900 mb-2">
                      <BookOpen className="inline w-4 h-4 mr-1" />
                      Roll No <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      name="rollNo"
                      value={formData.rollNo}
                      disabled
                      className="w-full px-4 py-3 rounded-2xl border-2 bg-gray-100 text-gray-700 cursor-not-allowed"
                      placeholder="Pre-filled from system"
                    />
                  </div>

                  <div className="relative">
                    <label className="block text-sm font-semibold text-blue-900 mb-2">
                      <Mail className="inline w-4 h-4 mr-1" />
                      Personal Email <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="email"
                      name="personalEmail"
                      value={formData.personalEmail}
                      onChange={handleInputChange}
                      className={`w-full px-2 sm:px-4 py-2 sm:py-3 rounded-2xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-100 text-xs sm:text-base ${
                        errors.personalEmail 
                          ? 'border-red-400 bg-red-50' 
                          : formData.personalEmail.trim() 
                            ? 'border-blue-300 bg-blue-50' 
                            : 'border-gray-200 focus:border-blue-400'
                      }`}
                      placeholder="Enter your email address"
                    />
                    {errors.personalEmail && <p className="text-red-600 text-xs mt-1">{errors.personalEmail}</p>}
                  </div>

                  <div className="relative">
                    <label className="block text-sm font-semibold text-blue-900 mb-2">
                      <MessageSquare className="inline w-4 h-4 mr-1" />
                      What are your expectations from this program?
                    </label>
                    <textarea
                      name="expectations"
                      value={formData.expectations}
                      onChange={handleInputChange}
                      rows={6}
                      className={`w-full px-2 sm:px-4 py-2 sm:py-3 rounded-2xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-100 resize-none text-xs sm:text-base ${
                        formData.expectations.trim() 
                          ? 'border-blue-300 bg-blue-50' 
                          : 'border-gray-200 focus:border-blue-400'
                      }`}
                      placeholder="Share your expectations and goals for this mentorship program..."
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between pt-8">
                <button
                  type="button"
                  onClick={handleReset}
                  disabled={isSubmitting}
                  className={`px-4 sm:px-8 py-2 sm:py-3 rounded-full font-medium transition-all duration-300 hover:shadow-lg text-xs sm:text-base ${
                    isSubmitting 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-gray-500 hover:bg-gray-600 text-white'
                  }`}
                >
                  Reset Form
                </button>
                
                <button
                  type="button"
                  onClick={handleSubmit}
                  className={`group relative px-6 sm:px-12 py-2 sm:py-4 rounded-full font-bold text-base sm:text-lg shadow-2xl transform transition-all duration-500 ease-out overflow-hidden bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 text-white hover:shadow-emerald-500/25 hover:-translate-y-2 hover:scale-105`}
                >
                  {/* Background Animation */}
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  {/* Shimmer Effect */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
                    <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white/20to-transparent group-hover:animate-pulse"></div>
                  </div>
                  
                  {/* Button Content */}
                  <div className="relative flex items-center space-x-3 z-10">
                    <CheckCircle className="w-6 h-6 transition-transform duration-300 group-hover:rotate-12" />
                    <span className="tracking-wide">
                      NEXT
                    </span>
                  </div>
                  
                  {/* Glow Effect */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-400 to-teal-400 opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500 -z-10"></div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Export both the component and the provider
export default function MenteeRegistrationWithProvider() {
  return (
    <FormDataProvider>
      <MenteeRegistrationForm />
    </FormDataProvider>
  );
}

// Export the components and hooks for use in other files
export { FormDataProvider, useFormData };