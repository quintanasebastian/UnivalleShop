import Catalogo from '../../modules/catalog/infrastructure/ui/pages/Catalogo.jsx';
import Inicio from '../pages/Inicio.jsx';
import LoginPage from '../../modules/users/infrastructure/ui/pages/LoginPage.jsx';
import RegisterPage from '../../modules/users/infrastructure/ui/pages/RegisterPage.jsx';
import AreaPrivada from '../../modules/users/infrastructure/ui/pages/AreaPrivada.jsx';

export default function AppRouter({ services }) {
  const { pathname, search } = window.location;

  if (pathname === '/catalogo') {
    const categoria = new URLSearchParams(search).get('categoria');
    return <AreaPrivada consultarSesion={services.session}>{() => <Catalogo categoriaInicial={categoria} obtenerProductos={services.listProducts} obtenerProductoPorId={services.productDetail} />}</AreaPrivada>;
  }

  if (pathname === '/inicio') {
    return <AreaPrivada consultarSesion={services.session}>{(perfil) => <Inicio perfil={perfil} cerrarSesion={services.logout} />}</AreaPrivada>;
  }

  return pathname === '/registro'
    ? <RegisterPage enviarDatos={services.register} />
    : <LoginPage enviarDatos={services.login} />;
}
