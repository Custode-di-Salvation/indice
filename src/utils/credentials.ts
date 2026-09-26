import credentials from '../data/auth/segnaposti.json';

export function normalizeSegnaposto(value: string) {
  return value.trim().replace(/\s+/g, ' ').toLocaleUpperCase('it-IT');
}

const activeSegnaposti = new Set(credentials.attivi.map(normalizeSegnaposto));

export function isActiveSegnaposto(value: string) {
  return activeSegnaposti.has(normalizeSegnaposto(value));
}
