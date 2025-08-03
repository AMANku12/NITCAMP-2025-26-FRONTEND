import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function MenteeProfilePage() {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    photo_url: '',
    rollNo: '',
    degree: '',
    yearOfEnrollment: 0,
    phoneNo: '',
    personalEmail: '',
    department: '',
    boradAreaOfInterest: '',
    narrowAreaOfInterest: '',
  });
  const [photoLoading, setPhotoLoading] = useState(true);
  const [photoError, setPhotoError] = useState(false);

  useEffect(() => {
    async function fetchProfileData() {
      const localuser = JSON.parse(localStorage.getItem('user'));
      if (!localuser) {
        alert("Sorry could not fetch your details");
        navigate("/");
        return;
      }
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/getmenteedata/${localuser.id}`);
        if (res.status === 200) {
          const { user, mentee } = res.data;
          setProfileData({
            name: user.fullname || "",
            email: user.email || "",
            photo_url: user.photo_url || "",
            rollNo: mentee.roll_no || "",
            degree: mentee.degree || "",
            yearOfEnrollment: mentee.year_of_admission || 0,
            phoneNo: mentee.phone_no || "",
            personalEmail: mentee.personal_email || "",
            department: mentee.branch || "",
            boradAreaOfInterest: mentee.broad_area_of_interest || [],
            narrowAreaOfInterest: mentee.narrow_area_of_interest || []
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
    fetchProfileData();
  }, [navigate]);

  const LogoutUser = async () => {
    localStorage.removeItem("user");
    localStorage.removeItem("menteeData");
    localStorage.removeItem("mentorData");
    localStorage.removeItem("admin");
    alert("Logout successful");
    navigate("/");
  }

  const handleDeleteAccount = async () => {
    try {
      const res = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/deletemyaccount`, { withCredentials: true });
      if (res.status === 204) {
        // Logout user and clear localStorage
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

  const renderReadOnlyField = (label, value) => (
    <div className="flex justify-between items-center py-4 border-b border-gray-100">
      <span className="text-gray-600 font-medium">{label}:</span>
      <span className="text-gray-800">{Array.isArray(value) ? value.join(', ') : value}</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-2 sm:px-6 py-6 sm:py-8">
          <h1 className="text-2xl font-semibold text-center text-gray-900">
            My Profile (Mentee)
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
          <div className="space-y-0 text-xs sm:text-base">
            {renderReadOnlyField('Name', profileData.name)}
            {renderReadOnlyField('Email', profileData.email)}
            {renderReadOnlyField('Roll No', profileData.rollNo)}
            {renderReadOnlyField('Department', profileData.department)}
            {renderReadOnlyField('Year of Enrollment', profileData.yearOfEnrollment)}
            {renderReadOnlyField('Degree', profileData.degree)}
            {renderReadOnlyField('Phone No', profileData.phoneNo)}
            {renderReadOnlyField('Personal Email', profileData.personalEmail)}
            {renderReadOnlyField('Broad Area of Interest', profileData.boradAreaOfInterest)}
            {renderReadOnlyField('Narrow Area of Interest', profileData.narrowAreaOfInterest)}
          </div>
          <div className="flex justify-center mt-8">
            <button
              onClick={handleDeleteAccount}
              className="px-4 sm:px-8 py-2 sm:py-3 bg-red-500 hover:bg-red-600 text-white rounded-full font-medium transition-colors duration-200 text-xs sm:text-base"
            >
              Delete My Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}