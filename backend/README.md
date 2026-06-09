# ReWow Pet Care — Backend

API REST construida con Node.js, Express y PostgreSQL.

## Tecnologías

- **Express** — servidor HTTP
- **PostgreSQL** + **pg** — base de datos relacional
- **bcryptjs** — hash de contraseñas
- **jsonwebtoken** — autenticación JWT
- **swagger-ui-express** — documentación interactiva de la API
- **jsdoc** — documentación del código fuente

## Estructura

```
src/
├── config/
│   ├── database.js     # Conexión al pool de PostgreSQL
│   └── swagger.js      # Configuración de OpenAPI
├── dtos/
│   ├── auth.dto.js             # RegisterDto, LoginDto
│   └── medicalRecord.dto.js    # CreateMedicalRecordDto, UpdateMedicalRecordDto
├── models/
│   ├── Owner.js            # Queries sobre la tabla owners
│   ├── MedicalRecord.js    # Queries sobre medical_records
│   └── Vaccination.js      # Queries sobre vaccinations
├── controllers/
│   ├── authController.js           # register, login
│   └── medicalRecordController.js  # CRUD de registros médicos
├── middleware/
│   └── auth.js     # Verificación de JWT
├── routes/
│   ├── auth.js             # POST /api/auth/register, /api/auth/login
│   └── medicalRecords.js   # CRUD /api/medical-records
└── server.js
```

## Variables de entorno

Copiar `.env.example` a `.env` y completar:

```
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=rewow_petcare
DB_PORT=5432
JWT_SECRET=your_jwt_secret_key_here
PORT=5000
```

## Scripts

```bash
npm run dev    # Servidor en modo desarrollo con nodemon
npm start      # Servidor en producción
npm run docs   # Genera documentación JSDoc en /docs
```

## Endpoints

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| POST | `/api/auth/register` | No | Registrar usuario |
| POST | `/api/auth/login` | No | Login, retorna JWT |
| GET | `/api/medical-records` | Sí | Listar registros del usuario |
| POST | `/api/medical-records` | Sí | Crear registro médico |
| GET | `/api/medical-records/:id` | Sí | Obtener un registro |
| PUT | `/api/medical-records/:id` | Sí | Actualizar registro |
| DELETE | `/api/medical-records/:id` | Sí | Eliminar registro |
| GET | `/api/docs` | No | Swagger UI |
| GET | `/api/health` | No | Health check |

## Documentación

- **Swagger UI** (endpoints): `http://localhost:5000/api/docs`
- **JSDoc** (código fuente): ejecutar `npm run docs`, luego abrir `docs/index.html`
