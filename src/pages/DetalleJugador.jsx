import React, { useState, useEffect } from "react";
import EvolucionTemporalFortalezas from "../components/EvolucionTemporalFortalezas";
import AnalisisResultados from "../components/AnalisisResultados";
import styles from "./DetalleJugador.module.css";
import { actualizarInfoFutbolista } from "../services/futbolistaService";
import { obtenerHistoricoFutbolista } from "../services/historicoService";

// Lista de posiciones básicas de fútbol
const POSICIONES_FUTBOL = [
  { value: "", label: "Seleccionar posición...", disabled: true },
  // Portero
  { value: "Portero", label: "Portero" },
  // Línea Defensiva
  { value: "Defensa central", label: "Defensa Central" },
  { value: "Lateral derecho", label: "Lateral Derecho" },
  { value: "Lateral izquierdo", label: "Lateral Izquierdo" },
  // Línea de Mediocampo
  { value: "Mediocampista defensivo", label: "Mediocampista Defensivo" },
  { value: "Mediocampista central", label: "Mediocampista Central" },
  { value: "Mediocampista ofensivo", label: "Mediocampista Ofensivo" },
  { value: "Extremo derecho", label: "Extremo Derecho" },
  { value: "Extremo izquierdo", label: "Extremo Izquierdo" },
  // Línea Ofensiva
  { value: "Delantero centro", label: "Delantero Centro" },
  { value: "Segundo delantero", label: "Segundo Delantero" }
];

