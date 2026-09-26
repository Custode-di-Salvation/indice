import { useState, useEffect } from 'react';
import { performGlobalSearch, type SearchResultItem } from '../utils/search';
import { useAuth } from './useAuth';

export function useSearch() {
  const { user } = useAuth();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    
    const timer = setTimeout(() => {
      const res = performGlobalSearch(query, user);
      setResults(res);
      setIsSearching(false);
    }, 150);

    return () => clearTimeout(timer);
  }, [query, user]);

  return { query, setQuery, results, isSearching };
}
