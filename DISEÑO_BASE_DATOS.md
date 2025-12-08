# 📊 Diseño de Base de Datos - MindSport

## 🎯 Resumen Ejecutivo

MindSport utiliza **MongoDB Atlas** como base de datos NoSQL en la nube, con un modelo de datos flexible y escalable diseñado para gestionar usuarios (entrenadores y futbolistas), tests psicológicos (IED e IPED), resultados y evolución temporal.

---

## 🏗️ Arquitectura General

```
MongoDB Atlas (Nube)
    ├── Colección: usuarios
    ├── Colección: resultados_tests
    ├── Colección: preguntas_ied
    ├── Colección: preguntas_iped
    └── Colección: historico_evoluciones
```

---

## 📋 Colecciones y Esquemas

### 1. **Colección: `usuarios`**

Almacena información de entrenadores y futbolistas registrados en la plataforma.

```json
{
  "_id": ObjectId("507f1f77bcf86cd799439011"),
  "nombre": "Alberto Pérez",
  "email": "alberto@example.com",
  "rol": "entrenador",
  "password": "hash_encriptado",
  "fechaRegistro": "2024-09-15T10:30:00.000Z",
  "estado": "activo",
  
  // Campos específicos para entrenadores
  "idEntrenador": null,
  "futbolistasAsignados": [
    ObjectId("507f1f77bcf86cd799439012"),
    ObjectId("507f1f77bcf86cd799439013")
  ],
  
  // Campos específicos para futbolistas
  "idEntrenador": ObjectId("507f1f77bcf86cd799439011"),
  "posicion": "Delantero Centro",
  "edad": 22,
  "notas": "Buen potencial defensivo",
  "equipo": "FC Barcelona",
  
  // Campos de actividad
  "ultimoAcceso": "2024-11-22T15:45:00.000Z",
  "testCompletados": ["IED", "IPED"]
}
```

**Índices recomendados:**
- `email` (único)
- `rol`
- `idEntrenador`

---

### 2. **Colección: `resultados_tests`**

Almacena los resultados de cada intento de test (IED o IPED) realizado por futbolistas.

```json
{
  "_id": ObjectId("507f1f77bcf86cd799439014"),
  "idFutbolista": ObjectId("507f1f77bcf86cd799439012"),
  "tipoTest": "IED",
  "fecha": "2024-11-20T14:30:00.000Z",
  
  // Respuestas del futbolista (índices base 1 como envía el backend)
  "respuestas": {
    "1": 4,
    "2": 3,
    "3": 5,
    "4": 2,
    // ... hasta pregunta 30 para IED
    // ... hasta pregunta 42 para IPED
  },
  
  // Puntajes calculados por fortaleza (escala 0-5)
  "puntajes": {
    "autorregulacion": {
      "suma": 32,
      "promedio": 4.0,
      "nivel": "alto"
    },
    "motivacion": {
      "suma": 16,
      "promedio": 4.0,
      "nivel": "alto"
    },
    "empatia": {
      "suma": 42,
      "promedio": 4.2,
      "nivel": "alto"
    },
    "reconocimiento": {
      "suma": 24,
      "promedio": 4.0,
      "nivel": "alto"
    }
  },
  
  // Metadatos
  "duracionMinutos": 25,
  "tiempoPromedioPorPregunta": 50,
  "intento": 1,
  "navegador": "Chrome/120.0",
  "plataforma": "Windows"
}
```

**Estructura de `puntajes` según tipo de test:**

#### IED (4 fortalezas):
```json
{
  "autorregulacion": { suma, promedio, nivel },
  "motivacion": { suma, promedio, nivel },
  "empatia": { suma, promedio, nivel },
  "reconocimiento": { suma, promedio, nivel }
}
```

#### IPED (7 fortalezas):
```json
{
  "autoconfianza": { suma, promedio, nivel },
  "control_emocional": { suma, promedio, nivel },
  "actitud_positiva": { suma, promedio, nivel },
  "control_atencional": { suma, promedio, nivel },
  "afrontamiento_negativo": { suma, promedio, nivel },
  "afrontamiento_positivo": { suma, promedio, nivel },
  "visualizacion": { suma, promedio, nivel }
}
```

**Índices recomendados:**
- `idFutbolista` + `tipoTest` (compuesto)
- `fecha` (orden descendente)
- `idFutbolista` + `fecha` (compuesto)

---

### 3. **Colección: `preguntas_ied`**

Almacena las 30 preguntas del test IED de forma dinámica.

```json
{
  "_id": ObjectId("507f1f77bcf86cd799439015"),
  "numeroPreguntan": 1,
  "texto": "Cuando cometo un error en el entrenamiento, busco entender por qué ocurrió",
  "escala": "1-5",
  "fortaleza": "autorregulacion",
  "categoria": "emocional",
  "activa": true,
  "fechaCreacion": "2024-01-01T00:00:00.000Z",
  "fechaActualizacion": "2024-11-20T10:00:00.000Z"
}
```

**Índices recomendados:**
- `numeroPregupta` (único)
- `fortaleza`
- `activa`

---

### 4. **Colección: `preguntas_iped`**

Almacena las 42 preguntas del test IPED de forma dinámica.

```json
{
  "_id": ObjectId("507f1f77bcf86cd799439016"),
  "numeroPregupta": 1,
  "texto": "Tengo confianza en mis habilidades para jugar bajo presión",
  "escala": "1-5",
  "fortaleza": "autoconfianza",
  "categoria": "rendimiento",
  "activa": true,
  "fechaCreacion": "2024-01-01T00:00:00.000Z",
  "fechaActualizacion": "2024-11-20T10:00:00.000Z"
}
```

---

### 5. **Colección: `historico_evoluciones`** (Opcional)

Almacena resúmenes de evolución temporal para consultas rápidas.

```json
{
  "_id": ObjectId("507f1f77bcf86cd799439017"),
  "idFutbolista": ObjectId("507f1f77bcf86cd799439012"),
  "tipoTest": "IED",
  "fortaleza": "autorregulacion",
  
  // Evolución temporal (array de puntajes históricos)
  "evolucion": [
    {
      "fecha": "2024-09-15T10:30:00.000Z",
      "promedio": 2.5,
      "nivel": "medio",
      "intento": 1
    },
    {
      "fecha": "2024-10-20T14:45:00.000Z",
      "promedio": 3.2,
      "nivel": "medio",
      "intento": 2
    },
    {
      "fecha": "2024-11-20T09:15:00.000Z",
      "promedio": 4.0,
      "nivel": "alto",
      "intento": 3
    }
  ],
  
  // Estadísticas agregadas
  "promedioPeriodo": 3.23,
  "maximoHistorico": 4.0,
  "minimoHistorico": 2.5,
  "mejora": "+1.5 pts (+60%)",
  "tendencia": "creciente"
}
```

---

## 📊 Mapeo de Preguntas a Fortalezas

### IED (30 preguntas → 4 fortalezas)

| Fortaleza | Preguntas (índices base 0) | Cantidad |
|-----------|---------------------------|----------|
| **Autorregulación** | 1, 6, 11, 16, 19, 20, 26, 27 | 8 |
| **Motivación** | 2, 9, 13, 22 | 4 |
| **Empatía** | 0, 3, 4, 12, 17, 23, 24, 25, 28, 29 | 10 |
| **Reconocimiento** | 7, 8, 10, 14, 18, 21 | 6 |

### IPED (42 preguntas → 7 fortalezas)

| Fortaleza | Preguntas (índices base 0) | Cantidad |
|-----------|---------------------------|----------|
| **Autoconfianza** | 0, 7, 14, 21 | 4 |
| **Control Emocional** | 1, 5, 6, 8, 13, 16, 22, 23, 27 | 9 |
| **Actitud Positiva** | 4, 11, 12, 18, 20, 25, 26, 39, 40 | 9 |
| **Control Atencional** | 2, 9, 37 | 3 |
| **Afrontamiento Negativo** | 15, 19, 29, 30, 31, 32 | 6 |
| **Afrontamiento Positivo** | 28, 33, 34, 35, 36, 41 | 6 |
| **Visualización** | 3, 10, 17, 24, 38 | 5 |

---

## 🔄 Flujos de Datos

### Flujo 1: Completar un Test

```
Frontend (TestIED/TestIPED)
    ↓ (POST respuestas + puntajes)
Backend API
    ↓ (guardarResultado)
MongoDB: resultados_tests
    ├── Guarda respuestas (índices base 1)
    ├── Calcula y guarda puntajes
    └── Registra metadatos (fecha, navegador, etc)
    ↓
Frontend: Muestra resultados
    ↓ (Calcula recomendaciones)
Página de resultados (Análisis)
```

### Flujo 2: Ver Ficha de Futbolista

```
Frontend (DetalleJugador)
    ↓ (GET resultados del futbolista)
Backend API
    ↓ (obtenerResultadosFutbolista)
MongoDB: resultados_tests
    ├── Filtra por idFutbolista
    ├── Ordena por fecha (DESC)
    └── Retorna todos los intentos
    ↓
Frontend: Procesa datos
    ├── Último resultado → Análisis Psicológico Actual
    ├── Todos los resultados → Evolución Temporal
    └── Compara períodos → Comparación P2P
```

### Flujo 3: Comparación Período a Período

```
DetalleJugador (obtiene todos los resultados)
    ↓
EvolucionTemporalFortalezas
    ├── Filtra por tipo de test
    ├── Ordena por fecha (antiguo → reciente)
    ├── Selecciona fortaleza actual
    ├── Genera comparaciones:
    │   ├── Intento N-1 vs Intento N
    │   ├── Calcula cambio en puntos
    │   ├── Calcula cambio en %
    │   └── Aplica color-coding
    └── Muestra:
        ├── 4 cuadros para IED
        └── 7 cuadros para IPED
```

---

## 🔐 Consideraciones de Seguridad

### Autenticación
- Tokens JWT almacenados en `localStorage`
- Validación en cada request a API
- Token incluido en headers: `Authorization: Bearer {token}`

### Autorización
- **Futbolista**: Solo puede ver/modificar sus propios resultados
- **Entrenador**: Puede ver resultados de futbolistas asignados
- **Admin**: Acceso completo a todas las colecciones

### Validación de Datos
- Respuestas: Valores 1-5 (escalas validadas en backend)
- Índices: Base 1 en respuestas, convertidas a base 0 en frontend
- Fechas: ISO 8601 en MongoDB, procesadas en frontend

---

## 📈 Escalabilidad

### Particionamiento (Sharding)
- **Shard Key recomendado**: `idFutbolista` en `resultados_tests`
- Distribuye resultados por usuario
- Mejora performance en consultas frecuentes

### Indexación para Performance
```javascript
// resultados_tests
db.resultados_tests.createIndex({ "idFutbolista": 1, "tipoTest": 1 })
db.resultados_tests.createIndex({ "idFutbolista": 1, "fecha": -1 })

// usuarios
db.usuarios.createIndex({ "email": 1 }, { unique: true })
db.usuarios.createIndex({ "idEntrenador": 1 })
```

### Proyecciones para Optimización
```javascript
// Solo traer campos necesarios
db.collection('resultados_tests').find(
  { idFutbolista: userId },
  { projection: { puntajes: 1, fecha: 1, tipoTest: 1 } }
)
```

---

## 🎯 Relaciones Clave

```
usuarios (entrenador)
    ↓ (1:N)
usuarios (futbolista)
    ├── idEntrenador → usuarios
    ├── (1:N)
    └── resultados_tests
            ├── idFutbolista → usuarios
            └── tipoTest → preguntas_ied | preguntas_iped
```

---

## 📝 Ejemplos de Consultas Comunes

### 1. Obtener todos los resultados de un futbolista
```javascript
db.resultados_tests.find(
  { idFutbolista: ObjectId("...") }
).sort({ fecha: -1 })
```

### 2. Obtener último resultado IED de un futbolista
```javascript
db.resultados_tests.findOne(
  { idFutbolista: ObjectId("..."), tipoTest: "IED" },
  { sort: { fecha: -1 } }
)
```

### 3. Obtener evolución de una fortaleza
```javascript
db.resultados_tests.find(
  { idFutbolista: ObjectId("..."), tipoTest: "IED" },
  { projection: { "puntajes.autorregulacion": 1, fecha: 1 } }
).sort({ fecha: 1 })
```

### 4. Futbolistas de un entrenador con sus últimos resultados
```javascript
db.usuarios.aggregate([
  { $match: { _id: ObjectId("...") } },
  { $lookup: {
      from: "usuarios",
      localField: "futbolistasAsignados",
      foreignField: "_id",
      as: "futbolistas"
    }
  }
])
```

---

## 🚀 Migración de Datos

### Estado Actual
- ✅ Usuarios almacenados en MongoDB
- ✅ Resultados de tests almacenados en MongoDB
- ✅ Preguntas en archivos locales (con opción de migrar a MongoDB)

### Plan de Migración (Hito 3)
1. **Fase 1**: Validar estructura actual (COMPLETADO)
2. **Fase 2**: Migrar preguntas a MongoDB (opcional)
3. **Fase 3**: Implementar índices para optimización
4. **Fase 4**: Agregar histórico de evoluciones

---

## 📊 Estadísticas Estimadas

**Para 100 futbolistas completando 5 tests cada uno:**

| Colección | Documentos | Tamaño (aprox) |
|-----------|-----------|----------------|
| usuarios | 150 | 2 MB |
| resultados_tests | 500 | 5 MB |
| preguntas_ied | 30 | 100 KB |
| preguntas_iped | 42 | 150 KB |
| **Total** | **722** | **~7.3 MB** |

---

## 🎯 Conclusión

El diseño de base de datos de MindSport es **flexible, escalable y optimizado** para:
- ✅ Almacenar datos de tests psicológicos
- ✅ Visualizar evolución temporal de futbolistas
- ✅ Comparar resultados período a período
- ✅ Soportar crecimiento futuro de usuarios

La estructura permite fácil extensión para nuevos tests, métricas adicionales y análisis avanzados sin necesidad de migración de datos.
