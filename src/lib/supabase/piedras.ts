import { supabase } from "./client";

export interface PiedraDragon {
  id: number;
  nombre: string;
}

export interface PiedraGrado {
  id: number;
  pureza: string;
  grado: string;
}

export interface PiedraBono {
  id: number;
  piedra_id: number;
  nombre: string;
  valor_min: number;
  valor_max: number;
}

export async function listarPiedras(): Promise<PiedraDragon[]> {
  const { data, error } = await supabase.from("piedras_dragon").select("id, nombre").order("id");
  if (error) throw error;
  return data ?? [];
}

export async function listarGrados(): Promise<PiedraGrado[]> {
  const { data, error } = await supabase
    .from("piedras_dragon_grados")
    .select("id, pureza, grado")
    .order("id");
  if (error) throw error;
  return data ?? [];
}

export async function listarBonosPiedra(piedraId: number): Promise<PiedraBono[]> {
  const { data, error } = await supabase
    .from("piedras_dragon_bonos")
    .select("id, piedra_id, nombre, valor_min, valor_max")
    .eq("piedra_id", piedraId);
  if (error) throw error;
  return data ?? [];
}
