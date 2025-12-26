# 🧠 MindSport - Plataforma de Evaluación Psicológica Deportiva

## 📋 Descripción General

**MindSport** es una plataforma web full-stack que integra tests psicológicos validados (**IED** e **IPED**) para evaluar y fortalecer habilidades mentales de futbolistas jóvenes en contexto formativo chileno.

En el fútbol juvenil, existe una **brecha crítica entre talento técnico y consolidación profesional** debido a factores psicológicos insuficientemente abordados. La ansiedad precompetitiva, falta de resiliencia y problemas emocionales impactan directamente el rendimiento y permanencia de los jugadores.

Esta plataforma proporciona:
- ✅ Evaluaciones psicológicas estructuradas y validadas
- ✅ Resultados categorizados (Bajo/Medio/Alto)
- ✅ Recomendaciones personalizadas basadas en desempeño
- ✅ Monitoreo temporal del progreso psicológico
- ✅ Estadísticas grupales para entrenadores

Diseñada para ser **accesible en clubes formativos sin psicólogos permanentes**.

---

## 🎯 Contexto y Problemática

### Situación Actual
El fútbol formativo chileno prioriza lo técnico/físico, dejando en segundo plano la **salud mental**. Incluso profesionalmente, solo la mitad de los clubes tienen psicólogo permanente (SIFUP 2024).

Los futbolistas jóvenes enfrentan:
- 😰 Presión y ansiedad sin herramientas psicológicas sistemáticas
- 📉 Frustración y falta de resiliencia
- 🏠 Estrés emocional al dejar sus hogares para clubes alejados

### Problemática Identificada

**Técnicamente:**
- ❌ Falta de instrumentos digitales accesibles para evaluar inteligencia emocional deportiva
- ❌ Entrenadores sin datos cuantitativos para decisiones formativas
- ❌ Ausencia de seguimiento temporal de fortalezas psicológicas

**Causas raíz:**
- Escasez de psicólogos en la mayoría de los clubes
- Priorización técnica sobre mental
- Falta de herramientas digitales validadas

---

## 🎓 Objetivos del Proyecto

### Objetivo General
*"Desarrollar MindSport, plataforma web que permite a futbolistas jóvenes chilenos conocerse mentalmente mediante tests validados (IED/IPED), recibir recomendaciones personalizadas y monitorear su progreso emocional, abordando la brecha de apoyo psicológico en clubes formativos sin psicólogos permanentes."*

### Objetivos Específicos

1. ✅ Implementar autenticación JWT segura con roles diferenciados (futbolista/entrenador)
2. ✅ Desplegar tests psicológicos validados:
   - **IED**: 32 preguntas / 4 dimensiones de inteligencia emocional deportiva
   - **IPED**: 42 preguntas / 7 dimensiones psicológicas deportivas
   - Escala Likert 1-5 en todos los ítems
3. ✅ Calcular puntajes por fortaleza con categorías:
   - **Bajo**: < 2.51
   - **Medio**: 2.51 - 3.50
   - **Alto**: > 3.50
4. ✅ Generación de recomendaciones personalizadas según nivel de desempeño
5. ✅ Proveer histórico individual y estadísticas grupales para entrenadores

---

## 📊 Tests Psicológicos Integrados

### IED (Inteligencia Emocional Deportiva)
Evalúa 4 dimensiones clave:
1. **Percepción Emocional** - Capacidad de reconocer emociones propias
2. **Gestión Autoemocional** - Control de emociones personales
3. **Gestión Heteroemocional** - Empatía y manejo de emociones ajenas
4. **Utilización Emocional** - Uso de emociones para mejorar rendimiento

### IPED (Inteligencia Psicosocial Emocional Deportiva)
Evalúa 7 dimensiones psicológicas:
1. **Autoconfianza** - Seguridad en capacidades
2. **Control Afrontamiento Negativo** - Manejo de situaciones adversas
3. **Control Atencional** - Concentración y enfoque
4. **Control Visuo-Imaginativo** - Visualización y mentalización
5. **Nivel Motivacional** - Impulso y determinación
6. **Control Afrontamiento Positivo** - Resilencia y adaptabilidad
7. **Control Actitudinal** - Actitud mental competitiva

---

## 🏗️ Arquitectura Técnica

### Stack Tecnológico

**Frontend:**
- React 18.x - Interfaz moderna e interactiva
- React Router v6 - Navegación declarativa
- Chart.js - Visualización avanzada de datos
- CSS Modules - Estilos encapsulados y mantenibles

