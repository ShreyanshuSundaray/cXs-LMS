// src/components/Register.js

import React, { useState } from 'react';
import api from '../api';
import { motion } from 'framer-motion';
import { Link,useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import '../App.css'; // Assuming you have a CSS file for styles


const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [role, setRole] = useState('student');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/users/register/', {
        username,
        email,
        password,
        first_name: firstName,
        last_name: lastName,
        role,
      });
      toast.success('Registration successful! Please log in.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Registration failed');
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
          <div className="flex items-center space-x-6">
            <Link to="/login" className="text-lg font-medium text-white hover:text-secondary transition">
            Login
            </Link>
          </div>
        </div>
      </motion.nav>
      <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <motion.div
          // initial={{ opacity: 0, y: 20 }}
          // animate={{ opacity: 1, y: 0 }}
          // transition={{ duration: 0.5 }}
           style={{width : '35%',marginTop : '100px'}}
          className=" register-page mt-600 p-6 rounded-lg shadow-lg"
        >
          <h2 className="text-2xl font-bold text-center text-primary mb-6">Register</h2>
          <form onSubmit={handleSubmit} className="space-y-1">
            <div>
              <label className="block font-bold text-blue-600">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter your username"
                required
              />
            </div>
            <div>
              <label className="block font-bold text-blue-600">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter your email"
                required
              />
            </div>
            <div>
              <label className="block font-bold text-blue-600">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter your password"
                required
              />
            </div>
            <div>
              <label className="block font-bold text-blue-600">First Name</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter your first name"
                required
              />
            </div>
            <div>
              <label className="block font-bold text-blue-600">Last Name</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter your last name"
                required
              />
            </div>
            <div>
              <label className="block font-bold text-blue-600">Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="student">Student</option>
                <option value="instructor">Instructor</option>
              </select>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={loading}
              className={`w-full p-2 rounded-md text-white transition ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary hover:bg-blue-600'
                }`}
            >
              {loading ? 'Registering...' : 'Register'}
            </motion.button>
          </form>
          <p className="mt-4 text-center text-blue-600">
            Already have an account?{' '}
            <a href="/login" className="text-primary hover:underline">
              Login
            </a>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;