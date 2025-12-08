import React, { useState } from "react";
import { asociarEntrenador, buscarEntrenadorPorCodigo } from "../services/futbolistaService";
import UnifiedButton from "./UnifiedButton";

function AsignarEntrenador({ idFutbolista, token, onUpdated, onCancel }) {
  const [codigoUnico, setCodigoUnico] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [entrenadorEncontrado, setEntrenadorEncontrado] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('🚀 === INICIANDO PROCESO DE ASOCIACIÓN ===');
    console.log('Props recibidas:', { idFutbolista, token: token ? 'Presente' : 'Faltante' });
    console.log('Código ingresado:', codigoUnico);
    
    if (!codigoUnico.trim()) {
      setError("Por favor, ingresa el código único del entrenador.");
      return;
    }
    
    if (!token) {
      setError("Token de autenticación no disponible. Por favor, inicia sesión nuevamente.");
      return;
    }
    
    if (!idFutbolista) {
      setError("ID de futbolista no disponible.");
      return;
    }
    
    setError(null);
    setLoading(true);
    
    try {
      console.log('🔍 PASO 1: Buscando entrenador...');
      const entrenador = await buscarEntrenadorPorCodigo(codigoUnico.trim(), token);
      console.log('✅ Entrenador encontrado:', entrenador);
      
      if (!entrenador || !entrenador.id) {
        throw new Error("Entrenador no encontrado o datos incompletos.");
      }
      
      setEntrenadorEncontrado(entrenador);
      
      console.log('🔗 PASO 2: Realizando asociación...');
      const res = await asociarEntrenador(idFutbolista, entrenador.id, token);
      console.log('✅ Asociación exitosa:', res);
      
      onUpdated(res);
      setCodigoUnico("");
      setEntrenadorEncontrado(null);
      
    } catch (err) {
      console.error('❌ ERROR EN EL PROCESO:', err);
      setError(err.message || "No se pudo asociar. Verifica el código del entrenador.");
      setEntrenadorEncontrado(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      border: '1px solid #e3f2fd', 
      padding: '32px', 
      borderRadius: '16px',
      background: '#ffffff',
      boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
    }}>
      {onCancel && (
        <div style={{ marginBottom: '24px' }}>
          <UnifiedButton
            onClick={onCancel}
            variant="outline"
            size="medium"
            style={{
              border: "2px solid var(--primary-color, #009688)",
              color: "var(--primary-color, #009688)"
            }}
          >
            ← Volver al Panel Principal
          </UnifiedButton>
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <h3 style={{ 
          margin: '0 0 24px 0', 
          color: '#009688', 
          fontSize: '22px',
          fontWeight: '600'
        }}>
          🔄 Asignar/Actualizar Entrenador
        </h3>
        
        <div style={{ marginBottom: '20px' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '8px', 
            fontWeight: '600', 
            color: '#333',
            fontSize: '16px'
          }}>
            Código único del entrenador:
          </label>
          <input
            type="text"
            value={codigoUnico}
            onChange={(e) => {
              setCodigoUnico(e.target.value);
              if (error) setError(null);
              if (entrenadorEncontrado) setEntrenadorEncontrado(null);
            }}
            placeholder="Ej: ENT-ABC123"
            style={{
              width: '100%',
              padding: '12px 16px',
              borderRadius: '8px',
              border: '2px solid #e3f2fd',
              fontSize: '16px',
              transition: 'border-color 0.2s ease',
              textTransform: 'uppercase'
            }}
            required
          />
        </div>
        
        {entrenadorEncontrado && (
          <div style={{
            backgroundColor: '#e8f5e8',
            border: '1px solid #4CAF50',
            padding: '15px',
            borderRadius: '8px',
            marginBottom: '15px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
          }}>
            <p style={{ margin: '0 0 8px 0', color: '#2e7d32', fontWeight: '600' }}>
              ✅ Entrenador encontrado:
            </p>
            <p style={{ margin: '4px 0', color: '#333' }}>
              <strong>Nombre:</strong> {entrenadorEncontrado.nombre}
            </p>
            <p style={{ margin: '4px 0', color: '#333' }}>
              <strong>Email:</strong> {entrenadorEncontrado.email}
            </p>
          </div>
        )}
        
        <UnifiedButton 
          type="submit" 
          loading={loading}
          variant="success"
          size="medium"
        >
          {loading ? "Procesando..." : "Asignar Entrenador"}
        </UnifiedButton>
        
        {error && (
          <div style={{ 
            color: "#d32f2f", 
            marginTop: '15px',
            backgroundColor: '#ffeaea',
            padding: '15px',
            borderRadius: '8px',
            border: '1px solid #ffcdd2',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
          }}>
            <p style={{ margin: '0', fontWeight: '500' }}>
              ❌ {error}
            </p>
          </div>
        )}
      </form>
    </div>
  );
}

export default AsignarEntrenador;