**Backend:**
- Java 17 - Lenguaje robusto y escalable
- Spring Boot 3.5.6 - Framework MVC moderno
- MongoDB Atlas - Base de datos NoSQL en la nube
- JWT (JSON Web Tokens) - Autenticación segura

**Infraestructura:**
- Variables de entorno para credenciales sensibles
- Validación de datos en cliente y servidor
- Cifrado de contraseñas con BCrypt

---

## 📱 Características por Rol

### Para Futbolistas
- ✅ Registro e inicio de sesión seguro
- ✅ Realizar tests IED e IPED completos
- ✅ Ver resultados detallados con categorización por fortaleza
- ✅ Recibir recomendaciones personalizadas de mejora
- ✅ Visualizar gráficos de progreso temporal
- ✅ Biblioteca educativa de fortalezas psicológicas
- ✅ Seguimiento con entrenador asignado

### Para Entrenadores
- ✅ Gestión completa de futbolistas asociados
- ✅ Dashboard con estadísticas del grupo
- ✅ Visualización multi-vista: Gráfico, Tabla, Ranking
- ✅ Análisis individual detallado por jugador
- ✅ Notas y observaciones sobre progreso psicológico
- ✅ Seguimiento temporal de fortalezas del equipo
- ✅ Identificación de jugadores en riesgo

---

## 🔧 Instalación y Configuración

### Requisitos Previos
- Node.js 16+ y npm
- Java 17 y Maven
- MongoDB Atlas cuenta activa

### Frontend
```bash
cd .
npm install
npm start
```
La aplicación estará disponible en `http://localhost:3000`

### Backend
```bash
cd backend
mvn clean install
mvn spring-boot:run
```
El servidor estará disponible en `http://localhost:8080`

### Variables de Entorno
Crear archivo `backend/.env`:
```properties
MONGODB_URI=mongodb+srv://usuario:contraseña@cluster.mongodb.net/PROYECTO-TITLE
SERVER_PORT=8080
```

---

## 📡 Endpoints Principales API

### Autenticación
- `POST /api/auth/login` - Login futbolista/entrenador
- `POST /api/auth/register` - Registro de usuario

### Tests
- `POST /api/tests/guardar` - Guardar resultado de test
- `GET /api/tests/futbolista/{id}/resultados` - Obtener resultados de futbolista
- `GET /api/tests/{testId}` - Obtener detalles de un test

### Usuarios
- `GET /api/futbolista/perfil` - Perfil del futbolista
- `GET /api/usuarios/entrenador/{id}/futbolistas` - Futbolistas asociados
- `PUT /api/futbolista/{id}` - Actualizar información

### Estadísticas
- `GET /api/estadisticas/grupo/{entrenadorId}` - Estadísticas de grupo
- `GET /api/estadisticas/futbolista/{id}` - Estadísticas individual

---

## 📊 Estructura de Datos

### Documento Usuario
```javascript
{
  id: ObjectId,
  nombre: String,
  email: String,
  rol: "futbolista" | "entrenador",
  contraseña: String (cifrada),
  fechaCreacion: Date
}
```

### Documento Resultado Test
```javascript
{
  id: ObjectId,
  futbolistaId: ObjectId,
  tipoTest: "IED" | "IPED",
  fecha: Date,
  puntajes: {
    fortaleza1: Number,
    fortaleza2: Number,
    // ... más fortalezas
  },
  categorizacion: {
    fortaleza1: "Bajo" | "Medio" | "Alto",
    // ...
  }
}
```

---

## 🔐 Seguridad

✅ Contraseñas cifradas con BCrypt
✅ Autenticación JWT con tokens seguros
✅ Credenciales MongoDB en variables de entorno (.env)
✅ Validación de datos en cliente y servidor
✅ HTTPS recomendado en producción
✅ Control de acceso basado en roles (RBAC)

---

## 👤 Autor

**Luis Oyanedel Cortes**
- Desarrollo completo del proyecto
- Diseño UX/UI
- Integración de tests psicológicos validados

---

## 📅 Información del Proyecto

**Tipo:** Proyecto de Tesis - Seminario de Integración II
**Período:** Diciembre 2025
**Contexto:** Fútbol Formativo Chileno
**Audiencia:** Clubes formativos, futbolistas jóvenes, entrenadores

---

## 📚 Referencias

- **Prueba IED**: Validada para contexto deportivo
- **Prueba IPED**: Herramienta psicométrica reconocida
- **Contexto SIFUP 2024**: Datos de profesionalización en fútbol chileno

---

## 📝 Licencia

Proyecto académico - Derechos reservados 2025
