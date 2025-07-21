

// import React, { useState, useEffect } from 'react';
// import { Link, useLocation } from 'react-router-dom';
// import { motion } from 'framer-motion';
// import api from '../api';
// import toast from 'react-hot-toast';

// const CourseList = () => {
//   const [courses, setCourses] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [selectedCategory, setSelectedCategory] = useState('');
//   const location = useLocation();

//   useEffect(() => {
//     const fetchCourses = async () => {
//       try {
//         const searchParams = new URLSearchParams(location.search);
//         const searchQuery = searchParams.get('search') || '';
//         const category = searchParams.get('category') || selectedCategory;

//         const res = await api.get('/courses/', {
//           params: { search: searchQuery, category }
//         });
//         setCourses(res.data.courses);
//         setCategories(['All', ...res.data.categories]);
//       } catch (err) {
//         toast.error('Failed to load courses');
//       }
//     };

//     fetchCourses();
//   }, [location.search, selectedCategory]);

//   const handleCategoryChange = (category) => {
//     if (category === 'All') {
//       setSelectedCategory('');
//     } else {
//       setSelectedCategory(category);
//     }
//   };

//   return (
//     <div className="max-w-7xl mx-auto py-10 px-4">
//       <h2 className="text-4xl font-bold text-center mb-8">Explore Our Courses</h2>
//       <div className="mb-6 flex justify-center">
//         <div className="inline-flex rounded-lg shadow-sm bg-white p-1">
//           {categories.map((category) => (
//             <button
//               key={category}
//               onClick={() => handleCategoryChange(category)}
//               className={`px-4 py-2 text-sm font-medium transition ${
//                 (category === 'All' && !selectedCategory) || selectedCategory === category
//                   ? 'bg-primary text-white'
//                   : 'bg-white text-gray-700 hover:bg-gray-100'
//               } ${category === 'All' ? 'rounded-l-lg' : ''} ${
//                 category === categories[categories.length - 1] ? 'rounded-r-lg' : ''
//               }`}
//             >
//               {category}
//             </button>
//           ))}
//         </div>
//       </div>
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//         {courses.length > 0 ? (
//           courses.map((course) => (
//             <motion.div
//               key={course.id}
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.3 }}
//               className="card bg-card-bg rounded-lg overflow-hidden shadow-lg"
//             >
//               <div className="h-48 bg-gray-200 flex items-center justify-center">
//                 <span className="text-gray-500">Course Image</span>
//               </div>
//               <div className="p-4">
//                 <span className="inline-block bg-secondary text-white text-xs px-2 py-1 rounded-full mb-2">
//                   {course.category}
//                 </span>
//                 <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
//                 <p className="text-text-secondary text-sm mb-2 line-clamp-2">{course.description}</p>
//                 <div className="flex items-center mb-2">
//                   <span className="text-yellow-400 mr-1">★</span>
//                   <span className="text-sm font-medium">{course.avg_rating} ({course.rating_count})</span>
//                 </div>
//                 <p className="text-sm text-gray-600 mb-2">By {course.instructor_name}</p>
//                 <p className="text-lg font-bold mb-4">${course.price}</p>
//                 <Link to={`/courses/${course.id}`} className="btn-primary inline-block">
//                   View Details
//                 </Link>
//               </div>
//             </motion.div>
//           ))
//         ) : (
//           <p className="text-center text-gray-600 col-span-full">No courses found.</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default CourseList;


// src/components/CourseList.js
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../api';
import toast from 'react-hot-toast';

// Import local images from src/assets
import PythonCourse from '../assets/python_cpourse.png';
import MachineLearningCourse from '../assets/machine learning.jpg';
import MERNCourse from '../assets/mern_stack.gif';
import DataAnalyticsCourse from '../assets/data_analytics.jpeg';
import FrontendCourse from '../assets/front-end.jpeg';
import JavaCourse from '../assets/java.jpeg';
import Navbar from './Navbar';

// Manual image mapping by course ID
const courseImageMap = {
  1: PythonCourse,
  2: MachineLearningCourse,
  3: MERNCourse,
  4: DataAnalyticsCourse,
  5: FrontendCourse,
  7: JavaCourse,
};

// Fallback image mapping by category
const fallbackImages = {
  Technology: 'https://source.unsplash.com/400x200/?technology',
  Uncategorized: 'https://source.unsplash.com/400x200/?education',
  default: 'https://source.unsplash.com/400x200/?course',
};

const CourseList = ({ home = false }) => {
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const location = useLocation();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        console.log('Fetching courses...'); // Debug log
        const searchParams = new URLSearchParams(location.search);
        const searchQuery = searchParams.get('search') || '';
        const category = searchParams.get('category') || selectedCategory;

        const res = await api.get('/courses/', {
          params: { search: searchQuery, category },
        });
        console.log('Courses data:', res.data); // Log the raw response
        // Adjust based on actual data structure
        const courseData = Array.isArray(res.data) ? res.data : res.data.courses || [];
        const categoryData = res.data.categories || [];
        setCourses(courseData);
        setCategories(['All', ...categoryData]);
      } catch (err) {
        toast.error('Failed to load courses');
        console.error('Fetch error:', err);
      }
    };

    fetchCourses();
  }, [location.search, selectedCategory]);

  const handleCategoryChange = (category) => {
    if (category === 'All') {
      setSelectedCategory('');
    } else {
      setSelectedCategory(category);
    }
  };

  const getCourseImage = (course) => {
    return courseImageMap[course.id] || fallbackImages[course.category] || fallbackImages.default;
  };

  return (
    <div>
    <Navbar />
    <div className="max-w-7xl mx-auto py-20 px-4">
      <h2 className="text-4xl font-bold text-center mb-8 text-gold">Explore Our Courses</h2>
      <div className="mb-6 flex justify-center">
        <div className="inline-flex rounded-lg shadow-sm bg-white p-1">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={`px-4 py-2 text-sm font-medium transition ${
                (category === 'All' && !selectedCategory) || selectedCategory === category
                  ? 'bg-primary text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              } ${category === 'All' ? 'rounded-l-lg' : ''} ${
                category === categories[categories.length - 1] ? 'rounded-r-lg' : ''
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.length > 0 ? (
          courses.map((course) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-gray-800 rounded-lg overflow-hidden shadow-lg border border-gold"
            >
              <div className="h-48">
                <img
                  src={getCourseImage(course)}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <span className="inline-block bg-secondary text-white text-xs px-2 py-1 rounded-full mb-2">
                  {course.category}
                </span>
                <h3 className="text-xl font-semibold mb-2 text-white">{course.title}</h3>
                <p className="text-gray-300 text-sm mb-2 line-clamp-2">{course.description}</p>
                <div className="flex items-center mb-2">
                  <span className="text-yellow-400 mr-1">★</span>
                  <span className="text-sm font-medium text-gray-300">{course.avg_rating} ({course.rating_count})</span>
                </div>
                <p className="text-sm text-gray-400 mb-2">By {course.instructor_name}</p>
                <p className="text-lg font-bold text-gold mb-4">${course.price}</p>
                <Link to={`/courses/${course.id}`} className="inline-block bg-primary text-white px-4 py-2 rounded-lg hover:bg-secondary transition">
                  View Details
                </Link>
              </div>
            </motion.div>
          ))
        ) : (
          <p className="text-center text-gray-300 col-span-full">No courses found.</p>
        )}
      </div>
    </div>
</div>
  );
};

export default CourseList;