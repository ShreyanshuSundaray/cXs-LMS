// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { Link } from 'react-router-dom';
// import { motion } from 'framer-motion';

// const Profile = () => {
//   const [profile, setProfile] = useState(null);
//   const [certificates, setCertificates] = useState([]);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         const profileResponse = await axios.get('http://localhost:8000/api/users/profile/', {
//           headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
//         });
//         const certificatesResponse = await axios.get('http://localhost:8000/api/users/certificates/', {
//           headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
//         });
//         setProfile(profileResponse.data);
//         setCertificates(certificatesResponse.data);
//         localStorage.setItem('userName', `${profileResponse.data.first_name} ${profileResponse.data.last_name}`);
//       } catch (err) {
//         setError('Failed to fetch profile');
//       }
//     };
//     fetchProfile();
//   }, []);

//   if (!profile) return <div className="text-center text-light-text">Loading...</div>;

//   return (
//     <div className="min-h-screen bg-dark-bg p-6">
//       <motion.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ duration: 0.5 }}
//         className="max-w-4xl mx-auto"
//       >
//         <h1 className="text-4xl font-bold text-light-text mb-6">Profile</h1>
//         {error && <p className="text-red-400 mb-4">{error}</p>}
//         <div className="bg-dark-card rounded-xl p-6 mb-6 shadow-lg">
//           <p className="text-gray-300">Username: {profile.username}</p>
//           <p className="text-gray-300">Email: {profile.email}</p>
//           <p className="text-gray-300">Name: {profile.first_name} {profile.last_name}</p>
//           <p className="text-gray-300">Role: {profile.role}</p>
//         </div>
//         <h2 className="text-2xl font-semibold text-light-text mb-4">Certificates</h2>
//         <div className="space-y-4">
//           {certificates.map((certificate) => (
//             <div key={certificate.id} className="bg-dark-card p-4 rounded-lg">
//               <p className="text-gray-300">Course: {certificate.course_title}</p>
//               <p className="text-gray-300">Date Issued: {new Date(certificate.date_issued).toLocaleDateString()}</p>
//               <Link
//                 to={`/certificate/${certificate.id}`}
//                 className="inline-block px-4 py-2 bg-secondary text-white rounded-lg hover:bg-accent transition-colors"
//               >
//                 View Certificate
//               </Link>
//             </div>
//           ))}
//         </div>
//       </motion.div>
//     </div>
//   );
// };

// export default Profile;



import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../api';
import toast from 'react-hot-toast';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [createdCourses, setCreatedCourses] = useState([]);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const userRes = await api.get('/users/profile/');
        setUser(userRes.data);

        if (userRes.data.role === 'student') {
          const enrolledRes = await api.get('/courses/enrolled-courses/');
          setEnrolledCourses(enrolledRes.data);
        } else if (userRes.data.role === 'instructor') {
          const createdRes = await api.get('/courses/created-courses/');
          setCreatedCourses(createdRes.data);
        }
      } catch (err) {
        toast.error('Failed to load profile data');
      }
    };

    fetchProfileData();
  }, []);

  if (!user) {
    return <div className="text-center py-10">Loading...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-lg shadow-lg p-6 mb-8"
      >
        <div className="flex items-center space-x-6">
          <div className="w-24 h-24 rounded-full bg-secondary flex items-center justify-center text-white text-3xl font-semibold">
            {user.first_name ? user.first_name[0] : user.username[0]}
          </div>
          <div>
            <h2 className="text-3xl font-bold">{user.first_name} {user.last_name}</h2>
            <p className="text-text-secondary">{user.email}</p>
            <p className="text-sm font-medium text-primary capitalize">{user.role}</p>
          </div>
        </div>
      </motion.div>

      {user.role === 'student' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h3 className="text-2xl font-semibold mb-4">My Enrolled Courses</h3>
          {enrolledCourses.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrolledCourses.map((course) => (
                <div key={course.id} className="card bg-card-bg rounded-lg overflow-hidden shadow-lg">
                  <div className="h-40 bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500">Course Image</span>
                  </div>
                  <div className="p-4">
                    <span className="inline-block bg-secondary text-white text-xs px-2 py-1 rounded-full mb-2">
                      {course.category}
                    </span>
                    <h4 className="text-lg font-semibold mb-2">{course.title}</h4>
                    <p className="text-text-secondary text-sm mb-2 line-clamp-2">{course.description}</p>
                    <p className="text-sm text-gray-600">By {course.instructor_name}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">You haven't enrolled in any courses yet.</p>
          )}
        </motion.div>
      )}

      {user.role === 'instructor' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h3 className="text-2xl font-semibold mb-4">My Created Courses</h3>
          {createdCourses.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {createdCourses.map((course) => (
                <div key={course.id} className="card bg-card-bg rounded-lg overflow-hidden shadow-lg">
                  <div className="h-40 bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500">Course Image</span>
                  </div>
                  <div className="p-4">
                    <span className="inline-block bg-secondary text-white text-xs px-2 py-1 rounded-full mb-2">
                      {course.category}
                    </span>
                    <h4 className="text-lg font-semibold mb-2">{course.title}</h4>
                    <p className="text-text-secondary text-sm mb-2 line-clamp-2">{course.description}</p>
                    <p className="text-lg font-bold">${course.price}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">You haven't created any courses yet.</p>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default Profile;