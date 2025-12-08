import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const userStr = localStorage.getItem('userData');
  let user = null;
  
  try {
    user = JSON.parse(userStr);
  } catch {
    console.log('Error parsing userData, redirecting to home');
    user = null;
  }

  // Verificar que exista usuario y token
  if (!user || !user.token) {
    console.log('No user or token found, redirecting to home');
    return <Navigate to="/" replace />;
  }

  // Verificar si el token no ha expirado (opcional)
  if (user.token && user.token.startsWith('ey')) {
    try {
      const tokenData = JSON.parse(atob(user.token.split('.')[1]));
      const expirationTime = tokenData.exp * 1000;
      if (Date.now() >= expirationTime) {
        console.log('Token expired, clearing localStorage');
        localStorage.removeItem('userData');
        return <Navigate to="/" replace />;
      }
    } catch (e) {
      console.log('Error validating token:', e);
    }
  }

  console.log('User authenticated successfully:', { id: user.id, rol: user.rol, nombre: user.nombre });
  return children;
};

export default PrivateRoute;