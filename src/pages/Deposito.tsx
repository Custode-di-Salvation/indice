import { useEffect, useMemo, useRef, useState } from 'react';
import type { FormEvent, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArchiveNotice, PageHeader } from '../components/shared/ArchiveUI';
import { useAuth } from '../hooks/useAuth';

const FILO_DIRETTO_URL = 'https://salvation.forumcommunity.net/?f=9146991';

type ReportKind =
  | 'segnalazione_immediata'
  | 'rapporto_osservazione'
  | 'rapporto_contatto'
  | 'rapporto_informativo'
  | 'valutazione_analitica'
  | 'nota_rettifica_integrazione';

type Guide = {
  title: string;
  body: ReactNode;
  chapter: string;
  chapterLabel: string;
};

type SpecificField = {
  key: string;
  label: string;
  placeholder: string;
  guide: Guide;
  required?: boolean;
  rows?: number;
};

type FormState = {
  tipo: ReportKind;
  priorita: 'immediata' | 'urgente' | 'ordinaria' | 'differibile';
  titolo: string;
  dataRedazione: string;
  oraRedazione: string;
  periodoEventi: string;
  luogo: string;
  sintesi: string;
  contenuto: string;
  provenienza: string;
  fonte: string;
  affidabilita: 'A' | 'B' | 'C' | 'D' | 'E' | 'F';
  credibilita: '1' | '2' | '3' | '4' | '5' | '6';
  baseConoscenza: 'diretta' | 'indiretta' | 'inferita' | 'non_determinata';
  corroborazione: string;
  limiti: string;
  contraddizioni: string;
  validita: 'corrente' | 'da_riconfermare' | 'superata';
  ambitoClassificazione: 'intero_record_provvisoria' | 'affermazioni_distinte';
  analisi: string;
  entitaCollegate: string;
  recordCollegati: string;
  materiali: string;
  allegatoNome: string;
  allegatoFormato: string;
  allegatoOrigine: string;
  allegatoAutenticita: 'non_indicata' | 'verificata' | 'non_verificata' | 'contestata' | 'sconosciuta';
  allegatoIntegrita: 'non_indicata' | 'verificata' | 'non_verificata' | 'compromessa' | 'sconosciuta';
  allegatoStato: 'non_indicato' | 'originale' | 'originale_digitale' | 'copia' | 'copia_autenticata' | 'copia_non_verificata' | 'trascrizione' | 'estratto' | 'alterato' | 'incerto';
  allegatoConversioni: string;
  allegatoAlgoritmo: string;
  allegatoImpronta: string;
  allegatoConsegna: string;
  lacune: string;
  restrizioni: string;
  note: string;
  specific: Record<string, string>;
};

const reportLabels: Record<ReportKind, string> = {
  segnalazione_immediata: 'Segnalazione immediata',
  rapporto_osservazione: 'Rapporto di osservazione',
  rapporto_contatto: 'Rapporto di contatto',
  rapporto_informativo: 'Rapporto informativo',
  valutazione_analitica: 'Valutazione analitica',
  nota_rettifica_integrazione: 'Nota di rettifica o integrazione',
};

const guides = {
  identification: {
    title: 'Identificazione del rapporto',
    body: <>Il rapporto deve indicare autore, data di redazione, data o periodo degli eventi, luogo ed eventuali elementi già presenti in INDICE.</>,
    chapter: '19-portare-al-tavolo', chapterLabel: 'Manuale 19.1',
  },
  reportType: {
    title: 'Tipo di rapporto',
    body: <>La forma dipende dall’origine e dallo scopo dell’informazione. Non determina il valore del contenuto.</>,
    chapter: '20-tipi-di-rapporto-e-priorita-di-trasmissione', chapterLabel: 'Manuale 20',
  },
  priority: {
    title: 'Priorità di trasmissione',
    body: <>La priorità descrive le conseguenze del ritardo, non l’importanza storica dell’informazione. «Immediata» si usa quando il ritardo può causare perdita, pericolo o compromissione.</>,
    chapter: '20-tipi-di-rapporto-e-priorita-di-trasmissione', chapterLabel: 'Manuale 20.7',
  },
  summary: {
    title: 'Sintesi',
    body: <>Formula brevemente che cosa è stato appreso e perché è rilevante. Deve essere comprensibile anche da chi non era presente.</>,
    chapter: '19-portare-al-tavolo', chapterLabel: 'Manuale 19.1–19.3',
  },
  content: {
    title: 'Contenuto informativo',
    body: <>Registra ciò che è stato raccolto separandolo dalle valutazioni e dalle inferenze. Informazioni sostanzialmente diverse possono richiedere rapporti separati.</>,
    chapter: '19-portare-al-tavolo', chapterLabel: 'Manuale 19.1 e 19.4',
  },
  provenance: {
    title: 'Provenienza',
    body: <>Indica come l’informazione è arrivata al Cenacolo e, per i materiali, la catena di custodia, le copie e le modifiche conosciute.</>,
    chapter: '22-provenienza-autenticita-integrita-e-fissita', chapterLabel: 'Manuale 22',
  },
  evaluation: {
    title: 'Valutazione dell’informazione',
    body: <>Affidabilità della fonte, credibilità dell’informazione e confidenza analitica sono valutazioni diverse. Una ripetizione della stessa origine non è corroborazione indipendente.</>,
    chapter: '14-valutazione-dell-informazione', chapterLabel: 'Manuale 14',
  },
  analysis: {
    title: 'Analisi',
    body: <>Le conclusioni devono essere distinte dalle informazioni sottostanti. Assunzioni, alternative e informazioni contrarie restano visibili.</>,
    chapter: '15-analisi', chapterLabel: 'Manuale 15',
  },
  links: {
    title: 'Collegamenti proposti',
    body: <>Indica identificativi già noti e possibili nuove entità da indicizzare. Il collegamento proposto non diventa automaticamente un nesso accertato.</>,
    chapter: '21-segreta-e-indice', chapterLabel: 'Manuale 21.2',
  },
  materials: {
    title: 'Materiali e allegati digitali',
    body: <>Per ogni allegato significativo indicare nome, formato, origine, autenticità, integrità, stato materiale, conversioni note e modalità di consegna. Se è disponibile un’impronta di fissità, registrare algoritmo e valore senza presentarla come prova della verità del contenuto.</>,
    chapter: '22-provenienza-autenticita-integrita-e-fissita', chapterLabel: 'Manuale 22',
  },
  gaps: {
    title: 'Lacune',
    body: <>Registra ciò che rimane necessario conoscere. Una lacuna non deve essere colmata con un’ipotesi non dichiarata.</>,
    chapter: '04-definizione-dell-esigenza-informativa', chapterLabel: 'Manuale 04.3',
  },
};

