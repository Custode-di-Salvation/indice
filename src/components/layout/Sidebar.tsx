import { NavLink } from 'react-router-dom';

export const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-logo">
          <div className="cenacolo-symbol">
            <span className="dot top"></span>
            <span className="dot left"></span>
            <span className="dot right"></span>
            <span className="dot center"></span>
          </div>
        </div>
        <div className="brand-text">
          <h1>INDICE</h1>
          <span className="build-info">SALVATION · NODO LOCALE</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-group">
          <NavLink to="/" end className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            QUADRO
          </NavLink>
        </div>

        <div className="nav-group">
          <div className="nav-group-title">SEGRETA</div>
          <div className="nav-subgroup">
            <NavLink to="/segreta" end className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>Entità</NavLink>
            <div className="nav-indent">
              <NavLink to="/segreta/persone" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>Persone</NavLink>
              <NavLink to="/segreta/organizzazioni" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>Organizzazioni</NavLink>
              <NavLink to="/segreta/luoghi" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>Luoghi</NavLink>
              <NavLink to="/segreta/eventi" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>Eventi</NavLink>
              <NavLink to="/segreta/fenomeni" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>Fenomeni</NavLink>
              <NavLink to="/segreta/oggetti" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>Oggetti</NavLink>
            </div>
          </div>
          <NavLink to="/segreta/record" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>Record</NavLink>
          <NavLink to="/segreta/fonti" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>Fonti</NavLink>
          <NavLink to="/segreta/media" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>Media</NavLink>
          <NavLink to="/segreta/lacune" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>Lacune</NavLink>
        </div>

        <div className="nav-group">
          <NavLink to="/concordanze" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>CONCORDANZE</NavLink>
          <div className="nav-indent">
            <NavLink to="/concordanze/grafo" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>Grafo</NavLink>
            <NavLink to="/concordanze/corrispondenze" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>Corrispondenze</NavLink>
            <NavLink to="/concordanze/cronologia" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>Cronologia</NavLink>
          </div>
        </div>

        <div className="nav-group">
          <NavLink to="/manuale" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            MANUALE DI TAVOLA
          </NavLink>
        </div>

      </nav>
    </aside>
  );
};
