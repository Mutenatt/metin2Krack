import { describe, expect, it } from "vitest";
import { calcularDano } from "./calcularDano";

describe("calcularDano (placeholder)", () => {
  it("devuelve todo en cero cuando los stats son cero", () => {
    const resultado = calcularDano({
      stats: { vit: 0, inteligencia: 0, fuerza: 0, destreza: 0 },
    });

    expect(resultado.total).toBe(0);
    expect(resultado.desglose).toEqual({
      equipo: 0,
      stats: 0,
      piedras: 0,
      mascota: 0,
    });
  });

  it("el total es siempre la suma del desglose", () => {
    const resultado = calcularDano({
      stats: { vit: 10, inteligencia: 5, fuerza: 20, destreza: 15 },
    });

    const sumaDesglose =
      resultado.desglose.equipo +
      resultado.desglose.stats +
      resultado.desglose.piedras +
      resultado.desglose.mascota;

    expect(resultado.total).toBe(sumaDesglose);
  });

  it("equipo, piedras y mascota quedan en cero hasta que esos módulos existan", () => {
    const resultado = calcularDano({
      stats: { vit: 10, inteligencia: 10, fuerza: 10, destreza: 10 },
    });

    expect(resultado.desglose.equipo).toBe(0);
    expect(resultado.desglose.piedras).toBe(0);
    expect(resultado.desglose.mascota).toBe(0);
  });

  it("más fuerza y destreza aumentan el daño de stats", () => {
    const base = calcularDano({
      stats: { vit: 0, inteligencia: 0, fuerza: 0, destreza: 0 },
    });
    const conStats = calcularDano({
      stats: { vit: 0, inteligencia: 0, fuerza: 10, destreza: 10 },
    });

    expect(conStats.desglose.stats).toBeGreaterThan(base.desglose.stats);
  });
});
