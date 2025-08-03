import React from "react";

const MenteeWelcomePage = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-full max-w-4xl mx-auto px-16">
          
          {/* Main Welcome Section */}
          <div className="text-center mb-16">
            <div className="mb-6">
              <h1 className="text-5xl font-extralight text-[#0f172a] tracking-wide mb-4">
                Welcome, <span className="font-medium">Mentee</span>
              </h1>
              <div className="w-24 h-px bg-gradient-to-r from-transparent via-yellow-400 to-transparent mx-auto"></div>
            </div>
            
            <p className="text-xl text-gray-700 font-light leading-relaxed max-w-2xl mx-auto">
              Thank you for joining the <span className="font-medium text-[#1e3a8a]">NIT Calicut Alumni Mentoring Programme</span>. 
              Your registration has been successfully completed.
            </p>
          </div>

          {/* Email Notice Section */}
          <div className="border-t border-b border-gray-200 py-12">
            <div className="flex items-center justify-center space-x-6">
              <div className="w-12 h-12 bg-[#1e3a8a] rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
              </div>
              <div className="text-center">
                <h2 className="text-2xl font-light text-[#0f172a] mb-2">Please Check Your Email</h2>
                <p className="text-lg text-gray-600 font-light">
                  Kindly review your registered email address for important instructions and program details regarding your mentoring journey. You will receive updates on your assigned mentor and next steps.
                </p>
              </div>
            </div>
          </div>

          {/* Closing Message */}
          <div className="text-center mt-16">
            <p className="text-lg text-gray-500 font-light italic">
              We look forward to your journey with our mentoring community.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default MenteeWelcomePage;