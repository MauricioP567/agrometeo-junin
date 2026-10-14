import { useSettings } from '../context/SettingsContext';

export default function StationList() {
  const { favorites, station, setStation, toggleFavorite } = useSettings();

  return (
    <section className="card station-card">
      <header className="card-header">
        <div>
          <h2>⭐ Estaciones favoritas</h2>
          <p className="card-sub">Acceso rápido a tus ubicaciones</p>
        </div>
      </header>

      <ul className="station-list">
        {favorites.map((f) => {
          const isActive = f.id === station.id;
          return (
            <li key={f.id} className={`station-item ${isActive ? 'is-active' : ''}`}>
              <button
                type="button"
                className="station-btn"
                onClick={() => setStation(f)}
              >
                <span className="station-avatar">
                  {f.name.charAt(0).toUpperCase()}
                </span>
                <div className="station-info">
                  <span className="station-name">{f.name}</span>
                  <span className="station-region">{f.admin1}</span>
                </div>
                {isActive && <span className="station-active-dot" />}
              </button>
              <button
                type="button"
                className="btn-icon btn-danger"
                onClick={() => toggleFavorite(f)}
                title="Quitar de favoritos"
              >
                ✕
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}