import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Course = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const courseResponse = await axios.get(`http://localhost:8000/api/courses/${id}/`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        const reviewsResponse = await axios.get(`http://localhost:8000/api/courses/${id}/reviews/`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setCourse(courseResponse.data);
        setReviews(reviewsResponse.data);
      } catch (err) {
        setError('Failed to fetch course details');
      }
    };
    fetchCourse();
  }, [id]);

  const handleEnroll = async () => {
    try {
      await axios.post(
        'http://localhost:8000/api/courses/enrollments/',
        { course: id },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      alert('Enrolled successfully!');
    } catch (err) {
      setError('Failed to enroll');
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `http://localhost:8000/api/courses/${id}/reviews/`,
        newReview,
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setNewReview({ rating: 5, comment: '' });
      const reviewsResponse = await axios.get(`http://localhost:8000/api/courses/${id}/reviews/`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setReviews(reviewsResponse.data);
    } catch (err) {
      setError('Failed to submit review');
    }
  };

  if (!course) return <div className="text-center text-light-text">Loading...</div>;

  return (
    <div className="min-h-screen bg-dark-bg p-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        <h1 className="text-4xl font-bold text-light-text mb-4">{course.title}</h1>
        <p className="text-gray-400 mb-4">{course.description}</p>
        <p className="text-gray-300 mb-4">Instructor: {course.instructor.username}</p>
        <p className="text-gray-300 mb-6">Price: ${course.price}</p>
        {error && <p className="text-red-400 mb-4">{error}</p>}
        <div className="flex space-x-4 mb-6">
          <button
            onClick={handleEnroll}
            className="px-6 py-3 bg-gradient-to-r from-secondary to-accent text-white rounded-lg font-semibold hover:from-accent hover:to-secondary transition-all"
          >
            Enroll Now
          </button>
          <Link
            to={`/course/${id}/lessons`}
            className="px-6 py-3 bg-gray-700 text-white rounded-lg font-semibold hover:bg-gray-600 transition-all"
          >
            View Lessons
          </Link>
        </div>
        <h2 className="text-2xl font-semibold text-light-text mb-4">Reviews</h2>
        <div className="space-y-4 mb-6">
          {reviews.map((review) => (
            <div key={review.id} className="bg-dark-card p-4 rounded-lg">
              <p className="text-gray-300">Rating: {review.rating} / 5</p>
              <p className="text-gray-400">{review.comment}</p>
              <p className="text-gray-500 text-sm">By {review.user.username}</p>
            </div>
          ))}
        </div>
        <h2 className="text-2xl font-semibold text-light-text mb-4">Add a Review</h2>
        <form onSubmit={handleReviewSubmit} className="space-y-4">
          <div>
            <label className="block mb-2 text-light-text">Rating</label>
            <select
              name="rating"
              value={newReview.rating}
              onChange={(e) => setNewReview({ ...newReview, rating: parseInt(e.target.value) })}
              className="w-full p-3 bg-gray-800 text-light-text border border-gray-700 rounded-lg"
            >
              {[1, 2, 3, 4, 5].map((num) => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-2 text-light-text">Comment</label>
            <textarea
              name="comment"
              value={newReview.comment}
              onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
              placeholder="Write your review..."
              className="w-full p-3 bg-gray-800 text-light-text border border-gray-700 rounded-lg"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-gradient-to-r from-secondary to-accent text-white rounded-lg font-semibold hover:from-accent hover:to-secondary transition-all"
          >
            Submit Review
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default Course;