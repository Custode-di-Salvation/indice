import { ENTITY_TYPE_LABELS, STATUS_LABELS, RECORD_TYPE_LABELS, NODE_STATUS_LABELS } from '../types';

/**
 * Ensures a date string is formatted in the Cenacolo style (DD.MM.YYYY)
 * or passes through existing strings if they are just years or already formatted.
 */
export function formatDate(dateString?: string): string {
  if (!dateString) return 'N/D';
  
  // If it's already in DD.MM.YYYY format or just a year, return as is
  if (/^\d{2}\.\d{2}\.\d{4}$/.test(dateString) || /^\d{4}$/.test(dateString)) {
    return dateString;
  }
  
  // Try to parse ISO strings
  try {
    const d = new Date(dateString);
    if (!isNaN(d.getTime())) {
      return d.toLocaleDateString('it-IT', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }).replace(/\//g, '.');
    }
  } catch (e) {
    // Ignore error
  }
  
  return dateString;
}

export function formatEntityStatus(status?: string): string {
  if (!status) return 'Sconosciuto';
  return STATUS_LABELS[status as keyof typeof STATUS_LABELS] || status.toUpperCase();
}

export function formatEntityType(type?: string): string {
  if (!type) return 'Entità';
  return ENTITY_TYPE_LABELS[type as keyof typeof ENTITY_TYPE_LABELS] || type.toUpperCase();
}

export function formatRecordType(type?: string): string {
  if (!type) return 'Record';
  return RECORD_TYPE_LABELS[type as keyof typeof RECORD_TYPE_LABELS] || type.replace('_', ' ').toUpperCase();
}

export function formatNodeStatus(status?: string): string {
  if (!status) return 'Ignoto';
  return NODE_STATUS_LABELS[status as keyof typeof NODE_STATUS_LABELS] || status.toUpperCase();
}

export function formatId(id?: string): string {
  if (!id) return 'UNKNOWN';
  return id.toUpperCase();
}
