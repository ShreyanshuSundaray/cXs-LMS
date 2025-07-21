import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const accessToken = localStorage.getItem('accessToken');
  const refreshToken = localStorage.getItem('refreshToken');

  const setAxiosAuthHeader = (token) => {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  };

  const clearAuth = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    setError(null);
  };

  const refreshAccessToken = async () => {
    try {
      const res = await axios.post('http://localhost:8000/api/users/refresh/', {
        refresh: refreshToken,
      });

      const newAccess = res.data.access;
      localStorage.setItem('accessToken', newAccess);
      setAxiosAuthHeader(newAccess);
      return newAccess;
    } catch (err) {
      console.error('Refresh failed:', err);
      clearAuth();
      return null;
    }
  };

  const fetchUser = async () => {
    try {
      setAxiosAuthHeader(accessToken);
      const res = await axios.get('http://localhost:8000/api/users/profile/');
      setUser(res.data.user || res.data);
    } catch (err) {
      if (err.response?.status === 401 && refreshToken) {
        const newToken = await refreshAccessToken();
        if (newToken) {
          try {
            const res = await axios.get('http://localhost:8000/api/users/profile/');
            setUser(res.data.user || res.data);
          } catch (e) {
            console.error('Failed after refresh:', e);
            clearAuth();
          }
        }
      } else {
        clearAuth();
        console.error('Auth error:', err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (accessToken && refreshToken) {
      fetchUser();
    } else {
      setLoading(false);
    }
    // eslint-disable-next-line
  }, []);

  const login = (data) => {
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    localStorage.setItem('user', JSON.stringify(data.user));
    setAxiosAuthHeader(data.accessToken);
    setUser(data.user);
  };

  const logout = () => {
    clearAuth();
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
};
