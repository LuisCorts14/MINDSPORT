import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Páginas

import Home from './pages/Home';
import LoginFutbolista from './pages/LoginFutbolista';
import LoginEntrenador from './pages/LoginEntrenador';
import TestIED from './pages/TestIED';
import TestIPED from './pages/TestIPED';
import ResultadosIED from './pages/ResultadosIED';
import ResultadosIPED from './pages/ResultadosIPED';

// Componentes
import PrivateRoute from './components/PrivateRoute';
import RutaDashboard from './components/RutaDashboard';

// Wrapper para el dashboard que maneja el usuario
function DashboardRouterWrapper() {
  const userStr = localStorage.getItem('userData');
  let user = null;
  try {
    user = JSON.parse(userStr);
  } catch {
    user = null;
  }
  return <RutaDashboard user={user} />;
}

// Wrapper para rutas que requieren rol futbolista
function FutbolistaRoute({ children }) {
  return (
    <PrivateRoute requiredRole="futbolista">
      {children}
    </PrivateRoute>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<Home />} />
        <Route path="/login-futbolista" element={<LoginFutbolista />} />
        <Route path="/login-entrenador" element={<LoginEntrenador />} />

        {/* Dashboard (protegido) */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <DashboardRouterWrapper />
            </PrivateRoute>
          }
        />

        {/* Tests (solo futbolistas) */}
        <Route
          path="/test-ied"
          element={
            <FutbolistaRoute>
              <TestIED />
            </FutbolistaRoute>
          }
        />
        <Route
          path="/test-iped"
          element={
            <FutbolistaRoute>
              <TestIPED />
            </FutbolistaRoute>
          }
        />

        {/* Resultados (solo futbolistas) */}
        <Route
          path="/resultados-ied"
          element={
            <FutbolistaRoute>
              <ResultadosIED />
            </FutbolistaRoute>
          }
        />
        <Route
          path="/resultados-iped"
          element={
            <FutbolistaRoute>
              <ResultadosIPED />
            </FutbolistaRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
