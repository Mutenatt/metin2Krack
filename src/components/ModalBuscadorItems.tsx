"use client";

import { useEffect, useState } from "react";
import type { BonoDisponible, ItemBase } from "@/lib/supabase/items";
import { listarBonosDisponibles, listarItems } from "@/lib/supabase/items";
import type { ItemEquipado } from "@/store/buildStore";
import { ModalBase } from "./ModalBase";

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
    <ModalBase titulo={`Equipar ${etiqueta}`} onCerrar={onCerrar}>
      <div className="mt-4 flex gap-2">
        <input
          type="text"
          placeholder="Buscar por nombre..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="campo flex-1"
        />
        <input
          type="number"
          placeholder="Nivel máx."
          min={1}
          value={nivelMax}
          onChange={(e) => setNivelMax(e.target.value)}
          className="campo w-28 font-mono"
        />
      </div>

      <div className="mt-3 flex-1 overflow-y-auto border border-bronce/40 bg-tinta/30">
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
                className={`flex w-full items-center justify-between px-3 py-2 text-left font-sans text-sm transition-colors hover:bg-bronce/20 ${
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
        <div className="mt-4 border-t border-bronce/50 pt-4">
          <span className="etiqueta-campo">Bono (opcional)</span>
          <div className="mt-1 flex gap-2">
            <select
              value={bonoElegido?.id ?? ""}
              onChange={(e) => {
                const bono = bonosDisponibles.find((b) => b.id === Number(e.target.value)) ?? null;
                setBonoElegido(bono);
                setBonoValor(bono?.valor_min ?? 0);
              }}
              className="campo campo-select flex-1"
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
                className="campo w-20 font-mono"
              />
            )}
          </div>
        </div>
      )}

      <div className="mt-5 flex justify-end gap-2">
        <button type="button" onClick={onCerrar} className="boton-secundario">
          Cancelar
        </button>
        <button
          type="button"
          disabled={!itemSeleccionado}
          onClick={handleConfirmar}
          className="boton-primario"
        >
          Confirmar
        </button>
      </div>
    </ModalBase>
  );
}
