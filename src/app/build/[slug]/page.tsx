import { notFound } from "next/navigation";
import { obtenerBuildPorSlug } from "@/lib/supabase/builds";
import { calcularDano } from "@/lib/calculo/calcularDano";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function BuildPublicoPage({ params }: PageProps) {
  const { slug } = await params;
  const build = await obtenerBuildPorSlug(slug);
  if (!build) notFound();

  const resultado = calcularDano({ stats: build.stats });

  return (
    <div className="min-h-full bg-tinta p-6 text-foreground">
      <div className="mx-auto max-w-2xl border-2 border-bronce bg-pergamino/95 p-6">
        <h1 className="font-display text-4xl text-oro">{build.nombre}</h1>
        <p className="mt-1 font-technical text-sm text-bronce">
          {build.raza} — Nivel {build.nivel} (Campeón {build.nivelCampeon})
        </p>

        <div className="mt-4 grid grid-cols-4 gap-3 font-mono text-sm">
          <div>VIT: {build.stats.vit}</div>
          <div>INT: {build.stats.inteligencia}</div>
          <div>STR: {build.stats.fuerza}</div>
          <div>DEX: {build.stats.destreza}</div>
        </div>

        <div className="mt-4 border-t border-bronce pt-4">
          <span className="font-technical text-xs uppercase tracking-wide text-bronce">
            Daño total (placeholder)
          </span>
          <div className="font-display text-4xl text-sello">{resultado.total}</div>
        </div>

        {build.equipo.length > 0 && (
          <div className="mt-4 border-t border-bronce pt-4">
            <span className="font-technical text-xs uppercase tracking-wide text-bronce">
              Equipamiento
            </span>
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
          <div className="mt-4 border-t border-bronce pt-4">
            <span className="font-technical text-xs uppercase tracking-wide text-bronce">
              Piedras dragón
            </span>
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
