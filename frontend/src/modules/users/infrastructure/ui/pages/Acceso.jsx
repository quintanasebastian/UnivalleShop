import { useRef, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import Marca from '../../../../../shared/ui/Marca.jsx';

export default function Acceso({ registro = false, enviarDatos }) {
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState('');
  const [ocupado, setOcupado] = useState(false);
  const pantalla = useRef(null);

  function moverCurva(evento) {
    if (evento.pointerType !== 'mouse' || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const caja = pantalla.current.getBoundingClientRect();
    pantalla.current.style.setProperty('--curva-x', `${(evento.clientX - caja.left) / caja.width * 22}px`);
    pantalla.current.style.setProperty('--curva-y', `${37 + (evento.clientY - caja.top) / caja.height * 22}%`);
  }

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
    <main className="tienda-login" ref={pantalla} onPointerMove={moverCurva} onPointerLeave={() => {
      pantalla.current.style.removeProperty('--curva-x');
      pantalla.current.style.removeProperty('--curva-y');
    }}>
      <div className="tienda-login-fondo" aria-hidden="true" />
      <div className="tienda-login-marca"><Marca /></div>
      <form className="tienda-login-form" onSubmit={enviar}>
        <h1>{registro ? 'Crear cuenta' : 'Iniciar sesión'}</h1>
        <p>Ingresa con tu correo institucional de Univalle.</p>
        {!registro && new URLSearchParams(location.search).get('registro') === 'ok' && <p role="status">Cuenta creada. Ya puedes iniciar sesión.</p>}
        {registro && <>
          <label htmlFor="nombres">Nombres</label>
          <input id="nombres" name="nombres" autoComplete="given-name" minLength={2} required />
          <label htmlFor="apellidos">Apellidos</label>
          <input id="apellidos" name="apellidos" autoComplete="family-name" minLength={2} required />
        </>}
        <label htmlFor="correo">Correo institucional</label>
        <input id="correo" name="correo" type="email" autoComplete="username" required />
        <label htmlFor="clave">Contraseña{registro && ' (mínimo 8 caracteres)'}</label>
        <div className="tienda-clave">
          <input id="clave" name="password" type={visible ? 'text' : 'password'} autoComplete={registro ? 'new-password' : 'current-password'} minLength={registro ? 8 : undefined} required />
          <button type="button" aria-label={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'} onClick={() => setVisible(!visible)}>
            {visible ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}
          </button>
        </div>
        {registro && <>
          <label htmlFor="tipo">Tipo de usuario</label>
          <select id="tipo" name="tipoUsuario" required defaultValue="">
            <option value="" disabled>Selecciona una opción</option>
            <option value="estudiante">Estudiante</option>
            <option value="docente">Docente</option>
            <option value="administrativo">Administrativo</option>
          </select>
        </>}
        {error && <p role="alert">{error}</p>}
        <button className="tienda-entrar" disabled={ocupado}>{ocupado ? 'Espera un momento…' : registro ? 'Crear cuenta' : 'Iniciar sesión'}</button>
        <p>{registro ? '¿Ya tienes cuenta? ' : '¿Aún no tienes cuenta? '}<a href={registro ? '/' : '/registro'}>{registro ? 'Inicia sesión' : 'Regístrate'}</a></p>
      </form>
    </main>
  );
}

