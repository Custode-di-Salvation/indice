import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { promises as fs } from 'node:fs';
import type { IncomingMessage, ServerResponse } from 'node:http';

const ledgerPath = path.resolve(__dirname, 'local-data/concordance-ledger.json');
const dataPath = path.resolve(__dirname, 'src/data');
const emptyLedger = { proposals: [], actions: [], assertionActions: [] };
let writeQueue = Promise.resolve();

async function readLedger() {
  try {
    const ledger = JSON.parse(await fs.readFile(ledgerPath, 'utf8'));
    return { proposals:ledger.proposals || [], actions:ledger.actions || [], assertionActions:ledger.assertionActions || [] };
  }
  catch { await fs.mkdir(path.dirname(ledgerPath), { recursive: true }); await fs.writeFile(ledgerPath, JSON.stringify(emptyLedger, null, 2)); return structuredClone(emptyLedger); }
}

async function writeLedger(ledger: unknown) {
  const temporaryPath = `${ledgerPath}.tmp`;
  writeQueue = writeQueue.then(async () => {
    await fs.mkdir(path.dirname(ledgerPath), { recursive: true });
    await fs.writeFile(temporaryPath, `${JSON.stringify(ledger, null, 2)}\n`);
    await fs.rename(temporaryPath, ledgerPath);
  });
  return writeQueue;
}

function readBody(request: IncomingMessage): Promise<Record<string, unknown>> {
  return new Promise((resolve, reject) => {
    let body = '';
    request.on('data', chunk => { body += chunk; if (body.length > 1_000_000) reject(new Error('Richiesta troppo estesa')); });
    request.on('end', () => { try { resolve(JSON.parse(body || '{}')); } catch { reject(new Error('Corpo non valido')); } });
    request.on('error', reject);
  });
}

function json(response: ServerResponse, status: number, payload: unknown) {
  response.statusCode = status;
  response.setHeader('Content-Type', 'application/json; charset=utf-8');
  response.end(JSON.stringify(payload));
}

const allowedActions = new Set(['plausible', 'support', 'contest', 'contradict', 'insufficient', 'discard']);
const allowedRelations = new Set(['presente_a','membro_di','menzionato_in','avvenuto_a','associato_a','collegato_a','custodito_da','osservato_in','prodotto_da','precede','contraddice','possible_match']);

function indiceClock(now = new Date()) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone:'Europe/Rome', year:'numeric', month:'2-digit', day:'2-digit',
    hour:'2-digit', minute:'2-digit', second:'2-digit', hourCycle:'h23', timeZoneName:'longOffset',
  }).formatToParts(now);
  const value = (type: Intl.DateTimeFormatPartTypes) => parts.find(part => part.type === type)?.value || '00';
  const date = `${value('year')}-${value('month')}-${value('day')}`;
  const zoneName = value('timeZoneName');
  const offset = zoneName === 'GMT' ? '+00:00' : zoneName.replace('GMT', '');
  return {
    date,
    dateCompact: date.replace(/-/g, ''),
    timestamp: `${date}T${value('hour')}:${value('minute')}:${value('second')}${offset}`,
  };
}

async function idsIn(directory: string) {
  const ids = new Set<string>();
  const folder = path.join(dataPath, directory);
  for (const filename of await fs.readdir(folder)) {
    if (!filename.endsWith('.json')) continue;
    const parsed = JSON.parse(await fs.readFile(path.join(folder, filename), 'utf8'));
    if (Array.isArray(parsed)) parsed.forEach(item => typeof item?.id === 'string' && ids.add(item.id));
  }
  return ids;
}

async function currentReferences() {
  const [entities, records, sources, media, relations] = await Promise.all([
    idsIn('entities'), idsIn('records'), idsIn('sources'), idsIn('media'), idsIn('relations'),
  ]);
  return { entities, records, sources, media, relations };
}

