import type { RelationType, RelationStatus } from './common';

export interface Relation {
  id: string;
  from: string;
  to: string;
  tipo: RelationType;
  status: RelationStatus;
  supportedBy?: string[];
  reason?: string;
  dataRilevazione?: string;
}
