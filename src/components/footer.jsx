import React from "react";

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-neutral-900 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 px-2 sm:px-6 py-6 sm:py-8 border-t dark:border-neutral-700">
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6 text-center sm:text-left">
        {/* Contact Section */}
        <div>
          <h3 className="font-semibold text-neutral-800 dark:text-white mb-2">Contact Us</h3>
          <p>+91 9120390476</p>
          <p>
            <a href="mailto:pro@iitdh.ac.in" className="hover:underline">theharshrz11@gmail.com</a>
          </p>
        </div>

        {/* Address Section */}
        <div>
          <h3 className="font-semibold text-neutral-800 dark:text-white mb-2">Address</h3>
          <p>National Institute Of Technology, Calicut</p>
          <p>Kerala, India 673601</p>
        </div>

        {/* Copyright Section */}
        {/* <div>
          <h3 className="font-semibold text-neutral-800 dark:text-white mb-2">© 2023</h3>
          <p>Indian Institute of Technology Dharwad</p>
          <p>All Rights Reserved.</p>
        </div> */}
      </div>
    </footer>
  );
};

export default Footer;
