import { useLocation } from 'react-router-dom';

export interface BreadcrumbSegment {
  label: string;
  url?: string;
}

export function useBreadcrumb(): BreadcrumbSegment[] {
  const location = useLocation();
  const path = location.pathname;

  const segments: BreadcrumbSegment[] = [{ label: 'INDICE', url: '/' }];

  if (path === '/') {
    segments.push({ label: 'QUADRO' });
    return segments;
  }

  const parts = path.split('/').filter(Boolean);

  let currentUrl = '';
  
  parts.forEach((part, index) => {
    currentUrl += `/${part}`;
    
    // Formatting logic for specific segments
    let label = part.toUpperCase();
    
    // If it's an ID (like SAL-PER-0041)
    if (/^[A-Z]{3}-[A-Z]{3}-\d+$/.test(label)) {
      label = label; 
    } 
    // Handle entity subtypes in URL (e.g. /segreta/persone)
    else if (part === 'entita' && index === 1) {
      // Skip 'entita' in breadcrumb if we have an ID next
      if (parts.length > 2) return; 
    }
    
    const isLast = index === parts.length - 1;
    
    segments.push({
      label,
      url: isLast ? undefined : currentUrl,
    });
  });

  return segments;
}
