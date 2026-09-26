import type { EntityType, EntityStatus, Provenienza, Provenance, InfoBlock, AccessLevel } from './common';

export interface BaseEntity {
  id: string;
  tipo: EntityType;
  nome: string;
  alias?: string[];
  stato: EntityStatus;
  provenienza: Provenienza;
  nodo: string;
  periodoInizio?: string;
  periodoFine?: string;
  sintesi?: string;
  provenance: Provenance;
  infoBlocks?: InfoBlock[];
  tags?: string[];
  accessLevel: AccessLevel;
  hidden?: boolean; // completely hidden from unauthorized users
  recordCount?: number;
  sourceCount?: number;
  relationCount?: number;
  ultimoAggiornamento: string;
}

export interface Persona extends BaseEntity {
  tipo: 'persona';
  sesso?: 'M' | 'F' | 'sconosciuto';
  nazionalita?: string;
  ruolo?: string;
  organizzazione?: string;
}

export interface Organizzazione extends BaseEntity {
  tipo: 'organizzazione';
  sede?: string;
  fondazione?: string;
  classificazione?: string;
  membriNoti?: number;
}

export interface Luogo extends BaseEntity {
  tipo: 'luogo';
  coordinate?: string;
  regione?: string;
  paese?: string;
  tipologiaLuogo?: string;
}

export interface Evento extends BaseEntity {
  tipo: 'evento';
  data: string;
  luogo?: string;
  partecipanti?: string[];
  esito?: string;
}

export interface Fenomeno extends BaseEntity {
  tipo: 'fenomeno';
  classificazione?: string;
  frequenza?: string;
  areaInteressata?: string;
  primaOsservazione?: string;
}

export interface Oggetto extends BaseEntity {
  tipo: 'oggetto';
  collocazione?: string;
  materiale?: string;
  datazione?: string;
  custode?: string;
}

export type Entity = Persona | Organizzazione | Luogo | Evento | Fenomeno | Oggetto;
