import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const About = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "What is NITCAMP?",
      answer:
        "NITCAMP is a platform designed to connect mentors, mentees, students, alumni, and everyone related to NITC. It helps people collaborate based on their areas of interest, fostering a supportive community for learning and growth.",
    },
    {
      question: "Who can use NITCAMP?",
      answer:
        "NITCAMP is open to students, alumni, faculty, and anyone associated with the college. Whether you're seeking guidance or offering mentorship, you're welcome here!",
    },
    {
      question: "How does NITCAMP facilitate collaboration?",
      answer:
        "By connecting users with shared interests, NITCAMP enables you to find mentors, join discussions, and collaborate on projects relevant to your field or passion.",
    },
    {
      question: "How do I find mentors or mentees?",
      answer:
        "Simply browse profiles, filter by interests, or use the search feature to find people who match your criteria. You can then connect and start collaborating.",
    },
    {
      question: "Is NITCAMP free to use?",
      answer: "Yes, NITCAMP is completely free for all users associated with NITC.",
    },
    {
      question: "How can I join NITCAMP?",
      answer:
        "You can join by signing up with your college email or through the registration process available on the platform.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Add top padding to account for fixed navbar */}
      <div className="pt-20 pb-16">
        <div className="max-w-3xl mx-auto px-2 sm:px-4">
          {/* Intro Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="mb-10"
          >
            <h1 className="text-3xl font-bold text-[#1e3a8a] mb-4 text-center">
              About NITCAMP
            </h1>
            <p className="text-gray-700 text-center leading-relaxed">
              NITCAMP is a mentorship and collaboration platform built for the NIT Calicut community. It empowers students, alumni, and faculty to connect based on shared interests, enabling meaningful mentor-mentee relationships, idea sharing, and career guidance — all within a trusted academic environment.
            </p>
          </motion.div>

          {/* FAQ Section */}
          <div className="space-y-4">
            <h2 className="text-1xl md:text-1xl font-bold text-center mb-8 text-[#1e3a8a]">
              FAQs
            </h2>
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="rounded-4xl overflow-hidden shadow-md bg-white border border-blue-100 text-xs sm:text-base"
              >
                
                <button
                  onClick={() => toggleFAQ(index)}
                  className="flex justify-between items-center w-full px-5 py-4 text-left font-medium bg-blue-50 hover:bg-blue-100 transition-colors duration-200"
                  aria-expanded={activeIndex === index}
                  aria-controls={`faq-${index}`}
                >
                  <span className="text-[#1e3a8a] text-xs sm:text-md pr-4">{faq.question}</span>
                  <motion.svg
                    className="w-5 h-5 text-[#1e3a8a] flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    animate={{ rotate: activeIndex === index ? 180 : 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </motion.svg>
                </button>

                <AnimatePresence initial={false}>
                  {activeIndex === index && (
                    <motion.div
                      key={`answer-${index}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ 
                        height: "auto", 
                        opacity: 1,
                        transition: {
                          height: { duration: 0.3, ease: "easeInOut" },
                          opacity: { duration: 0.25, delay: 0.1 }
                        }
                      }}
                      exit={{ 
                        height: 0, 
                        opacity: 0,
                        transition: {
                          height: { duration: 0.3, ease: "easeInOut" },
                          opacity: { duration: 0.2 }
                        }
                      }}
                      style={{ overflow: 'hidden' }}
                      className="bg-blue-50"
                    >
                      <div className="px-5 py-4 text-gray-700 text-sm leading-relaxed">
                        <p>{faq.answer}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;