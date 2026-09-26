import { useState, type FormEvent } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useConcordanceLedger } from '../../hooks/useConcordanceLedger';
import { api } from '../../utils/dataLoader';
import {
  ASSERTION_ACTION_LABELS,
  assertionActions,
  deriveAssertionEvidence,
  type AssertionActionKind,
  type AssertionSubjectKind,
} from '../../utils/concordanceLedger';

interface AssertionReviewProps {
  subjectId: string;
  subjectKind: AssertionSubjectKind;
  assertionKey: string;
  assertionText: string;
  compact?: boolean;
}

export function AssertionReview(props: AssertionReviewProps) {
  const { user } = useAuth();
  const { ledger, loading, error, recordAssertion } = useConcordanceLedger();
  const [open, setOpen] = useState(false);
  const history = assertionActions(props.subjectId, props.assertionKey, ledger);
  const evidence = deriveAssertionEvidence(props.subjectId, props.assertionKey, ledger);

  return <div className={`assertion-review ${props.compact ? 'compact' : ''}`}>
    <div className="assertion-review-summary">
      <span>CORROBORAZIONI <strong>{evidence.corroborations}</strong></span>
      <span>CONTRADDIZIONI <strong>{evidence.contradictions}</strong></span>
      <span>ATTI <strong>{history.length}</strong></span>
      <button type="button" disabled={!user || loading} onClick={() => setOpen(true)}>{user ? 'DEPOSITA RISCONTRO' : 'AUTENTICAZIONE RICHIESTA'}</button>
    </div>
    {error && <p className="assertion-error">Registro locale non disponibile.</p>}
    {history.length > 0 && <details className="decision-history assertion-history">
      <summary>TRACCIA DEI RISCONTRI</summary>
      {history.map(action => <div className="decision-entry" key={action.id}>
        <div><strong>{ASSERTION_ACTION_LABELS[action.action]}</strong><span>{action.segnaposto} · {action.recordedAt}</span></div>
        <p>{action.reason}</p>
        <small>Record: {action.supportIds.join(', ')}</small>
      </div>)}
    </details>}
    {open && user && <AssertionModal {...props} segnaposto={user.identificativo} onClose={() => setOpen(false)} onSubmit={async input => { await recordAssertion(input); setOpen(false); }}/>} 
  </div>;
}

function AssertionModal({ subjectId, subjectKind, assertionKey, assertionText, segnaposto, onClose, onSubmit }: AssertionReviewProps & {
  segnaposto: string;
  onClose: () => void;
  onSubmit: (input: { subjectId:string; subjectKind:AssertionSubjectKind; assertionKey:string; assertionText:string; action:AssertionActionKind; reason:string; supportIds:string[]; segnaposto:string }) => Promise<void>;
}) {
  const [action, setAction] = useState<AssertionActionKind>('corroborate');
  const [reason, setReason] = useState('');
  const [supportIds, setSupportIds] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const records = api.getRecords().filter(record => !(subjectKind === 'record' && record.id === subjectId));

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!supportIds.length) { setError('Selezionare almeno un record che sostenga il riscontro.'); return; }
    setSaving(true);
    try { await onSubmit({ subjectId, subjectKind, assertionKey, assertionText, action, reason, supportIds, segnaposto }); }
    catch (cause) { setError(cause instanceof Error ? cause.message : 'Registrazione non riuscita'); setSaving(false); }
  }

  return <div className="concordance-modal-backdrop" onClick={onClose}>
    <form className="concordance-modal" onSubmit={submit} onClick={event => event.stopPropagation()}>
      <header><div><span>{subjectId} · INFORMAZIONE {assertionKey.toUpperCase()}</span><h2>Depositare un riscontro</h2></div><button type="button" onClick={onClose}>×</button></header>
      <div className="concordance-form">
        <blockquote className="assertion-quotation">{assertionText}</blockquote>
        <label>ESITO
          <select value={action} onChange={event => setAction(event.target.value as AssertionActionKind)}>
            <option value="corroborate">Corroborare l’informazione</option>
            <option value="contradict">Contraddire l’informazione</option>
          </select>
        </label>
        <label>MOTIVAZIONE
          <textarea required minLength={12} value={reason} onChange={event => setReason(event.target.value)} placeholder="Spiegare in che modo i record selezionati sostengono o contraddicono questa specifica informazione."/>
        </label>
        <fieldset className="support-selector"><legend>RECORD CHE FONDANO IL RISCONTRO</legend>{records.map(record => <label key={record.id}><input type="checkbox" checked={supportIds.includes(record.id)} onChange={event => setSupportIds(event.target.checked ? [...supportIds, record.id] : supportIds.filter(id => id !== record.id))}/><span><strong>{record.id}</strong>{record.titolo}</span></label>)}</fieldset>
        {error && <p className="form-error">{error}</p>}
        <div className="form-attestation">ATTO ATTRIBUITO A · {segnaposto.toUpperCase()} · NODO SAL</div>
        <div className="form-actions"><button type="button" onClick={onClose}>ANNULLA</button><button className="archive-action" disabled={saving}>{saving ? 'REGISTRAZIONE...' : 'REGISTRA RISCONTRO'}</button></div>
      </div>
    </form>
  </div>;
}
