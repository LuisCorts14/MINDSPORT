import React, { useState } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
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
  BarElement,
  Title,
  Tooltip,
  Legend
);

function EvolucionTemporalFortalezas({ testType = 'IED', jugadorId = null, resultados = [] }) {
  const [selectedFortaleza, setSelectedFortaleza] = useState(null);
  const [vistaGrafico, setVistaGrafico] = useState('linea'); // 'linea' o 'barras'

  // Filtrar resultados por tipo de test
  const resultadosFiltrados = resultados.filter(r => 
    r.tipoTest === testType || r.test === testType
  );

  if (resultadosFiltrados.length < 2) {
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
          Se necesitan al menos 2 intentos para visualizar la evolución.
          {jugadorId ? ' Este futbolista debe completar el test más veces.' : ' Completa el test varias veces para ver tu progreso.'}
        </p>
      </div>
    );
  }

  // Obtener solo las fortalezas válidas para este tipo de test
  const fortalezasDelTest = testType === 'IED' 
    ? Object.keys(fortalezasIED).sort()
    : Object.keys(fortalezasIPED).sort();

  // Seleccionar primera fortaleza por defecto
  const fortalezaActual = selectedFortaleza || fortalezasDelTest[0];

  // Preparar datos para la fortaleza seleccionada
  const fechas = resultadosFiltrados.map(r => {
    const fecha = new Date(r.fecha || r.fechaRealizacion);
    return fecha.toLocaleDateString('es-CL', {
      day: '2-digit',
      month: 'short',
      year: '2-digit'
    });
  });

  const puntajesPorFortaleza = resultadosFiltrados.map(r => {
    const puntaje = r.puntajes[fortalezaActual];
    // Manejar tanto objetos con promedio como números simples
    if (typeof puntaje === 'object' && puntaje !== null && 'promedio' in puntaje) {
      return puntaje.promedio;
    }
    // Si es un número simple, usarlo directamente
    return typeof puntaje === 'number' ? puntaje : 0;
  });

  // Obtener valor máximo para la escala
  const maxPuntaje = 5;
  const minPuntaje = 0;

  // Colores por nivel de desempeño
  const getColorPorNivel = (puntaje) => {
    if (puntaje >= 3.51) return '#1abc53'; // Alto - Verde
    if (puntaje >= 2.51) return '#f39c12'; // Medio - Naranja
    return '#e74c3c'; // Bajo - Rojo
  };

  const coloresBarras = puntajesPorFortaleza.map(p => getColorPorNivel(p));

  // Datos para gráfico de línea
  const dataLinea = {
    labels: fechas,
    datasets: [
      {
        label: fortalezaActual.replace(/_/g, ' '),
        data: puntajesPorFortaleza,
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

  // Datos para gráfico de barras
  const dataBarras = {
    labels: fechas,
    datasets: [
      {
        label: fortalezaActual.replace(/_/g, ' '),
        data: puntajesPorFortaleza,
        backgroundColor: coloresBarras,
        borderColor: coloresBarras,
        borderWidth: 2,
        borderRadius: 8,
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
        text: `Evolución de ${fortalezaActual.replace(/_/g, ' ').toUpperCase()} - Test ${testType}`,
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
      <h2 style={{ marginBottom: '1.5rem', color: '#333', fontSize: '1.8rem' }}>
        📈 Evolución Temporal por Fortaleza
      </h2>

      {/* Controles */}
      <div style={{
        display: 'flex',
        gap: '1rem',
        marginBottom: '2rem',
        flexWrap: 'wrap',
        alignItems: 'center'
      }}>
        {/* Selector de Fortaleza */}
        <div style={{ flex: 1, minWidth: '250px' }}>
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
                {fortaleza.replace(/_/g, ' ')}
              </option>
            ))}
          </select>
        </div>

        {/* Selector de tipo de gráfico */}
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#333' }}>
            Tipo de gráfico:
          </label>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => setVistaGrafico('linea')}
              style={{
                padding: '0.75rem 1.5rem',
                border: `2px solid ${vistaGrafico === 'linea' ? '#1abc53' : '#ddd'}`,
                backgroundColor: vistaGrafico === 'linea' ? '#1abc53' : '#fff',
                color: vistaGrafico === 'linea' ? '#fff' : '#333',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 'bold',
                transition: 'all 0.3s'
              }}
            >
              📊 Línea
            </button>
            <button
              onClick={() => setVistaGrafico('barras')}
              style={{
                padding: '0.75rem 1.5rem',
                border: `2px solid ${vistaGrafico === 'barras' ? '#1abc53' : '#ddd'}`,
                backgroundColor: vistaGrafico === 'barras' ? '#1abc53' : '#fff',
                color: vistaGrafico === 'barras' ? '#fff' : '#333',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 'bold',
                transition: 'all 0.3s'
              }}
            >
              📈 Barras
            </button>
          </div>
        </div>
      </div>

      {/* Gráfico */}
      <div style={{ height: '400px', marginBottom: '2rem', position: 'relative' }}>
        {vistaGrafico === 'linea' ? (
          <Line data={dataLinea} options={optionesComunes} />
        ) : (
          <Bar data={dataBarras} options={optionesComunes} />
        )}
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
          <h3 style={{ marginBottom: '1rem', color: '#333' }}>📊 Comparación Período a Período - Todas las Fortalezas</h3>
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
              const iconoTendencia = cambio > 0 ? '📈' : (cambio < 0 ? '📉' : '➡️');
              
              return (
                <div key={fortaleza} style={{
                  backgroundColor: '#fff',
                  padding: '1rem',
                  borderRadius: '6px',
                  border: `2px solid ${colorTendencia}33`
                }}>
                  <div style={{ marginBottom: '0.75rem' }}>
                    <strong style={{ color: '#333', fontSize: '0.95rem' }}>
                      {fortaleza.replace(/_/g, ' ')}
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
        <h3 style={{ marginBottom: '1rem', color: '#333' }}>📊 Estadísticas Generales</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div>
            <strong style={{ color: '#666' }}>Puntaje Actual:</strong>
            <div style={{
              fontSize: '1.8rem',
              color: getColorPorNivel(puntajesPorFortaleza[puntajesPorFortaleza.length - 1]),
              fontWeight: 'bold',
              marginTop: '0.5rem'
            }}>
              {puntajesPorFortaleza[puntajesPorFortaleza.length - 1].toFixed(2)}/5.0
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
              {Math.max(...puntajesPorFortaleza).toFixed(2)}/5.0
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
              {Math.min(...puntajesPorFortaleza).toFixed(2)}/5.0
            </div>
          </div>
          <div>
            <strong style={{ color: '#666' }}>Variación Total:</strong>
            <div style={{
              fontSize: '1.8rem',
              color: Math.max(...puntajesPorFortaleza) - Math.min(...puntajesPorFortaleza) > 0 ? '#f39c12' : '#1abc53',
              fontWeight: 'bold',
              marginTop: '0.5rem'
            }}>
              {(Math.max(...puntajesPorFortaleza) - Math.min(...puntajesPorFortaleza)).toFixed(2)}
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
              {(puntajesPorFortaleza.reduce((a, b) => a + b, 0) / puntajesPorFortaleza.length).toFixed(2)}/5.0
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