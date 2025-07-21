
// import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
// import { useContext, useEffect } from 'react';
// import { AuthContext, AuthProvider } from './context/AuthContext';
// import { Toaster } from 'react-hot-toast';
// import Navbar from './components/Navbar';
// import Register from './components/Register';
// import Login from './components/Login';
// import CourseList from './components/CourseList';
// import CourseDetail from './components/CourseDetail';
// import CourseCreate from './components/CourseCreate';
// import ProtectedRoute from './components/ProtectedRoute';
// import Profile from './components/Profile';
// import Contact from './components/Contact';
// import Slider from 'react-slick';
// import 'slick-carousel/slick/slick.css';
// import 'slick-carousel/slick/slick-theme.css';
// import { motion } from 'framer-motion';

// const AppContent = () => {
//   const { user, loading } = useContext(AuthContext);
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (user && window.location.pathname === '/login') {
//       navigate('/courses', { replace: true });
//     }
//   }, [user, navigate]);

//   if (loading) return <div>Loading...</div>;

//   // Carousel Settings
//   const carouselSettings = {
//     dots: true,
//     infinite: true,
//     speed: 500,
//     slidesToShow: 1,
//     slidesToScroll: 1,
//     autoplay: true,
//     autoplaySpeed: 3000,
//   };

//   // Advertisement Slides
//   const ads = [
//     { id: 1, title: 'Special Offer!', desc: 'Get 20% off all courses this month!', img: '/ad1.jpg' },
//     { id: 2, title: 'New Courses!', desc: 'Explore our latest additions!', img: '/ad2.jpg' },
//     { id: 3, title: 'Free Trial!', desc: 'Try any course for 7 days free!', img: '/ad3.jpg' },
//   ];

//   return (
//     <div
//       className="min-h-screen bg-cover bg-center"
//       style={{ backgroundImage: `url(/background.jpg)` }}
//     >
//       <Toaster position="top-right" />
//       <Navbar />
//       {/* Advertisement Section */}
//       <section className="py-12 px-4 md:px-12 bg-opacity-90 bg-black text-white">
//         <h2 className="text-3xl font-bold text-center mb-8 text-gold">Featured Promotions</h2>
//         <Slider {...carouselSettings}>
//           {ads.map((ad) => (
//             <div key={ad.id} className="relative h-64 overflow-hidden rounded-lg shadow-lg">
//               <img
//                 src={ad.img}
//                 alt={ad.title}
//                 className="w-full h-full object-cover"
//               />
//               <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
//                 <div className="text-center p-4">
//                   <h3 className="text-2xl font-semibold">{ad.title}</h3>
//                   <p className="mt-2">{ad.desc}</p>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </Slider>
//       </section>

//       {/* About Us Section */}
//       <section className="py-16 px-4 md:px-12 bg-gray-900 text-white">
//         <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
//           <motion.div
//             initial={{ opacity: 0, x: -100 }}
//             whileInView={{ opacity: 1, x: 0 }}
//             transition={{ duration: 0.8 }}
//             className="md:w-1/2"
//           >
//             <h2 className="text-4xl font-bold mb-6 text-gold">About Us</h2>
//             <p className="text-lg leading-relaxed">
//               Welcome to LMS Platform, your premier destination for online learning. We are dedicated to empowering students and instructors with cutting-edge courses and a seamless learning experience. Our mission is to inspire growth and innovation through education.
//             </p>
//             <p className="mt-4 text-lg">
//               With a team of expert educators and state-of-the-art technology, we ensure every learner achieves their full potential. Join us today!
//             </p>
//           </motion.div>
//           <motion.div
//             initial={{ opacity: 0, scale: 0.8 }}
//             whileInView={{ opacity: 1, scale: 1 }}
//             transition={{ duration: 0.8 }}
//             className="md:w-1/2"
//           >
//             <img
//               src="/about-image.jpg"
//               alt="About Us"
//               className="rounded-lg shadow-2xl w-full h-auto object-cover transform hover:scale-105 transition duration-300"
//             />
//           </motion.div>
//         </div>
//       </section>

//       {/* Course Cards Section */}
//       <section className="py-16 px-4 md:px-12 bg-opacity-90 bg-black text-white">
//         <h2 className="text-3xl font-bold text-center mb-12 text-gold">Explore Our Courses</h2>
//         <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
//           <motion.div
//             whileHover={{ scale: 1.05, rotate: 1 }}
//             className="bg-gray-800 p-6 rounded-lg shadow-xl border border-gold hover:bg-gray-700 transition duration-300"
//           >
//             <h3 className="text-xl font-semibold mb-2 text-white">Python Basics</h3>
//             <p className="text-gray-300">Master the fundamentals of Python programming.</p>
//             <p className="mt-4 text-gold font-medium">$49.99</p>
//           </motion.div>
//           <motion.div
//             whileHover={{ scale: 1.05, rotate: 1 }}
//             className="bg-gray-800 p-6 rounded-lg shadow-xl border border-gold hover:bg-gray-700 transition duration-300"
//           >
//             <h3 className="text-xl font-semibold mb-2 text-white">Web Development</h3>
//             <p className="text-gray-300">Build stunning websites with modern tools.</p>
//             <p className="mt-4 text-gold font-medium">$79.99</p>
//           </motion.div>
//           <motion.div
//             whileHover={{ scale: 1.05, rotate: 1 }}
//             className="bg-gray-800 p-6 rounded-lg shadow-xl border border-gold hover:bg-gray-700 transition duration-300"
//           >
//             <h3 className="text-xl font-semibold mb-2 text-white">Data Science</h3>
//             <p className="text-gray-300">Dive into data analysis and visualization.</p>
//             <p className="mt-4 text-gold font-medium">$99.99</p>
//           </motion.div>
//         </div>
//       </section>

//       <Routes>
//         <Route path="/register" element={<Register />} />
//         <Route
//           path="/login"
//           element={user ? <Navigate to="/courses" replace /> : <Login />}
//         />
//         <Route path="/courses" element={<CourseList />} />
//         <Route path="/courses/:id" element={<CourseDetail />} />
//         <Route
//           path="/courses/create"
//           element={
//             <ProtectedRoute requiredRole="instructor">
//               <CourseCreate />
//             </ProtectedRoute>
//           }
//         />
//         <Route path="/profile" element={<Profile />} />
//         <Route path="/contact" element={<Contact />} />
//         <Route path="/" element={<Navigate to="/courses" replace />} />
//         <Route path="*" element={<Navigate to={user ? "/courses" : "/login"} replace />} />
//       </Routes>
//     </div>
//   );
// };

// function App() {
//   return (
//     <BrowserRouter>
//       <AuthProvider>
//         <AppContent />
//       </AuthProvider>
//     </BrowserRouter>
//   );
// }

// export default App;





// App.js

import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useContext, useEffect } from 'react';
import { AuthContext, AuthProvider } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import CourseList from './components/CourseList';
import CourseDetail from './components/CourseDetail';
import CourseCreate from './components/CourseCreate';
import ProtectedRoute from './components/ProtectedRoute';
import Profile from './components/Profile';
import Contact from './components/Contact';
import Login from './components/Login';
import Register from './components/Register';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const HomeContent = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user && (window.location.pathname === '/login' || window.location.pathname === '/register')) {
      navigate('/courses', { replace: true });
    }
  }, [user, navigate]);

  const carouselSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  const ads = [
    { id: 1, title: 'Special Offer!', desc: 'Get 20% off all courses!', img: '/assets/python_cpourse.png' },
    { id: 2, title: 'New Courses!', desc: 'Explore our latest additions!', img: '/ad2.jpg' },
    { id: 3, title: 'Free Trial!', desc: 'Try any course for 7 days free!', img: '/assets/machine learning.jpg' },
  ];

  return (
    <div>
      <Navbar />
      {/* Carousel */}
      <section className="pt-20 pb-20 px-4 md:px-12 bg-black text-white">
        <h2 className="text-3xl font-bold text-center mb-8 text-yellow-400">Featured Promotions</h2>
        <Slider {...carouselSettings}>
          {ads.map((ad) => (
            <div key={ad.id} className="relative h-64 overflow-hidden rounded-lg shadow-lg">
              <img src={ad.img} alt={ad.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black bg-opacity-10 flex items-center justify-center">
                <div className="text-center p-4">
                  <h3 className="text-2xl font-semibold">{ad.title}</h3>
                  <p className="mt-2">{ad.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </section>


      {/* About Us */}
      <section className="py-20 px-4 md:px-12 bg-gray-100 text-gray-800">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">About Us</h2>
          <p className="text-lg leading-relaxed">
            Welcome to LMS Platform — your go-to destination for quality online education. We empower learners and instructors to connect through interactive, flexible, and high-value digital courses.
          </p>
          <p className="mt-4 text-lg leading-relaxed">
            Our mission is to provide accessible and impactful learning experiences to help individuals and teams grow professionally and personally.
          </p>
        </div>
      </section>

      {/* Courses */}
      <section className="py-16 px-4 md:px-12 bg-white text-black">
        <CourseList home={true} />
      </section>
    </div>
  );
};


const AppContent = () => {
  const { user, error } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (user && location.pathname === '/') {
      navigate('/courses', { replace: true });
    }
  }, [user, navigate, location.pathname]);

  if (error) return <div className="text-center mt-10 text-red-500">Error: {error}</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <Toaster position="top-right" />
      {/* <Navbar /> */}
      <Routes>
        <Route path="/" element={<HomeContent />} />
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/courses" replace />} />
        <Route path="/register" element={!user ? <Register /> : <Navigate to="/courses" replace />} />
        <Route path="/courses" element={<CourseList />} />
        <Route path="/courses/:id" element={<CourseDetail />} />
        <Route path="/courses/create" element={<ProtectedRoute requiredRole="instructor"><CourseCreate /></ProtectedRoute>} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

