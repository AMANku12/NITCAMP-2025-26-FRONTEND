
import React, { useState, useEffect } from 'react';
import { User, Phone, Mail, BookOpen, Calendar, GraduationCap, Users, Target, CheckCircle } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { isValidPhoneNumber } from 'libphonenumber-js';

const MentorRegistrationForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    phoneNo: '',
    nitcDegree: '',
    department: '',
    yearGraduated: '',
    menteeCapacity: '',
    mentoringType: ''
  });

  const [departments, setDepartments] = useState([]);
  const [degrees, setDegrees] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const mentoringTypes = [
    { id: 'one-on-one', label: 'one-on-one' },
    { id: 'community-mentoring', label: 'community-mentoring' }
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 50 }, (_, i) => currentYear - i);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/getdomains/department`);
        setDepartments(res.data.domain);
        console.log("Departments fetched successfully:", res.data.domain);

        const res2 = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/getdomains/degree`);
        setDegrees(res2.data.domain);
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handlePhoneChange = (value) => {
    setFormData(prev => ({ ...prev, phoneNo: value || '' }));
    
    if (value) {
      setErrors(prev => ({
        ...prev,
        phoneNo: isValidPhoneNumber(value) ? '' : 'Invalid phone number format'
      }));
    } else {
      setErrors(prev => ({ ...prev, phoneNo: '' }));
    }
  };

  const handleMentoringTypeChange = (typeId) => {
    setFormData(prev => {
      if (typeId !== 'one-on-one') {
        return { ...prev, mentoringType: typeId, menteeCapacity: '' };
      }
      return { ...prev, mentoringType: typeId };
    });
    
    if (errors.mentoringType) {
      setErrors(prev => ({ ...prev, mentoringType: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.phoneNo.trim()) {
      newErrors.phoneNo = 'Phone number is required';
    } else if (!isValidPhoneNumber(formData.phoneNo)) {
      newErrors.phoneNo = 'Invalid phone number format';
    }
    
    if (!formData.nitcDegree.trim()) newErrors.nitcDegree = 'Degree pursued at NITC is required';
    if (!formData.department) newErrors.department = 'Department is required';
    if (!formData.yearGraduated) newErrors.yearGraduated = 'Year graduated is required';
    if (!formData.mentoringType) newErrors.mentoringType = 'Mentoring type is required';
    if (formData.mentoringType === 'one-on-one' && !formData.menteeCapacity.trim()) {
      newErrors.menteeCapacity = 'Mentee capacity is required for one-on-one mentoring';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      console.log('Form submitted:', formData);

      const mentorData = {
        phone_no: formData.phoneNo,
        year_graduated: parseInt(formData.yearGraduated),
        highest_degree_at_nitc_code: formData.nitcDegree,
        department_code: formData.department,
        mentoring_type: formData.mentoringType,
        mentee_capacity: formData.mentoringType === 'community-mentoring' ? 1 : parseInt(formData.menteeCapacity)
      };

      localStorage.setItem("mentorData", JSON.stringify(mentorData));
      navigate("/mentorinterests");
    }
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setFormData({
      phoneNo: '',
      nitcDegree: '',
      department: '',
      yearGraduated: '',
      menteeCapacity: '',
      mentoringType: ''
    });
    setErrors({});
  };

  return (
    <div className="min-h-screen bg-white p-2 sm:p-0">
      <div className="w-full">
        {/* Form Container */}
        <div className="bg-white rounded-b-3xl shadow-2xl overflow-hidden">
          <div className="p-4 sm:p-8 lg:p-12">
            <div className="text-center mb-8">
              <h2 className="text-xl sm:text-3xl font-bold text-blue-900 mb-2">Mentor Registration</h2>
              <p className="text-blue-700 text-xs sm:text-base">Please provide the following details (all fields marked with * are compulsory)</p>
            </div>

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
                      <Phone className="inline w-4 h-4 mr-1" />
                      Phone No <span className="text-red-600">*</span>
                    </label>
                    <PhoneInput
                      international
                      defaultCountry="IN"
                      value={formData.phoneNo}
                      onChange={handlePhoneChange}
                      className={`w-full px-2 sm:px-4 py-2 sm:py-3 rounded-2xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-100 ${errors.phoneNo ? 'border-red-400 bg-red-50' : formData.phoneNo.trim() ? 'border-blue-300 bg-blue-50' : 'border-gray-200 focus:border-blue-400'}`}
                      placeholder="Enter your phone number"
                    />
                    {errors.phoneNo && <p className="text-red-600 text-xs mt-1">{errors.phoneNo}</p>}
                  </div>

                  <div className="relative">
                    <label className="block text-sm font-semibold text-blue-900 mb-2">
                      <GraduationCap className="inline w-4 h-4 mr-1" />
                      Degree Pursued at NITC <span className="text-red-600">*</span>
                    </label>
                    <select
                      name="nitcDegree"
                      value={formData.nitcDegree}
                      onChange={handleInputChange}
                      className={`w-full px-2 sm:px-4 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all text-xs sm:text-sm bg-white shadow-sm ${errors.nitcDegree ? 'border-red-400 focus:ring-red-300 bg-red-50' : formData.nitcDegree ? 'border-blue-300 bg-blue-50' : 'border-gray-300'}`}
                    >
                      <option value="">Select Degree Pursued at NITC</option>
                      {degrees.map((degree) => (
                        <option key={degree.code} value={degree.code}>{degree.value}</option>
                      ))}
                    </select>
                    {errors.nitcDegree && <p className="text-red-600 text-xs mt-1">{errors.nitcDegree}</p>}
                  </div>

                  <div className="relative">
                    <label className="block text-sm font-semibold text-blue-900 mb-2">
                      <BookOpen className="inline w-4 h-4 mr-1" />
                      Department <span className="text-red-600">*</span>
                    </label>
                    <select
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                      className={`w-full px-2 sm:px-4 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all text-xs sm:text-sm bg-white shadow-sm ${errors.department ? 'border-red-400 focus:ring-red-300 bg-red-50' : formData.department ? 'border-blue-300 bg-blue-50' : 'border-gray-300'}`}
                    >
                      <option value="">Select Department</option>
                      {departments.map((dept) => (
                        <option key={dept.code} value={dept.code}>{dept.value}</option>
                      ))}
                    </select>
                    {errors.department && <p className="text-red-600 text-xs mt-1">{errors.department}</p>}
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  <div className="relative">
                    <label className="block text-sm font-semibold text-blue-900 mb-2">
                      <Calendar className="inline w-4 h-4 mr-1" />
                      Year Graduated <span className="text-red-600">*</span>
                    </label>
                    <select
                      name="yearGraduated"
                      value={formData.yearGraduated}
                      onChange={handleInputChange}
                      className={`w-full px-2 sm:px-4 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all text-xs sm:text-sm bg-white shadow-sm ${errors.yearGraduated ? 'border-red-400 focus:ring-red-300 bg-red-50' : formData.yearGraduated ? 'border-blue-300 bg-blue-50' : 'border-gray-300'}`}
                    >
                      <option value="">Select Year</option>
                      {years.map((year) => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                    {errors.yearGraduated && <p className="text-red-600 text-xs mt-1">{errors.yearGraduated}</p>}
                  </div>

                  <div className="relative">
                    <label className="block text-sm font-semibold text-blue-900 mb-3">
                      <Target className="inline w-4 h-4 mr-1" />
                      Mentoring Type <span className="text-red-600">*</span>
                    </label>
                    <div className="space-y-3">
                      {mentoringTypes.map((type) => (
                        <div key={type.id} className="flex items-center">
                          <input
                            type="radio"
                            id={type.id}
                            name="mentoringType"
                            value={type.id}
                            checked={formData.mentoringType === type.id}
                            onChange={() => handleMentoringTypeChange(type.id)}
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2"
                          />
                          <label
                            htmlFor={type.id}
                            className="ml-2 text-sm font-medium text-gray-700 cursor-pointer"
                          >
                            {type.label}
                          </label>
                        </div>
                      ))}
                    </div>
                    {errors.mentoringType && <p className="text-red-600 text-xs mt-1">{errors.mentoringType}</p>}
                  </div>

                  <div className={`relative transition-all duration-500 ease-in-out ${formData.mentoringType === 'one-on-one' ? 'opacity-100 max-h-32 transform translate-y-0' : 'opacity-0 max-h-0 transform -translate-y-4 overflow-hidden'}`}>
                    <label className="block text-sm font-semibold text-blue-900 mb-2">
                      <Users className="inline w-4 h-4 mr-1" />
                      Mentee Capacity <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="number"
                      name="menteeCapacity"
                      value={formData.menteeCapacity}
                      onChange={handleInputChange}
                      min="1"
                      max="5"
                      className={`w-full px-2 sm:px-4 py-2 sm:py-3 rounded-2xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-100 ${errors.menteeCapacity ? 'border-red-400 bg-red-50' : formData.menteeCapacity.trim() ? 'border-blue-300 bg-blue-50' : 'border-gray-200 focus:border-blue-400'}`}
                      placeholder="Number of mentees you can mentor (1-5)"
                    />
                    {errors.menteeCapacity && <p className="text-red-600 text-xs mt-1">{errors.menteeCapacity}</p>}
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end pt-8">
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="group relative bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 text-white px-6 sm:px-12 py-2 sm:py-4 rounded-full font-bold text-base sm:text-lg shadow-2xl hover:shadow-emerald-500/25 transform hover:-translate-y-2 hover:scale-105 transition-all duration-500 ease-out overflow-hidden"
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
                    <span className="tracking-wide">NEXT</span>
                    <div className="w-2 h-2 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-0 group-hover:translate-x-2"></div>
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
};

export default MentorRegistrationForm;
