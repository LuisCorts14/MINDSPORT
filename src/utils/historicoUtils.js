// Recibe: tipoTest ('IED' o 'IPED'), array respuestas, mapa fortalezas (objeto nombre -> indices)
export function guardarHistorico(test, respuestas, fortalezasMap) {
  const suma = (indices) => indices.reduce((acc, idx) => acc + respuestas[idx], 0);

  const puntajes = {};
  Object.entries(fortalezasMap).forEach(([nombre, indices]) => {
    puntajes[nombre] = suma(indices);
  });

  const historico = JSON.parse(localStorage.getItem("historicoMindSport") || "[]");
  historico.push({
    fecha: new Date().toISOString(),
    test,
    puntajes
  });

  localStorage.setItem("historicoMindSport", JSON.stringify(historico));
}
