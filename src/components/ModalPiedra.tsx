"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  listarBonosPiedra,
  type PiedraBono,
  type PiedraDragon,
  type PiedraGrado,
} from "@/lib/supabase/piedras";
import type { PiedraSeleccionada } from "@/store/buildStore";
import { ModalBase } from "./ModalBase";

interface ModalPiedraProps {
  piedra: PiedraDragon;
  grados: PiedraGrado[];
  seleccionActual?: PiedraSeleccionada;
  onCerrar: () => void;
  onConfirmar: (seleccion: PiedraSeleccionada) => void;
}

export function ModalPiedra({
  piedra,
  grados,
  seleccionActual,
  onCerrar,
  onConfirmar,
}: ModalPiedraProps) {
  const [grado, setGrado] = useState<PiedraGrado | null>(seleccionActual?.grado ?? grados[0] ?? null);
  const [bonos, setBonos] = useState<PiedraBono[]>([]);
  const [bono, setBono] = useState<PiedraBono | null>(seleccionActual?.bono ?? null);
  const [bonoValor, setBonoValor] = useState<number>(seleccionActual?.bonoValor ?? 0);
  const [estampando, setEstampando] = useState(false);

  useEffect(() => {
    listarBonosPiedra(piedra.id).then(setBonos);
  }, [piedra.id]);

  useEffect(() => {
    if (!grado && grados.length > 0) setGrado(grados[0]);
  }, [grados, grado]);

  function handleConfirmar() {
    if (!grado) return;
    setEstampando(true);
  }

  return (
    <ModalBase titulo={piedra.nombre} onCerrar={onCerrar} maxWidthClassName="sm:max-w-sm">
      <label className="mt-5 block">
        <span className="etiqueta-campo">Pureza / Grado</span>
        <select
          value={grado?.id ?? ""}
          onChange={(e) => setGrado(grados.find((g) => g.id === Number(e.target.value)) ?? null)}
          className="campo campo-select"
        >
          {grados.map((g) => (
            <option key={g.id} value={g.id}>
              {g.pureza} — {g.grado}
            </option>
          ))}
        </select>
      </label>

      {bonos.length > 0 && (
        <div className="mt-4">
          <span className="etiqueta-campo">Bono (opcional)</span>
          <div className="mt-1 flex gap-2">
            <select
              value={bono?.id ?? ""}
              onChange={(e) => {
                const b = bonos.find((x) => x.id === Number(e.target.value)) ?? null;
                setBono(b);
                setBonoValor(b?.valor_min ?? 0);
              }}
              className="campo campo-select flex-1"
            >
              <option value="">Sin bono</option>
              {bonos.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.nombre} ({b.valor_min}–{b.valor_max})
                </option>
              ))}
            </select>
            {bono && (
              <input
                type="number"
                min={bono.valor_min}
                max={bono.valor_max}
                value={bonoValor}
                onChange={(e) =>
                  setBonoValor(
                    Math.min(Math.max(bono.valor_min, Number(e.target.value) || 0), bono.valor_max),
                  )
                }
                className="campo w-20 font-mono"
              />
            )}
          </div>
        </div>
      )}

      <div className="mt-5 flex justify-end gap-2">
        <button type="button" onClick={onCerrar} className="boton-secundario">
          Cancelar
        </button>
        <button type="button" disabled={!grado} onClick={handleConfirmar} className="boton-primario">
          Confirmar
        </button>
      </div>

      {estampando && grado && (
        <motion.div
          initial={{ opacity: 0, scale: 0.3 }}
          animate={{ opacity: [0, 0.9, 0], scale: [0.3, 1.4, 1.6] }}
          transition={{ duration: 0.5 }}
          onAnimationComplete={() => {
            onConfirmar({ piedra, grado, bono, bonoValor: bono ? bonoValor : null });
          }}
          className="pointer-events-none absolute inset-0 flex items-center justify-center"
        >
          <div className="h-24 w-24 rounded-full bg-sello" />
        </motion.div>
      )}
    </ModalBase>
  );
}
