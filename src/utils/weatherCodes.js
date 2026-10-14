// Códigos WMO devueltos por Open-Meteo → etiqueta + emoji
export const WEATHER_CODES = {
  0:  { label: 'Cielo despejado',         icon: '☀️' },
  1:  { label: 'Mayormente despejado',    icon: '🌤️' },
  2:  { label: 'Parcialmente nublado',    icon: '⛅' },
  3:  { label: 'Nublado',                 icon: '☁️' },
  45: { label: 'Niebla',                  icon: '🌫️' },
  48: { label: 'Niebla con escarcha',     icon: '🌫️' },
  51: { label: 'Llovizna ligera',         icon: '🌦️' },
  53: { label: 'Llovizna moderada',       icon: '🌦️' },
  55: { label: 'Llovizna densa',          icon: '🌧️' },
  61: { label: 'Lluvia ligera',           icon: '🌧️' },
  63: { label: 'Lluvia moderada',         icon: '🌧️' },
  65: { label: 'Lluvia fuerte',           icon: '🌧️' },
  71: { label: 'Nevada ligera',           icon: '🌨️' },
  73: { label: 'Nevada moderada',         icon: '🌨️' },
  75: { label: 'Nevada fuerte',           icon: '❄️' },
  80: { label: 'Chubascos ligeros',       icon: '🌦️' },
  81: { label: 'Chubascos moderados',     icon: '🌧️' },
  82: { label: 'Chubascos violentos',     icon: '⛈️' },
  95: { label: 'Tormenta eléctrica',      icon: '⛈️' },
  96: { label: 'Tormenta con granizo',    icon: '⛈️' },
  99: { label: 'Tormenta fuerte + granizo', icon: '⛈️' },
};

export const describeCode = (c) => WEATHER_CODES[c] ?? { label: 'Desconocido', icon: '❓' };

// Conversión Celsius ↔ Fahrenheit
export const cToF = (c) => (c * 9) / 5 + 32;

export function formatTemp(c, unit = 'C') {
  if (c == null || Number.isNaN(c)) return '—';
  const v = unit === 'F' ? cToF(c) : c;
  return `${v.toFixed(1)}°${unit}`;
}