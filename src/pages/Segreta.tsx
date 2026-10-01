import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../utils/dataLoader';
import { useAuth } from '../hooks/useAuth';
import { evaluateAccess, filterVisible } from '../utils/permissions';
import { formatEntityType, formatRecordType } from '../utils/formatters';
import { StatusBadge } from '../components/shared/StatusBadge';
import { AccessGate, ArchiveNotice, EmptyState, EntityLink, PageHeader, ProvenancePanel } from '../components/shared/ArchiveUI';
import { DigitalAttachment } from '../components/shared/DigitalAttachment';
import { AssertionReview } from '../components/shared/AssertionReview';
import { INFORMATION_CREDIBILITY_LABELS, SOURCE_RELIABILITY_LABELS } from '../types';
import type { Entity, EntityType, MediaItem, Record as ArchiveRecord, Source } from '../types';

const typeByRoute: Record<string, EntityType> = { persone: 'persona', organizzazioni: 'organizzazione', luoghi: 'luogo', eventi: 'evento', fenomeni: 'fenomeno', oggetti: 'oggetto' };

function useListFilter<T>(items: T[], getText: (item: T) => string) {
  const [query, setQuery] = useState('');
  const filtered = useMemo(() => items.filter(item => getText(item).toLowerCase().includes(query.toLowerCase())), [items, query, getText]);
  return { query, setQuery, filtered };
}

export function EntityList() {
  const { tipo } = useParams();
  const { user } = useAuth();
  const selectedType = tipo ? typeByRoute[tipo] : undefined;
  const entities = filterVisible(api.getEntities(), user).filter(e => !selectedType || e.tipo === selectedType);
  const [status, setStatus] = useState('tutti');
  const { query, setQuery, filtered } = useListFilter(entities, e => `${e.id} ${e.nome} ${e.alias?.join(' ')} ${e.tags?.join(' ')}`);
  const rows = filtered.filter(e => status === 'tutti' || e.stato === status);
  return <div className="page-standard">
    <PageHeader eyebrow="SEGRETA / ENTITÀ" title={selectedType ? `${formatEntityType(selectedType)}: repertorio` : 'Entità indicizzate'} meta={`${rows.length} OCCORRENZE VISIBILI · SOLA LETTURA`} />
    <div className="toolbar"><input aria-label="Filtra entità" value={query} onChange={e => setQuery(e.target.value)} placeholder="Filtra per nome, codice, alias o tag…"/><select aria-label="Filtra per stato" value={status} onChange={e => setStatus(e.target.value)}><option value="tutti">Tutti gli stati</option><option value="attivo">Attivo</option><option value="chiuso">Chiuso</option><option value="dormiente">Dormiente</option><option value="in_revisione">In revisione</option><option value="incompleto">Incompleto</option></select></div>
    <section className="panel"><table className="data-table index-table"><thead><tr><th>IDENTIFICATIVO</th><th>DENOMINAZIONE</th><th>TIPO</th><th>STATO</th><th>NODO</th><th>RISCONTRI</th></tr></thead><tbody>{rows.map(e => <tr key={e.id}><td className="monospace"><Link to={`/segreta/entita/${e.id}`}>{e.id}</Link></td><td><strong>{e.nome}</strong>{e.alias?.length ? <small>{e.alias.join(' · ')}</small> : null}</td><td>{formatEntityType(e.tipo)}</td><td><StatusBadge status={e.stato}/></td><td className="monospace">{e.nodo}</td><td className="monospace">{api.getRecordsByEntity(e.id).length}R / {api.getRelationsForEntity(e.id).length}C</td></tr>)}</tbody></table>{!rows.length && <EmptyState>Nessuna entità corrisponde ai filtri.</EmptyState>}</section>
  </div>;
}

