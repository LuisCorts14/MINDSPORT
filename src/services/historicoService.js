/**
 * Servicio para obtener datos históricos de tests desde el backend
 */

/**
 * Obtiene el histórico de resultados de un futbolista específico
 * @param {string} futbolistaId - ID del futbolista
 * @param {string} token - Token de autenticación
 * @returns {Promise<Array>} Array de resultados históricos
 */
export async function obtenerHistoricoFutbolista(futbolistaId, token) {
  try {
    const response = await fetch(`http://localhost:8080/api/tests/futbolista/${futbolistaId}/resultados`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      if (response.status === 404) {
        // No hay resultados para este futbolista
        return [];
      }
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const resultados = await response.json();
    
    // Convertir formato del backend al formato que espera el gráfico
    return resultados.map(resultado => ({
      fecha: resultado.fecha,
      test: resultado.tipoTest,
      puntajes: resultado.puntajes
    }));

  } catch (error) {
    console.error('Error obteniendo histórico del futbolista:', error);
    throw error;
  }
}

/**
 * Obtiene el histórico de resultados del usuario actual (para futbolistas)
 * @param {string} token - Token de autenticación
 * @returns {Promise<Array>} Array de resultados históricos
 */
export async function obtenerHistoricoPropio(token) {
  try {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    if (!userData.id) {
      throw new Error('No se encontró información del usuario');
    }

    return await obtenerHistoricoFutbolista(userData.id, token);
  } catch (error) {
    console.error('Error obteniendo histórico propio:', error);
    throw error;
  }
}