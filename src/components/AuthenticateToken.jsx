import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Loading from './Loading';

function AuthenticateToken({ children }) {
  document.title = "Godcrfts | Token";
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    } else {
      setLoading(false);
    }
  }, [navigate]);

  if (loading) return <Loading/>; // Display a loading state while checking

  return children;
}

export default AuthenticateToken;
