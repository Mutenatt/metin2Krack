"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useBuildStore } from "@/store/buildStore";
import { SlotEquipo } from "./SlotEquipo";
import { ModalBuscadorItems } from "./ModalBuscadorItems";
import { SiluetaIcono } from "./SiluetaIcono";
import { MarcoOrnamental } from "./MarcoOrnamental";

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

function SlotConEtiqueta({
  codigo,
  etiqueta,
  itemEquipado,
  onClick,
}: {
  codigo: string;
  etiqueta: string;
  itemEquipado?: ReturnType<typeof useBuildStore.getState>["equipo"][string];
  onClick: () => void;
}) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <SlotEquipo etiqueta={etiqueta} itemEquipado={itemEquipado} onClick={onClick} />
      <span className="font-technical text-[0.65rem] uppercase tracking-wide text-bronce/80">
        {etiqueta}
      </span>
    </div>
  );
}

export function SiluetaPersonaje() {
  const { equipo, equiparItem } = useBuildStore();
  const [vista, setVista] = useState<"equipamiento" | "atuendo">("equipamiento");
  const [slotAbierto, setSlotAbierto] = useState<{ codigo: string; etiqueta: string } | null>(
    null,
  );

  const estolaEquipada = equipo["estola"];

  return (
    <div className="panel-pergamino w-full max-w-2xl p-6">
      <MarcoOrnamental />

      <div className="mb-6 flex gap-1 border-b border-bronce/50">
        {(["equipamiento", "atuendo"] as const).map((v) => (
          <button
            key={v}
            type="button"
            onClick={() => setVista(v)}
            className={`px-4 py-2 font-technical text-sm uppercase tracking-wide transition-colors ${
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
            className="flex items-start justify-center gap-10"
          >
            <div className="flex flex-col gap-4">
              {SLOTS_IZQUIERDA.map((s) => (
                <SlotConEtiqueta
                  key={s.codigo}
                  codigo={s.codigo}
                  etiqueta={s.etiqueta}
                  itemEquipado={equipo[s.codigo]}
                  onClick={() => setSlotAbierto(s)}
                />
              ))}
            </div>

            <div className="flex h-64 w-36 items-center justify-center border border-bronce/25 bg-tinta/40 p-6">
              <SiluetaIcono />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {SLOTS_DERECHA.map((s) => (
                <SlotConEtiqueta
                  key={s.codigo}
                  codigo={s.codigo}
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
            className="flex flex-wrap justify-center gap-6"
          >
            {SLOTS_ATUENDO.map((s) => (
              <SlotConEtiqueta
                key={s.codigo}
                codigo={s.codigo}
                etiqueta={s.etiqueta}
                itemEquipado={equipo[s.codigo]}
                onClick={() => setSlotAbierto(s)}
              />
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
