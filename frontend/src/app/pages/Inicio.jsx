import { ArrowRight, Headphones, Laptop, NotebookPen, UserRound } from 'lucide-react';

const categorias = [
  ['tecnologia', 'Tecnología', 'Para tus clases y proyectos', Laptop],
  ['papeleria', 'Papelería', 'Apunta todas tus ideas', NotebookPen],
  ['accesorios', 'Accesorios', 'Para acompañarte cada día', Headphones],
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
            <p>Bienvenido/a a tu tienda universitaria</p>
          </div>
        </div>

        <h1>
          Tu vida en la U.{' '}
          <span className="tienda-titulo-acento">
            Todo en un mismo <span className="tienda-subrayado">lugar</span>.
          </span>
        </h1>
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

      <div className="tienda-mascota">
        <img
          src="/interfaz/ardilla.png"
          alt="Ardilla de UnivalleShop caminando con su mochila y una bolsa de compras"
          width="1345"
          height="1169"
        />
      </div>
    </main>
  );
}
