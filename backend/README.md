# ReWow Pet Care — Backend

API REST para la gestión de registros médicos de mascotas. Construida con Node.js, Express y PostgreSQL.

---

## Tabla de contenidos

- [Tecnologías](#tecnologías)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Base de datos](#base-de-datos)
- [Variables de entorno](#variables-de-entorno)
- [Scripts](#scripts)
- [Arquitectura](#arquitectura)
- [DTOs](#dtos)
- [Models](#models)
- [Controllers](#controllers)
- [Rutas y endpoints](#rutas-y-endpoints)
- [Autenticación](#autenticación)
- [Documentación interactiva (Swagger)](#documentación-interactiva-swagger)

---

## Tecnologías

| Paquete | Versión | Uso |
|---------|---------|-----|
| express | ^4.18.2 | Servidor HTTP |
| pg | ^8.11.0 | Cliente PostgreSQL |
| bcryptjs | ^2.4.3 | Hash de contraseñas |
| jsonwebtoken | ^9.0.2 | Autenticación JWT |
| dotenv | ^16.3.1 | Variables de entorno |
| swagger-jsdoc | ^6.3.0 | Generación de spec OpenAPI |
| swagger-ui-express | ^5.0.1 | UI interactiva para la API |
| nodemon | ^3.0.1 | Recarga automática en desarrollo |

---

## Estructura del proyecto

```
backend/
├── database/
│   └── schema.sql              # Script de creación de tablas y ENUMs
├── src/
│   ├── config/
│   │   ├── database.js         # Pool de conexión a PostgreSQL
│   │   └── swagger.js          # Configuración OpenAPI 3.0
│   ├── dtos/
│   │   ├── auth.dto.js         # RegisterDto, LoginDto
│   │   └── medicalRecord.dto.js # CreateMedicalRecordDto, UpdateMedicalRecordDto
│   ├── models/
│   │   ├── Owner.js            # Queries sobre la tabla owners
│   │   ├── MedicalRecord.js    # Queries sobre medical_records
│   │   └── Vaccination.js      # Queries sobre vaccinations
│   ├── controllers/
│   │   ├── authController.js           # register, login
│   │   └── medicalRecordController.js  # CRUD registros médicos
│   ├── middleware/
│   │   └── auth.js             # Verificación de JWT
│   ├── routes/
│   │   ├── auth.js             # /api/auth/*
│   │   └── medicalRecords.js   # /api/medical-records/*
│   └── server.js               # Entry point
├── .env.example
└── package.json
```

---

## Base de datos

### Crear la base de datos

```sql
CREATE DATABASE rewow_petcare;
```

### Ejecutar el schema

```bash
psql -U postgres -d rewow_petcare -f database/schema.sql
```

### Diagrama de tablas

```
owners
├── id           SERIAL PK
├── name         VARCHAR(100)
├── email        VARCHAR(100) UNIQUE
├── password     VARCHAR(255)
├── created_at   TIMESTAMP
└── updated_at   TIMESTAMP

medical_records
├── id           SERIAL PK
├── owner_id     INT FK → owners.id (CASCADE)
├── pet_name     VARCHAR(100)
├── pet_type     ENUM('Cat','Dog','Fish','Other')
├── pet_size     ENUM('Small','Medium','Big')
├── owner_name   VARCHAR(100)
├── description  TEXT
├── created_at   TIMESTAMP
└── updated_at   TIMESTAMP

vaccinations
├── id                   SERIAL PK
├── medical_record_id    INT FK → medical_records.id (CASCADE)
├── vaccination_number   INT
├── vaccination_type     VARCHAR(100)
├── vaccination_date     DATE
└── created_at           TIMESTAMP
```

---

## Variables de entorno

Copiar `.env.example` a `.env` y completar los valores:

```env
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=rewow_petcare
DB_PORT=5432
JWT_SECRET=your_jwt_secret_key_here
PORT=5000
NODE_ENV=development
```

---

## Scripts

```bash
npm run dev    # Servidor en modo desarrollo con nodemon (puerto 5000)
npm start      # Servidor en producción
```

---

## Arquitectura

El proyecto sigue una arquitectura en capas:

```
Request → Route → Middleware → Controller → DTO → Model → PostgreSQL
```

| Capa | Responsabilidad |
|------|----------------|
| **Route** | Define los endpoints y aplica middleware |
| **Middleware** | Verifica el JWT antes de llegar al controller |
| **Controller** | Orquesta el flujo: valida DTO, llama al model, responde |
| **DTO** | Extrae y valida los campos del `req.body` |
| **Model** | Ejecuta las queries SQL contra PostgreSQL |

---

## DTOs

Los DTOs encapsulan los datos que llegan del cliente (`req.body`) y exponen un método `isValid()` para validar campos requeridos.

### `auth.dto.js`

**RegisterDto**

| Campo | Tipo | Requerido |
|-------|------|-----------|
| name | string | Sí |
| email | string | Sí |
| password | string | Sí |

**LoginDto**

| Campo | Tipo | Requerido |
|-------|------|-----------|
| email | string | Sí |
| password | string | Sí |

### `medicalRecord.dto.js`

**CreateMedicalRecordDto**

| Campo | Tipo | Requerido | Default |
|-------|------|-----------|---------|
| petName | string | Sí | — |
| petType | string | Sí | — |
| petSize | string | Sí | — |
| ownerName | string | Sí | — |
| description | string | No | `''` |
| vaccinations | array | No | `[]` |

**UpdateMedicalRecordDto**

Mismos campos que `CreateMedicalRecordDto`. Si `vaccinations` no se envía, se deja `null` y las vacunas existentes no se modifican.

---

## Models

Los models encapsulan todas las queries SQL. Reciben parámetros y devuelven el resultado del pool de PostgreSQL.

### `Owner.js`

| Método | Descripción |
|--------|-------------|
| `findByEmail(email)` | Busca un owner por email |
| `create(name, email, hashedPassword)` | Inserta un nuevo owner |

### `MedicalRecord.js`

| Método | Descripción |
|--------|-------------|
| `create(ownerId, dto)` | Inserta un registro médico, retorna el `id` generado |
| `findAllByOwner(ownerId)` | Lista todos los registros del owner ordenados por fecha |
| `findById(id, ownerId)` | Obtiene un registro validando que pertenezca al owner |
| `update(id, dto)` | Actualiza los campos del registro |
| `delete(id)` | Elimina un registro por id |

### `Vaccination.js`

| Método | Descripción |
|--------|-------------|
| `create(recordId, vac)` | Inserta una vacuna asociada a un registro médico |
| `findByRecordId(recordId)` | Retorna todas las vacunas de un registro |
| `deleteByRecordId(recordId)` | Elimina todas las vacunas de un registro (usado en update) |

---

## Controllers

### `authController.js`

| Función | Descripción |
|---------|-------------|
| `register` | Valida `RegisterDto`, verifica email único, hashea contraseña y crea el owner |
| `login` | Valida `LoginDto`, verifica credenciales, retorna JWT firmado |

### `medicalRecordController.js`

| Función | Descripción |
|---------|-------------|
| `createMedicalRecord` | Crea el registro médico e inserta las vacunas si se envían |
| `getMedicalRecords` | Retorna todos los registros del owner autenticado con sus vacunas |
| `getMedicalRecord` | Retorna un registro por id con sus vacunas |
| `updateMedicalRecord` | Actualiza el registro; si se envían vacunas, reemplaza las existentes |
| `deleteMedicalRecord` | Elimina las vacunas y luego el registro (respeta FK) |

---

## Rutas y endpoints

### Auth — `/api/auth`

| Método | Ruta | Auth | Body | Descripción |
|--------|------|------|------|-------------|
| POST | `/api/auth/register` | No | `{ name, email, password }` | Registrar usuario |
| POST | `/api/auth/login` | No | `{ email, password }` | Login, retorna JWT |

**Respuesta login exitoso:**
```json
{
  "token": "eyJhbGci...",
  "user": { "id": 1, "name": "Juan", "email": "juan@mail.com" }
}
```

### Medical Records — `/api/medical-records`

Todos los endpoints requieren el header:
```
Authorization: Bearer <token>
```

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/medical-records` | Listar todos los registros del usuario |
| POST | `/api/medical-records` | Crear un nuevo registro médico |
| GET | `/api/medical-records/:id` | Obtener un registro por id |
| PUT | `/api/medical-records/:id` | Actualizar un registro |
| DELETE | `/api/medical-records/:id` | Eliminar un registro |

**Body para POST / PUT:**
```json
{
  "petName": "Luna",
  "petType": "Cat",
  "petSize": "Small",
  "ownerName": "Juan Pérez",
  "description": "Revisión anual",
  "vaccinations": [
    { "number": 1, "type": "Rabia", "date": "2024-03-15" },
    { "number": 2, "type": "Triple felina", "date": "2024-03-15" }
  ]
}
```

### Otros

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/health` | Verifica que el servidor está corriendo |
| GET | `/api/docs` | Swagger UI |

---

## Autenticación

Se usa **JWT (JSON Web Token)** con expiración de 24 horas.

El middleware `auth.js` extrae el token del header `Authorization: Bearer <token>`, lo verifica con `JWT_SECRET` y adjunta el payload decodificado en `req.user`.

Todas las rutas de `/api/medical-records` pasan por este middleware.

---

## Documentación interactiva (Swagger)

Con el servidor corriendo, acceder a:

```
http://localhost:5000/api/docs
```

Para probar endpoints protegidos:
1. Llamar a `POST /api/auth/login`
2. Copiar el `token` de la respuesta
3. Click en **Authorize** → pegar el token
4. Todos los endpoints protegidos quedan habilitados
