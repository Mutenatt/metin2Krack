"use client";

import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { useBuildStore } from "@/store/buildStore";
import { listarGrados, listarPiedras, type PiedraDragon, type PiedraGrado } from "@/lib/supabase/piedras";
import { ModalPiedra } from "./ModalPiedra";

const RADIO = 110;

export function RuedaAlquimia() {
  const { piedras: seleccionadas, setPiedra } = useBuildStore();
  const [piedras, setPiedras] = useState<PiedraDragon[]>([]);
  const [grados, setGrados] = useState<PiedraGrado[]>([]);
  const [piedraAbierta, setPiedraAbierta] = useState<PiedraDragon | null>(null);

  useEffect(() => {
    listarPiedras().then(setPiedras);
    listarGrados().then(setGrados);
  }, []);

  return (
    <div
      className="relative mx-auto"
      style={{ width: RADIO * 2 + 80, height: RADIO * 2 + 80 }}
    >
      <div className="absolute inset-0 flex items-center justify-center rounded-full border-2 border-dashed border-bronce/30">
        <span className="font-technical text-xs text-bronce/50">Astrolabio</span>
      </div>

      {piedras.map((piedra, i) => {
        const angulo = (i / piedras.length) * 2 * Math.PI - Math.PI / 2;
        const x = RADIO * Math.cos(angulo);
        const y = RADIO * Math.sin(angulo);
        const seleccion = seleccionadas[piedra.id];

        return (
          <button
            key={piedra.id}
            type="button"
            onClick={() => setPiedraAbierta(piedra)}
            style={{ transform: `translate(${x}px, ${y}px)` }}
            className="absolute left-1/2 top-1/2 -ml-8 -mt-8 flex h-16 w-16 flex-col items-center justify-center rounded-full border-2 border-bronce bg-tinta text-center transition-all duration-200 hover:border-oro hover:shadow-[0_0_10px_2px_rgba(201,162,39,0.45)]"
          >
            <span className="font-technical text-[10px] text-bronce">{piedra.nombre}</span>
            {seleccion ? (
              <span className="font-mono text-[9px] text-sello">{seleccion.grado.grado}</span>
            ) : (
              <span className="font-display text-lg text-bronce">+</span>
            )}
          </button>
        );
      })}

      <AnimatePresence>
        {piedraAbierta && (
          <ModalPiedra
            piedra={piedraAbierta}
            grados={grados}
            seleccionActual={seleccionadas[piedraAbierta.id]}
            onCerrar={() => setPiedraAbierta(null)}
            onConfirmar={(seleccion) => {
              setPiedra(piedraAbierta.id, seleccion);
              setPiedraAbierta(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