export function EntityDetail() {
  const { id } = useParams(); const entity = api.getEntityById(id || '');
  if (!entity) return <NotFound label="Entità non reperita"/>;
  const records = api.getRecordsByEntity(entity.id); const media = api.getMediaByEntity(entity.id); const relations = api.getRelationsForEntity(entity.id);
  const specifics = Object.entries(entity).filter(([k, v]) => !['id','tipo','nome','alias','stato','provenienza','nodo','periodoInizio','periodoFine','sintesi','provenance','infoBlocks','tags','accessLevel','hidden','recordCount','sourceCount','relationCount','ultimoAggiornamento'].includes(k) && v != null);
  return <div className="page-standard"><AccessGate item={entity}>
    <PageHeader eyebrow={`SEGRETA / ${formatEntityType(entity.tipo).toUpperCase()}`} title={entity.nome} meta={`${entity.id} · NODO ${entity.nodo} · AGG. ${entity.ultimoAggiornamento}`} actions={<StatusBadge status={entity.stato}/>} />
    <div className="record-layout"><article className="document-sheet"><p className="document-lead">{entity.sintesi}</p>{entity.sintesi && <AssertionReview subjectId={entity.id} subjectKind="entity" assertionKey="sintesi" assertionText={entity.sintesi}/>} {entity.alias?.length ? <div className="alias-line"><span>ALIAS</span>{entity.alias.join(' / ')}</div> : null}
      {specifics.length > 0 && <dl className="metadata-grid">{specifics.map(([key,value]) => <div key={key}><dt>{key.replace(/([A-Z])/g,' $1')}</dt><dd>{Array.isArray(value) ? value.join(', ') : String(value)}</dd></div>)}</dl>}
      <h2 className="section-title">VALUTAZIONI INFORMATIVE</h2>{entity.infoBlocks?.length ? <div className="assessment-list">{entity.infoBlocks.map((b,i) => <div key={i} className={`assessment assessment-${b.tipo}`}><div><strong>{b.tipo.replace('_',' ').toUpperCase()}</strong>{b.confidenza && <span>CONFIDENZA ANALITICA: {b.confidenza.toUpperCase()}</span>}</div><p>{b.contenuto}</p>{b.fonti?.length ? <small>Supporto: {b.fonti.join(', ')}</small> : null}<AssertionReview compact subjectId={entity.id} subjectKind="entity" assertionKey={`info-${i + 1}`} assertionText={b.contenuto}/></div>)}</div> : <ArchiveNotice>Nessuna valutazione analitica annotata.</ArchiveNotice>}
      <RelatedRecords records={records}/><h2 className="section-title">RELAZIONI</h2><div className="relation-list">{relations.map(r => { const other = r.from === entity.id ? r.to : r.from; return <div key={r.id} className="relation-row"><span className={`relation-mark relation-${r.status}`}></span><span>{r.tipo.replace(/_/g,' ')}</span><EntityLink id={other}/><small>{r.status}</small></div>})}</div>
      {media.length > 0 && <><h2 className="section-title">MEDIA ASSOCIATI</h2>{media.map(m => <Link className="inline-file" key={m.id} to={`/segreta/media/${m.id}`}><span>{m.tipo.toUpperCase()}</span>{m.titolo}</Link>)}</>}
    </article><ProvenancePanel provenance={entity.provenance}/></div>
  </AccessGate></div>;
}

function RelatedRecords({ records }: { records: ArchiveRecord[] }) { return <><h2 className="section-title">RECORD ASSOCIATI</h2><div className="linked-records">{records.map(r => <Link key={r.id} to={`/segreta/record/${r.id}`}><span className="monospace">{r.id}</span><strong>{r.titolo}</strong><small>{formatRecordType(r.tipo)} · {r.disponibilita}</small></Link>)}{!records.length && <EmptyState>Nessun record associato.</EmptyState>}</div></>; }

