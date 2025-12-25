import React, { useState, useEffect } from "react";
import EvolucionTemporalFortalezas from "../components/EvolucionTemporalFortalezas";
import AnalisisResultados from "../components/AnalisisResultados";
import styles from "./DetalleJugador.module.css";
import { actualizarInfoFutbolista } from "../services/futbolistaService";
import { obtenerHistoricoFutbolista } from "../services/historicoService";

// Lista de posiciones básicas de fútbol
const POSICIONES_FUTBOL = [
  { value: "", label: "Seleccionar posición...", disabled: true },
  // Portero
  { value: "Portero", label: "Portero" },
  // Línea Defensiva
  { value: "Defensa central", label: "Defensa Central" },
  { value: "Lateral derecho", label: "Lateral Derecho" },
  { value: "Lateral izquierdo", label: "Lateral Izquierdo" },
  // Línea de Mediocampo
  { value: "Mediocampista defensivo", label: "Mediocampista Defensivo" },
  { value: "Mediocampista central", label: "Mediocampista Central" },
  { value: "Mediocampista ofensivo", label: "Mediocampista Ofensivo" },
  { value: "Extremo derecho", label: "Extremo Derecho" },
  { value: "Extremo izquierdo", label: "Extremo Izquierdo" },
  // Línea Ofensiva
  { value: "Delantero centro", label: "Delantero Centro" },
  { value: "Segundo delantero", label: "Segundo Delantero" }
];

