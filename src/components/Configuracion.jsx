import React, { useState, useEffect } from "react";
import AsignarEntrenador from "./AsignarEntrenador";
import InfoCard from "./InfoCard";

// Componente para entrenador para mostrar código único
function CodigoEntrenador({ entrenador }) {
  const codigoUnico = entrenador.codigoUnico || "";

  return (
    <div>
      <h3>Tu código único de entrenador</h3>
      <input
        readOnly
        value={codigoUnico}
        style={{
          fontSize: "18px",
          padding: "6px",
          width: "250px",
          userSelect: "all",
        }}
        title="Haz click y copia tu código"
        onClick={(e) => e.target.select()}
      />
      <p>Comparte este código con tus futbolistas para que se asocien a tu grupo.</p>
    </div>
  );
}

// Componente configuración principal que decide qué mostrar según rol
export default function Configuracion({
  rol,
  entrenador,
  jugador,
  nombreEntrenador: nombreEntrenadorProp,
  token,
  userId,
}) {
  const [nombreEntrenador, setNombreEntrenador] = useState(nombreEntrenadorProp || null);
  const [cargandoEntrenador, setCargandoEntrenador] = useState(false);

  // Obtener información del entrenador asignado solo si no la tiene ya en prop
  useEffect(() => {
    const obtenerNombreEntrenador = async () => {
      if (!nombreEntrenadorProp && jugador?.idEntrenador && token) {
        try {
          setCargandoEntrenador(true);

          const response = await fetch(
            `http://localhost:8080/api/entrenador/${jugador.idEntrenador}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );

          if (response.ok) {
            const entrenadorInfo = await response.json();
            console.log("✅ Respuesta exitosa del backend:", entrenadorInfo);
            setNombreEntrenador(entrenadorInfo.nombre);
          } else {
            const errorText = await response.text();
            console.error(`❌ Error ${response.status}: ${errorText}`);
            setNombreEntrenador(null);
          }
        } catch (error) {
          console.error("Error al obtener información del entrenador:", error);
          setNombreEntrenador(null);
        } finally {
          setCargandoEntrenador(false);
        }
      } else if (nombreEntrenadorProp) {
        setNombreEntrenador(nombreEntrenadorProp);
      }
    };

    obtenerNombreEntrenador();
  }, [jugador?.idEntrenador, token, nombreEntrenadorProp]);

  // Función para manejar la respuesta de asociación exitosa
  const handleAsociacionExitosa = (resultado) => {
    console.log("✅ Asociación completada:", resultado);

    // Actualizar los datos del usuario en localStorage si es necesario
    const userData = JSON.parse(localStorage.getItem("userData") || "{}");
    if (userData && resultado.entrenadorId) {
      // Podrías actualizar aquí si necesitas mantener algún estado
      console.log("Datos actualizados tras asociación");
    }

    // Mostrar mensaje de éxito
    alert(`¡Éxito! ${resultado.message}`);
  };

  if (rol === "entrenador") {
    return <CodigoEntrenador entrenador={entrenador} />;
  } else if (rol === "futbolista") {
    return (
      <div>
        <h2>Configuración de Futbolista</h2>
        <div style={{ marginTop: "20px" }}>
          <AsignarEntrenador
            idFutbolista={userId}
            token={token}
            onUpdated={handleAsociacionExitosa}
          />
        </div>

        {/* Información actual del jugador */}
        <InfoCard
          variant="info"
          title="Tu información actual:"
          style={{ marginTop: "30px" }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <p style={{ margin: "0", lineHeight: "1.5" }}>
              <strong style={{ color: "var(--primary-color, #009688)" }}>
                Nombre:
              </strong>{" "}
              {jugador?.nombre || "No disponible"}
            </p>
            <p style={{ margin: "0", lineHeight: "1.5" }}>
              <strong style={{ color: "var(--primary-color, #009688)" }}>Email:</strong>{" "}
              {jugador?.email || "No disponible"}
            </p>
            <p style={{ margin: "0", lineHeight: "1.5" }}>
              <strong style={{ color: "var(--primary-color, #009688)" }}>ID:</strong>{" "}
              {userId || "No disponible"}
            </p>
            {jugador?.idEntrenador && (
              <p style={{ margin: "0", lineHeight: "1.5" }}>
                <strong style={{ color: "var(--primary-color, #009688)" }}>
                  Entrenador asignado:
                </strong>{" "}
                <span
                  style={{
                    backgroundColor: nombreEntrenador
                      ? "var(--bg-success-light, #e8f5e8)"
                      : "#fff3cd",
                    color: nombreEntrenador ? "var(--success-color, #2e7d32)" : "#856404",
                    padding: "2px 8px",
                    borderRadius: "var(--radius-sm, 4px)",
                    marginLeft: "8px",
                    fontSize: "var(--font-size-sm, 14px)",
                    fontWeight: "var(--font-weight-medium, 500)",
                  }}
                >
                  {cargandoEntrenador
                    ? "🔄 Cargando nombre..."
                    : nombreEntrenador
                    ? `✓ ${nombreEntrenador}`
                    : `⚠️ ID: ${jugador.idEntrenador} (Error al cargar nombre)`}
                </span>
              </p>
            )}
          </div>
        </InfoCard>
      </div>
    );
  }

  return <p>No autorizado para esta configuración.</p>;
}
