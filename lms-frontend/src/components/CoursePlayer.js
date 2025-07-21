import React, { useState, useEffect } from 'react';
import api from '../api';
import { useParams } from 'react-router-dom';
import ReactPlayer from 'react-player';

const lessons = [
  { id: 1, title: 'Intro to Course', url: 'https://www.example.com/video1.mp4' },
  { id: 2, title: 'Deep Dive', url: 'https://www.example.com/video2.mp4' },
];

const CoursePlayer = () => {
  const { id } = useParams();
  const [current, setCurrent] = useState(lessons[0]);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const fetchProgress = async () => {
      const res = await api.get(`/courses/progress/${id}/`);
      setProgress(res.data.progress);
    };
    fetchProgress();
  }, [id]);

  const updateProgress = async (value) => {
    await api.post('/courses/progress/update/', { course_id: id, progress: value });
    setProgress(value);
  };

  return (
    <div className="flex">
      <div className="w-3/4 p-4">
        <h2 className="text-2xl font-bold mb-2">{current.title}</h2>
        <ReactPlayer url={current.url} controls width="100%" height="360px" />
        <input
          type="range"
          min="0"
          max="100"
          value={progress}
          onChange={(e) => updateProgress(parseInt(e.target.value))}
          className="mt-4 w-full"
        />
        <p className="text-sm">Progress: {progress}%</p>
      </div>
      <div className="w-1/4 bg-gray-100 p-4">
        <h3 className="font-bold mb-2">Lessons</h3>
        {lessons.map((lesson) => (
          <div
            key={lesson.id}
            onClick={() => setCurrent(lesson)}
            className={`p-2 cursor-pointer ${current.id === lesson.id ? 'bg-primary text-white' : ''}`}
          >
            {lesson.title}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CoursePlayer;
