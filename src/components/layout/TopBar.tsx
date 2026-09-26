import { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Breadcrumb } from './Breadcrumb';
import { SearchModal } from '../shared/SearchModal';
import { AuthModal } from '../shared/AuthModal';
import { Link } from 'react-router-dom';

export const TopBar = () => {
  const { user } = useAuth();
  const [searchOpen, setSearchOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setAuthOpen(false);
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <>
      <header className="topbar">
        <div className="topbar-left">
          <Breadcrumb />
        </div>

        <div className="topbar-center">
          <button className="global-search-trigger" onClick={() => { setAuthOpen(false); setSearchOpen(true); }}>
            <span className="search-icon">⌕</span>
            <span className="search-placeholder">RICERCA GLOBALE...</span>
            <kbd className="search-shortcut">⌘K</kbd>
          </button>
        </div>

        <div className="topbar-right">
          <Link className="deposit-trigger" to="/deposito">AGGIUNGI RAPPORTO</Link>
          <button className="session-info session-trigger" onClick={() => { setSearchOpen(false); setAuthOpen(true); }} aria-label="Apri autenticazione">
            <span className="user-id">
              {user ? `${user.identificativo} / ${user.role.toUpperCase()}` : 'NON AUTENTICATO'}
            </span>
          </button>
        </div>
      </header>

      {searchOpen && <SearchModal onClose={() => setSearchOpen(false)} />}
      {authOpen && <AuthModal onClose={() => setAuthOpen(false)} />}
    </>
  );
};
