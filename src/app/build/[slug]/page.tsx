import { notFound } from "next/navigation";
import { obtenerBuildPorSlug } from "@/lib/supabase/builds";
import { calcularDano } from "@/lib/calculo/calcularDano";
import { MarcoOrnamental } from "@/components/MarcoOrnamental";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function BuildPublicoPage({ params }: PageProps) {
  const { slug } = await params;
  const build = await obtenerBuildPorSlug(slug);
  if (!build) notFound();

  const resultado = calcularDano({ stats: build.stats });

  return (
    <div className="flex min-h-full items-start justify-center bg-tinta p-6 text-foreground sm:p-12">
      <div className="panel-pergamino w-full max-w-2xl p-8">
        <MarcoOrnamental />
        <h1 className="font-display text-5xl leading-tight text-oro">{build.nombre}</h1>
        <p className="mt-2 font-technical text-sm uppercase tracking-wide text-bronce">
          {build.raza} — Nivel {build.nivel} (Campeón {build.nivelCampeon})
        </p>

        <div className="mt-6 grid grid-cols-4 gap-3 font-mono text-sm">
          <div>
            <span className="etiqueta-campo mb-0.5">VIT</span>
            {build.stats.vit}
          </div>
          <div>
            <span className="etiqueta-campo mb-0.5">INT</span>
            {build.stats.inteligencia}
          </div>
          <div>
            <span className="etiqueta-campo mb-0.5">STR</span>
            {build.stats.fuerza}
          </div>
          <div>
            <span className="etiqueta-campo mb-0.5">DEX</span>
            {build.stats.destreza}
          </div>
        </div>

        <div className="mt-7 border-t border-bronce/50 pt-5">
          <span className="etiqueta-campo">Daño total (placeholder)</span>
          <div className="numero-hero font-display text-5xl leading-none text-sello">
            {resultado.total}
          </div>
        </div>

        {build.equipo.length > 0 && (
          <div className="mt-6 border-t border-bronce/50 pt-5">
            <span className="etiqueta-campo">Equipamiento</span>
            <ul className="mt-1 space-y-0.5 font-sans text-sm">
              {build.equipo.map((eq) => (
                <li key={eq.tipoSlotCodigo}>
                  <span className="text-bronce">{eq.tipoSlotCodigo}:</span> {eq.equipado.item.nombre}
                </li>
              ))}
            </ul>
          </div>
        )}

        {build.piedras.length > 0 && (
          <div className="mt-6 border-t border-bronce/50 pt-5">
            <span className="etiqueta-campo">Piedras dragón</span>
            <ul className="mt-1 space-y-0.5 font-sans text-sm">
              {build.piedras.map((p) => (
                <li key={p.piedra.id}>
                  <span className="text-bronce">{p.piedra.nombre}:</span> {p.grado.pureza} —{" "}
                  {p.grado.grado}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
