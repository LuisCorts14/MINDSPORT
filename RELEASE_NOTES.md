# MINDSPORT - Release Notes

## Versión 1.0.0 - Diciembre 2024

### 🎯 Objetivo del Proyecto
Plataforma integral de evaluación psicológica deportiva para futbolistas y entrenadores.

### ✨ Características Implementadas

#### Frontend (React)
- ✅ Sistema de autenticación (futbolista/entrenador)
- ✅ Tests psicométricos IED (4 dimensiones) e IPED (7 dimensiones)
- ✅ Visualización de resultados con recomendaciones
- ✅ Dashboard del futbolista con gráficos de progreso
- ✅ Dashboard del entrenador con gestión de futbolistas
- ✅ Estadísticas del grupo (Gráfico, Tabla, Ranking)
- ✅ Sistema de notas y seguimiento
- ✅ Interfaz responsive y profesional

#### Backend (Spring Boot)
- ✅ API REST con autenticación JWT
- ✅ Integración MongoDB Atlas
- ✅ Endpoints de tests, resultados y gestión de usuarios
- ✅ Sistema de roles (futbolista/entrenador)
- ✅ Encriptación de contraseñas con BCrypt
- ✅ Validaciones y manejo de errores

### 📊 Métricas del Proyecto
- **Duración**: 15 semanas (3 sprints de 5 semanas)
- **Funcionalidades**: 16+ user stories implementadas
- **Tests**: 2 instrumentos psicométricos (IED/IPED)
- **Usuarios**: Futbolistas y Entrenadores
- **Completitud**: 100% (16/16 historias)

### 🔧 Stack Tecnológico
- Frontend: React 18.x, React Router v6, Chart.js, CSS Modules
- Backend: Java 17, Spring Boot 3.5.6, MongoDB, JWT
- DevOps: Git, GitHub

### 🚀 Cómo Usar

#### Frontend
\\\ash
cd frontend
npm install
npm start
\\\

#### Backend
\\\ash
cd backend
mvn clean install
mvn spring-boot:run
\\\

### 📝 Notas Importantes
- La plataforma utiliza MongoDB Atlas para almacenamiento en la nube
- Las contraseñas se encriptan con BCrypt
- La autenticación utiliza JWT tokens de 24 horas
- Los datos de preguntas en los tests son inmutables

### 🔗 Repositorio
https://github.com/LuisCorts14/MINDSPORT

### 👥 Autor
Luis Oyanedel Cortes

### 📅 Fecha de Release
Diciembre 8, 2024
