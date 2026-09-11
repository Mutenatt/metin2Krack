"use client";

import { useState } from "react";
import { ModalBase } from "./ModalBase";
import { enviarMagicLink, iniciarSesionConGoogle } from "@/lib/supabase/auth";

interface ModalLoginProps {
  onCerrar: () => void;
}

export function ModalLogin({ onCerrar }: ModalLoginProps) {
  const [email, setEmail] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleEnviarMagicLink() {
    if (!email) return;
    setEnviando(true);
    setError(null);
    try {
      await enviarMagicLink(email);
      setEnviado(true);
    } catch {
      setError("No se pudo enviar el link. Probá de nuevo.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <ModalBase titulo="Iniciar sesión" onCerrar={onCerrar} maxWidthClassName="sm:max-w-sm">
      {enviado ? (
        <p className="mt-4 font-sans text-sm text-verdin">
          Revisá tu email — te mandamos un link para entrar.
        </p>
      ) : (
        <>
          <label className="mt-5 block">
            <span className="etiqueta-campo">Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              className="campo"
            />
          </label>

          {error && <p className="mt-2 font-sans text-xs text-sello">{error}</p>}

          <button
            type="button"
            disabled={!email || enviando}
            onClick={handleEnviarMagicLink}
            className="boton-primario mt-3 w-full"
          >
            {enviando ? "Enviando..." : "Enviar link mágico"}
          </button>

          <div className="my-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-bronce/30" />
            <span className="font-technical text-xs text-bronce/50">o</span>
            <div className="h-px flex-1 bg-bronce/30" />
          </div>

          <button type="button" onClick={() => iniciarSesionConGoogle()} className="boton-secundario w-full">
            Continuar con Google
          </button>
        </>
      )}
    </ModalBase>
  );
}
