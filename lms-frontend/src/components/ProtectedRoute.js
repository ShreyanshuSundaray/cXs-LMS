// import React from 'react';
// import { Navigate, useLocation } from 'react-router-dom';
// import toast from 'react-hot-toast';

// const ProtectedRoute = ({ requiredRole, children }) => {
//   const user = JSON.parse(localStorage.getItem('user'));
//   const location = useLocation();

//   // Prevent logged-in users from accessing login/register pages
//   if (user && (location.pathname === '/login' || location.pathname === '/register')) {
//     return <Navigate to="/courses" />;
//   }

//   // Require authentication for protected routes
//   if (!user) {
//     toast.error('Please log in to access this page');
//     return <Navigate to="/login" />;
//   }

//   // Enforce role-based access
//   if (requiredRole && user.role !== requiredRole) {
//     toast.error(`Only ${requiredRole}s can access this page`);
//     return <Navigate to="/courses" />;
//   }

//   return children;
// };

// export default ProtectedRoute;



import { Navigate, useLocation } from 'react-router-dom'; // Added useLocation import
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';

const ProtectedRoute = ({ requiredRole, children }) => {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  // Avoid redirect loop or toast spam if already on login/register
  if (user && (location.pathname === '/login' || location.pathname === '/register')) {
    return <Navigate to="/courses" replace />;
  }

  if (!user) {
    toast.error('Please log in to access this page', { duration: 3000 }); // Single toast with duration
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    toast.error(`Only ${requiredRole}s can access this page`, { duration: 3000 }); // Single toast with duration
    return <Navigate to="/courses" replace />;
  }

  return children;
};

export default ProtectedRoute;
