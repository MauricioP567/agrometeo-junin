import { useMemo, useState } from 'react';
import { describeCode, formatTemp } from '../utils/weatherCodes';

const W = 720, H = 180, PAD_X = 40, PAD_Y = 30;

export default function ForecastChart({ daily, unit }) {
  const [hovered, setHovered] = useState(null);

  const series = useMemo(() => {
    if (!daily?.time?.length) return null;

    const max = daily.temperature_2m_max;
    const min = daily.temperature_2m_min;
    const avg = max.map((v, i) => (v + min[i]) / 2);
    const precipProb = daily.precipitation_probability_max ?? [];
    const overallAvg = avg.reduce((a, b) => a + b, 0) / avg.length;
    const totalPrecip = (daily.precipitation_sum ?? []).reduce((a, b) => a + (b ?? 0), 0);
    const maxPrecipProb = Math.max(...precipProb, 0);

    return { max, min, avg, precipProb, overallAvg, totalPrecip, maxPrecipProb };
  }, [daily]);

  if (!series) return null;

  const n = series.max.length;
  const allTemps = [...series.max, ...series.min];
  const lo = Math.min(...allTemps) - 2;
  const hi = Math.max(...allTemps) + 2;

  const x = (i) => PAD_X + (i * (W - PAD_X * 2)) / Math.max(1, n - 1);
  const y = (t) => H - PAD_Y - ((t - lo) / (hi - lo)) * (H - PAD_Y * 2);

  // Curvas suaves con Catmull-Rom convertido a Bézier
  const smoothPath = (points) => {
    if (points.length < 2) return '';
    let d = `M ${points[0][0]},${points[0][1]}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i - 1] || points[i];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = points[i + 2] || p2;
      const cp1x = p1[0] + (p2[0] - p0[0]) / 6;
      const cp1y = p1[1] + (p2[1] - p0[1]) / 6;
      const cp2x = p2[0] - (p3[0] - p1[0]) / 6;
      const cp2y = p2[1] - (p3[1] - p1[1]) / 6;
      d += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p2[0]},${p2[1]}`;
    }
    return d;
  };

  const maxPoints = series.max.map((v, i) => [x(i), y(v)]);
  const minPoints = series.min.map((v, i) => [x(i), y(v)]);
  const maxPath = smoothPath(maxPoints);
  const minPath = smoothPath(minPoints);
  const areaPath = `${maxPath} L ${x(n - 1)},${H - PAD_Y} L ${x(0)},${H - PAD_Y} Z`;

  const today = new Date().toISOString().slice(0, 10);

  return (
    <section className="card forecast-card">
      <header className="card-header">
        <div>
          <h2>Pronóstico 7 días</h2>
          <p className="card-sub">Tendencia de temperatura y probabilidad de lluvia</p>
        </div>
        <div className="forecast-summary">
          <div className="summary-item">
            <span className="summary-label">Promedio</span>
            <span className="summary-value">{formatTemp(series.overallAvg, unit)}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Lluvia acum.</span>
            <span className="summary-value">{series.totalPrecip.toFixed(1)} mm</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Prob. máx.</span>
            <span className="summary-value">{series.maxPrecipProb}%</span>
          </div>
        </div>
      </header>

      {/* Tarjetas de cada día */}
      <div className="day-grid">
        {daily.time.map((t, i) => {
          const date = new Date(t + 'T00:00');
          const isToday = t === today;
          const code = describeCode(daily.weather_code?.[i]);
          const prob = series.precipProb[i] ?? 0;

          return (
            <button
              key={t}
              type="button"
              className={`day-card ${isToday ? 'is-today' : ''} ${hovered === i ? 'is-hovered' : ''}`}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              <div className="day-name">
                {isToday ? 'Hoy' : date.toLocaleDateString('es-PE', { weekday: 'short' })}
              </div>
              <div className="day-date">
                {date.getDate()}/{date.getMonth() + 1}
              </div>
              <div className="day-icon">{code.icon}</div>
              <div className="day-temps">
                <span className="temp-max">{formatTemp(series.max[i], unit)}</span>
                <span className="temp-min">{formatTemp(series.min[i], unit)}</span>
              </div>
              <div className="day-precip">
                <div className="precip-bar">
                  <div className="precip-fill" style={{ width: `${prob}%` }} />
                </div>
                <span className="precip-label">{prob}%</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Gráfico de área */}
      <div className="chart-wrapper">
        <svg viewBox={`0 0 ${W} ${H}`} className="area-chart" role="img" aria-label="Tendencia de temperaturas">
          <defs>
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.35" />
              <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="maxLineGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#fb923c" />
              <stop offset="100%" stopColor="#ef4444" />
            </linearGradient>
            <linearGradient id="minLineGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#22d3ee" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
          </defs>

          {/* Líneas horizontales guía */}
          {[0, 0.5, 1].map((f) => (
            <line
              key={f}
              x1={PAD_X}
              x2={W - PAD_X}
              y1={PAD_Y + f * (H - PAD_Y * 2)}
              y2={PAD_Y + f * (H - PAD_Y * 2)}
              stroke="var(--border)"
              strokeDasharray="4 6"
              opacity="0.6"
            />
          ))}

          <path d={areaPath} fill="url(#areaGradient)" />
          <path d={minPath} fill="none" stroke="url(#minLineGradient)" strokeWidth="2.5" strokeLinecap="round" />
          <path d={maxPath} fill="none" stroke="url(#maxLineGradient)" strokeWidth="2.5" strokeLinecap="round" />

          {maxPoints.map((p, i) => (
            <circle
              key={`max-${i}`}
              cx={p[0]}
              cy={p[1]}
              r={hovered === i ? 6 : 3.5}
              fill="var(--card)"
              stroke="#ef4444"
              strokeWidth="2"
              style={{ transition: 'r .15s ease' }}
            />
          ))}
          {minPoints.map((p, i) => (
            <circle
              key={`min-${i}`}
              cx={p[0]}
              cy={p[1]}
              r={hovered === i ? 6 : 3.5}
              fill="var(--card)"
              stroke="#3b82f6"
              strokeWidth="2"
              style={{ transition: 'r .15s ease' }}
            />
          ))}

          {daily.time.map((t, i) => (
            <text
              key={t}
              x={x(i)}
              y={H - 8}
              textAnchor="middle"
              fontSize="10"
              fill="var(--muted)"
              fontWeight="600"
            >
              {new Date(t + 'T00:00').toLocaleDateString('es-PE', { weekday: 'short' })}
            </text>
          ))}
        </svg>

        <div className="chart-legend">
          <div className="legend-item">
            <span className="legend-dot" style={{ background: 'linear-gradient(90deg, #fb923c, #ef4444)' }} />
            Máxima
          </div>
          <div className="legend-item">
            <span className="legend-dot" style={{ background: 'linear-gradient(90deg, #22d3ee, #3b82f6)' }} />
            Mínima
          </div>
        </div>
      </div>
    </section>
  );
}