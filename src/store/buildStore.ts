import { create } from "zustand";
import type { StatsPersonaje } from "@/lib/calculo/calcularDano";

export const RAZAS = ["Guerrero", "Sura", "Ninja", "Chamán"] as const;
export type Raza = (typeof RAZAS)[number];

interface BuildState {
  raza: Raza;
  nivel: number;
  nivelCampeon: number;
  stats: StatsPersonaje;
  setRaza: (raza: Raza) => void;
  setNivel: (nivel: number) => void;
  setNivelCampeon: (nivelCampeon: number) => void;
  setStat: (stat: keyof StatsPersonaje, valor: number) => void;
}

export const useBuildStore = create<BuildState>((set) => ({
  raza: "Guerrero",
  nivel: 1,
  nivelCampeon: 0,
  stats: { vit: 0, inteligencia: 0, fuerza: 0, destreza: 0 },
  setRaza: (raza) => set({ raza }),
  setNivel: (nivel) => set({ nivel }),
  setNivelCampeon: (nivelCampeon) => set({ nivelCampeon }),
  setStat: (stat, valor) =>
    set((state) => ({ stats: { ...state.stats, [stat]: valor } })),
}));
