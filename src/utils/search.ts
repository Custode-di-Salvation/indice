import Fuse from 'fuse.js';
import { api } from './dataLoader';
import { filterVisible, type UserProfile } from './permissions';
import type { Entity, Record as DataRecord, Source, MediaItem, ManualChapter, InformationGap } from '../types';

export type SearchCategory = 'Entità' | 'Record' | 'Fonti' | 'Media' | 'Lacune' | 'Manuale';

export interface SearchResultItem {
  id: string;
  category: SearchCategory;
  title: string;
  subtitle: string;
  url: string;
  status?: string;
  searchText?: string;
}

// Prepare flat index array on initialization
let searchIndex: SearchResultItem[] = [];
let fuseInstance: Fuse<SearchResultItem> | null = null;

function buildIndex(user: UserProfile | null) {
  const index: SearchResultItem[] = [];

  // 1. Entities
  filterVisible(api.getEntities(), user).forEach((e: Entity) => {
    index.push({
      id: e.id,
      category: 'Entità',
      title: `${e.id} · ${e.nome}`,
      subtitle: e.sintesi || e.tipo,
      url: `/segreta/entita/${e.id}`,
      status: e.stato,
    });
  });

  // 2. Records
  filterVisible(api.getRecords(), user).forEach((r: DataRecord) => {
    index.push({
      id: r.id,
      category: 'Record',
      title: `${r.id} · ${r.titolo}`,
      subtitle: r.sommario || r.tipo,
      url: `/segreta/record/${r.id}`,
    });
  });

  // 3. Sources
  filterVisible(api.getSources(), user).forEach((s: Source) => {
    index.push({
      id: s.id,
      category: 'Fonti',
      title: `${s.id}${s.codename ? ` "${s.codename}"` : ''}`,
      subtitle: `Gestione: ${s.gestione}`,
      url: `/segreta/fonti/${s.id}`,
      status: s.stato,
    });
  });

  // 4. Media
  filterVisible(api.getMedia(), user).forEach((m: MediaItem) => {
    index.push({
      id: m.id,
      category: 'Media',
      title: `${m.id} · ${m.titolo}`,
      subtitle: m.descrizione || m.tipo,
      url: `/segreta/media/${m.id}`,
    });
  });

  // 5. Information gaps
  filterVisible(api.getGaps(), user).forEach((gap: InformationGap) => {
    index.push({
      id: gap.id,
      category: 'Lacune',
      title: `${gap.id} · ${gap.domanda}`,
      subtitle: `${gap.oggetto} · ${gap.stato.replace(/_/g, ' ')}`,
      url: `/segreta/lacune/${gap.id}`,
      status: gap.stato,
    });
  });

  // 6. Manual
  api.getManualChapters().forEach((c: ManualChapter) => {
    index.push({
      id: c.slug,
      category: 'Manuale',
      title: `${c.numero} · ${c.titolo}`,
      subtitle: `Capitolo del Manuale Operativo`,
      searchText: c.content.replace(/[#>*_`\[\]()|-]/g, ' '),
      url: `/manuale/${c.slug}`,
    });
  });

  searchIndex = index;
  
  fuseInstance = new Fuse(searchIndex, {
    keys: ['id', 'title', 'subtitle', 'searchText'],
    threshold: 0.3,
    ignoreLocation: true,
    minMatchCharLength: 2,
  });
}

/**
 * Performs a global fuzzy search across all visible items for the user.
 */
export function performGlobalSearch(query: string, user: UserProfile | null): SearchResultItem[] {
  if (!query.trim()) return [];
  
  // Rebuild index if it's the first time or if the user changed (handled via hooks in practice, but keeping it simple here)
  // In a real large app we'd trigger this on login/logout, not every search.
  buildIndex(user);

  if (!fuseInstance) return [];

  const results = fuseInstance.search(query);
  return results.map((res) => res.item);
}
