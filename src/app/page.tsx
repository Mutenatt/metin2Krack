import { PanelEstadoPersonaje } from "@/components/PanelEstadoPersonaje";
import { AreaPrincipal } from "@/components/AreaPrincipal";

export default function Home() {
  return (
    <div className="flex flex-1 gap-6 bg-tinta p-6">
      <PanelEstadoPersonaje />
      <main className="flex flex-1 items-start justify-center pt-4">
        <AreaPrincipal />
      </main>
    </div>
  );
}
