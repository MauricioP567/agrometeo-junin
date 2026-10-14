import { useEffect, useRef, useState } from 'react';
import { searchLocations } from '../services/weatherApi';
import { useDebounce } from '../hooks/useDebounce';

export default function SearchBar({ onSelect }) {
  const inputRef = useRef(null);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const debounced = useDebounce(query, 400);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (debounced.trim().length < 2) {
      setResults([]);
      return;
    }
    const ctrl = new AbortController();
    setLoading(true);

    (async () => {
      try {
        const r = await searchLocations(debounced, ctrl.signal);
        setResults(r);
      } catch (e) {
        if (e.name !== 'AbortError') console.warn(e);
      } finally {
        setLoading(false);
      }
    })();

    return () => ctrl.abort();
  }, [debounced]);

  const handleSelect = (loc) => {
    onSelect(loc);
    setQuery('');
    setResults([]);
    inputRef.current?.focus();
  };

  return (
    <div className="searchbar">
      <span className="search-icon">🔍</span>
      <input
        ref={inputRef}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Buscar ciudad o estación (ej. Huancayo, Jauja, Tarma)…"
        aria-label="Buscar ubicación"
      />
      {loading && <span className="spinner" />}

      {results.length > 0 && (
        <ul className="suggestions">
          {results.map((r) => (
            <li key={r.id}>
              <button type="button" onClick={() => handleSelect(r)}>
                <span className="suggestion-icon">📍</span>
                <div className="suggestion-info">
                  <span className="suggestion-name">{r.name}</span>
                  <span className="suggestion-detail">{r.admin1}, {r.country}</span>
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}