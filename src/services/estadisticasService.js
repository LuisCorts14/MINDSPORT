// estadisticasService.js
import { fortalezasIED } from '../data/fortalezasIED';
import { fortalezasIPED } from '../data/fortalezasIPED';

/**
 * Servicio para calcular estadísticas agregadas del grupo de futbolistas
 */

/**
 * Calcula las estadísticas del grupo basadas en los resultados de los futbolistas
 * @param {Array} futbolistas - Array de futbolistas con sus resultados
 * @param {string} tipoTest - 'IED' o 'IPED'
 * @returns {Object} Estadísticas agregadas del grupo
 */
export function calcularEstadisticasGrupo(futbolistas, tipoTest = 'IED') {
  if (!futbolistas || futbolistas.length === 0) {
    return null;
  }

  // Filtrar futbolistas que tienen resultados del tipo de test especificado
  const futbolistasConResultados = futbolistas.filter(f => {
    if (!f.resultados || f.resultados.length === 0) return false;
    return f.resultados.some(r => r.tipoTest === tipoTest || r.test === tipoTest);
  });

  if (futbolistasConResultados.length === 0) {
    return null;
  }

  // Obtener las fortalezas según el tipo de test desde las definiciones reales
  const fortalezas = tipoTest === 'IED' 
    ? Object.keys(fortalezasIED)
    : Object.keys(fortalezasIPED);

  // Agregar puntajes por fortaleza
  const puntajesPorFortaleza = {};
  const conteosPorFortaleza = {};

  fortalezas.forEach(fortaleza => {
    puntajesPorFortaleza[fortaleza] = [];
    conteosPorFortaleza[fortaleza] = 0;
  });

  // Recopilar todos los puntajes
  futbolistasConResultados.forEach(futbolista => {
    const ultimoResultado = futbolista.resultados
      .filter(r => r.tipoTest === tipoTest || r.test === tipoTest)
      .sort((a, b) => new Date(b.fecha || b.fechaRealizacion) - new Date(a.fecha || a.fechaRealizacion))[0];

    if (ultimoResultado && ultimoResultado.puntajes) {
      fortalezas.forEach(fortaleza => {
        // Buscar el puntaje (puede estar en diferentes formatos)
        let puntaje = ultimoResultado.puntajes[fortaleza];
        
        if (puntaje !== undefined && puntaje !== null) {
          // Si es un objeto con promedio, extrae el promedio
          if (typeof puntaje === 'object' && puntaje.promedio !== undefined) {
            puntaje = puntaje.promedio;
          }
          
          // Convertir a número si es string
          puntaje = parseFloat(puntaje);
          
          if (!isNaN(puntaje)) {
            puntajesPorFortaleza[fortaleza].push(puntaje);
            conteosPorFortaleza[fortaleza]++;
          }
        }
      });
    }
  });

  // Calcular promedios y rangos
  const estadisticas = {};
  const promediosGenerales = [];

  fortalezas.forEach(fortaleza => {
    const puntajes = puntajesPorFortaleza[fortaleza];
    
    if (puntajes.length > 0) {
      const promedio = puntajes.reduce((a, b) => a + b, 0) / puntajes.length;
      const minimo = Math.min(...puntajes);
      const maximo = Math.max(...puntajes);
      const desviacion = calcularDesviacionEstandar(puntajes);

      estadisticas[fortaleza] = {
        promedio: Math.round(promedio * 100) / 100,
        minimo: Math.round(minimo * 100) / 100,
        maximo: Math.round(maximo * 100) / 100,
        desviacion: Math.round(desviacion * 100) / 100,
        cantidad: puntajes.length
      };

      promediosGenerales.push(promedio);
    } else {
      estadisticas[fortaleza] = {
        promedio: 0,
        minimo: 0,
        maximo: 0,
        desviacion: 0,
        cantidad: 0
      };
    }
  });

  // Calcular promedio general del grupo
  const promedioGralGrupo = promediosGenerales.length > 0
    ? Math.round((promediosGenerales.reduce((a, b) => a + b, 0) / promediosGenerales.length) * 100) / 100
    : 0;

  return {
    tipoTest,
    totalFutbolistas: futbolistasConResultados.length,
    promedioGeneral: promedioGralGrupo,
    fortalezas: estadisticas,
    fortalezasOrdenadas: fortalezas.sort((a, b) => 
      (estadisticas[b].promedio || 0) - (estadisticas[a].promedio || 0)
    )
  };
}

/**
 * Calcula la desviación estándar de un array de números
 */
function calcularDesviacionEstandar(valores) {
  if (valores.length === 0) return 0;
  
  const promedio = valores.reduce((a, b) => a + b, 0) / valores.length;
  const varianza = valores.reduce((acc, val) => acc + Math.pow(val - promedio, 2), 0) / valores.length;
  return Math.sqrt(varianza);
}

/**
 * Clasifica un puntaje promedio en nivel bajo/medio/alto
 */
export function clasificarNivel(promedio) {
  if (promedio <= 2.5) return 'bajo';
  if (promedio <= 3.5) return 'medio';
  return 'alto';
}

/**
 * Prepara datos para gráfico comparativo del grupo
 */
export function prepararDatosGrafico(estadisticasGrupo) {
  if (!estadisticasGrupo || !estadisticasGrupo.fortalezas) {
    return null;
  }

  const fortalezas = estadisticasGrupo.fortalezasOrdenadas || Object.keys(estadisticasGrupo.fortalezas);
  const promedios = fortalezas.map(f => 
    (estadisticasGrupo.fortalezas[f]?.promedio || 0).toFixed(2)
  );

  return {
    labels: fortalezas.map(f => f.replace(/_/g, ' ').toUpperCase()),
    datasets: [
      {
        label: 'Promedio del Grupo',
        data: promedios,
        borderColor: '#1abc53',
        backgroundColor: 'rgba(26, 188, 83, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 6,
        pointBackgroundColor: '#1abc53',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        borderWidth: 3
      }
    ]
  };
}
