// src/components/LogoutButton.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('userData');
    navigate('/', { replace: true });
  };

  return (
    <button
      onClick={handleLogout}
      style={{
        backgroundColor: '#e74c3c',
        border: 'none',
        color: 'white',
        padding: '8px 14px',
        borderRadius: '4px',
        cursor: 'pointer',
      }}
      title="Cerrar sesión"
    >
      Cerrar sesión
    </button>
  );
}
