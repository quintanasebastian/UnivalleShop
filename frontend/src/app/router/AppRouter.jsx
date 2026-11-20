import Catalogo from '../../modules/catalog/infrastructure/ui/pages/Catalogo.jsx';
import Inicio from '../pages/Inicio.jsx';
import LoginPage from '../../modules/users/infrastructure/ui/pages/LoginPage.jsx';
import RegisterPage from '../../modules/users/infrastructure/ui/pages/RegisterPage.jsx';
import AreaPrivada from '../../modules/users/infrastructure/ui/pages/AreaPrivada.jsx';
import Carrito from '../../modules/orders/infrastructure/ui/pages/Carrito.jsx';
import MisPedidos from '../../modules/orders/infrastructure/ui/pages/MisPedidos.jsx';

export default function AppRouter({ services }) {
  const { pathname, search } = window.location;

  if (pathname === '/catalogo') {
    const categoria = new URLSearchParams(search).get('categoria');
    return <AreaPrivada consultarSesion={services.session}>{() => <Catalogo categoriaInicial={categoria} obtenerProductos={services.listProducts} obtenerProductoPorId={services.productDetail} obtenerCarrito={services.getCart} agregarAlCarrito={services.addToCart} />}</AreaPrivada>;
  }

  if (pathname === '/carrito') {
    return <AreaPrivada consultarSesion={services.session}>{() => <Carrito obtenerCarrito={services.getCart} cambiarCantidad={services.changeCartItem} quitarProducto={services.removeCartItem} confirmarPedido={services.checkout} />}</AreaPrivada>;
  }

  if (pathname === '/pedidos') {
    return <AreaPrivada consultarSesion={services.session}>{() => <MisPedidos listarPedidos={services.listOrders} verPedido={services.orderDetail} />}</AreaPrivada>;
  }

  if (pathname === '/inicio') {
    return <AreaPrivada consultarSesion={services.session}>{(perfil) => <Inicio perfil={perfil} cerrarSesion={services.logout} />}</AreaPrivada>;
  }

  return pathname === '/registro'
    ? <RegisterPage enviarDatos={services.register} />
    : <LoginPage enviarDatos={services.login} />;
}
