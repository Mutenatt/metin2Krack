"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import type { BonoDisponible, ItemBase } from "@/lib/supabase/items";
import { listarBonosDisponibles, listarItems } from "@/lib/supabase/items";
import type { ItemEquipado } from "@/store/buildStore";

interface ModalBuscadorItemsProps {
  tipoSlotCodigo: string;
  etiqueta: string;
  itemActual?: ItemEquipado;
  onCerrar: () => void;
  onConfirmar: (itemEquipado: ItemEquipado) => void;
}

export function ModalBuscadorItems({
  tipoSlotCodigo,
  etiqueta,
  itemActual,
  onCerrar,
  onConfirmar,
}: ModalBuscadorItemsProps) {
  const contenedorRef = useRef<HTMLDivElement>(null);

  const [busqueda, setBusqueda] = useState("");
  const [nivelMax, setNivelMax] = useState("");
  const [items, setItems] = useState<ItemBase[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [itemSeleccionado, setItemSeleccionado] = useState<ItemBase | null>(
    itemActual?.item ?? null,
  );
  const [bonosDisponibles, setBonosDisponibles] = useState<BonoDisponible[]>([]);
  const [bonoElegido, setBonoElegido] = useState<BonoDisponible | null>(itemActual?.bono ?? null);
  const [bonoValor, setBonoValor] = useState<number>(itemActual?.bonoValor ?? 0);

  useEffect(() => {
    let cancelado = false;
    setCargando(true);
    setError(null);
    listarItems({
      tipoSlotCodigo,
      nivelMax: nivelMax ? Number(nivelMax) : undefined,
      busqueda: busqueda || undefined,
    })
      .then((data) => {
        if (!cancelado) setItems(data);
      })
      .catch(() => {
        if (!cancelado) setError("No se pudo cargar la lista de ítems.");
      })
      .finally(() => {
        if (!cancelado) setCargando(false);
      });
    return () => {
      cancelado = true;
    };
  }, [tipoSlotCodigo, nivelMax, busqueda]);

  useEffect(() => {
    if (!itemSeleccionado) {
      setBonosDisponibles([]);
      return;
    }
    listarBonosDisponibles(itemSeleccionado.id).then(setBonosDisponibles);
  }, [itemSeleccionado]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onCerrar();
        return;
      }
      if (e.key === "Tab" && contenedorRef.current) {
        const focusables = contenedorRef.current.querySelectorAll<HTMLElement>(
          "button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])",
        );
        if (focusables.length === 0) return;
        const primero = focusables[0];
        const ultimo = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === primero) {
          e.preventDefault();
          ultimo.focus();
        } else if (!e.shiftKey && document.activeElement === ultimo) {
          e.preventDefault();
          primero.focus();
        }
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    contenedorRef.current?.focus();
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onCerrar]);

  function handleSeleccionarItem(item: ItemBase) {
    setItemSeleccionado(item);
    setBonoElegido(null);
    setBonoValor(0);
  }

  function handleConfirmar() {
    if (!itemSeleccionado) return;
    onConfirmar({
      item: itemSeleccionado,
      bono: bonoElegido,
      bonoValor: bonoElegido ? bonoValor : null,
    });
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-0 sm:p-6"
      onClick={onCerrar}
    >
      <motion.div
        ref={contenedorRef}
        role="dialog"
        aria-modal="true"
        aria-label={`Buscar ${etiqueta}`}
        tabIndex={-1}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.15 }}
        onClick={(e) => e.stopPropagation()}
        className="flex h-full w-full flex-col border-2 border-bronce bg-pergamino p-5 outline-none sm:h-auto sm:max-h-[80vh] sm:w-full sm:max-w-lg"
      >
        <div className="flex items-center justify-between">
          <h3 className="font-display text-2xl text-oro">Equipar {etiqueta}</h3>
          <button
            type="button"
            onClick={onCerrar}
            className="font-technical text-sm text-bronce hover:text-oro"
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>

        <div className="mt-3 flex gap-2">
          <input
            type="text"
            placeholder="Buscar por nombre..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="flex-1 border border-bronce bg-tinta px-2 py-1 font-sans text-sm"
          />
          <input
            type="number"
            placeholder="Nivel máx."
            min={1}
            value={nivelMax}
            onChange={(e) => setNivelMax(e.target.value)}
            className="w-28 border border-bronce bg-tinta px-2 py-1 font-mono text-sm"
          />
        </div>

        <div className="mt-3 flex-1 overflow-y-auto border border-bronce/50">
          {cargando && (
            <div className="space-y-1 p-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-8 animate-pulse bg-bronce/20" />
              ))}
            </div>
          )}

          {!cargando && error && <p className="p-3 font-sans text-sm text-sello">{error}</p>}

          {!cargando && !error && items.length === 0 && (
            <p className="p-3 font-sans text-sm text-foreground/60">
              No hay ítems con estos filtros — probá subir el nivel máximo.
            </p>
          )}

          {!cargando &&
            !error &&
            items.map((item) => {
              const esActual = itemActual?.item.id === item.id;
              const esSeleccionado = itemSeleccionado?.id === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSeleccionarItem(item)}
                  className={`flex w-full items-center justify-between px-3 py-2 text-left font-sans text-sm hover:bg-bronce/20 ${
                    esSeleccionado ? "bg-bronce/30" : ""
                  } ${esActual ? "border-l-4 border-sello" : ""}`}
                >
                  <span>{item.nombre}</span>
                  <span className="font-mono text-xs text-bronce">Nv. {item.nivel_requerido}</span>
                </button>
              );
            })}
        </div>

        {itemSeleccionado && bonosDisponibles.length > 0 && (
          <div className="mt-3 border-t border-bronce pt-3">
            <span className="font-technical text-xs uppercase tracking-wide text-bronce">
              Bono (opcional)
            </span>
            <div className="mt-1 flex gap-2">
              <select
                value={bonoElegido?.id ?? ""}
                onChange={(e) => {
                  const bono = bonosDisponibles.find((b) => b.id === Number(e.target.value)) ?? null;
                  setBonoElegido(bono);
                  setBonoValor(bono?.valor_min ?? 0);
                }}
                className="flex-1 border border-bronce bg-tinta px-2 py-1 font-sans text-sm"
              >
                <option value="">Sin bono</option>
                {bonosDisponibles.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.bono.nombre} ({b.valor_min}–{b.valor_max})
                  </option>
                ))}
              </select>
              {bonoElegido && (
                <input
                  type="number"
                  min={bonoElegido.valor_min}
                  max={bonoElegido.valor_max}
                  value={bonoValor}
                  onChange={(e) =>
                    setBonoValor(
                      Math.min(
                        Math.max(bonoElegido.valor_min, Number(e.target.value) || 0),
                        bonoElegido.valor_max,
                      ),
                    )
                  }
                  className="w-20 border border-bronce bg-tinta px-2 py-1 font-mono text-sm"
                />
              )}
            </div>
          </div>
        )}

        <div className="mt-4 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCerrar}
            className="border border-bronce px-3 py-1.5 font-technical text-sm text-bronce hover:text-oro"
          >
            Cancelar
          </button>
          <button
            type="button"
            disabled={!itemSeleccionado}
            onClick={handleConfirmar}
            className="border border-sello bg-sello/80 px-3 py-1.5 font-technical text-sm text-foreground disabled:cursor-not-allowed disabled:opacity-40"
          >
            Confirmar
          </button>
        </div>
      </motion.div>
    </div>
  );
}
