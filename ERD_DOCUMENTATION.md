# Esquema de Base de Datos

## Tablas

```
┌──────────────────────────────────────────────────────┐
│  OWNERS                                              │
│  id             SERIAL PRIMARY KEY                   │
│  name           VARCHAR(100) NOT NULL                │
│  email          VARCHAR(100) NOT NULL UNIQUE         │
│  password       VARCHAR(255) NOT NULL                │
│  created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP  │
│  updated_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP  │
└──────────────────────┬───────────────────────────────┘
                       │ 1:N
                       ▼
┌──────────────────────────────────────────────────────┐
│  MEDICAL_RECORDS                                     │
│  id             SERIAL PRIMARY KEY                   │
│  owner_id       INT NOT NULL → owners.id             │
│  pet_name       VARCHAR(100) NOT NULL                │
│  pet_type       pet_type_enum NOT NULL               │
│  pet_size       pet_size_enum NOT NULL               │
│  owner_name     VARCHAR(100) NOT NULL                │
│  description    TEXT                                 │
│  created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP  │
│  updated_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP  │
└──────────────────────┬───────────────────────────────┘
                       │ 1:N
                       ▼
┌──────────────────────────────────────────────────────┐
│  VACCINATIONS                                        │
│  id                   SERIAL PRIMARY KEY             │
│  medical_record_id    INT NOT NULL → medical_records.id │
│  vaccination_number   INT                            │
│  vaccination_type     VARCHAR(100)                   │
│  vaccination_date     DATE                           │
│  created_at           TIMESTAMP DEFAULT CURRENT_TIMESTAMP │
└──────────────────────────────────────────────────────┘
```

## ENUMs

```sql
pet_type_enum: 'Cat', 'Dog', 'Fish', 'Other'
pet_size_enum: 'Small', 'Medium', 'Big'
```

## Relaciones

- **owners → medical_records**: un dueño puede tener múltiples registros. Al eliminar un owner, se eliminan en cascada todos sus registros.
- **medical_records → vaccinations**: un registro puede tener múltiples vacunaciones. Al eliminar un registro, se eliminan en cascada sus vacunaciones.

## Índices

```sql
idx_owner_id         ON medical_records(owner_id)
idx_medical_record_id ON vaccinations(medical_record_id)
idx_owner_email       ON owners(email)
```

El índice en `email` acelera el login. Los otros dos aceleran las joins más frecuentes.
