# Frontend - UnivalleShop

Interfaz web de la tienda universitaria desarrollada con React y Vite.

## Cómo ejecutarlo

Desde la carpeta `frontend`, instala las dependencias e inicia el servidor de desarrollo:

```bash
npm install
npm run dev
```

La aplicación abre en `http://localhost:5173` y se conecta al `api-gateway` en el puerto `8080` (debe estar corriendo con `docker compose up`).

## Estructura

El proyecto está organizado por módulos siguiendo arquitectura hexagonal:

- `src/app`: rutas, páginas principales y configuración de proveedores.
- `src/modules/users`: inicio de sesión y registro con correo institucional.
- `src/modules/catalog`: listado, filtros y detalle de productos.
- `src/modules/orders`: carrito de compras y historial de pedidos.
- `src/shared`: cliente HTTP y componentes compartidos.
