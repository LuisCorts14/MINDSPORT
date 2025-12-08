const API_URL = "http://localhost:8080/api/futbolista";
const USUARIOS_API_URL = "http://localhost:8080/api/usuarios";

// Obtener perfil
export async function obtenerPerfil(token) {
  const res = await fetch(`${API_URL}/perfil`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Error al obtener perfil");
  return res.json();
}

// Crear futbolista nuevo asignando entrenador
export async function crearFutbolista(futbolista, token) {
  const res = await fetch(`${API_URL}/crear`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(futbolista),
  });
  if (!res.ok) throw new Error("Error creando futbolista");
  return res.json();
}


// Buscar entrenador por codigoUnico - VERSIÓN DE DEBUG
export async function buscarEntrenadorPorCodigo(codigoUnico, token) {
  try {
    console.log('🔍 Buscando entrenador con código:', codigoUnico);
    
    // Limpiar el código antes de enviar
    const codigoLimpio = codigoUnico.trim().toUpperCase();
    
    const url = `${USUARIOS_API_URL}/entrenador-por-codigo/${codigoLimpio}`;
    console.log('📡 URL de petición:', url);
    console.log('🔑 Token:', token ? 'Presente' : 'Faltante');
    
    const res = await fetch(url, {
      method: 'GET',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
    });

    console.log('📊 Status de respuesta:', res.status);
    console.log('📋 Headers de respuesta:', res.headers);
    console.log('✅ Response OK:', res.ok);

    // CLAVE: Capturar el texto crudo de la respuesta antes de parsearlo
    const responseText = await res.text();
    console.log('📄 Respuesta cruda del servidor:', responseText);

    // Si la respuesta está vacía, mostrar error específico
    if (!responseText) {
      throw new Error('El servidor devolvió una respuesta vacía');
    }

    // Intentar parsear como JSON
    let data;
    try {
      data = JSON.parse(responseText);
      console.log('📨 Datos parseados:', data);
    } catch (parseError) {
      console.error('❌ Error al parsear JSON:', parseError);
      throw new Error(`Respuesta del servidor no es JSON válido: ${responseText.substring(0, 100)}`);
    }

    if (!res.ok) {
      console.error('❌ Error en búsqueda:', data.error || data);
      throw new Error(data.error || `Error ${res.status}: ${responseText}`);
    }

    console.log('✅ Entrenador encontrado:', data.entrenador);
    return data.entrenador;
    
  } catch (error) {
    console.error('🚫 Error completo:', error);
    throw new Error(error.message || 'Error de conexión al servidor');
  }
}

// Asociar entrenador - CORREGIDO para usar el nuevo endpoint
export async function asociarEntrenador(idFutbolista, idEntrenador, token) {
  try {
    console.log('🔗 Asociando futbolista:', idFutbolista, 'con entrenador:', idEntrenador);
    
    const res = await fetch(`${USUARIOS_API_URL}/asociar-entrenador`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ 
        futbolistaId: idFutbolista,
        entrenadorId: idEntrenador 
      }),
    });

    const data = await res.json();
    console.log('📨 Respuesta asociación:', data);

    if (!res.ok) {
      console.error('❌ Error en asociación:', data.error);
      throw new Error(data.error || "Error asociando entrenador");
    }

    console.log('✅ Asociación exitosa');
    return data;
    
  } catch (error) {
    console.error('🚫 Error de conexión:', error);
    throw new Error(error.message || 'Error de conexión al servidor');
  }
}


// Actualizar información adicional del futbolista (edad, posición, nota)
export async function actualizarInfoFutbolista(futbolistaId, infoActualizada, token) {
  try {
    console.log('📝 Actualizando información de futbolista:', futbolistaId, infoActualizada);
    
    const res = await fetch(`${USUARIOS_API_URL}/futbolista/${futbolistaId}/actualizar-info`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(infoActualizada),
    });

    const data = await res.json();
    console.log('📨 Respuesta actualización:', data);

    if (!res.ok) {
      console.error('❌ Error en actualización:', data.error);
      throw new Error(data.error || "Error actualizando información del futbolista");
    }

    console.log('✅ Información actualizada exitosamente');
    return data;
    
  } catch (error) {
    console.error('🚫 Error actualizando información:', error);
    throw new Error(error.message || 'Error de conexión al servidor');
  }
}

// Obtener historial de notas de un futbolista
export async function obtenerHistorialNotas(futbolistaId, token) {
  try {
    console.log('📚 Obteniendo historial de notas para futbolista:', futbolistaId);
    
    const res = await fetch(`${USUARIOS_API_URL}/futbolista/${futbolistaId}/historial-notas`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    console.log('📨 Historial recibido:', data);

    if (!res.ok) {
      console.error('❌ Error obteniendo historial:', data.error);
      throw new Error(data.error || "Error obteniendo historial de notas");
    }

    console.log('✅ Historial obtenido exitosamente');
    return data.historialNotas || [];
    
  } catch (error) {
    console.error('🚫 Error obteniendo historial:', error);
    throw new Error(error.message || 'Error de conexión al servidor');
  }
}

// Agregar nueva nota al historial
export async function agregarNotaHistorial(futbolistaId, nota, token) {
  try {
    console.log('📝 Agregando nota al historial:', futbolistaId, nota);
    
    const res = await fetch(`${USUARIOS_API_URL}/futbolista/${futbolistaId}/agregar-nota`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ nota }),
    });

    const data = await res.json();
    console.log('📨 Respuesta agregar nota:', data);

    if (!res.ok) {
      console.error('❌ Error agregando nota:', data.error);
      throw new Error(data.error || "Error agregando nota al historial");
    }

    console.log('✅ Nota agregada exitosamente');
    return data;
    
  } catch (error) {
    console.error('🚫 Error agregando nota:', error);
    throw new Error(error.message || 'Error de conexión al servidor');
  }
}