import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';

const Quiz = () => {
  const { quizId } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/courses/quizzes/${quizId}/`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setQuiz(response.data);
      } catch (err) {
        setError('Failed to fetch quiz');
      }
    };
    fetchQuiz();
  }, [quizId]);

  const handleAnswerChange = (questionId, answer) => {
    setAnswers({ ...answers, [questionId]: answer });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let calculatedScore = 0;
    quiz.questions.forEach((question) => {
      if (answers[question.id] === question.correct_answer) {
        calculatedScore += 1;
      }
    });

    try {
      await axios.post(
        'http://localhost:8000/api/courses/quiz-attempts/',
        {
          quiz: quizId,
          score: calculatedScore,
          total_questions: quiz.questions.length,
        },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setScore(calculatedScore);
    } catch (err) {
      setError('Failed to submit quiz');
    }
  };

  if (!quiz) return <div className="text-center text-light-text">Loading...</div>;

  return (
    <div className="min-h-screen bg-dark-bg p-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl mx-auto"
      >
        <h1 className="text-4xl font-bold text-light-text mb-6">{quiz.title}</h1>
        {error && <p className="text-red-400 mb-4">{error}</p>}
        {score !== null ? (
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-light-text">
              Your Score: {score} / {quiz.questions.length}
            </h2>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {quiz.questions.map((question) => (
              <div key={question.id} className="bg-dark-card p-4 rounded-lg">
                <p className="text-light-text mb-2">{question.text}</p>
                {question.options.map((option, index) => (
                  <div key={index} className="flex items-center mb-2">
                    <input
                      type="radio"
                      name={`question-${question.id}`}
                      value={option}
                      onChange={() => handleAnswerChange(question.id, option)}
                      className="mr-2"
                    />
                    <label className="text-gray-300">{option}</label>
                  </div>
                ))}
              </div>
            ))}
            <button
              type="submit"
              className="w-full p-3 bg-gradient-to-r from-secondary to-accent text-white rounded-lg font-semibold hover:from-accent hover:to-secondary transition-all"
            >
              Submit Quiz
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
};

export default Quiz;