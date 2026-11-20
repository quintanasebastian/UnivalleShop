# Orders Service

Microservicio de carrito y pedidos de **Univalle Shop**, construido con NestJS, TypeScript y MongoDB (Mongoose).

## Arquitectura


```
src/modules/orders/
├── domain/
│   ├── entities/              # Cart, Order, OrderItem y reglas de negocio
│   ├── errors/                # Errores de integración con otros servicios
│   └── ports/
│       ├── repositories/      # Contratos de persistencia
│       ├── security/          # Contrato de lectura de sesión
│       └── services/          # Contrato de stock con Catalog Service
├── application/
│   └── use-cases/             # Casos de uso del carrito y los pedidos
├── infrastructure/
│   ├── adapters/              # Adaptadores MongoDB, sesión y cliente HTTP de catálogo
│   └── schemas/               # Esquemas Mongoose
└── presentation/
    ├── controllers/           # Controladores HTTP
    ├── dto/                   # DTOs de entrada
    └── http-error.mapper.ts   # Traducción de errores de dominio a HTTP
```

- `domain` no depende de NestJS, Mongoose ni HTTP.
- Los casos de uso dependen únicamente de los puertos de dominio.
- Los adaptadores MongoDB implementan esos puertos.
- El controlador depende de los casos de uso, nunca de Mongoose.

## Sesión

El servicio lee la misma cookie HttpOnly que usa Users Service (`univalleshop_sesion`) y valida su firma HMAC-SHA256 con `SESSION_SECRET` (valor por defecto compartido: `univalleshop-dev-session-secret`). No consulta Users Service en cada petición. Las rutas responden `401` si no hay sesión válida.

## Variables de entorno

| Variable                     | Valor por defecto                                       |
| ---------------------------- | ------------------------------------------------------- |
| `PORT`                       | `3003`                                                  |
| `MONGODB_URI`                | `mongodb://localhost:27019/univalle_shop_orders`        |
| `SESSION_SECRET`             | `univalleshop-dev-session-secret`                       |
| `CATALOG_SERVICE_URL`        | `http://localhost:3002` (en Docker: `http://catalog-service:3002`) |
| `CATALOG_REQUEST_TIMEOUT_MS` | `5000`                                                  |

## Endpoints

| Método   | Ruta                        | Descripción                                    |
| -------- | --------------------------- | ---------------------------------------------- |
| `GET`    | `/carrito`                  | Obtener (o crear) el carrito activo            |
| `POST`   | `/carrito/items`            | Agregar un producto al carrito                 |
| `PATCH`  | `/carrito/items/:productoId`| Cambiar la cantidad de un producto             |
| `DELETE` | `/carrito/items/:productoId`| Quitar un producto del carrito                 |
| `GET`    | `/pedidos`                  | Historial de pedidos del usuario               |
| `POST`   | `/pedidos/checkout`         | Confirmar el carrito como pedido pendiente     |
| `GET`    | `/pedidos/:id`              | Detalle de un pedido propio                    |
| `PATCH`  | `/pedidos/:id/estado`       | Confirmar o cancelar un pedido pendiente       |

### Ejemplo de producto en el carrito

```json
{
  "productoId": "681f2c1a9b2d4f0012ab34cd",
  "nombre": "Calculadora científica",
  "precioUnitario": 85900.5,
  "cantidad": 2
}
```

### Reglas de negocio

- Cantidad entera entre 1 y 20 por producto; máximo 30 productos diferentes.
- No se permiten productos duplicados: agregar uno existente suma cantidades.
- `subtotal` de cada ítem = `precioUnitario * cantidad`; `total` del pedido = suma de subtotales.
- El checkout exige un carrito no vacío, **reserva el stock en Catalog Service** mediante `PATCH /products/:id/stock`, crea el pedido en estado `pendiente` y limpia el carrito.
- Si Catalog Service no tiene stock (409), no responde (503) o falla algún paso posterior, se devuelve el stock reservado, se elimina cualquier pedido creado y se conserva el carrito: no queda un pedido inconsistente.
- Cada servicio conserva su propia base de datos: Orders nunca consulta la BD de Catálogo, solo su API REST.
- Transiciones permitidas: `pendiente → confirmado` y `pendiente → cancelado`.
- Un usuario solo puede consultar o cambiar sus propios pedidos.

## Integración futura con `payments-service`

Cuando exista el servicio de pagos, el flujo recomendado es:

1. El checkout actual deja el pedido en `pendiente` con el stock ya reservado.
2. Orders llama a `payments-service` (nuevo puerto de dominio, p. ej. `PaymentPort`) para crear/capturar el pago.
3. Si el pago es aprobado, Orders cambia el estado a `pagado` (ampliar `ORDER_STATUSES` y `ALLOWED_TRANSITIONS`) y confirma la reserva.
4. Si el pago falla o el pedido se cancela, Orders llama a `PATCH /products/:id/stock/restore` para cada ítem y pasa el pedido a `cancelado`.

La compensación de stock ya implementada en `CheckoutUseCase` es el mismo patrón a reutilizar: reservar → confirmar o devolver.

## Desarrollo

```bash
npm install
npm run start:dev
```

## Producción con Docker

Desde la raíz del repositorio:

```bash
docker compose up --build orders-service
```

El servicio queda disponible en `http://localhost:3003` y su base de datos independiente en `localhost:27019`.
