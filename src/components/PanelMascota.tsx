"use client";

import { useEffect, useState } from "react";
import { useBuildStore } from "@/store/buildStore";
import { listarHabilidadesMascota, type MascotaHabilidad } from "@/lib/supabase/mascotas";
import { MarcoOrnamental } from "./MarcoOrnamental";

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
    <div className="panel-pergamino mx-auto w-full max-w-md p-6">
      <MarcoOrnamental />
      <h3 className="font-display text-3xl text-oro">Mascota</h3>

      <div className="mt-5 grid grid-cols-2 gap-3">
        {CAMPOS.map(({ clave, etiqueta }) => (
          <label key={clave} className="block">
            <span className="etiqueta-campo">{etiqueta}</span>
            <input
              type="number"
              min={0}
              value={mascota[clave]}
              onChange={(e) => setMascotaCampo(clave, Math.max(0, Number(e.target.value) || 0))}
              className="campo font-mono"
            />
          </label>
        ))}
      </div>

      <div className="mt-6">
        <span className="etiqueta-campo">Habilidades activas</span>
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
                className="campo campo-select px-1.5 py-1 text-xs"
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
