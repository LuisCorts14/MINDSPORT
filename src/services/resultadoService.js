// resultadoService.js
import { fortalezasIED } from '../data/fortalezasIED';
import { fortalezasIPED } from '../data/fortalezasIPED';

/**
 * Guarda un nuevo resultado de test en el backend
 * @param {Object} respuestas - Objeto con las respuestas del test {preguntaIndex: respuestaValue}
 * @param {Object} puntajes - Puntajes calculados {fortaleza: objeto}
 * @param {string} tipoTest - 'IED' o 'IPED'
 * @returns {Promise} Resultado guardado con id
 */
export async function guardarResultado(respuestas, puntajes, tipoTest) {
    if (!respuestas || !puntajes || !tipoTest) {
        console.error('Datos incompletos:', { respuestas, puntajes, tipoTest });
        throw new Error('Datos incompletos para guardar el resultado');
    }
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (!userData || !userData.token) {
        throw new Error('Usuario no autenticado');
    }
    try {
        if (userData.rol !== 'futbolista') {
            throw new Error('Solo los futbolistas pueden guardar resultados de tests');
        }
        // El modelo Java espera Map<String, Object> para respuestas, no Array
        const respuestasMap = {};
        Object.keys(respuestas).forEach(key => {
            respuestasMap[key.toString()] = respuestas[key];
        });

        // El modelo Java espera Map<String, Object> para puntajes con estructura completa
        const puntajesCompletos = {};
        Object.keys(puntajes).forEach(fortaleza => {
            // Enviar la estructura completa: promedio, suma, nivel
            puntajesCompletos[fortaleza] = {
                promedio: puntajes[fortaleza].promedio,
                suma: puntajes[fortaleza].suma || 0,
                nivel: puntajes[fortaleza].nivel || 'Bajo'
            };
        });

        const resultado = {
            idFutbolista: userData.id,
            tipoTest,
            fecha: new Date().toISOString(),
            respuestas: respuestasMap,
            puntajes: puntajesCompletos
        };
        
        const token = userData.token.trim();
        const requestConfig = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(resultado)
        };
        const endpoint = `http://localhost:8080/api/tests/${tipoTest.toLowerCase()}`;
        
        const res = await fetch(endpoint, requestConfig);
        const text = await res.text();
        
        let data = null;
        try {
            data = text ? JSON.parse(text) : null;
        } catch (e) {
            console.error('Error al parsear respuesta:', text);
            throw new Error('Error al procesar la respuesta del servidor');
        }
        if (!res.ok) {
            const errorMessage = data?.error || data?.message || 'Error al guardar resultado';
            throw new Error(errorMessage);
        }
        return data;
    } catch (err) {
        throw new Error(err.message || 'Error al conectar con el servidor');
    }
}

/**
 * Obtiene el historial de resultados de un futbolista
 * @param {string} tipoTest - 'IED' o 'IPED'
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
        throw new Error(err.message || 'Error al conectar con el servidor');
    }
}

/**
 * Calcula puntajes oficiales por fortaleza (IED/IPED), usando suma, promedio y nivel científico.
 * Para IED utiliza el modelo tetrafactorial validado.
 * @param {Object} respuestas - {preguntaIndex: valor}, índices base 0 (0-29 para IED, 0-41 para IPED)
 * @param {string} tipoTest - 'IED' o 'IPED'
 * @returns {Object} Puntajes por fortaleza: suma, promedio, nivel
 */
export function calcularPuntajes(respuestas, tipoTest) {
    if (!respuestas || Object.keys(respuestas).length === 0) {
        throw new Error('No hay respuestas para calcular');
    }

    let mapeo;
    if (tipoTest === 'IED') {
        mapeo = fortalezasIED;
    } else if (tipoTest === 'IPED') {
        mapeo = fortalezasIPED;
    } else {
        throw new Error('Tipo de test no soportado');
    }

    const resultado = {};
    for (const [fortaleza, preguntas] of Object.entries(mapeo)) {
        const valores = preguntas
            .map(idx => respuestas[idx])
            .filter(val => Number.isFinite(val));
        const suma = valores.reduce((a, b) => a + b, 0);
        const promedio = valores.length ? suma / valores.length : 0;
        let nivel = "Bajo";
        if (promedio >= 3.51) nivel = "Alto";
        else if (promedio >= 2.51) nivel = "Medio";
        resultado[fortaleza] = {
            suma,
            promedio: Math.round(promedio * 100) / 100,
            nivel
        };
    }
    return resultado;
}
