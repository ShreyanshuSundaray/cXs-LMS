// src/components/CourseCreate.js

import React, { useState } from 'react';
import api from '../api'; // Replace axios with api
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Link,useNavigate } from 'react-router-dom';

const CourseCreate = () => {
  const [formData, setFormData] = useState({ title: '', description: '', price: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description) {
      toast.error('Please fill in all required fields');
      return;
    }
    setLoading(true);
    try {
      // Use api instead of axios
      const res = await api.post('/courses/create/', formData);
      toast.success('Course created successfully!');
      navigate('/courses');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to create course');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ height: '100vh' }}>
          <motion.nav
            initial={{ y: -50 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
            className={`fixed w-full z-50 transition-all duration-300 bg-black shadow-lg mt-0 
              }`}
          >
            <div className="max-w-7xl mx-auto flex justify-between items-center p-4">
              {/* Logo */}
              <Link to="/" className="text-4xl font-bold text-white tracking-tight">
              <img src='../../public/logo512.png' alt="Logo" className="h-10 w-10 inline-block mr-2" />
                cXs
              </Link>
    
              {/* Right Section (Search and User) */}
              {/* <div className="flex items-center space-x-6">
                <Link to="/login" className="text-lg font-medium text-white hover:text-secondary transition">
                Login
                </Link>
              </div> */}
            </div>
          </motion.nav>
          <div style={{height : '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
    <motion.div
      // initial={{ opacity: 0, y: 20 }}
      // animate={{ opacity: 1, y: 0 }}
      // transition={{ duration: 0.5 }}
      className="create-course mt-10 px-5 pt-6 pb-0 bg-white rounded-lg shadow-lg"
    >
      <h2 className="text-2xl font-bold text-center text-primary mb-6">Create a New Course</h2>
      <form onSubmit={handleSubmit} className="space-y-2">
        <div>
          <label className="block font-bold text-blue-600">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full p-2 border-red-600 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Enter course title"
          />
        </div>
        <div>
          <label className="block font-bold text-blue-600">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-2 border-red-600 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Enter course description"
            rows="4"
          />
        </div>
        <div className='mb-2'>
          
          <label className="block font-bold text-blue-600">Price</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="w-full p-2 border-red-600 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Enter price (optional)"
            step="0.01"
          />
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          disabled={loading}
          className={`w-full p-6 bg-primary text-white rounded-md hover:bg-blue-600 transition ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {loading ? 'Creating...' : 'Create Course'}
        </motion.button>
      </form>
    </motion.div>
    </div>
    </div>
  );
};

export default CourseCreate;