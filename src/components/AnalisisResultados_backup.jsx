import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Configuración específica para cada test
const configuracionTests = {
  IED: {
    nombre: "Test IED - Inteligencia Emocional Deportiva",
    descripcion: "Evalúa la capacidad de gestión emocional en contextos deportivos",
    dimensiones: {
      autorregulacion: { 
        nombre: "Autorregulación", 
        descripcion: "Capacidad de controlar impulsos y emociones",
        icono: "🎯"
      },
      motivacion: { 
        nombre: "Motivación", 
        descripcion: "Impulso interno hacia el logro deportivo",
        icono: "🔥"
      },
      empatia: { 
        nombre: "Empatía", 
        descripcion: "Comprensión emocional hacia compañeros y rivales",
        icono: "🤝"
      },
      reconocimiento: { 
        nombre: "Reconocimiento", 
        descripcion: "Identificación de estados emocionales propios y ajenos",
        icono: "🔍"
      },
      resiliencia: { 
        nombre: "Resiliencia", 
        descripcion: "Capacidad de recuperación ante adversidades",
        icono: "💪"
      }
    },
    recomendaciones: {
      autorregulacion: "Técnicas de respiración consciente y control de impulsos",
      motivacion: "Establecimiento de metas específicas y visualización de logros",
      empatia: "Ejercicios de comunicación efectiva y trabajo en equipo",
      reconocimiento: "Práctica de auto-observación emocional y registro de estados",
      resiliencia: "Entrenamiento mental en situaciones de presión y adversidad"
    }
  },
  IPED: {
    nombre: "Test IPED - Inventario Psicológico de Ejecución Deportiva",
    descripcion: "Mide habilidades psicológicas específicas para el rendimiento deportivo",
    dimensiones: {
      autoconfianza: { 
        nombre: "Autoconfianza", 
        descripcion: "Creencia en las propias habilidades deportivas",
        icono: "⭐"
      },
      control_emocional: { 
        nombre: "Control Emocional", 
        descripcion: "Manejo efectivo de emociones bajo presión",
        icono: "🧘"
      },
      actitud_positiva: { 
        nombre: "Actitud Positiva", 
        descripcion: "Enfoque optimista hacia la competencia",
        icono: "😊"
      },
      control_atencional: { 
        nombre: "Control Atencional", 
        descripcion: "Capacidad de mantener la concentración",
        icono: "🎯"
      },
      afrontamiento_negativo: { 
        nombre: "Afrontamiento Negativo", 
        descripcion: "Gestión inadecuada de situaciones adversas (menor es mejor)",
        icono: "❌",
        inverso: true // Menor puntaje es mejor
      },
      afrontamiento_positivo: { 
        nombre: "Afrontamiento Positivo", 
        descripcion: "Estrategias efectivas ante situaciones difíciles",
        icono: "✅"
      },
      visualizacion: { 
        nombre: "Visualización", 
        descripcion: "Capacidad de crear imágenes mentales de ejecución",
        icono: "👁️"
      }
    },
    recomendaciones: {
      autoconfianza: "Registro de logros, técnicas de afirmación positiva",
      control_emocional: "Entrenamiento en regulación emocional y mindfulness",
      actitud_positiva: "Práctica de reencuadre cognitivo y pensamiento constructivo",
      control_atencional: "Ejercicios de concentración y atención selectiva",
      afrontamiento_negativo: "Identificar y modificar estrategias contraproducentes",
      afrontamiento_positivo: "Desarrollo de estrategias de afrontamiento adaptativas",
      visualizacion: "Entrenamiento sistemático en imaginería mental"
    }
  }
};

// Configuración de rangos y colores
const configuracionAnalisis = {
  rangos: {
    excelente: { min: 8, color: '#4CAF50', descripcion: 'EXCELENTE' },
    bueno: { min: 6, color: '#8BC34A', descripcion: 'BUENO' },
    regular: { min: 4, color: '#FF9800', descripcion: 'REGULAR' },
    mejorar: { min: 0, color: '#F44336', descripcion: 'NECESITA MEJORA' }
  },
  maxPuntaje: 10
};

// Mapeo exacto de las fortalezas por test
const fortalezasIED = {
  autorregulacion: [1, 6, 11, 16, 19, 20, 26, 27],
  motivacion: [2, 9, 13, 22],
  empatia: [0, 3, 4, 12, 17, 23, 24, 25, 28, 29],
  reconocimiento: [7, 8, 10, 14, 18, 21],
  resiliencia: [5, 15]
};

