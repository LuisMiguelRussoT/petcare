# Inicio Rápido

## 1. Base de datos

Abre psql y ejecuta:

```bash
psql -U postgres -h localhost
```

```sql
CREATE DATABASE rewow_petcare;
\c rewow_petcare
\i backend/database/schema.sql
```

O con DBeaver: nueva conexión PostgreSQL (host: localhost, port: 5432, user: postgres), luego ejecuta el contenido de `backend/database/schema.sql`.

## 2. Backend

```bash
cd backend
npm install
npm run dev
```

Deberías ver `Server running on port 5000`.

## 3. Frontend

En otra terminal:

```bash
cd frontend
npm install
npm start
```

Se abre en `http://localhost:3000`.

---

## Prueba básica

1. Registrate con nombre, email y contraseña
2. Inicia sesión
3. Crea un registro médico con "New Medical Record"
4. Verifica que aparece en la tabla y que puedes editarlo o eliminarlo

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

---

## Documentación adicional

| Documento | Descripción |
|-----------|-------------|
| [Resumen Técnico](additional_documents/TECHNICAL_SUMMARY.md) | Requisitos completados y visión general del proyecto |
| [Esquema de Base de Datos](additional_documents/ERD_DOCUMENTATION.md) | Tablas, relaciones y estructura del esquema |
| [Patrones de Diseño](additional_documents/DESIGN_PATTERNS.md) | Arquitectura y patrones utilizados en el código |
| [Guía de Pruebas de API](additional_documents/API_TESTING.md) | Cómo probar los endpoints con Postman, Thunder Client o curl |

