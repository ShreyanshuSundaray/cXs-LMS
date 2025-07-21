import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Lessons = () => {
  const { courseId } = useParams();
  const [lessons, setLessons] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/courses/${courseId}/lessons/`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setLessons(response.data);
      } catch (err) {
        setError('Failed to fetch lessons');
      }
    };
    fetchLessons();
  }, [courseId]);

  const handleComplete = async (lessonId) => {
    try {
      await axios.post(
        `http://localhost:8000/api/courses/progress/${lessonId}/`,
        { completed: true },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      alert('Lesson marked as completed!');
    } catch (err) {
      setError('Failed to mark lesson as completed');
    }
  };

  const cardVariants = {
    hover: { scale: 1.05, boxShadow: '0 0 20px rgba(59, 130, 246, 0.3)', transition: { duration: 0.3 } },
  };

  return (
    <div className="min-h-screen bg-dark-bg p-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        <h1 className="text-4xl font-bold text-light-text mb-6">Lessons</h1>
        {error && <p className="text-red-400 mb-4">{error}</p>}
        <div className="space-y-6">
          {lessons.map((lesson) => (
            <motion.div
              key={lesson.id}
              variants={cardVariants}
              whileHover="hover"
              className="bg-dark-card rounded-xl p-6 shadow-lg"
            >
              <h2 className="text-xl font-semibold text-light-text mb-2">{lesson.title}</h2>
              <p className="text-gray-400 mb-2">Type: {lesson.lesson_type}</p>
              <p className="text-gray-400 mb-4">{lesson.content}</p>
              {lesson.lesson_type === 'quiz' ? (
                <Link
                  to={`/quiz/${lesson.quizzes[0]?.id}`}
                  className="inline-block px-4 py-2 bg-secondary text-white rounded-lg hover:bg-accent transition-colors"
                >
                  Take Quiz
                </Link>
              ) : (
                <button
                  onClick={() => handleComplete(lesson.id)}
                  className="inline-block px-4 py-2 bg-secondary text-white rounded-lg hover:bg-accent transition-colors"
                >
                  Mark as Completed
                </button>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Lessons;