import React, { useState } from 'react';.0
import api from '../api';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const PurchaseCourse = () => {
  const { id } = useParams();
  const [code, setCode] = useState('');
  const navigate = useNavigate();

  const handlePurchase = async () => {
    try {
      await api.post('/courses/purchase/', { course_id: id, purchase_code: code });
      toast.success('Course purchased successfully!');
      navigate('/purchased');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Purchase failed');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Enter 5-digit Purchase Code</h2>
      <input
        type="text"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        maxLength={5}
        className="w-full border px-4 py-2 rounded mb-4"
        placeholder="e.g. 12345"
      />
      <button
        onClick={handlePurchase}
        className="bg-primary text-white px-6 py-2 rounded hover:bg-blue-600"
      >
        Purchase
      </button>
    </div>
  );
};

export default PurchaseCourse