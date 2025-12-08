import React, { useState, useEffect } from "react";
import styles from "./DashboardEntrenador.module.css";
import ProgresoGrafico from "../components/ProgresoGrafico";
import DetalleJugador from "../pages/DetalleJugador";
import Configuracion from "../components/Configuracion";
import Header from "../components/Header";
import UnifiedButton from "../components/UnifiedButton";
import InfoCard from "../components/InfoCard";
import { obtenerHistorialNotas } from "../services/futbolistaService";

function DashboardEntrenador() {
  const [selectedJugador, setSelectedJugador] = useState(null);
  const [futbolistas, setFutbolistas] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [mostrarConfiguracion, setMostrarConfiguracion] = useState(false);
  const [user, setUser] = useState(null);
  const [errorPerfil, setErrorPerfil] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Estados para el historial de notas
  const [mostrarHistorial, setMostrarHistorial] = useState(false);
  const [jugadorHistorial, setJugadorHistorial] = useState(null);
  const [historialNotas, setHistorialNotas] = useState([]);

  // Función para manejar el historial de notas
  const handleMostrarHistorial = async (jugador) => {
    try {
      setJugadorHistorial(jugador);
      setMostrarHistorial(true);
      
      console.log('📚 Cargando historial real para jugador:', jugador.id);
      
      // Cargar historial real desde el backend
      const historialReal = await obtenerHistorialNotas(jugador.id, user?.token);
      
      console.log('✅ Historial recibido:', historialReal);
      
      // Si no hay historial, mostrar la nota actual como primer registro
      if (historialReal.length === 0 && jugador.notaEntrenador && jugador.notaEntrenador.trim() !== '') {
        const historialConNotaActual = [{
          id: 'actual',
          fecha: new Date().toISOString().split('T')[0],
          nota: jugador.notaEntrenador,
          entrenador: user?.nombre || 'Entrenador'
        }];
        setHistorialNotas(historialConNotaActual);
      } else {
        setHistorialNotas(historialReal);
      }
      
    } catch (error) {
      console.error('❌ Error obteniendo historial:', error);
      
      // Fallback: mostrar nota actual si hay error
      if (jugador.notaEntrenador && jugador.notaEntrenador.trim() !== '') {
        const notaActual = [{
          id: 'fallback',
          fecha: new Date().toISOString().split('T')[0],
          nota: jugador.notaEntrenador,
          entrenador: user?.nombre || 'Entrenador'
        }];
        setHistorialNotas(notaActual);
      } else {
        setHistorialNotas([]);
      }
      
      // alert('Error al cargar el historial. Mostrando nota actual.');
    }
  };

  useEffect(() => {
    const userLogged = JSON.parse(localStorage.getItem("userData"));
    setUser(userLogged);

    if (userLogged && userLogged.token && userLogged.id) {
      const headers = {
        Authorization: `Bearer ${userLogged.token}`,
      };

      console.log("Cargando futbolistas para entrenador ID:", userLogged.id);

      // Usar el nuevo endpoint para obtener los futbolistas asociados al entrenador
      fetch(`http://localhost:8080/api/usuarios/entrenador/${userLogged.id}/futbolistas`, { headers })
        .then(async (res) => {
          if (!res.ok) {
            let msg = "Error cargando futbolistas asociados";
            try {
              const errorData = await res.json();
              if (errorData.error) msg = errorData.error;
            } catch (e) {
              // Si no se puede parsear el JSON del error
              msg = `Error ${res.status}: ${res.statusText}`;
            }
            throw new Error(msg);
          }
          return res.json();
        })
        .then((data) => {
          console.log("Respuesta del servidor:", data);
          
          // El endpoint devuelve un objeto con la lista de futbolistas
          if (data.futbolistas && Array.isArray(data.futbolistas)) {
            setFutbolistas(data.futbolistas);
            console.log(`Cargados ${data.futbolistas.length} futbolistas asociados`);
          } else {
            setFutbolistas([]);
            console.log("No se encontraron futbolistas asociados");
          }
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error cargando futbolistas:", err);
          setErrorPerfil(err.message);
          setLoading(false);
          
          // Fallback: cargar desde localStorage si hay error
          const todosFutbolistas = JSON.parse(localStorage.getItem("futbolistas")) || [];
          const asociados = todosFutbolistas.filter(
            (f) => f.idEntrenador === userLogged.id
          );
          setFutbolistas(asociados);
          console.log("Cargados desde localStorage:", asociados.length, "futbolistas");
        });
    } else {
      setLoading(false);
      console.warn("Falta información del usuario logueado");
    }
  }, []);

  // Función para recargar la lista de futbolistas
  const recargarFutbolistas = () => {
    const userLogged = JSON.parse(localStorage.getItem("userData"));
    if (userLogged && userLogged.token && userLogged.id) {
      const headers = {
        Authorization: `Bearer ${userLogged.token}`,
      };

      fetch(`http://localhost:8080/api/usuarios/entrenador/${userLogged.id}/futbolistas`, { headers })
        .then(res => res.json())
        .then((data) => {
          if (data.futbolistas && Array.isArray(data.futbolistas)) {
            setFutbolistas(data.futbolistas);
          }
        })
        .catch((err) => {
          console.error("Error recargando futbolistas:", err);
        });
    }
  };

  const futbolistasFiltrados = futbolistas.filter((jugador) =>
    jugador.nombre.toLowerCase().includes(searchText.toLowerCase())
  );

  if (loading) return <div>Cargando perfil y futbolistas...</div>;
  if (errorPerfil) return <div>Error: {errorPerfil}</div>;
  if (!user) return <div>No se pudo cargar la información del usuario</div>;

  return (
    <>
      <Header showLogout={true} user={user} />
      <div className={styles.container}>
        <h1 className={styles.title}>Panel del Entrenador</h1>
        
        <div style={{ marginBottom: "1rem", display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <UnifiedButton
            onClick={() => setMostrarConfiguracion(!mostrarConfiguracion)}
            variant="outline"
            size="medium"
            style={{
              border: "2px solid var(--primary-color, #009688)",
              color: "var(--primary-color, #009688)"
            }}
          >
            {mostrarConfiguracion ? "← Volver al Panel" : "⚙️ Configuración"}
          </UnifiedButton>
          <UnifiedButton
            onClick={recargarFutbolistas}
            variant="secondary"
            size="medium"
          >
            🔄 Recargar lista
          </UnifiedButton>
        </div>

        {mostrarConfiguracion ? (
          <Configuracion rol="entrenador" entrenador={user} />
        ) : (
          <>
            <div className={styles.main}>
              <div className={styles.leftCol}>
                <div style={{ 
                  background: '#ffffff', 
                  padding: '32px', 
                  borderRadius: '16px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                  border: '1px solid #e3f2fd'
                }}>
                  <h2 style={{ 
                    margin: '0 0 24px 0', 
                    color: '#009688', 
                    fontSize: '24px',
                    fontWeight: '600'
                  }}>
                    Gestión de futbolistas asociados
                  </h2>
                  <p style={{ 
                    margin: '0 0 20px 0', 
                    color: '#666',
                    fontSize: '16px' 
                  }}>
                    Total de futbolistas: <strong>{futbolistas.length}</strong>
                  </p>
                
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
                      <th>Email</th>
                      <th>Estado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {futbolistasFiltrados.map((j) => (
                      <tr key={j.id}>
                        <td>{j.nombre}</td>
                        <td>{j.email}</td>
                        <td>
                          <span style={{ 
                            display: "inline-block",
                            backgroundColor: "#e8f5e8",
                            color: "#2e7d32",
                            padding: "4px 12px",
                            borderRadius: "16px",
                            fontSize: "13px",
                            fontWeight: "500",
                            border: "1px solid #4CAF50"
                          }}>
                            ✓ Asociado
                          </span>
                        </td>
                        <td style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                          <UnifiedButton
                            onClick={() => setSelectedJugador(j)}
                            variant="primary"
                            size="small"
                          >
                            👁️ Ver ficha
                          </UnifiedButton>
                        </td>
                      </tr>
                    ))}
                    {futbolistasFiltrados.length === 0 && (
                      <tr>
                        <td colSpan="4" style={{ textAlign: "center", padding: "2rem" }}>
                          {searchText ? 
                            "No se encontraron futbolistas con ese nombre" : 
                            "No tienes futbolistas asociados aún"
                          }
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
                
                {/* Historial de Notas */}
                {mostrarHistorial && jugadorHistorial && (
                  <div className={styles.historialContainer}>
                    <div className={styles.historialHeader}>
                      <h3>📝 Historial de Notas - {jugadorHistorial.nombre}</h3>
                      <button 
                        onClick={() => setMostrarHistorial(false)}
                        className={styles.buttonCerrarHistorial}
                      >
                        ✕
                      </button>
                    </div>
                    
                    <div className={styles.historialContent}>
                      {historialNotas.length > 0 ? (
                        <div className={styles.notasList}>
                          {historialNotas.map((nota) => (
                            <div key={nota.id} className={styles.notaItem}>
                              <div className={styles.notaFecha}>
                                {new Date(nota.fecha).toLocaleDateString('es-ES', {
                                  day: '2-digit',
                                  month: '2-digit',
                                  year: 'numeric'
                                })}
                              </div>
                              <div className={styles.notaTexto}>
                                {nota.nota}
                              </div>
                              <div className={styles.notaEntrenador}>
                                Por: {nota.entrenador}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className={styles.noHistorial}>
                          <p>📋 No hay notas registradas para este futbolista</p>
                          <small>Las notas se guardan cada vez que actualizas el campo "Notas adicionales"</small>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                {futbolistas.length === 0 && (
                  <InfoCard 
                    variant="info" 
                    title="🎯 ¿Cómo agregar futbolistas a tu panel?"
                    style={{ marginTop: "1rem" }}
                  >
                    <div style={{ marginBottom: "16px" }}>
                      <h4 style={{ color: "var(--primary-color, #009688)", margin: "0 0 8px 0" }}>
                        📝 Pasos a seguir:
                      </h4>
                      <ol style={{ margin: 0, paddingLeft: "20px", lineHeight: "1.6" }}>
                        <li><strong>Comparte tu código único</strong> con los futbolistas</li>
                        <li>Cada futbolista debe <strong>registrarse por sí mismo</strong> en MindSport</li>
                        <li>Durante el registro, usarán tu código para <strong>asociarse automáticamente</strong></li>
                        <li>¡Aparecerán automáticamente en tu panel! 🎉</li>
                      </ol>
                    </div>
                    
                    <div style={{ 
                      textAlign: "center",
                      margin: "20px 0",
                      padding: "16px",
                      backgroundColor: "var(--bg-primary-light, #f6fafd)",
                      borderRadius: "12px",
                      border: "3px dashed var(--primary-color, #009688)"
                    }}>
                      <p style={{ margin: "0 0 8px 0", color: "#666", fontSize: "14px" }}>
                        <strong>TU CÓDIGO ÚNICO:</strong>
                      </p>
                      <div style={{ fontSize: "1.6em", color: "var(--primary-color, #009688)", letterSpacing: "3px", fontWeight: "bold" }}>
                        {user.codigoUnico}
                      </div>
                    </div>
                    
                    <div style={{ 
                      padding: "12px", 
                      backgroundColor: "#e8f5e8", 
                      borderRadius: "8px",
                      border: "1px solid #4CAF50"
                    }}>
                      <p style={{ margin: 0, fontSize: "14px", color: "#2e7d32" }}>
                        <strong>� ¿Por qué así?</strong> Es más seguro y preciso que cada futbolista maneje sus propios datos de registro.
                      </p>
                    </div>
                  </InfoCard>
                )}
                </div>
              </div>
              
              <div className={styles.rightCol}>
                {selectedJugador ? (
                  <DetalleJugador
                    jugador={selectedJugador}
                    onCerrar={() => setSelectedJugador(null)}
                    onMostrarHistorial={handleMostrarHistorial}
                  />
                ) : (
                  <>
                    <h2 style={{ 
                      margin: '0 0 24px 0', 
                      color: '#009688', 
                      fontSize: '24px',
                      fontWeight: '600'
                    }}>
                      Estadísticas del grupo
                    </h2>
                    {futbolistas.length > 0 ? (
                      <>
                        <div style={{ 
                          marginBottom: "24px",
                          padding: "16px",
                          background: "#f6fafd",
                          borderRadius: "12px",
                          border: "1px solid #e3f2fd"
                        }}>
                          <p style={{ 
                            margin: 0, 
                            color: '#666',
                            fontSize: '16px' 
                          }}>
                            Promedio grupal de rendimiento
                          </p>
                        </div>
                        <ProgresoGrafico testType="IED" modoGrupal />
                      </>
                    ) : (
                      <InfoCard 
                        variant="info" 
                        title="📊 Sin datos disponibles"
                        style={{ padding: "2rem", textAlign: "center" }}
                      >
                        <p>Una vez que tengas futbolistas asociados, aquí verás sus estadísticas grupales.</p>
                        <div style={{ marginTop: "16px", fontSize: "2rem" }}>
                          📈⚽
                        </div>
                      </InfoCard>
                    )}
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