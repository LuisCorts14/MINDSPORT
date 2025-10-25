import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthForm from '../components/AuthForm';

function LoginFutbolista() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const handleAuthSubmit = async (data, isRegister) => {
    const endpoint = isRegister 
      ? 'http://localhost:8080/api/usuarios/register' 
      : 'http://localhost:8080/api/usuarios/login';

    try {
      // Si es registro, añadir el rol
      const bodyData = isRegister 
        ? { ...data, rol: 'futbolista' }
        : { ...data, requestedRole: 'futbolista' }; // Añadimos requestedRole para login

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyData),
      });

      const result = await response.json();

      if (response.ok) {
        if (isRegister) {
          alert('Registro exitoso, ya puedes iniciar sesión');
        } else {
          // Validar el rol recibido
          if (result.rol !== 'futbolista') {
            setError('Acceso no autorizado');
            return;
          }

          // Guardar datos del futbolista en localStorage
          localStorage.setItem(
            'userData',
            JSON.stringify({
              id: result.id,
              nombre: result.nombre,
              rol: result.rol,
              token: result.token,
              codigoUnico: result.codigoUnico || null,
            })
          );

          alert(`Bienvenido ${result.nombre || 'futbolista'}`);
          navigate('/dashboard'); // Asegúrate de que esta ruta existe
        }
      } else {
        // Mostrar mensaje de error del servidor
        setError(result.error || 'Error en la operación');
        alert(result.error || 'Error en la operación');
      }
    } catch (error) {
      console.error('Error en conexión al backend:', error);
      setError('Error de conexión al servidor');
      alert('Error de conexión al servidor');
    }
  };

  return (
    <div>
      {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
      <AuthForm
        mode="futbolista"
        color="#1abc53"
        onSubmit={handleAuthSubmit}
      />
    </div>
  );
}

export default LoginFutbolista;