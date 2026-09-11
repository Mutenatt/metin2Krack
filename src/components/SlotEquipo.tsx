"use client";

import type { ItemEquipado } from "@/store/buildStore";

interface SlotEquipoProps {
  etiqueta: string;
  itemEquipado?: ItemEquipado;
  onClick: () => void;
}

export function SlotEquipo({ etiqueta, itemEquipado, onClick }: SlotEquipoProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative flex h-16 w-16 flex-col items-center justify-center border-2 border-bronce bg-tinta text-foreground transition-colors hover:border-oro"
    >
      {itemEquipado ? (
        <>
          <span className="line-clamp-2 px-1 text-center font-mono text-[10px] leading-tight">
            {itemEquipado.item.nombre}
          </span>
          <span className="absolute -right-2 -top-2 rounded-full bg-sello px-1.5 py-0.5 font-mono text-[9px] text-foreground">
            {itemEquipado.item.nivel_requerido}
          </span>
        </>
      ) : (
        <span className="font-display text-2xl text-bronce">+</span>
      )}

      <span className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-1 hidden -translate-x-1/2 whitespace-nowrap border border-bronce bg-pergamino px-2 py-1 font-technical text-[10px] text-foreground group-hover:block">
        {itemEquipado
          ? `${itemEquipado.item.nombre} (Nv. ${itemEquipado.item.nivel_requerido})`
          : `Equipar ${etiqueta}`}
      </span>
    </button>
  );
}
