import React, { useState } from "react";
import ProgresoGrafico from "../components/ProgresoGrafico";
import styles from "./DetalleJugador.module.css";

function DetalleJugador({ jugador, onCerrar }) {
  // Estados para datos editables
  const [posicion, setPosicion] = useState(jugador.posicion || "");
  const [notas, setNotas] = useState(jugador.notas || "");
  const [edad, setEdad] = useState(jugador.edad || "");

  // Función para guardar con validación mínima
  const guardarInfo = () => {
    const edadNum = parseInt(edad, 10);
    if (isNaN(edadNum) || edadNum < 10 || edadNum > 80) {
      alert("Por favor ingresa una edad válida entre 10 y 80.");
      return;
    }

    // Obtiene la lista actual guardada para ese entrenador
    const user = JSON.parse(localStorage.getItem("userData"));
    const key = `futbolistasEntrenador_${user.id}`;

    const futbolistasGuardados = JSON.parse(localStorage.getItem(key)) || [];
    const actualizados = futbolistasGuardados.map(f =>
      f.id === jugador.id ? { ...f, posicion, notas, edad: edadNum } : f
    );

    localStorage.setItem(key, JSON.stringify(actualizados));
    alert("Información del jugador actualizada correctamente");
  };

  return (
    <div className={styles.detalleContainer}>
      <h2>Detalles de {jugador.nombre}</h2>

      <div className={styles.infoSection}>
        <label>
          Edad:
          <input
            type="number"
            value={edad}
            onChange={(e) => setEdad(e.target.value)}
            min="10"
            max="80"
            placeholder="Edad del jugador"
          />
        </label>

        <label>
          Posición:
          <input
            type="text"
            value={posicion}
            onChange={(e) => setPosicion(e.target.value)}
            placeholder="Ejemplo: Defensa central"
          />
        </label>

        <label>
          Notas adicionales:
          <textarea
            rows="4"
            value={notas}
            onChange={(e) => setNotas(e.target.value)}
            placeholder="Observaciones, objetivos o características del jugador..."
          />
        </label>

        <button onClick={guardarInfo} className={styles.buttonGuardar}>Guardar cambios</button>
      </div>

      <div className={styles.graficoSection}>
        <h3>Evolución mental (IED)</h3>
        <ProgresoGrafico testType="IED" jugadorId={jugador.id} />

        <h3>Evolución mental (IPED)</h3>
        <ProgresoGrafico testType="IPED" jugadorId={jugador.id} />
      </div>

      <button onClick={onCerrar} className={styles.buttonCerrar}>
        ← Volver al listado
      </button>
    </div>
  );
}

export default DetalleJugador;
