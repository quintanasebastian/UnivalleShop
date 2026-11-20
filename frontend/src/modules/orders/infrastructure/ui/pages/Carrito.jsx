import { useState } from 'react';
import { Minus, Plus, ShoppingCart, Trash2 } from 'lucide-react';
import './Pedidos.css';

const moneda = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
});

export default function Carrito({
  carrito, cargando, errorCarga, actualizarCarrito, cambiarCantidad, quitarProducto, confirmarPedido,
}) {
  const [error, setError] = useState('');
  const [procesando, setProcesando] = useState(false);

  async function ejecutar(operacion) {
    setError('');
    setProcesando(true);
    try {
      actualizarCarrito(await operacion());
    } catch (fallo) {
      setError(fallo.message);
    } finally {
      setProcesando(false);
    }
  }

  async function confirmar() {
    setError('');
    setProcesando(true);
    try {
      const pedido = await confirmarPedido();
      window.location.assign(`/pedidos?confirmado=${encodeURIComponent(pedido.id)}`);
    } catch (fallo) {
      setError(fallo.message);
      setProcesando(false);
    }
  }

  const unidades = carrito?.items.reduce((total, item) => total + item.cantidad, 0) ?? 0;

  return (
    <main className="pedidos-contenedor">
      <h1>Tu carrito</h1>
      <p className="pedidos-subtitulo">
        {unidades} {unidades === 1 ? 'producto' : 'productos'} listos para confirmar.
      </p>

      {(error || errorCarga) && <p role="alert" className="pedido-mensaje pedido-mensaje-error">{error || errorCarga}</p>}
      {cargando && <p role="status">Cargando carrito…</p>}

      {!cargando && carrito?.items.length === 0 && (
        <div className="pedido-vacio">
          <ShoppingCart size={44} strokeWidth={1.4} />
          <p>Tu carrito está vacío.</p>
          <a className="tienda-accion" href="/catalogo">Explorar el catálogo</a>
        </div>
      )}

      {!cargando && carrito?.items.length > 0 && (
        <div className="pedidos-layout">
          <section className="pedidos-listado" aria-label="Productos del carrito">
            {carrito.items.map((item) => (
              <article className="pedido-linea" key={item.productoId}>
                <div className="pedido-linea-texto">
                  <strong>{item.nombre}</strong>
                  <span>{moneda.format(item.precioUnitario)} c/u</span>
                </div>

                <div className="cantidad-control" aria-label={`Cantidad de ${item.nombre}`}>
                  <button
                    type="button"
                    aria-label={`Quitar una unidad de ${item.nombre}`}
                    disabled={procesando || item.cantidad <= 1}
                    onClick={() => ejecutar(() => cambiarCantidad(item.productoId, item.cantidad - 1))}
                  >
                    <Minus size={17} />
                  </button>
                  <span>{item.cantidad}</span>
                  <button
                    type="button"
                    aria-label={`Agregar una unidad de ${item.nombre}`}
                    disabled={procesando || item.cantidad >= 20}
                    onClick={() => ejecutar(() => cambiarCantidad(item.productoId, item.cantidad + 1))}
                  >
                    <Plus size={17} />
                  </button>
                </div>

                <strong className="pedido-linea-subtotal">{moneda.format(item.subtotal)}</strong>

                <button
                  type="button"
                  className="pedido-quitar"
                  aria-label={`Eliminar ${item.nombre} del carrito`}
                  disabled={procesando}
                  onClick={() => ejecutar(() => quitarProducto(item.productoId))}
                >
                  <Trash2 size={18} />
                </button>
              </article>
            ))}
          </section>

          <aside className="pedido-resumen" aria-label="Resumen del pedido">
            <h2>Resumen</h2>
            <div><span>Subtotal</span><strong>{moneda.format(carrito.subtotal)}</strong></div>
            <div><span>Envío</span><strong>{moneda.format(0)}</strong></div>
            <div className="pedido-resumen-total"><span>Total</span><strong>{moneda.format(carrito.subtotal)}</strong></div>
            <button className="tienda-accion" type="button" disabled={procesando} onClick={confirmar}>
              {procesando ? 'Procesando…' : 'Confirmar pedido'}
            </button>
            <small>El pedido queda en estado pendiente y podrás verlo en “Mis pedidos”.</small>
          </aside>
        </div>
      )}
    </main>
  );
}
