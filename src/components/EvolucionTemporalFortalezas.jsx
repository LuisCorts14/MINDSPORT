import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { fortalezasIED } from '../data/fortalezasIED';
import { fortalezasIPED } from '../data/fortalezasIPED';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Función para capitalizar texto
const capitalizarFortaleza = (texto) => {
  return texto
    .replace(/_/g, ' ')
    .split(' ')
    .map(palabra => palabra.charAt(0).toUpperCase() + palabra.slice(1))
    .join(' ');
};

function EvolucionTemporalFortalezas({ resultadosIED = [], resultadosIPED = [], jugadorId = null }) {
  const [selectedFortaleza, setSelectedFortaleza] = useState(null);
  const [testActivo, setTestActivo] = useState('IED');

  // Filtrar resultados por tipo de test activo
  const resultadosFiltrados = testActivo === 'IED' ? resultadosIED : resultadosIPED;

  // Obtener solo las fortalezas válidas para este tipo de test
  const fortalezasDelTest = testActivo === 'IED' 
    ? Object.keys(fortalezasIED).sort()
    : Object.keys(fortalezasIPED).sort();

  // Resetear fortaleza seleccionada cuando cambia de test
  const fortalezaActual = (selectedFortaleza && fortalezasDelTest.includes(selectedFortaleza))
    ? selectedFortaleza
    : fortalezasDelTest[0];

  // Filtrar resultados que tengan puntajes válidos
  const resultadosConPuntajes = resultadosFiltrados.filter(r => {
    if (!r.puntajes || Object.keys(r.puntajes).length === 0) return false;
    if (!r.puntajes[fortalezaActual]) return false;
    return true;
  });

  if (resultadosFiltrados.length < 2 || resultadosConPuntajes.length < 2) {
    return (
      <div style={{
        marginTop: '2rem',
        padding: '2rem',
        textAlign: 'center',
        backgroundColor: '#f5f5f5',
        borderRadius: '12px',
        border: '2px dashed #ccc'
      }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📊</div>
        <h3 style={{ color: '#666' }}>Evolución Temporal</h3>
        <p style={{ color: '#999' }}>
          Se necesitan al menos 2 intentos con datos válidos para visualizar la evolución.
          {jugadorId ? ' Este futbolista debe completar el test más veces.' : ' Completa el test varias veces para ver tu progreso.'}
        </p>
      </div>
    );
  }

  // Preparar datos para la fortaleza seleccionada
  const puntajesPorFortaleza = resultadosConPuntajes.map((r, idx) => {
    // Validar que puntajes exista
    if (!r.puntajes) {
      return 0;
    }
    
    const puntaje = r.puntajes[fortalezaActual];
    // Manejar tanto objetos con promedio como números simples
    if (typeof puntaje === 'object' && puntaje !== null && 'promedio' in puntaje) {
      return puntaje.promedio;
    }
    // Si es un número simple, usarlo directamente
    return typeof puntaje === 'number' ? puntaje : 0;
  });

  // Filtrar solo datos con valores reales (no ceros)
  const datosConValores = resultadosConPuntajes
    .map((r, index) => ({
      resultado: r,
      puntaje: puntajesPorFortaleza[index],
      fecha: new Date(r.fecha || r.fechaRealizacion).toLocaleDateString('es-CL', {
        day: '2-digit',
        month: 'short',
        year: '2-digit'
      })
    }))
    .filter(d => d.puntaje > 0);

  // Extraer fechas y puntajes filtrados
  const fechas = datosConValores.map(d => d.fecha);
  const puntajesActualizados = datosConValores.map(d => d.puntaje);

  // Obtener valor máximo para la escala
  const maxPuntaje = 5;
  const minPuntaje = 0;

  // Colores por nivel de desempeño
  const getColorPorNivel = (puntaje) => {
    if (puntaje >= 3.51) return '#1abc53'; // Alto - Verde
    if (puntaje >= 2.51) return '#f39c12'; // Medio - Naranja
    return '#e74c3c'; // Bajo - Rojo
  };

  const coloresBarras = puntajesActualizados.map(p => getColorPorNivel(p));

  // Datos para gráfico de línea
  const dataLinea = {
    labels: fechas,
    datasets: [
      {
        label: capitalizarFortaleza(fortalezaActual),
        data: puntajesActualizados,
        fill: true,
        backgroundColor: 'rgba(26, 188, 83, 0.1)',
        borderColor: '#1abc53',
        borderWidth: 3,
        pointBackgroundColor: '#1abc53',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
        tension: 0.4,
      }
    ]
  };
  const optionesComunes = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        labels: {
          font: { size: 12, weight: 'bold' },
          padding: 15,
        }
      },
      title: {
        display: true,
        text: `Evolución de ${capitalizarFortaleza(fortalezaActual).toUpperCase()} - Test ${testActivo}`,
        font: { size: 16, weight: 'bold' },
        color: '#333',
        padding: 20
      },
      tooltip: {
        backgroundColor: 'rgba(0,0,0,0.8)',
        padding: 12,
        titleFont: { size: 13, weight: 'bold' },
        bodyFont: { size: 12 },
        callbacks: {
          label: function(context) {
            const valor = context.parsed.y;
            const nivel = valor >= 3.51 ? 'Alto' : (valor >= 2.51 ? 'Medio' : 'Bajo');
            return `Puntaje: ${valor.toFixed(2)}/5.0 (${nivel})`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: maxPuntaje,
        min: minPuntaje,
        ticks: {
          stepSize: 0.5,
          font: { size: 11 }
        },
        title: {
          display: true,
          text: 'Puntaje (0-5)',
          font: { size: 12, weight: 'bold' }
        },
        grid: {
          color: 'rgba(0,0,0,0.05)',
          drawBorder: true
        }
      },
      x: {
        title: {
          display: true,
          text: 'Fecha del Test',
          font: { size: 12, weight: 'bold' }
        },
        ticks: {
          maxRotation: 45,
          minRotation: 0,
          font: { size: 11 }
        },
        grid: {
          display: false
        }
      }
    }
  };

  return (
    <div style={{ marginTop: '2rem', backgroundColor: '#fff', padding: '2rem', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
          gap: '16px',
          flexWrap: 'wrap'
        }}
      >
        <h2 style={{ color: '#333', fontSize: '1.8rem', marginBottom: 0 }}>
          Evolución Temporal por Fortaleza
        </h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => setTestActivo('IED')}
            style={{
              padding: '8px 16px',
              background: testActivo === 'IED' ? '#1abc53' : '#e0e0e0',
              color: testActivo === 'IED' ? 'white' : '#333',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '13px',
              transition: 'all 0.2s ease'
            }}
          >
            IED
          </button>
          <button
            onClick={() => setTestActivo('IPED')}
            style={{
              padding: '8px 16px',
              background: testActivo === 'IPED' ? '#1abc53' : '#e0e0e0',
              color: testActivo === 'IPED' ? 'white' : '#333',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '13px',
              transition: 'all 0.2s ease'
            }}
          >
            IPED
          </button>
        </div>
      </div>

      {/* Controles */}
      <div style={{
        display: 'flex',
        gap: '1rem',
        marginBottom: '2rem',
        flexWrap: 'wrap',
        alignItems: 'center'
      }}>
        {/* Selector de Fortaleza */}
        <div style={{ width: '320px' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#333' }}>
            Selecciona una fortaleza:
          </label>
          <select
            value={fortalezaActual}
            onChange={(e) => setSelectedFortaleza(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem',
              fontSize: '1rem',
              border: '2px solid #1abc53',
              borderRadius: '6px',
              backgroundColor: '#fff',
              cursor: 'pointer',
              fontWeight: '500'
            }}
          >
            {fortalezasDelTest.map(fortaleza => (
              <option key={fortaleza} value={fortaleza}>
                {capitalizarFortaleza(fortaleza)}
              </option>
            ))}
          </select>
        </div>


      </div>

      {/* Gráfico */}
      <div style={{ height: '400px', marginBottom: '2rem', position: 'relative' }}>
        <Line data={dataLinea} options={optionesComunes} />
      </div>

      {/* Comparación Período a Período - Todas las Fortalezas */}
      {resultadosFiltrados.length >= 2 && (
        <div style={{
          backgroundColor: '#f0f8f5',
          padding: '1.5rem',
          borderRadius: '8px',
          borderLeft: '4px solid #1abc53',
          marginBottom: '1.5rem'
        }}>
          <h3 style={{ marginBottom: '1rem', color: '#333' }}>Comparación Período a Período - Todas las Fortalezas</h3>
          <div style={{
            backgroundColor: '#fff',
            padding: '1rem',
            borderRadius: '6px',
            marginBottom: '1rem',
            fontSize: '0.9rem',
            color: '#666',
            borderLeft: '3px solid #3498db'
          }}>
            Última comparación: <strong>{new Date(resultadosFiltrados[resultadosFiltrados.length - 2].fecha).toLocaleDateString('es-CL')}</strong> vs <strong>{new Date(resultadosFiltrados[resultadosFiltrados.length - 1].fecha).toLocaleDateString('es-CL')}</strong>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
            {fortalezasDelTest.map(fortaleza => {
              const resultadoAnterior = resultadosFiltrados[resultadosFiltrados.length - 2];
              const resultadoActual = resultadosFiltrados[resultadosFiltrados.length - 1];
              
              // Obtener puntajes
              const puntajeAnterior = resultadoAnterior.puntajes[fortaleza];
              const puntajeActual = resultadoActual.puntajes[fortaleza];
              
              // Manejar tanto objetos con promedio como números simples
              const valAnterior = typeof puntajeAnterior === 'object' && puntajeAnterior !== null && 'promedio' in puntajeAnterior
                ? puntajeAnterior.promedio
                : (typeof puntajeAnterior === 'number' ? puntajeAnterior : 0);
              
              const valActual = typeof puntajeActual === 'object' && puntajeActual !== null && 'promedio' in puntajeActual
                ? puntajeActual.promedio
                : (typeof puntajeActual === 'number' ? puntajeActual : 0);
              
              const cambio = valActual - valAnterior;
              const porcentajeCambio = valAnterior !== 0 ? ((cambio / valAnterior) * 100) : 0;
              
              const colorTendencia = cambio > 0 ? '#1abc53' : (cambio < 0 ? '#e74c3c' : '#f39c12');
              const iconoTendencia = cambio > 0 ? '▲' : (cambio < 0 ? '▼' : '─');
              
              return (
                <div key={fortaleza} style={{
                  backgroundColor: '#fff',
                  padding: '1rem',
                  borderRadius: '6px',
                  border: `2px solid ${colorTendencia}33`
                }}>
                  <div style={{ marginBottom: '0.75rem' }}>
                    <strong style={{ color: '#333', fontSize: '0.95rem' }}>
                      {capitalizarFortaleza(fortaleza)}
                    </strong>
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <div style={{ textAlign: 'center', flex: 1 }}>
                      <div style={{ fontSize: '0.75rem', color: '#999', marginBottom: '0.25rem' }}>Anterior</div>
                      <div style={{ fontSize: '1.3rem', color: '#666', fontWeight: 'bold' }}>
                        {valAnterior.toFixed(2)}
                      </div>
                    </div>
                    <div style={{ fontSize: '1.3rem', margin: '0 0.5rem', color: '#ccc' }}>→</div>
                    <div style={{ textAlign: 'center', flex: 1 }}>
                      <div style={{ fontSize: '0.75rem', color: '#999', marginBottom: '0.25rem' }}>Actual</div>
                      <div style={{ fontSize: '1.3rem', color: getColorPorNivel(valActual), fontWeight: 'bold' }}>
                        {valActual.toFixed(2)}
                      </div>
                    </div>
                  </div>
                  
                  <div style={{
                    backgroundColor: '#f9f9f9',
                    padding: '0.75rem',
                    borderRadius: '4px',
                    textAlign: 'center',
                    borderTop: `2px solid ${colorTendencia}33`
                  }}>
                    <div style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>{iconoTendencia}</div>
                    <strong style={{ color: colorTendencia, fontSize: '1.1rem' }}>
                      {cambio > 0 ? '+' : ''}{cambio.toFixed(2)} pts
                    </strong>
                    <div style={{ color: colorTendencia, fontSize: '0.85rem', marginTop: '0.25rem' }}>
                      ({cambio > 0 ? '+' : ''}{porcentajeCambio.toFixed(1)}%)
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Estadísticas Generales */}
      <div style={{
        backgroundColor: '#f9f9f9',
        padding: '1.5rem',
        borderRadius: '8px',
        borderLeft: '4px solid #1abc53'
      }}>
        <h3 style={{ marginBottom: '1rem', color: '#333' }}>Estadísticas Generales</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div>
            <strong style={{ color: '#666' }}>Puntaje Actual:</strong>
            <div style={{
              fontSize: '1.8rem',
              color: getColorPorNivel(puntajesActualizados[puntajesActualizados.length - 1]),
              fontWeight: 'bold',
              marginTop: '0.5rem'
            }}>
              {puntajesActualizados[puntajesActualizados.length - 1].toFixed(2)}/5.0
            </div>
          </div>
          <div>
            <strong style={{ color: '#666' }}>Puntaje Máximo:</strong>
            <div style={{
              fontSize: '1.8rem',
              color: '#1abc53',
              fontWeight: 'bold',
              marginTop: '0.5rem'
            }}>
              {Math.max(...puntajesActualizados).toFixed(2)}/5.0
            </div>
          </div>
          <div>
            <strong style={{ color: '#666' }}>Puntaje Mínimo:</strong>
            <div style={{
              fontSize: '1.8rem',
              color: '#e74c3c',
              fontWeight: 'bold',
              marginTop: '0.5rem'
            }}>
              {Math.min(...puntajesActualizados).toFixed(2)}/5.0
            </div>
          </div>
          <div>
            <strong style={{ color: '#666' }}>Variación Total:</strong>
            <div style={{
              fontSize: '1.8rem',
              color: Math.max(...puntajesActualizados) - Math.min(...puntajesActualizados) > 0 ? '#f39c12' : '#1abc53',
              fontWeight: 'bold',
              marginTop: '0.5rem'
            }}>
              {(Math.max(...puntajesActualizados) - Math.min(...puntajesActualizados)).toFixed(2)}
            </div>
          </div>
          <div>
            <strong style={{ color: '#666' }}>Promedio Histórico:</strong>
            <div style={{
              fontSize: '1.8rem',
              color: '#3498db',
              fontWeight: 'bold',
              marginTop: '0.5rem'
            }}>
              {(puntajesActualizados.reduce((a, b) => a + b, 0) / puntajesActualizados.length).toFixed(2)}/5.0
            </div>
          </div>
        </div>
      </div>

      {/* Leyenda de niveles */}
      <div style={{
        marginTop: '1.5rem',
        padding: '1rem',
        backgroundColor: '#f0f8f5',
        borderRadius: '8px',
        borderLeft: '4px solid #1abc53'
      }}>
        <strong style={{ display: 'block', marginBottom: '0.5rem', color: '#333' }}>📌 Interpretación de Niveles:</strong>
        <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', fontSize: '0.9rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{
              width: '20px',
              height: '20px',
              backgroundColor: '#1abc53',
              borderRadius: '4px'
            }}></div>
            <span>Alto (3.5 - 5.0)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{
              width: '20px',
              height: '20px',
              backgroundColor: '#f39c12',
              borderRadius: '4px'
            }}></div>
            <span>Medio (2.5 - 3.5)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{
              width: '20px',
              height: '20px',
              backgroundColor: '#e74c3c',
              borderRadius: '4px'
            }}></div>
            <span>Bajo (0 - 2.5)</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EvolucionTemporalFortalezas;