// src/services/preguntasService.js
const API_BASE_URL = 'http://localhost:8080/api';

/**
 * Obtiene todas las preguntas del test IED desde MongoDB
 * @returns {Promise<Array>} Array de preguntas IED
 */
export const obtenerPreguntasIED = async () => {
  try {
    // Obtener token del localStorage
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    const token = userData.token;

    const headers = {
      'Content-Type': 'application/json',
    };

    // Agregar Authorization header si hay token
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/preguntas/ied`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      if (response.status === 403) {
        throw new Error(`Acceso denegado - Error 403: Verifica tu autenticación`);
      } else if (response.status === 401) {
        throw new Error(`No autorizado - Error 401: Tu sesión puede haber expirado`);
      } else {
        throw new Error(`Error al obtener preguntas IED: ${response.status}`);
      }
    }

    const data = await response.json();
    console.log('📊 Preguntas IED cargadas desde MongoDB:', data.length);
    return data;
  } catch (error) {
    console.error('❌ Error cargando preguntas IED desde MongoDB:', error);
    
    // Fallback: usar preguntas locales si falla la API
    const { iedQuestions } = await import('../data/iedTest.js');
    console.log('🔄 Usando preguntas IED desde archivos locales como fallback');
    return iedQuestions;
  }
};

/**
 * Obtiene todas las preguntas del test IPED desde MongoDB
 * @returns {Promise<Array>} Array de preguntas IPED
 */
export const obtenerPreguntasIPED = async () => {
  try {
    // Obtener token del localStorage
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    const token = userData.token;

    const headers = {
      'Content-Type': 'application/json',
    };

    // Agregar Authorization header si hay token
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/preguntas/iped`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      if (response.status === 403) {
        throw new Error(`Acceso denegado - Error 403: Verifica tu autenticación`);
      } else if (response.status === 401) {
        throw new Error(`No autorizado - Error 401: Tu sesión puede haber expirado`);
      } else {
        throw new Error(`Error al obtener preguntas IPED: ${response.status}`);
      }
    }

    const data = await response.json();
    console.log('📊 Preguntas IPED cargadas desde MongoDB:', data.length);
    return data;
  } catch (error) {
    console.error('❌ Error cargando preguntas IPED desde MongoDB:', error);
    
    // Fallback: usar preguntas locales si falla la API
    const { ipedQuestions } = await import('../data/ipedTest.js');
    console.log('🔄 Usando preguntas IPED desde archivos locales como fallback');
    return ipedQuestions;
  }
};

/**
 * Crear/actualizar preguntas en MongoDB (solo para administradores)
 * @param {string} tipoTest - 'ied' o 'iped'
 * @param {Array} preguntas - Array de preguntas a guardar
 * @param {string} token - Token de autenticación
 * @returns {Promise<Object>} Respuesta del servidor
 */
export const guardarPreguntas = async (tipoTest, preguntas, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/preguntas/${tipoTest}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ preguntas }),
    });

    if (!response.ok) {
      throw new Error(`Error al guardar preguntas ${tipoTest}: ${response.status}`);
    }

    const data = await response.json();
    console.log(`✅ Preguntas ${tipoTest} guardadas en MongoDB:`, data);
    return data;
  } catch (error) {
    console.error(`❌ Error guardando preguntas ${tipoTest}:`, error);
    throw error;
  }
};

/**
 * Migrar preguntas desde archivos locales a MongoDB (función de utilidad)
 * @param {string} token - Token de autenticación de administrador
 */
export const migrarPreguntasAMongoDB = async (token) => {
  try {
    console.log('🚀 Iniciando migración de preguntas a MongoDB...');
    
    // Importar preguntas locales
    const { iedQuestions } = await import('../data/iedTest.js');
    const { ipedQuestions } = await import('../data/ipedTest.js');
    
    // Guardar en MongoDB
    const resultadoIED = await guardarPreguntas('ied', iedQuestions, token);
    const resultadoIPED = await guardarPreguntas('iped', ipedQuestions, token);
    
    console.log('✅ Migración completada exitosamente:', {
      ied: resultadoIED,
      iped: resultadoIPED
    });
    
    return {
      success: true,
      ied: resultadoIED,
      iped: resultadoIPED
    };
    
  } catch (error) {
    console.error('❌ Error durante la migración:', error);
    throw error;
  }
};