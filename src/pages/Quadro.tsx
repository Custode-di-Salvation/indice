import { useData, api } from '../utils/dataLoader';
import { StatusBadge } from '../components/shared/StatusBadge';
import { Link } from 'react-router-dom';
import type { CenacoloNode, InformationGap, Record } from '../types';
import { PageHeader } from '../components/shared/ArchiveUI';

const sortableDate = (value: string) => {
  const match = value.match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
  return match ? Date.UTC(Number(match[3]), Number(match[2]) - 1, Number(match[1])) : new Date(value).getTime();
};

export const Quadro = () => {
  const { data: nodes, loading: nodesLoading } = useData<CenacoloNode[]>(() => api.getNodes());
  const { data: records, loading: recordsLoading } = useData<Record[]>(() => api.getRecords());
  const { data: gaps, loading: gapsLoading } = useData<InformationGap[]>(() => api.getGaps());
  if (nodesLoading || recordsLoading || gapsLoading) {
    return <div className="page-loading">CARICAMENTO IN CORSO...</div>;
  }

  const recentRecords = [...(records || [])]
    .sort((a, b) => sortableDate(b.ultimoAggiornamento) - sortableDate(a.ultimoAggiornamento))
    .slice(0, 5);

  return (
    <div className="page-quadro">
      <PageHeader eyebrow="QUADRO LOCALE" title="Tavola di Salvation" meta="SAL · NODO RIAPERTO · 2026-10-12 21:40:00+02:00" />

      <div className="quadro-grid">
        <section className="panel node-summary-panel">
          <header className="panel-header"><h2>STATO DEL NODO</h2></header>
          <div className="panel-content">
            <table className="data-table dense">
              <thead><tr><th>NODO / TAVOLA</th><th>STATO</th><th>SINCRONIZZAZIONE</th><th>RECORD LOCALI</th><th>COPIE REMOTE</th><th>ULTIMO CONTATTO</th></tr></thead>
              <tbody>{nodes?.map(node => <tr key={node.id}>
                <td><strong className="monospace">{node.codice}</strong><small>Tavola di {node.tavola}</small></td>
                <td><StatusBadge status={node.stato} type="node" /></td>
                <td className="monospace">{node.sincronizzazione}</td>
                <td className="tabular-nums">{(records || []).filter(record => record.nodo === node.codice && record.disponibilita === 'locale').length}</td>
                <td className="tabular-nums">{(records || []).filter(record => record.nodo === node.codice && record.disponibilita === 'replicato').length}</td>
                <td className="tabular-nums">{node.ultimoContatto}</td>
              </tr>)}</tbody>
            </table>
          </div>
        </section>

        <div className="quadro-main-columns">
          {/* LEFT COLUMN */}
          <div className="column column-left">
            <section className="panel">
              <header className="panel-header"><h2>ULTIMI RECORD AGGIORNATI</h2><Link to="/segreta/record" className="panel-link">Apri Segreta →</Link></header>
              <div className="panel-content"><div className="recent-list">{recentRecords.map(record => <div className="recent-item" key={record.id}><div className="recent-item-meta"><span className="monospace">{record.id}</span><span>{record.ultimoAggiornamento}</span></div><div className="recent-item-title"><Link to={`/segreta/record/${record.id}`}>{record.titolo}</Link></div></div>)}</div></div>
            </section>
            <section className="panel">
              <header className="panel-header"><h2>LACUNE APERTE</h2><Link to="/segreta/lacune" className="panel-link">Consulta →</Link></header>
              <div className="panel-content"><div className="gap-summary-list">{(gaps || []).filter(gap => !['colmata','superata'].includes(gap.stato)).map(gap => <Link className="gap-summary" key={gap.id} to={`/segreta/lacune/${gap.id}`}><span className="monospace">{gap.id}</span><strong>{gap.domanda}</strong><small>{gap.incidenza.toUpperCase()} · {gap.stato.replace(/_/g,' ').toUpperCase()}</small></Link>)}</div></div>
            </section>
          </div>

          {/* RIGHT COLUMN */}
          <div className="column column-right">
            <section className="panel"><header className="panel-header"><h2>AVVISI DI SISTEMA</h2></header><div className="panel-content"><div className="alert-box alert-warning"><strong>NODO RIAPERTO · 03/10/2026</strong><p>La Segreta recuperata nel Fondaco è ancora in ricognizione. Nel repertorio corrente è stato ammesso soltanto il verbale di riapertura; nessun altro materiale recuperato è stato indicizzato.</p><Link to="/segreta/record/SAL-DOC-0001" className="panel-link">Apri verbale →</Link></div><div className="alert-box alert-info"><strong>PRINCIPIO DI VERIDICITÀ</strong><p>La presenza di un’informazione nella Segreta non la rende vera.</p><Link to="/manuale/14-valutazione-dell-informazione" className="panel-link">Consulta il Manuale →</Link></div></div></section>
          </div>
        </div>
      </div>
    </div>
  );
};
