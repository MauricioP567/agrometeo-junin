import {
  createContext, useContext, useEffect, useMemo, useReducer, useCallback,
} from 'react';

const AlertsContext = createContext(null);
const STORAGE_KEY = 'agrometeo:alerts';

let uid = 0;
const nextId = () => `a_${Date.now()}_${uid++}`;

export const initialState = { alerts: [], history: [] };

// Reducer puro y testeable
export function alertsReducer(state, action) {
  switch (action.type) {
    case 'ADD': {
      const alert = {
        ...action.payload,
        id: nextId(),
        enabled: true,
        triggered: false,
        createdAt: new Date().toISOString(),
      };
      return {
        ...state,
        alerts: [alert, ...state.alerts],
        history: [
          { type: 'ADD', id: alert.id, at: alert.createdAt },
          ...state.history,
        ].slice(0, 20),
      };
    }
    case 'REMOVE':
      return {
        ...state,
        alerts: state.alerts.filter((a) => a.id !== action.payload),
        history: [
          { type: 'REMOVE', id: action.payload, at: new Date().toISOString() },
          ...state.history,
        ].slice(0, 20),
      };
    case 'TOGGLE':
      return {
        ...state,
        alerts: state.alerts.map((a) =>
          a.id === action.payload ? { ...a, enabled: !a.enabled } : a
        ),
      };
    case 'TRIGGER':
      return {
        ...state,
        alerts: state.alerts.map((a) =>
          a.id === action.payload
            ? { ...a, triggered: true, triggeredAt: new Date().toISOString() }
            : a
        ),
      };
    case 'RESET_TRIGGERS':
      return { ...state, alerts: state.alerts.map((a) => ({ ...a, triggered: false })) };
    case 'CLEAR':
      return initialState;
    case 'HYDRATE':
      return action.payload;
    default:
      return state;
  }
}

export function AlertsProvider({ children }) {
  const [state, dispatch] = useReducer(alertsReducer, initialState, (init) => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : init;
    } catch {
      return init;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  // Envolvemos cada acción en useCallback para identidades estables
  const addAlert      = useCallback((a) => dispatch({ type: 'ADD', payload: a }), []);
  const removeAlert   = useCallback((id) => dispatch({ type: 'REMOVE', payload: id }), []);
  const toggleAlert   = useCallback((id) => dispatch({ type: 'TOGGLE', payload: id }), []);
  const triggerAlert  = useCallback((id) => dispatch({ type: 'TRIGGER', payload: id }), []);
  const resetTriggers = useCallback(() => dispatch({ type: 'RESET_TRIGGERS' }), []);
  const clearAlerts   = useCallback(() => dispatch({ type: 'CLEAR' }), []);

  const value = useMemo(
    () => ({
      alerts: state.alerts,
      history: state.history,
      addAlert, removeAlert, toggleAlert, triggerAlert, resetTriggers, clearAlerts,
    }),
    [state.alerts, state.history, addAlert, removeAlert, toggleAlert, triggerAlert, resetTriggers, clearAlerts]
  );

  return <AlertsContext.Provider value={value}>{children}</AlertsContext.Provider>;
}

export function useAlerts() {
  const ctx = useContext(AlertsContext);
  if (!ctx) throw new Error('useAlerts debe usarse dentro de <AlertsProvider>');
  return ctx;
}