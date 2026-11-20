import { ArrowRight, Backpack, Laptop, Notebook, UserRound } from 'lucide-react';

const categorias = [
  ['tecnologia', 'Tecnología', 'Para tus clases y proyectos', Laptop],
  ['papeleria', 'Papelería', 'Apunta todas tus ideas', Notebook],
  ['accesorios', 'Accesorios', 'Para acompañarte cada día', Backpack],
];

export default function Inicio({ perfil }) {
  return (
    <main className="tienda-portada">
      <div className="tienda-portada-texto">
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
  );
}
