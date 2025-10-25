import React, { useState, useEffect } from "react";
import styles from "./DashboardEntrenador.module.css";
import ProgresoGrafico from "../components/ProgresoGrafico";
import DetalleJugador from "../pages/DetalleJugador";
import Configuracion from "../components/Configuracion";
import Header from "../components/Header";
import CrearFutbolista from "../components/CrearFutbolista";
import AsignarEntrenador from "../components/AsignarEntrenador";

function DashboardEntrenador() {
  const [selectedJugador, setSelectedJugador] = useState(null);
  const [futbolistas, setFutbolistas] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [mostrarConfiguracion, setMostrarConfiguracion] = useState(false);
  const [user, setUser] = useState(null);
  const [errorPerfil, setErrorPerfil] = useState(null);
  const [mostrarCrear, setMostrarCrear] = useState(false);
  const [mostrarAsignar, setMostrarAsignar] = useState(false);
  const [jugadorParaAsignar, setJugadorParaAsignar] = useState(null);

  useEffect(() => {
    const userLogged = JSON.parse(localStorage.getItem("userData"));
    setUser(userLogged);

    if (userLogged && userLogged.token) {
      const headers = {
        Authorization: `Bearer ${userLogged.token}`,
      };

      // Petición perfil con manejo robusto de cuerpo vacío / errores
      fetch("http://localhost:8080/api/entrenador/perfil", { headers })
        .then(async (res) => {
          const text = await res.text(); // leer texto primero para evitar json() en cuerpo vacío
          if (!res.ok) {
            let msg = "Error cargando perfil";
            try {
              const parsed = text ? JSON.parse(text) : null;
              if (parsed && parsed.message) msg = parsed.message;
            } catch (e) {
              // body no es JSON
            }
            throw new Error(msg);
          }
          return text ? JSON.parse(text) : null;
        })
        .then((perfil) => {
          // Si backend no devuelve perfil en el body, intentar fallback desde localStorage
          if (!perfil) {
            const todosFutbolistas = JSON.parse(localStorage.getItem("futbolistas")) || [];
            const asociados = todosFutbolistas.filter(
              (f) => f.idEntrenador === (userLogged.id || null)
            );
            setFutbolistas(asociados);
            return;
          }

          // Petición futbolistas con manejo robusto
          fetch("http://localhost:8080/api/entrenador/futbolistas", { headers })
            .then(async (res) => {
              const text = await res.text();
              if (!res.ok) {
                let msg = "Error cargando futbolistas";
                try {
                  const parsed = text ? JSON.parse(text) : null;
                  if (parsed && parsed.message) msg = parsed.message;
                } catch (e) {}
                throw new Error(msg);
              }
              return text ? JSON.parse(text) : [];
            })
            .then(setFutbolistas)
            .catch((err) => setErrorPerfil(err.message));
        })
        .catch((err) => setErrorPerfil(err.message));
    }
  }, []);

  const futbolistasFiltrados = futbolistas.filter((jugador) =>
    jugador.nombre.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleJugadorCreado = (nuevoJugador) => {
    setFutbolistas((prev) => [...prev, nuevoJugador]);
    setMostrarCrear(false);
  };

  const handleAbrirAsignar = (jugador) => {
    setJugadorParaAsignar(jugador);
    setMostrarAsignar(true);
  };

  const handleAsignacionActualizada = (jugadorActualizado) => {
    setFutbolistas((prev) =>
      prev.map((j) => (j.id === jugadorActualizado.id ? jugadorActualizado : j))
    );
    setMostrarAsignar(false);
    setJugadorParaAsignar(null);
  };

  if (errorPerfil) return <div>Error: {errorPerfil}</div>;
  if (!user) return <div>Cargando perfil...</div>;

  return (
    <>
      <Header showLogout={true} user={user} />
      <div className={styles.container}>
        <h1 className={styles.title}>Panel del Entrenador</h1>
        <button
          onClick={() => setMostrarConfiguracion(!mostrarConfiguracion)}
          style={{ marginBottom: "1rem", marginRight: "1rem" }}
        >
          {mostrarConfiguracion ? "Volver al Panel" : "Configuración"}
        </button>
        <button
          onClick={() => setMostrarCrear(true)}
          style={{ marginBottom: "1rem" }}
        >
          Crear nuevo futbolista
        </button>

        {mostrarConfiguracion ? (
          <Configuracion rol="entrenador" entrenador={user} />
        ) : mostrarCrear ? (
          <CrearFutbolista
            entrenadorId={user.id}
            token={user.token}
            onCreated={handleJugadorCreado}
          />
        ) : mostrarAsignar ? (
          <AsignarEntrenador
            idFutbolista={jugadorParaAsignar.id}
            token={user.token}
            onUpdated={handleAsignacionActualizada}
          />
        ) : (
          <>
            <div className={styles.main}>
              <div className={styles.leftCol}>
                <h2>Gestión de futbolistas</h2>
                <input
                  type="text"
                  placeholder="Buscar por nombre..."
                  className={styles.inputSearch}
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                />
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Posición</th>
                      <th>Edad</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {futbolistasFiltrados.map((j) => (
                      <tr key={j.id}>
                        <td>{j.nombre}</td>
                        <td>{j.posicion}</td>
                        <td>{j.edad}</td>
                        <td>
                          <button onClick={() => setSelectedJugador(j)}>
                            Ver ficha
                          </button>
                          <button
                            onClick={() => handleAbrirAsignar(j)}
                            style={{ marginLeft: "0.5rem" }}
                          >
                            Asignar entrenador
                          </button>
                        </td>
                      </tr>
                    ))}
                    {futbolistasFiltrados.length === 0 && (
                      <tr>
                        <td colSpan="4" style={{ textAlign: "center" }}>
                          No se encontraron futbolistas asociados
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div className={styles.rightCol}>
                {selectedJugador ? (
                  <DetalleJugador
                    jugador={selectedJugador}
                    onCerrar={() => setSelectedJugador(null)}
                  />
                ) : (
                  <>
                    <h2>Progreso grupal (promedios)</h2>
                    <ProgresoGrafico testType="IED" modoGrupal />
                  </>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default DashboardEntrenador;