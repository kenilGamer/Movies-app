import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { children } from 'react';

function AuthenticateToken({ children }) {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
    }
  }, []);

  return children;
}

export default AuthenticateToken;