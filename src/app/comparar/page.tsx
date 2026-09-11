"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import {
  listarMisBuilds,
  obtenerBuildPorSlug,
  type BuildCompleto,
  type BuildResumen,
} from "@/lib/supabase/builds";
import { calcularDano } from "@/lib/calculo/calcularDano";
import { MarcoOrnamental } from "@/components/MarcoOrnamental";

function SelectorBuild({
  builds,
  valor,
  onChange,
}: {
  builds: BuildResumen[];
  valor: string;
  onChange: (slug: string) => void;
}) {
  return (
    <select value={valor} onChange={(e) => onChange(e.target.value)} className="campo campo-select">
      <option value="">Elegir build...</option>
      {builds.map((b) => (
        <option key={b.id} value={b.slug}>
          {b.nombre}
        </option>
      ))}
    </select>
  );
}

function FilaComparacion({
  etiqueta,
  valorA,
  valorB,
}: {
  etiqueta: string;
  valorA: number | string;
  valorB: number | string;
}) {
  const distintos = valorA !== valorB;
  return (
    <div className="grid grid-cols-3 gap-2 border-b border-bronce/20 py-1 font-mono text-sm">
      <span className={distintos ? "text-oro" : ""}>{valorA}</span>
      <span className="text-center font-technical text-xs text-bronce">{etiqueta}</span>
      <span className={`text-right ${distintos ? "text-oro" : ""}`}>{valorB}</span>
    </div>
  );
}

export default function CompararPage() {
  const { user, cargando } = useAuthStore();
  const [builds, setBuilds] = useState<BuildResumen[]>([]);
  const [slugA, setSlugA] = useState("");
  const [slugB, setSlugB] = useState("");
  const [buildA, setBuildA] = useState<BuildCompleto | null>(null);
  const [buildB, setBuildB] = useState<BuildCompleto | null>(null);

  useEffect(() => {
    if (user) listarMisBuilds().then(setBuilds);
  }, [user]);

  useEffect(() => {
    if (slugA) obtenerBuildPorSlug(slugA).then(setBuildA);
    else setBuildA(null);
  }, [slugA]);

  useEffect(() => {
    if (slugB) obtenerBuildPorSlug(slugB).then(setBuildB);
    else setBuildB(null);
  }, [slugB]);

  if (cargando) return null;

  if (!user) {
    return (
      <div className="flex min-h-full items-center justify-center bg-tinta p-6 text-foreground">
        <p className="font-sans text-sm text-foreground/60">
          Iniciá sesión para comparar tus builds guardados.
        </p>
      </div>
    );
  }

  const resultadoA = buildA ? calcularDano({ stats: buildA.stats }) : null;
  const resultadoB = buildB ? calcularDano({ stats: buildB.stats }) : null;

  return (
    <div className="flex min-h-full items-start justify-center bg-tinta p-6 text-foreground sm:p-12">
      <div className="panel-pergamino w-full max-w-2xl p-8">
        <MarcoOrnamental />
        <h1 className="font-display text-4xl text-oro">Comparar builds</h1>

        <div className="mt-5 grid grid-cols-2 gap-4">
          <SelectorBuild builds={builds} valor={slugA} onChange={setSlugA} />
          <SelectorBuild builds={builds} valor={slugB} onChange={setSlugB} />
        </div>

        {buildA && buildB && resultadoA && resultadoB && (
          <div className="mt-7 border-t border-bronce/50 pt-5">
            <FilaComparacion etiqueta="Raza" valorA={buildA.raza} valorB={buildB.raza} />
            <FilaComparacion etiqueta="Nivel" valorA={buildA.nivel} valorB={buildB.nivel} />
            <FilaComparacion
              etiqueta="Nivel Campeón"
              valorA={buildA.nivelCampeon}
              valorB={buildB.nivelCampeon}
            />
            <FilaComparacion etiqueta="VIT" valorA={buildA.stats.vit} valorB={buildB.stats.vit} />
            <FilaComparacion
              etiqueta="INT"
              valorA={buildA.stats.inteligencia}
              valorB={buildB.stats.inteligencia}
            />
            <FilaComparacion
              etiqueta="STR"
              valorA={buildA.stats.fuerza}
              valorB={buildB.stats.fuerza}
            />
            <FilaComparacion
              etiqueta="DEX"
              valorA={buildA.stats.destreza}
              valorB={buildB.stats.destreza}
            />
            <FilaComparacion
              etiqueta="Ítems equipados"
              valorA={buildA.equipo.length}
              valorB={buildB.equipo.length}
            />
            <FilaComparacion
              etiqueta="Piedras dragón"
              valorA={buildA.piedras.length}
              valorB={buildB.piedras.length}
            />
            <div className="mt-2 grid grid-cols-3 gap-2 pt-2 font-mono text-lg">
              <span className="text-sello">{resultadoA.total}</span>
              <span className="text-center font-technical text-xs text-bronce">
                Daño total (placeholder)
              </span>
              <span className="text-right text-sello">{resultadoB.total}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
