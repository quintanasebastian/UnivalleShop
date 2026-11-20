import Catalogo from '../../modules/catalog/infrastructure/ui/pages/Catalogo.jsx';
import Inicio from '../pages/Inicio.jsx';
import TiendaPrivada from '../pages/TiendaPrivada.jsx';
import LoginPage from '../../modules/users/infrastructure/ui/pages/LoginPage.jsx';
import RegisterPage from '../../modules/users/infrastructure/ui/pages/RegisterPage.jsx';
import AreaPrivada from '../../modules/users/infrastructure/ui/pages/AreaPrivada.jsx';
import Carrito from '../../modules/orders/infrastructure/ui/pages/Carrito.jsx';
import MisPedidos from '../../modules/orders/infrastructure/ui/pages/MisPedidos.jsx';

const paginasPrivadas = {
  '/inicio': ({ perfil }) => <Inicio perfil={perfil} />,
  '/catalogo': ({ services, search, actualizarCarrito }) => (
    <Catalogo
      categoriaInicial={new URLSearchParams(search).get('categoria')}
      obtenerProductos={services.listProducts}
      obtenerProductoPorId={services.productDetail}
      agregarAlCarrito={async (producto) => actualizarCarrito(await services.addToCart(producto))}
    />
  ),
  '/pedidos': ({ services }) => (
    <MisPedidos listarPedidos={services.listOrders} verPedido={services.orderDetail} />
  ),
  '/carrito': ({ services, estadoCarrito, actualizarCarrito }) => (
    <Carrito
      carrito={estadoCarrito?.datos}
      cargando={!estadoCarrito}
      errorCarga={estadoCarrito?.error}
      actualizarCarrito={actualizarCarrito}
      cambiarCantidad={services.changeCartItem}
      quitarProducto={services.removeCartItem}
      confirmarPedido={services.checkout}
    />
  ),
};

export default function AppRouter({ services }) {
  const { pathname, search } = window.location;
  const mostrarPagina = paginasPrivadas[pathname];

  if (!mostrarPagina) {
    return pathname === '/registro'
      ? <RegisterPage enviarDatos={services.register} />
      : <LoginPage enviarDatos={services.login} />;
  }

  return (
    <AreaPrivada consultarSesion={services.session}>
      {(perfil) => (
        <TiendaPrivada ruta={pathname} obtenerCarrito={services.getCart} cerrarSesion={services.logout}>
          {({ estadoCarrito, actualizarCarrito }) => mostrarPagina({
            perfil, services, search, estadoCarrito, actualizarCarrito,
          })}
        </TiendaPrivada>
      )}
    </AreaPrivada>
  );
}
