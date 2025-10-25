const API_URL = "http://localhost:8080/api/futbolista";

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

// Actualizar asociación entrenador-futbolista
export async function asociarEntrenador(idFutbolista, idEntrenador, token) {
  const res = await fetch(`${API_URL}/asociarEntrenador/${idFutbolista}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ idEntrenador }),
  });
  if (!res.ok) throw new Error("Error asociando entrenador");
  return res.json();
}
