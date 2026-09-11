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
    <select
      value={valor}
      onChange={(e) => onChange(e.target.value)}
      className="w-full border border-bronce bg-tinta px-2 py-1 font-sans text-sm"
    >
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
        <p className="font-sans text-sm text-foreground/70">
          Iniciá sesión para comparar tus builds guardados.
        </p>
      </div>
    );
  }

  const resultadoA = buildA ? calcularDano({ stats: buildA.stats }) : null;
  const resultadoB = buildB ? calcularDano({ stats: buildB.stats }) : null;

  return (
    <div className="min-h-full bg-tinta p-6 text-foreground">
      <div className="mx-auto max-w-2xl border-2 border-bronce bg-pergamino/95 p-6">
        <h1 className="font-display text-3xl text-oro">Comparar builds</h1>

        <div className="mt-4 grid grid-cols-2 gap-4">
          <SelectorBuild builds={builds} valor={slugA} onChange={setSlugA} />
          <SelectorBuild builds={builds} valor={slugB} onChange={setSlugB} />
        </div>

        {buildA && buildB && resultadoA && resultadoB && (
          <div className="mt-6 border-t border-bronce pt-4">
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
