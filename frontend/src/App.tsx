import AppRouter from './app/router/AppRouter.jsx';
import { services } from './app/providers/AppProviders';
import './app/styles/Tienda.css';

export default function App() {
  return <AppRouter services={services} />;
}
