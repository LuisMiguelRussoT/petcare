# Guía de Pruebas de API

Usa Postman, Thunder Client o curl. Base URL: `http://localhost:5000/api`

---

## Autenticación

### Registrar usuario

```
POST /auth/register
Content-Type: application/json

{
  "name": "Carlos Mendez",
  "email": "carlos@example.com",
  "password": "password123"
}
```

Response `201`:
```json
{ "message": "User registered successfully" }
```

### Login

```
POST /auth/login
Content-Type: application/json

{
  "email": "carlos@example.com",
  "password": "password123"
}
```

Response `200`:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { "id": 1, "name": "Carlos Mendez", "email": "carlos@example.com" }
}
```

Guarda el token para las siguientes peticiones.

---

## Registros Médicos

Todas las rutas requieren el header:
```
Authorization: Bearer {token}
Content-Type: application/json
```

### Crear registro

```
POST /medical-records

{
  "petName": "Max",
  "petType": "Dog",
  "petSize": "Big",
  "ownerName": "Carlos Mendez",
  "description": "Perro labrador muy activo",
  "vaccinations": [
    { "number": 1, "type": "DHPP", "date": "2023-01-15" },
    { "number": 2, "type": "Rabies", "date": "2023-02-20" }
  ]
}
```

Response `201`:
```json
{ "id": 1, "message": "Medical record created successfully" }
```

### Obtener todos los registros

```
GET /medical-records
```

Response `200`: array con todos los registros del usuario autenticado, cada uno incluye su lista de `vaccinations`.

### Obtener un registro

```
GET /medical-records/1
```

### Actualizar registro

```
PUT /medical-records/1

{
  "petName": "Max",
  "petType": "Dog",
  "petSize": "Medium",
  "ownerName": "Carlos Mendez",
  "description": "Actualizado",
  "vaccinations": [...]
}
```

Las vacunaciones se reemplazan completamente con el array enviado.

### Eliminar registro

```
DELETE /medical-records/1
```

---

## Valores válidos

- **petType**: `Cat`, `Dog`, `Fish`, `Other`
- **petSize**: `Small`, `Medium`, `Big`

---

## Errores comunes

| Status | Causa |
|--------|-------|
| 401 | Sin token o token expirado |
| 403 | Token inválido |
| 400 | Campos requeridos faltantes o email duplicado |
| 404 | Registro no encontrado o no pertenece al usuario |

---

## Script de prueba con cURL

```bash
#!/bin/bash
API="http://localhost:5000/api"
EMAIL="test@example.com"
PASS="testpass123"

# 1. Registrar
curl -X POST $API/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Test\",\"email\":\"$EMAIL\",\"password\":\"$PASS\"}"

# 2. Login y guardar token
RESPONSE=$(curl -X POST $API/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"$PASS\"}")
TOKEN=$(echo $RESPONSE | grep -o '"token":"[^"]*' | grep -o '[^"]*$')

# 3. Crear registro
curl -X POST $API/medical-records \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"petName":"Fluffy","petType":"Cat","petSize":"Small","ownerName":"Test","description":"","vaccinations":[]}'

# 4. Listar registros
curl -X GET $API/medical-records \
  -H "Authorization: Bearer $TOKEN"
```
