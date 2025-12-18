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
    margin: '0 0 12px 0',
    fontSize: 'var(--font-size-2xl, 28px)',
    fontWeight: 'var(--font-weight-bold, 700)',
    letterSpacing: '-0.5px'
  };

  const subtitleStyle = {
    fontSize: 'var(--font-size-base, 14px)',
    color: 'var(--gray-600, #666)',
    fontWeight: 'var(--font-weight-medium, 500)',
    margin: 0,
    letterSpacing: '0.3px',
    lineHeight: '1.5',
    textTransform: 'uppercase',
    opacity: 0.85
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
