import { describe, expect, it } from "vitest";
import { puntosDisponibles } from "./puntosDisponibles";

describe("puntosDisponibles (placeholder)", () => {
  it("no da puntos en nivel 1 sin campeón", () => {
    expect(puntosDisponibles(1, 0)).toBe(0);
  });

  it("suma puntos por cada nivel por encima de 1", () => {
    expect(puntosDisponibles(10, 0)).toBeGreaterThan(puntosDisponibles(5, 0));
  });

  it("el nivel de campeón también otorga puntos", () => {
    expect(puntosDisponibles(1, 1)).toBeGreaterThan(puntosDisponibles(1, 0));
  });

  it("nunca devuelve un valor negativo", () => {
    expect(puntosDisponibles(1, 0)).toBeGreaterThanOrEqual(0);
  });
});
