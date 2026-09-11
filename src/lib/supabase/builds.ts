import { supabase } from "./client";
import { useBuildStore, type PiedraSeleccionada, type ItemEquipado } from "@/store/buildStore";
import type { StatsPersonaje } from "@/lib/calculo/calcularDano";

function generarSlug(nombre: string): string {
  const base = nombre
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  const sufijo = Math.random().toString(36).slice(2, 8);
  return `${base || "build"}-${sufijo}`;
}

export interface BuildResumen {
  id: string;
  slug: string;
  nombre: string;
  esPublico: boolean;
  updatedAt: string;
}

export interface EquipoGuardado {
  tipoSlotCodigo: string;
  equipado: ItemEquipado;
}

export interface BuildCompleto {
  id: string;
  slug: string;
  nombre: string;
  esPublico: boolean;
  raza: string;
  nivel: number;
  nivelCampeon: number;
  stats: StatsPersonaje;
  equipo: EquipoGuardado[];
  piedras: PiedraSeleccionada[];
  mascota: {
    nivel: number;
    diasVida: number;
    hpPct: number;
    defensaPct: number;
    spPct: number;
    habilidades: number[];
  };
}

export async function guardarBuild(nombre: string, esPublico: boolean): Promise<{ slug: string }> {
  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;
  if (!user) throw new Error("No autenticado");

  const build = useBuildStore.getState();

  const { data: razaRow, error: razaError } = await supabase
    .from("razas")
    .select("id")
    .eq("nombre", build.raza)
    .single();
  if (razaError || !razaRow) throw razaError ?? new Error("Raza inválida");

  const slug = generarSlug(nombre);

  const { data: buildRow, error } = await supabase
    .from("builds")
    .insert({
      user_id: user.id,
      slug,
      nombre,
      es_publico: esPublico,
      raza_id: razaRow.id,
      nivel: build.nivel,
      nivel_campeon: build.nivelCampeon,
      vit: build.stats.vit,
      inteligencia: build.stats.inteligencia,
      fuerza: build.stats.fuerza,
      destreza: build.stats.destreza,
      mascota_nivel: build.mascota.nivel,
      mascota_dias_vida: build.mascota.diasVida,
      mascota_hp_pct: build.mascota.hpPct,
      mascota_def_pct: build.mascota.defensaPct,
      mascota_sp_pct: build.mascota.spPct,
    })
    .select("id, slug")
    .single();
  if (error || !buildRow) throw error ?? new Error("No se pudo guardar el build");

  const equipoRows = Object.values(build.equipo).map((eq) => ({
    build_id: buildRow.id,
    tipo_slot_id: eq.item.tipo_slot_id,
    item_base_id: eq.item.id,
    bono_id: eq.bono?.bono_id ?? null,
    bono_valor: eq.bonoValor,
  }));
  if (equipoRows.length > 0) {
    const { error: eqError } = await supabase.from("build_equipamiento").insert(equipoRows);
    if (eqError) throw eqError;
  }

  const piedraRows = Object.values(build.piedras).map((p) => ({
    build_id: buildRow.id,
    piedra_id: p.piedra.id,
    grado_id: p.grado.id,
    bono_id: p.bono?.id ?? null,
    bono_valor: p.bonoValor,
  }));
  if (piedraRows.length > 0) {
    const { error: piedraError } = await supabase.from("build_piedras").insert(piedraRows);
    if (piedraError) throw piedraError;
  }

  const habilidadRows = build.mascota.habilidades
    .map((habilidadId, i) =>
      habilidadId ? { build_id: buildRow.id, habilidad_id: habilidadId, slot_index: i + 1 } : null,
    )
    .filter((row): row is { build_id: string; habilidad_id: number; slot_index: number } => row !== null);
  if (habilidadRows.length > 0) {
    const { error: habError } = await supabase.from("build_mascota_habilidades").insert(habilidadRows);
    if (habError) throw habError;
  }

  return { slug: buildRow.slug };
}

export async function listarMisBuilds(): Promise<BuildResumen[]> {
  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;
  if (!user) return [];

  const { data, error } = await supabase
    .from("builds")
    .select("id, slug, nombre, es_publico, updated_at")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });
  if (error) throw error;

  return (data ?? []).map((b) => ({
    id: b.id,
    slug: b.slug,
    nombre: b.nombre,
    esPublico: b.es_publico,
    updatedAt: b.updated_at,
  }));
}

