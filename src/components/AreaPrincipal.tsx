"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SiluetaPersonaje } from "./SiluetaPersonaje";
import { RuedaAlquimia } from "./RuedaAlquimia";
import { PanelMascota } from "./PanelMascota";

const PESTANAS = [
  { clave: "inventario", etiqueta: "Inventario" },
  { clave: "alquimia", etiqueta: "Alquimia" },
  { clave: "mascota", etiqueta: "Mascota" },
] as const;

type Pestana = (typeof PESTANAS)[number]["clave"];

export function AreaPrincipal() {
  const [pestana, setPestana] = useState<Pestana>("inventario");

  return (
    <div className="flex w-full flex-col items-center">
      <div className="mb-6 flex gap-1 border-b border-bronce">
        {PESTANAS.map((p) => (
          <button
            key={p.clave}
            type="button"
            onClick={() => setPestana(p.clave)}
            className={`px-5 py-2 font-technical text-sm uppercase tracking-wide ${
              pestana === p.clave ? "border-b-2 border-oro text-oro" : "text-bronce hover:text-oro"
            }`}
          >
            {p.etiqueta}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={pestana}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="w-full"
        >
          {pestana === "inventario" && <SiluetaPersonaje />}
          {pestana === "alquimia" && <RuedaAlquimia />}
          {pestana === "mascota" && <PanelMascota />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
