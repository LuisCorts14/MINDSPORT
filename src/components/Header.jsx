import React from 'react';
import LogoutButton from './LogoutButton';

function Header({ showLogout = false, user }) {
  const headerStyle = {
    padding: '24px 20px', 
    textAlign: 'center', 
    background: 'var(--primary-bg, #e9f5ff)', 
    position: 'relative',
    boxShadow: 'var(--shadow-sm, 0 2px 4px rgba(0,0,0,0.05))',
    borderBottom: '1px solid var(--gray-200, #e3f2fd)'
  };

  const titleStyle = {
    color: 'var(--primary-color, #009688)', 
    margin: '0 0 8px 0',
    fontSize: 'var(--font-size-2xl, 24px)',
    fontWeight: 'var(--font-weight-bold, 600)'
  };

  const subtitleStyle = {
    fontSize: 'var(--font-size-lg, 18px)',
    color: 'var(--gray-700, #333)',
    fontWeight: 'var(--font-weight-normal, 400)',
    margin: 0
  };

  const logoutButtonStyle = {
    position: 'absolute', 
    top: '20px', 
    right: '20px'
  };

  return (
    <header style={headerStyle}>
      <h1 style={titleStyle}>⚽ MindSport</h1>
      <p style={subtitleStyle}>
        Plataforma de Psicología Deportiva para Futbolistas Jóvenes
      </p>
      {showLogout && (
        <div style={logoutButtonStyle}>
          <LogoutButton />
        </div>
      )}
    </header>
  );
}

export default Header;
