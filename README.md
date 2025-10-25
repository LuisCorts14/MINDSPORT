# mindsport — Frontend

🌟 Resumen

mindsport es una aplicación frontend en React para la evaluación y seguimiento de futbolistas y entrenadores. Proporciona formularios de autenticación, dashboards diferenciados por rol (futbolista / entrenador), visualización de progreso y gestión de futbolistas por parte del entrenador.

Lo más destacado:
- Interfaz de login y registro para `futbolista` y `entrenador`.
- Dashboards separados: vista personal para futbolistas y panel de gestión para entrenadores.
- Gráficos de progreso y resultados de tests (IED / IPED).
- Integración con un backend Spring Boot (endpoints REST protegidos con JWT).

---

## Tabla de contenidos

1. Descripción
2. Destinatarios
3. Instalación (desarrollo)
4. Uso básico
5. Rutas principales y navegación
6. Componentes clave (props, estados, hooks)
7. Interacción con el backend (endpoints)
8. Manejo de autenticación y localStorage
9. Depuración y errores comunes
10. Contribuir
11. Autor

---

## 1. Descripción

Este repositorio contiene el frontend de mindsport desarrollado en React. Su objetivo es permitir a futbolistas realizar tests psicológicos/psicométricos y a entrenadores gestionar futbolistas, visualizar sus progresos y asignaciones.

El frontend asume un backend REST (por ejemplo, Spring Boot) que expone endpoints para registro, login y recursos protegidos que requieren un JWT en la cabecera `Authorization: Bearer <token>`.

## 2. Destinatarios

Este README está pensado para:
- Desarrolladores que quieren ejecutar o extender el frontend.
- Integradores backend que deben conocer los endpoints usados por la UI.
- Evaluadores que quieran entender el flujo de autenticación y roles.

---

## 3. Instalación (desarrollo)

Requisitos mínimos:
- Node.js 14+ y npm o Yarn.

Pasos rápidos:

```powershell
# clonar el repositorio
git clone <tu-repo-url>
cd mindsport

# instalar dependencias
npm install

# iniciar la app en modo desarrollo
npm start
```

La aplicación por defecto se sirve en http://localhost:3000. Asegúrate de que tu backend (Spring Boot) esté escuchando en http://localhost:8080 (o ajusta las URLs en el código).

---

## 4. Uso básico

Puntos principales:
- Regístrate como futbolista en la vista `LoginFutbolista` (registro) o usa el login para entrar.
- Tras el login exitoso se guarda en `localStorage` un objeto `userData` con { id, nombre, rol, token, codigoUnico? } y se navega a `/dashboard`.
- Si el usuario es entrenador, accederá al panel de entrenador (`DashboardEntrenador`) con funcionalidades para ver y gestionar futbolistas.

Ejemplo de login (cliente):

```javascript
// payload de login
const payload = { email, password, requestedRole: 'futbolista' };
const res = await fetch('http://localhost:8080/api/usuarios/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(payload),
});
const text = await res.text();
const result = text ? JSON.parse(text) : null;
if (res.ok) {
  localStorage.setItem('userData', JSON.stringify({
    id: result.id, nombre: result.nombre, rol: result.rol, token: result.token
  }));
}
```

---

## 5. Rutas principales y navegación

Rutas típicas del proyecto:

- `/` — Home
- `/login-futbolista` — Login / registro futbolista (componente `LoginFutbolista`)
- `/login-entrenador` — Login / registro entrenador (componente `LoginEntrenador`)
- `/dashboard` — Dashboard principal (ruta protegida por `PrivateRoute`)

La navegación se realiza con React Router. Las rutas protegidas usan `PrivateRoute` para validar `userData` y token; en caso de ausencia se redirige al login.

---

## 6. Componentes clave (resumen técnico)

A continuación se listan los componentes funcionales más importantes y su contrato mínimo.

- `AuthForm` (src/components/AuthForm.jsx)
  - Props: `mode` (string), `color` (string), `onSubmit` (func)
  - Estado: campos del formulario, `isRegister` (boolean)
  - Eventos: llama `onSubmit(formValues, isRegister)`

