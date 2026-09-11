"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useBuildStore } from "@/store/buildStore";
import { SlotEquipo } from "./SlotEquipo";
import { ModalBuscadorItems } from "./ModalBuscadorItems";

const SLOTS_IZQUIERDA = [
  { codigo: "arma", etiqueta: "Arma" },
  { codigo: "armadura", etiqueta: "Armadura" },
] as const;

const SLOTS_DERECHA = [
  { codigo: "casco", etiqueta: "Casco" },
  { codigo: "escudo", etiqueta: "Escudo" },
  { codigo: "pulsera", etiqueta: "Pulsera" },
  { codigo: "pendientes", etiqueta: "Pendientes" },
  { codigo: "collar", etiqueta: "Collar" },
  { codigo: "zapatos", etiqueta: "Zapatos" },
] as const;

const SLOTS_ATUENDO = [
  { codigo: "peinado", etiqueta: "Peinado" },
  { codigo: "atuendo", etiqueta: "Atuendo" },
  { codigo: "skin_arma", etiqueta: "Skin de Arma" },
  { codigo: "estola", etiqueta: "Estola" },
  { codigo: "vestimenta_aura", etiqueta: "Vestimenta de Aura" },
] as const;

export function SiluetaPersonaje() {
  const { equipo, equiparItem } = useBuildStore();
  const [vista, setVista] = useState<"equipamiento" | "atuendo">("equipamiento");
  const [slotAbierto, setSlotAbierto] = useState<{ codigo: string; etiqueta: string } | null>(
    null,
  );

  const estolaEquipada = equipo["estola"];

  return (
    <div className="w-full max-w-2xl">
      <div className="mb-4 flex gap-1 border-b border-bronce">
        {(["equipamiento", "atuendo"] as const).map((v) => (
          <button
            key={v}
            type="button"
            onClick={() => setVista(v)}
            className={`px-4 py-2 font-technical text-sm uppercase tracking-wide ${
              vista === v ? "border-b-2 border-oro text-oro" : "text-bronce hover:text-oro"
            }`}
          >
            {v === "equipamiento" ? "Equipamiento" : "Atuendos"}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {vista === "equipamiento" ? (
          <motion.div
            key="equipamiento"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="flex items-start justify-center gap-8"
          >
            <div className="flex flex-col gap-3">
              {SLOTS_IZQUIERDA.map((s) => (
                <SlotEquipo
                  key={s.codigo}
                  etiqueta={s.etiqueta}
                  itemEquipado={equipo[s.codigo]}
                  onClick={() => setSlotAbierto(s)}
                />
              ))}
            </div>

            <div className="flex h-64 w-40 items-center justify-center border-2 border-dashed border-bronce/30 font-technical text-xs text-bronce/50">
              Silueta
            </div>

            <div className="grid grid-cols-2 gap-3">
              {SLOTS_DERECHA.map((s) => (
                <SlotEquipo
                  key={s.codigo}
                  etiqueta={s.etiqueta}
                  itemEquipado={equipo[s.codigo]}
                  onClick={() => setSlotAbierto(s)}
                />
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="atuendo"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="flex flex-wrap justify-center gap-4"
          >
            {SLOTS_ATUENDO.map((s) => (
              <div key={s.codigo} className="flex flex-col items-center gap-1">
                <SlotEquipo
                  etiqueta={s.etiqueta}
                  itemEquipado={equipo[s.codigo]}
                  onClick={() => setSlotAbierto(s)}
                />
                <span className="font-technical text-[10px] text-bronce">{s.etiqueta}</span>
              </div>
            ))}
            {estolaEquipada?.item.porcentaje_absorcion != null && (
              <p className="w-full text-center font-mono text-xs text-verdin">
                Absorción de Estola: {estolaEquipada.item.porcentaje_absorcion}%
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {slotAbierto && (
          <ModalBuscadorItems
            tipoSlotCodigo={slotAbierto.codigo}
            etiqueta={slotAbierto.etiqueta}
            itemActual={equipo[slotAbierto.codigo]}
            onCerrar={() => setSlotAbierto(null)}
            onConfirmar={(itemEquipado) => {
              equiparItem(slotAbierto.codigo, itemEquipado);
              setSlotAbierto(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
