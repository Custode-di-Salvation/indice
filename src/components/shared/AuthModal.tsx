import { FormEvent, useEffect, useRef, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { isActiveSegnaposto, normalizeSegnaposto } from '../../utils/credentials';

type ReaderStage = 'entry' | 'proximity' | 'verification' | 'accepted';

export function AuthModal({ onClose, required = false }: { onClose: () => void; required?: boolean }) {
  const { user, login, logout } = useAuth();
  const [stage, setStage] = useState<ReaderStage>('entry');
  const [segnaposto, setSegnaposto] = useState('');
  const [pendingName, setPendingName] = useState('');
  const [error, setError] = useState('');
  const timers = useRef<number[]>([]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !required) onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      timers.current.forEach(window.clearTimeout);
    };
  }, [onClose, required]);

  const beginAuthentication = (event: FormEvent) => {
    event.preventDefault();
    const normalized = normalizeSegnaposto(segnaposto);
    if (!/^[A-ZÀ-ÖØ-Ý0-9'’ -]{2,32}$/.test(normalized)) {
      setError('Segnaposto non riconoscibile. Usare da 2 a 32 caratteri.');
      return;
    }
    if (!isActiveSegnaposto(normalized)) {
      setError('Nessun contrassegno gemello attivo corrisponde al Segnaposto indicato.');
      return;
    }

    timers.current.forEach(window.clearTimeout);
    timers.current = [];
    setError('');
    setPendingName(normalized);
    setStage('proximity');
    timers.current.push(window.setTimeout(() => setStage('verification'), 1600));
    timers.current.push(window.setTimeout(() => {
      login({
        id: `commensale-${normalized.toLocaleLowerCase('it-IT').replace(/[^a-z0-9]+/g, '-')}`,
        identificativo: normalized,
        role: 'commensale',
      });
      setStage('accepted');
    }, 3100));
  };

  return <div className={`auth-modal-backdrop ${required ? 'authentication-required' : ''}`} onMouseDown={event => !required && event.target === event.currentTarget && onClose()}>
    <section className="auth-modal" role="dialog" aria-modal="true" aria-labelledby="auth-title">
      <header className="auth-modal-header">
        <div><span>TERMINALE SAL</span><h2 id="auth-title">Autenticazione locale</h2></div>
        {!required && <button onClick={onClose} aria-label="Chiudi autenticazione">×</button>}
      </header>

      {(stage === 'proximity' || stage === 'verification' || stage === 'accepted') ? <div className={`credential-reader reader-${stage}`} aria-live="polite">
        <div className="reader-field" aria-hidden="true">
          <span className="reader-wave wave-one" />
          <span className="reader-wave wave-two" />
          <span className="reader-wave wave-three" />
          <div className="reader-mark"><i /><i /><i /><i /></div>
        </div>
        <div className="reader-copy">
          <span className="reader-code">SAL / RICONOSCIMENTO TESTIMONE</span>
          {stage === 'proximity' && <><h3>Avvicinare il Testimone di Tavola</h3><p>Portare il Testimone entro il campo del Terminale e mantenerlo fermo.</p></>}
          {stage === 'verification' && <><h3>Testimone rilevato</h3><p>Verifica del legame con la Tavola e della validità della credenziale.</p></>}
          {stage === 'accepted' && <><h3>Legame riconosciuto</h3><p>Corrispondenza valida per il Segnaposto <strong>{pendingName}</strong>. Sessione aperta.</p></>}
          <div className="reader-progress"><span /><span /><span /></div>
          {stage === 'accepted' && <div className="reader-actions"><button className="reader-primary" onClick={onClose}>CONTINUA</button></div>}
        </div>
      </div> : <div className="credential-entry">
        {user ? <><div className="active-credential">
          <span>SESSIONE ATTIVA</span>
          <strong>{user.identificativo}</strong>
          <small>{user.role.toUpperCase()}</small>
          <button onClick={logout}>CHIUDI SESSIONE</button>
        </div><p className="credential-locked">La sessione è vincolata a questo Segnaposto. Per presentare un altro Testimone di Tavola è necessario chiuderla.</p></> : <form onSubmit={beginAuthentication}>
          <label htmlFor="segnaposto">SEGNAPOSTO</label>
          <div className="credential-input-row">
            <input autoFocus id="segnaposto" value={segnaposto} onChange={event => setSegnaposto(event.target.value)} autoComplete="off" spellCheck={false} placeholder="INSERIRE IL PROPRIO SEGNAPOSTO" />
            <button type="submit">PREPARA RICONOSCIMENTO</button>
          </div>
          {error && <p className="credential-error">{error}</p>}
          <p className="credential-help">Il Segnaposto individua il contrassegno gemello custodito nel Fondaco. Il Testimone di Tavola conferma che il legame è ancora valido; non rivela l’identità civile e non richiede una password.</p>
        </form>}
      </div>}
    </section>
  </div>;
}
