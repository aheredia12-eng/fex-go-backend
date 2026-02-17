# FEX Orchestrator Backend (NestJS + Prisma)

Monolito modular por dominios (DDD-lite) para un orquestador I/O-bound con seguridad multi-tenant.

<<<<<<< codex/create-node.js-project-with-nestjs-1pi1q2
## Estado actual del proyecto

Actualmente el repositorio ya tiene:

- Bootstrap completo de NestJS + TypeScript.
- Arquitectura por dominios con capas `domain`, `application`, `infra`.
- Prisma como ORM y esquema inicial completo para el **dominio A (Base y Seguridad)**.
- Seguridad base con:
  - Login con JWT,
  - Persistencia de sesión,
  - Validación de sesión expirada,
  - Validación de permisos por recurso/acción,
  - Validación de autorización por etapa del motor.
- CRUD inicial de tenants (crear/listar/obtener/actualizar/eliminar lógico).

## Estructura

- `src/modules/<dominio>/domain`: reglas y contratos puros de negocio.
- `src/modules/<dominio>/application`: casos de uso y DTOs.
- `src/modules/<dominio>/infra`: controladores HTTP y repositorios/adaptadores.
- `src/infra`: infraestructura compartida (Prisma, config, etc.).
- `src/shared`: concerns transversales (guards, decorators, utilidades).
- `prisma/schema.prisma`: modelo completo del dominio A.
=======
## Estructura

- `src/modules/<dominio>/domain`: entidades y contratos puros.
- `src/modules/<dominio>/application`: casos de uso y DTOs.
- `src/modules/<dominio>/infra`: controladores y repositorios Prisma.
- `src/infra`: infraestructura compartida (Prisma, config).
- `src/shared`: guards/decorators transversales.
- `prisma/schema.prisma`: modelo completo dominio A (base y seguridad).
>>>>>>> main

## Dominios implementados

### Seguridad
- Autenticación de actor con JWT y persistencia de sesión.
- Validación de permiso por recurso/acción.
- Validación de autorización por etapa para el motor.
- Manejo de sesión expirada por guard/strategy.
- Logging de eventos de seguridad.

### Tenants
CRUD completo:
- `POST /api/v1/tenants`
- `GET /api/v1/tenants`
- `GET /api/v1/tenants/:id`
- `PATCH /api/v1/tenants/:id`
- `DELETE /api/v1/tenants/:id` (soft delete)

> Todos los endpoints de tenants están protegidos por JWT.

## Modelo de datos (Prisma)
Incluye las entidades del dominio A:
1. tenant
2. actor
3. role
4. actor_role
5. permission_policy
6. session
7. mfa_policy
8. credential_rotation
9. security_event_log
10. api_client

<<<<<<< codex/create-node.js-project-with-nestjs-1pi1q2
---

## ¿Qué podríamos probar ahora mismo?

### Pruebas técnicas mínimas

1. **Compilación de TypeScript**
   - Verifica integridad de módulos, imports y tipos.

2. **Prisma generate + migrate**
   - Generar cliente Prisma y crear estructura en DB local.

3. **Flujo auth básico**
   - Crear actor semilla en DB,
   - Login,
   - Uso del token en endpoint protegido.

4. **CRUD de tenants end-to-end**
   - Crear tenant,
   - Listar,
   - Obtener por id,
   - Actualizar,
   - Soft delete.

### Pruebas funcionales recomendadas siguientes

- Unit tests de casos de uso (sin Nest).
- Integration tests de repositorios Prisma.
- E2E tests de controladores (Supertest + Nest testing module).
- Pruebas de autorización (políticas allow/deny y prioridad).

---

## Levantar localmente (VSCode + PostgreSQL local `fex-go-bd`)

### Opción A: PostgreSQL local instalado en tu máquina

1. Crear DB:
```sql
CREATE DATABASE "fex-go-bd";
```

2. Copiar variables de entorno:
```bash
cp .env.example .env
```

3. Verificar `DATABASE_URL` en `.env`:
```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/fex-go-bd?schema=public
```

4. Instalar dependencias:
```bash
npm install
```

5. Generar cliente Prisma:
```bash
npm run prisma:generate
```

6. Crear migración inicial (solo la primera vez):
```bash
npx prisma migrate dev --name init
```

7. Levantar API:
```bash
npm run build
npm run start
```

### Opción B: PostgreSQL con Docker Compose (incluido)

```bash
docker compose up -d
cp .env.example .env
npm install
npm run prisma:generate
npx prisma migrate dev --name init
npm run build
npm run start
```

---

## Flujo sugerido en VSCode

1. Abrir carpeta del repo.
2. Crear `.env` desde `.env.example`.
3. Levantar PostgreSQL local (instalado o compose).
4. Ejecutar migraciones Prisma.
5. Ejecutar API y probar endpoints con Thunder Client/Postman.

---

## Endpoints principales de seguridad

- `POST /api/v1/auth/login`
- `POST /api/v1/auth/permissions/check`
- `POST /api/v1/auth/engine/stage-authorization`

## Endpoints principales de tenants

- `POST /api/v1/tenants`
- `GET /api/v1/tenants`
- `GET /api/v1/tenants/:id`
- `PATCH /api/v1/tenants/:id`
- `DELETE /api/v1/tenants/:id`
=======
## Arranque
```bash
npm install
cp .env.example .env
npm run prisma:generate
npm run build
npm run start
```
>>>>>>> main
