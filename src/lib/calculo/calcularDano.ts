export interface StatsPersonaje {
  vit: number;
  inteligencia: number;
  fuerza: number;
  destreza: number;
}

export interface BuildParaCalculo {
  stats: StatsPersonaje;
}

export interface DesgloseDano {
  equipo: number;
  stats: number;
  piedras: number;
  mascota: number;
}

export interface ResultadoCalculo {
  total: number;
  desglose: DesgloseDano;
}

/**
 * Placeholder: las fórmulas reales de daño PvP/PvM todavía están en
 * investigación (ver prompt.md, "Motor de cálculo — nota de alcance").
 * equipo/piedras/mascota quedan en 0 hasta que esos módulos existan.
 */
export function calcularDano(build: BuildParaCalculo): ResultadoCalculo {
  const { fuerza, destreza, inteligencia, vit } = build.stats;

  const statsDano = Math.round(fuerza * 2 + destreza * 1.5 + inteligencia * 1.5 + vit * 1);

  const desglose: DesgloseDano = {
    equipo: 0,
    stats: statsDano,
    piedras: 0,
    mascota: 0,
  };

  return {
    total: desglose.equipo + desglose.stats + desglose.piedras + desglose.mascota,
    desglose,
  };
}
