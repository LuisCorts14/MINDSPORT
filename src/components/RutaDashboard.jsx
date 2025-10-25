import React from 'react';
import { Navigate } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';               // Dashboard futbolista
import DashboardEntrenador from '../pages/DashboardEntrenador';

export default function RutaDashboard({ user }) {
  console.log('RutaDashboard - Usuario:', user); // Debug

  if (!user || !user.rol) {
    console.log('RutaDashboard - Sin usuario o rol, redirigiendo a home');
    return <Navigate to="/" replace />;
  }

  console.log('RutaDashboard - Rol del usuario:', user.rol); // Debug

  if (user.rol === 'futbolista') {
    return <Dashboard />;
  }
  if (user.rol === 'entrenador') {
    return <DashboardEntrenador />;
  }

  console.log('RutaDashboard - Rol no reconocido:', user.rol); // Debug
  return <Navigate to="/" replace />;
}