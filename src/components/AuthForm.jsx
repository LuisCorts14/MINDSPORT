import React, { useState } from 'react';
import UnifiedButton from './UnifiedButton';

function AuthForm({ mode, color, onSubmit }) {
  const [isRegister, setIsRegister] = useState(false);
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = isRegister
      ? { nombre, email, password, rol: mode } // <-- Agrega aquí el campo rol
      : { email, password };


    if (onSubmit) onSubmit(formData, isRegister);
  };

  return (
    <div style={{ maxWidth: '400px', margin: '40px auto', padding: '20px', border: `2px solid ${color}`, borderRadius: '12px' }}>
      <h2 style={{ color, textAlign: 'center' }}>
        {isRegister ? 'Crear Cuenta' : 'Iniciar Sesión'} - {mode === 'futbolista' ? 'Futbolista' : 'Entrenador'}
      </h2>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px', gap: '4px' }}>
        <UnifiedButton
          variant={!isRegister ? 'primary' : 'outline'}
          size="small"
          onClick={() => setIsRegister(false)}
          style={{ 
            flex: 1, 
            borderRadius: '8px 0 0 8px',
            ...(isRegister ? { 
              backgroundColor: 'transparent', 
              color: color,
              border: `2px solid ${color}` 
            } : {})
          }}
        >
          Iniciar Sesión
        </UnifiedButton>
        <UnifiedButton
          variant={isRegister ? 'primary' : 'outline'}
          size="small"
          onClick={() => setIsRegister(true)}
          style={{ 
            flex: 1, 
            borderRadius: '0 8px 8px 0',
            ...(isRegister ? {} : { 
              backgroundColor: 'transparent', 
              color: color,
              border: `2px solid ${color}` 
            })
          }}
        >
          Registrarse
        </UnifiedButton>
      </div>
      <form onSubmit={handleSubmit}>
        {isRegister && (
          <input
            type="text"
            placeholder="Nombre completo"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', marginBottom: '12px', borderRadius: '6px', border: '1px solid #ccc' }}
          />
        )}
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ width: '100%', padding: '8px', marginBottom: '12px', borderRadius: '6px', border: '1px solid #ccc' }}
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ width: '100%', padding: '8px', marginBottom: '20px', borderRadius: '6px', border: '1px solid #ccc' }}
        />
        <UnifiedButton
          type="submit"
          variant="primary"
          size="large"
          style={{ 
            width: '100%',
            backgroundColor: color,
            marginTop: '4px'
          }}
        >
          {isRegister ? 'Crear cuenta' : 'Entrar'}
        </UnifiedButton>
      </form>
    </div>
  );
}

export default AuthForm;
