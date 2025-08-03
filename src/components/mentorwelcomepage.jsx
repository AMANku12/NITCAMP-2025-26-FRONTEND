import React from "react";

const MentorWelcomePage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
      <h1 className="text-4xl font-bold text-[#0A174E] mb-4">
        Welcome, Mentor
      </h1>

      <p className="text-[#5B6C94] text-lg mb-8 text-center max-w-2xl">
        Thank you for registering! We're thrilled to have you with us.
      </p>

      <div className="bg-[#EDF2FF] border border-[#CBD5E1] text-[#1E293B] rounded-2xl px-10 py-8 w-full max-w-2xl text-center shadow-md">
        <p className="text-base leading-relaxed mb-4">
          Your profile has been received and our team is working on matching you
          with the most suitable mentor.
        </p>
        <p className="text-base italic text-[#475569]">
          We'll notify you through email as soon as the matching process begins. Until then, sit back and relax!
        </p>
      </div>
    </div>
  );
};

export default MentorWelcomePage;
