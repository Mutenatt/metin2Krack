import { PanelEstadoPersonaje } from "@/components/PanelEstadoPersonaje";

export default function Home() {
  return (
    <div className="flex flex-1 gap-6 bg-tinta p-6">
      <PanelEstadoPersonaje />
      <main className="flex flex-1 items-center justify-center border-2 border-dashed border-bronce/40 text-foreground/50">
        <p className="font-technical text-sm">
          Equipamiento, alquimia y mascota llegan en las próximas fases.
        </p>
      </main>
    </div>
  );
}