const specificFields: Record<ReportKind, SpecificField[]> = {
  segnalazione_immediata: [
    { key: 'certezzaIniziale', label: 'Grado iniziale di certezza', placeholder: 'Che cosa è certo, probabile o ancora da verificare?', required: true, rows: 3, guide: guides.evaluation },
    { key: 'azioneIntrapresa', label: 'Azione già intrapresa', placeholder: 'Indicare anche «nessuna», se pertinente.', required: true, rows: 3, guide: guides.reportType },
    { key: 'necessitaImmediata', label: 'Necessità immediata', placeholder: 'Che cosa richiede attenzione adesso? Indicare «nessuna» se non presente.', required: true, rows: 3, guide: guides.priority },
  ],
  rapporto_osservazione: [
    { key: 'sequenza', label: 'Sequenza degli eventi', placeholder: 'Ricostruzione cronologica delle osservazioni.', required: true, rows: 5, guide: guides.reportType },
    { key: 'condizioniOsservazione', label: 'Condizioni dell’osservazione', placeholder: 'Distanza, luce, durata, ostacoli, condizioni personali e ambientali.', required: true, rows: 4, guide: guides.reportType },
    { key: 'strumenti', label: 'Strumenti utilizzati', placeholder: 'Strumenti, dispositivi o supporti; indicare «nessuno» se non utilizzati.', required: true, rows: 3, guide: guides.reportType },
    { key: 'nonOsservabile', label: 'Elementi non osservabili', placeholder: 'Che cosa non era possibile vedere, misurare o verificare?', required: true, rows: 3, guide: guides.evaluation },
    { key: 'inferenze', label: 'Inferenze successive', placeholder: 'Interpretazioni formulate dopo l’osservazione; indicare «nessuna» se assenti.', required: true, rows: 4, guide: guides.analysis },
  ],
  rapporto_contatto: [
    { key: 'riferimentoFonte', label: 'Identità o riferimento della fonte', placeholder: 'Segnaposto, riferimento o descrizione sufficiente senza esporre dati non necessari.', required: true, rows: 3, guide: guides.provenance },
    { key: 'circostanzeContatto', label: 'Circostanze del contatto', placeholder: 'Come, dove e perché è avvenuto il contatto?', required: true, rows: 4, guide: guides.reportType },
    { key: 'accessoFonte', label: 'Modo in cui la fonte conosce gli elementi riferiti', placeholder: 'Accesso diretto, ricezione da terzi, inferenza o altro.', required: true, rows: 4, guide: guides.evaluation },
    { key: 'variazioni', label: 'Variazioni rispetto a contatti precedenti', placeholder: 'Indicare «primo contatto» o «nessuna variazione nota», se pertinente.', required: true, rows: 3, guide: guides.reportType },
    { key: 'richiesteAnomalie', label: 'Richieste, pressioni o anomalie', placeholder: 'Indicare «nessuna» se non rilevate.', required: true, rows: 4, guide: guides.evaluation },
  ],
  rapporto_informativo: [
    { key: 'naturaMateriale', label: 'Natura del materiale acquisito', placeholder: 'Documento, archivio, dispositivo, fotografia, registrazione, estratto o altro.', required: true, rows: 3, guide: guides.provenance },
    { key: 'modalitaAcquisizione', label: 'Modalità e condizioni di acquisizione', placeholder: 'Da chi, come, quando e in quali condizioni è stato acquisito?', required: true, rows: 4, guide: guides.provenance },
    { key: 'integritaMateriale', label: 'Integrità e stato del materiale', placeholder: 'Completezza, parti mancanti, alterazioni, copie, conversioni o dubbi.', required: true, rows: 4, guide: guides.provenance },
    { key: 'storiaCustodiale', label: 'Storia custodiale conosciuta', placeholder: 'Passaggi di possesso o custodia; indicare ciò che non è ricostruibile.', required: true, rows: 4, guide: guides.provenance },
  ],
  valutazione_analitica: [
    { key: 'domandaAnalitica', label: 'Domanda analitica', placeholder: 'A quale domanda risponde la valutazione?', required: true, rows: 3, guide: guides.analysis },
    { key: 'giudizioPrincipale', label: 'Giudizio principale', placeholder: 'Conclusione formulata con linguaggio estimativo.', required: true, rows: 4, guide: guides.analysis },
    { key: 'confidenza', label: 'Confidenza analitica', placeholder: 'Alta, moderata o bassa, con motivazione.', required: true, rows: 3, guide: guides.analysis },
    { key: 'informazioniDeterminanti', label: 'Informazioni determinanti', placeholder: 'Record e informazioni che sostengono il giudizio.', required: true, rows: 4, guide: guides.analysis },
    { key: 'assunzioni', label: 'Assunzioni', placeholder: 'Assunzioni necessarie; indicare «nessuna» se il giudizio non ne dipende.', required: true, rows: 4, guide: guides.analysis },
    { key: 'alternative', label: 'Alternative rilevanti', placeholder: 'Spiegazioni alternative considerate.', required: true, rows: 4, guide: guides.analysis },
    { key: 'informazioniContrarie', label: 'Informazioni contrarie', placeholder: 'Elementi che indeboliscono o contraddicono il giudizio.', required: true, rows: 4, guide: guides.analysis },
    { key: 'indicatoriRevisione', label: 'Condizioni di revisione', placeholder: 'Quali nuovi elementi richiederebbero di riesaminare il giudizio?', required: true, rows: 4, guide: guides.analysis },
  ],
  nota_rettifica_integrazione: [
    { key: 'recordInteressato', label: 'Record interessato', placeholder: 'Identificativo del record originale.', required: true, rows: 2, guide: guides.links },
    { key: 'elementoModificato', label: 'Elemento rettificato o integrato', placeholder: 'Indicare con precisione quale parte necessita di intervento.', required: true, rows: 4, guide: guides.reportType },
    { key: 'motivoRettifica', label: 'Motivo', placeholder: 'Perché la rettifica o integrazione è necessaria?', required: true, rows: 4, guide: guides.reportType },
    { key: 'nuovaBase', label: 'Nuova base informativa', placeholder: 'Quali nuovi elementi sostengono la modifica?', required: true, rows: 4, guide: guides.provenance },
    { key: 'conseguenzeValutazione', label: 'Conseguenze sulla valutazione', placeholder: 'Indicare «nessuna» se la valutazione non cambia.', required: true, rows: 4, guide: guides.evaluation },
  ],
};

