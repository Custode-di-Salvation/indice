import { Link, useParams } from 'react-router-dom';
import { AccessGate, ArchiveNotice, EntityLink, PageHeader } from '../components/shared/ArchiveUI';
import { useAuth } from '../hooks/useAuth';
import { api } from '../utils/dataLoader';
import { filterVisible } from '../utils/permissions';

const label = (value: string) => value.replace(/_/g, ' ').toUpperCase();

export function GapList() {
  const { user } = useAuth();
  const gaps = filterVisible(api.getGaps(), user);
  return <div className="page-standard">
    <PageHeader eyebrow="SEGRETA / STATO DELLA CONOSCENZA" title="Lacune" meta={`${gaps.length} LACUNE REGISTRATE · CONSULTAZIONE`} />
    <ArchiveNotice>Una lacuna registra ciò che la Tavola deve ancora conoscere quando l’assenza incide sull’interpretazione. Non costituisce un’ipotesi né una prova dell’assenza.</ArchiveNotice>
    <section className="panel gap-catalogue"><table className="data-table index-table"><thead><tr><th>ID</th><th>DOMANDA INFORMATIVA</th><th>OGGETTO</th><th>INCIDENZA</th><th>STATO</th><th>ULTIMO ATTO</th></tr></thead><tbody>{gaps.map(gap => <tr key={gap.id}><td className="monospace"><Link to={`/segreta/lacune/${gap.id}`}>{gap.id}</Link></td><td><strong>{gap.domanda}</strong></td><td>{gap.oggetto}</td><td><span className={`gap-impact impact-${gap.incidenza}`}>{label(gap.incidenza)}</span></td><td><span className={`gap-status status-${gap.stato}`}>{label(gap.stato)}</span></td><td className="tabular-nums">{gap.ultimoAtto}</td></tr>)}</tbody></table></section>
  </div>;
}

export function GapDetail() {
  const { id } = useParams();
  const gap = api.getGapById(id || '');
  if (!gap) return <div className="page-standard"><PageHeader title="Lacuna non reperita"/><ArchiveNotice tone="warning">L’identificativo richiesto non è presente nell’indice locale.</ArchiveNotice></div>;
  return <div className="page-standard"><AccessGate item={gap}>
    <PageHeader eyebrow="SEGRETA / LACUNA INFORMATIVA" title={gap.id} meta={`APERTA DA ${gap.proponente} · ${gap.dataApertura}`} actions={<span className={`gap-status status-${gap.stato}`}>{label(gap.stato)}</span>} />
    <div className="record-layout"><article className="document-sheet gap-sheet">
      <div className="section-kicker">DOMANDA INFORMATIVA</div><p className="gap-question">{gap.domanda}</p>
      <dl className="metadata-grid"><div><dt>OGGETTO</dt><dd>{gap.oggetto}</dd></div><div><dt>INCIDENZA</dt><dd>{label(gap.incidenza)}</dd></div></dl>
      <h2 className="section-title">RILEVANZA</h2><p>{gap.rilevanza}</p>
      <h2 className="section-title">CRITERIO DI SUFFICIENZA</h2><p>{gap.criterioSufficienza}</p>
      {gap.vincoli?.length ? <><h2 className="section-title">VINCOLI</h2><ul className="gap-constraints">{gap.vincoli.map(item => <li key={item}>{item}</li>)}</ul></> : null}
      {gap.recordCollegati.length ? <><h2 className="section-title">RECORD COLLEGATI</h2><div className="linked-records">{gap.recordCollegati.map(recordId => { const record = api.getRecordById(recordId); return <Link key={recordId} to={`/segreta/record/${recordId}`}><span className="monospace">{recordId}</span><strong>{record?.titolo || 'Record non disponibile'}</strong><small>Supporto della lacuna</small></Link>; })}</div></> : null}
      {gap.entitaCollegate?.length ? <><h2 className="section-title">ENTITÀ COLLEGATE</h2><div className="tag-list">{gap.entitaCollegate.map(entityId => <EntityLink key={entityId} id={entityId}/>)}</div></> : null}
    </article><aside className="provenance-panel"><div className="section-kicker">CONTROLLO</div><dl className="metadata-stack"><div><dt>Stato</dt><dd>{label(gap.stato)}</dd></div><div><dt>Incidenza</dt><dd>{label(gap.incidenza)}</dd></div><div><dt>Proponente</dt><dd>{gap.proponente}</dd></div><div><dt>Apertura</dt><dd>{gap.dataApertura}</dd></div><div><dt>Ultimo atto</dt><dd>{gap.ultimoAtto}</dd></div></dl></aside></div>
  </AccessGate></div>;
}
