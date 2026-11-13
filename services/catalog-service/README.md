# Catalog Service

Microservicio de catálogo de productos de **Univalle Shop**, construido con NestJS, TypeScript y MongoDB (Mongoose).

## Arquitectura

El servicio aplica Arquitectura Hexagonal y principios SOLID:

```
src/modules/catalog/
├── domain/
│   ├── entities/              # Product y reglas de negocio
│   └── ports/
│       └── repositories/      # Contrato del repositorio
├── application/
│   └── use-cases/             # Casos de uso
├── infrastructure/
│   ├── adapters/              # Adaptador MongoDB del repositorio
│   └── schemas/               # Esquema Mongoose
└── presentation/
    ├── controllers/           # Controlador HTTP
    └── dto/                   # DTOs de entrada
```

- `domain` no depende de NestJS, Mongoose ni HTTP.
- Los casos de uso dependen únicamente del puerto `ProductRepository`.
- El repositorio MongoDB implementa el puerto de dominio.
- El controlador HTTP depende de los casos de uso de la capa de aplicación.

## Variables de entorno

| Variable      | Valor por defecto                                      |
| ------------- | ------------------------------------------------------ |
| `PORT`        | `3002`                                                 |
| `MONGODB_URI` | `mongodb://localhost:27017/univalle_shop_catalog`      |

## Endpoints

| Método   | Ruta                                   | Descripción                                |
| -------- | -------------------------------------- | ------------------------------------------ |
| `POST`   | `/products`                            | Crear un producto                          |
| `GET`    | `/products`                            | Listar productos                           |
| `GET`    | `/products?categoria=tecnologia`       | Listar productos por categoría             |
| `GET`    | `/products/:id`                        | Obtener un producto por id                 |
| `PATCH`  | `/products/:id`                        | Actualizar un producto                     |
| `DELETE` | `/products/:id`                        | Eliminar un producto                       |

### Categorías válidas

`tecnologia`, `libros`, `papeleria`, `ropa`, `accesorios`, `hogar`, `otros`.

### Ejemplo de creación

```json
{
  "nombre": "Calculadora científica",
  "descripcion": "Calculadora con funciones avanzadas para ingeniería.",
  "precio": 85900.5,
  "stock": 25,
  "categoria": "tecnologia",
  "imagen": "https://cdn.univalle.edu.co/productos/calculadora.jpg"
}
```

## Desarrollo

```bash
npm install
npm run start:dev
```

## Producción con Docker

Desde la raíz del repositorio:

```bash
docker compose up --build catalog-service
```

El servicio queda disponible en `http://localhost:3002` y su base de datos independiente en `localhost:27018`.
