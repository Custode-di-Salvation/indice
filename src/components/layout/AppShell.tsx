import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { AuthModal } from '../shared/AuthModal';
import { useAuth } from '../../hooks/useAuth';

export const AppShell = () => {
  const { user } = useAuth();

  if (!user) {
    return <div className="authentication-wall" aria-label="INDICE bloccato">
      <div className="authentication-wall-mark" aria-hidden="true"><i/><i/><i/><i/></div>
      <div className="authentication-wall-copy"><strong>INDICE</strong><span>SALVATION · TERMINALE LOCALE</span></div>
      <AuthModal required onClose={() => undefined} />
    </div>;
  }

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-wrapper">
        <TopBar />
        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
