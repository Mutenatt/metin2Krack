import { create } from "zustand";
import type { StatsPersonaje } from "@/lib/calculo/calcularDano";
import type { BonoDisponible, ItemBase } from "@/lib/supabase/items";
import type { PiedraBono, PiedraDragon, PiedraGrado } from "@/lib/supabase/piedras";

export const RAZAS = ["Guerrero", "Sura", "Ninja", "Chamán"] as const;
export type Raza = (typeof RAZAS)[number];

export interface ItemEquipado {
  item: ItemBase;
  bono: BonoDisponible | null;
  bonoValor: number | null;
}

export interface PiedraSeleccionada {
  piedra: PiedraDragon;
  grado: PiedraGrado;
  bono: PiedraBono | null;
  bonoValor: number | null;
}

export interface MascotaState {
  nivel: number;
  diasVida: number;
  hpPct: number;
  defensaPct: number;
  spPct: number;
  habilidades: (number | null)[];
}

type CampoMascotaNumerico = "nivel" | "diasVida" | "hpPct" | "defensaPct" | "spPct";

interface BuildState {
  raza: Raza;
  nivel: number;
  nivelCampeon: number;
  stats: StatsPersonaje;
  equipo: Record<string, ItemEquipado>;
  piedras: Record<number, PiedraSeleccionada>;
  mascota: MascotaState;
  setRaza: (raza: Raza) => void;
  setNivel: (nivel: number) => void;
  setNivelCampeon: (nivelCampeon: number) => void;
  setStat: (stat: keyof StatsPersonaje, valor: number) => void;
  equiparItem: (tipoSlotCodigo: string, itemEquipado: ItemEquipado) => void;
  quitarItem: (tipoSlotCodigo: string) => void;
  setPiedra: (piedraId: number, seleccion: PiedraSeleccionada) => void;
  quitarPiedra: (piedraId: number) => void;
  setMascotaCampo: (campo: CampoMascotaNumerico, valor: number) => void;
  setMascotaHabilidad: (slotIndex: number, habilidadId: number | null) => void;
}

export const useBuildStore = create<BuildState>((set) => ({
  raza: "Guerrero",
  nivel: 1,
  nivelCampeon: 0,
  stats: { vit: 0, inteligencia: 0, fuerza: 0, destreza: 0 },
  equipo: {},
  piedras: {},
  mascota: {
    nivel: 1,
    diasVida: 0,
    hpPct: 0,
    defensaPct: 0,
    spPct: 0,
    habilidades: [null, null, null],
  },
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
  setPiedra: (piedraId, seleccion) =>
    set((state) => ({ piedras: { ...state.piedras, [piedraId]: seleccion } })),
  quitarPiedra: (piedraId) =>
    set((state) => {
      const piedras = { ...state.piedras };
      delete piedras[piedraId];
      return { piedras };
    }),
  setMascotaCampo: (campo, valor) =>
    set((state) => ({ mascota: { ...state.mascota, [campo]: valor } })),
  setMascotaHabilidad: (slotIndex, habilidadId) =>
    set((state) => {
      const habilidades = [...state.mascota.habilidades];
      habilidades[slotIndex] = habilidadId;
      return { mascota: { ...state.mascota, habilidades } };
    }),
}));
