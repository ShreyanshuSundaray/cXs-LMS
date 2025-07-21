// import React, { useState, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { motion, AnimatePresence } from 'framer-motion';
// import toast from 'react-hot-toast';

// const Navbar = () => {
//   const navigate = useNavigate();
//   const [user, setUser] = useState(null);
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const [searchQuery, setSearchQuery] = useState('');

//   useEffect(() => {
//     const storedUser = localStorage.getItem('user');
//     if (storedUser) {
//       setUser(JSON.parse(storedUser));
//     }
//   }, []);

//   const handleLogout = () => {
//     localStorage.removeItem('accessToken');
//     localStorage.removeItem('refreshToken');
//     localStorage.removeItem('user');
//     setUser(null);
//     setIsDropdownOpen(false);
//     toast.success('Logged out successfully');
//     navigate('/');
//   };

//   const toggleDropdown = () => {
//     setIsDropdownOpen(!isDropdownOpen);
//   };

//   const handleSearch = (e) => {
//     e.preventDefault();
//     if (searchQuery.trim()) {
//       navigate(`/courses?search=${encodeURIComponent(searchQuery)}`);
//     }
//   };

//   return (
//     <motion.nav
//       initial={{ y: -50 }}
//       animate={{ y: 0 }}
//       transition={{ duration: 0.5 }}
//       className="navbar text-white p-4 shadow-lg"
//     >
//       <div className="max-w-7xl mx-auto flex justify-between items-center">
//         <Link to="/" className="text-2xl font-bold tracking-tight">
//           LMS Platform
//         </Link>
//         <div className="flex items-center space-x-6">
//           <form onSubmit={handleSearch} className="relative">
//             <input
//               type="text"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               placeholder="Search courses..."
//               className="w-64 p-2 pl-10 rounded-full bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-secondary transition"
//             />
//             <svg
//               className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//               xmlns="http://www.w3.org/2000/svg"
//             >
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//             </svg>
//           </form>
//           <Link to="/courses" className="text-lg font-medium hover:text-secondary transition">
//             Courses
//           </Link>
//           {user ? (
//             <>
//               {user.role === 'instructor' && (
//                 <Link to="/courses/create" className="text-lg font-medium hover:text-secondary transition">
//                   Create Course
//                 </Link>
//               )}
//               <div className="relative">
//                 <motion.button
//                   whileHover={{ scale: 1.05 }}
//                   onClick={toggleDropdown}
//                   className="flex items-center space-x-2 focus:outline-none"
//                 >
//                   <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-white font-semibold">
//                     {user.first_name ? user.first_name[0] : user.username[0]}
//                   </div>
//                   <span className="text-lg font-medium">{user.first_name || user.username}</span>
//                   <svg
//                     className={`w-5 h-5 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                     xmlns="http://www.w3.org/2000/svg"
//                   >
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
//                   </svg>
//                 </motion.button>
//                 <AnimatePresence>
//                   {isDropdownOpen && (
//                     <motion.div
//                       initial={{ opacity: 0, y: -10 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       exit={{ opacity: 0, y: -10 }}
//                       transition={{ duration: 0.2 }}
//                       className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-lg shadow-lg z-50 overflow-hidden"
//                     >
//                       <Link
//                         to="/profile"
//                         onClick={() => setIsDropdownOpen(false)}
//                         className="block px-4 py-2 hover:bg-gray-100 transition"
//                       >
//                         My Profile
//                       </Link>
//                       <Link
//                         to="/contact"
//                         onClick={() => setIsDropdownOpen(false)}
//                         className="block px-4 py-2 hover:bg-gray-100 transition"
//                       >
//                         Contact Us
//                       </Link>
//                       <button
//                         onClick={handleLogout}
//                         className="w-full text-left px-4 py-2 hover:bg-gray-100 transition"
//                       >
//                         Logout
//                       </button>
//                     </motion.div>
//                   )}
//                 </AnimatePresence>
//               </div>
//             </>
//           ) : (
//             <>
//               <Link to="/login" className="text-lg font-medium hover:text-secondary transition">
//                 Login
//               </Link>
//               <Link to="/register" className="text-lg font-medium hover:text-secondary transition">
//                 Register
//               </Link>
//             </>
//           )}
//         </div>
//       </div>
//     </motion.nav>
//   );
// };

// export default Navbar;




// import { useContext } from 'react';
// import { AuthContext } from '../context/AuthContext';
// import { Link } from 'react-router-dom';

// const Navbar = () => {
//   const { user, logout } = useContext(AuthContext);

//   return (
//     <nav>
//       <ul>
//         <li><Link to="/">Home</Link></li>
//         <li><Link to="/courses">Courses</Link></li>
//         <li><Link to="/contact">Contact</Link></li>
//         {user ? (
//           <>
//             <li><Link to="/profile">Profile</Link></li>
//             <li><button onClick={logout}>Logout</button></li>
//           </>
//         ) : (
//           <>
//             <li><Link to="/register">Register</Link></li>
//             <li><Link to="/login">Login</Link></li>
//           </>
//         )}
//       </ul>
//     </nav>
//   );
// };

// export default Navbar;


// src/components/Navbar.js
import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, error } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }

    const handleScroll = () => {
      console.log('Scroll Y:', window.scrollY); // Debug log
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, [error]);

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
    toast.success('Logged out successfully');
    navigate('/');
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const trimmedQuery = searchQuery.trim();
    if (trimmedQuery) {
      navigate(`/courses?search=${encodeURIComponent(trimmedQuery)}`);
    } else {
      navigate('/courses');
    }
  };

  return (
    <motion.nav
      initial={{ y: -50 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-black' : 'bg-black'
      }`}
      style={{zIndex: 9999}} // Subtle blur effect
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center p-4">
        {/* Logo */}
        <Link to="/" className="text-4xl font-bold text-white tracking-tight">
          cXs
        </Link>

        {/* Centered Navigation */}
        <div className="flex-1 flex justify-center space-x-6">
          <Link to="/courses" className="text-lg font-medium text-white hover:text-secondary transition">
            Courses
          </Link>
          {user && user.role === 'instructor' && (
            <Link to="/courses/create" className="text-lg font-medium text-white hover:text-secondary transition">
              Create Course
            </Link>
          )}
        </div>

        {/* Right Section (Search and User) */}
        <div className="flex items-center space-x-6">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search courses..."
              className="w-64 p-2 pl-10 rounded-full bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-secondary transition"
            />
            <svg
              className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </form>
          {user ? (
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={toggleDropdown}
                className="flex items-center space-x-2 focus:outline-none"
              >
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-white font-semibold">
                  {user.first_name ? user.first_name[0] : user.username[0]}
                </div>
                <span className="text-lg font-medium text-white">{user.first_name || user.username}</span>
                <svg
                  className={`w-5 h-5 text-white transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </motion.button>
              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-lg shadow-lg z-50 overflow-hidden"
                  >
                    <Link to="/profile" onClick={() => setIsDropdownOpen(false)} className="block px-4 py-2 hover:bg-gray-100 transition">
                      My Profile
                    </Link>
                    <Link to="/contact" onClick={() => setIsDropdownOpen(false)} className="block px-4 py-2 hover:bg-gray-100 transition">
                      Contact Us
                    </Link>
                    <button onClick={handleLogout} className="w-full text-left px-4 py-2 hover:bg-gray-100 transition">
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <>
              <Link to="/login" className="text-lg font-medium text-white hover:text-secondary transition">
                Login
              </Link>
              <Link to="/register" className="text-lg font-medium text-white hover:text-secondary transition">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;