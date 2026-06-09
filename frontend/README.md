# ReWow Pet Care — Frontend

Interfaz de usuario para la gestión de registros médicos de mascotas. Construida con React y Axios.

---

## Tabla de contenidos

- [Tecnologías](#tecnologías)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Scripts](#scripts)
- [Configuración](#configuración)
- [Arquitectura](#arquitectura)
- [Pages](#pages)
- [Components](#components)
- [Services](#services)
- [Flujo de la aplicación](#flujo-de-la-aplicación)
- [Estado y props](#estado-y-props)

---

## Tecnologías

| Paquete | Versión | Uso |
|---------|---------|-----|
| react | ^18.2.0 | Librería de UI |
| react-dom | ^18.2.0 | Renderizado en el navegador |
| react-router-dom | ^6.16.0 | Enrutamiento (instalado, disponible para uso futuro) |
| axios | ^1.6.0 | Cliente HTTP para consumir la API |
| react-scripts | 5.0.1 | Toolchain de Create React App |

---

## Estructura del proyecto

```
frontend/
├── public/
└── src/
    ├── pages/
    │   ├── LoginPage.js      # Vista de login y registro
    │   └── DashboardPage.js  # Vista principal con gestión de registros
    ├── components/
    │   ├── MedicalRecordForm.js   # Formulario crear/editar registro
    │   └── MedicalRecordList.js   # Tabla de registros médicos
    ├── services/
    │   └── api.js    # Cliente Axios + authService + medicalRecordService
    ├── App.js        # Enrutamiento entre páginas y manejo de sesión
    └── index.js      # Entry point
```

---

## Scripts

```bash
npm start        # Inicia la app en http://localhost:3000
npm run build    # Genera el build de producción en /build
npm test         # Ejecuta los tests
npm run eject    # Expone la configuración de webpack (irreversible)
```

---

## Configuración

La URL base de la API se define en `src/services/api.js`:

```js
const API_URL = 'http://localhost:5000/api';
```

Cambiar este valor si el backend corre en un puerto o host diferente.

---

## Arquitectura

```
App.js
├── LoginPage       (si no hay sesión)
└── DashboardPage   (si hay sesión)
    ├── MedicalRecordList   (vista por defecto)
    └── MedicalRecordForm   (al crear o editar)
```

La sesión se persiste en `localStorage` con dos claves:

| Clave | Contenido |
|-------|-----------|
| `token` | JWT para autenticar peticiones a la API |
| `user` | Objeto `{ id, name, email }` del usuario logueado |

Al montar `App.js`, se lee `localStorage` para restaurar la sesión sin requerir nuevo login.

---

## Pages

### `LoginPage.js`

Vista completa de autenticación. Maneja dos modos en el mismo componente: **Login** y **Registro**, alternando con un toggle.

**Props:**

| Prop | Tipo | Descripción |
|------|------|-------------|
| `onLoginSuccess` | function | Callback que recibe el objeto `user` tras login exitoso |

**Estado interno:**

| Estado | Tipo | Descripción |
|--------|------|-------------|
| `isLogin` | boolean | `true` = modo login, `false` = modo registro |
| `formData` | object | Campos del formulario: `name`, `email`, `password` |
| `error` | string | Mensaje de error de la API |
| `loading` | boolean | Deshabilita el botón durante la petición |

**Flujo login:**
1. Llama a `authService.login(email, password)`
2. Guarda `token` y `user` en `localStorage`
3. Llama a `onLoginSuccess(user)` → `App.js` cambia a `DashboardPage`

**Flujo registro:**
1. Llama a `authService.register(name, email, password)`
2. Muestra alerta de éxito y vuelve al modo login

---

### `DashboardPage.js`

Vista principal. Muestra la lista de registros médicos y permite crear, editar y eliminar.

**Props:**

| Prop | Tipo | Descripción |
|------|------|-------------|
| `user` | object | Objeto `{ id, name, email }` del usuario autenticado |
| `onLogout` | function | Callback que limpia `localStorage` y vuelve a `LoginPage` |

**Estado interno:**

| Estado | Tipo | Descripción |
|--------|------|-------------|
| `records` | array | Lista de registros médicos del usuario |
| `loading` | boolean | Indica si se están cargando los registros |
| `showForm` | boolean | Alterna entre la lista y el formulario |
| `editingRecord` | object\|null | Registro seleccionado para editar; `null` en modo creación |
| `message` | object\|string | Mensaje de éxito o error: `{ type, text }` |

**Funciones:**

| Función | Descripción |
|---------|-------------|
| `fetchRecords` | Llama a `getMedicalRecords()` y actualiza `records` |
| `handleFormSubmit` | Crea o actualiza según si `editingRecord` tiene valor |
| `handleEdit` | Asigna el registro a `editingRecord` y muestra el formulario |
| `handleDelete` | Pide confirmación y elimina el registro |
| `handleCloseForm` | Oculta el formulario y limpia `editingRecord` |

---

## Components

### `MedicalRecordForm.js`

Formulario reutilizable para crear y editar registros médicos. Si recibe `record` como prop, carga sus datos para edición.

**Props:**

| Prop | Tipo | Descripción |
|------|------|-------------|
| `record` | object\|null | Registro a editar; `null` para modo creación |
| `onSubmit` | function | Recibe el `formData` al hacer submit |
| `onCancel` | function | Callback para cancelar y volver al listado |

**Estado interno:**

| Estado | Tipo | Descripción |
|--------|------|-------------|
| `formData` | object | Todos los campos del formulario incluidas las vacunas |

**Campos del formulario:**

| Campo | Tipo | Valores posibles | Requerido |
|-------|------|-----------------|-----------|
| `ownerName` | text | — | Sí |
| `petName` | text | — | Sí |
| `petType` | select | `Cat`, `Dog`, `Fish`, `Other` | Sí |
| `petSize` | radio | `Small`, `Medium`, `Big` | Sí |
| `description` | textarea | — | No |
| `vaccinations` | array | Ver tabla siguiente | No |

**Campos de cada vacuna:**

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `number` | number | Número o dosis de la vacuna |
| `type` | text | Nombre de la vacuna (ej. Rabia, DHPP) |
| `date` | date | Fecha de aplicación |

**Funciones:**

| Función | Descripción |
|---------|-------------|
| `handleChange` | Actualiza un campo del formulario por nombre |
| `handleVaccinationChange` | Actualiza un campo de una vacuna por índice |
| `addVaccination` | Agrega una vacuna vacía al array |
| `removeVaccination` | Elimina una vacuna por índice |

---

### `MedicalRecordList.js`

Tabla que muestra los registros médicos del usuario. Si no hay registros, muestra un mensaje vacío.

**Props:**

| Prop | Tipo | Descripción |
|------|------|-------------|
| `records` | array | Lista de registros médicos a mostrar |
| `onEdit` | function | Recibe el objeto `record` al hacer click en Edit |
| `onDelete` | function | Recibe el `id` del registro al hacer click en Delete |

**Columnas de la tabla:**

| Columna | Campo en el objeto |
|---------|--------------------|
| Pet Name | `record.pet_name` |
| Owner Name | `record.owner_name` |
| Type | `record.pet_type` |
| Size | `record.pet_size` |
| Vaccinations | `record.vaccinations.length` |
| Actions | Botones Edit / Delete |

---

## Services

### `api.js`

Configura el cliente HTTP y exporta los servicios de la API.

**Cliente Axios (`apiClient`):**
- Base URL: `http://localhost:5000/api`
- Interceptor: adjunta automáticamente el `Authorization: Bearer <token>` desde `localStorage` en cada petición

**`authService`:**

| Método | Petición | Descripción |
|--------|----------|-------------|
| `login(email, password)` | `POST /auth/login` | Retorna `{ token, user }` |
| `register(name, email, password)` | `POST /auth/register` | Registra un nuevo usuario |

**`medicalRecordService`:**

| Método | Petición | Descripción |
|--------|----------|-------------|
| `getMedicalRecords()` | `GET /medical-records` | Lista todos los registros del usuario |
| `getMedicalRecord(id)` | `GET /medical-records/:id` | Obtiene un registro por id |
| `createMedicalRecord(data)` | `POST /medical-records` | Crea un nuevo registro |
| `updateMedicalRecord(id, data)` | `PUT /medical-records/:id` | Actualiza un registro |
| `deleteMedicalRecord(id)` | `DELETE /medical-records/:id` | Elimina un registro |

---

## Flujo de la aplicación

```
Inicio
  └── App.js lee localStorage
        ├── token encontrado → DashboardPage
        │     ├── Carga registros al montar (fetchRecords)
        │     ├── [Lista] MedicalRecordList
        │     │     ├── Edit → MedicalRecordForm (con datos)
        │     │     └── Delete → confirmación → deleteMedicalRecord
        │     ├── [Formulario] MedicalRecordForm
        │     │     ├── Submit crear → createMedicalRecord → vuelve a lista
        │     │     └── Submit editar → updateMedicalRecord → vuelve a lista
        │     └── Logout → limpia localStorage → LoginPage
        └── sin token → LoginPage
              ├── Login → guarda token/user → DashboardPage
              └── Registro → éxito → modo login
```
