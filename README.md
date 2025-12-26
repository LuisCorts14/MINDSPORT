# MINDSPORT - Plataforma de Evaluación Psicológica Deportiva

## 📋 Descripción

MINDSPORT es una plataforma integral para evaluar competencias psicológicas en deportistas, utilizando dos instrumentos psicométricos:

- **IED (Inteligencia Emocional Deportiva)**: 4 dimensiones
- **IPED (Inteligencia Psicológica del Deportista)**: 7 dimensiones

## 🏗️ Estructura del Proyecto

```
MINDSPORT/
├── frontend/          # Aplicación React
├── backend/           # API Spring Boot
└── README.md
```

## 🚀 Stack Tecnológico

### Frontend
- React 18.x
- React Router v6
- Chart.js para gráficos
- CSS Modules

### Backend
- Java 17
- Spring Boot 3.5.6
- MongoDB Atlas
- JWT para autenticación

## 📱 Características Principales

### Para Futbolistas
- ✅ Registro e inicio de sesión
- ✅ Realizar tests IED e IPED
- ✅ Ver resultados detallados con recomendaciones
- ✅ Gráficos de progreso temporal

### Para Entrenadores
- ✅ Gestión de futbolistas asociados
- ✅ Dashboard con estadísticas del grupo
- ✅ Visualización: Gráfico, Tabla, Ranking
- ✅ Notas y seguimiento de jugadores

## 🔧 Instalación

### Frontend
```bash
cd frontend
npm install
npm start
```

### Backend
```bash
cd backend
mvn clean install
mvn spring-boot:run
```

## 📊 Endpoints Principales

- `GET /api/tests/futbolista/{id}/resultados` - Resultados de un futbolista
- `POST /api/tests/guardar` - Guardar nuevo resultado
- `GET /api/usuarios/entrenador/{id}/futbolistas` - Futbolistas asociados

## 👥 Autor

- Luis Oyanedel Cortes (Desarrollo completo)

## 📅 Fecha de Desarrollo

Desarrollado como proyecto de tesis - Diciembre 2025
