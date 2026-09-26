import type { NodeStatus, AccessLevel } from './common';

export interface CenacoloNode {
  id: string;
  codice: string;
  tavola: string;
  stato: NodeStatus;
  ultimoContatto?: string;
  sincronizzazione?: 'continuo' | 'periodico' | 'nessuno' | 'sconosciuto';
  noteStoriche?: string;
  accessLevel: AccessLevel;
}

export interface ManualChapter {
  slug: string;
  numero: string;
  titolo: string;
  parte?: string;
  stato?: string;
  efficacia?: string;
  revisione?: string;
  content: string;
}