const initialForm: FormState = {
  tipo: 'rapporto_osservazione', priorita: 'ordinaria', titolo: '', dataRedazione: '', oraRedazione: '', periodoEventi: '', luogo: '',
  sintesi: '', contenuto: '', provenienza: '', fonte: '', affidabilita: 'F', credibilita: '6', baseConoscenza: 'non_determinata',
  corroborazione: '', limiti: '', contraddizioni: '', validita: 'corrente', ambitoClassificazione: 'intero_record_provvisoria',
  analisi: '', entitaCollegate: '', recordCollegati: '', materiali: '', lacune: '', restrizioni: '', note: '', specific: {},
  allegatoNome: '', allegatoFormato: '', allegatoOrigine: '', allegatoAutenticita: 'non_indicata', allegatoIntegrita: 'non_indicata',
  allegatoStato: 'non_indicato', allegatoConversioni: '', allegatoAlgoritmo: '', allegatoImpronta: '', allegatoConsegna: '',
};

function GuideButton({ guide, onOpen }: { guide: Guide; onOpen: (guide: Guide) => void }) {
  return <button type="button" className="field-guide-trigger" onClick={() => onOpen(guide)} aria-label={`Guida: ${guide.title}`}>?</button>;
}

function GuideModal({ guide, onClose }: { guide: Guide; onClose: () => void }) {
  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => event.key === 'Escape' && onClose();
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [onClose]);

  return <div className="guide-backdrop" onMouseDown={event => event.target === event.currentTarget && onClose()}>
    <section className="guide-modal" role="dialog" aria-modal="true" aria-labelledby="guide-title">
      <header><div><span>MANUALE DI TAVOLA</span><h2 id="guide-title">{guide.title}</h2></div><button type="button" onClick={onClose} aria-label="Chiudi guida">×</button></header>
      <div className="guide-modal-body"><p>{guide.body}</p><Link to={`/manuale/${guide.chapter}`} target="_blank" rel="noreferrer">CONSULTA {guide.chapterLabel.toUpperCase()} →</Link></div>
    </section>
  </div>;
}

function FieldLabel({ children, guide, onOpen, required }: { children: ReactNode; guide: Guide; onOpen: (guide: Guide) => void; required?: boolean }) {
  return <span className="deposit-label"><span>{children}{required && <b aria-hidden="true"> *</b>}</span><GuideButton guide={guide} onOpen={onOpen} /></span>;
}

const display = (value: string) => value.trim() || 'Non indicato';
const displayList = (value: string) => value.trim() || 'Nessuno indicato';
const fieldHeading = (label: string, value: string) => `${label.toUpperCase()}\n${display(value)}`;

