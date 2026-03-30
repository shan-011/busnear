import { useState, useEffect } from 'react';
import { searchRoutes } from '../data/setcRoutes';

export const useSearch = (initialQuery = '') => {
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsSearching(true);
      const filtered = searchRoutes(query);
      setResults(filtered);
      setIsSearching(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  return { query, setQuery, results, isSearching };
};
