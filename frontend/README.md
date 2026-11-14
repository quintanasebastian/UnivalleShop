# Frontend de UnivalleShop

En PowerShell, dentro de esta carpeta, ejecuta:

```powershell
npm.cmd ci
npm.cmd run dev
```

Abre http://localhost:5173. **Regístrate** muestra el formulario de registro.
El catálogo carga los productos del microservicio de Catálogo (puerto 3002).

El registro llama a `POST /users` en el microservicio de Usuarios (puerto 3001).
Para iniciar sesión y acceder a las áreas privadas, el servicio expone `POST`, `GET` y `DELETE /sesion`.

## Arquitectura del frontend

- `src/app` contiene las rutas, la página de Inicio y la composición de dependencias.
- `src/modules/users` contiene el modelo de usuario, la validación de correo,
  el puerto AuthPort, los casos de uso y los adaptadores React y HTTP.
- `src/modules/catalog` contiene el modelo de producto, el puerto ProductRepository,
  las consultas de catálogo y detalle, y sus adaptadores React y HTTP.
- `src/shared` contiene el cliente HTTP y los componentes reutilizables.

React recibe las operaciones desde la composición en app. Los casos de uso
reciben un puerto, y los adaptadores HTTP implementan ese contrato. Los servicios
de Usuarios y Catálogo conservan sus APIs y bases independientes. El frontend
se compila como una sola aplicación.

Ejecuta `npm.cmd run typecheck` para comprobar los archivos TypeScript y
`npm.cmd run build` para compilar la aplicación.
