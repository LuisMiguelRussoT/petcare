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

## Probar la API con cURL

```bash
# Registrar
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","password":"123456"}'

# Login (guarda el token del response)
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"123456"}'

# Crear registro (reemplaza TOKEN)
curl -X POST http://localhost:5000/api/medical-records \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"petName":"Max","petType":"Dog","petSize":"Big","ownerName":"Test","description":"","vaccinations":[]}'
```

---

## Documentación

| Documento | Descripción |
|-----------|-------------|
| [README.md](README.md) | Descripción general del proyecto |
| [API_TESTING.md](API_TESTING.md) | Endpoints con ejemplos completos |
| [DESIGN_PATTERNS.md](DESIGN_PATTERNS.md) | Arquitectura y patrones |
| [ERD_DOCUMENTATION.md](ERD_DOCUMENTATION.md) | Esquema de base de datos |
| [TECHNICAL_SUMMARY.md](TECHNICAL_SUMMARY.md) | Resumen del stack y requisitos |
