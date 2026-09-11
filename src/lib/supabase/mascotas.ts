import { supabase } from "./client";

export interface MascotaHabilidad {
  id: number;
  nombre: string;
  descripcion: string | null;
}

export async function listarHabilidadesMascota(): Promise<MascotaHabilidad[]> {
  const { data, error } = await supabase
    .from("mascota_habilidades")
    .select("id, nombre, descripcion")
    .order("id");
  if (error) throw error;
  return data ?? [];
}
