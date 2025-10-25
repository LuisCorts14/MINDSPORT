import React from 'react';
import styles from './ResultadosIED.module.css';
import { recomendaciones } from '../data/recomendaciones';

const fortalezas = {
  autorregulacion: [1, 6, 11, 16, 19, 20, 26, 27],
  motivacion: [2, 9, 13, 22],
  empatia: [0, 3, 4, 12, 17, 23, 24, 25, 28, 29],
  reconocimiento: [7, 8, 10, 14, 18, 21],
  resiliencia: [5, 15]
};

function getNivel(promedio) {
  if (promedio <= 2.4) return "bajo";
  if (promedio <= 3.9) return "medio";
  return "alto";
}

function ResultadosIED({ respuestas }) {
  const sumaFortaleza = (indices) => indices.reduce((acum, idx) => acum + respuestas[idx], 0);

  const resultados = Object.entries(fortalezas).map(([nombre, indices]) => {
    const puntaje = sumaFortaleza(indices);
    const maximo = indices.length * 5;
    const promedio = (puntaje / maximo) * 5;
    const nivel = getNivel(promedio);
    const rec = recomendaciones.IED[nombre] ? recomendaciones.IED[nombre][nivel] : null;

    return { nombre, puntaje, maximo, promedio, nivel, rec };
  });


  return (
    <div className={styles.resultContainer}>
      <h2 className={styles.title}>Resultados de tu IED</h2>
      {resultados.map((f) => (
        <div key={f.nombre} className={styles.fortalezaCard}>
          <span className={styles.fortalezaNombre}>
            {f.nombre.charAt(0).toUpperCase() + f.nombre.slice(1)}:
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

export default ResultadosIED;