export function RecordList() {
  const { user } = useAuth(); const visible = filterVisible(api.getRecords(), user); const [availability,setAvailability] = useState('tutti');
  const { query,setQuery,filtered } = useListFilter(visible, r => `${r.id} ${r.titolo} ${r.sommario} ${r.tipo}`); const rows=filtered.filter(r=>availability==='tutti'||r.disponibilita===availability);
  return <div className="page-standard"><PageHeader eyebrow="SEGRETA" title="Record" meta={`${rows.length} UNITÀ DOCUMENTALI VISIBILI`} /><div className="toolbar"><input aria-label="Filtra record" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Filtra record…"/><select value={availability} onChange={e=>setAvailability(e.target.value)}><option value="tutti">Ogni disponibilità</option><option value="locale">Locale</option><option value="remoto">Remoto</option><option value="orfano">Orfano</option><option value="replicato">Replicato</option></select></div><section className="panel"><table className="data-table index-table"><thead><tr><th>ID</th><th>TITOLO</th><th>TIPO</th><th>DATA</th><th>DISP.</th><th>CLASSIFICAZIONE</th></tr></thead><tbody>{rows.map(r => <tr key={r.id}><td className="monospace"><Link to={`/segreta/record/${r.id}`}>{r.id}</Link></td><td><strong>{r.titolo}</strong><small>{r.sommario}</small></td><td>{r.tipoRapporto?.replace(/_/g,' ') || formatRecordType(r.tipo)}</td><td>{r.dataOriginale || 'N/D'}</td><td><span className={`availability availability-${r.disponibilita}`}>{r.disponibilita}</span></td><td><small>Codice: {r.affidabilitaFonte && r.credibilitaInformazione ? `${r.affidabilitaFonte}${r.credibilitaInformazione}` : 'n.v.'} · {r.classificazioneAmbito === 'intero_record_provvisoria' ? 'provvisoria' : 'per informazione'}<br/>Validità: {r.validitaTemporale?.replace(/_/g,' ') || 'n.v.'}</small></td></tr>)}</tbody></table></section></div>;
}

