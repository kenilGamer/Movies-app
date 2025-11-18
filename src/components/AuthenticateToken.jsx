import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Loading from './Loading';

function AuthenticateToken({ children }) {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    const checkToken = () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login', { replace: true });
      } else {
        setLoading(false);
      }
    };

    checkToken();
  }, [navigate]);

  // Show loading while checking token
  if (loading) {
    return <Loading />;
  }

  return <>{children}</>;
}

export default AuthenticateToken;