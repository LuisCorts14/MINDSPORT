import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { iedQuestions } from '../data/iedTest';
import { guardarResultado, calcularPuntajes } from '../services/resultadoService';
import styles from './TestIED.module.css';

function TestIED() {
  const navigate = useNavigate();
  const [respuestas, setRespuestas] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Cargar respuestas guardadas si existen
    const saved = localStorage.getItem('iedRespuestas');
    if (saved) {
      try {
        setRespuestas(JSON.parse(saved));
      } catch (e) {
        console.error('Error cargando respuestas guardadas:', e);
      }
    } else {
      // Inicializar con valor neutro (3)
      const inicial = {};
      iedQuestions.forEach((_, idx) => inicial[idx + 1] = 3);
      setRespuestas(inicial);
    }
  }, []);

  // Guardar respuestas en localStorage cuando cambien
  useEffect(() => {
    localStorage.setItem('iedRespuestas', JSON.stringify(respuestas));
  }, [respuestas]);

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
      // Validar que todas las preguntas están respondidas
      const preguntasSinResponder = iedQuestions
        .map((_, idx) => idx + 1)
        .filter(num => !respuestas[num]);

      if (preguntasSinResponder.length > 0) {
        throw new Error(`Faltan preguntas por responder: ${preguntasSinResponder.join(', ')}`);
      }

      // Calcular puntajes y guardar
      const puntajes = calcularPuntajes(respuestas, 'IED');
      await guardarResultado(respuestas, puntajes, 'IED');
      
      // Limpiar localStorage y navegar a resultados
      localStorage.removeItem('iedRespuestas');
      navigate('/resultados-ied');
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.formContainer}>
      <h2 className={styles.title}>Inventario de Inteligencia Emocional Deportiva (IED)</h2>
      
      {error && (
        <div className={styles.error}>
          {error}
        </div>
      )}

      {iedQuestions.map((pregunta, idx) => (
        <div key={idx} className={styles.pregunta}>
          <label>{idx + 1}. {pregunta.text}</label>
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
      ))}

      <button 
        type="submit" 
        className={styles.button}
        disabled={loading}
      >
        {loading ? 'Guardando...' : 'Finalizar test'}
      </button>
    </form>
  );
}

export default TestIED;