function buildReport(form: FormState, segnaposto: string) {
  const specific = specificFields[form.tipo]
    .map(field => fieldHeading(field.label, form.specific[field.key] || ''))
    .join('\n\n');
  const hasAttachmentMetadata = [form.allegatoNome, form.allegatoFormato, form.allegatoOrigine, form.allegatoConversioni, form.allegatoAlgoritmo, form.allegatoImpronta, form.allegatoConsegna].some(value => value.trim())
    || form.allegatoAutenticita !== 'non_indicata'
    || form.allegatoIntegrita !== 'non_indicata'
    || form.allegatoStato !== 'non_indicato';
  const attachmentMetadata = hasAttachmentMetadata ? [
    fieldHeading('Nome del file o materiale', form.allegatoNome),
    fieldHeading('Formato', form.allegatoFormato),
    fieldHeading('Origine', form.allegatoOrigine),
    `AUTENTICITÀ\n${form.allegatoAutenticita.replace(/_/g, ' ')}`,
    `INTEGRITÀ\n${form.allegatoIntegrita.replace(/_/g, ' ')}`,
    `STATO DEL MATERIALE\n${form.allegatoStato.replace(/_/g, ' ')}`,
    fieldHeading('Conversioni note', form.allegatoConversioni),
    fieldHeading('Algoritmo di fissità', form.allegatoAlgoritmo),
    fieldHeading('Impronta di fissità', form.allegatoImpronta),
    fieldHeading('Modalità di consegna', form.allegatoConsegna),
  ].join('\n\n') : 'Nessun metadato di allegato indicato';

  return [
    'INDICE / NODO SAL',
    'PROPOSTA DI REGISTRAZIONE',
    '============================================================',
    `TIPO DI RAPPORTO\n${reportLabels[form.tipo]}`,
    `PRIORITÀ DI TRASMISSIONE\n${form.priorita.toUpperCase()}`,
    `TITOLO PROPOSTO\n${display(form.titolo)}`,
    '',
    'IDENTIFICAZIONE',
    '------------------------------------------------------------',
    `SEGNAPOSTO\n${segnaposto}`,
    `REDAZIONE\n${form.dataRedazione} · ${form.oraRedazione} · ORA LOCALE SAL`,
    `DATA O PERIODO DEGLI EVENTI\n${display(form.periodoEventi)}`,
    `LUOGO\n${display(form.luogo)}`,
    '',
    'SINTESI',
    '------------------------------------------------------------',
    display(form.sintesi),
    '',
    'CONTENUTO INFORMATIVO',
    '------------------------------------------------------------',
    display(form.contenuto),
    '',
    'REQUISITI SPECIFICI DEL TIPO DI RAPPORTO',
    '------------------------------------------------------------',
    specific,
    '',
    'PROVENIENZA',
    '------------------------------------------------------------',
    fieldHeading('Modalità di acquisizione o provenienza', form.provenienza),
    '',
    fieldHeading('Fonte o origine', form.fonte),
    '',
    'VALUTAZIONE DELL’INFORMAZIONE',
    '------------------------------------------------------------',
    `CLASSIFICAZIONE\n${form.affidabilita}${form.credibilita}`,
    `AFFIDABILITÀ DELLA FONTE\n${form.affidabilita}`,
    `CREDIBILITÀ DELL’INFORMAZIONE\n${form.credibilita}`,
    `BASE DI CONOSCENZA\n${form.baseConoscenza.replace(/_/g, ' ')}`,
    `VALIDITÀ TEMPORALE\n${form.validita.replace(/_/g, ' ')}`,
    `AMBITO DELLA CLASSIFICAZIONE\n${form.ambitoClassificazione === 'intero_record_provvisoria' ? 'Classificazione provvisoria dell’intero rapporto' : 'Affermazioni da classificare separatamente'}`,
    '',
    fieldHeading('Corroborazioni', form.corroborazione),
    '',
    fieldHeading('Limiti', form.limiti),
    '',
    fieldHeading('Contraddizioni', form.contraddizioni),
    '',
    'ANALISI DISTINTA DAL CONTENUTO',
    '------------------------------------------------------------',
    display(form.analisi),
    '',
    'COLLEGAMENTI PROPOSTI',
    '------------------------------------------------------------',
    `ENTITÀ ESISTENTI O NUOVE ENTITÀ DA INDICIZZARE\n${displayList(form.entitaCollegate)}`,
    '',
    `RECORD COLLEGATI\n${displayList(form.recordCollegati)}`,
    '',
    `MATERIALI O ALLEGATI ASSOCIATI\n${displayList(form.materiali)}`,
    '',
    'METADATI DEGLI ALLEGATI',
    attachmentMetadata,
    '',
    `LACUNE RESIDUE\n${displayList(form.lacune)}`,
    '',
    `RESTRIZIONI DI ACCESSO O DIFFUSIONE\n${displayList(form.restrizioni)}`,
    '',
    `NOTE PER LA REGISTRAZIONE\n${displayList(form.note)}`,
    '',
    '============================================================',
    'FINE DELLA PROPOSTA',
  ].join('\n');
}

