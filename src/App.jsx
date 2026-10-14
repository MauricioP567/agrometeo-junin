// ============================================================
// App.jsx — Componente raíz de Agrometeo Junín
// - Envuelve la app con los Providers de contexto
// - Orquesta el dashboard: fetch de clima + evaluación de alertas
// ============================================================

import { useCallback, useEffect } from 'react';

// Providers de contexto global
import { SettingsProvider, useSettings } from './context/SettingsContext';
import { AlertsProvider, useAlerts } from './context/AlertsContext';

// Hooks personalizados y utilidades
import { useFetch } from './hooks/useFetch';
import { fetchForecast } from './services/weatherApi';
import { evaluateAlert } from './utils/agroRisk';

// Componentes de la UI
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import CurrentWeather from './components/CurrentWeather';
import ForecastChart from './components/ForecastChart';
import AgroRiskCard from './components/AgroRiskCard';
import StationList from './components/StationList';
import AlertPanel from './components/AlertPanel';

// ------------------------------------------------------------
// Dashboard: toda la lógica de la app va aquí
// ------------------------------------------------------------
function Dashboard() {
  // Del contexto de configuración: estación, unidad, favoritos
  const { station, unit, setStation, toggleFavorite, favorites } = useSettings();

  // Del contexto de alertas: lista y función para disparar
  const { alerts, triggerAlert } = useAlerts();

  // useCallback: mantiene la identidad del fetcher estable.
  // Solo cambia cuando cambia la estación → evita refetch innecesario.
  const fetcher = useCallback(
    (signal) => fetchForecast(station, signal),
    [station]
  );

  // useFetch: petición con AbortController.
  // Se re-ejecuta cuando cambian las coordenadas.
  const { data, loading, error } = useFetch(fetcher, [
    station.latitude,
    station.longitude,
  ]);

  // useEffect: cuando llegan datos nuevos, evalúa las alertas activas.
  // Si alguna condición se cumple, la marca como disparada.
  useEffect(() => {
    if (!data) return;
    alerts
      .filter((a) => a.enabled && !a.triggered)
      .forEach((a) => {
        if (evaluateAlert(a, data)) triggerAlert(a.id);
      });
  }, [data, alerts, triggerAlert]);

  // ¿La estación actual está en favoritos?
  const isFavorite = favorites.some((f) => f.id === station.id);

  return (
    <div className="app">
      {/* Encabezado con logo y toggle de tema */}
      <Header />

      {/* Buscador de estaciones */}
      <SearchBar onSelect={setStation} />

      {/* Botón de favoritos — usa la nueva clase .fav-btn */}
      <div className="toolbar">
        <button
          type="button"
          className={`fav-btn ${isFavorite ? 'active' : ''}`}
          onClick={() => toggleFavorite(station)}
        >
          {isFavorite ? '★ Quitar de favoritos' : '☆ Guardar como favorita'}
        </button>
      </div>

      {/* Estados de carga y error */}
      {loading && (
        <div className="card skeleton">Cargando datos meteorológicos…</div>
      )}
      {error && <div className="card error">⚠️ Error: {error}</div>}

      {/* Grid principal con todas las tarjetas.
          Solo se renderiza cuando ya llegaron los datos. */}
      {data && (
        <div className="grid">
          {/* Clima actual — recibe unit porque muestra temperaturas */}
          <CurrentWeather
            current={data.current}
            station={station}
            unit={unit}
          />

          {/* Riesgo agrometeorológico — YA NO recibe unit */}
          <AgroRiskCard daily={data.daily} />

          {/* Pronóstico rediseñado — sí recibe unit */}
          <ForecastChart daily={data.daily} unit={unit} />

          {/* Panel de alertas (usa el contexto interno) */}
          <AlertPanel />

          {/* Lista de estaciones favoritas */}
          <StationList />
        </div>
      )}
    </div>
  );
}

// ------------------------------------------------------------
// App: envuelve todo con los Providers.
// El orden importa: SettingsProvider externo, AlertsProvider interno.
// ------------------------------------------------------------
export default function App() {
  return (
    <SettingsProvider>
      <AlertsProvider>
        <Dashboard />
      </AlertsProvider>
    </SettingsProvider>
  );
}