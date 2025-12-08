import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./ResultadosIPED.module.css";
import { recomendaciones } from '../data/recomendaciones';

function ResultadosIPED({ respuestas: propRespuestas }) {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Usar datos del state de navegación si están disponibles, si no usar props
  const puntajes = location.state?.puntajes;
  const respuestas = location.state?.respuestas || propRespuestas;

  // Si no hay datos, navegar de vuelta al dashboard
  if (!puntajes && !respuestas) {
    navigate('/dashboard', { replace: true });
    return <div>Cargando...</div>;
  }

  // Si tenemos puntajes calculados, usarlos directamente
  if (puntajes) {
    const resultados = Object.entries(puntajes).map(([nombre, datos]) => {
      const nivel = datos.nivel.toLowerCase();
      const rec = recomendaciones.IPED[nombre] ? recomendaciones.IPED[nombre][nivel] : null;
      return { 
        nombre, 
        puntaje: datos.suma, 
        maximo: datos.suma, // No importa para la visualización
        promedio: datos.promedio, 
        nivel, 
        rec 
      };
    });

    return (
      <div className={styles.resultContainer}>
        <button
          className={styles.volverButton}
          onClick={() => navigate('/dashboard')}
          style={{
            marginBottom: "16px",
            padding: "8px 20px",
            background: "#1abc53",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Volver al Dashboard
        </button>

        <h1 className={styles.titulo}>📊 Resultados Test IPED</h1>
        <div className={styles.cardsContainer}>
          {resultados.map(({ nombre, puntaje, promedio, nivel, rec }) => (
            <div key={nombre} className={styles.card}>
              <h3 className={styles.nombreFortaleza}>{nombre.replace(/_/g, ' ')}</h3>
              <div className={styles.puntaje}>
                <span className={styles.numero}>{promedio.toFixed(1)}</span>
                <span className={styles.maximo}>/5.0</span>
              </div>
              <div className={`${styles.nivel} ${styles[nivel]}`}>
                {nivel.charAt(0).toUpperCase() + nivel.slice(1)}
              </div>
              {rec && (
                <div className={styles.recomendacion}>
                  <strong>💡 Recomendación:</strong>
                  <p>{rec.mensaje || rec}</p>
                  {rec.tips && (
                    <div>
                      <strong>Tips:</strong>
                      <ul>
                        {rec.tips.map((tip, i) => (
                          <li key={i}>{tip}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {rec.articulos && (
                    <div>
                      <strong>Artículos:</strong>
                      <ul>
                        {rec.articulos.map((art, i) => (
                          <li key={i}>
                            <a href={art.url} target="_blank" rel="noopener noreferrer">{art.titulo}</a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Código de fallback para compatibilidad con versión anterior
  const fortalezasIPED = {
    autoconfianza: [0, 7, 14, 21, 28, 35],
    control_afrontamiento_negativo: [1, 8, 15, 22, 29, 36],
    control_atencional: [2, 9, 16, 23, 30, 37],
    control_visuo_imaginativo: [3, 10, 17, 24, 31, 38],
    nivel_motivacional: [4, 11, 18, 25, 32, 39],
    control_afrontamiento_positivo: [5, 12, 19, 26, 33, 40],
    control_actitudinal: [6, 13, 20, 27, 34, 41]
  };

  function getNivel(promedio) {
    if (promedio <= 2.4) return "bajo";
    if (promedio <= 3.9) return "medio";
    return "alto";
  }

  const sumaFortaleza = (indices) => {
    let suma = 0;
    for (const idx of indices) {
      const valor = respuestas[idx];
      if (typeof valor === "number") {
        suma += valor;
      }
    }
    return suma;
  };

  const resultados = Object.entries(fortalezasIPED).map(([nombre, indices]) => {
    const puntaje = sumaFortaleza(indices);
    const maximo = indices.length * 5;
    const promedio = maximo > 0 ? ((puntaje / maximo) * 5) : 0;
    const nivel = getNivel(promedio);
    const rec = recomendaciones.IPED[nombre] ? recomendaciones.IPED[nombre][nivel] : null;
    return { nombre, puntaje, maximo, promedio, nivel, rec };
  });

  return (
    <div className={styles.resultContainer}>
      <button
        className={styles.volverButton}
        onClick={() => navigate('/dashboard')}
        style={{
          marginBottom: "16px",
          padding: "8px 20px",
          background: "#1abc53",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          fontWeight: "bold",
        }}
      >
        Volver al Dashboard
      </button>

      <h1 className={styles.titulo}>📊 Resultados Test IPED</h1>
      <div className={styles.cardsContainer}>
        {resultados.map(({ nombre, puntaje, promedio, nivel, rec }) => (
          <div key={nombre} className={styles.card}>
            <h3 className={styles.nombreFortaleza}>{nombre.replace(/_/g, ' ')}</h3>
            <div className={styles.puntaje}>
              <span className={styles.numero}>{promedio.toFixed(1)}</span>
              <span className={styles.maximo}>/5.0</span>
            </div>
            <div className={`${styles.nivel} ${styles[nivel]}`}>
              {nivel.charAt(0).toUpperCase() + nivel.slice(1)}
            </div>
            {rec && (
              <div className={styles.recomendacion}>
                <strong>💡 Recomendación:</strong>
                <p>{rec.mensaje || rec}</p>
                {rec.tips && (
                  <div>
                    <strong>Tips:</strong>
                    <ul>
                      {rec.tips.map((tip, i) => (
                        <li key={i}>{tip}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {rec.articulos && (
                  <div>
                    <strong>Artículos:</strong>
                    <ul>
                      {rec.articulos.map((art, i) => (
                        <li key={i}>
                          <a href={art.url} target="_blank" rel="noopener noreferrer">{art.titulo}</a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ResultadosIPED;