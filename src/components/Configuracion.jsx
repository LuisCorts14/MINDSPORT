import React, { useState } from "react";

// Componente para futbolista para asociar entrenador ingresando código
function AsociacionFutbolista({ jugador }) {
  const [codigo, setCodigo] = useState("");
  const [mensaje, setMensaje] = useState("");

  const asociarEntrenador = () => {
    // Simulación: acá iría llamada al backend para validar el código y asociar
    const entrenadores = JSON.parse(localStorage.getItem("entrenadores")) || [];
    const futbolistas = JSON.parse(localStorage.getItem("futbolistas")) || [];

    const entrenadorEncontrado = entrenadores.find(
      (e) => e.codigoUnico.toUpperCase() === codigo.toUpperCase()
    );

    if (!entrenadorEncontrado) {
      setMensaje("Código incorrecto o no encontrado.");
      return;
    }

    const indexJugador = futbolistas.findIndex((f) => f.id === jugador.id);
    if (indexJugador === -1) {
      setMensaje("Error: jugador no encontrado.");
      return;
    }

    futbolistas[indexJugador].idEntrenador = entrenadorEncontrado.id;
    localStorage.setItem("futbolistas", JSON.stringify(futbolistas));
    setMensaje(`¡Entrenador ${entrenadorEncontrado.nombre} asociado correctamente!`);
  };

  return (
    <div>
      <h3>Asociar entrenador</h3>
      <input
        type="text"
        placeholder="Ingresa el código del entrenador"
        value={codigo}
        onChange={(e) => setCodigo(e.target.value.toUpperCase())}
        style={{ textTransform: "uppercase", padding: "6px", fontSize: "16px" }}
      />
      <button onClick={asociarEntrenador} style={{ marginLeft: "10px" }}>
        Asociar
      </button>
      {mensaje && <p>{mensaje}</p>}
    </div>
  );
}

// Componente para entrenador para mostrar código único
function CodigoEntrenador({ entrenador }) {
  const codigoUnico = entrenador.codigoUnico || '';

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
  )
}

// Componente configuración principal que decide qué mostrar según rol
export default function Configuracion({ rol, entrenador, jugador }) {
  if (rol === "entrenador") {
    return <CodigoEntrenador entrenador={entrenador} />;
  } else if (rol === "futbolista") {
    return <AsociacionFutbolista jugador={jugador} />;
  }
  return <p>No autorizado para esta configuración.</p>;
}