function DetalleJugador({ jugador, onCerrar, onMostrarHistorial }) {
  // Estados para datos editables
  const [posicion, setPosicion] = useState(jugador.posicion || "");
  const [notas, setNotas] = useState(jugador.notas || "");
  const [edad, setEdad] = useState(jugador.edad || "");
  const [testActivo, setTestActivo] = useState("IED");

  // Estados para análisis de resultados
  const [ultimosResultados, setUltimosResultados] = useState({
    IED: null,
    IPED: null
  });
  const [todosLosResultados, setTodosLosResultados] = useState({
    IED: [],
    IPED: []
  });
  const [cargandoResultados, setCargandoResultados] = useState(true);

  // Obtener últimos resultados y todos los resultados del futbolista
  useEffect(() => {
    const obtenerResultados = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem("userData") || "{}");
        if (userData.token) {
          const response = await fetch(
            `http://localhost:8080/api/tests/futbolista/${jugador.id}/resultados`,
            {
              headers: {
                Authorization: `Bearer ${userData.token}`,
                "Content-Type": "application/json"
              }
            }
          );

          if (response.ok) {
            const resultados = await response.json();

            const resultadosIED = resultados
              .filter((r) => r.tipoTest === "IED" || r.test === "IED")
              .sort(
                (a, b) =>
                  new Date(a.fecha || a.fechaRealizacion) -
                  new Date(b.fecha || b.fechaRealizacion)
              );

            const resultadosIPED = resultados
              .filter((r) => r.tipoTest === "IPED" || r.test === "IPED")
              .sort(
                (a, b) =>
                  new Date(a.fecha || a.fechaRealizacion) -
                  new Date(b.fecha || b.fechaRealizacion)
              );

            console.log("📊 Todos los IED:", resultadosIED);
            console.log("📊 Todos los IPED:", resultadosIPED);

            setTodosLosResultados({
              IED: resultadosIED,
              IPED: resultadosIPED
            });

            setUltimosResultados({
              IED:
                resultadosIED.length > 0
                  ? resultadosIED[resultadosIED.length - 1]
                  : null,
              IPED:
                resultadosIPED.length > 0
                  ? resultadosIPED[resultadosIPED.length - 1]
                  : null
            });
          } else {
            console.log("No hay resultados para este futbolista");
            setTodosLosResultados({
              IED: [],
              IPED: []
            });
            setUltimosResultados({
              IED: null,
              IPED: null
            });
          }
        }
      } catch (error) {
        console.error("Error obteniendo resultados:", error);
        setTodosLosResultados({
          IED: [],
          IPED: []
        });
        setUltimosResultados({
          IED: null,
          IPED: null
        });
      } finally {
        setCargandoResultados(false);
      }
    };

    obtenerResultados();
  }, [jugador.id]);

  // Función para guardar con validación mínima
  const guardarInfo = async () => {
    const edadNum = parseInt(edad, 10);
    if (isNaN(edadNum) || edadNum < 10 || edadNum > 80) {
      alert("Por favor ingresa una edad válida entre 10 y 80.");
      return;
    }

    try {
      const user = JSON.parse(localStorage.getItem("userData"));

      const infoActualizada = {
        edad: edadNum,
        posicion: posicion,
        notaEntrenador: notas
      };

      console.log("🔄 Guardando información:", infoActualizada);

      await actualizarInfoFutbolista(jugador.id, infoActualizada, user.token);

      const key = `futbolistasEntrenador_${user.id}`;
      const futbolistasGuardados =
        JSON.parse(localStorage.getItem(key)) || [];
      const actualizados = futbolistasGuardados.map((f) =>
        f.id === jugador.id ? { ...f, posicion, notas, edad: edadNum } : f
      );
      localStorage.setItem(key, JSON.stringify(actualizados));

      alert("Información del jugador actualizada correctamente");
    } catch (error) {
      console.error("❌ Error guardando información:", error);
      alert(`Error al guardar: ${error.message}`);
    }
  };

  return (
    <div className={styles.detalleContainer}>
      {/* HEADER */}
      <div className={styles.header}>
        <h1>Ficha del Jugador</h1>
        <h2>{jugador.nombre}</h2>
      </div>

      {/* BLOQUE 1: LAYOUT 2 COLUMNAS - DATOS + INTRODUCCIÓN */}
      <div className={styles.twoColumnLayout}>
        {/* COLUMNA IZQUIERDA - DATOS BÁSICOS */}
        <div className={styles.leftColumn}>
          <div className={styles.infoGrid}>
            <div className={styles.infoCard}>
              <label>Edad</label>
              <input
                type="number"
                value={edad}
                onChange={(e) => setEdad(e.target.value)}
                min="10"
                max="80"
                placeholder="Edad"
              />
            </div>

            <div className={styles.infoCard}>
              <label>Posición</label>
              <select
                value={posicion}
                onChange={(e) => setPosicion(e.target.value)}
                className={styles.posicionSelect}
                required
              >
                {POSICIONES_FUTBOL.map((pos) => (
                  <option
                    key={pos.value}
                    value={pos.value}
                    disabled={pos.disabled}
                  >
                    {pos.label}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.infoCard}>
              <label>Notas</label>
              <textarea
                rows="3"
                value={notas}
                onChange={(e) => setNotas(e.target.value)}
                placeholder="Observaciones..."
              />
            </div>
          </div>

          {/* BOTONES EN COLUMNA IZQUIERDA */}
          <div className={styles.actionButtons}>
            <button onClick={guardarInfo} className={styles.buttonGuardar}>
              Guardar cambios
            </button>
            <button
              onClick={() => onMostrarHistorial && onMostrarHistorial(jugador)}
              className={styles.buttonHistorial}
            >
              Ver historial de notas
            </button>
          </div>
        </div>

        {/* COLUMNA DERECHA - INTRODUCCIÓN */}
        <div className={styles.rightColumn}>
          <div className={styles.introBox}>
            <h3>Información del Jugador</h3>
            <p>En esta ficha encontrarás:</p>
            <ul>
              <li>Datos básicos (edad, posición)</li>
              <li>Observaciones del entrenador</li>
              <li>Análisis de resultados de tests IED/IPED</li>
              <li>Evolución temporal de fortalezas</li>
              <li>Indicadores de mejora o decaimiento</li>
            </ul>

            <h4>Tests disponibles:</h4>
            <div className={styles.testDescription}>
              <strong>IED</strong>
              <p>Inteligencia Emocional Deportiva. Evalúa la capacidad del jugador para gestionar sus emociones en contextos deportivos competitivos.</p>
            </div>
            <div className={styles.testDescription}>
              <strong>IPED</strong>
              <p>Inteligencia Psicosocial Emocional Deportiva. Complementa el IED enfocándose en autoconfianza, adaptabilidad y relaciones interpersonales en el equipo.</p>
            </div>
          </div>
        </div>
      </div>

      {/* BLOQUE 3: ANÁLISIS ACTUAL */}
      <section
        style={{
          marginBottom: "4rem",
          paddingTop: "2rem",
          borderTop: "3px solid #e9ecef"
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "2rem",
            gap: "16px",
            flexWrap: "wrap"
          }}
        >
          <h3
            style={{
              color: "#009688",
              borderBottom: "3px solid #009688",
              paddingBottom: "1rem",
              marginBottom: 0,
              fontSize: "24px",
              flex: 1
            }}
          >
            ANÁLISIS ACTUAL
          </h3>
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={() => setTestActivo("IED")}
              style={{
                padding: "8px 16px",
                background: testActivo === "IED" ? "#009688" : "#e0e0e0",
                color: testActivo === "IED" ? "white" : "#333",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: "600",
                fontSize: "13px",
                transition: "all 0.2s ease"
              }}
            >
              Ver IED
            </button>
            <button
              onClick={() => setTestActivo("IPED")}
              style={{
                padding: "8px 16px",
                background: testActivo === "IPED" ? "#009688" : "#e0e0e0",
                color: testActivo === "IPED" ? "white" : "#333",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: "600",
                fontSize: "13px",
                transition: "all 0.2s ease"
              }}
            >
              Ver IPED
            </button>
          </div>
        </div>

        {cargandoResultados ? (
          <div
            style={{
              textAlign: "center",
              padding: "3rem",
              color: "#666"
            }}
          >
            🔄 Cargando análisis...
          </div>
        ) : (
          <div
            style={{
              padding: "1.5rem",
              backgroundColor: "#f9f9f9",
              borderRadius: "12px",
              border: "1px solid #e9ecef"
            }}
          >
            {testActivo === "IED" ? (
              ultimosResultados.IED ? (
                <AnalisisResultados resultado={ultimosResultados.IED} />
              ) : (
                <div
                  style={{
                    textAlign: "center",
                    padding: "2rem",
                    color: "#666"
                  }}
                >
                  📊 No hay resultados de Test IED
                </div>
              )
            ) : ultimosResultados.IPED ? (
              <AnalisisResultados resultado={ultimosResultados.IPED} />
            ) : (
              <div
                style={{
                  textAlign: "center",
                  padding: "2rem",
                  color: "#666"
                }}
              >
                📈 No hay resultados de Test IPED
              </div>
            )}
          </div>
        )}
      </section>

      {/* BLOQUE 4: EVOLUCIÓN TEMPORAL */}
      <section
        style={{
          marginBottom: "2rem",
          marginTop: "4rem",
          paddingTop: "3rem",
          borderTop: "3px solid #e9ecef"
        }}
      >
        <h3
          style={{
            color: "#009688",
            borderBottom: "3px solid #009688",
            paddingBottom: "1rem",
            marginBottom: "2rem",
            fontSize: "24px"
          }}
        >
          EVOLUCIÓN TEMPORAL
        </h3>

        <div
          style={{
            background: "#f8f9fa",
            padding: "1.5rem",
            borderRadius: "8px",
            border: "1px solid #e9ecef"
          }}
        >
          {todosLosResultados.IED.length > 0 || todosLosResultados.IPED.length > 0 ? (
            <EvolucionTemporalFortalezas
              resultadosIED={todosLosResultados.IED}
              resultadosIPED={todosLosResultados.IPED}
            />
          ) : (
            <p
              style={{
                color: "#666",
                textAlign: "center",
                padding: "2rem"
              }}
            >
              No hay resultados disponibles para mostrar la evolución temporal
            </p>
          )}
        </div>
      </section>

      {/* BOTÓN VOLVER */}
      <button onClick={onCerrar} className={styles.buttonCerrar}>
        ← Volver al listado
      </button>
    </div>
  );
}

export default DetalleJugador;
