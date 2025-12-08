import React, { useState } from 'react';
import { recomendaciones } from '../data/recomendaciones';
import UnifiedButton from './UnifiedButton';
import styles from './BibliotecaFortalezas.module.css';

function BibliotecaFortalezas({ onClose }) {
  const [testSeleccionado, setTestSeleccionado] = useState('IED');
  const [fortalezaSeleccionada, setFortalezaSeleccionada] = useState(null);

  const testsDisponibles = ['IED', 'IPED'];
  const fortalezasActuales = Object.keys(recomendaciones[testSeleccionado]).filter(
    (key) => key !== 'niveles'
  );

  const fortalezaActual =
    fortalezaSeleccionada &&
    recomendaciones[testSeleccionado][fortalezaSeleccionada];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Biblioteca de Fortalezas</h1>
        <button className={styles.closeBtn} onClick={onClose}>
          ✕
        </button>
      </div>

      {/* Selector de Test */}
      <div className={styles.testSelector}>
        <p>Selecciona un test:</p>
        <div className={styles.buttonGroup}>
          {testsDisponibles.map((test) => (
            <UnifiedButton
              key={test}
              onClick={() => {
                setTestSeleccionado(test);
                setFortalezaSeleccionada(null);
              }}
              variant={testSeleccionado === test ? 'success' : 'outline'}
              size="medium"
              style={{
                backgroundColor: testSeleccionado === test ? '#1abc53' : undefined,
                borderColor: testSeleccionado === test ? '#1abc53' : '#ddd',
              }}
            >
              {test === 'IED' ? '🧠 IED' : '⚡ IPED'}
            </UnifiedButton>
          ))}
        </div>
      </div>

      <div className={styles.content}>
        {/* Lista de Fortalezas */}
        <div className={styles.fortalezasList}>
          <h2>Fortalezas ({testSeleccionado})</h2>
          <div className={styles.fortalezasGrid}>
            {fortalezasActuales.map((fortaleza) => (
              <div
                key={fortaleza}
                className={`${styles.fortalezaCard} ${
                  fortalezaSeleccionada === fortaleza ? styles.active : ''
                }`}
                onClick={() => setFortalezaSeleccionada(fortaleza)}
              >
                <p className={styles.fortalezaNombre}>
                  {fortaleza.replace(/_/g, ' ').toUpperCase()}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Detalles de Fortaleza */}
        <div className={styles.fortalezaDetalles}>
          {fortalezaSeleccionada && fortalezaActual ? (
            <>
              <h2>{fortalezaSeleccionada.replace(/_/g, ' ').toUpperCase()}</h2>
              <p className={styles.descripcion}>{fortalezaActual.descripcion}</p>

              {/* Información de Niveles */}
              <div className={styles.nivelesInfo}>
                <h3> Definición de niveles:</h3>
                <div className={styles.nivelesList}>
                  <div className={styles.nivelItem}>
                    <strong className={styles.nivelBajo}>BAJO:</strong>
                    <p>{recomendaciones[testSeleccionado].niveles.bajo}</p>
                  </div>
                  <div className={styles.nivelItem}>
                    <strong className={styles.nivelMedio}>MEDIO:</strong>
                    <p>{recomendaciones[testSeleccionado].niveles.medio}</p>
                  </div>
                  <div className={styles.nivelItem}>
                    <strong className={styles.nivelAlto}>ALTO:</strong>
                    <p>{recomendaciones[testSeleccionado].niveles.alto}</p>
                  </div>
                </div>
              </div>

              {/* Materiales por Nivel */}
              <div className={styles.materialesPorNivel}>
                {['bajo', 'medio', 'alto'].map((nivel) => (
                  <div key={nivel} className={styles.nivelMaterial}>
                    <h3 className={styles[`titulo${nivel.charAt(0).toUpperCase() + nivel.slice(1)}`]}>
                      📖 Nivel {nivel.toUpperCase()}
                    </h3>

                    {/* Mensaje */}
                    <div className={styles.mensaje}>
                      <p>{fortalezaActual[nivel].mensaje}</p>
                    </div>

                    {/* Tips */}
                    <div className={styles.tips}>
                      <h4>💡 Tips Prácticos:</h4>
                      <ul>
                        {fortalezaActual[nivel].tips.map((tip, idx) => (
                          <li key={idx}>{tip}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Artículos */}
                    <div className={styles.articulos}>
                      <h4>🔗 Recursos y Artículos:</h4>
                      {fortalezaActual[nivel].articulos && fortalezaActual[nivel].articulos.length > 0 ? (
                        <ul>
                          {fortalezaActual[nivel].articulos.map((articulo, idx) => (
                            <li key={idx}>
                              <a
                                href={articulo.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.link}
                              >
                                {articulo.titulo}
                              </a>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className={styles.sinRecursos}>Sin recursos disponibles</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className={styles.seleccionarMensaje}>
              <p>👈 Selecciona una fortaleza para ver los materiales de aprendizaje</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BibliotecaFortalezas;