const fortalezasIPED = {
  autoconfianza: [0, 7, 14, 21],
  control_emocional: [1, 5, 6, 8, 13, 16, 22, 23, 27],
  actitud_positiva: [4, 11, 12, 18, 20, 25, 26, 39, 40],
  control_atencional: [2, 9, 37],
  afrontamiento_negativo: [15, 19, 29, 30, 31, 32],
  afrontamiento_positivo: [28, 33, 34, 35, 36, 41],
  visualizacion: [3, 10, 17, 24, 38]
};

// Funciones auxiliares
function obtenerNivel(puntaje) {
  if (puntaje >= 8) return configuracionAnalisis.rangos.excelente.descripcion;
  if (puntaje >= 6) return configuracionAnalisis.rangos.bueno.descripcion;
  if (puntaje >= 4) return configuracionAnalisis.rangos.regular.descripcion;
  return configuracionAnalisis.rangos.mejorar.descripcion;
}

function obtenerColorPorPuntaje(puntaje) {
  if (puntaje >= 8) return 'rgba(76, 175, 80, 0.8)';
  if (puntaje >= 6) return 'rgba(139, 195, 74, 0.8)';
  if (puntaje >= 4) return 'rgba(255, 152, 0, 0.8)';
  return 'rgba(244, 67, 54, 0.8)';
}

// Función para convertir nombres de dimensión a formato legible
function formatearNombreDimension(dimension) {
  const nombresFormateados = {
    // IED
    'autorregulacion': 'Autorregulación',
    'motivacion': 'Motivación', 
    'empatia': 'Empatía',
    'reconocimiento': 'Reconocimiento',
    'resiliencia': 'Resiliencia',
    // IPED
    'autoconfianza': 'Autoconfianza',
    'control_emocional': 'Control Emocional',
    'actitud_positiva': 'Actitud Positiva',
    'control_atencional': 'Control Atencional',
    'afrontamiento_negativo': 'Afrontamiento Negativo',
    'afrontamiento_positivo': 'Afrontamiento Positivo',
    'visualizacion': 'Visualización'
  };
  
  return nombresFormateados[dimension] || 
         dimension.replace(/_/g, ' ')
                  .replace(/\b\w/g, l => l.toUpperCase());
}

