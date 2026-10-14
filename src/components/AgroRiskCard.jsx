import { useMemo } from 'react';
import { frostRisk } from '../utils/agroRisk';

export default function AgroRiskCard({ daily }) {
  const risk = useMemo(() => {
    if (!daily?.temperature_2m_min?.length) return null;
    const worst = Math.min(...daily.temperature_2m_min.slice(0, 3));
    return { ...frostRisk(worst), tMin: worst };
  }, [daily]);

  if (!risk) return null;

  const levelToIcon = {
    ALTO: '🚨',
    MEDIO: '⚠️',
    BAJO: '💧',
    NULO: '✅',
  };

  return (
    <section className={`card risk-card risk-${risk.level.toLowerCase()}`}>
      <div className="risk-header">
        <div>
          <h2>Riesgo agrometeorológico</h2>
          <p className="card-sub">Próximos 3 días</p>
        </div>
        <div className="risk-icon">{levelToIcon[risk.level] || '🌱'}</div>
      </div>

      <div className="risk-level">
        <span className="risk-badge" style={{ background: risk.color }}>
          Nivel {risk.level}
        </span>
        <span className="risk-temp">{risk.tMin.toFixed(1)}°C</span>
      </div>

      <p className="risk-msg">{risk.msg}</p>

      <div className="risk-crops">
        <div className="risk-crops-label">Cultivos sensibles</div>
        <div className="risk-crop-chips">
          <span className="chip">🥔 Papa</span>
          <span className="chip">🌽 Maíz</span>
          <span className="chip">🌾 Quinua</span>
        </div>
      </div>
    </section>
  );
}