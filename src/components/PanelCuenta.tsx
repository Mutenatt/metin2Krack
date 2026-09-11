"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { cerrarSesion } from "@/lib/supabase/auth";
import { eliminarBuild, guardarBuild, listarMisBuilds, obtenerBuildPorSlug, aplicarBuildAlStore, type BuildResumen } from "@/lib/supabase/builds";
import { ModalLogin } from "./ModalLogin";

export function PanelCuenta() {
  const { user, cargando } = useAuthStore();
  const [modalLoginAbierto, setModalLoginAbierto] = useState(false);
  const [builds, setBuilds] = useState<BuildResumen[]>([]);
  const [nombreNuevo, setNombreNuevo] = useState("");
  const [esPublico, setEsPublico] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [linkCopiado, setLinkCopiado] = useState<string | null>(null);

  async function recargarBuilds() {
    const lista = await listarMisBuilds();
    setBuilds(lista);
  }

  useEffect(() => {
    if (user) recargarBuilds();
    else setBuilds([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  async function handleGuardar() {
    if (!nombreNuevo) return;
    setGuardando(true);
    setError(null);
    try {
      await guardarBuild(nombreNuevo, esPublico);
      setNombreNuevo("");
      setEsPublico(false);
      await recargarBuilds();
    } catch {
      setError("No se pudo guardar el build.");
    } finally {
      setGuardando(false);
    }
  }

  async function handleCargar(slug: string) {
    const build = await obtenerBuildPorSlug(slug);
    if (build) aplicarBuildAlStore(build);
  }

  async function handleEliminar(id: string) {
    await eliminarBuild(id);
    await recargarBuilds();
  }

  function handleCopiarLink(slug: string) {
    const url = `${window.location.origin}/build/${slug}`;
    navigator.clipboard.writeText(url);
    setLinkCopiado(slug);
    setTimeout(() => setLinkCopiado(null), 1500);
  }

  if (cargando) return null;

  return (
    <div className="mt-4 border-t border-bronce pt-4">
      {!user ? (
        <button
          type="button"
          onClick={() => setModalLoginAbierto(true)}
          className="w-full border border-bronce px-3 py-1.5 font-technical text-sm text-bronce hover:text-oro"
        >
          Iniciar sesión
        </button>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <span className="truncate font-sans text-xs text-foreground/70">{user.email}</span>
            <button
              type="button"
              onClick={() => cerrarSesion()}
              className="font-technical text-xs text-bronce hover:text-oro"
            >
              Cerrar sesión
            </button>
          </div>

          <div className="mt-3 space-y-2">
            <input
              type="text"
              placeholder="Nombre del build"
              value={nombreNuevo}
              onChange={(e) => setNombreNuevo(e.target.value)}
              className="w-full border border-bronce bg-tinta px-2 py-1 font-sans text-sm"
            />
            <label className="flex items-center gap-2 font-sans text-xs text-foreground/70">
              <input
                type="checkbox"
                checked={esPublico}
                onChange={(e) => setEsPublico(e.target.checked)}
              />
              Público (compartible por link)
            </label>
            {error && <p className="font-sans text-xs text-sello">{error}</p>}
            <button
              type="button"
              disabled={!nombreNuevo || guardando}
              onClick={handleGuardar}
              className="w-full border border-sello bg-sello/80 px-3 py-1.5 font-technical text-sm text-foreground disabled:cursor-not-allowed disabled:opacity-40"
            >
              {guardando ? "Guardando..." : "Guardar build"}
            </button>
          </div>

          {builds.length > 0 && (
            <div className="mt-4 space-y-1">
              <span className="font-technical text-xs uppercase tracking-wide text-bronce">
                Mis builds
              </span>
              {builds.map((b) => (
                <div
                  key={b.id}
                  className="flex items-center justify-between gap-1 border border-bronce/40 px-2 py-1"
                >
                  <span className="truncate font-sans text-xs">{b.nombre}</span>
                  <div className="flex shrink-0 gap-2 font-technical text-[10px]">
                    <button type="button" onClick={() => handleCargar(b.slug)} className="text-bronce hover:text-oro">
                      Cargar
                    </button>
                    <button type="button" onClick={() => handleCopiarLink(b.slug)} className="text-bronce hover:text-oro">
                      {linkCopiado === b.slug ? "Copiado" : "Link"}
                    </button>
                    <button type="button" onClick={() => handleEliminar(b.id)} className="text-sello hover:text-oro">
                      Borrar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {builds.length >= 2 && (
            <a
              href="/comparar"
              className="mt-3 block text-center font-technical text-xs text-bronce hover:text-oro"
            >
              Comparar builds →
            </a>
          )}
        </>
      )}

      {modalLoginAbierto && <ModalLogin onCerrar={() => setModalLoginAbierto(false)} />}
    </div>
  );
}
