"use client";

import { RAZAS, useBuildStore } from "@/store/buildStore";
import { calcularDano, type StatsPersonaje } from "@/lib/calculo/calcularDano";
import { puntosDisponibles } from "@/lib/calculo/puntosDisponibles";
import { NumeroAnimado } from "./NumeroAnimado";
import { PanelCuenta } from "./PanelCuenta";
import { MarcoOrnamental } from "./MarcoOrnamental";

const ETIQUETAS_STATS = [
  { clave: "vit", etiqueta: "VIT" },
  { clave: "inteligencia", etiqueta: "INT" },
  { clave: "fuerza", etiqueta: "STR" },
  { clave: "destreza", etiqueta: "DEX" },
] as const satisfies readonly { clave: keyof StatsPersonaje; etiqueta: string }[];

export function PanelEstadoPersonaje() {
  const { raza, nivel, nivelCampeon, stats, setRaza, setNivel, setNivelCampeon, setStat } =
    useBuildStore();

  const puntosTotales = puntosDisponibles(nivel, nivelCampeon);
  const puntosUsados = stats.vit + stats.inteligencia + stats.fuerza + stats.destreza;
  const puntosRestantes = puntosTotales - puntosUsados;

  const resultado = calcularDano({ stats });

  function handleStatChange(clave: keyof StatsPersonaje, valorInput: number) {
    const otrosUsados = puntosUsados - stats[clave];
    const maximo = Math.max(0, puntosTotales - otrosUsados);
    const valor = Math.min(Math.max(0, Number.isNaN(valorInput) ? 0 : valorInput), maximo);
    setStat(clave, valor);
  }

  return (
    <aside className="panel-pergamino w-full max-w-sm shrink-0 p-6 text-foreground">
      <MarcoOrnamental />
      <h2 className="font-display text-4xl leading-tight text-oro">Estado del Personaje</h2>

      <div className="mt-5 space-y-3">
        <label className="block">
          <span className="etiqueta-campo">Raza</span>
          <select
            value={raza}
            onChange={(e) => setRaza(e.target.value as (typeof RAZAS)[number])}
            className="campo campo-select"
          >
            {RAZAS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </label>

        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <span className="etiqueta-campo">Nivel</span>
            <input
              type="number"
              min={1}
              value={nivel}
              onChange={(e) => setNivel(Math.max(1, Number(e.target.value) || 1))}
              className="campo font-mono"
            />
          </label>
          <label className="block">
            <span className="etiqueta-campo">Nivel Campeón</span>
            <input
              type="number"
              min={0}
              value={nivelCampeon}
              onChange={(e) => setNivelCampeon(Math.max(0, Number(e.target.value) || 0))}
              className="campo font-mono"
            />
          </label>
        </div>
      </div>

      <div className="mt-6">
        <div className="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-1">
          <span className="etiqueta-campo mb-0">Puntos de estado</span>
          <span
            className={`font-mono text-xs ${
              puntosRestantes === 0 ? "text-verdin" : "text-foreground/70"
            }`}
          >
            Disponibles: {puntosRestantes}
          </span>
        </div>

        <div className="mt-2 grid grid-cols-2 gap-3">
          {ETIQUETAS_STATS.map(({ clave, etiqueta }) => (
            <label key={clave} className="block">
              <span className="etiqueta-campo">{etiqueta}</span>
              <input
                type="number"
                min={0}
                value={stats[clave]}
                onChange={(e) => handleStatChange(clave, Number(e.target.value))}
                className="campo font-mono"
              />
            </label>
          ))}
        </div>
      </div>

      <div className="mt-7 border-t border-bronce/50 pt-5">
        <span className="etiqueta-campo">Daño total (placeholder)</span>
        <div className="numero-hero font-display text-5xl leading-none text-sello">
          <NumeroAnimado valor={resultado.total} />
        </div>
      </div>

      <PanelCuenta />
    </aside>
  );
}
