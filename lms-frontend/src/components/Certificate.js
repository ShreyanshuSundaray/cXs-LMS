import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';

const Certificate = () => {
  const { id } = useParams();
  const [certificate, setCertificate] = useState(null);
  const [error, setError] = useState('');
  const userName = localStorage.getItem('userName');

  useEffect(() => {
    const fetchCertificate = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/users/certificates/', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        const cert = response.data.find((c) => c.id === parseInt(id));
        setCertificate(cert);
      } catch (err) {
        setError('Failed to fetch certificate');
      }
    };
    fetchCertificate();
  }, [id]);

  if (!certificate) return <div className="text-center text-light-text">Loading...</div>;

  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-dark-card rounded-xl p-10 max-w-3xl w-full shadow-2xl border-4 border-secondary"
      >
        <h1 className="text-5xl font-extrabold text-center text-light-text mb-6 bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">
          Certificate of Completion
        </h1>
        {error && <p className="text-red-400 text-center mb-4">{error}</p>}
        <p className="text-center text-2xl text-gray-300 mb-4">
          This certifies that
        </p>
        <p className="text-center text-3xl font-semibold text-light-text mb-6">
          {userName}
        </p>
        <p className="text-center text-xl text-gray-300 mb-4">
          has successfully completed the course
        </p>
        <p className="text-center text-2xl font-semibold text-light-text mb-6">
          {certificate.course_title}
        </p>
        <p className="text-center text-lg text-gray-300">
          Date Issued: {new Date(certificate.date_issued).toLocaleDateString()}
        </p>
        <p className="text-center text-lg text-gray-300 mt-2">
          Certificate ID: {certificate.certificate_id}
        </p>
      </motion.div>
    </div>
  );
};

export default Certificate;