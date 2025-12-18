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
import { calcularPuntajes } from '../services/resultadoService';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Función para capitalizar texto
const capitalizarFortaleza = (texto) => {
  return texto
    .replace(/_/g, ' ')
    .split(' ')
    .map(palabra => palabra.charAt(0).toUpperCase() + palabra.slice(1))
    .join(' ');
};

// Configuración específica para cada test
const configuracionTests = {
  IED: {
    nombre: "Test IED - Inteligencia Emocional Deportiva",
    descripcion: "Evalúa la capacidad de gestión emocional en contextos deportivos",
    dimensiones: {
      percepcion_emocional: { 
        nombre: "Percepción Emocional", 
        descripcion: "Capacidad de identificar y comprender emociones",
        icono: "🔍"
      },
      gestion_autoemocional: { 
        nombre: "Gestión Auto-emocional", 
        descripcion: "Control y regulación de las propias emociones",
        icono: "🎯"
      },
      gestion_heteroemocional: { 
        nombre: "Gestión Hetero-emocional", 
        descripcion: "Manejo de emociones en relación con otros",
        icono: "🤝"
      },
      utilizacion_emocional: { 
        nombre: "Utilización Emocional", 
        descripcion: "Uso efectivo de las emociones para el rendimiento",
        icono: "⚡"
      }
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
      control_afrontamiento_negativo: { 
        nombre: "Control de Afrontamiento Negativo", 
        descripcion: "Manejo efectivo de emociones bajo presión",
        icono: "🧘"
      },
      control_atencional: { 
        nombre: "Control Atencional", 
        descripcion: "Capacidad de mantener la concentración",
        icono: "🎯"
      },
      control_visuo_imaginativo: { 
        nombre: "Control Visuo-imaginativo", 
        descripcion: "Habilidades de visualización mental",
        icono: "🧠"
      },
      nivel_motivacional: { 
        nombre: "Nivel Motivacional", 
        descripcion: "Impulso y determinación deportiva",
        icono: "🔥"
      },
      control_afrontamiento_positivo: { 
        nombre: "Control de Afrontamiento Positivo", 
        descripcion: "Gestión proactiva de desafíos",
        icono: "💪"
      },
      control_actitudinal: { 
        nombre: "Control Actitudinal", 
        descripcion: "Enfoque optimista hacia la competencia",
        icono: "😊"
      }
    }
  }
};

