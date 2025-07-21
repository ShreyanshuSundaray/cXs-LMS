import React from 'react';
import { motion } from 'framer-motion';

const Contact = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg"
    >
      <h2 className="text-3xl font-bold text-primary mb-6 text-center">Contact Us</h2>
      <p className="text-gray-600 mb-4 text-center">
        Have questions or need support? Reach out to us!
      </p>
      <div className="space-y-4">
        <p className="text-gray-700">
          <span className="font-semibold">Email:</span>{' '}
          <a href="mailto:support@lmsplatform.com" className="text-primary hover:underline">
            support@lmsplatform.com
          </a>
        </p>
        <p className="text-gray-700">
          <span className="font-semibold">Phone:</span>{' '}
          <a href="tel:+1234567890" className="text-primary hover:underline">
            +1 (234) 567-890
          </a>
        </p>
        <p className="text-gray-700">
          <span className="font-semibold">Address:</span> 123 Learning Street, Education City, 12345
        </p>
      </div>
    </motion.div>
  );
};

export default Contact;