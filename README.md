# FEX Orchestrator Backend (NestJS + Prisma)

Monolito modular por dominios (DDD-lite) para un orquestador I/O-bound con seguridad multi-tenant.

## Estructura

- `src/modules/<dominio>/domain`: entidades y contratos puros.
- `src/modules/<dominio>/application`: casos de uso y DTOs.
- `src/modules/<dominio>/infra`: controladores y repositorios Prisma.
- `src/infra`: infraestructura compartida (Prisma, config).
- `src/shared`: guards/decorators transversales.
- `prisma/schema.prisma`: modelo completo dominio A (base y seguridad).

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

## Arranque
```bash
npm install
cp .env.example .env
npm run prisma:generate
npm run build
npm run start
```
