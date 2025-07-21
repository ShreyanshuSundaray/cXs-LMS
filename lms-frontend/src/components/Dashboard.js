// src/components/Dashboard.js

import React, { useState, useEffect } from 'react';
import api from '../api';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/courses/dashboard/');
        setUserData(res.data);
      } catch (err) {
        toast.error('Failed to fetch dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 border-4 border-t-primary border-gray-200 rounded-full"
        />
      </div>
    );
  }

  if (!userData) {
    return <div className="text-center text-gray-600 mt-10">User data not found</div>;
  }

  const { user, enrolled_courses } = userData;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg"
    >
      <h2 className="text-3xl font-bold text-primary mb-6">Dashboard</h2>

      <div className="mb-8">
        <h3 className="text-xl font-semibold text-primary mb-2">Profile</h3>
        <p className="text-gray-600">Username: {user.username}</p>
        <p className="text-gray-600">Email: {user.email}</p>
        <p className="text-gray-600">Name: {user.first_name} {user.last_name}</p>
        <p className="text-gray-600">Role: {user.role}</p>
      </div>

      <div>
        <h3 className="text-xl font-semibold text-primary mb-2">Enrolled Courses</h3>
        {enrolled_courses.length === 0 ? (
          <p className="text-gray-600">You are not enrolled in any courses yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {enrolled_courses.map((course) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="bg-gray-100 rounded-lg p-4"
              >
                <h4 className="text-lg font-semibold text-primary">{course.title}</h4>
                <p className="text-gray-600">Instructor: {course.instructor_name}</p>
                <p className="text-gray-600">Price: ${course.price}</p>
                <Link
                  to={`/courses/${course.id}`}
                  className="mt-2 inline-block text-primary hover:underline"
                >
                  View Course
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Dashboard;