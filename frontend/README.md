# ReWow Pet Care — Frontend

Interfaz de usuario construida con React.

## Tecnologías

- **React** — librería de UI
- **Axios** — cliente HTTP para consumir la API

## Estructura

```
src/
├── pages/
│   ├── LoginPage.js      # Vista de login y registro
│   └── DashboardPage.js  # Vista principal con listado de registros
├── components/
│   ├── MedicalRecordForm.js   # Formulario para crear/editar registros
│   └── MedicalRecordList.js   # Listado de registros médicos
├── services/
│   └── api.js    # Cliente Axios + authService + medicalRecordService
├── App.js        # Enrutamiento entre LoginPage y DashboardPage
└── index.js
```

## Configuración

La URL de la API se define en `src/services/api.js`:

```js
const API_URL = 'http://localhost:5000/api';
```

## Scripts

```bash
npm start      # Inicia la app en http://localhost:3000
npm run build  # Genera el build de producción
npm test       # Ejecuta los tests
```
