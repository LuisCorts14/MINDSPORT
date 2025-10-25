// resultadoService.js
// Servicio para manejar los resultados de tests IED/IPED

/**
 * Guarda un nuevo resultado de test en el backend
 * @param {Object} respuestas - Objeto con las respuestas del test {preguntaId: respuestaValue}
 * @param {Object} puntajes - Objeto con los puntajes calculados {categoria: valor}
 * @param {string} tipoTest - Tipo de test ('IED' o 'IPED')
 * @returns {Promise} Resultado guardado con id
 */
export async function guardarResultado(respuestas, puntajes, tipoTest) {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (!userData || !userData.token) {
        throw new Error('Usuario no autenticado');
    }

    try {
        const resultado = {
            idFutbolista: userData.id,
            tipoTest: tipoTest,
            fecha: new Date().toISOString(),
            respuestas: respuestas,
            puntajes: puntajes
        };

        console.log('Datos de autenticación:', {
            token: userData.token ? `${userData.token.substring(0, 20)}...` : 'No token',
            id: userData.id,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userData.token}`
            }
        });
        
        console.log('Enviando resultado al servidor:', resultado);

        const requestConfig = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userData.token}`
            },
            body: JSON.stringify(resultado)
        };

        const endpoint = `http://localhost:8080/api/tests/${tipoTest.toLowerCase()}`;
        
        console.log(`Guardando resultado en: ${endpoint}`);
        
        const res = await fetch(endpoint, requestConfig);

        const text = await res.text();
        const data = text ? JSON.parse(text) : null;

        console.log('Respuesta del servidor:', {
            status: res.status,
            statusText: res.statusText,
            ok: res.ok,
            headers: Object.fromEntries(res.headers.entries()),
            data: data,
            raw: text
        });

        if (!res.ok) {
            throw new Error(data?.error || 'Error al guardar resultado');
        }

        return data;
    } catch (err) {
        console.error('[Error guardarResultado] Detalles:', {
            error: err,
            message: err.message,
            userData: userData ? { 
                hasToken: !!userData.token,
                id: userData.id 
            } : 'No hay userData',
            tipoTest: tipoTest,
            responseStatus: err.status
        });
        throw new Error(err.message || 'Error al conectar con el servidor');
    }
}

/**
 * Obtiene el historial de resultados de un futbolista
 * @param {string} tipoTest - Tipo de test ('IED' o 'IPED'). Si no se especifica, trae todos
 * @returns {Promise<Array>} Lista de resultados ordenados por fecha
 */
export async function obtenerHistorialResultados(tipoTest = null) {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (!userData || !userData.token) {
        throw new Error('Usuario no autenticado');
    }

    try {
        const endpoint = tipoTest 
            ? `http://localhost:8080/api/tests/futbolista/${userData.id}/${tipoTest.toLowerCase()}`
            : `http://localhost:8080/api/tests/futbolista/${userData.id}`;

        console.log(`Obteniendo historial desde: ${endpoint}`);

        const res = await fetch(endpoint, {
            headers: {
                'Authorization': `Bearer ${userData.token}`
            }
        });

        const data = await res.json();
        
        if (!res.ok) {
            throw new Error(data?.error || 'Error al obtener historial');
        }

        return data;
    } catch (err) {
        console.error('[Error obtenerHistorialResultados]:', err);
        throw new Error(err.message || 'Error al conectar con el servidor');
    }
}

/**
 * Calcula puntajes basados en respuestas raw del test
 * @param {Object} respuestas - Respuestas del test {preguntaId: valor}
 * @param {string} tipoTest - Tipo de test ('IED' o 'IPED')
 * @returns {Object} Puntajes calculados por categoría
 */
export function calcularPuntajes(respuestas, tipoTest) {
    if (!respuestas || Object.keys(respuestas).length === 0) {
        throw new Error('No hay respuestas para calcular');
    }

    if (tipoTest === 'IED') {
        // Mapeo de preguntas a categorías para IED
        const categoriasIED = {
            autoconfianza: [1, 5, 9, 13, 17],
            controlEstres: [2, 6, 10, 14, 18],
            motivacion: [3, 7, 11, 15, 19],
            concentracion: [4, 8, 12, 16, 20]
        };

        const puntajes = {};
        for (const [categoria, preguntas] of Object.entries(categoriasIED)) {
            const respuestasCategoria = preguntas
                .map(pregId => respuestas[pregId])
                .filter(val => val !== undefined);
            
            if (respuestasCategoria.length > 0) {
                puntajes[categoria] = respuestasCategoria.reduce((a, b) => a + b, 0) / respuestasCategoria.length;
            } else {
                puntajes[categoria] = 0;
            }
        }
        return puntajes;

    } else if (tipoTest === 'IPED') {
        // Mapeo de preguntas a categorías para IPED
        const categoriasIPED = {
            controlEstres: [1, 8, 15, 22, 29, 36, 42],
            influenciaEvaluacion: [2, 9, 16, 23, 30, 37, 43],
            motivacion: [3, 10, 17, 24, 31, 38, 44],
            habilidadMental: [4, 11, 18, 25, 32, 39, 45],
            cohesionEquipo: [5, 12, 19, 26, 33, 40, 46],
            controlAnsiedad: [6, 13, 20, 27, 34, 41, 47],
            autoconfianza: [7, 14, 21, 28, 35, 42, 48]
        };

        const puntajes = {};
        for (const [categoria, preguntas] of Object.entries(categoriasIPED)) {
            const respuestasCategoria = preguntas
                .map(pregId => respuestas[pregId])
                .filter(val => val !== undefined);
            
            if (respuestasCategoria.length > 0) {
                puntajes[categoria] = respuestasCategoria.reduce((a, b) => a + b, 0) / respuestasCategoria.length;
            } else {
                puntajes[categoria] = 0;
            }
        }
        return puntajes;
    }

    throw new Error('Tipo de test no soportado');
}