# Resumen Técnico - ReWow Pet Care

## Requisitos completados

1. **Diagrama Entidad-Relación** — 3 tablas relacionadas (owners, medical_records, vaccinations) con relaciones 1:N y cascading deletes. Ver [ERD_DOCUMENTATION.md](ERD_DOCUMENTATION.md).

2. **Base de datos PostgreSQL** — Script completo en `backend/database/schema.sql`. Incluye ENUMs para tipo y tamaño de mascota, índices en las columnas de búsqueda frecuente.

3. **CRUD de Medical Record** — Endpoints completos en `/api/medical-records` (GET, POST, PUT, DELETE). Cada operación valida que el registro pertenece al usuario autenticado.

4. **Login/Logout** — Registro con email único, login con JWT (24h), logout limpiando el token del localStorage.

5. **Menú completo** — Navbar con el nombre del usuario y botón de logout, dashboard con tabla de registros, formulario para crear y editar.

6. **Campos de Medical Record**:
   - Pet Owner Name
   - Pet Name
   - Pet Type (select: Cat, Dog, Fish, Other)
   - Size (radio buttons: Small, Medium, Big)
   - Description (textarea)
   - Vacunaciones (lista dinámica con número, tipo y fecha)

---

## Stack tecnológico

### Backend
- **Node.js** + **Express** — servidor REST
- **pg** — driver PostgreSQL
- **bcryptjs** — hash de contraseñas
- **jsonwebtoken** — autenticación JWT
- **cors** — permite peticiones desde el frontend
- **dotenv** — variables de entorno

### Frontend
- **React 18** — interfaz de usuario
- **React Router DOM** — navegación cliente
- **Axios** — cliente HTTP con interceptor para el token
- **CSS nativo** — estilos responsivos

### Base de datos
- **PostgreSQL 14+**

---

## Archivos principales

```
backend/
  src/config/database.js        ← pool de conexión PostgreSQL
  src/controllers/authController.js         ← register y login
  src/controllers/medicalRecordController.js ← CRUD de registros
  src/middleware/auth.js        ← validación JWT
  src/routes/auth.js            ← rutas de autenticación
  src/routes/medicalRecords.js  ← rutas de registros
  src/server.js                 ← punto de entrada
  database/schema.sql           ← esquema PostgreSQL

frontend/
  src/components/Login.js             ← login y registro
  src/components/Dashboard.js         ← vista principal
  src/components/MedicalRecordForm.js ← formulario CRUD
  src/components/MedicalRecordList.js ← tabla de registros
  src/services/api.js                 ← cliente HTTP
```