export async function eliminarBuild(id: string): Promise<void> {
  const { error } = await supabase.from("builds").delete().eq("id", id);
  if (error) throw error;
}

export async function obtenerBuildPorSlug(slug: string): Promise<BuildCompleto | null> {
  const { data: build, error } = await supabase
    .from("builds")
    .select("*, razas(nombre)")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  if (!build) return null;

  const [equipoRes, piedrasRes, habilidadesRes] = await Promise.all([
    supabase
      .from("build_equipamiento")
      .select("bono_valor, items_base(*), bonos_aleatorios(id, nombre, tipo), tipos_slot(codigo)")
      .eq("build_id", build.id),
    supabase
      .from("build_piedras")
      .select(
        "bono_valor, piedras_dragon(id, nombre), piedras_dragon_grados(id, pureza, grado), piedras_dragon_bonos(id, piedra_id, nombre, valor_min, valor_max)",
      )
      .eq("build_id", build.id),
    supabase.from("build_mascota_habilidades").select("habilidad_id").eq("build_id", build.id),
  ]);

  if (equipoRes.error) throw equipoRes.error;
  if (piedrasRes.error) throw piedrasRes.error;
  if (habilidadesRes.error) throw habilidadesRes.error;

  const equipo: EquipoGuardado[] = (equipoRes.data ?? [])
    .filter((row) => row.items_base && row.tipos_slot)
    .map((row) => ({
      tipoSlotCodigo: (row.tipos_slot as unknown as { codigo: string }).codigo,
      equipado: {
        item: row.items_base as never,
        bono: row.bonos_aleatorios ? ({ bono: row.bonos_aleatorios } as never) : null,
        bonoValor: row.bono_valor,
      },
    }));

  const piedras: PiedraSeleccionada[] = (piedrasRes.data ?? [])
    .filter((row) => row.piedras_dragon && row.piedras_dragon_grados)
    .map((row) => ({
      piedra: row.piedras_dragon as never,
      grado: row.piedras_dragon_grados as never,
      bono: (row.piedras_dragon_bonos as never) ?? null,
      bonoValor: row.bono_valor,
    }));

  return {
    id: build.id,
    slug: build.slug,
    nombre: build.nombre,
    esPublico: build.es_publico,
    raza: (build.razas as unknown as { nombre: string } | null)?.nombre ?? "Guerrero",
    nivel: build.nivel,
    nivelCampeon: build.nivel_campeon,
    stats: {
      vit: build.vit,
      inteligencia: build.inteligencia,
      fuerza: build.fuerza,
      destreza: build.destreza,
    },
    equipo,
    piedras,
    mascota: {
      nivel: build.mascota_nivel ?? 1,
      diasVida: build.mascota_dias_vida ?? 0,
      hpPct: build.mascota_hp_pct ?? 0,
      defensaPct: build.mascota_def_pct ?? 0,
      spPct: build.mascota_sp_pct ?? 0,
      habilidades: (habilidadesRes.data ?? []).map((h) => h.habilidad_id),
    },
  };
}

export function aplicarBuildAlStore(build: BuildCompleto): void {
  const store = useBuildStore.getState();
  store.setRaza(build.raza as never);
  store.setNivel(build.nivel);
  store.setNivelCampeon(build.nivelCampeon);
  store.setStat("vit", build.stats.vit);
  store.setStat("inteligencia", build.stats.inteligencia);
  store.setStat("fuerza", build.stats.fuerza);
  store.setStat("destreza", build.stats.destreza);

  for (const eq of build.equipo) {
    store.equiparItem(eq.tipoSlotCodigo, eq.equipado);
  }
  for (const p of build.piedras) {
    if (p.piedra) store.setPiedra(p.piedra.id, p);
  }
  store.setMascotaCampo("nivel", build.mascota.nivel);
  store.setMascotaCampo("diasVida", build.mascota.diasVida);
  store.setMascotaCampo("hpPct", build.mascota.hpPct);
  store.setMascotaCampo("defensaPct", build.mascota.defensaPct);
  store.setMascotaCampo("spPct", build.mascota.spPct);
  build.mascota.habilidades.forEach((habilidadId, i) => store.setMascotaHabilidad(i, habilidadId));
}
