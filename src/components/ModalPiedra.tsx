"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  listarBonosPiedra,
  type PiedraBono,
  type PiedraDragon,
  type PiedraGrado,
} from "@/lib/supabase/piedras";
import type { PiedraSeleccionada } from "@/store/buildStore";

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
  const contenedorRef = useRef<HTMLDivElement>(null);
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

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onCerrar();
        return;
      }
      if (e.key === "Tab" && contenedorRef.current) {
        const focusables = contenedorRef.current.querySelectorAll<HTMLElement>(
          "button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])",
        );
        if (focusables.length === 0) return;
        const primero = focusables[0];
        const ultimo = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === primero) {
          e.preventDefault();
          ultimo.focus();
        } else if (!e.shiftKey && document.activeElement === ultimo) {
          e.preventDefault();
          primero.focus();
        }
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    contenedorRef.current?.focus();
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onCerrar]);

  function handleConfirmar() {
    if (!grado) return;
    setEstampando(true);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-0 sm:p-6"
      onClick={onCerrar}
    >
      <motion.div
        ref={contenedorRef}
        role="dialog"
        aria-modal="true"
        aria-label={`Configurar piedra ${piedra.nombre}`}
        tabIndex={-1}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.15 }}
        onClick={(e) => e.stopPropagation()}
        className="relative flex h-full w-full flex-col overflow-hidden border-2 border-bronce bg-pergamino p-5 outline-none sm:h-auto sm:max-h-[80vh] sm:w-full sm:max-w-sm"
      >
        <div className="flex items-center justify-between">
          <h3 className="font-display text-2xl text-oro">{piedra.nombre}</h3>
          <button
            type="button"
            onClick={onCerrar}
            className="font-technical text-sm text-bronce hover:text-oro"
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>

        <label className="mt-4 block">
          <span className="font-technical text-xs uppercase tracking-wide text-bronce">
            Pureza / Grado
          </span>
          <select
            value={grado?.id ?? ""}
            onChange={(e) => setGrado(grados.find((g) => g.id === Number(e.target.value)) ?? null)}
            className="mt-1 w-full border border-bronce bg-tinta px-2 py-1 font-sans text-sm"
          >
            {grados.map((g) => (
              <option key={g.id} value={g.id}>
                {g.pureza} — {g.grado}
              </option>
            ))}
          </select>
        </label>

        {bonos.length > 0 && (
          <div className="mt-3">
            <span className="font-technical text-xs uppercase tracking-wide text-bronce">
              Bono (opcional)
            </span>
            <div className="mt-1 flex gap-2">
              <select
                value={bono?.id ?? ""}
                onChange={(e) => {
                  const b = bonos.find((x) => x.id === Number(e.target.value)) ?? null;
                  setBono(b);
                  setBonoValor(b?.valor_min ?? 0);
                }}
                className="flex-1 border border-bronce bg-tinta px-2 py-1 font-sans text-sm"
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
                  className="w-20 border border-bronce bg-tinta px-2 py-1 font-mono text-sm"
                />
              )}
            </div>
          </div>
        )}

        <div className="mt-4 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCerrar}
            className="border border-bronce px-3 py-1.5 font-technical text-sm text-bronce hover:text-oro"
          >
            Cancelar
          </button>
          <button
            type="button"
            disabled={!grado}
            onClick={handleConfirmar}
            className="border border-sello bg-sello/80 px-3 py-1.5 font-technical text-sm text-foreground disabled:cursor-not-allowed disabled:opacity-40"
          >
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
      </motion.div>
    </div>
  );
}
