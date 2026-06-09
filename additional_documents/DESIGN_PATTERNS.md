# Patrones de Diseño y Arquitectura

## Patrones utilizados

### MVC (Model-View-Controller)

El backend sigue una separación clara entre rutas, controladores y acceso a datos:

```
Routes → Controllers → Database
auth.js → authController.js → tabla owners
medicalRecords.js → medicalRecordController.js → tabla medical_records
```

Las rutas solo definen los endpoints y aplican middleware. Los controladores tienen toda la lógica de negocio.

### Middleware

`src/middleware/auth.js` valida el JWT en cada petición protegida antes de que llegue al controlador:

```javascript
const authenticateToken = (req, res, next) => {
  // Valida JWT y adjunta req.user
}
```

Se aplica a todas las rutas de `/api/medical-records`.

### Service Layer (API Client)

En el frontend, `src/services/api.js` centraliza todas las llamadas HTTP. Los componentes no usan axios directamente, sino los métodos de este servicio:

```javascript
export const authService = {
  register: (name, email, password) => {...},
  login: (email, password) => {...}
}

export const medicalRecordService = {
  createMedicalRecord: (data) => {...},
  getMedicalRecords: () => {...},
  // ...
}
```

El interceptor de axios adjunta automáticamente el token a cada petición.

### Component-Based (React)

```
App.js
├── Login
└── Dashboard
    ├── MedicalRecordForm
    └── MedicalRecordList
```

Cada componente tiene una responsabilidad única. El estado de autenticación vive en `App.js` y se pasa hacia abajo como props.

### Singleton para el pool de base de datos

`src/config/database.js` exporta una única instancia del pool de PostgreSQL:

```javascript
const pool = new pg.Pool({...});
module.exports = pool;
```

Esto evita abrir múltiples pools al importar la config desde distintos controladores.

---

## Seguridad

**Contraseñas**: Se hashean con bcryptjs usando salt rounds 10 antes de guardar.

**JWT**: Los tokens incluyen el `id` y `email` del usuario, expiran en 24h, y se firman con `JWT_SECRET` del entorno.

**Aislamiento de datos**: Todas las queries de registros médicos filtran por `owner_id = $1`, así un usuario nunca puede ver ni modificar registros de otro.

**Validación**: Los controladores validan que los campos requeridos estén presentes antes de hacer cualquier operación en la base de datos.

---

## Principios SOLID

- **S**: Cada controlador maneja un solo dominio (auth o medical records). Cada componente React tiene una función específica.
- **O**: Se pueden agregar nuevos tipos de registros o servicios sin modificar los controladores existentes.
- **L**: El servicio de API del frontend puede reemplazarse sin afectar los componentes que lo consumen.
- **I**: Los controladores no exponen métodos que no usan las rutas. Los componentes reciben solo las props que necesitan.
- **D**: El pool de BD se inyecta vía import, no se crea dentro de los controladores. Los componentes reciben funciones como props en lugar de llamar servicios directamente.

---

## Flujo de datos

### Login
```
Login.js → api.js → POST /api/auth/login → authController.js → tabla owners → JWT → localStorage → Dashboard.js
```

### Crear registro médico
```
Dashboard.js → MedicalRecordForm.js → api.js → POST /api/medical-records
→ auth.js (valida JWT) → medicalRecordController.js → INSERT en BD
→ fetchRecords() → MedicalRecordList.js
```
