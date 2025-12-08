// Recibe: tipoTest ('IED' o 'IPED'), array respuestas, mapa fortalezas (objeto nombre -> indices)
export function guardarHistorico(test, respuestas, fortalezasMap) {
  const suma = (indices) => indices.reduce((acc, idx) => acc + respuestas[idx], 0);

  const puntajes = {};
  Object.entries(fortalezasMap).forEach(([nombre, indices]) => {
    puntajes[nombre] = suma(indices);
  });

  // Obtener información del usuario actual
  const userData = JSON.parse(localStorage.getItem('userData') || '{}');
  const jugadorId = userData.id;

  const registroHistorico = {
    fecha: new Date().toISOString(),
    test,
    puntajes
  };

  // Guardar en el histórico general (para retrocompatibilidad)
  const historico = JSON.parse(localStorage.getItem("historicoMindSport") || "[]");
  historico.push(registroHistorico);
  localStorage.setItem("historicoMindSport", JSON.stringify(historico));

  // NUEVO: También guardar en el histórico específico del jugador para que el entrenador pueda verlo
  if (jugadorId) {
    const historicoJugador = JSON.parse(localStorage.getItem(`historicoMindSport_${jugadorId}`) || "[]");
    historicoJugador.push(registroHistorico);
    localStorage.setItem(`historicoMindSport_${jugadorId}`, JSON.stringify(historicoJugador));
  }
}
