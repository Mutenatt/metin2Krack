import { supabase } from "./client";

export interface ItemBase {
  id: number;
  nombre: string;
  tipo_slot_id: number;
  nivel_requerido: number;
  stats_base: Record<string, number>;
  porcentaje_absorcion: number | null;
}

export interface BonoDisponible {
  id: number;
  item_base_id: number;
  bono_id: number;
  valor_min: number;
  valor_max: number;
  bono: { id: number; nombre: string; tipo: string };
}

interface FiltrosItems {
  tipoSlotCodigo: string;
  nivelMax?: number;
  busqueda?: string;
}

export async function listarItems({
  tipoSlotCodigo,
  nivelMax,
  busqueda,
}: FiltrosItems): Promise<ItemBase[]> {
  let query = supabase
    .from("items_base")
    .select("id, nombre, tipo_slot_id, nivel_requerido, stats_base, porcentaje_absorcion, tipos_slot!inner(codigo)")
    .eq("tipos_slot.codigo", tipoSlotCodigo)
    .order("nivel_requerido", { ascending: true });

  if (nivelMax !== undefined) {
    query = query.lte("nivel_requerido", nivelMax);
  }
  if (busqueda) {
    query = query.ilike("nombre", `%${busqueda}%`);
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as unknown as ItemBase[];
}

export async function listarBonosDisponibles(itemBaseId: number): Promise<BonoDisponible[]> {
  const { data, error } = await supabase
    .from("item_bonos_disponibles")
    .select("id, item_base_id, bono_id, valor_min, valor_max, bono:bonos_aleatorios(id, nombre, tipo)")
    .eq("item_base_id", itemBaseId);

  if (error) throw error;
  return (data ?? []) as unknown as BonoDisponible[];
}
