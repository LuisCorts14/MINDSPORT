import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { guardarResultado, calcularPuntajes } from '../services/resultadoService';
import { obtenerPreguntasIPED } from '../services/preguntasService';
import styles from './TestIPED.module.css';
import UnifiedButton from '../components/UnifiedButton';

function TestIPED(props) {
  const navigate = useNavigate();
  const [respuestas, setRespuestas] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [preguntas, setPreguntas] = useState([]);
  const [cargandoPreguntas, setCargandoPreguntas] = useState(true);

  useEffect(() => {
    // Limpiar respuestas anteriores para forzar el nuevo comportamiento
    localStorage.removeItem('ipedRespuestas');
    
    // Inicializar sin valores por defecto - el usuario debe responder cada pregunta
    setRespuestas({});
  }, []);

  // Cargar preguntas desde MongoDB
  useEffect(() => {
    const cargarPreguntas = async () => {
      try {
        setCargandoPreguntas(true);
        console.log('🔄 Cargando preguntas IPED desde MongoDB...');
        const preguntasIPED = await obtenerPreguntasIPED();
        console.log('✅ Preguntas IPED cargadas:', preguntasIPED.length);
        setPreguntas(preguntasIPED);
      } catch (error) {
        console.error('❌ Error al cargar preguntas IPED:', error);
        setError('Error al cargar las preguntas del test. Por favor, recarga la página.');
      } finally {
        setCargandoPreguntas(false);
      }
    };

    cargarPreguntas();
  }, []);

  // Cargar preguntas desde MongoDB
  useEffect(() => {
    const cargarPreguntas = async () => {
      try {
        setCargandoPreguntas(true);
        console.log('🔄 Cargando preguntas IPED desde MongoDB...');
        const preguntasIPED = await obtenerPreguntasIPED();
        console.log('✅ Preguntas IPED cargadas:', preguntasIPED.length);
        setPreguntas(preguntasIPED);
      } catch (error) {
        console.error('❌ Error al cargar preguntas IPED:', error);
        setError('Error al cargar las preguntas del test. Por favor, recarga la página.');
      } finally {
        setCargandoPreguntas(false);
      }
    };

    cargarPreguntas();
  }, []);

  // Guardar respuestas en localStorage cuando cambien
  useEffect(() => {
    localStorage.setItem('ipedRespuestas', JSON.stringify(respuestas));
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
        localStorage.removeItem('ipedRespuestas');
        
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

      const puntajes = calcularPuntajes(respuestas, 'IPED');
      await guardarResultado(respuestas, puntajes, 'IPED');
      localStorage.removeItem('ipedRespuestas');

      navigate('/resultados-iped', { 
        state: { 
          respuestas,
          puntajes 
        },
        replace: true 
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Botón para volver al Dashboard
  const handleVolverDashboard = () => {
    console.log('🔄 Botón Volver al Dashboard clickeado (IPED)');
    const confirmar = window.confirm(
      "¿Estás seguro que quieres salir del test? Se perderá tu progreso actual."
    );
    console.log('🤔 Usuario confirmó:', confirmar);
    if (confirmar) {
      console.log('✅ Limpiando localStorage y volviendo al dashboard...');
      // Limpiar respuestas temporales del localStorage
      localStorage.removeItem('ipedRespuestas');
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
        <h2 className={styles.title}>Inventario de Personalidad Deportiva (IPED)</h2>
      </div>

      {error && <div className={styles.error}>{error}</div>}

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
          style={{ 
            marginTop: '20px',
            backgroundColor: '#6a4fff' // Mantener color específico del IPED
          }}
        >
          {loading ? 'Guardando...' : 'Finalizar test'}
        </UnifiedButton>
        </form>
      )}
    </div>
  );
}

export default TestIPED;
