import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './ResultadosIED.module.css';
import { recomendaciones } from '../data/recomendaciones';

function ResultadosIED({ respuestas: propRespuestas }) {
  const navigate = useNavigate();
  const location = useLocation();
  
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
      const rec = recomendaciones.IED[nombre] ? recomendaciones.IED[nombre][nivel] : null;
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

        <h1 className={styles.titulo}>📊 Resultados Test IED</h1>
        <div className={styles.cardsContainer}>
          {resultados.map(({ nombre, puntaje, promedio, nivel, rec }) => (
            <div key={nombre} className={styles.card}>
              <h3 className={styles.nombreFortaleza}>{nombre.replace(/_/g, ' ').toUpperCase()}</h3>
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
  const totalPreguntas = 30;
  
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

  // Conversion robusta: objeto/array => array pura
  const respuestasArray = Array.isArray(respuestas)
    ? respuestas
    : (respuestas && typeof respuestas === 'object')
      ? Object.values(respuestas)
      : [];

  const sumaFortaleza = (indices) =>
    indices.reduce((acum, idx) => acum + (typeof respuestasArray[idx] === "number" ? respuestasArray[idx] : 0), 0);

  const resultados = Object.entries(fortalezas).map(([nombre, indices]) => {
    const puntaje = sumaFortaleza(indices);
    const maximo = indices.length * 5;
    const promedio = maximo > 0 ? ((puntaje / maximo) * 5) : 0;
    const nivel = getNivel(promedio);
    const rec = recomendaciones.IED[nombre] ? recomendaciones.IED[nombre][nivel] : null;
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