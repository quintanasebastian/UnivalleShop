import { useEffect, useMemo, useState } from 'react';
import {
  CheckCircle2, ChevronRight, Filter,
  GraduationCap, Package, Search, ShoppingBag,
  ShoppingCart, UserRound, X,
} from 'lucide-react';
import './Catalogo.css';

const CATEGORIAS = [
  { valor: '', etiqueta: 'Todas' },
  { valor: 'tecnologia', etiqueta: 'Tecnología' },
  { valor: 'libros', etiqueta: 'Libros' },
  { valor: 'papeleria', etiqueta: 'Papelería' },
  { valor: 'ropa', etiqueta: 'Ropa' },
  { valor: 'accesorios', etiqueta: 'Accesorios' },
  { valor: 'hogar', etiqueta: 'Hogar' },
  { valor: 'otros', etiqueta: 'Otros' },
];

const moneda = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
});

function ImagenProducto({ src, nombre, className = '' }) {
  const [fallo, setFallo] = useState(false);
  useEffect(() => setFallo(false), [src]);

  if (!src || fallo) {
    return (
      <div className={`imagen-vacia ${className}`} role="img" aria-label={`Sin imagen disponible para ${nombre}`}>
        <Package size={42} strokeWidth={1.3} />
      </div>
    );
  }

  return (
    <img
      className={className}
      src={src}
      alt={nombre}
      loading="lazy"
      onError={() => setFallo(true)}
    />
  );

}

function TarjetaProducto({ producto, onVer }) {
  const disponible = producto.stock > 0;
  return (
    <article className="producto">
      <ImagenProducto className="producto-imagen" src={producto.imagen} nombre={producto.nombre} />
      <div className="producto-info">
        <h3 title={producto.nombre}>{producto.nombre}</h3>
        <span className={`estado ${disponible ? 'disponible' : 'agotado'}`}>
          {disponible && <CheckCircle2 size={14} />}
          {disponible ? 'Disponible' : 'Agotado'}
        </span>
        <strong className="precio">{moneda.format(producto.precio)}</strong>
        <button className="boton-rojo" type="button" onClick={() => onVer(producto.id)}>
          Ver producto <ChevronRight size={17} />
        </button>
      </div>
    </article>
  );
}

