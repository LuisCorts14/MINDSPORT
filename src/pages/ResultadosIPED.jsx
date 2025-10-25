import React from "react";
import styles from "./ResultadosIPED.module.css";
import { recomendaciones } from '../data/recomendaciones';

const fortalezasIPED = {
  autoconfianza: [0, 7, 14, 21],
  control_emocional: [1, 5, 6, 8, 13, 16, 22, 23, 27],
  actitud_positiva: [4, 11, 12, 18, 20, 25, 26, 39, 40],
  control_atencional: [2, 9, 37],
  afrontamiento_negativo: [15, 19, 29, 30, 31, 32],
  afrontamiento_positivo: [28, 33, 34, 35, 36, 41],
  visualizacion: [3, 10, 17, 24, 38]
};

function getNivel(promedio) {
  if (promedio <= 2.4) return "bajo";
  if (promedio <= 3.9) return "medio";
  return "alto";
}

function ResultadosIPED({ respuestas }) {
  const sumaFortaleza = (indices) => indices.reduce((acum, idx) => acum + respuestas[idx], 0);

  const resultados = Object.entries(fortalezasIPED).map(([nombre, indices]) => {
    const puntaje = sumaFortaleza(indices);
    const maximo = indices.length * 5;
    const promedio = (puntaje / maximo) * 5;
    const nivel = getNivel(promedio);
    const rec = recomendaciones.IPED[nombre] ? recomendaciones.IPED[nombre][nivel] : null;

    return { nombre, puntaje, maximo, promedio, nivel, rec };
  });

  return (
    <div className={styles.resultContainer}>
      <h2 className={styles.title}>Resultados de tu IPED</h2>
      {resultados.map((f) => (
        <div key={f.nombre} className={styles.fortalezaCard}>
          <span className={styles.fortalezaNombre}>
            {f.nombre.charAt(0).toUpperCase() + f.nombre.slice(1).replace('_', ' ')}:
          </span>
          <div className={styles.fortalezaPuntaje}>
            Puntaje: {f.puntaje} / {f.maximo} ({f.promedio.toFixed(2)}/5, {f.nivel.toUpperCase()})
          </div>

          {f.rec && (
            <div style={{ marginTop: 8 }}>
              <p>{f.rec.mensaje}</p>
              <ul>
                {f.rec.articulos.map((art, i) => (
                  <li key={i}>
                    <a href={art.url} target="_blank" rel="noopener noreferrer">{art.titulo}</a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default ResultadosIPED;