export function RecordDetail() {
  const { user } = useAuth();
  const { id }=useParams(); const record=api.getRecordById(id||''); if(!record) return <NotFound label="Record non reperito"/>;
  const source=record.fonteId?api.getSourceById(record.fonteId):undefined;
  const gaps=filterVisible(api.getGapsByRecord(record.id),user);
  const linkedRecords=filterVisible(api.getRecords().filter(r => record.recordCollegati?.includes(r.id)),user);
  return <div className="page-standard record-page"><AccessGate item={record}><PageHeader eyebrow={`SEGRETA / RECORD / ${formatRecordType(record.tipo).toUpperCase()}`} title={record.titolo} meta={`${record.id} · ${record.dataOriginale || 'DATA NON DETERMINATA'}`} actions={<span className={`availability availability-${record.disponibilita}`}>{record.disponibilita}</span>}/><div className="record-layout"><article className="document-sheet"><div className="document-ribbon">COPIA DI CONSULTAZIONE · SOLA LETTURA</div>{record.disponibilita==='remoto'||record.disponibilita==='orfano'?<ArchiveNotice tone="warning">Il contenuto integrale non è presente sul nodo SAL. Sono disponibili soltanto indice e metadati replicati.</ArchiveNotice>:null}<p className="document-lead">{record.sommario}</p>{record.sommario && <AssertionReview subjectId={record.id} subjectKind="record" assertionKey="contenuto" assertionText={record.sommario}/>} {record.file ? <DigitalAttachment key={record.provenance.fissita?.impronta || record.file} file={record.file} format={record.fileFormat} title={record.titolo}/> : <div className="viewer-frame"><div className="viewer-toolbar"><span>NESSUN ALLEGATO DIGITALE</span></div><div className="viewer-page"><div className="folio-mark">INDICE · {record.id}</div><h2>{record.titolo}</h2><p>{record.testo || record.sommario}</p></div></div>}
      <div className="record-classification-scope"><span>AMBITO DELLA CLASSIFICAZIONE</span><strong>{record.affidabilitaFonte && record.credibilitaInformazione ? `${record.affidabilitaFonte}${record.credibilitaInformazione}` : 'NON VALUTATA'} · {record.classificazioneAmbito === 'intero_record_provvisoria' ? 'INTERO RECORD, VALUTAZIONE PROVVISORIA' : 'AFFERMAZIONI DISTINTE'}</strong><small>Il codice complessivo non rende automaticamente equivalenti tutte le affermazioni contenute nel record.</small></div>
      <div className="evidence-grid"><div><span>AFFIDABILITÀ DELLA FONTE</span><strong>{record.affidabilitaFonte || source?.affidabilita || 'NON APPLICABILE'}</strong><small>{record.affidabilitaFonte ? SOURCE_RELIABILITY_LABELS[record.affidabilitaFonte] : source ? SOURCE_RELIABILITY_LABELS[source.affidabilita] : 'Nessuna fonte valutabile associata al record.'}</small></div><div><span>CREDIBILITÀ DELL’INFORMAZIONE</span><strong>{record.credibilitaInformazione || 'NON VALUTATA'}</strong><small>{record.credibilitaInformazione ? INFORMATION_CREDIBILITY_LABELS[record.credibilitaInformazione] : 'Giudizio sulla specifica informazione.'}</small></div><div><span>CONFIDENZA ANALITICA</span><strong>{record.analisiDepositante?.sintesiConfidenza || 'NON FORMULATA'}</strong><small>{record.analisiDepositante ? `${record.analisiDepositante.autore}: ${record.analisiDepositante.notaConfidenza}` : 'Giudizio separato, espresso soltanto in una conclusione analitica.'}</small></div></div>
      <dl className="metadata-grid"><div><dt>TIPO DI RAPPORTO</dt><dd>{record.tipoRapporto?.replace(/_/g,' ') || formatRecordType(record.tipo)}</dd></div><div><dt>PRIORITÀ DI TRASMISSIONE</dt><dd>{record.prioritaTrasmissione || 'Non indicata'}</dd></div><div><dt>BASE DI CONOSCENZA</dt><dd>{record.baseConoscenza?.replace(/_/g,' ') || 'Non determinata'}</dd></div><div><dt>VALIDITÀ TEMPORALE</dt><dd>{record.validitaTemporale?.replace(/_/g,' ') || 'Non valutata'}</dd></div></dl>
      {record.note && <div className="record-note"><span>NOTA E LIMITI</span><p>{record.note}</p></div>}
      {record.restrizioni && <ArchiveNotice tone="warning">{record.restrizioni}</ArchiveNotice>}
      {linkedRecords.length > 0 && <RelatedRecords records={linkedRecords}/>}
      <h2 className="section-title">ENTITÀ MENZIONATE</h2><div className="tag-list">{record.entitaAssociate.map(e=><EntityLink key={e} id={e}/>)}</div>
      {gaps.length > 0 && <><h2 className="section-title">LACUNE COLLEGATE</h2>{gaps.map(gap=><Link className="inline-file" key={gap.id} to={`/segreta/lacune/${gap.id}`}><span>{gap.id}</span>{gap.domanda}</Link>)}</>}
      {source&&<><h2 className="section-title">FONTE ASSOCIATA</h2><Link className="inline-file" to={`/segreta/fonti/${source.id}`}><span>{source.affidabilita}</span>{source.codename||source.id}</Link></>}
    </article><ProvenancePanel provenance={record.provenance}/></div></AccessGate></div>;
}

