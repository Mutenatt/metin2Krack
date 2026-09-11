import { create } from "zustand";
import type { StatsPersonaje } from "@/lib/calculo/calcularDano";
import type { BonoDisponible, ItemBase } from "@/lib/supabase/items";

export const RAZAS = ["Guerrero", "Sura", "Ninja", "Chamán"] as const;
export type Raza = (typeof RAZAS)[number];

export interface ItemEquipado {
  item: ItemBase;
  bono: BonoDisponible | null;
  bonoValor: number | null;
}

interface BuildState {
  raza: Raza;
  nivel: number;
  nivelCampeon: number;
  stats: StatsPersonaje;
  equipo: Record<string, ItemEquipado>;
  setRaza: (raza: Raza) => void;
  setNivel: (nivel: number) => void;
  setNivelCampeon: (nivelCampeon: number) => void;
  setStat: (stat: keyof StatsPersonaje, valor: number) => void;
  equiparItem: (tipoSlotCodigo: string, itemEquipado: ItemEquipado) => void;
  quitarItem: (tipoSlotCodigo: string) => void;
}

export const useBuildStore = create<BuildState>((set) => ({
  raza: "Guerrero",
  nivel: 1,
  nivelCampeon: 0,
  stats: { vit: 0, inteligencia: 0, fuerza: 0, destreza: 0 },
  equipo: {},
  setRaza: (raza) => set({ raza }),
  setNivel: (nivel) => set({ nivel }),
  setNivelCampeon: (nivelCampeon) => set({ nivelCampeon }),
  setStat: (stat, valor) =>
    set((state) => ({ stats: { ...state.stats, [stat]: valor } })),
  equiparItem: (tipoSlotCodigo, itemEquipado) =>
    set((state) => ({ equipo: { ...state.equipo, [tipoSlotCodigo]: itemEquipado } })),
  quitarItem: (tipoSlotCodigo) =>
    set((state) => {
      const equipo = { ...state.equipo };
      delete equipo[tipoSlotCodigo];
      return { equipo };
    }),
}));
