# API Gateway — Univalle Shop

Punto de entrada único de la tienda. Recibe todas las solicitudes `/api/*`,
valida la sesión, aplica los permisos y las reenvía al microservicio que
corresponde. Es el único contenedor de la aplicación con puerto publicado (`8080`).

## Arquitectura hexagonal

```
src/modules/gateway/
├── domain/            # Reglas puras, sin framework
│   ├── model/         # route.ts (tipos) y route-table.ts (rutas expuestas)
│   ├── services/      # access-policy.ts (quién puede qué)
│   ├── errors/
│   └── ports/         # SessionVerifierPort, UpstreamPort, AdminDirectoryPort
├── application/
│   └── use-cases/     # ProxyRequestUseCase
├── infrastructure/
│   ├── adapters/      # UsersSessionHttpAdapter, HttpUpstreamAdapter, EnvAdminDirectoryAdapter
│   └── config/        # Variables de entorno
└── presentation/
    └── controllers/   # GatewayController (Express ↔ caso de uso)
```

## Rutas y permisos

| Prefijo público   | Microservicio      | Acceso |
|-------------------|--------------------|--------|
| `/api/usuarios/sesion` | users-service | Público (login, sesión, cerrar sesión) |
| `POST /api/usuarios/users` | users-service | Público (registro) |
| `GET /api/usuarios/users` | users-service | Solo administradores |
| `/api/usuarios/users/:id` | users-service | Dueño de la cuenta o administrador |
| `GET /api/products...` | catalog-service | Usuarios con sesión |
| `POST/PATCH/DELETE /api/products...` | catalog-service | Solo administradores |
| `/api/pedidos/...` | orders-service | Usuarios con sesión |

Cualquier ruta que no esté en `route-table.ts` responde `404`. Por ejemplo,
`PATCH /products/:id/stock` solo lo usa orders-service dentro de la red de Docker.

## Seguridad entre servicios

- El gateway valida la sesión con `GET /sesion` de users-service (las sesiones
  se guardan en MongoDB, así que cerrar sesión las invalida en toda la tienda).
- A cada microservicio le envía `x-internal-token` y la identidad ya validada
  (`x-usuario-id`, `x-usuario-correo`). Los microservicios rechazan cualquier
  solicitud sin el token interno.

## Variables de entorno

| Variable | Descripción |
|----------|-------------|
| `PORT` | Puerto del gateway (8080) |
| `USERS_SERVICE_URL`, `CATALOG_SERVICE_URL`, `ORDERS_SERVICE_URL` | Direcciones internas |
| `INTERNAL_TOKEN` | Secreto compartido con los microservicios |
| `ADMIN_EMAILS` | Correos de administradores, separados por comas |

Para definir administradores al levantar Docker:

```bash
ADMIN_EMAILS=nombre.apellido@correounivalle.edu.co docker compose up -d
```
