import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function MentorProfilePage() {
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    photo_url: '',
    degree: '',
    yearGraduated: '',
    phoneNo: '',
    department: '',
    menteeCapacity: 0,
    mentoringType: '',
    broadAreaOfExpertise: [],
    narrowAreaOfExpertise: []
  });
  const [photoLoading, setPhotoLoading] = useState(true);
  const [photoError, setPhotoError] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchProfile() {
      const localuser = JSON.parse(localStorage.getItem("user"));
      if (!localuser) {
        alert("Sorry could not fetch your details");
        navigate("/");
        return;
      }
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/getmentordata/${localuser.id}`);
        if (res.status === 200) {
          const { user, mentor } = res.data;
          setProfileData({
            name: user.fullname || "",
            email: user.email || "",
            photo_url: user.photo_url || "",
            degree: mentor.degree || "",
            yearGraduated: mentor.year_graduated || "",
            phoneNo: mentor.phone_no || "",
            department: mentor.department || "",
            menteeCapacity: mentor.mentee_capacity || 0,
            mentoringType: mentor.mentoring_type || "",
            broadAreaOfExpertise: mentor.broad_area_of_expertise || [],
            narrowAreaOfExpertise: mentor.narrow_area_of_expertise || []
          });
          setPhotoLoading(false);
        } else {
          alert("Sorry could not fetch your details");
          navigate("/");
        }
      } catch (error) {
        alert("Sorry could not fetch your details");
        navigate("/");
      }
    }
    fetchProfile();
  }, [navigate]);

  const renderReadOnlyField = (label, value) => (
    <div className="flex justify-between items-center py-4 border-b border-gray-100">
      <span className="text-gray-600 font-medium">{label}:</span>
      <span className="text-gray-800">{Array.isArray(value) ? value.join(', ') : value}</span>
    </div>
  );

  const handleDeleteAccount = async () => {
    try {
      const res = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/deletemyaccount`, { withCredentials: true });
      if (res.status === 204) {
        localStorage.removeItem("user");
        localStorage.removeItem("menteeData");
        localStorage.removeItem("mentorData");
        localStorage.removeItem("admin");
        alert("Your account has been deleted. You have been logged out.");
        navigate("/");
      } else {
        alert("Failed to delete account");
      }
    } catch (error) {
      alert("Failed to delete account");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-6 py-8">
          <h1 className="text-2xl font-semibold text-center text-gray-900">
            Mentor Profile
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-3xl mx-auto px-6 py-12">
        {/* Profile Image */}
        <div className="flex justify-center mb-12">
          <div className="relative">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-100">
              {photoLoading ? (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
              ) : photoError || !profileData.photo_url ? (
                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                  <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
              ) : (
                <img
                  src={profileData.photo_url}
                  alt="Profile"
                  className="w-full h-full object-cover"
                  onLoad={() => setPhotoError(false)}
                  onError={() => setPhotoError(true)}
                />
              )}
            </div>
          </div>
        </div>

        {/* Profile Information */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <div className="space-y-0">
            {renderReadOnlyField('Name', profileData.name)}
            {renderReadOnlyField('Email', profileData.email)}
            {renderReadOnlyField('Department', profileData.department)}
            {renderReadOnlyField('Degree', profileData.degree)}
            {renderReadOnlyField('Year Graduated', profileData.yearGraduated)}
            {renderReadOnlyField('Phone No', profileData.phoneNo)}
            {renderReadOnlyField('Mentee Capacity', profileData.menteeCapacity)}
            {renderReadOnlyField('Mentoring Type', profileData.mentoringType)}
            {renderReadOnlyField('Broad Area of Expertise', profileData.broadAreaOfExpertise)}
            {renderReadOnlyField('Narrow Area of Expertise', profileData.narrowAreaOfExpertise)}
          </div>
          <div className="flex justify-center mt-8">
            <button
              onClick={handleDeleteAccount}
              className="px-8 py-3 bg-red-500 hover:bg-red-600 text-white rounded-full font-medium transition-colors duration-200"
            >
              Delete My Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}