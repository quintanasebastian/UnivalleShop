import { useEffect, useState } from 'react';

export default function AreaPrivada({ children, consultarSesion }) {
  const [perfil, setPerfil] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const control = new AbortController();
    consultarSesion(control.signal).then((usuario) => {
      if (control.signal.aborted) return;
      if (usuario) setPerfil(usuario);
      else window.location.replace('/');
    }).catch((fallo) => {
      if (control.signal.aborted) return;
      setError(fallo.message);
    });
    return () => control.abort();
  }, [consultarSesion]);

  if (error) return <main><p role="alert">{error}</p><a href="/">Volver al inicio de sesión</a></main>;
  if (!perfil) return <p role="status">Comprobando sesión…</p>;
  return children(perfil);
}

