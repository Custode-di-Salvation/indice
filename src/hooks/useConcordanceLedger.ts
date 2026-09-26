import { useCallback, useEffect, useState } from 'react';
import { EMPTY_LEDGER, loadConcordanceLedger, submitAssertionAction, submitConcordanceAction, submitConcordanceProposal, type ActionInput, type AssertionActionInput, type ConcordanceLedger, type ProposalInput } from '../utils/concordanceLedger';

export function useConcordanceLedger() {
  const [ledger, setLedger] = useState<ConcordanceLedger>(EMPTY_LEDGER);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const reload = useCallback(async () => {
    try { setError(''); setLedger(await loadConcordanceLedger()); }
    catch (reason) { setError(reason instanceof Error ? reason.message : 'Registro locale non disponibile'); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { void reload(); }, [reload]);
  const recordAction = async (input: ActionInput) => { await submitConcordanceAction(input); await reload(); };
  const recordAssertion = async (input: AssertionActionInput) => { await submitAssertionAction(input); await reload(); };
  const propose = async (input: ProposalInput) => { await submitConcordanceProposal(input); await reload(); };
  return { ledger, loading, error, reload, recordAction, recordAssertion, propose };
}
