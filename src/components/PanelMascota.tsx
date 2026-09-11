"use client";

import { useEffect, useState } from "react";
import { useBuildStore } from "@/store/buildStore";
import { listarHabilidadesMascota, type MascotaHabilidad } from "@/lib/supabase/mascotas";

const CAMPOS = [
  { clave: "nivel", etiqueta: "Nivel" },
  { clave: "diasVida", etiqueta: "Días de vida" },
  { clave: "hpPct", etiqueta: "HP %" },
  { clave: "defensaPct", etiqueta: "Defensa %" },
  { clave: "spPct", etiqueta: "SP %" },
] as const;

export function PanelMascota() {
  const { mascota, setMascotaCampo, setMascotaHabilidad } = useBuildStore();
  const [habilidades, setHabilidades] = useState<MascotaHabilidad[]>([]);

  useEffect(() => {
    listarHabilidadesMascota().then(setHabilidades);
  }, []);

  return (
    <div className="mx-auto w-full max-w-md border-2 border-bronce bg-pergamino/95 p-5">
      <h3 className="font-display text-2xl text-oro">Mascota</h3>

      <div className="mt-4 grid grid-cols-2 gap-3">
        {CAMPOS.map(({ clave, etiqueta }) => (
          <label key={clave} className="block">
            <span className="font-technical text-xs uppercase tracking-wide text-bronce">
              {etiqueta}
            </span>
            <input
              type="number"
              min={0}
              value={mascota[clave]}
              onChange={(e) => setMascotaCampo(clave, Math.max(0, Number(e.target.value) || 0))}
              className="mt-1 w-full border border-bronce bg-tinta px-2 py-1 font-mono text-sm"
            />
          </label>
        ))}
      </div>

      <div className="mt-5">
        <span className="font-technical text-xs uppercase tracking-wide text-bronce">
          Habilidades activas
        </span>
        <div className="mt-2 grid grid-cols-3 gap-2">
          {mascota.habilidades.map((habilidadId, i) => {
            const elegidasEnOtros = mascota.habilidades.filter((_, j) => j !== i);
            const opciones = habilidades.filter((h) => !elegidasEnOtros.includes(h.id));
            return (
              <select
                key={i}
                value={habilidadId ?? ""}
                onChange={(e) =>
                  setMascotaHabilidad(i, e.target.value ? Number(e.target.value) : null)
                }
                className="border border-bronce bg-tinta px-1 py-1 font-sans text-xs"
              >
                <option value="">Ninguna</option>
                {opciones.map((h) => (
                  <option key={h.id} value={h.id}>
                    {h.nombre}
                  </option>
                ))}
              </select>
            );
          })}
        </div>
      </div>
    </div>
  );
}
