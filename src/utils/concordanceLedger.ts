import type { AnalyticalConfidence, Relation, RelationType } from '../types';

export type ConcordanceActionKind = 'plausible' | 'support' | 'contest' | 'contradict' | 'insufficient' | 'discard';
export type ConcordanceDisplayState = 'confirmed' | 'confirmed_contested' | 'locally_validated' | 'validated_contested' | 'plausible' | 'contested' | 'contradicted' | 'insufficient' | 'discarded' | 'unvalidated';
export type AssertionActionKind = 'corroborate' | 'contradict';
export type AssertionSubjectKind = 'entity' | 'record' | 'source' | 'media';

export interface ConcordanceAction {
  id: string;
  relationId: string;
  action: ConcordanceActionKind;
  reason: string;
  confidence: AnalyticalConfidence;
  supportIds: string[];
  segnaposto: string;
  node: 'SAL';
  recordedAt: string;
}

export interface LocalProposal extends Relation {
  proposedBy: string;
  proposedAt: string;
}

export interface AssertionAction {
  id: string;
  subjectId: string;
  subjectKind: AssertionSubjectKind;
  assertionKey: string;
  assertionText: string;
  action: AssertionActionKind;
  reason: string;
  supportIds: string[];
  segnaposto: string;
  node: 'SAL';
  recordedAt: string;
}

export interface ConcordanceLedger {
  proposals: LocalProposal[];
  actions: ConcordanceAction[];
  assertionActions: AssertionAction[];
}

export const EMPTY_LEDGER: ConcordanceLedger = { proposals: [], actions: [], assertionActions: [] };

export const ASSERTION_ACTION_LABELS: Record<AssertionActionKind, string> = {
  corroborate: 'Corroborazione depositata',
  contradict: 'Contraddizione depositata',
};

export const ACTION_LABELS: Record<ConcordanceActionKind, string> = {
  plausible: 'Valutata plausibile',
  support: 'Riscontro favorevole',
  contest: 'Contestazione registrata',
  contradict: 'Contraddizione registrata',
  insufficient: 'Elementi insufficienti',
  discard: 'Scartata per errore materiale',
};

export const STATE_LABELS: Record<ConcordanceDisplayState, string> = {
  confirmed: 'confermata',
  confirmed_contested: 'confermata ma contestata',
  locally_validated: 'convalidata localmente',
  validated_contested: 'convalidata ma contestata',
  plausible: 'plausibile',
  contested: 'contestata',
  contradicted: 'contraddetta',
  insufficient: 'in esame: elementi insufficienti',
  discarded: 'scartata',
  unvalidated: 'da valutare',
};

export function relationActions(relationId: string, ledger: ConcordanceLedger) {
  return ledger.actions.filter(action => action.relationId === relationId);
}

export function deriveRelationState(relation: Relation, ledger: ConcordanceLedger): { state: ConcordanceDisplayState; favorable: number; contested: number } {
  const latestByActor = new Map<string, ConcordanceAction>();
  relationActions(relation.id, ledger).forEach(action => latestByActor.set(action.segnaposto, action));
  const current = [...latestByActor.values()];
  const favorable = current.filter(action => action.action === 'plausible' || action.action === 'support').length;
  const contests = current.filter(action => action.action === 'contest').length;
  const contradictions = current.filter(action => action.action === 'contradict').length;
  const discarded = current.some(action => action.action === 'discard');
  if (discarded) return { state:'discarded', favorable, contested:contests + contradictions };
  if (contradictions) return { state:'contradicted', favorable, contested:contests + contradictions };
  if (relation.status === 'confirmed') return { state:contests?'confirmed_contested':'confirmed', favorable, contested:contests };
  if (favorable >= 2) return { state:contests?'validated_contested':'locally_validated', favorable, contested:contests };
  if (contests) return { state:'contested', favorable, contested:contests };
  if (favorable === 1) return { state:'plausible', favorable, contested:0 };
  if (current.some(action => action.action === 'insufficient')) return { state:'insufficient', favorable:0, contested:0 };
  return { state:relation.status === 'contradicted'?'contradicted':'unvalidated', favorable:0, contested:0 };
}

export interface ProposalInput {
  from: string;
  to: string;
  tipo: RelationType;
  reason: string;
  supportIds: string[];
  segnaposto: string;
}

export interface ActionInput {
  relationId: string;
  action: ConcordanceActionKind;
  reason: string;
  confidence: AnalyticalConfidence;
  supportIds: string[];
  segnaposto: string;
}

export interface AssertionActionInput {
  subjectId: string;
  subjectKind: AssertionSubjectKind;
  assertionKey: string;
  assertionText: string;
  action: AssertionActionKind;
  reason: string;
  supportIds: string[];
  segnaposto: string;
}

async function send<T>(url: string, input: unknown): Promise<T> {
  const response = await fetch(url, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(input) });
  const payload = await response.json();
  if (!response.ok) throw new Error(payload.error || 'Registrazione non riuscita');
  return payload as T;
}

export async function loadConcordanceLedger(): Promise<ConcordanceLedger> {
  const response = await fetch('/api/concordances');
  if (!response.ok) throw new Error('Registro locale non disponibile');
  const ledger = await response.json();
  return { proposals:ledger.proposals || [], actions:ledger.actions || [], assertionActions:ledger.assertionActions || [] };
}

export const submitConcordanceAction = (input: ActionInput) => send<ConcordanceAction>('/api/concordances/actions', input);
export const submitConcordanceProposal = (input: ProposalInput) => send<LocalProposal>('/api/concordances/proposals', input);
export const submitAssertionAction = (input: AssertionActionInput) => send<AssertionAction>('/api/concordances/assertions', input);

export function assertionActions(subjectId: string, assertionKey: string, ledger: ConcordanceLedger) {
  return ledger.assertionActions.filter(action => action.subjectId === subjectId && action.assertionKey === assertionKey);
}

export function deriveAssertionEvidence(subjectId: string, assertionKey: string, ledger: ConcordanceLedger) {
  const latestByActor = new Map<string, AssertionAction>();
  assertionActions(subjectId, assertionKey, ledger).forEach(action => latestByActor.set(action.segnaposto, action));
  const current = [...latestByActor.values()];
  return {
    corroborations: current.filter(action => action.action === 'corroborate').length,
    contradictions: current.filter(action => action.action === 'contradict').length,
  };
}