function DetalleProducto({ producto, cargando, error, onCerrar }) {
  useEffect(() => {
    function cerrarConEscape(evento) {
      if (evento.key === 'Escape') onCerrar();
    }
    window.addEventListener('keydown', cerrarConEscape);
    return () => window.removeEventListener('keydown', cerrarConEscape);
  }, [onCerrar]);

  return (
    <div className="modal-fondo" onMouseDown={(e) => { if (e.target === e.currentTarget) onCerrar(); }}>
      <section className="modal" role="dialog" aria-modal="true" aria-label="Detalle del producto">
        <button className="cerrar-modal" type="button" aria-label="Cerrar detalle" onClick={onCerrar}><X size={22} /></button>
        {cargando && <p>Cargando producto...</p>}
        {error && <p className="error-mensaje">{error}</p>}
        {producto && !cargando && (
          <div className="detalle-grid">
            <ImagenProducto className="detalle-imagen" src={producto.imagen} nombre={producto.nombre} />
            <div>
              <span className="detalle-categoria">{CATEGORIAS.find((c) => c.valor === producto.categoria)?.etiqueta || producto.categoria}</span>
              <h2>{producto.nombre}</h2>
              <strong className="detalle-precio">{moneda.format(producto.precio)}</strong>
              <p>{producto.descripcion}</p>
              <p><strong>Existencias:</strong> {producto.stock}</p>
              <p className={`estado ${producto.stock > 0 ? 'disponible' : 'agotado'}`}>
                {producto.stock > 0 ? 'Disponible' : 'Agotado'}
              </p>
              <p className="nota-funcion">La integración con el carrito estará disponible cuando el servicio de pedidos esté conectado.</p>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

export default function Catalogo({ categoriaInicial, obtenerProductos, obtenerProductoPorId }) {
  const [categoria, setCategoria] = useState(() => CATEGORIAS.some(({ valor }) => valor === categoriaInicial) ? categoriaInicial : '');
  const [busqueda, setBusqueda] = useState('');
  const [minimo, setMinimo] = useState('');
  const [maximo, setMaximo] = useState('');
  const [soloDisponibles, setSoloDisponibles] = useState(false);
  const [orden, setOrden] = useState('recientes');
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [recargar, setRecargar] = useState(0);
  const [detalleId, setDetalleId] = useState(null);
  const [detalle, setDetalle] = useState(null);
  const [detalleError, setDetalleError] = useState('');
  const [cargandoDetalle, setCargandoDetalle] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    setCargando(true);
    setError('');
    obtenerProductos(categoria, controller.signal)
      .then(setProductos)
      .catch((e) => {
        if (e.name !== 'AbortError') {
          setProductos([]);
          setError('No fue posible cargar los productos. Comprueba que el microservicio de catálogo esté encendido.');
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setCargando(false);
      });
    return () => controller.abort();
  }, [categoria, recargar, obtenerProductos]);

  useEffect(() => {
    if (!detalleId) return;
    const controller = new AbortController();
    setDetalle(null);
    setDetalleError('');
    setCargandoDetalle(true);
    obtenerProductoPorId(detalleId, controller.signal)
      .then(setDetalle)
      .catch((e) => {
        if (e.name !== 'AbortError') setDetalleError('No se pudieron cargar los detalles del producto.');
      })
      .finally(() => {
        if (!controller.signal.aborted) setCargandoDetalle(false);
      });
    return () => controller.abort();
  }, [detalleId, obtenerProductoPorId]);

  const visibles = useMemo(() => {
    const termino = busqueda.trim().toLocaleLowerCase('es');
    const min = minimo === '' ? null : Number(minimo);
    const max = maximo === '' ? null : Number(maximo);

    return productos
      .filter((p) => p.estado !== false)
      .filter((p) => !termino || `${p.nombre} ${p.descripcion}`.toLocaleLowerCase('es').includes(termino))
      .filter((p) => min === null || p.precio >= min)
      .filter((p) => max === null || p.precio <= max)
      .filter((p) => !soloDisponibles || p.stock > 0)
      .sort((a, b) => {
        if (orden === 'menor') return a.precio - b.precio;
        if (orden === 'mayor') return b.precio - a.precio;
        if (orden === 'nombre') return a.nombre.localeCompare(b.nombre, 'es');
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      });
  }, [productos, busqueda, minimo, maximo, soloDisponibles, orden]);

  return (
    <>
      <header className="encabezado">
        <div className="encabezado-interior">
          <div className="marca"><ShoppingBag size={30} strokeWidth={1.9} /><span>UnivalleShop</span></div>
          <nav className="navegacion" aria-label="Navegación principal">
            <a className="nav-inactivo" href="/inicio">Inicio</a>
            <span className="nav-activo" aria-current="page">Catálogo</span>
            <span className="nav-inactivo" title="Pedidos pendientes de integrar">Mis pedidos</span>
          </nav>
          <label className="buscador"><Search size={21} /><input type="search" placeholder="Buscar productos..." aria-label="Buscar productos" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} /></label>
          <div className="iconos-usuario">
            <span title="Perfil pendiente de integrar" aria-label="Perfil pendiente de integrar"><UserRound size={25} /></span>
            <span title="Carrito pendiente de integrar" aria-label="Carrito pendiente de integrar" className="carrito"><ShoppingCart size={26} /><span className="carrito-numero">0</span></span>
          </div>
        </div>
      </header>

      <section className="banner" aria-label="Bienvenida a UnivalleShop">
        <div className="banner-interior">
          <div className="banner-simbolo"><GraduationCap size={42} strokeWidth={1.4} /></div>
          <div className="banner-texto">
            <h1>Encuentra lo que necesitas</h1>
          </div>
        </div>
      </section>

      <main className="contenido">
        <h2 className="titulo-seccion">Explorar catálogo</h2>
        <div className="catalogo-layout">
          <aside className="filtros" aria-label="Filtros del catálogo">
            <h3><Filter size={20} /> Filtros</h3>
            <fieldset>
              <legend>Categorías</legend>
              {CATEGORIAS.map((c) => (
                <label className={`categoria-opcion ${categoria === c.valor ? 'seleccionada' : ''}`} key={c.valor}>
                  <input type="radio" name="categoria" value={c.valor} checked={categoria === c.valor} onChange={() => setCategoria(c.valor)} />
                  {c.etiqueta}
                </label>
              ))}
            </fieldset>
            <fieldset>
              <legend>Rango de precio</legend>
              <div className="campos-precio">
                <label>Desde<input type="number" min="0" value={minimo} onChange={(e) => setMinimo(e.target.value)} placeholder="$ 0" /></label>
                <label>Hasta<input type="number" min="0" value={maximo} onChange={(e) => setMaximo(e.target.value)} placeholder="Sin límite" /></label>
              </div>
            </fieldset>
            <fieldset>
              <legend>Disponibilidad</legend>
              <label className="filtro-check"><input type="checkbox" checked={soloDisponibles} onChange={(e) => setSoloDisponibles(e.target.checked)} /> Solo productos disponibles</label>
            </fieldset>
          </aside>

          <section className="resultados" aria-label="Lista de productos">
            <div className="resultados-barra">
              <span>{cargando ? 'Cargando productos...' : `${visibles.length} producto${visibles.length === 1 ? '' : 's'} encontrado${visibles.length === 1 ? '' : 's'}`}</span>
              <label>Ordenar por:
                <select value={orden} onChange={(e) => setOrden(e.target.value)}>
                  <option value="recientes">Más recientes</option>
                  <option value="menor">Menor precio</option>
                  <option value="mayor">Mayor precio</option>
                  <option value="nombre">Nombre (A-Z)</option>
                </select>
              </label>
            </div>
            {cargando && <div className="mensaje">Cargando productos del catálogo...</div>}
            {!cargando && error && <div className="mensaje error-mensaje"><p>{error}</p><button type="button" className="boton-rojo" onClick={() => setRecargar((n) => n + 1)}>Reintentar</button></div>}
            {!cargando && !error && visibles.length === 0 && <div className="mensaje"><Package size={38} /><p>No hay productos que coincidan con los filtros seleccionados.</p></div>}
            {!cargando && !error && visibles.length > 0 && <div className="productos-grid">{visibles.map((p) => <TarjetaProducto key={p.id} producto={p} onVer={setDetalleId} />)}</div>}
          </section>
        </div>
      </main>
      {detalleId && <DetalleProducto producto={detalle} cargando={cargandoDetalle} error={detalleError} onCerrar={() => setDetalleId(null)} />}
    </>
  );
}
