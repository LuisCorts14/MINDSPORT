import React, { useState, useEffect } from 'react';
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

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function ProgresoGrafico({ testType = 'IED', jugadorId = null }) {
  const [resultados, setResultados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargarDatos = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        if (!userData.token) {
          throw new Error('No hay token de autenticación');
        }

        // Obtener resultados del backend
        const endpoint = jugadorId
          ? `http://localhost:8080/api/tests/futbolista/${jugadorId}/resultados`
          : `http://localhost:8080/api/tests/futbolista/${userData.id}/resultados`;

        console.log('🔄 Intentando obtener datos desde:', endpoint);

        const response = await fetch(endpoint, {
          headers: {
            'Authorization': `Bearer ${userData.token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          console.error('❌ Error del servidor:', response.status, response.statusText);
          // Intentar endpoint alternativo
          const alternativeEndpoint = jugadorId
            ? `http://localhost:8080/api/futbolista/${jugadorId}/resultados`
            : `http://localhost:8080/api/futbolista/resultados`;
          
          console.log('🔄 Intentando endpoint alternativo:', alternativeEndpoint);
          const altResponse = await fetch(alternativeEndpoint, {
            headers: {
              'Authorization': `Bearer ${userData.token}`,
              'Content-Type': 'application/json'
            }
          });

          if (!altResponse.ok) {
            throw new Error(`Error HTTP ${response.status}: ${response.statusText}`);
          }

          let datos = await altResponse.json();
          console.log('✅ Datos del endpoint alternativo:', datos);
          
          // Asegurar que es un array
          if (!Array.isArray(datos)) {
            datos = datos.data || datos.resultados || [];
          }
          
          // Filtrar por tipo de test y ordenar por fecha
          datos = datos
            .filter(r => r.tipoTest === testType || r.test === testType)
            .sort((a, b) => new Date(a.fecha || a.fechaRealizacion) - new Date(b.fecha || b.fechaRealizacion));

          setResultados(datos);
          setLoading(false);
          return;
        }

        let datos = await response.json();
        
        console.log('📊 Datos crudos del backend:', datos);
        
        // Asegurar que es un array
        if (!Array.isArray(datos)) {
          console.warn('Los datos no son un array, intentando extraer de propiedad data:', datos);
          datos = datos.data || datos.resultados || [];
        }
        
        // Filtrar objetos vacíos o sin puntajes
        datos = datos.filter(r => {
          const hasPuntajes = r.puntajes && Object.keys(r.puntajes).length > 0;
          const hasFecha = r.fecha || r.fechaRealizacion;
          if (!hasPuntajes || !hasFecha) {
            console.warn('⚠️ Resultado descartado (sin puntajes o fecha):', r);
          }
          return hasPuntajes && hasFecha;
        });
        
        console.log('📊 Resultados con puntajes válidos:', datos.length);
        
        // Filtrar por tipo de test y ordenar por fecha
        datos = datos
          .filter(r => r.tipoTest === testType || r.test === testType)
          .sort((a, b) => new Date(a.fecha || a.fechaRealizacion) - new Date(b.fecha || b.fechaRealizacion));

        console.log('📊 Datos filtrados por tipo ' + testType + ':', datos.length, 'resultados');
        setResultados(datos);
      } catch (err) {
        console.error('Error cargando datos:', err);
        setError('Error al cargar los datos del gráfico');
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, [jugadorId, testType]);

  if (loading) {
    return (
      <div style={{ marginTop: 24, textAlign: 'center', color: '#999' }}>
        <p>🔄 Cargando datos del gráfico...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ marginTop: 24, textAlign: 'center', color: '#f44336' }}>
        <p>❌ {error}</p>
      </div>
    );
  }

  // Filtrar resultados por tipo de test
  const resultadosFiltrados = resultados.filter(r => r.tipoTest === testType);
  
  // Validar que hay datos del tipo de test especificado
  if (resultadosFiltrados.length === 0) {
    return (
      <div style={{ marginTop: 24, textAlign: 'center', color: '#999' }}>
        <p>📊 {jugadorId ? `Este futbolista aún no tiene resultados ${testType}` : `Aún no tienes resultados ${testType}`} para visualizar.</p>
        <p>{jugadorId ? `El futbolista debe completar el test ${testType} para ver datos.` : `Completa el test ${testType} para ver tu progreso.`}</p>
      </div>
    );
  }

  // Mostrar con al menos 1 intento (mejor que requerir 2)
  if (resultados.length < 1) {
    return (
      <div style={{ marginTop: 24, textAlign: 'center', color: '#999' }}>
        <p>📊 {jugadorId ? 'Este futbolista aún no tiene intentos suficientes' : 'Aún no tienes intentos suficientes'} para visualizar tu progreso.</p>
        <p>{jugadorId ? 'El futbolista debe completar el test varias veces para ver la evolución.' : 'Completa el test varias veces para ver tu evolución.'}</p>
      </div>
    );
  }

  // Definir fortalezas por tipo de test
  const fortalezasPorTest = {
    IED: ['percepcion_emocional', 'gestion_autoemocional', 'gestion_heteroemocional', 'utilizacion_emocional'],
    IPED: ['autoconfianza', 'control_afrontamiento_negativo', 'control_atencional', 'control_visuo_imaginativo', 'nivel_motivacional', 'control_afrontamiento_positivo', 'control_actitudinal']
  };

  // Obtener fortalezas CORRESPONDIENTES al tipo de test (no todas)
  const fortalezas = fortalezasPorTest[testType] || Object.keys(resultadosFiltrados[0].puntajes || {});

  console.log('📊 Fortalezas para mostrar en ' + testType + ':', fortalezas);
  console.log('📊 Usando datos filtrados:', resultadosFiltrados.length, 'resultados');

  // Preparar fechas para el eje X usando datos filtrados
  const fechas = resultadosFiltrados.map((r) => {
    const fecha = new Date(r.fecha || r.fechaRealizacion);
    return fecha.toLocaleDateString('es-CL', {
      day: '2-digit',
      month: 'short',
      year: '2-digit'
    });
  });

  // Colores para cada fortaleza
  const palette = [
    '#1abc53', // Verde - IED
    '#007bff', // Azul
    '#6a4fff', // Morado
    '#FF6384', 
    '#36A2EB', 
    '#FFCE56', 
    '#4BC0C0',
    '#FF9F40'
  ];

  // Crear datasets por fortaleza
  const datasets = fortalezas.map((fortaleza, idx) => {
    // Extraer puntajes (manejar tanto objetos como números)
    const datos = resultadosFiltrados.map((r) => {
      const puntaje = r.puntajes[fortaleza];
      if (typeof puntaje === 'object' && puntaje !== null && 'promedio' in puntaje) {
        return puntaje.promedio;
      }
      return typeof puntaje === 'number' ? puntaje : 0;
    });

    return {
      label: fortaleza.replace(/_/g, ' ').toUpperCase(),
      data: datos,
      fill: false,
      borderColor: palette[idx % palette.length],
      backgroundColor: palette[idx % palette.length],
      tension: 0,
      borderWidth: 3,
      pointRadius: 6,
      pointHoverRadius: 8,
      pointBackgroundColor: '#fff',
      pointBorderWidth: 2,
      pointBorderColor: palette[idx % palette.length],
    };
  });

  const data = {
    labels: fechas,
    datasets,
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          boxWidth: 20,
          padding: 16,
          font: { size: 13, weight: '600' },
          usePointStyle: true,
          pointStyle: 'circle',
          spacing: 20
        }
      },
      title: {
        display: true,
        text: `📊 Evolución del Test ${testType}`,
        font: { size: 18, weight: 'bold' },
        color: '#1a1a1a',
        padding: 24
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(0,0,0,0.85)',
        padding: 14,
        titleFont: { size: 14, weight: 'bold' },
        bodyFont: { size: 13 },
        borderColor: '#fff',
        borderWidth: 1,
        callbacks: {
          label: function(context) {
            return context.dataset.label + ': ' + context.parsed.y.toFixed(2);
          }
        }
      }
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 5,
        ticks: {
          stepSize: 0.5,
          font: { size: 12, weight: '500' }
        },
        title: {
          display: true,
          text: 'Puntaje (0-5)',
          font: { size: 13, weight: 'bold' }
        },
        grid: {
          color: 'rgba(0,0,0,0.08)',
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
          autoSkipPadding: 12,
          font: { size: 11 }
        },
        grid: {
          display: false
        }
      },
    },
  };

  return (
    <div style={{ 
      marginTop: 24, 
      height: '500px',
      backgroundColor: '#fff',
      padding: '20px',
      borderRadius: '12px',
      boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
      border: '1px solid #f0f0f0'
    }}>
      <Line data={data} options={options} />
    </div>
  );
}

export default ProgresoGrafico;
