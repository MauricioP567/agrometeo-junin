import { useRef } from 'react';
import { useAlerts } from '../context/AlertsContext';

export default function AlertForm() {
  const formRef  = useRef(null);
  const varRef   = useRef(null);
  const opRef    = useRef(null);
  const thRef    = useRef(null);
  const labelRef = useRef(null);

  const { addAlert } = useAlerts();

  const onSubmit = (e) => {
    e.preventDefault();
    const label = labelRef.current.value.trim() || 'Alerta sin nombre';
    const threshold = Number(thRef.current.value);

    if (Number.isNaN(threshold)) {
      alert('Umbral inválido');
      return;
    }

    addAlert({
      label,
      variable: varRef.current.value,
      operator: opRef.current.value,
      threshold,
    });

    formRef.current.reset();
    labelRef.current.focus();
  };

  return (
    <form ref={formRef} className="alert-form" onSubmit={onSubmit}>
      <div className="form-title">➕ Nueva alerta</div>

      <div className="form-grid">
        <label className="form-field span-2">
          <span>Nombre</span>
          <input ref={labelRef} placeholder="Ej. Helada papa" defaultValue="" />
        </label>

        <label className="form-field">
          <span>Variable</span>
          <select ref={varRef} defaultValue="tMin">
            <option value="temp">Temp. actual</option>
            <option value="tMin">Temp. mínima</option>
            <option value="tMax">Temp. máxima</option>
            <option value="precip">Precipitación</option>
          </select>
        </label>

        <label className="form-field">
          <span>Operador</span>
          <select ref={opRef} defaultValue="<=">
            <option value="<=">≤ menor o igual</option>
            <option value="<">&lt; menor que</option>
            <option value=">=">≥ mayor o igual</option>
            <option value=">">&gt; mayor que</option>
          </select>
        </label>

        <label className="form-field">
          <span>Umbral</span>
          <input ref={thRef} type="number" step="0.1" defaultValue={3} />
        </label>

        <button type="submit" className="btn-primary">
          Guardar alerta
        </button>
      </div>
    </form>
  );
}