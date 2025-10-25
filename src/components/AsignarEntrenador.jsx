// src/components/AsignarEntrenador.jsx

import React, { useState, useEffect } from "react";
import { asociarEntrenador } from "../services/futbolistaService";

function AsignarEntrenador({ idFutbolista, token, onUpdated }) {
  const [idEntrenador, setIdEntrenador] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Aquí podrías cargar lista de entrenadores para seleccionar (opcional)

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!idEntrenador) {
      setError("Por favor, ingresa el ID del entrenador.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const res = await asociarEntrenador(idFutbolista, idEntrenador, token);
      onUpdated(res);
      setIdEntrenador("");
    } catch (err) {
      setError("Error asignando entrenador. Verifica el ID.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Asignar/Actualizar Entrenador</h3>
      <label>
        ID Entrenador:
        <input
          type="text"
          value={idEntrenador}
          onChange={(e) => setIdEntrenador(e.target.value)}
          required
        />
      </label>
      <button type="submit" disabled={loading}>
        {loading ? "Asignando..." : "Asignar Entrenador"}
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
}

export default AsignarEntrenador;
