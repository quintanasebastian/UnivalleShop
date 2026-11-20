import { useEffect, useState } from 'react';
import { AlertCircle, ArrowRight, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import Marca from '../../../../../shared/ui/Marca.jsx';
import './Acceso.css';

export default function Acceso({ registro = false, enviarDatos }) {
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState('');
  const [ocupado, setOcupado] = useState(false);
  const titulo = registro ? 'Crear cuenta' : 'Iniciar sesión';
  const cuentaCreada = !registro && new URLSearchParams(window.location.search).get('registro') === 'ok';

  useEffect(() => {
    document.title = `${titulo} | UnivalleShop`;
  }, [titulo]);

  async function enviar(evento) {
    evento.preventDefault();
    const campos = Object.fromEntries(new FormData(evento.currentTarget));
    setError('');
    setOcupado(true);
    try {
      await enviarDatos(campos);
      window.location.assign(registro ? '/?registro=ok' : '/inicio');
    } catch (fallo) {
      setError(fallo.message);
    } finally {
      setOcupado(false);
    }
  }

  return (
    <div className="acceso">
      <header className="acceso-cabecera">
        <div className="acceso-institucional">
          <img src="/interfaz/firma-universidad-del-valle.png" alt="Universidad del Valle" width="424" height="52" />
        </div>
      </header>

      <main className="acceso-contenido">
        <section className="acceso-panel" aria-labelledby="acceso-titulo" tabIndex={0}>
          <div className="acceso-interior">
            <Marca />
            <h1 id="acceso-titulo">{titulo}</h1>
            <p className="acceso-intro">
              {registro ? 'Regístrate con tu correo institucional de Univalle.' : 'Ingresa con tu correo institucional de Univalle.'}
            </p>

            {cuentaCreada && (
              <p className="acceso-aviso acceso-aviso-exito" role="status">
                <CheckCircle2 aria-hidden="true" /> Cuenta creada. Ya puedes iniciar sesión.
              </p>
            )}

            <form className="acceso-formulario" onSubmit={enviar}>
              {registro && (
                <div className="acceso-nombre">
                  <div className="acceso-campo">
                    <label htmlFor="nombres">Nombres</label>
                    <input id="nombres" name="nombres" autoComplete="given-name" minLength={2} required />
                  </div>
                  <div className="acceso-campo">
                    <label htmlFor="apellidos">Apellidos</label>
                    <input id="apellidos" name="apellidos" autoComplete="family-name" minLength={2} required />
                  </div>
                </div>
              )}

              <div className="acceso-campo">
                <label htmlFor="correo">Correo institucional</label>
                <input id="correo" name="correo" type="email" autoComplete="username" placeholder="usuario@correounivalle.edu.co" required />
              </div>

              <div className="acceso-campo">
                <label htmlFor="clave">Contraseña</label>
                <div className="acceso-clave">
                  <input
                    id="clave"
                    name="password"
                    type={visible ? 'text' : 'password'}
                    autoComplete={registro ? 'new-password' : 'current-password'}
                    minLength={registro ? 8 : undefined}
                    aria-describedby={registro ? 'acceso-clave-ayuda' : undefined}
                    required
                  />
                  <button type="button" aria-label={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'} onClick={() => setVisible(!visible)}>
                    {visible ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}
                  </button>
                </div>
                {registro && <small id="acceso-clave-ayuda">Mínimo 8 caracteres.</small>}
              </div>

              {registro && (
                <div className="acceso-campo">
                  <label htmlFor="tipo">Tipo de usuario</label>
                  <select id="tipo" name="tipoUsuario" required defaultValue="">
                    <option value="" disabled>Selecciona una opción</option>
                    <option value="estudiante">Estudiante</option>
                    <option value="docente">Docente</option>
                    <option value="administrativo">Administrativo</option>
                  </select>
                </div>
              )}

              {error && (
                <p className="acceso-aviso acceso-aviso-error" role="alert">
                  <AlertCircle aria-hidden="true" /> {error}
                </p>
              )}

              <button className="tienda-accion acceso-enviar" type="submit" disabled={ocupado}>
                {ocupado ? 'Espera un momento…' : titulo}
                {!ocupado && <ArrowRight aria-hidden="true" />}
              </button>
            </form>

            <p className="acceso-alternativa">
              {registro ? '¿Ya tienes cuenta? ' : '¿Aún no tienes cuenta? '}
              <a href={registro ? '/' : '/registro'}>{registro ? 'Inicia sesión' : 'Regístrate'}</a>
            </p>
          </div>
        </section>

        <img
          className="acceso-imagen"
          src="/interfaz/ardillaunivalle.png"
          alt="Ardilla de UnivalleShop con bolsas de compras y artículos universitarios"
          width="900"
          height="1125"
          loading="lazy"
        />
      </main>
    </div>
  );
}

