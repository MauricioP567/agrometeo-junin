// Capa de acceso a la API de Open-Meteo (sin API key, uso libre)
const GEO_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';

/**
 * Busca ciudades/estaciones por nombre.
 * @param {string} query
 * @param {AbortSignal} signal  ← permite cancelar si el usuario escribe rápido
 */
export async function searchLocations(query, signal) {
  const url = `${GEO_URL}?name=${encodeURIComponent(query)}&count=8&language=es&format=json`;
  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error(`Geocoding ${res.status}`);
  const data = await res.json();
  return data.results ?? [];
}

/**
 * Obtiene el pronóstico actual + horario + diario (7 días).
 * @param {{latitude:number, longitude:number}} coords
 * @param {AbortSignal} signal
 */
export async function fetchForecast({ latitude, longitude }, signal) {
  const params = new URLSearchParams({
    latitude,
    longitude,
    current: 'temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m,weather_code',
    hourly: 'temperature_2m,precipitation_probability,precipitation',
    daily:
      'weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max',
    timezone: 'America/Lima',
    forecast_days: '7',
  });
  const res = await fetch(`${FORECAST_URL}?${params}`, { signal });
  if (!res.ok) throw new Error(`Forecast ${res.status}`);
  return res.json();
}