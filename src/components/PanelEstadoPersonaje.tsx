"use client";

import { RAZAS, useBuildStore } from "@/store/buildStore";
import { calcularDano, type StatsPersonaje } from "@/lib/calculo/calcularDano";
import { puntosDisponibles } from "@/lib/calculo/puntosDisponibles";
import { NumeroAnimado } from "./NumeroAnimado";

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
    <aside className="w-full max-w-sm shrink-0 border-2 border-bronce bg-pergamino/95 p-5 text-foreground shadow-lg shadow-black/40">
      <h2 className="font-display text-3xl text-oro">Estado del Personaje</h2>

      <div className="mt-4 space-y-3">
        <label className="block">
          <span className="font-technical text-xs uppercase tracking-wide text-bronce">Raza</span>
          <select
            value={raza}
            onChange={(e) => setRaza(e.target.value as (typeof RAZAS)[number])}
            className="mt-1 w-full border border-bronce bg-tinta px-2 py-1 font-sans text-sm"
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
            <span className="font-technical text-xs uppercase tracking-wide text-bronce">Nivel</span>
            <input
              type="number"
              min={1}
              value={nivel}
              onChange={(e) => setNivel(Math.max(1, Number(e.target.value) || 1))}
              className="mt-1 w-full border border-bronce bg-tinta px-2 py-1 font-mono text-sm"
            />
          </label>
          <label className="block">
            <span className="font-technical text-xs uppercase tracking-wide text-bronce">
              Nivel Campeón
            </span>
            <input
              type="number"
              min={0}
              value={nivelCampeon}
              onChange={(e) => setNivelCampeon(Math.max(0, Number(e.target.value) || 0))}
              className="mt-1 w-full border border-bronce bg-tinta px-2 py-1 font-mono text-sm"
            />
          </label>
        </div>
      </div>

      <div className="mt-5">
        <div className="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-1">
          <span className="font-technical text-xs uppercase tracking-wide text-bronce">
            Puntos de estado
          </span>
          <span
            className={`font-mono text-xs ${
              puntosRestantes === 0 ? "text-verdin" : "text-foreground/70"
            }`}
          >
            Puntos disponibles: {puntosRestantes}
          </span>
        </div>

        <div className="mt-2 grid grid-cols-2 gap-3">
          {ETIQUETAS_STATS.map(({ clave, etiqueta }) => (
            <label key={clave} className="block">
              <span className="font-technical text-xs text-bronce">{etiqueta}</span>
              <input
                type="number"
                min={0}
                value={stats[clave]}
                onChange={(e) => handleStatChange(clave, Number(e.target.value))}
                className="mt-1 w-full border border-bronce bg-tinta px-2 py-1 font-mono text-sm"
              />
            </label>
          ))}
        </div>
      </div>

      <div className="mt-6 border-t border-bronce pt-4">
        <span className="font-technical text-xs uppercase tracking-wide text-bronce">
          Daño total (placeholder)
        </span>
        <div className="font-display text-4xl text-sello">
          <NumeroAnimado valor={resultado.total} />
        </div>
      </div>
    </aside>
  );
}
