import { useEffect, useReducer, useRef } from 'react';


const initialState = { data: null, loading: false, error: null };

function reducer(state, action) {
  switch (action.type) {
    case 'start':   return { ...state, loading: true, error: null };
    case 'success': return { data: action.payload, loading: false, error: null };
    case 'error':   return { ...state, loading: false, error: action.payload };
    default:        return state;
  }
}

/**
 * Custom Hook de fetch con estado unificado, cancelación y cleanup.
 * @param {(signal: AbortSignal) => Promise<any>} fetcher
 * @param {any[]} deps          - dependencias que re-disparan la petición
 * @param {{skip?: boolean}} opts
 */
export function useFetch(fetcher, deps = [], { skip = false } = {}) {
  const [state, dispatch] = useReducer(reducer, initialState);

  
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  useEffect(() => {
    if (skip) return;

    const controller = new AbortController();
    let active = true;

    dispatch({ type: 'start' });

    (async () => {
      try {
        const data = await fetcherRef.current(controller.signal);
        if (active) dispatch({ type: 'success', payload: data });
      } catch (err) {
        if (err.name === 'AbortError') return;      // cancelación intencional
        if (active) dispatch({ type: 'error', payload: err.message });
      }
    })();

    // Cleanup: evita memory leaks y "setState on unmounted"
    return () => {
      active = false;
      controller.abort();
    };

    
  }, [...deps, skip]);

  return state;
}