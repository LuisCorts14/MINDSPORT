import React from 'react';
import LogoutButton from './LogoutButton';

function Header({ showLogout = false, user }) {
  return (
    <header style={{ 
      padding: '24px 0', 
      textAlign: 'center', 
      background: '#e9f5ff', 
      position: 'relative' 
    }}>
      <h1 style={{ color: '#009688', margin: 0 }}>MindSport</h1>
      <span style={{ fontSize: 18 }}>
        Plataforma de Psicología Deportiva para Futbolistas Jóvenes
      </span>
      {showLogout && (
        <div style={{ position: 'absolute', top: 24, right: 20 }}>
          <LogoutButton />
        </div>
      )}
    </header>
  );
}

export default Header;
