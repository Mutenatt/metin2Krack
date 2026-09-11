const PUNTOS_POR_NIVEL = 3;
const PUNTOS_POR_NIVEL_CAMPEON = 5;

/**
 * Placeholder: la regla real de puntos por nivel/campeón de Metin2 todavía
 * está en investigación. Sirve para validar el máximo de los inputs de
 * stats mientras tanto (ver prompt.md).
 */
export function puntosDisponibles(nivel: number, nivelCampeon: number): number {
  const porNivel = Math.max(0, nivel - 1) * PUNTOS_POR_NIVEL;
  const porCampeon = Math.max(0, nivelCampeon) * PUNTOS_POR_NIVEL_CAMPEON;
  return porNivel + porCampeon;
}
