import { describeCode, formatTemp } from '../utils/weatherCodes';

export default function CurrentWeather({ current, station, unit }) {
  if (!current) return null;
  const code = describeCode(current.weather_code);

  const statItems = [
    { icon: '💧', label: 'Humedad', value: `${current.relative_humidity_2m}%` },
    { icon: '🌧️', label: 'Precipitación', value: `${current.precipitation} mm` },
    { icon: '💨', label: 'Viento', value: `${current.wind_speed_10m} km/h` },
  ];

  return (
    <section className="card current-card">
      <div className="current-location">
        <div className="location-pin">📍</div>
        <div>
          <h2>{station.name}</h2>
          <p className="muted">{station.admin1}, {station.country}</p>
        </div>
      </div>

      <div className="current-temp-block">
        <div className="current-icon" aria-hidden>{code.icon}</div>
        <div>
          <div className="current-temp">{formatTemp(current.temperature_2m, unit)}</div>
          <div className="current-desc">{code.label}</div>
        </div>
      </div>

      <div className="current-stats">
        {statItems.map((s) => (
          <div key={s.label} className="stat">
            <div className="stat-icon">{s.icon}</div>
            <div>
              <div className="stat-label">{s.label}</div>
              <div className="stat-value">{s.value}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="current-coords">
        <span className="muted">Coordenadas</span>
        <span>{station.latitude.toFixed(3)}, {station.longitude.toFixed(3)}</span>
      </div>
    </section>
  );
}