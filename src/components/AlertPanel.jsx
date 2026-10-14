import { useAlerts } from '../context/AlertsContext';
import AlertForm from './AlertForm';

const VAR_LABEL = {
  temp: 'Temp. actual',
  tMin: 'Temp. mínima',
  tMax: 'Temp. máxima',
  precip: 'Precipitación',
};

export default function AlertPanel() {
  const { alerts, history, removeAlert, toggleAlert, clearAlerts } = useAlerts();

  return (
    <section className="card alert-panel">
      <header className="card-header">
        <div>
          <h2>🔔 Alertas agrícolas</h2>
          <p className="card-sub">
            {alerts.length === 0
              ? 'Sin alertas configuradas'
              : `${alerts.length} alerta${alerts.length > 1 ? 's' : ''} configurada${alerts.length > 1 ? 's' : ''}`}
          </p>
        </div>
        {alerts.length > 0 && (
          <button type="button" className="btn-ghost" onClick={clearAlerts}>
            Limpiar
          </button>
        )}
      </header>

      <AlertForm />

      {alerts.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <p>No hay alertas activas</p>
          <small>Crea una arriba para monitorear heladas, sequías o lluvias intensas.</small>
        </div>
      ) : (
        <ul className="alert-list">
          {alerts.map((a) => (
            <li
              key={a.id}
              className={`alert-item ${a.triggered ? 'is-triggered' : ''} ${!a.enabled ? 'is-disabled' : ''}`}
            >
              <div className="alert-info">
                <div className="alert-title">
                  <strong>{a.label}</strong>
                  {a.triggered && <span className="badge badge-danger">🚨 DISPARADA</span>}
                  {!a.enabled && <span className="badge badge-muted">Desactivada</span>}
                </div>
                <div className="alert-condition">
                  {VAR_LABEL[a.variable]} <code>{a.operator} {a.threshold}</code>
                </div>
              </div>
              <div className="alert-actions">
                <button
                  type="button"
                  className="btn-icon"
                  onClick={() => toggleAlert(a.id)}
                  title={a.enabled ? 'Desactivar' : 'Activar'}
                >
                  {a.enabled ? '🔕' : '🔔'}
                </button>
                <button
                  type="button"
                  className="btn-icon btn-danger"
                  onClick={() => removeAlert(a.id)}
                  title="Eliminar"
                >
                  🗑️
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {history.length > 0 && (
        <details className="history">
          <summary>Historial de acciones ({history.length})</summary>
          <ol>
            {history.map((h, i) => (
              <li key={i}>
                <span className={`history-type history-${h.type.toLowerCase()}`}>{h.type}</span>
                <span className="muted">{new Date(h.at).toLocaleTimeString('es-PE')}</span>
              </li>
            ))}
          </ol>
        </details>
      )}
    </section>
  );
}