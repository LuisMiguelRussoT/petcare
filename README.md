# ReWow Pet Care

Sistema de gestión de registros médicos para mascotas. Permite a los dueños registrarse, iniciar sesión y administrar el historial médico y de vacunación de sus mascotas.

## Estructura del proyecto

```
petcare/
├── backend/    # API REST — Node.js + Express + PostgreSQL
└── frontend/   # Interfaz de usuario — React
```

## Requisitos

- Node.js 18+
- PostgreSQL 14+

## Inicio rápido

### 1. Base de datos

```bash
psql -U postgres -h localhost
```

```sql
CREATE DATABASE rewow_petcare;
\c rewow_petcare
\i backend/database/schema.sql
```

O con DBeaver: nueva conexión PostgreSQL (host: localhost, port: 5432, user: postgres), luego ejecuta el contenido de `backend/database/schema.sql`.

### 2. Backend

```bash
cd backend
cp .env.example .env   # completar las variables de entorno
npm install
npm run dev
```

Deberías ver `Server running on port 5000`.

### 3. Frontend

En otra terminal:

```bash
cd frontend
npm install
npm start
```

Se abre en `http://localhost:3000`.

---

## Prueba básica

1. Regístrate con nombre, email y contraseña
2. Inicia sesión
3. Crea un registro médico con "New Medical Record"
4. Verifica que aparece en la tabla y que puedes editarlo o eliminarlo

---

## Documentación

| Recurso | Descripción |
|---------|-------------|
| `http://localhost:5000/api/docs` | Swagger UI — probar los endpoints de la API |
| `backend/docs/index.html` | JSDoc — documentación del código fuente (generar con `npm run docs`) |
| [backend/README.md](backend/README.md) | Detalle del backend: estructura, endpoints y scripts |
| [frontend/README.md](frontend/README.md) | Detalle del frontend: estructura y scripts |

---

## Problemas comunes

**"connection refused on port 5432"** — PostgreSQL no está corriendo.
- Windows: Services → PostgreSQL → Start
- macOS: `brew services start postgresql`
- Linux: `sudo systemctl start postgresql`

**"password authentication failed"** — Revisa `DB_PASSWORD` en `backend/.env`.

**"Database does not exist"** — Ejecuta el script `schema.sql` como se indica en el paso 1.

**Puerto 5000 ocupado** — Cambia `PORT=5001` en `backend/.env`.

**Puerto 3000 ocupado** — Inicia con `PORT=3001 npm start`.
