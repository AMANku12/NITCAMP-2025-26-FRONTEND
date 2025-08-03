import React, { useState, useEffect } from 'react';
import Typewriter from 'typewriter-effect';
import nitImage from "../assets/nitc.webp";
import {useNavigate} from "react-router-dom";

const Homepage = () => {

  const navigate = useNavigate();
  const [isloggeedIn, setIsLoggedIn] = useState(false);

  useEffect(()=>{
    const user = JSON.parse(localStorage.getItem("user"));
    if(user){
      setIsLoggedIn(true);
    }
  },[])
  // ==== NEW: Added state for testimonial slideshow ====
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);
  const [isTestimonialAnimating, setIsTestimonialAnimating] = useState(false);

  // ==== NEW: Added testimonials data array ====
  const testimonials = [
    {
      id: 1,
      quote: "The mentorship program gave me great career advice and helped me make smart decisions about my future. The organized approach and real alumni support made all the difference.",
      name: "Arun Raj",
      details: "B.Tech CSE 2022",
      initials: "AR",
      rating: 5
    },
    {
      id: 2,
      quote: "Thanks to this program, I connected with industry professionals who helped me prepare for placements. The practice interviews and resume feedback were really helpful.",
      name: "Priya Sharma",
      details: "B.Tech ECE 2023",
      initials: "PS",
      rating: 5
    },
    {
      id: 3,
      quote: "The mentoring sessions helped me understand different career paths in technology. My mentor's insights about industry trends were accurate and helped me pick the right area to focus on.",
      name: "Rahul Kumar",
      details: "B.Tech ME 2021",
      initials: "RK",
      rating: 5
    },
    {
      id: 4,
      quote: "This program's community is amazing! The peer learning and alumni network gave me opportunities I never expected. I highly recommend it to all junior students.",
      name: "Sneha Patel",
      details: "B.Tech IT 2022",
      initials: "SP",
      rating: 5
    }
  ];

  // ==== NEW: Added slideshow navigation functions ====
  const nextTestimonial = () => {
    if (isTestimonialAnimating) return;
    setIsTestimonialAnimating(true);
    setTimeout(() => {
      setCurrentTestimonialIndex((prevIndex) => 
        prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
      );
      setIsTestimonialAnimating(false);
    }, 150);
  };

  const prevTestimonial = () => {
    if (isTestimonialAnimating) return;
    setIsTestimonialAnimating(true);
    setTimeout(() => {
      setCurrentTestimonialIndex((prevIndex) => 
        prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
      );
      setIsTestimonialAnimating(false);
    }, 150);
  };

  const goToTestimonial = (index) => {
    if (isTestimonialAnimating || index === currentTestimonialIndex) return;
    setIsTestimonialAnimating(true);
    setTimeout(() => {
      setCurrentTestimonialIndex(index);
      setIsTestimonialAnimating(false);
    }, 150);
  };

  // ==== NEW: Added auto-slide effect ====
  useEffect(() => {
    const interval = setInterval(() => {
      nextTestimonial();
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [currentTestimonialIndex]);

  return (
    <div className="bg-white max-w-full text-gray-800 font-sans" style={{ fontFamily: 'Arial, sans-serif' }}>

      {/* Hero Section with Image and Welcome Text */}
      <section className="relative">
        <div className="relative w-full h-96 overflow-hidden">
          <img
            src={nitImage}
            alt="NIT Calicut"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <h2
              className="text-white text-5xl font-bold text-center px-4"
              style={{ fontFamily: 'Georgia, serif', letterSpacing: '2px' }}
            >
              <Typewriter
                onInit={(typewriter) => {
                  typewriter
                    .typeString('Welcome to NITCAMP')
                    .start();
                }}
                options={{
                  autoStart: false,
                  loop: false,
                  delay: 74,
                }}
              />
            </h2>
          </div>
        </div>
      </section>

      <div className="max-w-full mx-auto px-6 py-16 space-y-20">
        {/* What is this program about */}
        <section className="">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            What is this program about?
          </h2>
          <p className="text-lg  text-gray-700 mx-auto leading-relaxed">
            NIT Calicut Alumni Mentoring Program (NITCAMP) is an endeavor started by the NIT-Calicut Alumni Association (NITCAA) in 2018 as a platform to provide the current students at NIT-Calicut to interact with the institute alumni. NITCAMP helps in fostering a one-on-one mentoring style between the current students (mentees) and the alumni (mentors). NITCAMP enables the connection between the mentees and the mentors based on the mentees' preferences. Through these structured connections and support, NITCAMP hopes to provide opportunities for personal and professional growth for both the current students and alumni at NITC. 
          </p>
        </section>

        {/* Eligibility Criterion */}
        <section>
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            Eligibility Criterion
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <div className="p-8 border border-gray-200 rounded-lg">
              <h3 className="text-xl font-semibold text-[#043871] mb-4">Students/Mentees</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                All current undergraduate, postgraduate and PhD students at NITC are eligible for participation. We specifically encourage second and third year UG students and first year PG students to participate so that a long-term relationship can be established.
              </p>
              <p className="text-gray-600 leading-relaxed mb-4">
                This is a <strong>"mentee-driven" program</strong> where students take the initiative to efficiently utilize the program.
              </p>
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                <p className="text-yellow-800 font-semibold">
                  ⚠️ Important: Prospective students must attend at least one orientation session to be eligible.
                </p>
              </div>
            </div>
            <div className="p-8 border border-gray-200 rounded-lg">
              <h3 className="text-xl font-semibold text-[#043871] mb-4">Alumni/Mentors</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                All NITC graduates are eligible to serve as mentors in the program.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Mentors are expected to provide a commitment of <strong>1-2 hours per week</strong> throughout their participation in the program.
              </p>
            </div>
          </div>
        </section>

        {/* Program Overview and Timeline */}
        <section className="bg-gradient-to-b from-[#f8fbff] to-white py-20 px-4 max-w-full">
  <div className="max-w-5xl mx-auto text-center">
    <h2 className="text-3xl md:text-4xl font-semibold text-gray-800 mb-6 tracking-tight">
      Program Overview & Timeline
    </h2>
    <p className="text-gray-600 text-base md:text-lg max-w-3xl mx-auto leading-relaxed mb-14">
      This annual program begins in early August. Here's how it unfolds through the academic year:
    </p>
  </div>

  <div className="grid gap-8 md:grid-cols-2 max-w-6xl mx-auto">
    {[
      {
        step: "1",
        title: "Orientation Sessions",
        time: "July / August",
        desc: " Orientation session for students from the NITCAMP organizing committee: The organizing committee will hold multiple information sessions on the program goals for the prospective students in the months of July and August. Please note that only those who attend at least one of these sessions are eligible for participating in the program. " 
      },
      {
        step: "2",
        title: "Application Forms",
        time: "August / September",
        desc: " Eligible students will be asked to fill out a form wherein they can select their future goals (career goals/higher studies). Mentors will also be asked to fill out a similar form expressing their areas of expertise and on the number of students they are willing to mentor. ",
      },
      {
        step: "3",
        title: "Mentor-Mentee Matching",
        time: "Early October",
        desc: " Mentees are matched with their preferred mentors",
      },
      {
        step: "4",
        title: "Program Launch",
        time: "Mid October",
        desc: "Program officially starts.",
      },
      {
        step: "5",
        title: "Mid-Program Feedback",
        time: "January / February",
        desc: " Feedback is collected from the mentors and the mentees to see whether any program realignment is necessary",
      },
      {
        step: "6",
        title: "Program Conclusion",
        time: "April / May",
        desc: "Mentoring program for the academic year concludes.",
      },
    ].map((item, index) => (
      <div
        key={index}
        className="bg-blue-50 rounded-2xl shadow-sm px-6 py-6 transition-transform hover:scale-[1.015] border border-gray-200"
      >
        <div className="flex  items-center mb-3">
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-950 text-white font-semibold shadow-sm mr-4">
            {item.step}
          </div>
          <div className="text-lg font-semibold text-gray-800 mb-2">{item.time}</div>
        </div><div>
          </div>        <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>

      </div>
    ))}
  </div>
</section>

        {/* How can students make use of the program */}
        <section>
          <h2 className="text-3xl font-bold text-gray-800 mb-12 text-center">
            How can students make use of the program?
            
          </h2><p className="text-lg text-gray-700 leading-relaxed mb-8 ">
            NITCAMP strives to connect the current students with the best alumni in their field of interest. Students are encouraged to have conversations with their mentors throughout the academic year. This can help in getting insights into their career choice or what to expect at an international institution for higher studies. While career-related discussions are highly encouraged, please note that this is NOT a platform for the students to request for internships or job opportunities from their mentors. 
            </p>
          <div className="max-w-4xl mx-auto">
            
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-green-50 p-8 rounded-lg border border-green-200">
                <h3 className="text-xl font-semibold text-green-800 mb-4 flex items-center gap-2">
                  What you can discuss
                </h3>
                <ul className="space-y-3 text-green-700">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">•</span>
                    Career guidance and insights
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">•</span>
                    Higher studies guidance
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">•</span>
                    Industry expectations and trends
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">•</span>
                    Professional development advice
                  </li>
                </ul>
              </div>

              <div className="bg-red-50 p-8 rounded-lg border border-red-200">
                <h3 className="text-xl font-semibold text-red-800 mb-4 flex items-center gap-2">
                   Important Note
                </h3>
                <div className="bg-red-100 p-4 rounded border-l-4 border-red-400">
                  <p className="text-red-800 font-semibold">
                    This is <strong>NOT</strong> a platform for students to request internships or job opportunities from their mentors.
                  </p>
                  <p className="text-red-700 mt-2 text-sm">
                    Focus on learning and guidance rather than direct job requests.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why trust this program */}
        <section className="bg-white px-6 py-16 rounded-3xl shadow-sm border border-gray-200">
  <div className="max-w-5xl mx-auto space-y-12">
    <h2 className="text-3xl md:text-4xl font-semibold text-center text-gray-800 tracking-tight">
      Why should I trust this program?
    </h2>

    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {[
        {
          icon: "🏛️",
          title: "Official NITCAA Program",
          desc: "Started by the NIT-Calicut Alumni Association (NITCAA) in 2018 with institutional support.",
        },
        {
          icon: "✅",
          title: "Verified Community",
          desc: "Only authentic, verified NITC students and alumni participate in the program.",
        },
        {
          icon: "🏆",
          title: "7+ Years of Impact",
          desc: "Successfully running since 2018 with countless mentor-mentee success stories.",
        },
        {
          icon: "🎯",
          title: "Structured & Transparent",
          desc: "Every step is clearly defined to ensure valuable and personalized guidance.",
        },
      ].map((item, idx) => (
        <div
          key={idx}
          className="bg-[#f9fbfd] hover:bg-white transition-all duration-200 border border-gray-100 rounded-xl p-6 shadow-sm hover:shadow-md text-center"
        >
          <div className="text-3xl mb-3">{item.icon}</div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">{item.title}</h3>
          <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
        </div>
      ))}
    </div>
  </div>
</section>

        {/* ==== UPDATED: Testimonial section now has slideshow functionality ==== */}
        <section className="bg-white p-10 rounded-xl shadow-lg border border-gray-200 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-blue-100 opacity-50"></div>
          
          {/* NEW: Navigation Arrows */}
          <button 
            onClick={prevTestimonial}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition-all duration-200 hover:scale-110"
            disabled={isTestimonialAnimating}
          >
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button 
            onClick={nextTestimonial}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition-all duration-200 hover:scale-110"
            disabled={isTestimonialAnimating}
          >
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <div className="relative z-10">
            <h3 className="text-2xl font-semibold text-blue-900 mb-6 flex items-center justify-center gap-2">
              💬 What our community says?
            </h3>
            
            {/* UPDATED: Testimonial Content now shows current testimonial with fade animation */}
            <div className={`transition-opacity duration-300 ${isTestimonialAnimating ? 'opacity-0' : 'opacity-100'}`}>
              <div className="text-6xl text-blue-200 mb-4">"</div>
              <div className="relative w-full">
                <p className="italic text-gray-700 text-lg leading-relaxed mb-6 text-center max-w-2xl mx-auto min-h-[120px] flex items-center justify-center">
                  {testimonials[currentTestimonialIndex].quote}
                </p>
              </div>
              
              {/* UPDATED: Author Info now shows current testimonial data */}
              <div className="flex items-center justify-center gap-2 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                  {testimonials[currentTestimonialIndex].initials}
                </div>
                <div className="text-left">
                  <p className="font-semibold text-blue-800">{testimonials[currentTestimonialIndex].name}</p>
                  <p className="text-sm text-gray-600">{testimonials[currentTestimonialIndex].details}</p>
                </div>
              </div>
              
              {/* Rating Stars */}
              <div className="flex justify-center space-x-1 mb-6">
                {[1,2,3,4,5].map(star => (
                  <span key={star} className="text-yellow-400 text-xl">⭐</span>
                ))}
              </div>
            </div>

            {/* NEW: Dot Indicators */}
            <div className="flex justify-center space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-200 ${
                    index === currentTestimonialIndex 
                      ? 'bg-blue-600 scale-110' 
                      : 'bg-blue-300 hover:bg-blue-400'
                  }`}
                  disabled={isTestimonialAnimating}
                />
              ))}
            </div>

            {/* NEW: Slide Counter */}
            <div className="mt-4 text-sm text-gray-500">
              {currentTestimonialIndex + 1} of {testimonials.length}
            </div>
          </div>
        </section>
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
        
        .typing-cursor {
          display: inline-block;
          margin-left: 2px;
          font-weight: bold;
          font-size: 1.2em;
          color: #374151;
          animation: blink 1s infinite;
        }
      `}</style>
    </div>
  );
};

export default Homepage;