- `LoginFutbolista` (src/pages/LoginFutbolista.jsx)
  - Props: —
  - Estado: `error` (string|null)
  - Hooks: `useState`, `useNavigate`
  - Función clave: `handleAuthSubmit(data, isRegister)` -> POST a `/api/usuarios/register` o `/api/usuarios/login`.

- `PrivateRoute` (src/components/PrivateRoute.jsx)
  - Props: `children`, `requiredRole`? (opcional)
  - Comportamiento: valida `localStorage.userData` y `token`; redirige si no está autenticado o no tiene rol.

- `DashboardEntrenador` (src/pages/DashboardEntrenador.jsx)
  - Estado: `user`, `futbolistas`, `selectedJugador`, `errorPerfil`, `mostrarConfiguracion`, entre otros.
  - Hooks: `useState`, `useEffect`
  - Interacción backend: GET `/api/entrenador/perfil`, GET `/api/entrenador/futbolistas` (headers: Authorization Bearer)

Para un detalle línea a línea, revisa cada archivo en `src/pages` y `src/components`.

---

## 7. Interacción con el backend (endpoints usados)

Resumen de endpoints que el frontend consume:

- Registro: POST `http://localhost:8080/api/usuarios/register`
  - Body: `{ nombre, email, password, rol }` (ej. rol = 'futbolista')
  - Respuestas: 201 Created (usuario creado) o 4xx/5xx con JSON `{ error: '...' }`

- Login: POST `http://localhost:8080/api/usuarios/login`
  - Body: `{ email, password, requestedRole? }`
  - Respuesta esperada: `{ id, nombre, rol, token, codigoUnico? }` (200 OK) o 4xx con `{ error: '...' }`.

- Perfil entrenador: GET `http://localhost:8080/api/entrenador/perfil`
  - Headers: `Authorization: Bearer <token>`
  - Uso: obtener id/metadata del entrenador

- Futbolistas asociados: GET `http://localhost:8080/api/entrenador/futbolistas`
  - Headers: `Authorization: Bearer <token>`

Observaciones:
- Siempre usar `Content-Type: application/json` en POST.
- En endpoints protegidos, incluir `Authorization: Bearer <token>` tal como se guarda en `localStorage`.

---

## 8. Manejo de autenticación y localStorage

- Guardado: tras login correcto, se almacena en `localStorage` la clave `userData` con el objeto del usuario. Ejemplo:

```json
{
  "id": 12,
  "nombre": "Juan",
  "rol": "futbolista",
  "token": "<JWT_TOKEN>",
  "codigoUnico": "ABC123"
}
```

- Uso: componentes protegidos leen `userData` y usan `user.token` para Authorization.
- Logout: remover `userData` de `localStorage` y redirigir al login.

Recomendaciones de seguridad:
- Considera usar cookies HttpOnly para el token en lugar de `localStorage` para mitigar riesgos XSS.
- Implementa manejo de expiración del token y refresh tokens.

---

## 9. Depuración y errores comunes

- Error al parsear JSON: `Unexpected end of JSON input` — ocurre al llamar `res.json()` sobre respuestas sin cuerpo (204) o vacías. Solución: leer `res.text()` y parsear sólo si no está vacío.

- 401 / 403 en `/api/entrenador/perfil` — indica token inválido/expirado o rol no autorizado. Verifica:
  - que `userData` contiene `token`
  - que `Authorization` se envía: `Bearer <token>`
  - logs del backend para el motivo del 403

- 403 en `/api/usuarios/register` — posibles causas: endpoint protegido por backend (requiere admin) o validaciones fallidas. Asegúrate que el endpoint público sea `/api/usuarios/register` y que envíes el body esperado.

Herramientas útiles:
- DevTools → Network para inspeccionar Request headers/payload/response.
- curl/Postman para reproducir peticiones y aislar frontend/backend.




hola
