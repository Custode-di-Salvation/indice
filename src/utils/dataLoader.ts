/// <reference types="vite/client" />
import { useState, useEffect } from 'react';
import type { Entity, Record, Source, MediaItem, Relation, CenacoloNode, ManualChapter, InformationGap } from '../types';

// Vite imports every local data file at build time.

const entityModules = import.meta.glob('../data/entities/*.json', { eager: true });
const recordModules = import.meta.glob('../data/records/*.json', { eager: true });
const sourceModules = import.meta.glob('../data/sources/*.json', { eager: true });
const mediaModules = import.meta.glob('../data/media/*.json', { eager: true });
const relationModules = import.meta.glob('../data/relations/*.json', { eager: true });
const nodeModules = import.meta.glob('../data/nodes/*.json', { eager: true });
const gapModules = import.meta.glob('../data/gaps/*.json', { eager: true });

// Markdown files are imported as raw strings
const manualModules = import.meta.glob('../../content/manual/*.md', { eager: true, query: '?raw' });

// Helper to extract default exports from eager modules
function extractData<T>(modules: { [key: string]: any }): T[] {
  return Object.values(modules).flatMap((mod: any) => mod.default || mod) as T[];
}

// In-memory data store
const db = {
  entities: extractData<Entity>(entityModules),
  records: extractData<Record>(recordModules),
  sources: extractData<Source>(sourceModules),
  media: extractData<MediaItem>(mediaModules),
  relations: extractData<Relation>(relationModules),
  nodes: extractData<CenacoloNode>(nodeModules),
  gaps: extractData<InformationGap>(gapModules),
  manualChapters: Object.entries(manualModules).map(([path, mod]) => {
    // Parse the small frontmatter block used by Manual chapters.
    const raw = (mod as { default: string }).default;
    const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    
    let titolo = 'Senza Titolo';
    let numero = '00';
    let parte = '';
    let stato = '';
    let efficacia = '';
    let revisione = '';
    let content = raw;

    if (match) {
      content = match[2];
      const fm = match[1];
      const titleMatch = fm.match(/titolo:\s*"(.*?)"/);
      const numMatch = fm.match(/numero:\s*"(.*?)"/);
      const partMatch = fm.match(/parte:\s*"(.*?)"/);
      const statusMatch = fm.match(/stato:\s*"(.*?)"/);
      const effectiveMatch = fm.match(/efficacia:\s*"(.*?)"/);
      const revMatch = fm.match(/revisione:\s*"(.*?)"/);
      
      if (titleMatch) titolo = titleMatch[1];
      if (numMatch) numero = numMatch[1];
      if (partMatch) parte = partMatch[1];
      if (statusMatch) stato = statusMatch[1];
      if (effectiveMatch) efficacia = effectiveMatch[1];
      if (revMatch) revisione = revMatch[1];
    }
    
    const slug = path.split('/').pop()?.replace('.md', '') || 'unknown';

    return { slug, numero, titolo, parte, stato, efficacia, revisione, content } as ManualChapter;
  }).sort((a, b) => a.numero.localeCompare(b.numero)),
};

// Synchronous local data access.

export const api = {
  getEntities: () => db.entities,
  getEntityById: (id: string) => db.entities.find((e) => e.id === id),
  
  getRecords: () => db.records,
  getRecordById: (id: string) => db.records.find((r) => r.id === id),
  getRecordsByEntity: (entityId: string) => db.records.filter((r) => r.entitaAssociate.includes(entityId)),
  
  getSources: () => db.sources,
  getSourceById: (id: string) => db.sources.find((s) => s.id === id),
  
  getMedia: () => db.media,
  getMediaById: (id: string) => db.media.find((m) => m.id === id),
  getMediaByEntity: (entityId: string) => db.media.filter((m) => m.entitaAssociate.includes(entityId)),
  
  getRelations: () => db.relations,
  getRelationsForEntity: (entityId: string) => db.relations.filter((r) => r.from === entityId || r.to === entityId),
  
  getNodes: () => db.nodes,

  getGaps: () => db.gaps,
  getGapById: (id: string) => db.gaps.find((gap) => gap.id === id),
  getGapsByRecord: (recordId: string) => db.gaps.filter((gap) => gap.recordCollegati.includes(recordId)),
  
  getManualChapters: () => db.manualChapters,
  getManualChapterBySlug: (slug: string) => db.manualChapters.find((c) => c.slug === slug),
};

// React hook exposing a brief transition while local data is prepared.
export function useData<T>(fetcher: () => T, deps: any[] = []): { data: T | null; loading: boolean } {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setData(fetcher());
      setLoading(false);
    }, 100);
    return () => clearTimeout(timer);
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps

  return { data, loading };
}
