// src/components/LogoutButton.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import UnifiedButton from './UnifiedButton';

export default function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('userData');
    navigate('/', { replace: true });
  };

  return (
    <UnifiedButton
      onClick={handleLogout}
      variant="danger"
      size="small"
      title="Cerrar sesión"
    >
      Cerrar sesión
    </UnifiedButton>
  );
}
