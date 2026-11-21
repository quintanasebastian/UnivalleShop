import { useEffect, useMemo, useState } from 'react';
import {
  CheckCircle2, Filter,
  GraduationCap, Package, Search, ShoppingCart, X,
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

function TarjetaProducto({ producto, onVer, onAgregar }) {
  const disponible = producto.stock > 0;
  const [estadoCarrito, setEstadoCarrito] = useState('');
  const [error, setError] = useState('');
  // Cada vez que se agrega, cambia la clave y se repite la animación del "+1".
  const [pulsos, setPulsos] = useState(0);

  useEffect(() => {
    if (estadoCarrito !== 'agregado') return undefined;
    const temporizador = setTimeout(() => setEstadoCarrito(''), 900);
    return () => clearTimeout(temporizador);
  }, [estadoCarrito, pulsos]);

  async function agregar() {
    setEstadoCarrito('agregando');
    setError('');
    try {
      await onAgregar({
        productoId: producto.id ?? producto._id,
        nombre: producto.nombre,
        precioUnitario: producto.precio,
        cantidad: 1,
      });
      setPulsos((n) => n + 1);
      setEstadoCarrito('agregado');
    } catch (fallo) {
      setEstadoCarrito('');
      setError(fallo.message);
    }
  }

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
        <div className="producto-acciones">
          <button className="boton-rojo" type="button" onClick={() => onVer(producto.id)}>
            Ver producto
          </button>
          <button
            className={`boton-carrito ${estadoCarrito === 'agregado' ? 'agregado' : ''} ${disponible ? '' : 'agotado'}`}
            type="button"
            aria-label={`Agregar ${producto.nombre} al carrito`}
            title={disponible ? 'Agregar al carrito' : 'Producto agotado'}
            disabled={!disponible || estadoCarrito === 'agregando'}
            onClick={agregar}
          >
            <ShoppingCart size={19} />
            {pulsos > 0 && <span key={pulsos} className="boton-carrito-mas" aria-hidden="true">+1</span>}
          </button>
        </div>
        <span className="solo-lectores" role="status">
          {pulsos > 0 ? `${producto.nombre} agregado al carrito (${pulsos})` : ''}
        </span>
        {error && <p className="producto-aviso" role="alert">{error}</p>}
      </div>
    </article>
  );
}

function DetalleProducto({ producto, cargando, error, onCerrar, onAgregar }) {
  const [cantidad, setCantidad] = useState(1);
  const [agregando, setAgregando] = useState(false);
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    setCantidad(1);
    setMensaje('');
  }, [producto?.id ?? producto?._id]);

  useEffect(() => {
    function cerrarConEscape(evento) {
      if (evento.key === 'Escape') onCerrar();
    }
    window.addEventListener('keydown', cerrarConEscape);
    return () => window.removeEventListener('keydown', cerrarConEscape);
  }, [onCerrar]);

  async function agregar() {
    setAgregando(true);
    setMensaje('');
    try {
      await onAgregar({
        productoId: producto.id ?? producto._id,
        nombre: producto.nombre,
        precioUnitario: producto.precio,
        cantidad,
      });
      setMensaje('Producto agregado al carrito.');
    } catch (fallo) {
      setMensaje(fallo.message);
    } finally {
      setAgregando(false);
    }
  }

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
              {producto.stock > 0 && (
                <div className="detalle-carrito">
                  <label htmlFor="cantidad-carrito">Cantidad</label>
                  <input
                    id="cantidad-carrito"
                    type="number"
                    min="1"
                    max="20"
                    value={cantidad}
                    onChange={(evento) => setCantidad(Number(evento.target.value))}
                  />
                  <button className="boton-rojo" type="button" disabled={agregando} onClick={agregar}>
                    {agregando ? 'Agregando…' : 'Agregar al carrito'}
                  </button>
                  {mensaje && <p role="status">{mensaje}</p>}
                </div>
              )}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

export default function Catalogo({ categoriaInicial, obtenerProductos, obtenerProductoPorId, agregarAlCarrito }) {
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
      <section className="banner" aria-label="Bienvenida a UnivalleShop">
        <div className="banner-interior">
          <div className="banner-simbolo"><GraduationCap size={42} strokeWidth={1.4} /></div>
          <div className="banner-texto">
            <h1>Encuentra lo que necesitas</h1>
          </div>
          <label className="buscador">
            <Search size={21} aria-hidden="true" />
            <input
              type="search"
              placeholder="Buscar productos..."
              aria-label="Buscar productos"
              value={busqueda}
              onChange={(evento) => setBusqueda(evento.target.value)}
            />
          </label>
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
            {!cargando && !error && visibles.length > 0 && <div className="productos-grid">{visibles.map((p) => <TarjetaProducto key={p.id} producto={p} onVer={setDetalleId} onAgregar={agregarAlCarrito} />)}</div>}
          </section>
        </div>
      </main>
      {detalleId && <DetalleProducto producto={detalle} cargando={cargandoDetalle} error={detalleError} onCerrar={() => setDetalleId(null)} onAgregar={agregarAlCarrito} />}
    </>
  );
}