export function Deposito() {
  const { user } = useAuth();
  const [form, setForm] = useState<FormState>(initialForm);
  const [guide, setGuide] = useState<Guide | null>(null);
  const [output, setOutput] = useState('');
  const [outputCurrent, setOutputCurrent] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState('');
  const resultRef = useRef<HTMLElement>(null);
  const activeSpecificFields = specificFields[form.tipo];

  const requiredValues = useMemo(() => [
    form.titolo, form.dataRedazione, form.oraRedazione, form.periodoEventi, form.luogo, form.sintesi, form.contenuto,
    form.provenienza, form.fonte, form.corroborazione, form.limiti, form.contraddizioni,
    ...activeSpecificFields.filter(field => field.required).map(field => form.specific[field.key] || ''),
  ], [form, activeSpecificFields]);
  const completed = requiredValues.filter(value => value.trim()).length;
  const completion = Math.round((completed / requiredValues.length) * 100);

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm(current => ({ ...current, [key]: value }));
    setOutputCurrent(false);
    setCopied(false);
    setCopyError('');
  };

  const updateSpecific = (key: string, value: string) => {
    setForm(current => ({ ...current, specific: { ...current.specific, [key]: value } }));
    setOutputCurrent(false);
    setCopied(false);
    setCopyError('');
  };

  const prepare = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const report = buildReport(form, user?.identificativo || 'NON AUTENTICATO');
    setOutput(report);
    setOutputCurrent(true);
    setCopied(false);
    setCopyError('');
    window.setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 0);
  };

  const copyReport = async () => {
    if (!outputCurrent) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setCopyError('');
    } catch {
      try {
        const fallback = document.createElement('textarea');
        fallback.value = output;
        fallback.style.position = 'fixed';
        fallback.style.opacity = '0';
        document.body.appendChild(fallback);
        fallback.select();
        const succeeded = document.execCommand('copy');
        fallback.remove();
        if (!succeeded) throw new Error('copy failed');
        setCopied(true);
        setCopyError('');
      } catch {
        setCopyError('Copia automatica non disponibile. Selezionare il testo dell’anteprima e copiarlo manualmente.');
      }
    }
  };

  return <div className="page-standard deposit-page">
    <PageHeader eyebrow="SEGRETA / ACQUISIZIONE" title="Preparazione di un rapporto" meta="BOZZA LOCALE · NESSUNA REGISTRAZIONE AUTOMATICA" />
    <ArchiveNotice>Questo strumento prepara una proposta completa per la Tavola. Il contenuto non viene salvato in INDICE: al termine deve essere copiato e trasmesso attraverso Filo diretto.</ArchiveNotice>

    <form className="deposit-workspace" onSubmit={prepare}>
      <div className="deposit-form">
        <section className="deposit-section">
          <header><div><span>01</span><h2>Forma e identificazione</h2></div><GuideButton guide={guides.identification} onOpen={setGuide} /></header>
          <div className="deposit-grid two-columns">
            <label><FieldLabel guide={guides.reportType} onOpen={setGuide} required>TIPO DI RAPPORTO</FieldLabel><select value={form.tipo} onChange={event => update('tipo', event.target.value as ReportKind)}>{Object.entries(reportLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
            <label><FieldLabel guide={guides.priority} onOpen={setGuide} required>PRIORITÀ DI TRASMISSIONE</FieldLabel><select value={form.priorita} onChange={event => update('priorita', event.target.value as FormState['priorita'])}><option value="immediata">Immediata</option><option value="urgente">Urgente</option><option value="ordinaria">Ordinaria</option><option value="differibile">Differibile</option></select></label>
            <label className="span-two"><FieldLabel guide={guides.identification} onOpen={setGuide} required>TITOLO PROPOSTO</FieldLabel><input required value={form.titolo} onChange={event => update('titolo', event.target.value)} placeholder="Titolo breve e descrittivo" /></label>
            <label><FieldLabel guide={guides.identification} onOpen={setGuide} required>SEGNAPOSTO</FieldLabel><input value={user?.identificativo || ''} readOnly aria-readonly="true" /></label>
            <label><FieldLabel guide={guides.identification} onOpen={setGuide} required>DATA DI REDAZIONE</FieldLabel><input required type="date" value={form.dataRedazione} onChange={event => update('dataRedazione', event.target.value)} /></label>
            <label><FieldLabel guide={guides.identification} onOpen={setGuide} required>ORA LOCALE SAL</FieldLabel><input required type="time" value={form.oraRedazione} onChange={event => update('oraRedazione', event.target.value)} /></label>
            <label><FieldLabel guide={guides.identification} onOpen={setGuide} required>DATA O PERIODO DEGLI EVENTI</FieldLabel><input required value={form.periodoEventi} onChange={event => update('periodoEventi', event.target.value)} placeholder="Data, intervallo o formulazione motivata" /></label>
            <label className="span-two"><FieldLabel guide={guides.identification} onOpen={setGuide} required>LUOGO</FieldLabel><input required value={form.luogo} onChange={event => update('luogo', event.target.value)} placeholder="Luogo degli eventi o ambito interessato" /></label>
          </div>
        </section>

        <section className="deposit-section">
          <header><div><span>02</span><h2>Sintesi e contenuto</h2></div><GuideButton guide={guides.content} onOpen={setGuide} /></header>
          <div className="deposit-grid">
            <label><FieldLabel guide={guides.summary} onOpen={setGuide} required>SINTESI</FieldLabel><textarea required rows={4} value={form.sintesi} onChange={event => update('sintesi', event.target.value)} placeholder="Che cosa è stato appreso e perché è rilevante?" /></label>
            <label><FieldLabel guide={guides.content} onOpen={setGuide} required>CONTENUTO INFORMATIVO</FieldLabel><textarea required rows={10} value={form.contenuto} onChange={event => update('contenuto', event.target.value)} placeholder="Riportare l’informazione raccolta senza confonderla con valutazioni o inferenze." /></label>
          </div>
        </section>

        <section className="deposit-section specific-section">
          <header><div><span>03</span><h2>Requisiti: {reportLabels[form.tipo]}</h2></div><GuideButton guide={guides.reportType} onOpen={setGuide} /></header>
          <div className="deposit-grid">{activeSpecificFields.map(field => <label key={field.key}><FieldLabel guide={field.guide} onOpen={setGuide} required={field.required}>{field.label.toUpperCase()}</FieldLabel><textarea required={field.required} rows={field.rows || 4} value={form.specific[field.key] || ''} onChange={event => updateSpecific(field.key, event.target.value)} placeholder={field.placeholder} /></label>)}</div>
        </section>

        <section className="deposit-section">
          <header><div><span>04</span><h2>Provenienza</h2></div><GuideButton guide={guides.provenance} onOpen={setGuide} /></header>
          <div className="deposit-grid two-columns">
            <label><FieldLabel guide={guides.provenance} onOpen={setGuide} required>MODALITÀ DI ACQUISIZIONE O PROVENIENZA</FieldLabel><textarea required rows={5} value={form.provenienza} onChange={event => update('provenienza', event.target.value)} placeholder="Come è arrivata l’informazione al Cenacolo?" /></label>
            <label><FieldLabel guide={guides.provenance} onOpen={setGuide} required>FONTE O ORIGINE</FieldLabel><textarea required rows={5} value={form.fonte} onChange={event => update('fonte', event.target.value)} placeholder="Indicare la fonte senza esporre dati non necessari." /></label>
          </div>
        </section>

        <section className="deposit-section">
          <header><div><span>05</span><h2>Valutazione dell’informazione</h2></div><GuideButton guide={guides.evaluation} onOpen={setGuide} /></header>
          <div className="classification-warning"><strong>{form.affidabilita}{form.credibilita}</strong><p>La lettera valuta la fonte; il numero valuta la specifica informazione. La confidenza delle eventuali conclusioni resta separata.</p></div>
          <div className="deposit-grid three-columns">
            <label><FieldLabel guide={guides.evaluation} onOpen={setGuide} required>AFFIDABILITÀ DELLA FONTE</FieldLabel><select value={form.affidabilita} onChange={event => update('affidabilita', event.target.value as FormState['affidabilita'])}><option value="A">A · completamente affidabile</option><option value="B">B · solitamente affidabile</option><option value="C">C · abbastanza affidabile</option><option value="D">D · generalmente non affidabile</option><option value="E">E · inaffidabile</option><option value="F">F · non valutabile</option></select></label>
            <label><FieldLabel guide={guides.evaluation} onOpen={setGuide} required>CREDIBILITÀ DELL’INFORMAZIONE</FieldLabel><select value={form.credibilita} onChange={event => update('credibilita', event.target.value as FormState['credibilita'])}><option value="1">1 · confermata indipendentemente</option><option value="2">2 · probabilmente vera</option><option value="3">3 · possibilmente vera</option><option value="4">4 · dubbia</option><option value="5">5 · improbabile</option><option value="6">6 · non valutabile</option></select></label>
            <label><FieldLabel guide={guides.evaluation} onOpen={setGuide} required>BASE DI CONOSCENZA</FieldLabel><select value={form.baseConoscenza} onChange={event => update('baseConoscenza', event.target.value as FormState['baseConoscenza'])}><option value="diretta">Diretta</option><option value="indiretta">Indiretta</option><option value="inferita">Inferita</option><option value="non_determinata">Non determinata</option></select></label>
            <label><FieldLabel guide={guides.evaluation} onOpen={setGuide} required>VALIDITÀ TEMPORALE</FieldLabel><select value={form.validita} onChange={event => update('validita', event.target.value as FormState['validita'])}><option value="corrente">Corrente</option><option value="da_riconfermare">Da riconfermare</option><option value="superata">Superata</option></select></label>
            <label className="span-two"><FieldLabel guide={guides.evaluation} onOpen={setGuide} required>AMBITO DELLA CLASSIFICAZIONE</FieldLabel><select value={form.ambitoClassificazione} onChange={event => update('ambitoClassificazione', event.target.value as FormState['ambitoClassificazione'])}><option value="intero_record_provvisoria">Classificazione provvisoria dell’intero rapporto</option><option value="affermazioni_distinte">Affermazioni da classificare separatamente</option></select></label>
            <label className="span-three"><FieldLabel guide={guides.evaluation} onOpen={setGuide} required>CORROBORAZIONI</FieldLabel><textarea required rows={4} value={form.corroborazione} onChange={event => update('corroborazione', event.target.value)} placeholder="Indicare riscontri realmente indipendenti oppure «nessuna corroborazione indipendente»." /></label>
            <label><FieldLabel guide={guides.evaluation} onOpen={setGuide} required>LIMITI</FieldLabel><textarea required rows={5} value={form.limiti} onChange={event => update('limiti', event.target.value)} placeholder="Limiti della raccolta, dell’accesso o della valutazione." /></label>
            <label className="span-two"><FieldLabel guide={guides.evaluation} onOpen={setGuide} required>CONTRADDIZIONI</FieldLabel><textarea required rows={5} value={form.contraddizioni} onChange={event => update('contraddizioni', event.target.value)} placeholder="Elementi contrari; indicare «nessuna nota» se non ne risultano." /></label>
          </div>
        </section>

        <section className="deposit-section">
          <header><div><span>06</span><h2>Analisi</h2></div><GuideButton guide={guides.analysis} onOpen={setGuide} /></header>
          <label className="deposit-single"><FieldLabel guide={guides.analysis} onOpen={setGuide}>ANALISI DISTINTA DAL CONTENUTO</FieldLabel><textarea rows={7} value={form.analisi} onChange={event => update('analisi', event.target.value)} placeholder="Eventuali conclusioni, assunzioni e grado di confidenza. Lasciare vuoto se il rapporto non contiene analisi." /></label>
        </section>

        <section className="deposit-section">
          <header><div><span>07</span><h2>Collegamenti, materiali e lacune</h2></div><GuideButton guide={guides.links} onOpen={setGuide} /></header>
          <div className="deposit-grid two-columns">
            <label><FieldLabel guide={guides.links} onOpen={setGuide}>ENTITÀ ESISTENTI O NUOVE ENTITÀ DA INDICIZZARE</FieldLabel><textarea rows={5} value={form.entitaCollegate} onChange={event => update('entitaCollegate', event.target.value)} placeholder="Un identificativo o una proposta per riga, con il motivo del collegamento." /></label>
            <label><FieldLabel guide={guides.links} onOpen={setGuide}>RECORD COLLEGATI</FieldLabel><textarea rows={5} value={form.recordCollegati} onChange={event => update('recordCollegati', event.target.value)} placeholder="Identificativo e natura del collegamento, uno per riga." /></label>
            <label><FieldLabel guide={guides.materials} onOpen={setGuide}>MATERIALI O ALLEGATI ASSOCIATI</FieldLabel><textarea rows={5} value={form.materiali} onChange={event => update('materiali', event.target.value)} placeholder="Descrizione e relazione dell’allegato con il rapporto." /></label>
            <label><FieldLabel guide={guides.gaps} onOpen={setGuide}>LACUNE RESIDUE</FieldLabel><textarea rows={5} value={form.lacune} onChange={event => update('lacune', event.target.value)} placeholder="Che cosa rimane necessario conoscere?" /></label>
            <label><FieldLabel guide={guides.provenance} onOpen={setGuide}>RESTRIZIONI DI ACCESSO O DIFFUSIONE</FieldLabel><textarea rows={4} value={form.restrizioni} onChange={event => update('restrizioni', event.target.value)} placeholder="Indicare ragione e perimetro della restrizione, se presenti." /></label>
            <label><FieldLabel guide={guides.identification} onOpen={setGuide}>NOTE PER LA REGISTRAZIONE</FieldLabel><textarea rows={4} value={form.note} onChange={event => update('note', event.target.value)} placeholder="Indicazioni utili a chi registrerà il rapporto in INDICE." /></label>
          </div>
          <div className="deposit-attachment-fields">
            <div className="deposit-subheading"><span>METADATI DELL’ALLEGATO</span><GuideButton guide={guides.materials} onOpen={setGuide} /></div>
            <p>Compilare questa parte soltanto quando alla proposta è associato un file o un materiale. Per più allegati, ripetere nel campo descrittivo la stessa struttura per ciascun elemento.</p>
            <div className="deposit-grid two-columns">
              <label><FieldLabel guide={guides.materials} onOpen={setGuide}>NOME DEL FILE O MATERIALE</FieldLabel><input value={form.allegatoNome} onChange={event => update('allegatoNome', event.target.value)} placeholder="Nome esatto o identificativo provvisorio" /></label>
              <label><FieldLabel guide={guides.materials} onOpen={setGuide}>FORMATO</FieldLabel><input value={form.allegatoFormato} onChange={event => update('allegatoFormato', event.target.value)} placeholder="PDF, PNG, testo, supporto fisico..." /></label>
              <label className="span-two"><FieldLabel guide={guides.materials} onOpen={setGuide}>ORIGINE</FieldLabel><textarea rows={3} value={form.allegatoOrigine} onChange={event => update('allegatoOrigine', event.target.value)} placeholder="Da chi, da quale sistema o da quale supporto proviene?" /></label>
              <label><FieldLabel guide={guides.materials} onOpen={setGuide}>AUTENTICITÀ</FieldLabel><select value={form.allegatoAutenticita} onChange={event => update('allegatoAutenticita', event.target.value as FormState['allegatoAutenticita'])}><option value="non_indicata">Non indicata</option><option value="verificata">Verificata</option><option value="non_verificata">Non verificata</option><option value="contestata">Contestata</option><option value="sconosciuta">Sconosciuta</option></select></label>
              <label><FieldLabel guide={guides.materials} onOpen={setGuide}>INTEGRITÀ</FieldLabel><select value={form.allegatoIntegrita} onChange={event => update('allegatoIntegrita', event.target.value as FormState['allegatoIntegrita'])}><option value="non_indicata">Non indicata</option><option value="verificata">Verificata</option><option value="non_verificata">Non verificata</option><option value="compromessa">Compromessa</option><option value="sconosciuta">Sconosciuta</option></select></label>
              <label><FieldLabel guide={guides.materials} onOpen={setGuide}>STATO DEL MATERIALE</FieldLabel><select value={form.allegatoStato} onChange={event => update('allegatoStato', event.target.value as FormState['allegatoStato'])}><option value="non_indicato">Non indicato</option><option value="originale">Originale</option><option value="originale_digitale">Originale digitale</option><option value="copia">Copia</option><option value="copia_autenticata">Copia autenticata</option><option value="copia_non_verificata">Copia non verificata</option><option value="trascrizione">Trascrizione</option><option value="estratto">Estratto</option><option value="alterato">Alterato</option><option value="incerto">Incerto</option></select></label>
              <label><FieldLabel guide={guides.materials} onOpen={setGuide}>MODALITÀ DI CONSEGNA</FieldLabel><input value={form.allegatoConsegna} onChange={event => update('allegatoConsegna', event.target.value)} placeholder="Allegato al messaggio, consegna fisica..." /></label>
              <label className="span-two"><FieldLabel guide={guides.materials} onOpen={setGuide}>CONVERSIONI NOTE</FieldLabel><textarea rows={3} value={form.allegatoConversioni} onChange={event => update('allegatoConversioni', event.target.value)} placeholder="Scansioni, ricodifiche, ritagli o altre trasformazioni; indicare «nessuna» se verificato." /></label>
              <label><FieldLabel guide={guides.materials} onOpen={setGuide}>ALGORITMO DI FISSITÀ</FieldLabel><input value={form.allegatoAlgoritmo} onChange={event => update('allegatoAlgoritmo', event.target.value)} placeholder="Per esempio SHA-256" /></label>
              <label><FieldLabel guide={guides.materials} onOpen={setGuide}>IMPRONTA DI FISSITÀ</FieldLabel><input className="monospace" value={form.allegatoImpronta} onChange={event => update('allegatoImpronta', event.target.value)} placeholder="Impronta calcolata sul file consegnato" /></label>
            </div>
          </div>
        </section>

        <div className="deposit-submit"><div><strong>PREPARAZIONE LOCALE</strong><span>Nessun dato verrà trasmesso o aggiunto automaticamente alla Segreta.</span></div><button type="submit">COMPONI IL TESTO COMPLETO</button></div>
      </div>

      <aside className="deposit-control">
        <span className="section-kicker">CONTROLLO DI COMPLETEZZA</span>
        <strong className="completion-number">{completion}%</strong>
        <div className="completion-track" aria-label={`Completezza ${completion}%`}><span style={{ width: `${completion}%` }} /></div>
        <p>{completed} di {requiredValues.length} campi necessari compilati.</p>
        <dl><div><dt>Autore</dt><dd>{user?.identificativo}</dd></div><div><dt>Tipo</dt><dd>{reportLabels[form.tipo]}</dd></div><div><dt>Priorità</dt><dd>{form.priorita}</dd></div><div><dt>Classificazione</dt><dd>{form.affidabilita}{form.credibilita}</dd></div></dl>
        <small>I campi contrassegnati con * sono necessari per comporre la proposta.</small>
      </aside>
    </form>

    {output && <section className="deposit-result" ref={resultRef}>
      <header><div><span>TESTO PRONTO PER LA TRASMISSIONE</span><h2>Proposta composta</h2></div><span className={copied && outputCurrent ? 'result-state copied' : 'result-state'}>{!outputCurrent ? 'DA RICOMPORRE' : copied ? 'COPIATA' : 'NON ANCORA COPIATA'}</span></header>
      <p>Controlla il testo. Se modifichi il modulo dopo la composizione, componilo nuovamente prima della trasmissione.</p>
      <textarea readOnly value={output} aria-label="Testo completo del rapporto" />
      {copyError && <p className="deposit-copy-error">{copyError}</p>}
      <div className="deposit-result-actions">
        <button type="button" onClick={copyReport} disabled={!outputCurrent}>{!outputCurrent ? 'RICOMPONI PRIMA DELLA COPIA' : copied ? 'COPIA DI NUOVO' : 'COPIA IL TESTO COMPLETO'}</button>
        {copied && outputCurrent && <a href={FILO_DIRETTO_URL} target="_blank" rel="noreferrer">APRI FILO DIRETTO →</a>}
      </div>
      {!outputCurrent && <div className="transmission-instruction stale"><strong>TESTO NON AGGIORNATO</strong><span>Il modulo è stato modificato. Usa nuovamente «Componi il testo completo» prima della copia.</span></div>}
      {copied && outputCurrent && <div className="transmission-instruction"><strong>TESTO COPIATO</strong><span>Apri Filo diretto, crea il messaggio pertinente e incolla integralmente la proposta prima dell’invio.</span></div>}
    </section>}

    {guide && <GuideModal guide={guide} onClose={() => setGuide(null)} />}
  </div>;
}