function concordanceLedger(): Plugin {
  const middleware = () => async (request: IncomingMessage, response: ServerResponse, next: () => void) => {
    const pathname = new URL(request.url || '/', 'http://indice.local').pathname;
    if (!pathname.startsWith('/api/concordances')) return next();
    try {
      const ledger = await readLedger();
      if (request.method === 'GET' && pathname === '/api/concordances') return json(response, 200, ledger);
      const body = await readBody(request);
      const segnaposto = String(body.segnaposto || '').trim().toLocaleUpperCase('it-IT');
      if (!/^[A-ZÀ-ÖØ-Ý0-9'’ -]{2,32}$/.test(segnaposto)) return json(response, 400, { error: 'Segnaposto non valido' });
      const references = await currentReferences();
      if (request.method === 'POST' && pathname === '/api/concordances/actions') {
        const relationId = String(body.relationId || '');
        const action = String(body.action || '');
        const reason = String(body.reason || '').trim();
        const supportIds = Array.isArray(body.supportIds) ? body.supportIds.map(String).slice(0,30) : [];
        const relationExists = references.relations.has(relationId) || ledger.proposals.some((proposal: { id?: string }) => proposal.id === relationId);
        if (!relationId || !relationExists || !allowedActions.has(action) || reason.length < 12 || supportIds.some(id => !references.records.has(id))) return json(response, 400, { error: 'Valutazione incompleta o riferimenti non validi' });
        const sequence = ledger.actions.length + 1;
        const clock = indiceClock();
        const entry = { id:`VAL-SAL-${clock.dateCompact}-${String(sequence).padStart(4,'0')}`, relationId, action, reason:reason.slice(0,2000), confidence:body.confidence || 'bassa', supportIds, segnaposto, node:'SAL', recordedAt:clock.timestamp };
        ledger.actions.push(entry); await writeLedger(ledger); return json(response, 201, entry);
      }
      if (request.method === 'POST' && pathname === '/api/concordances/proposals') {
        const from = String(body.from || ''); const to = String(body.to || ''); const tipo = String(body.tipo || ''); const reason = String(body.reason || '').trim();
        const supportIds = Array.isArray(body.supportIds) ? body.supportIds.map(String).slice(0,30) : [];
        if (!from || !to || from === to || !references.entities.has(from) || !references.entities.has(to) || !allowedRelations.has(tipo) || reason.length < 12 || supportIds.some(id => !references.records.has(id))) return json(response, 400, { error: 'Proposta incompleta o riferimenti non validi' });
        const sequence = ledger.proposals.length + 1;
        const clock = indiceClock();
        const proposal = { id:`REL-SAL-${String(sequence).padStart(4,'0')}`, from, to, tipo, status:'unvalidated', reason:reason.slice(0,2000), supportedBy:supportIds, dataRilevazione:clock.date, proposedBy:segnaposto, proposedAt:clock.timestamp };
        ledger.proposals.push(proposal); await writeLedger(ledger); return json(response, 201, proposal);
      }
      if (request.method === 'POST' && pathname === '/api/concordances/assertions') {
        const subjectId = String(body.subjectId || ''); const subjectKind = String(body.subjectKind || ''); const assertionKey = String(body.assertionKey || ''); const assertionText = String(body.assertionText || '').trim(); const action = String(body.action || ''); const reason = String(body.reason || '').trim();
        const supportIds = Array.isArray(body.supportIds) ? body.supportIds.map(String).slice(0,30) : [];
        const subjectExists = subjectKind === 'entity' ? references.entities.has(subjectId)
          : subjectKind === 'record' ? references.records.has(subjectId)
          : subjectKind === 'source' ? references.sources.has(subjectId)
          : subjectKind === 'media' ? references.media.has(subjectId)
          : false;
        if (!subjectId || !subjectExists || !assertionKey || assertionText.length < 3 || !['corroborate','contradict'].includes(action) || reason.length < 12 || supportIds.length < 1 || supportIds.some(id => !references.records.has(id))) return json(response, 400, { error: 'Riscontro incompleto o riferimenti non validi' });
        if (subjectKind === 'record' && supportIds.includes(subjectId)) return json(response, 400, { error: 'Un record non può costituire riscontro di se stesso' });
        const sequence = ledger.assertionActions.length + 1;
        const clock = indiceClock();
        const entry = { id:`EVD-SAL-${clock.dateCompact}-${String(sequence).padStart(4,'0')}`, subjectId, subjectKind, assertionKey, assertionText:assertionText.slice(0,2000), action, reason:reason.slice(0,2000), supportIds, segnaposto, node:'SAL', recordedAt:clock.timestamp };
        ledger.assertionActions.push(entry); await writeLedger(ledger); return json(response, 201, entry);
      }
      return json(response, 404, { error: 'Operazione non disponibile' });
    } catch (error) { return json(response, 500, { error:error instanceof Error?error.message:'Errore del registro locale' }); }
  };
  return { name:'indice-concordance-ledger', configureServer(server){ server.middlewares.use(middleware()); }, configurePreviewServer(server){ server.middlewares.use(middleware()); } };
}

export default defineConfig({
  plugins: [react(), concordanceLedger()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  assetsInclude: ['**/*.md'],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('react-markdown') || id.includes('remark-') || id.includes('micromark') || id.includes('mdast') || id.includes('hast')) return 'manuale';
          if (id.includes('fuse.js')) return 'ricerca';
          if (id.includes('node_modules')) return 'vendor';
        },
      },
    },
  },
});
