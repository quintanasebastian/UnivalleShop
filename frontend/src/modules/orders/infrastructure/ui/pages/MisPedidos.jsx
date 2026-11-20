import { useEffect, useState } from 'react';
import { Package } from 'lucide-react';
import './Pedidos.css';

const moneda = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
});

const ETIQUETAS = {
  pendiente: 'Pendiente',
  confirmado: 'Confirmado',
  cancelado: 'Cancelado',
};

function fecha(valor) {
  if (!valor) return '—';
  return new Date(valor).toLocaleString('es-CO', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

export default function MisPedidos({ listarPedidos, verPedido }) {
  const [pedidos, setPedidos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [detalle, setDetalle] = useState(null);
  const [detalleId, setDetalleId] = useState('');
  const [cargandoDetalle, setCargandoDetalle] = useState(false);
  const confirmado = new URLSearchParams(window.location.search).get('confirmado');

  useEffect(() => {
    const control = new AbortController();
    listarPedidos(control.signal)
      .then((respuesta) => {
        if (!control.signal.aborted) setPedidos(respuesta);
      })
      .catch((fallo) => {
        if (fallo.name !== 'AbortError') setError(fallo.message);
      })
      .finally(() => {
        if (!control.signal.aborted) setCargando(false);
      });
    return () => control.abort();
  }, [listarPedidos]);

  async function abrirDetalle(id) {
    setError('');
    setDetalle(null);
    setDetalleId(id);
    setCargandoDetalle(true);
    try {
      setDetalle(await verPedido(id));
    } catch (fallo) {
      setError(fallo.message);
    } finally {
      setCargandoDetalle(false);
    }
  }

  return (
    <main className="pedidos-contenedor">
      <h1>Mis pedidos</h1>
      <p className="pedidos-subtitulo">Consulta el historial y el detalle de tus compras.</p>

      {confirmado && (
        <p role="status" className="pedido-mensaje pedido-mensaje-exito">
          Pedido confirmado. Su número de referencia es {confirmado.slice(-8).toUpperCase()}.
        </p>
      )}
      {error && <p role="alert" className="pedido-mensaje pedido-mensaje-error">{error}</p>}
      {cargando && <p role="status">Cargando pedidos…</p>}

      {!cargando && pedidos.length === 0 && (
        <div className="pedido-vacio">
          <Package size={44} strokeWidth={1.4} />
          <p>Aún no tienes pedidos.</p>
          <a className="tienda-accion" href="/catalogo">Explorar el catálogo</a>
        </div>
      )}

      {!cargando && pedidos.length > 0 && (
        <div className="pedidos-listado">
          {pedidos.map((pedido) => (
            <article className="pedido-tarjeta" key={pedido.id}>
              <div className="pedido-cabecera">
                <div>
                  <strong>Pedido #{pedido.id.slice(-8).toUpperCase()}</strong>
                  <span>{fecha(pedido.createdAt)}</span>
                </div>
                <span className={`pedido-estado estado-${pedido.estado}`}>
                  {ETIQUETAS[pedido.estado] ?? pedido.estado}
                </span>
                <strong className="pedido-total">{moneda.format(pedido.total)}</strong>
                <button
                  type="button"
                  className="boton-rojo"
                  disabled={cargandoDetalle && detalleId === pedido.id}
                  onClick={() => {
                    if (detalleId === pedido.id) {
                      setDetalleId(null); // Cierra el detalle si ya está abierto
                    } else {
                      abrirDetalle(pedido.id);
                    }
                  }}
                >
                  {detalleId === pedido.id && !cargandoDetalle ? 'Ocultar detalle' : 'Ver detalle'}
                </button>
              </div>

              {detalleId === pedido.id && (
                <div className="pedido-detalle">
                  {cargandoDetalle && <p role="status">Cargando detalle…</p>}
                  {!cargandoDetalle && detalle && (
                    <>
                      {detalle.items.map((item) => (
                        <div className="pedido-linea" key={item.productoId}>
                          <div className="pedido-linea-texto">
                            <strong>{item.nombre}</strong>
                            <span>{item.cantidad} × {moneda.format(item.precioUnitario)}</span>
                          </div>
                          <strong className="pedido-linea-subtotal">{moneda.format(item.subtotal)}</strong>
                        </div>
                      ))}
                      <div className="pedido-detalle-totales">
                        <span>Subtotal</span><strong>{moneda.format(detalle.subtotal)}</strong>
                        <span>Total</span><strong>{moneda.format(detalle.total)}</strong>
                      </div>
                    </>
                  )}
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