function DetalleJugador({ jugador, onCerrar, onMostrarHistorial }) {
  // Estados para datos editables
  const [posicion, setPosicion] = useState(jugador.posicion || "");
  const [notas, setNotas] = useState(jugador.notas || "");
  const [edad, setEdad] = useState(jugador.edad || "");
  
  // Estados para análisis de resultados
  const [ultimosResultados, setUltimosResultados] = useState({
    IED: null,
    IPED: null
  });
  const [todosLosResultados, setTodosLosResultados] = useState({
    IED: [],
    IPED: []
  });
  const [cargandoResultados, setCargandoResultados] = useState(true);

  // Obtener últimos resultados y todos los resultados del futbolista
  useEffect(() => {
    const obtenerResultados = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        if (userData.token) {
          // Obtener desde el endpoint de histórico
          const response = await fetch(`http://localhost:8080/api/tests/futbolista/${jugador.id}/resultados`, {
            headers: {
              'Authorization': `Bearer ${userData.token}`,
              'Content-Type': 'application/json'
            }
          });

          if (response.ok) {
            const resultados = await response.json();
            console.log('📊 Resultados obtenidos del backend:', resultados);
            
            // Separar resultados por tipo de test y ordenar por fecha (más antiguo a más reciente)
            const resultadosIED = resultados
              .filter(r => r.tipoTest === 'IED' || r.test === 'IED')
              .sort((a, b) => new Date(a.fecha || a.fechaRealizacion) - new Date(b.fecha || b.fechaRealizacion));
              
            const resultadosIPED = resultados
              .filter(r => r.tipoTest === 'IPED' || r.test === 'IPED')
              .sort((a, b) => new Date(a.fecha || a.fechaRealizacion) - new Date(b.fecha || b.fechaRealizacion));

            console.log('📊 Todos los IED:', resultadosIED);
            console.log('📊 Todos los IPED:', resultadosIPED);

            // Guardar todos los resultados para evolución temporal
            setTodosLosResultados({
              IED: resultadosIED,
              IPED: resultadosIPED
            });

            // Guardar el más reciente de cada uno para el análisis actual
            // Usar el último elemento del array (el más reciente después de ordenar de antiguo a reciente)
            setUltimosResultados({
              IED: resultadosIED.length > 0 ? resultadosIED[resultadosIED.length - 1] : null,
              IPED: resultadosIPED.length > 0 ? resultadosIPED[resultadosIPED.length - 1] : null
            });
            
            // Log detallado del resultado más reciente IED si existe
            if (resultadosIED.length > 0) {
              console.log('🎯 Estructura del resultado más reciente IED:', JSON.stringify(resultadosIED[resultadosIED.length - 1], null, 2));
            }
            if (resultadosIPED.length > 0) {
              console.log('🎯 Estructura del resultado más reciente IPED:', JSON.stringify(resultadosIPED[resultadosIPED.length - 1], null, 2));
            }
          } else {
            console.log('No hay resultados para este futbolista');
            setTodosLosResultados({
              IED: [],
              IPED: []
            });
            setUltimosResultados({
              IED: null,
              IPED: null
            });
          }
        }
      } catch (error) {
        console.error('Error obteniendo resultados:', error);
        setTodosLosResultados({
          IED: [],
          IPED: []
        });
        setUltimosResultados({
          IED: null,
          IPED: null
        });
      } finally {
        setCargandoResultados(false);
      }
    };

    obtenerResultados();
  }, [jugador.id]);

  // Función para guardar con validación mínima
  const guardarInfo = async () => {
    const edadNum = parseInt(edad, 10);
    if (isNaN(edadNum) || edadNum < 10 || edadNum > 80) {
      alert("Por favor ingresa una edad válida entre 10 y 80.");
      return;
    }

    try {
      const user = JSON.parse(localStorage.getItem("userData"));
      
      const infoActualizada = {
        edad: edadNum,
        posicion: posicion,
        notaEntrenador: notas
      };

      console.log('🔄 Guardando información:', infoActualizada);

      // ✅ LLAMADA REAL AL BACKEND (que ahora maneja el historial automáticamente)
      await actualizarInfoFutbolista(jugador.id, infoActualizada, user.token);
      
      // 📝 El historial se maneja automáticamente en el backend
      console.log('📝 Nota guardada, historial manejado automáticamente por el backend');
      
      // También actualizar localStorage para consistencia (opcional)
      const key = `futbolistasEntrenador_${user.id}`;
      const futbolistasGuardados = JSON.parse(localStorage.getItem(key)) || [];
      const actualizados = futbolistasGuardados.map(f =>
        f.id === jugador.id ? { ...f, posicion, notas, edad: edadNum } : f
      );
      localStorage.setItem(key, JSON.stringify(actualizados));
      
      alert("Información del jugador actualizada correctamente");
      
    } catch (error) {
      console.error('❌ Error guardando información:', error);
      alert(`Error al guardar: ${error.message}`);
    }
  };

  return (
    <div className={styles.detalleContainer}>
      <h2>Detalles de {jugador.nombre}</h2>

      <div className={styles.infoSection}>
        <label>
          Edad:
          <input
            type="number"
            value={edad}
            onChange={(e) => setEdad(e.target.value)}
            min="10"
            max="80"
            placeholder="Edad del jugador"
          />
        </label>

        <label>
          Posición en el campo:
          <select
            value={posicion}
            onChange={(e) => setPosicion(e.target.value)}
            className={styles.posicionSelect}
            required
          >
            {POSICIONES_FUTBOL.map((pos) => (
              <option 
                key={pos.value} 
                value={pos.value}
                disabled={pos.disabled}
                style={{
                  color: pos.disabled ? '#999' : 'inherit',
                  fontStyle: pos.disabled ? 'italic' : 'normal'
                }}
              >
                {pos.label}
              </option>
            ))}
          </select>
          {!posicion && (
            <small style={{ color: '#666', fontSize: '12px', marginTop: '4px', display: 'block' }}>
              Selecciona la posición principal donde juega el futbolista
            </small>
          )}
        </label>

        <label>
          Notas adicionales:
          <textarea
            rows="4"
            value={notas}
            onChange={(e) => setNotas(e.target.value)}
            placeholder="Observaciones, objetivos o características del jugador..."
          />
        </label>

        <div className={styles.buttonContainer}>
          <button onClick={guardarInfo} className={styles.buttonGuardar}>
            Guardar cambios
          </button>
          <button 
            onClick={() => onMostrarHistorial && onMostrarHistorial(jugador)}
            className={styles.buttonHistorial}
          >
            Mostrar historial de notas
          </button>
        </div>
      </div>

      <div className={styles.graficoSection}>
        {/* Análisis de Estado Actual */}
        <div style={{ marginBottom: '4rem', paddingTop: '2rem', borderTop: '3px solid #e9ecef' }}>
          <h3 style={{ 
            color: '#009688', 
            borderBottom: '3px solid #009688', 
            paddingBottom: '1rem',
            marginBottom: '2rem',
            fontSize: '24px'
          }}>
            🎯 ANÁLISIS PSICOLÓGICO ACTUAL
          </h3>
          
          {cargandoResultados ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
              🔄 Cargando análisis de resultados...
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '2rem' }}>
              {/* Análisis IED */}
              {ultimosResultados.IED ? (
                <div style={{ padding: '1.5rem', backgroundColor: '#f9f9f9', borderRadius: '12px', border: '1px solid #e9ecef' }}>
                  <AnalisisResultados 
                    resultado={ultimosResultados.IED}
                  />
                </div>
              ) : null}
              
              {/* Análisis IPED */}
              {ultimosResultados.IPED ? (
                <div style={{ padding: '1.5rem', backgroundColor: '#f9f9f9', borderRadius: '12px', border: '1px solid #e9ecef' }}>
                  <AnalisisResultados 
                    resultado={ultimosResultados.IPED}
                  />
                </div>
              ) : null}
              
              {/* Mensaje si no hay datos */}
              {!ultimosResultados.IED && !ultimosResultados.IPED && (
                <div style={{ 
                  textAlign: 'center', 
                  padding: '3rem', 
                  backgroundColor: '#f8f9fa',
                  borderRadius: '12px',
                  border: '2px dashed #dee2e6'
                }}>
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📊</div>
                  <h3 style={{ color: '#495057', marginBottom: '0.5rem' }}>Análisis Psicológico</h3>
                  <p style={{ color: '#6c757d', marginBottom: '1rem' }}>
                    Este futbolista aún no ha completado ningún test psicológico.
                  </p>
                  <div style={{ 
                    backgroundColor: '#e9ecef', 
                    borderRadius: '8px', 
                    padding: '1rem', 
                    fontSize: '0.9rem',
                    color: '#495057'
                  }}>
                    <strong>💡 Sugerencia:</strong> Para ver el análisis psicológico, el futbolista debe completar:
                    <ul style={{ textAlign: 'left', marginTop: '0.5rem', paddingLeft: '1.5rem' }}>
                      <li><strong>Test IED</strong> - Inteligencia Emocional Deportiva</li>
                      <li><strong>Test IPED</strong> - Inventario Psicológico de Ejecución Deportiva</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Evolución Temporal */}
        <div style={{ marginBottom: '2rem', marginTop: '4rem', paddingTop: '3rem', borderTop: '3px solid #e9ecef' }}>
          <h3 style={{ 
            color: '#009688', 
            borderBottom: '3px solid #009688', 
            paddingBottom: '1rem',
            marginBottom: '2rem',
            fontSize: '24px'
          }}>
            📈 EVOLUCIÓN TEMPORAL
          </h3>
          
          <div style={{ marginBottom: '4rem' }}>
            <h4 style={{ 
              color: '#009688', 
              borderBottom: '2px solid #009688', 
              paddingBottom: '0.75rem',
              marginBottom: '1.5rem',
              fontSize: '18px'
            }}>
              📊 Evolución Mental - Test IED
            </h4>
            <div style={{ 
              background: '#f8f9fa', 
              padding: '1.5rem', 
              borderRadius: '8px',
              border: '1px solid #e9ecef'
            }}>
              {todosLosResultados.IED.length > 0 ? (
                <EvolucionTemporalFortalezas 
                  testType="IED" 
                  resultados={todosLosResultados.IED}
                />
              ) : (
                <p style={{ color: '#666', textAlign: 'center', padding: '2rem' }}>
                  No hay resultados del Test IED para mostrar evolución temporal.
                </p>
              )}
            </div>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <h4 style={{ 
              color: '#009688', 
              borderBottom: '2px solid #009688', 
              paddingBottom: '0.75rem',
              marginBottom: '1.5rem',
              fontSize: '18px'
            }}>
              📈 Evolución Mental - Test IPED
            </h4>
            <div style={{ 
              background: '#f8f9fa', 
              padding: '1.5rem', 
              borderRadius: '8px',
              border: '1px solid #e9ecef'
            }}>
              {todosLosResultados.IPED.length > 0 ? (
                <EvolucionTemporalFortalezas 
                  testType="IPED" 
                  resultados={todosLosResultados.IPED}
                />
              ) : (
                <p style={{ color: '#666', textAlign: 'center', padding: '2rem' }}>
                  No hay resultados del Test IPED para mostrar evolución temporal.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <button onClick={onCerrar} className={styles.buttonCerrar}>
        ← Volver al listado
      </button>
    </div>
  );
}

export default DetalleJugador;