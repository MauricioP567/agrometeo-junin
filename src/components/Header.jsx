import { useSettings } from '../context/SettingsContext';

export default function Header() {
  const { unit, setUnit, theme, toggleTheme } = useSettings();

  return (
    <header className="app-header">
      <div className="brand">
        <div className="brand-logo">🌦️</div>
        <div>
          <h1>Agrometeo <span className="brand-accent">Junín</span></h1>
          <p className="brand-sub">Monitoreo agrometeorológico en tiempo real</p>
        </div>
      </div>

      <div className="header-controls">
        <div className="segmented" role="group" aria-label="Unidad de temperatura">
          <button
            type="button"
            className={unit === 'C' ? 'active' : ''}
            onClick={() => setUnit('C')}
          >
            °C
          </button>
          <button
            type="button"
            className={unit === 'F' ? 'active' : ''}
            onClick={() => setUnit('F')}
          >
            °F
          </button>
        </div>

        <button
          type="button"
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={theme === 'dark' ? 'Activar modo claro' : 'Activar modo oscuro'}
          title={theme === 'dark' ? 'Cambiar a modo día' : 'Cambiar a modo noche'}
        >
          <span className="theme-icon">{theme === 'dark' ? '☀️' : '🌙'}</span>
          <span className="theme-label">{theme === 'dark' ? 'Día' : 'Noche'}</span>
        </button>
      </div>
    </header>
  );
}