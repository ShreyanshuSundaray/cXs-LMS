// src/components/ErrorBoundary.js

import React from 'react';
import toast from 'react-hot-toast';

class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    toast.error('An unexpected error occurred. Please try again.');
    console.error('Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1 className="text-center text-red-500 mt-10">Something went wrong.</h1>;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;