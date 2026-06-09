# Patrones de Diseño y Arquitectura

## Arquitectura en capas

El backend sigue una arquitectura en capas donde cada nivel tiene una responsabilidad única:

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

## Patrones utilizados

### DTO (Data Transfer Object)

Los DTOs encapsulan los datos que llegan del cliente y validan los campos requeridos antes de que el controlador los procese:

```javascript
class CreateMedicalRecordDto {
  constructor({ petName, petType, petSize, ownerName, description, vaccinations }) {
    this.petName = petName;
    // ...
  }
  isValid() {
    return !!(this.petName && this.petType && this.petSize && this.ownerName);
  }
  static fromBody(body) {
    return new CreateMedicalRecordDto(body);
  }
}
```

Esto desacopla la validación del controlador y centraliza la definición de la forma esperada de cada request.

### Repository / Model

Los modelos centralizan todo el acceso a la base de datos. Los controladores nunca escriben SQL directamente:

```javascript
const MedicalRecord = {
  create: (ownerId, dto) => pool.query('INSERT INTO medical_records...', [...]),
  findAllByOwner: (ownerId) => pool.query('SELECT * FROM medical_records WHERE owner_id = $1', [ownerId]),
  // ...
};
```

Si cambia el esquema o se migra a un ORM, el cambio queda contenido en los modelos sin afectar los controladores.

### Middleware

`src/middleware/auth.js` intercepta todas las rutas protegidas, verifica el JWT y adjunta el usuario decodificado en `req.user`:

```javascript
const authenticateToken = (req, res, next) => {
  // valida JWT y adjunta req.user
}
```

Se aplica a nivel de router en `/api/medical-records`, no endpoint por endpoint.

### Service Layer (API Client)

En el frontend, `src/services/api.js` centraliza todas las llamadas HTTP. Las páginas y componentes nunca usan axios directamente:

```javascript
export const medicalRecordService = {
  createMedicalRecord: (data) => apiClient.post('/medical-records', data),
  getMedicalRecords: () => apiClient.get('/medical-records'),
  // ...
}
```

Un interceptor adjunta automáticamente el token `Authorization: Bearer <token>` en cada petición.

### Singleton para el pool de base de datos

`src/config/database.js` exporta una única instancia del pool de PostgreSQL, evitando abrir múltiples conexiones al importar desde distintos modelos:

```javascript
const pool = new Pool({...});
module.exports = pool;
```

### Component-Based (React)

Las vistas completas viven en `pages/` y los elementos reutilizables en `components/`:

```
App.js
├── LoginPage         ← vista completa (página)
└── DashboardPage     ← vista completa (página)
    ├── MedicalRecordList   ← componente reutilizable
    └── MedicalRecordForm   ← componente reutilizable
```

El estado de sesión vive en `App.js` y se pasa hacia abajo como props.

---

## Seguridad

**Contraseñas**: Se hashean con bcryptjs (salt rounds: 10) antes de guardar en la base de datos.

**JWT**: Los tokens incluyen `id`, `email` y `name` del usuario, expiran en 24h y se firman con `JWT_SECRET` del entorno.

**Aislamiento de datos**: Todas las queries de registros médicos filtran por `owner_id`, así un usuario nunca puede ver ni modificar registros de otro aunque conozca el id.

**Validación**: Los DTOs validan campos requeridos antes de cualquier operación en la base de datos.

---

## Principios SOLID

- **S**: Cada capa tiene una única responsabilidad — el DTO valida, el model consulta, el controller orquesta.
- **O**: Se pueden agregar nuevos endpoints o modelos sin modificar los existentes.
- **L**: Los modelos pueden reemplazarse (ej. migrar a Sequelize) sin cambiar los controladores.
- **I**: Los controladores solo acceden a los métodos del model que necesitan.
- **D**: El pool de BD se importa en los models, no se instancia dentro de ellos.

---

## Flujo de datos

### Login
```
LoginPage → authService.login() → POST /api/auth/login
→ LoginDto → Owner.findByEmail() → bcrypt.compare()
→ jwt.sign() → { token, user } → localStorage → DashboardPage
```

### Crear registro médico
```
DashboardPage → MedicalRecordForm → medicalRecordService.createMedicalRecord()
→ POST /api/medical-records → auth middleware (valida JWT)
→ CreateMedicalRecordDto → MedicalRecord.create() + Vaccination.create()
→ fetchRecords() → MedicalRecordList
```
