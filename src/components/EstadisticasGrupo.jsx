import React, { useState, useEffect } from 'react';
import { Line, Bar } from 'react-chartjs-2';
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
  Filler
} from 'chart.js';
import { calcularEstadisticasGrupo, clasificarNivel, prepararDatosGrafico } from '../services/estadisticasService';
import styles from './EstadisticasGrupo.module.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

function EstadisticasGrupo({ futbolistas, testType = 'IED' }) {
  const [estadisticas, setEstadisticas] = useState(null);
  const [vistaActual, setVistaActual] = useState('grafico'); // 'grafico', 'tabla', 'ranking'
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarEstadisticas = async () => {
      try {
        setLoading(true);
        
        if (!futbolistas || futbolistas.length === 0) {
          setEstadisticas(null);
          setLoading(false);
          return;
        }

        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        const token = userData.token;

        // Obtener resultados para todos los futbolistas
        const futbolistasConResultados = await Promise.all(
          futbolistas.map(async (futbolista) => {
            try {
              const response = await fetch(
                `http://localhost:8080/api/tests/futbolista/${futbolista.id}/resultados`,
                {
                  headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                  }
                }
              );

              if (response.ok) {
                let resultados = await response.json();
                // Asegurar que sea un array
                if (!Array.isArray(resultados)) {
                  resultados = resultados.data || resultados.resultados || [];
                }
                return { ...futbolista, resultados };
              } else {
                return { ...futbolista, resultados: [] };
              }
            } catch (error) {
              console.error(`Error cargando resultados para ${futbolista.nombre}:`, error);
              return { ...futbolista, resultados: [] };
            }
          })
        );

        const stats = calcularEstadisticasGrupo(futbolistasConResultados, testType);
        setEstadisticas(stats);
        setLoading(false);
      } catch (error) {
        console.error('Error cargando estadísticas:', error);
        setEstadisticas(null);
        setLoading(false);
      }
    };

    cargarEstadisticas();
  }, [futbolistas, testType]);

  if (loading) {
    return <div className={styles.loading}>Cargando estadísticas...</div>;
  }

  if (!estadisticas) {
    return (
      <div className={styles.noData}>
        <p>No hay datos de {testType} para mostrar estadísticas del grupo</p>
      </div>
    );
  }

  const datosGrafico = prepararDatosGrafico(estadisticas);

  const handleChangeVista = (vista) => {
    setVistaActual(vista);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>📊 Estadísticas del Grupo - {testType}</h2>
        <div className={styles.resumenGeneral}>
          <div className={styles.infoItem}>
            <span className={styles.label}>Integrantes:</span>
            <span className={styles.valor}>{estadisticas.totalFutbolistas}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.label}>Promedio General:</span>
            <span className={`${styles.valor} ${styles[clasificarNivel(estadisticas.promedioGeneral)]}`}>
              {estadisticas.promedioGeneral.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      <div className={styles.controles}>
        <button
          className={`${styles.btnVista} ${vistaActual === 'grafico' ? styles.activo : ''}`}
          onClick={() => handleChangeVista('grafico')}
        >
          Gráfico
        </button>
        <button
          className={`${styles.btnVista} ${vistaActual === 'tabla' ? styles.activo : ''}`}
          onClick={() => handleChangeVista('tabla')}
        >
          Tabla
        </button>
        <button
          className={`${styles.btnVista} ${vistaActual === 'ranking' ? styles.activo : ''}`}
          onClick={() => handleChangeVista('ranking')}
        >
          Ranking
        </button>
      </div>

      {vistaActual === 'grafico' && (
        <div className={styles.graficoContainer}>
          <Line
            data={datosGrafico}
            options={{
              responsive: true,
              maintainAspectRatio: true,
              plugins: {
                legend: {
                  display: true,
                  position: 'top',
                  labels: {
                    usePointStyle: true,
                    padding: 20,
                    font: { size: 14, weight: 'bold' }
                  }
                },
                tooltip: {
                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                  padding: 12,
                  titleFont: { size: 14, weight: 'bold' },
                  bodyFont: { size: 12 },
                  callbacks: {
                    label: function(context) {
                      return `Promedio: ${context.parsed.y}`;
                    }
                  }
                }
              },
              scales: {
                y: {
                  beginAtZero: true,
                  max: 5,
                  ticks: {
                    stepSize: 0.5,
                    font: { size: 12 }
                  },
                  grid: {
                    color: 'rgba(0, 0, 0, 0.1)'
                  }
                },
                x: {
                  ticks: {
                    font: { size: 12 }
                  }
                }
              }
            }}
          />
        </div>
      )}

      {vistaActual === 'tabla' && (
        <div className={styles.tablaContainer}>
          <table className={styles.tabla}>
            <thead>
              <tr>
                <th>Fortaleza</th>
                <th>Promedio</th>
                <th>Mínimo</th>
                <th>Máximo</th>
                <th>Desv. Est.</th>
                <th>N</th>
              </tr>
            </thead>
            <tbody>
              {estadisticas.fortalezasOrdenadas.map(fortaleza => {
                const stat = estadisticas.fortalezas[fortaleza];
                const nivel = clasificarNivel(stat.promedio);
                return (
                  <tr key={fortaleza} className={styles[`row-${nivel}`]}>
                    <td className={styles.fortalezaNombre}>
                      {fortaleza.replace(/_/g, ' ').toUpperCase()}
                    </td>
                    <td className={styles[`valor-${nivel}`]}>
                      <strong>{stat.promedio.toFixed(2)}</strong>
                    </td>
                    <td>{stat.minimo.toFixed(2)}</td>
                    <td>{stat.maximo.toFixed(2)}</td>
                    <td>{stat.desviacion.toFixed(2)}</td>
                    <td className={styles.cantidad}>{stat.cantidad}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {vistaActual === 'ranking' && (
        <div className={styles.rankingContainer}>
          {estadisticas.fortalezasOrdenadas.map((fortaleza, index) => {
            const stat = estadisticas.fortalezas[fortaleza];
            const nivel = clasificarNivel(stat.promedio);
            const porcentaje = (stat.promedio / 5) * 100;

            return (
              <div key={fortaleza} className={styles.rankingItem}>
                <div className={styles.rankingHeader}>
                  <span className={styles.posicion}>#{index + 1}</span>
                  <span className={styles.nombreFortaleza}>
                    {fortaleza.replace(/_/g, ' ').toUpperCase()}
                  </span>
                  <span className={`${styles.badge} ${styles[`badge-${nivel}`]}`}>
                    {stat.promedio.toFixed(2)}
                  </span>
                </div>
                <div className={styles.barraProgreso}>
                  <div
                    className={`${styles.relleno} ${styles[`relleno-${nivel}`]}`}
                    style={{ width: `${porcentaje}%` }}
                  />
                </div>
                <div className={styles.detalles}>
                  <span>Rango: {stat.minimo.toFixed(1)} - {stat.maximo.toFixed(1)}</span>
                  <span>Equipo: {stat.cantidad} jugadores</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default EstadisticasGrupo;
