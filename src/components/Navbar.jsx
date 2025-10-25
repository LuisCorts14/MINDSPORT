import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const user = JSON.parse(localStorage.getItem('userData'));
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('userData');
    navigate('/');
  };

  return (
    <nav style={{ padding: 16, borderBottom: '1px solid #ccc', display: 'flex', gap: 16 }}>
      <Link to="/">Inicio</Link>
      {user && <Link to="/dashboard">Dashboard</Link>}

      {user ? (
        <button onClick={handleLogout} style={{ marginLeft: 'auto' }}>
          Cerrar sesión
        </button>
      ) : (
        <div style={{ marginLeft: 'auto' }}>
          <Link to="/loginfutbolista" style={{ marginRight: 8 }}>Login Futbolista</Link>
          <Link to="/loginentrenador">Login Entrenador</Link>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
