// src/components/CrearFutbolista.jsx

import React, { useState } from "react";
import { crearFutbolista } from "../services/futbolistaService";

function CrearFutbolista({ entrenadorId, token, onCreated }) {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const nuevoJugador = {
      nombre,
      email,
      password,
      rol: "futbolista",
      idEntrenador: entrenadorId,
    };

    try {
      const res = await crearFutbolista(nuevoJugador, token);
      onCreated(res);
      setNombre("");
      setEmail("");
      setPassword("");
    } catch (err) {
      setError("Error creando futbolista. Revisa los datos e intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Registrar nuevo futbolista</h3>
      <label>
        Nombre completo:
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />
      </label>
      <label>
        Email:
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </label>
      <label>
        Contraseña:
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </label>
      <button type="submit" disabled={loading}>
        {loading ? "Creando..." : "Crear futbolista"}
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
}

export default CrearFutbolista;
