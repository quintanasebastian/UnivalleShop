import { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle2, Eye, EyeOff, GraduationCap, LockKeyhole, Mail, UserRound } from 'lucide-react';
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
        <span className="acceso-logo">
          <img src="/interfaz/logohorizontal.png" alt="UnivalleShop" width="2172" height="724" />
        </span>
      </header>

      <main className="acceso-contenido">
        <section className="acceso-panel" aria-labelledby="acceso-titulo" tabIndex={0}>
          <div className="acceso-interior">
            <h1 id="acceso-titulo">{titulo}</h1>

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
                    <div className="acceso-control">
                      <UserRound aria-hidden="true" />
                      <input id="nombres" name="nombres" autoComplete="given-name" placeholder="Tus nombres" minLength={2} required />
                    </div>
                  </div>
                  <div className="acceso-campo">
                    <label htmlFor="apellidos">Apellidos</label>
                    <div className="acceso-control">
                      <UserRound aria-hidden="true" />
                      <input id="apellidos" name="apellidos" autoComplete="family-name" placeholder="Tus apellidos" minLength={2} required />
                    </div>
                  </div>
                </div>
              )}

              <div className="acceso-campo">
                <label htmlFor="correo">Correo institucional</label>
                <div className="acceso-control">
                  <Mail aria-hidden="true" />
                  <input id="correo" name="correo" type="email" autoComplete="username" placeholder="Ingresa tu correo institucional" required />
                </div>
              </div>

              <div className="acceso-campo">
                <label htmlFor="clave">Contraseña</label>
                <div className="acceso-control acceso-clave">
                  <LockKeyhole aria-hidden="true" />
                  <input
                    id="clave"
                    name="password"
                    type={visible ? 'text' : 'password'}
                    autoComplete={registro ? 'new-password' : 'current-password'}
                    placeholder="Ingresa tu contraseña"
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
                  <div className="acceso-control">
                    <GraduationCap aria-hidden="true" />
                    <select id="tipo" name="tipoUsuario" required defaultValue="">
                      <option value="" disabled>Selecciona una opción</option>
                      <option value="estudiante">Estudiante</option>
                      <option value="docente">Docente</option>
                      <option value="administrativo">Administrativo</option>
                    </select>
                  </div>
                </div>
              )}

              {error && (
                <p className="acceso-aviso acceso-aviso-error" role="alert">
                  <AlertCircle aria-hidden="true" /> {error}
                </p>
              )}

              <button className="tienda-accion acceso-enviar" type="submit" disabled={ocupado}>
                {ocupado ? 'Espera un momento…' : registro ? 'Crear cuenta' : 'Ingresar'}
              </button>
            </form>

            <p className="acceso-alternativa">
              {registro ? '¿Ya tienes una cuenta? ' : '¿No tienes una cuenta? '}
              <a href={registro ? '/' : '/registro'}>{registro ? 'Inicia sesión aquí' : 'Regístrate aquí'}</a>
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
