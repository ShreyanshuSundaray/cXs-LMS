// src/components/CourseDetail.js

import React, { useState, useEffect } from 'react';
import api from '../api';
import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

const CourseDetail = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolled, setEnrolled] = useState(false);
  const [enrollLoading, setEnrollLoading] = useState(false);
  const [ratings, setRatings] = useState([]);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [ratingLoading, setRatingLoading] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await api.get(`/courses/${id}/`);
        setCourse(res.data);

        const ratingsRes = await api.get(`/courses/ratings/${id}/`);
        setRatings(ratingsRes.data);

        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
          const enrolledCourses = await api.get('/courses/enrolled/');
          const isEnrolled = enrolledCourses.data.some(course => course.id === parseInt(id));
          setEnrolled(isEnrolled);
        }
      } catch (err) {
        toast.error('Failed to fetch course details');
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id]);

  const handleEnroll = async () => {
    setEnrollLoading(true);
    try {
      await api.post(`/courses/enroll/${id}/`);
      toast.success('Successfully enrolled in the course!');
      setEnrolled(true);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to enroll in the course');
    } finally {
      setEnrollLoading(false);
    }
  };

  const handleRatingSubmit = async (e) => {
    e.preventDefault();
    if (!enrolled) {
      toast.error('You must be enrolled to rate this course');
      return;
    }
    setRatingLoading(true);
    try {
      await api.post(`/courses/rate/${id}/`, { rating, review });
      toast.success('Rating submitted successfully!');
      const ratingsRes = await api.get(`/courses/ratings/${id}/`);
      setRatings(ratingsRes.data);
      setRating(0);
      setReview('');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to submit rating');
    } finally {
      setRatingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 bg-black">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 border-4 border-t-gray-400 border-gray-800 rounded-full"
        />
      </div>
    );
  }

  if (!course) {
    return <div className="text-center text-gray-400 mt-10 bg-black">Course not found</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-3xl mx-auto mt-10 p-6 bg-gray-900 rounded-lg shadow-2xl text-gray-100 border border-gray-800"
    >
      <h2 className="text-3xl font-bold text-gray-100 mb-4">{course.title}</h2>
      <p className="text-gray-300 mb-4">{course.description}</p>
      <p className="text-gray-200 font-bold mb-2">
        Price: <span className="text-green-400">${course.price}</span>
      </p>
      <p className="text-gray-400 mb-2">Instructor: {course.instructor_name}</p>
      <div className="flex items-center mb-4">
        <span className="text-yellow-400">{'★'.repeat(Math.round(course.avg_rating))}{'☆'.repeat(5 - Math.round(course.avg_rating))}</span>
        <span className="text-gray-400 ml-2">({course.rating_count} reviews)</span>
      </div>
      {enrolled ? (
        <div className="text-green-400 font-semibold mb-4">You are enrolled in this course!</div>
      ) : (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleEnroll}
          disabled={enrollLoading}
          className={`px-6 py-2 rounded-md text-white transition ${
            enrollLoading ? 'bg-gray-700 cursor-not-allowed' : 'bg-gray-800 hover:bg-gray-700'
          }`}
        >
          {enrollLoading ? 'Enrolling...' : 'Enroll Now'}
        </motion.button>
      )}

      {enrolled && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold text-gray-100 mb-2">Rate This Course</h3>
          <form onSubmit={handleRatingSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-300">Rating (1-5)</label>
              <input
                type="number"
                min="1"
                max="5"
                value={rating}
                onChange={(e) => setRating(parseInt(e.target.value))}
                className="w-full p-2 border border-gray-700 bg-gray-800 text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-600"
                placeholder="Enter rating (1-5)"
              />
            </div>
            <div>
              <label className="block text-gray-300">Review (optional)</label>
              <textarea
                value={review}
                onChange={(e) => setReview(e.target.value)}
                className="w-full p-2 border border-gray-700 bg-gray-800 text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-600"
                placeholder="Write your review"
                rows="3"
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={ratingLoading}
              className={`px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition ${
                ratingLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {ratingLoading ? 'Submitting...' : 'Submit Rating'}
            </motion.button>
          </form>
        </div>
      )}

      <div className="mt-6">
        <h3 className="text-xl font-semibold text-gray-100 mb-2">Course Reviews</h3>
        {ratings.length === 0 ? (
          <p className="text-gray-400">No reviews yet.</p>
        ) : (
          ratings.map((rating) => (
            <div key={rating.id} className="border-t border-gray-700 pt-4 mt-4">
              <p className="text-gray-200 font-semibold">{rating.username}</p>
              <p className="text-yellow-400">{'★'.repeat(rating.rating)}{'☆'.repeat(5 - rating.rating)}</p>
              {rating.review && <p className="text-gray-400 mt-1">{rating.review}</p>}
              <p className="text-gray-500 text-sm">{new Date(rating.rated_at).toLocaleDateString()}</p>
            </div>
          ))
        )}
      </div>
    </motion.div>
  );
};

export default CourseDetail;