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
    <div className="mt-7 border-t border-bronce/50 pt-5">
      {!user ? (
        <button type="button" onClick={() => setModalLoginAbierto(true)} className="boton-secundario w-full">
          Iniciar sesión
        </button>
      ) : (
        <>
          <div className="flex items-center justify-between gap-2">
            <span className="truncate font-sans text-xs text-foreground/60">{user.email}</span>
            <button
              type="button"
              onClick={() => cerrarSesion()}
              className="shrink-0 font-technical text-[0.7rem] text-bronce hover:text-oro"
            >
              Cerrar sesión
            </button>
          </div>

          <div className="mt-4 space-y-2">
            <input
              type="text"
              placeholder="Nombre del build"
              value={nombreNuevo}
              onChange={(e) => setNombreNuevo(e.target.value)}
              className="campo"
            />
            <label className="flex items-center gap-2 font-sans text-xs text-foreground/60">
              <input
                type="checkbox"
                checked={esPublico}
                onChange={(e) => setEsPublico(e.target.checked)}
                className="accent-sello"
              />
              Público (compartible por link)
            </label>
            {error && <p className="font-sans text-xs text-sello">{error}</p>}
            <button
              type="button"
              disabled={!nombreNuevo || guardando}
              onClick={handleGuardar}
              className="boton-primario w-full"
            >
              {guardando ? "Guardando..." : "Guardar build"}
            </button>
          </div>

          {builds.length > 0 && (
            <div className="mt-5 space-y-1.5">
              <span className="etiqueta-campo">Mis builds</span>
              {builds.map((b) => (
                <div
                  key={b.id}
                  className="flex items-center justify-between gap-1 border border-bronce/30 bg-tinta/40 px-2.5 py-1.5"
                >
                  <span className="truncate font-sans text-xs">{b.nombre}</span>
                  <div className="flex shrink-0 gap-2.5 font-technical text-[0.65rem] uppercase tracking-wide">
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
              className="mt-4 block text-center font-technical text-xs text-bronce hover:text-oro"
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
