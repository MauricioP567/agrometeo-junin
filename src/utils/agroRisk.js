// Riesgo de helada para cultivos andinos (papa, maíz amiláceo, quinua)
export function frostRisk(tMin) {
  if (tMin == null) return null;
  if (tMin <= 0) return { level: 'ALTO',  color: '#b91c1c', msg: 'Helada severa: proteger cultivos' };
  if (tMin <= 3) return { level: 'MEDIO', color: '#d97706', msg: 'Riesgo de helada nocturna' };
  if (tMin <= 7) return { level: 'BAJO',  color: '#0891b2', msg: 'Temperatura baja' };
  return { level: 'NULO', color: '#15803d', msg: 'Sin riesgo de helada' };
}

/**
 * Evalúa si una alerta del usuario se dispara con el clima actual.
 */
export function evaluateAlert(alert, weather) {
  if (!weather) return false;
  const th = Number(alert.threshold);
  const c = weather.current ?? {};
  const d0 = weather.daily ?? {};

  let actual;
  switch (alert.variable) {
    case 'temp':   actual = c.temperature_2m;           break;
    case 'precip': actual = c.precipitation;            break;
    case 'tMin':   actual = d0.temperature_2m_min?.[0]; break;
    case 'tMax':   actual = d0.temperature_2m_max?.[0]; break;
    default: return false;
  }
  if (actual == null) return false;

  switch (alert.operator) {
    case '>':  return actual >  th;
    case '>=': return actual >= th;
    case '<':  return actual <  th;
    case '<=': return actual <= th;
    default:   return false;
  }
}