const AnalisisResultados = ({ resultado }) => {
  if (!resultado) {
    return <div className="p-4 text-center text-gray-600">No hay datos de resultado para analizar.</div>;
  }

  // Verificar si tenemos puntajes directos o necesitamos calcular desde respuestas
  let puntajes = {};
  let tipoTest = '';
  
  if (resultado.puntajes) {
    // Datos ya procesados del backend
    puntajes = resultado.puntajes;
    tipoTest = resultado.test || (Object.keys(resultado.puntajes).includes('autoconfianza') ? 'IPED' : 'IED');
  } else if (resultado.respuestas) {
    // Datos sin procesar, necesitamos calcular
    tipoTest = resultado.respuestas.length <= 30 ? 'IED' : 'IPED';
    const dimensiones = tipoTest === 'IED' ? fortalezasIED : fortalezasIPED;
    
    // Calcular puntajes por dimensión desde respuestas
    const calcularPuntajeDimension = (preguntasDimension) => {
      if (!preguntasDimension || preguntasDimension.length === 0) return 0;
      
      const respuestasDimension = preguntasDimension
        .map(indice => resultado.respuestas[indice])
        .filter(respuesta => respuesta !== undefined && respuesta !== null);
      
      if (respuestasDimension.length === 0) return 0;
      
      const suma = respuestasDimension.reduce((acc, valor) => acc + parseInt(valor), 0);
      return Math.round((suma / respuestasDimension.length) * 2); // Escala 1-10
    };

    Object.entries(dimensiones).forEach(([dimension, preguntas]) => {
      puntajes[dimension] = calcularPuntajeDimension(preguntas);
    });
  } else {
    return <div className="p-4 text-center text-gray-600">No hay datos de resultado para analizar.</div>;
  }

  const config = configuracionTests[tipoTest];
  if (!config) {
    return <div className="p-4 text-center text-gray-600">Tipo de test no reconocido.</div>;
  }

  // Formatear la fecha si está disponible
  const fechaFormateada = resultado.fecha 
    ? new Date(resultado.fecha).toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit', 
        year: 'numeric'
      })
    : null;

  const labels = Object.keys(puntajes).map(dimension => 
    config.dimensiones[dimension]?.nombre || formatearNombreDimension(dimension)
  );
  
  const valores = Object.values(puntajes);
  const colores = valores.map(valor => obtenerColorPorPuntaje(valor));

  const data = {
    labels,
    datasets: [
      {
        label: 'Puntaje',
        data: valores,
        backgroundColor: colores,
        borderColor: colores.map(color => color.replace('0.8', '1')),
        borderWidth: 2,
        borderRadius: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: `${config.nombre}${fechaFormateada ? ` - ${fechaFormateada}` : ' (Test más reciente)'}`,
        font: { size: 14, weight: 'bold' },
        color: '#1f2937'
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const dimension = Object.keys(puntajes)[context.dataIndex];
            const info = config.dimensiones[dimension];
            const nombreDimension = info?.nombre || formatearNombreDimension(dimension);
            const descripcion = info?.descripcion || `Evaluación de ${nombreDimension.toLowerCase()}`;
            return [
              `${nombreDimension}: ${context.parsed.y}/10`,
              `${descripcion}`,
              `Nivel: ${obtenerNivel(context.parsed.y)}`
            ];
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 10,
        ticks: {
          stepSize: 2,
          color: '#6b7280'
        },
        grid: { color: '#e5e7eb' }
      },
      x: {
        ticks: { 
          color: '#6b7280',
          maxRotation: 45
        },
        grid: { display: false }
      }
    },
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            📊 Análisis Psicológico Actual
          </h3>
          {fechaFormateada && (
            <div className="text-right">
              <span className="text-sm text-gray-500">Test más reciente</span>
              <div className="text-sm font-medium text-blue-600">{fechaFormateada}</div>
            </div>
          )}
        </div>
        <p className="text-sm text-gray-600 mt-1">
          {config.descripcion}
          {fechaFormateada && (
            <span className="ml-2 text-blue-600">• Basado en test del {fechaFormateada}</span>
          )}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de barras */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div style={{ height: '300px' }}>
            <Bar data={data} options={options} />
          </div>
        </div>

        {/* Análisis detallado */}
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-800 border-b pb-2">
            📈 Análisis por Dimensión
          </h4>
          
          {Object.entries(puntajes).map(([dimension, puntaje]) => {
            const info = config.dimensiones[dimension];
            const nombreDimension = info?.nombre || formatearNombreDimension(dimension);
            const descripcionDimension = info?.descripcion || `Evaluación de ${nombreDimension.toLowerCase()}`;
            const iconoDimension = info?.icono || '📊';
            const nivel = obtenerNivel(puntaje);
            const color = obtenerColorPorPuntaje(puntaje);
            const esInverso = info?.inverso || false;
            
            return (
              <div key={dimension} className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h5 className="font-medium text-gray-800 flex items-center gap-2">
                    <span>{iconoDimension}</span>
                    {nombreDimension}
                  </h5>
                  <div className="text-right">
                    <span className="text-lg font-bold" style={{ color: color.replace('0.8', '1') }}>
                      {puntaje}/10
                    </span>
                    <div className={`text-xs px-2 py-1 rounded-full inline-block ml-2 ${
                      esInverso 
                        ? (puntaje <= 4 ? 'bg-green-100 text-green-800' : 
                           puntaje <= 6 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800')
                        : (puntaje >= 8 ? 'bg-green-100 text-green-800' : 
                           puntaje >= 6 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800')
                    }`}>
                      {esInverso && puntaje <= 4 ? 'EXCELENTE' :
                       esInverso && puntaje <= 6 ? 'BUENO' :
                       esInverso && puntaje > 6 ? 'NECESITA MEJORA' : nivel}
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-2">{descripcionDimension}</p>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="h-2 rounded-full transition-all duration-500"
                    style={{ 
                      width: `${(puntaje / 10) * 100}%`, 
                      backgroundColor: color.replace('0.8', '1') 
                    }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recomendaciones generales */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
          💡 Recomendaciones Personalizadas
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(puntajes)
            .filter(([_, puntaje]) => puntaje < 7)
            .slice(0, 4) // Mostrar máximo 4 recomendaciones
            .map(([dimension, puntaje]) => {
              const info = config.dimensiones[dimension];
              const nombreDimension = info?.nombre || formatearNombreDimension(dimension);
              const iconoDimension = info?.icono || '📊';
              const recomendacion = config.recomendaciones[dimension] || 
                `Trabajar en el desarrollo de ${nombreDimension.toLowerCase()} mediante ejercicios específicos.`;
              
              return (
                <div key={dimension} className="bg-white border border-blue-200 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <span>{iconoDimension}</span>
                    <span className="font-medium text-blue-800">{nombreDimension}</span>
                  </div>
                  <p className="text-sm text-gray-700">{recomendacion}</p>
                </div>
              );
            })}
        </div>
        
        {Object.values(puntajes).every(puntaje => puntaje >= 7) && (
          <div className="text-center">
            <p className="text-green-700 font-medium">
              🎉 ¡Excelente perfil psicológico! Mantén el entrenamiento mental constante.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalisisResultados;