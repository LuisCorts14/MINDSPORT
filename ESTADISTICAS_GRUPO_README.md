# Estadísticas del Grupo - Dashboard Entrenador

## 📊 Descripción General

Se ha implementado un nuevo sistema completo de visualización de estadísticas del grupo de futbolistas en el dashboard del entrenador. Esta característica procesa automáticamente los resultados de todos los futbolistas asociados y genera estadísticas agregadas en tiempo real.

## 🎯 Características

### 1. **Cálculo Automático de Estadísticas**
- Promedio general del grupo
- Estadísticas por fortaleza: promedio, mínimo, máximo, desviación estándar
- Ranking de fortalezas ordenadas por rendimiento
- Análisis automático por tipo de test (IED o IPED)

### 2. **Tres Vistas Disponibles**

#### 📈 Vista Gráfico (Gráfico de Línea)
- Visualización del promedio del grupo por fortaleza
- Línea interactiva con puntos de datos
- Zoom y hover interactivos
- Ideal para ver tendencias generales

#### 📋 Vista Tabla
- Tabla detallada con todas las estadísticas
- Columnas: Fortaleza, Promedio, Mínimo, Máximo, Desviación Estándar, N
- Código de colores: Verde (alto), Naranja (medio), Rojo (bajo)
- Información completa para análisis profundo

#### 🏆 Vista Ranking
- Clasificación de fortalezas por rendimiento
- Barras de progreso visuales
- Badge con puntuación promedio
- Rango de valores y cantidad de jugadores

### 3. **Selección de Test Type**
Los entrenadores pueden cambiar entre:
- **IED**: 5 Dimensiones (Inteligencia Emocional Deportiva)
- **IPED**: 8 Dimensiones (Inteligencia Psicológica del Deportista)

### 4. **Codificación de Colores**
- **Verde (#4caf50)**: Fortaleza alta (promedio > 3.5)
- **Naranja (#ff9800)**: Fortaleza media (2.5 < promedio ≤ 3.5)
- **Rojo (#f44336)**: Fortaleza baja (promedio ≤ 2.5)

## 🛠️ Componentes Implementados

### `EstadisticasGrupo.jsx`
Componente principal que:
- Carga resultados de todos los futbolistas asociados
- Calcula estadísticas agregadas
- Proporciona interfaz de usuario para las tres vistas
- Integra gráficos Chart.js

### `estadisticasService.js`
Servicio con funciones clave:
- `calcularEstadisticasGrupo()`: Agregación de datos
- `clasificarNivel()`: Clasificación de niveles
- `prepararDatosGrafico()`: Preparación de datos para Chart.js

### `EstadisticasGrupo.module.css`
Estilos completos:
- Diseño responsive
- Animaciones suaves
- Tablas e información estructurada
- Barras de progreso visuales
- Compatibilidad móvil

## 📱 Integración en DashboardEntrenador

### Ubicación
Panel derecho del dashboard, cuando NO hay un futbolista seleccionado.

### Controles
- Tabs IED/IPED para seleccionar tipo de test
- Botones de vista (Gráfico, Tabla, Ranking)
- Información de resumen en la parte superior

### Comportamiento
```
Dashboard Entrenador
├── Futbolista NO seleccionado
│   └── Mostrar EstadisticasGrupo
│       ├── Cargar resultados de todos los futbolistas
│       ├── Calcular estadísticas
│       └── Mostrar con vistas seleccionables
└── Futbolista SÍ seleccionado
    └── Mostrar DetalleJugador
```

## 🔄 Flujo de Datos

```
1. DashboardEntrenador carga futbolistas
2. Usuario selecciona IED o IPED
3. EstadisticasGrupo inicia carga de resultados
4. Para cada futbolista:
   └─ Fetch: GET /api/tests/futbolista/{id}/resultados
5. Procesa todos los resultados con estadisticasService
6. Calcula promedios, rangos, desviaciones
7. Prepara datos para visualización
8. Usuario cambia de vista (Gráfico, Tabla, Ranking)
```

## 📊 Formato de Datos

### Estadísticas por Fortaleza
```javascript
{
  promedio: 3.75,        // Promedio grupal
  minimo: 2.5,          // Puntuación mínima
  maximo: 4.8,          // Puntuación máxima
  desviacion: 0.84,     // Desviación estándar
  cantidad: 15          // Número de jugadores con datos
}
```

### Resultado de calcularEstadisticasGrupo()
```javascript
{
  tipoTest: 'IED',
  totalFutbolistas: 15,
  promedioGeneral: 3.62,
  fortalezas: {
    percepcion_emocional: { promedio: 3.8, ... },
    autorregulacion: { promedio: 3.5, ... },
    // ... más fortalezas
  },
  fortalezasOrdenadas: ['percepcion_emocional', 'habilidades_sociales', ...]
}
```

## ⚙️ Configuración

### Variables de Entorno
No requiere configuración especial. Usa:
- Token de autenticación del localStorage
- ID de futbolistas del estado de React
- URLs de API existentes

### Requisitos del Backend
Debe estar disponible el endpoint:
```
GET /api/tests/futbolista/{futbolistaId}/resultados
Headers: Authorization: Bearer {token}
Response: Array de resultados con estructura:
{
  tipoTest: 'IED',
  fecha: '2024-12-07',
  puntajes: { fortaleza: puntuacion }
}
```

## 🐛 Manejo de Errores

### Casos Manejados
- Futbolistas sin resultados → No se incluyen en estadísticas
- Errores de carga → Se registran en consola, se continúa con otros
- Test type sin datos → Mensaje "No hay datos disponibles"
- Futbolistas vacío → Mensaje informativo

### Logs de Consola
- Carga de resultados de cada futbolista
- Errores HTTP con detalles
- Confirmación de cálculos finales

## 🎨 Diseño Visual

### Tema de Colores
- **Principal**: Verde #1abc53 (IED)
- **Secundario**: Púrpura #6a4fff (IPED)
- **Éxito**: Verde #4caf50
- **Advertencia**: Naranja #ff9800
- **Error**: Rojo #f44336
- **Fondo**: Gradiente azul suave

### Responsive Design
- ✅ Desktop (1200px+)
- ✅ Tablet (768px - 1199px)
- ✅ Móvil (<768px)

## 📈 Ejemplo de Uso

```jsx
// En DashboardEntrenador
<EstadisticasGrupo 
  futbolistas={futbolistas}  // Array de futbolistas cargados
  testType={testTypeEstadisticas}  // 'IED' o 'IPED'
/>
```

## 🚀 Mejoras Futuras

Posibles expansiones:
1. Exportar datos a CSV/PDF
2. Comparativa histórica mes a mes
3. Alertas de fortalezas críticas (< 2.0)
4. Gráficos de distribución (histogramas)
5. Análisis de variabilidad del grupo
6. Predicciones de progreso
7. Benchmarking contra grupos anteriores

## 📝 Notas de Desarrollo

- No requiere endpoint nuevo en backend
- Usa endpoints existentes de forma optimizada
- Implementación puramente frontend de agregación
- Performance optimizada con Promise.all()
- Charts.js para visualización profesional

---

**Fecha de implementación**: 7 de diciembre de 2024
**Versión**: 1.0
**Estado**: Producción ✅
