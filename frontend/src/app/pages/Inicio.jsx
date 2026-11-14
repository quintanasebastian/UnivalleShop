import { useState } from 'react';
import { ArrowRight, Backpack, Laptop, LogOut, Notebook, UserRound } from 'lucide-react';
import Marca from '../../shared/ui/Marca.jsx';

const categorias = [
  ['tecnologia', 'Tecnología', 'Para tus clases y proyectos', Laptop],
  ['papeleria', 'Papelería', 'Apunta todas tus ideas', Notebook],
  ['accesorios', 'Accesorios', 'Para acompañarte cada día', Backpack],
];

export default function Inicio({ perfil, cerrarSesion }) {
  const [error, setError] = useState('');

  async function salir() {
    try {
      await cerrarSesion();
      window.location.assign('/');
    } catch (fallo) {
      setError(fallo.message);
    }
  }

  return (
    <div className="tienda-inicio">
      <header className="tienda-barra">
        <a href="/inicio" draggable={false}>
          <Marca />
        </a>

        <nav aria-label="Navegación principal">
          <a href="/inicio" aria-current="page" draggable={false}>
            Inicio
          </a>
          <a href="/catalogo" draggable={false}>
            Catálogo
          </a>
        </nav>

        <button type="button" onClick={salir}>
          Cerrar sesión <LogOut aria-hidden="true" />
        </button>
      </header>

      <main className="tienda-portada">
        <div className="tienda-portada-texto">
          {error && <p role="alert">{error}</p>}

          <div className="tienda-saludo">
            <span className="tienda-saludo-icono">
              <UserRound aria-hidden="true" />
            </span>
            <div>
              <strong>¡Hola, {perfil.nombres}!</strong>
              <p>Bienvenido a tu tienda universitaria</p>
            </div>
          </div>

          <h1>Tu vida en la U. Todo en un mismo lugar.</h1>
          <p className="tienda-intro">
            Encuentra lo que necesitas para estudiar, crear y llevar contigo al campus.
          </p>
          <a className="tienda-accion" href="/catalogo" draggable={false}>
            Explorar el catálogo <ArrowRight aria-hidden="true" />
          </a>

          <section className="tienda-categorias" aria-labelledby="titulo-categorias">
            <h2 id="titulo-categorias">¿Qué necesitas hoy?</h2>
            <div>
              {categorias.map(([valor, nombre, descripcion, Icono]) => (
                <a key={valor} href={`/catalogo?categoria=${valor}`} draggable={false}>
                  <span className="tienda-categoria-icono">
                    <Icono aria-hidden="true" />
                  </span>
                  <span>
                    <strong>{nombre}</strong>
                    <small>{descripcion}</small>
                  </span>
                  <ArrowRight className="tienda-flecha" aria-hidden="true" />
                </a>
              ))}
            </div>
          </section>
        </div>

        <img
          src="/interfaz/ardillaunivalle.png"
          alt="Ardilla de Univalle con bolsas de compras y artículos universitarios"
        />
      </main>
    </div>
  );
}