import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const userStr = localStorage.getItem('userData');
  let user = null;
  try {
    user = JSON.parse(userStr);
  } catch {
    user = null;
  }

  // Verificar que exista usuario, nombre y token
  if (!user || !user.nombre || !user.token) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PrivateRoute;