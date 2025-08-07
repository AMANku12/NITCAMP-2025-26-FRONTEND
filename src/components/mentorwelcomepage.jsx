import React from "react";

const MentorWelcomePage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white w-full">
      <h1 className="text-2xl sm:text-4xl font-bold text-[#0A174E] mb-2 sm:mb-4">
        Welcome, Mentor
      </h1>

      <p className="text-base sm:text-lg text-[#5B6C94] mb-4 sm:mb-8 text-center w-full">
        Thank you for registering! We're thrilled to have you with us.
      </p>

      <div className="bg-[#EDF2FF] border border-[#CBD5E1] text-[#1E293B] rounded-2xl py-6 sm:py-8 w-full text-center shadow-md">
        <p className="text-sm sm:text-base leading-relaxed mb-2 sm:mb-4">
          Your profile has been received and our team is working on matching you
          with the most suitable mentor.
        </p>
        <p className="text-xs sm:text-base italic text-[#475569]">
          We'll notify you through email as soon as the matching process begins. Until then, sit back and relax!
        </p>
      </div>
    </div>
  );
};

export default MentorWelcomePage;
