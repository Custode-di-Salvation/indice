import type { AccessLevel } from './common';

export type InformationGapStatus = 'aperta' | 'in_verifica' | 'parzialmente_ridotta' | 'colmata' | 'superata';
export type InformationGapImpact = 'decisiva' | 'rilevante' | 'limitata';

export interface InformationGap {
  id: string;
  domanda: string;
  oggetto: string;
  rilevanza: string;
  criterioSufficienza: string;
  incidenza: InformationGapImpact;
  stato: InformationGapStatus;
  recordCollegati: string[];
  entitaCollegate?: string[];
  vincoli?: string[];
  proponente: string;
  dataApertura: string;
  ultimoAtto: string;
  accessLevel: AccessLevel;
  hidden?: boolean;
}
