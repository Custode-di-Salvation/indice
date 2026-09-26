import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSearch } from '../../hooks/useSearch';
import { formatEntityStatus, formatRecordType, formatNodeStatus } from '../../utils/formatters';

interface SearchModalProps {
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ onClose }) => {
  const { query, setQuery, results, isSearching } = useSearch();
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => setActiveIndex(0), [query]);

  useEffect(() => {
    // Focus input on mount
    inputRef.current?.focus();
    
    // Close on escape
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIndex(i => Math.min(i + 1, results.length - 1)); }
      if (e.key === 'ArrowUp') { e.preventDefault(); setActiveIndex(i => Math.max(i - 1, 0)); }
      if (e.key === 'Enter' && results[activeIndex]) { e.preventDefault(); handleResultClick(results[activeIndex].url); }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, results, activeIndex]);

  const handleResultClick = (url: string) => {
    navigate(url);
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="search-modal" onClick={e => e.stopPropagation()}>
        <div className="search-header">
          <span className="search-icon">⚲</span>
          <input
            ref={inputRef}
            type="text"
            className="search-input"
            placeholder="CERCA IN INDICE..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {isSearching && <span className="search-spinner">⧗</span>}
        </div>
        
        <div className="search-results">
          {query.length > 0 && results.length === 0 && !isSearching && (
            <div className="search-empty"><strong>Nessun record accessibile corrisponde a “{query}”.</strong><span>Il materiale potrebbe non essere indicizzato, trovarsi presso un nodo non raggiungibile oppure non essere visibile con l’autorizzazione corrente.</span></div>
          )}
          
          {results.length > 0 && (
            <ul className="search-results-list">
              {results.map((result) => (
                <li key={`${result.category}-${result.id}`} className={`search-result-item ${activeIndex === results.indexOf(result) ? 'active' : ''}`} onMouseEnter={() => setActiveIndex(results.indexOf(result))} onClick={() => handleResultClick(result.url)}>
                  <div className="result-category">{result.category}</div>
                  <div className="result-content">
                    <div className="result-title">{result.title}</div>
                    <div className="result-subtitle">{result.subtitle}</div>
                  </div>
                  {result.status && (
                    <div className="result-status">
                      {result.status}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
        
        <div className="search-footer">
          <span>Utilizza <strong>freccette</strong> per navigare, <strong>Invio</strong> per selezionare, <strong>Esc</strong> per chiudere.</span>
        </div>
      </div>
    </div>
  );
};