export function SourceList() { const {user}=useAuth(); const rows=filterVisible(api.getSources(),user); return <SimpleCatalogue title="Fonti" eyebrow="SEGRETA" meta="REGISTRO FONTI · IDENTITÀ PROTETTE" headers={['CODICE / NOME','TIPO','STATO','AFFIDABILITÀ','APPORTI']} rows={rows.map(s=>[<Link to={`/segreta/fonti/${s.id}`}>{s.codename||s.id}</Link>,s.tipo.replace(/_/g,' '),s.stato,`${s.affidabilita} · ${SOURCE_RELIABILITY_LABELS[s.affidabilita]}`,s.rapportiAssociati.length])}/>; }
export function SourceDetail() { const {id}=useParams(); const s=api.getSourceById(id||''); if(!s)return <NotFound label="Fonte non reperita"/>; return <div className="page-standard"><AccessGate item={s}><PageHeader eyebrow="SEGRETA / FONTI" title={s.codename||s.id} meta={`${s.id} · ${s.tipo.replace(/_/g,' ').toUpperCase()}`} actions={<StatusBadge status={s.stato}/>}/><div className="document-sheet"><div className="evidence-grid"><div><span>AFFIDABILITÀ DELLA FONTE</span><strong>{s.affidabilita}</strong><small>{SOURCE_RELIABILITY_LABELS[s.affidabilita]}</small></div><div><span>GESTIONE</span><strong>{s.gestione}</strong><small>Canale responsabile.</small></div><div><span>ULTIMO APPORTO</span><strong>{s.ultimoApporto||'N/D'}</strong></div></div>{s.identitaRistretta?<ArchiveNotice tone="warning">Identità reale compartimentata. {s.motivoRestrizione}</ArchiveNotice>:null}<p className="document-lead source-assessment">{s.noteValutazione}</p>{s.noteValutazione && <AssertionReview subjectId={s.id} subjectKind="source" assertionKey="nota-valutazione" assertionText={s.noteValutazione}/>}<h2 className="section-title">RAPPORTI ASSOCIATI</h2><div className="tag-list">{s.rapportiAssociati.map(r=><Link key={r} to={`/segreta/record/${r}`}>{r}</Link>)}</div></div></AccessGate></div>; }

export function MediaList(){const{user}=useAuth();const rows=filterVisible(api.getMedia(),user);return <SimpleCatalogue title="Media" eyebrow="SEGRETA" meta="SUPPORTI DIGITALI E RIPRODUZIONI" headers={['ID','TITOLO','FORMATO','DATA','NODO']} rows={rows.map(m=>[<Link to={`/segreta/media/${m.id}`}>{m.id}</Link>,m.titolo,m.formato||m.tipo,m.data||'N/D',m.nodo])}/>}
export function MediaDetail(){const{id}=useParams();const m=api.getMediaById(id||'');if(!m)return <NotFound label="Media non reperito"/>;return <div className="page-standard"><AccessGate item={m}><PageHeader eyebrow="SEGRETA / MEDIA" title={m.titolo} meta={`${m.id} · ${m.formato||m.tipo}`}/><div className="record-layout"><article className="document-sheet">{m.file?<DigitalAttachment file={m.file} format={m.tipo} title={m.titolo}/>:<div className={`media-placeholder media-${m.tipo}`}><span>{m.tipo.toUpperCase()}</span><strong>{m.formato||'SUPPORTO'}</strong><small>File digitale non disponibile</small></div>}<p className="document-lead">{m.descrizione}</p>{m.descrizione && <AssertionReview subjectId={m.id} subjectKind="media" assertionKey="descrizione" assertionText={m.descrizione}/>}<h2 className="section-title">ENTITÀ ASSOCIATE</h2><div className="tag-list">{m.entitaAssociate.map(e=><EntityLink key={e} id={e}/>)}</div></article><ProvenancePanel provenance={m.provenance}/></div></AccessGate></div>}

function SimpleCatalogue({title,eyebrow,meta,headers,rows}:{title:string;eyebrow:string;meta:string;headers:string[];rows:(React.ReactNode[])[]}) { return <div className="page-standard"><PageHeader eyebrow={eyebrow} title={title} meta={`${rows.length} ELEMENTI · ${meta}`}/><section className="panel"><table className="data-table index-table"><thead><tr>{headers.map(h=><th key={h}>{h}</th>)}</tr></thead><tbody>{rows.map((r,i)=><tr key={i}>{r.map((c,j)=><td key={j}>{c}</td>)}</tr>)}</tbody></table></section></div> }
function NotFound({label}:{label:string}){return <div className="page-standard"><PageHeader title={label}/><ArchiveNotice tone="warning">L’identificativo richiesto non è presente nell’indice locale.</ArchiveNotice></div>}
