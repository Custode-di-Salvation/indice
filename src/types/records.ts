import type {
  RecordType,
  RecordAvailability,
  Provenance,
  AccessLevel,
  SourceReliability,
  InformationCredibility,
  KnowledgeBasis,
  InformationValidity,
  MediaFormat,
} from './common';

export interface Record {
  id: string;
  tipo: RecordType;
  titolo: string;
  sommario?: string;
  testo?: string;
  dataOriginale?: string;
  dataAcquisizione: string;
  nodo: string;
  disponibilita: RecordAvailability;
  tipoRapporto?: 'segnalazione_immediata' | 'rapporto_osservazione' | 'rapporto_contatto' | 'rapporto_informativo' | 'valutazione_analitica' | 'nota_rettifica_integrazione';
  prioritaTrasmissione?: 'immediata' | 'urgente' | 'ordinaria' | 'differibile';
  provenance: Provenance;
  file?: string; // path to file in /public/archive/
  fileFormat?: MediaFormat;
  entitaAssociate: string[];
  recordCollegati?: string[];
  fonteId?: string;
  affidabilitaFonte?: SourceReliability;
  credibilitaInformazione?: InformationCredibility;
  baseConoscenza?: KnowledgeBasis;
  validitaTemporale?: InformationValidity;
  classificazioneAmbito?: 'intero_record_provvisoria' | 'affermazioni_distinte';
  restrizioni?: string;
  note?: string;
  accessLevel: AccessLevel;
  hidden?: boolean;
  collocazioneFisica?: string; // for non-digitized records
  ultimoAggiornamento: string;
}

export interface Source {
  id: string;
  codename?: string;
  tipo: 'fonte_umana' | 'fonte_documentale' | 'fonte_tecnica' | 'fonte_storica' | 'intercettazione';
  gestione: string;
  stato: 'attiva' | 'inattiva' | 'compromessa' | 'sconosciuta' | 'cessata';
  affidabilita: SourceReliability;
  ultimoApporto?: string;
  rapportiAssociati: string[];
  entitaAssociate?: string[];
  identitaReale?: string; // null or restricted
  identitaRistretta?: boolean;
  motivoRestrizione?: string;
  noteValutazione?: string;
  accessLevel: AccessLevel;
  hidden?: boolean;
  ultimoAggiornamento: string;
}

export interface MediaItem {
  id: string;
  titolo: string;
  tipo: MediaFormat;
  file?: string;
  data?: string;
  nodo: string;
  provenance: Provenance;
  entitaAssociate: string[];
  recordAssociati?: string[];
  descrizione?: string;
  formato?: string;
  accessLevel: AccessLevel;
  hidden?: boolean;
  ultimoAggiornamento: string;
}
