/* ═══════════════════════════════════════════════
   Common enums and shared types for INDICE
   ═══════════════════════════════════════════════ */

export type EntityType = 'persona' | 'organizzazione' | 'luogo' | 'evento' | 'fenomeno' | 'oggetto';

export type EntityStatus = 'attivo' | 'chiuso' | 'dormiente' | 'in_revisione' | 'incompleto';

export type Provenienza = 'salvation' | 'nodo_remoto' | 'archivio_storico' | 'fonte_esterna';

export type SourceReliability = 'A' | 'B' | 'C' | 'D' | 'E' | 'F';

export type InformationCredibility = 1 | 2 | 3 | 4 | 5 | 6;

export type KnowledgeBasis = 'diretta' | 'indiretta' | 'inferita' | 'non_determinata';

export type InformationValidity = 'corrente' | 'da_riconfermare' | 'superata';

export type AnalyticalConfidence = 'alta' | 'moderata' | 'bassa';

export type RecordAvailability = 'locale' | 'replicato' | 'remoto' | 'parziale' | 'orfano';

export type NodeStatus = 'locale' | 'attivo' | 'intermittente' | 'silente' | 'ignoto' | 'accesso_negato';

export type AccessLevel = 'pubblico' | 'ospite' | 'commensale';

export type RecordType =
  | 'rapporto'
  | 'documento'
  | 'lettera'
  | 'testimonianza'
  | 'fotografia'
  | 'mappa'
  | 'registrazione_audio'
  | 'video'
  | 'scansione'
  | 'estratto'
  | 'documento_storico';

export type MediaFormat = 'pdf' | 'immagine' | 'audio' | 'video' | 'testo' | 'mappa' | 'scansione';

export type RelationType =
  | 'presente_a'
  | 'membro_di'
  | 'menzionato_in'
  | 'avvenuto_a'
  | 'associato_a'
  | 'collegato_a'
  | 'custodito_da'
  | 'osservato_in'
  | 'prodotto_da'
  | 'precede'
  | 'contraddice'
  | 'possible_match';

export type RelationStatus = 'confirmed' | 'unvalidated' | 'contradicted';

export interface Provenance {
  nodo: string;
  responsabile?: string;
  acquisizione: string;
  supporto: string;
  autenticita?: 'verificata' | 'non_verificata' | 'contestata' | 'sconosciuta';
  integrita: 'verificata' | 'non_verificata' | 'compromessa' | 'sconosciuta';
  statoMateriale?: 'originale' | 'originale_digitale' | 'copia' | 'copia_autenticata' | 'copia_non_verificata' | 'trascrizione' | 'estratto' | 'alterato' | 'incerto';
  storiaCustodiale?: string;
  conversioniNote?: string[];
  fissita?: {
    algoritmo: string;
    impronta: string;
    acquisizione: string;
    ultimaVerifica: string;
    esito: 'corrispondente' | 'non_corrispondente' | 'non_verificata';
  };
  corroborazioni: number;
  contraddizioni: number;
  ultimaRevisione: string;
}

export interface InfoBlock {
  tipo: 'corroborato' | 'non_confermato' | 'valutazione' | 'contraddizione' | 'mancante';
  contenuto: string;
  fonti?: string[];
  confidenza?: AnalyticalConfidence;
}

export const ENTITY_TYPE_LABELS: Record<EntityType, string> = {
  persona: 'Persona',
  organizzazione: 'Organizzazione',
  luogo: 'Luogo',
  evento: 'Evento',
  fenomeno: 'Fenomeno',
  oggetto: 'Oggetto',
};

export const ENTITY_TYPE_PREFIX: Record<EntityType, string> = {
  persona: 'PER',
  organizzazione: 'ORG',
  luogo: 'LOC',
  evento: 'EVT',
  fenomeno: 'FEN',
  oggetto: 'OBJ',
};

export const STATUS_LABELS: Record<EntityStatus, string> = {
  attivo: 'Attivo',
  chiuso: 'Chiuso',
  dormiente: 'Dormiente',
  in_revisione: 'In revisione',
  incompleto: 'Incompleto',
};

export const NODE_STATUS_LABELS: Record<NodeStatus, string> = {
  locale: 'Locale',
  attivo: 'Attivo',
  intermittente: 'Intermittente',
  silente: 'Silente',
  ignoto: 'Ignoto',
  accesso_negato: 'Accesso negato',
};

export const SOURCE_RELIABILITY_LABELS: Record<SourceReliability, string> = {
  A: 'Completamente affidabile',
  B: 'Solitamente affidabile',
  C: 'Abbastanza affidabile',
  D: 'Generalmente non affidabile',
  E: 'Inaffidabile',
  F: 'Affidabilità non valutabile',
};

export const INFORMATION_CREDIBILITY_LABELS: Record<InformationCredibility, string> = {
  1: 'Confermata da fonti indipendenti',
  2: 'Probabilmente vera',
  3: 'Possibilmente vera',
  4: 'Dubbia',
  5: 'Improbabile',
  6: 'Veridicità non valutabile',
};

export const RECORD_TYPE_LABELS: Record<RecordType, string> = {
  rapporto: 'Rapporto',
  documento: 'Documento',
  lettera: 'Lettera',
  testimonianza: 'Testimonianza',
  fotografia: 'Fotografia',
  mappa: 'Mappa',
  registrazione_audio: 'Registrazione audio',
  video: 'Video',
  scansione: 'Scansione',
  estratto: 'Estratto',
  documento_storico: 'Documento storico',
};