const AnalisisResultados = ({ resultado }) => {
  if (!resultado) {
    return <div className="p-4 text-center text-gray-600">No hay datos de resultado para analizar.</div>;
  }

  console.log('🔍 AnalisisResultados recibió resultado:', resultado);

  // Determinar tipo de test
  let tipoTest = '';
  if (resultado.tipoTest) {
    tipoTest = resultado.tipoTest;
  } else if (resultado.puntajes) {
    tipoTest = Object.keys(resultado.puntajes).includes('autoconfianza') ? 'IPED' : 'IED';
  } else if (resultado.respuestas) {
    tipoTest = Object.keys(resultado.respuestas).length <= 30 ? 'IED' : 'IPED';
  }

  console.log('📊 Tipo de test detectado:', tipoTest);

  // Obtener puntajes usando la misma lógica que los tests
  let puntajesCalculados = {};
  
  // Verificar si puntajes existe y tiene contenido
  const tienePuntajesValidos = resultado.puntajes && Object.keys(resultado.puntajes).length > 0;
  
  if (tienePuntajesValidos) {
    console.log('✅ Usando puntajes directamente:', resultado.puntajes);
    // Si ya tenemos puntajes calculados, usarlos directamente
    // Manejar tanto objetos con promedio como números simples
    Object.entries(resultado.puntajes).forEach(([fortaleza, valor]) => {
      console.log(`  - ${fortaleza}: ${JSON.stringify(valor)}`);
      if (typeof valor === 'object' && valor !== null && 'promedio' in valor) {
        puntajesCalculados[fortaleza] = valor.promedio;
      } else if (typeof valor === 'number') {
        puntajesCalculados[fortaleza] = valor;
      } else if (typeof valor === 'string') {
        // Intentar convertir si es string
        const numVal = parseFloat(valor);
        if (!isNaN(numVal)) {
          puntajesCalculados[fortaleza] = numVal;
        }
      }
    });
  } else if (resultado.respuestas) {
    // Si no hay puntajes válidos pero tenemos respuestas, calcular desde respuestas
    console.log('✅ Calculando puntajes desde respuestas');
    // Si tenemos respuestas, usar la función de cálculo exacta del servicio
    try {
      // Convertir respuestas de índices base 1 a base 0
      // El backend envía {"1": valor, "2": valor, ...} pero necesitamos {"0": valor, "1": valor, ...}
      const respuestasConvertidas = {};
      Object.entries(resultado.respuestas).forEach(([key, valor]) => {
        const indiceBase1 = parseInt(key, 10);
        const indiceBase0 = indiceBase1 - 1;
        respuestasConvertidas[indiceBase0] = valor;
      });
      
      console.log('🔄 Respuestas convertidas a índices base 0:', respuestasConvertidas);
      
      const puntajesCompletos = calcularPuntajes(respuestasConvertidas, tipoTest);
      console.log('📊 Puntajes completos calculados:', puntajesCompletos);
      // Extraer solo los promedios para el gráfico
      Object.entries(puntajesCompletos).forEach(([fortaleza, datos]) => {
        puntajesCalculados[fortaleza] = datos.promedio;
      });
    } catch (error) {
      console.error('❌ Error calculando puntajes:', error);
      return <div className="p-4 text-center text-red-600">Error calculando puntajes: {error.message}</div>;
    }
  } else {
    console.warn('⚠️ No hay puntajes ni respuestas disponibles');
    return <div className="p-4 text-center text-gray-600">No hay datos suficientes para el análisis.</div>;
  }

  console.log('📈 Puntajes calculados finales:', puntajesCalculados);

  const config = configuracionTests[tipoTest];
  if (!config) {
    return <div className="p-4 text-center text-gray-600">Tipo de test no reconocido: {tipoTest}</div>;
  }

  // Validar que hay puntajes
  if (Object.keys(puntajesCalculados).length === 0) {
    return <div className="p-4 text-center text-gray-600">No hay puntajes disponibles para este análisis.</div>;
  }

  // Preparar datos para el gráfico
  const labels = Object.keys(puntajesCalculados).map(dimension => 
    config.dimensiones[dimension]?.nombre || capitalizarFortaleza(dimension)
  );
  
  const valores = Object.values(puntajesCalculados);

  console.log('📊 Labels para gráfico:', labels);
  console.log('📊 Valores para gráfico:', valores);

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Puntaje',
        data: valores,
        backgroundColor: 'rgba(26, 188, 83, 0.6)',
        borderColor: 'rgba(26, 188, 83, 1)',
        borderWidth: 2,
        borderRadius: 8,
        barPercentage: 0.5,
        categoryPercentage: 0.6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: config.nombre,
        font: { size: 16, weight: 'bold' },
        color: '#333',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const dimension = Object.keys(puntajesCalculados)[context.dataIndex];
            const descripcion = config.dimensiones[dimension]?.descripcion || '';
            return [`Puntaje: ${context.parsed.y.toFixed(1)}/5.0`, descripcion];
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 5,
        ticks: {
          stepSize: 1,
        },
        title: {
          display: true,
          text: 'Puntaje (1-5)',
        },
      },
      x: {
        ticks: {
          maxRotation: 45,
          font: { size: 11 },
        },
      },
    },
  };

  const getNivelColor = (puntaje) => {
    if (puntaje >= 3.51) return '#1abc53'; // Alto - Verde
    if (puntaje >= 2.51) return '#f39c12'; // Medio - Naranja
    return '#e74c3c'; // Bajo - Rojo
  };

  const getNivelTexto = (puntaje) => {
    if (puntaje >= 3.51) return 'Alto';
    if (puntaje >= 2.51) return 'Medio';
    return 'Bajo';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{config.nombre}</h2>
        <p className="text-gray-600">{config.descripcion}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Análisis por Dimensión</h3>
          <div style={{ height: '400px' }}>
            <Bar data={chartData} options={chartOptions} />
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Resultados Detallados</h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {Object.entries(puntajesCalculados).map(([dimension, puntaje]) => {
              const dimConfig = config.dimensiones[dimension];
              if (!dimConfig) return null;

              const nivel = getNivelTexto(puntaje);
              const colorNivel = getNivelColor(puntaje);

              return (
                <div key={dimension} className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  {/* Header con nombre y puntaje */}
                  <div className="px-4 py-3 border-b border-gray-200">
                    <div className="flex items-center justify-between gap-4">
                      {/* Badge del nombre */}
                      <div className="flex-1 inline-block px-4 py-2 rounded-lg font-700 text-15px" style={{ 
                        backgroundColor: colorNivel + '20',
                        color: colorNivel,
                        border: `2px solid ${colorNivel}30`,
                        maxWidth: 'fit-content'
                      }}>
                        {dimConfig.nombre}
                      </div>
                      
                      {/* Puntaje y nivel */}
                      <div className="text-right flex-shrink-0">
                        <span className="text-18px font-bold" style={{ color: colorNivel }}>
                          {puntaje.toFixed(1)}/5.0
                        </span>
                        <span className="text-xs font-600 ml-2 px-2 py-1 rounded" style={{ 
                          color: colorNivel, 
                          backgroundColor: colorNivel + '15'
                        }}>
                          {nivel}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Descripción */}
                  <div className="px-4 py-3">
                    <p className="text-gray-700 text-14px font-500 leading-relaxed">{dimConfig.descripcion}.</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="text-lg font-semibold text-blue-800 mb-2">📊 Interpretación de Resultados</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="text-center">
            <div className="w-4 h-4 bg-green-500 rounded mx-auto mb-1"></div>
            <strong>Alto (3.5-5.0):</strong> Fortaleza destacada
          </div>
          <div className="text-center">
            <div className="w-4 h-4 bg-orange-500 rounded mx-auto mb-1"></div>
            <strong>Medio (2.5-3.5):</strong> Área en desarrollo
          </div>
          <div className="text-center">
            <div className="w-4 h-4 bg-red-500 rounded mx-auto mb-1"></div>
            <strong>Bajo (1.0-2.5):</strong> Requiere atención
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalisisResultados;