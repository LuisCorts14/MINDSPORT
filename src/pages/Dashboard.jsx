import React, { useEffect, useState } from "react";
import TestIED from "./TestIED";
import TestIPED from "./TestIPED";
import ResultadosIED from "./ResultadosIED";
import ResultadosIPED from "./ResultadosIPED";
import ProgresoGrafico from "../components/ProgresoGrafico";
import Configuracion from "../components/Configuracion";
import Header from "../components/Header";
import styles from "./Dashboard.module.css";

import { guardarHistorico } from "../utils/historicoUtils";
import { fortalezasIED } from "../data/fortalezasIED";
import { fortalezasIPED } from "../data/fortalezasIPED";

function Dashboard() {
  const [user, setUser] = useState({ nombre: "", rol: "", id: "", token: "" });
  const [perfil, setPerfil] = useState(null);
  const [errorPerfil, setErrorPerfil] = useState(null);

  const [testActivo, setTestActivo] = useState(null);
  const [respuestasIED, setRespuestasIED] = useState(null);
  const [respuestasIPED, setRespuestasIPED] = useState(null);
  const [graficoTestType, setGraficoTestType] = useState("IED");
  const [mostrarConfiguracion, setMostrarConfiguracion] = useState(false);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("userData"));
    if (storedUser) {
      setUser(storedUser);

      fetch(`http://localhost:8080/api/futbolista/perfil`, {
        headers: { Authorization: `Bearer ${storedUser.token}` },
      })
        .then(async (res) => {
          if (!res.ok) {
            const error = await res.json();
            throw new Error(error.message || "Error al cargar perfil");
          }
          return res.json();
        })
        .then((data) => setPerfil(data))
        .catch((err) => setErrorPerfil(err.message));
    }
  }, []);

  function handleFinishIED(respuestas) {
    guardarHistorico("IED", respuestas, fortalezasIED);
    setRespuestasIED(respuestas);
  }

  function handleFinishIPED(respuestas) {
    guardarHistorico("IPED", respuestas, fortalezasIPED);
    setRespuestasIPED(respuestas);
  }

  if (errorPerfil) return <div>Error: {errorPerfil}</div>;
  if (!perfil) return <div>Cargando perfil...</div>;

  return (
    <div className={styles.container}>
      <Header showLogout={true} user={user} />

      {mostrarConfiguracion && user.rol === "futbolista" ? (
        <>
          <h1 className={styles.title}>Configuración de cuenta</h1>
          <button
            onClick={() => setMostrarConfiguracion(false)}
            style={{ marginBottom: "1rem" }}
          >
            ← Volver al Dashboard
          </button>
          <Configuracion rol="futbolista" jugador={perfil} />
        </>
      ) : (
        <>
          <h1 className={styles.title}>Dashboard MindSport</h1>
          <h2 className={styles.greeting}>¡Hola, {perfil.nombre || "Usuario"}!</h2>
          <h3 className={styles.role}>Rol: {perfil.rol || "Desconocido"}</h3>

          {perfil.rol === "futbolista" && (
            <>
              <button
                onClick={() => setMostrarConfiguracion(true)}
                style={{ marginBottom: "1rem" }}
              >
                Configuración de cuenta
              </button>

              <div className={styles.dashboardGrid}>
                <div className={styles.leftColumn}>
                  {!testActivo && !respuestasIED && !respuestasIPED && (
                    <>
                      <div
                        style={{
                          padding: 24,
                          backgroundColor: "#f6fafd",
                          borderRadius: 12,
                          marginBottom: 24,
                        }}
                      >
                        <h3>Bienvenido a MindSport</h3>
                        <p>
                          Esta plataforma está diseñada para ayudarte a conocer y
                          mejorar tus fortalezas mentales importantes para el fútbol.
                          Podrás responder dos tests científicos: el IED y el IPED.
                        </p>
                        <p>
                          Después de cada test, recibirás una puntuación detallada
                          junto con recomendaciones y materiales informativos para
                          ayudarte a mejorar.
                        </p>
                        <p>
                          Cuando hayas completado la lectura, repite el test para
                          monitorear tu evolución. La plataforma almacenará tus
                          resultados y visualizará tu progreso en el gráfico de la
                          derecha.
                        </p>
                        <p>
                          ¡Comienza tu camino hacia la excelencia mental deportiva!
                        </p>
                      </div>
                      <div
                        className={styles.testSelectionContainer}
                        style={{
                          display: "flex",
                          gap: "32px",
                          justifyContent: "center",
                          flexWrap: "wrap",
                          marginTop: 40,
                        }}
                      >
                        <div
                          className={styles.testContainer}
                          style={{
                            flex: 1,
                            minWidth: 320,
                            background: "#eff9ff",
                            padding: 24,
                            borderRadius: 12,
                            boxShadow: "0 2px 12px rgba(0, 123, 255, 0.1)",
                            textAlign: "center",
                          }}
                        >
                          <h2>IED</h2>
                          <p>
                            Evalúa tu capacidad de reconocer, regular y utilizar tus
                            emociones en el juego. Recibe recomendaciones prácticas
                            y análisis de tu perfil emocional.
                          </p>
                          <button
                            className={styles.button}
                            onClick={() => setTestActivo("IED")}
                            style={{ marginTop: 20 }}
                          >
                            Comenzar Test IED
                          </button>
                        </div>
                        <div
                          className={styles.testContainer}
                          style={{
                            flex: 1,
                            minWidth: 320,
                            background: "#f4f0ff",
                            padding: 24,
                            borderRadius: 12,
                            boxShadow: "0 2px 12px rgba(128, 90, 255, 0.1)",
                            textAlign: "center",
                          }}
                        >
                          <h2>IPED</h2>
                          <p>
                            Descubre tu perfil psicológico deportivo: autoconfianza,
                            control emocional, actitud, concentración y más.
                            Conócete mejor y mejora tu rendimiento con
                            recomendaciones personalizadas.
                          </p>
                          <button
                            className={styles.button}
                            onClick={() => setTestActivo("IPED")}
                            style={{ marginTop: 20 }}
                          >
                            Comenzar Test IPED
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                  {testActivo === "IED" && !respuestasIED && (
                    <TestIED onSubmit={handleFinishIED} />
                  )}
                  {testActivo === "IPED" && !respuestasIPED && (
                    <TestIPED onSubmit={handleFinishIPED} />
                  )}
                  {respuestasIED && (
                    <>
                      <ResultadosIED respuestas={respuestasIED} />
                      <button
                        className={styles.button}
                        onClick={() => {
                          setTestActivo(null);
                          setRespuestasIED(null);
                        }}
                        style={{ marginTop: 20 }}
                      >
                        Volver a selección de test
                      </button>
                    </>
                  )}
                  {respuestasIPED && (
                    <>
                      <ResultadosIPED respuestas={respuestasIPED} />
                      <button
                        className={styles.button}
                        onClick={() => {
                          setTestActivo(null);
                          setRespuestasIPED(null);
                        }}
                        style={{ marginTop: 20 }}
                      >
                        Volver a selección de test
                      </button>
                    </>
                  )}
                </div>
                <div className={styles.rightColumn}>
                  <h3>Tu progreso a lo largo del tiempo</h3>
                  <p>
                    Visualiza cómo evolucionan tus fortalezas mentales cada vez que
                    repites los tests. Elige el test que deseas observar:
                  </p>
                  <div style={{ display: "flex", gap: 12, marginBottom: 10 }}>
                    <button
                      className={styles.button}
                      style={{
                        backgroundColor:
                          graficoTestType === "IED" ? "#31b27d" : "#2779fc",
                      }}
                      onClick={() => setGraficoTestType("IED")}
                    >
                      Ver IED
                    </button>
                    <button
                      className={styles.button}
                      style={{
                        backgroundColor:
                          graficoTestType === "IPED" ? "#845de2" : "#2779fc",
                      }}
                      onClick={() => setGraficoTestType("IPED")}
                    >
                      Ver IPED
                    </button>
                  </div>
                  <ProgresoGrafico testType={graficoTestType} />
                </div>
              </div>
            </>
          )}

          {perfil.rol === "entrenador" && (
            <div className={styles.section}>
              <h4>Gestión de futbolistas y equipos</h4>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Dashboard;
