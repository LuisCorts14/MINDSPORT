import React, { useState } from 'react';

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
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
        <button
          style={{ flex: 1, padding: '8px', backgroundColor: !isRegister ? color : '#eee', color: !isRegister ? '#fff' : '#333', border: 'none', cursor: 'pointer' }}
          onClick={() => setIsRegister(false)}
        >
          Iniciar Sesión
        </button>
        <button
          style={{ flex: 1, padding: '8px', backgroundColor: isRegister ? color : '#eee', color: isRegister ? '#fff' : '#333', border: 'none', cursor: 'pointer' }}
          onClick={() => setIsRegister(true)}
        >
          Registrarse
        </button>
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
        <button
          type="submit"
          style={{ backgroundColor: color, color: '#fff', border: 'none', padding: '12px 20px', borderRadius: '8px', width: '100%', fontWeight: 'bold', cursor: 'pointer' }}
        >
          {isRegister ? 'Crear cuenta' : 'Entrar'}
        </button>
      </form>
    </div>
  );
}

export default AuthForm;
