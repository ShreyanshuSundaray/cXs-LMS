// src/components/Login.js

// import React, { useState } from 'react';
// import api from '../api';
// import { motion } from 'framer-motion';
// import { useNavigate } from 'react-router-dom';
// import toast from 'react-hot-toast';

// const Login = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       const res = await api.post('/users/login/', { email, password });
//       localStorage.setItem('accessToken', res.data.accessToken);
//       localStorage.setItem('refreshToken', res.data.refreshToken);
//       localStorage.setItem('user', JSON.stringify(res.data.user));
//       toast.success('Login successful!');
//       navigate('/courses');
//       window.location.reload(); // Force navbar to update
//     } catch (err) {
//       toast.error(err.response?.data?.error || 'Login failed');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.5 }}
//       className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg"
//     >
//       <h2 className="text-2xl font-bold text-center text-primary mb-6">Login</h2>
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <div>
//           <label className="block text-gray-700">Email</label>
//           <input
//             type="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
//             placeholder="Enter your email"
//             required
//           />
//         </div>
//         <div>
//           <label className="block text-gray-700">Password</label>
//           <input
//             type="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
//             placeholder="Enter your password"
//             required
//           />
//         </div>
//         <motion.button
//           whileHover={{ scale: 1.05 }}
//           whileTap={{ scale: 0.95 }}
//           type="submit"
//           disabled={loading}
//           className={`w-full p-2 rounded-md text-white transition ${
//             loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary hover:bg-blue-600'
//           }`}
//         >
//           {loading ? 'Logging in...' : 'Login'}
//         </motion.button>
//       </form>
//       <p className="mt-4 text-center text-gray-600">
//         Don't have an account?{' '}
//         <a href="/register" className="text-primary hover:underline">
//           Register
//         </a>
//       </p>
//     </motion.div>
//   );
// };

// export default Login;



import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../api';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/users/login/', { email, password });
      login(res.data);
      toast.success('Login successful!');
      navigate('/courses');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{height : '100vh'}}>
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
            cXs
          </Link>

          {/* Right Section (Search and User) */}
          <div className="flex items-center space-x-6">
            <Link to="/register" className="text-lg font-medium text-white hover:text-secondary transition">
              Register
            </Link>
          </div>
        </div>
      </motion.nav>
      <div style={{height : '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}                       
        transition={{ duration: 0.5 }}
        className="mt-500 p-6 bg-white rounded-lg shadow-lg"
      >
        <h2 className="text-2xl font-bold text-center text-primary mb-6">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700">Email</label>
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
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter your password"
              required
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={loading}
            className={`w-full p-2 rounded-md text-white transition ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary hover:bg-blue-600'
              }`}
          >
            {loading ? 'Logging in...' : 'Login'}
          </motion.button>
        </form>
        <p className="mt-4 text-center text-gray-600">
          Don't have an account? <a href="/register" className="text-primary hover:underline">Register</a>
        </p>
      </motion.div>
      </div>
    </div>
  );
};

export default Login;