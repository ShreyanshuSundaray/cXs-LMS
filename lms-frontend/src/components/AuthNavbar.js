// src/components/AuthNavbar.js
import React from 'react';
import { Link } from 'react-router-dom';

const AuthNavbar = () => (
  <nav className="bg-black p-4 fixed top-0 w-full z-50 shadow-md">
    <div className="max-w-7xl mx-auto flex justify-between items-center">
      <Link to="/" className="text-3xl font-bold text-white">cXs</Link>
      <Link to="/" className="text-white text-lg hover:text-yellow-400">Home</Link>
    </div>
  </nav>
);

export default AuthNavbar;
