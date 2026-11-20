import { useEffect, useState } from 'react';
import { LogOut } from 'lucide-react';
import Marca from '../../shared/ui/Marca.jsx';

const enlaces = [
  ['/inicio', 'Inicio'],
  ['/catalogo', 'Catálogo'],
  ['/pedidos', 'Mis pedidos'],
  ['/carrito', 'Carrito'],
];

export default function TiendaPrivada({ ruta, obtenerCarrito, cerrarSesion, children }) {
  const [estadoCarrito, setEstadoCarrito] = useState(null);
  const [saliendo, setSaliendo] = useState(false);
  const [errorSesion, setErrorSesion] = useState('');

  useEffect(() => {
    const control = new AbortController();
    obtenerCarrito(control.signal)
      .then((datos) => {
        if (!control.signal.aborted) setEstadoCarrito((actual) => actual ?? { datos });
      })
      .catch((fallo) => {
        if (!control.signal.aborted) setEstadoCarrito((actual) => actual ?? { error: fallo.message });
      });
    return () => control.abort();
  }, [obtenerCarrito]);

  function actualizarCarrito(datos) {
    setEstadoCarrito({ datos });
  }

  async function salir() {
    setErrorSesion('');
    setSaliendo(true);
    try {
      await cerrarSesion();
      window.location.assign('/');
    } catch (fallo) {
      setErrorSesion(fallo.message);
      setSaliendo(false);
    }
  }

  const unidades = estadoCarrito?.datos?.items.reduce((total, item) => total + item.cantidad, 0) ?? 0;

  return (
    <div className="tienda-privada">
      <header className="tienda-barra">
        <a className="tienda-barra-marca" href="/inicio" draggable={false}><Marca /></a>

        <nav aria-label="Navegación principal">
          {enlaces.map(([href, etiqueta]) => {
            const esCarrito = href === '/carrito';
            return (
              <a
                key={href}
                href={href}
                aria-current={ruta === href ? 'page' : undefined}
                aria-label={esCarrito ? `Carrito, ${unidades} ${unidades === 1 ? 'producto' : 'productos'}` : undefined}
                draggable={false}
              >
                {etiqueta}
                {esCarrito && <span className="tienda-conteo" aria-hidden="true">{unidades > 99 ? '99+' : unidades}</span>}
              </a>
            );
          })}
        </nav>

        <button type="button" onClick={salir} disabled={saliendo}>
          Cerrar sesión <LogOut aria-hidden="true" />
        </button>
      </header>

      {errorSesion && <p className="tienda-error-sesion" role="alert">{errorSesion}</p>}
      {children({ estadoCarrito, actualizarCarrito })}
    </div>
  );
}
