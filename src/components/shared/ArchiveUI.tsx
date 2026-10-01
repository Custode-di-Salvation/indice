import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { api } from '../../utils/dataLoader';
import { evaluateAccess } from '../../utils/permissions';
import type { AccessLevel, Provenance } from '../../types';

export function PageHeader({ eyebrow, title, meta, actions }: { eyebrow?: string; title: string; meta?: string; actions?: ReactNode }) {
  return <header className="page-header archive-header">
    <div>{eyebrow && <div className="eyebrow">{eyebrow}</div>}<h1>{title}</h1>{meta && <div className="header-meta">{meta}</div>}</div>
    {actions && <div className="header-actions">{actions}</div>}
  </header>;
}

export function ArchiveNotice({ children, tone = 'neutral' }: { children: ReactNode; tone?: 'neutral' | 'warning' | 'ok' }) {
  return <div className={`archive-notice notice-${tone}`}>{children}</div>;
}

export function AccessGate({ item, children }: { item: { accessLevel: AccessLevel; hidden?: boolean }; children: ReactNode }) {
  const { user } = useAuth();
  const access = evaluateAccess(user, item);
  if (!access.isVisible) return null;
  if (!access.canSeeContent) return <div className="restricted-panel">
    <span className="restricted-stamp">ACCESSO LIMITATO</span>
    <h2>Contenuto compartimentato</h2>
    <p>Il record è presente nell’indice, ma la credenziale corrente non possiede l’autorizzazione richiesta.</p>
    <dl className="metadata-grid"><div><dt>AUTORIZZAZIONE RICHIESTA</dt><dd>{item.accessLevel.toUpperCase()}</dd></div><div><dt>CREDENZIALE ATTIVA</dt><dd>{user?.role.toUpperCase() || 'PUBBLICO'}</dd></div></dl>
  </div>;
  return <>{children}</>;
}

export function ProvenancePanel({ provenance }: { provenance: Provenance }) {
  return <aside className="provenance-panel">
    <div className="section-kicker">CATENA DI CUSTODIA</div>
    <dl className="metadata-stack">
      <div><dt>Nodo</dt><dd>{provenance.nodo}</dd></div>
      {provenance.responsabile && <div><dt>Responsabile</dt><dd>{provenance.responsabile}</dd></div>}
      <div><dt>Acquisizione</dt><dd>{provenance.acquisizione || 'Non determinata'}</dd></div>
      <div><dt>Supporto</dt><dd>{provenance.supporto}</dd></div>
      {provenance.autenticita && <div><dt>Autenticità</dt><dd>{provenance.autenticita.replace(/_/g, ' ')}</dd></div>}
      <div><dt>Integrità</dt><dd>{provenance.integrita.replace('_', ' ')}</dd></div>
      {provenance.statoMateriale && <div><dt>Stato del materiale</dt><dd>{provenance.statoMateriale.replace(/_/g, ' ')}</dd></div>}
      {provenance.storiaCustodiale && <div><dt>Storia custodiale</dt><dd>{provenance.storiaCustodiale}</dd></div>}
      {provenance.conversioniNote?.length ? <div><dt>Conversioni note</dt><dd>{provenance.conversioniNote.join(', ')}</dd></div> : null}
      {provenance.fissita && <>
        <div><dt>Fissità</dt><dd>{provenance.fissita.esito.replace(/_/g, ' ')}</dd></div>
        <div><dt>Algoritmo</dt><dd>{provenance.fissita.algoritmo}</dd></div>
        <div><dt>Impronta</dt><dd><code className="fixity-hash">{provenance.fissita.impronta}</code></dd></div>
        <div><dt>Ultima verifica</dt><dd>{provenance.fissita.ultimaVerifica}</dd></div>
      </>}
      <div><dt>Corroborazioni</dt><dd>{provenance.corroborazioni}</dd></div>
      <div><dt>Contraddizioni</dt><dd>{provenance.contraddizioni}</dd></div>
      <div><dt>Ultima revisione</dt><dd>{provenance.ultimaRevisione}</dd></div>
    </dl>
  </aside>;
}

export function EmptyState({ children }: { children: ReactNode }) { return <div className="empty-state">{children}</div>; }

export function EntityLink({ id, children }: { id: string; children?: ReactNode }) {
  return <Link className="record-link" to={`/segreta/entita/${id}`}>{children || api.getEntityById(id)?.nome || id}</Link>;
}
