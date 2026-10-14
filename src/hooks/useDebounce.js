import { useEffect, useState } from 'react';

/**
 * Retrasa la propagación de un valor.
 * Útil para inputs de búsqueda: solo dispara cuando el usuario deja de teclear.
 */
export function useDebounce(value, delay = 400) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);

  return debounced;
}