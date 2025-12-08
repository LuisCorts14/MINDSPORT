import React, { useEffect, useState } from "react";
import TestIED from "./TestIED";
import TestIPED from "./TestIPED";
import ResultadosIED from "./ResultadosIED";
import ResultadosIPED from "./ResultadosIPED";
import ProgresoGrafico from "../components/ProgresoGrafico";
import Configuracion from "../components/Configuracion";
import BibliotecaFortalezas from "../components/BibliotecaFortalezas";
import Header from "../components/Header";
import UnifiedButton from "../components/UnifiedButton";
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
  const [mostrarBiblioteca, setMostrarBiblioteca] = useState(false);

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

  // Mostrar Biblioteca de Fortalezas
  if (mostrarBiblioteca && user.rol === "futbolista") {
    return (
      <div className={styles.container}>
        <Header showLogout={true} user={user} />
        <BibliotecaFortalezas onClose={() => setMostrarBiblioteca(false)} />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Header showLogout={true} user={user} />

      {mostrarConfiguracion && user.rol === "futbolista" ? (
        <>
          <h1 className={styles.title}>Configuración de cuenta</h1>
          <UnifiedButton
            onClick={() => setMostrarConfiguracion(false)}
            variant="outline"
            size="medium"
            style={{
              marginBottom: "1rem",
              border: "2px solid var(--primary-color, #009688)",
              color: "var(--primary-color, #009688)",
            }}
          >
            ← Volver al Dashboard
          </UnifiedButton>
          <Configuracion
            rol="futbolista"
            jugador={perfil}
            nombreEntrenador={perfil.nombreEntrenador}
            token={user.token}
            userId={user.id}
          />
        </>
      ) : (
        <>
          <h1 className={styles.title}>Dashboard MindSport</h1>
          <h2 className={styles.greeting}>¡Hola, {perfil.nombre || "Usuario"}!</h2>
          <h3 className={styles.role}>Rol: {perfil.rol || "Desconocido"}</h3>

          {perfil.rol === "futbolista" && (
            <div>
              <p>
                <strong>Entrenador asignado:</strong>{" "}
                {perfil.nombreEntrenador
                  ? perfil.nombreEntrenador
                  : "Sin entrenador asignado"}
              </p>

              <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem", flexWrap: "wrap" }}>
                <UnifiedButton
                  onClick={() => setMostrarConfiguracion(true)}
                  variant="outline"
                  size="medium"
                  style={{
                    border: "2px solid var(--primary-color, #009688)",
                    color: "var(--primary-color, #009688)",
                  }}
                >
                  ⚙️ Configuración de cuenta
                </UnifiedButton>

                <UnifiedButton
                  onClick={() => setMostrarBiblioteca(true)}
                  variant="outline"
                  size="medium"
                  style={{
                    border: "2px solid #1abc53",
                    color: "#1abc53",
                  }}
                >
                  📚 Biblioteca de Fortalezas
                </UnifiedButton>
              </div>
            </div>
          )}

          {perfil.rol === "futbolista" && (
            <>
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
                        <p>¡Comienza tu camino hacia la excelencia mental deportiva!</p>
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
                            transition: "all 0.3s ease-in-out",
                            border: "2px solid transparent",
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.transform = "translateY(-4px)";
                            e.target.style.boxShadow = "0 8px 25px rgba(0, 123, 255, 0.15)";
                            e.target.style.borderColor = "#007bff";
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.transform = "translateY(0)";
                            e.target.style.boxShadow = "0 2px 12px rgba(0, 123, 255, 0.1)";
                            e.target.style.borderColor = "transparent";
                          }}
                        >
                          <h2>IED</h2>
                          <p>
                            Evalúa tu capacidad de reconocer, regular y utilizar tus
                            emociones en el juego. Recibe recomendaciones prácticas
                            y análisis de tu perfil emocional.
                          </p>
                          <UnifiedButton
                            onClick={() => setTestActivo("IED")}
                            variant="secondary"
                            size="medium"
                            style={{
                              marginTop: 20,
                              backgroundColor: "#007bff",
                            }}
                          >
                            🧠 Comenzar Test IED
                          </UnifiedButton>
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
                            transition: "all 0.3s ease-in-out",
                            border: "2px solid transparent",
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.transform = "translateY(-4px)";
                            e.target.style.boxShadow = "0 8px 25px rgba(128, 90, 255, 0.15)";
                            e.target.style.borderColor = "#6a4fff";
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.transform = "translateY(0)";
                            e.target.style.boxShadow = "0 2px 12px rgba(128, 90, 255, 0.1)";
                            e.target.style.borderColor = "transparent";
                          }}
                        >
                          <h2>IPED</h2>
                          <p>
                            Descubre tu perfil psicológico deportivo: autoconfianza,
                            control emocional, actitud, concentración y más.
                            Conócete mejor y mejora tu rendimiento con
                            recomendaciones personalizadas.
                          </p>
                          <UnifiedButton
                            onClick={() => setTestActivo("IPED")}
                            variant="primary"
                            size="medium"
                            style={{
                              marginTop: 20,
                              backgroundColor: "#6a4fff",
                            }}
                          >
                            🎯 Comenzar Test IPED
                          </UnifiedButton>
                        </div>
                      </div>
                    </>
                  )}
                  {testActivo === "IED" && !respuestasIED && (
                    <TestIED
                      onSubmit={handleFinishIED}
                      onCancel={() => setTestActivo(null)}
                    />
                  )}
                  {testActivo === "IPED" && !respuestasIPED && (
                    <TestIPED
                      onSubmit={handleFinishIPED}
                      onCancel={() => setTestActivo(null)}
                    />
                  )}
                  {respuestasIED && (
                    <>
                      <ResultadosIED respuestas={respuestasIED} />
                      <UnifiedButton
                        onClick={() => {
                          setTestActivo(null);
                          setRespuestasIED(null);
                        }}
                        variant="outline"
                        size="medium"
                        style={{
                          marginTop: 20,
                          border: "2px solid var(--success-color, #4CAF50)",
                          color: "var(--success-color, #4CAF50)",
                        }}
                      >
                        ← Volver a selección de test
                      </UnifiedButton>
                    </>
                  )}
                  {respuestasIPED && (
                    <>
                      <ResultadosIPED respuestas={respuestasIPED} />
                      <UnifiedButton
                        onClick={() => {
                          setTestActivo(null);
                          setRespuestasIPED(null);
                        }}
                        variant="outline"
                        size="medium"
                        style={{
                          marginTop: 20,
                          border: "2px solid #6a4fff",
                          color: "#6a4fff",
                        }}
                      >
                        ← Volver a selección de test
                      </UnifiedButton>
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
                    <UnifiedButton
                      variant="success"
                      size="medium"
                      onClick={() => setGraficoTestType("IED")}
                      style={{
                        backgroundColor: graficoTestType === "IED" ? "#1abc53" : undefined,
                      }}
                    >
                      📊 Ver IED
                    </UnifiedButton>
                    <UnifiedButton
                      variant="primary"
                      size="medium"
                      onClick={() => setGraficoTestType("IPED")}
                      style={{
                        backgroundColor: graficoTestType === "IPED" ? "#6a4fff" : undefined,
                      }}
                    >
                      📈 Ver IPED
                    </UnifiedButton>
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
