import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { guardarResultado, calcularPuntajes } from '../services/resultadoService';
import { obtenerPreguntasIED } from '../services/preguntasService';
import styles from './TestIED.module.css';
import UnifiedButton from '../components/UnifiedButton';

function TestIED(props) {
  const navigate = useNavigate();
  const [respuestas, setRespuestas] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [preguntas, setPreguntas] = useState([]);
  const [cargandoPreguntas, setCargandoPreguntas] = useState(true);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (!userData || !userData.token) {
      navigate('/login-futbolista');
      return;
    }
    if (userData.rol !== 'futbolista') {
      setError('Solo los futbolistas pueden realizar tests');
      return;
    }
    try {
      const tokenData = JSON.parse(atob(userData.token.split('.')[1]));
      const expirationTime = tokenData.exp * 1000;
      if (Date.now() >= expirationTime) {
        localStorage.removeItem('userData');
        navigate('/login-futbolista');
      }
    } catch (e) {
      console.error('Error al verificar token:', e);
    }
  }, [navigate]);

  // Cargar preguntas desde MongoDB
  useEffect(() => {
    const cargarPreguntas = async () => {
      try {
        setCargandoPreguntas(true);
        console.log('🔄 Cargando preguntas IED desde MongoDB...');
        const preguntasIED = await obtenerPreguntasIED();
        console.log('✅ Preguntas IED cargadas:', preguntasIED.length);
        setPreguntas(preguntasIED);
      } catch (error) {
        console.error('❌ Error al cargar preguntas IED:', error);
        setError('Error al cargar las preguntas del test. Por favor, recarga la página.');
      } finally {
        setCargandoPreguntas(false);
      }
    };

    cargarPreguntas();
  }, []);

  useEffect(() => {
    localStorage.removeItem('iedRespuestas');
    setRespuestas({});
  }, []);

  useEffect(() => {
    localStorage.setItem('iedRespuestas', JSON.stringify(respuestas));
  }, [respuestas]);

  // Manejar la navegación hacia atrás del navegador
  useEffect(() => {
    // Agregar una entrada adicional al historial
    window.history.pushState(null, null, window.location.pathname);
    
    const handlePopState = (event) => {
      console.log('🔙 Usuario presionó flecha hacia atrás del navegador');
      
      // Mostrar el mensaje de confirmación
      const confirmar = window.confirm(
        "¿Estás seguro que quieres salir del test? Se perderá tu progreso actual."
      );
      
      if (confirmar) {
        console.log('✅ Usuario confirmó salir del test');
        // Limpiar respuestas temporales
        localStorage.removeItem('iedRespuestas');
        
        // Como estamos dentro del Dashboard, usar onCancel para volver al contenido principal
        if (props.onCancel) {
          console.log('🎯 Ejecutando onCancel para volver al Dashboard');
          props.onCancel();
        } else {
          console.warn('⚠️ No hay función onCancel disponible');
          // Forzar recarga de la página como último recurso
          window.location.href = '/dashboard';
        }
      } else {
        console.log('❌ Usuario canceló, manteniéndose en el test');
        // Volver a agregar la entrada al historial para mantener la protección
        window.history.pushState(null, null, window.location.pathname);
      }
    };
    
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.onCancel]);

  const handleChange = (idx, value) => {
    setRespuestas(prev => ({
      ...prev,
      [idx + 1]: parseInt(value)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const preguntasSinResponder = preguntas
        .map((_, idx) => idx + 1)
        .filter(num => !respuestas[num]);
      if (preguntasSinResponder.length > 0) {
        const mensaje = preguntasSinResponder.length === 1
          ? `Por favor responde la pregunta número ${preguntasSinResponder[0]} antes de continuar.`
          : `Por favor responde las preguntas número ${preguntasSinResponder.join(', ')} antes de continuar.`;
        throw new Error(mensaje);
      }
      
      const puntajes = calcularPuntajes(respuestas, 'IED');
      await guardarResultado(respuestas, puntajes, 'IED');
      localStorage.removeItem('iedRespuestas');
      
      // Pasar los puntajes completos a la página de resultados
      navigate('/resultados-ied', { 
        replace: true, 
        state: { 
          puntajes: puntajes,
          respuestas: respuestas
        } 
      });
    } catch (err) {
      setError(`Error al guardar el test: ${err.message}. Por favor, verifica tu conexión y vuelve a intentarlo.`);
    } finally {
      setLoading(false);
    }
  };

  // Solo esto: botón consistente arriba, igual que en TestIPED
  const handleVolverDashboard = () => {
    console.log('🔄 Botón Volver al Dashboard clickeado');
    const confirmar = window.confirm(
      "¿Estás seguro que quieres salir del test? Se perderá tu progreso actual."
    );
    console.log('🤔 Usuario confirmó:', confirmar);
    if (confirmar) {
      console.log('✅ Limpiando localStorage y volviendo al dashboard...');
      // Limpiar respuestas temporales del localStorage
      localStorage.removeItem('iedRespuestas');
      console.log('🧹 localStorage limpiado');
      
      // Si hay una función onCancel (para volver al dashboard), usarla
      if (props.onCancel) {
        console.log('🎯 Usando onCancel prop');
        props.onCancel();
      } else {
        console.log('🧭 Usando navigate fallback');
        // Fallback: intentar navegar (esto funcionará si están en rutas separadas)
        navigate('/dashboard');
      }
      console.log('✨ Comando ejecutado');
    }
  };

  return (
    <div className={styles.formContainer}>
      <div className={styles.header}>
        <div style={{ marginBottom: '20px' }}>
          <UnifiedButton
            type="button"
            onClick={handleVolverDashboard}
            variant="secondary"
            size="medium"
          >
            ← Volver al Dashboard
          </UnifiedButton>
        </div>
        <h2 className={styles.title}>Inventario de Inteligencia Emocional Deportiva (IED)</h2>
      </div>

      {error && (
        <div className={styles.error}>
          {error}
        </div>
      )}

      {cargandoPreguntas ? (
        <div className={styles.loading}>
          <p>Cargando preguntas del test...</p>
        </div>
      ) : preguntas.length === 0 ? (
        <div className={styles.error}>
          <p>No se pudieron cargar las preguntas del test. Por favor, recarga la página.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
        {preguntas.map((pregunta, idx) => {
          const preguntaRespondida = respuestas[idx + 1] !== undefined;
          return (
            <div
              key={idx}
              className={`${styles.pregunta} ${!preguntaRespondida ? styles.preguntaSinResponder : ''}`}
            >
              <label>
                {idx + 1}. {pregunta.text}
                {!preguntaRespondida && <span className={styles.requerido}> *</span>}
              </label>
              <div className={styles.options}>
                {[1, 2, 3, 4, 5].map(n => (
                  <label key={n} className={styles.radio}>
                    <input
                      type="radio"
                      name={`pregunta-${idx}`}
                      value={n}
                      checked={respuestas[idx + 1] === n}
                      onChange={() => handleChange(idx, n)}
                    />
                    {n}
                  </label>
                ))}
              </div>
            </div>
          );
        })}
        <UnifiedButton
          type="submit"
          variant="primary"
          size="large"
          loading={loading}
          style={{ marginTop: '20px' }}
        >
          {loading ? 'Guardando...' : 'Finalizar test'}
        </UnifiedButton>
        </form>
      )}
    </div>
  );
}

export default TestIED;
