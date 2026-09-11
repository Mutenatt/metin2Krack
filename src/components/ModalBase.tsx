"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { motion } from "framer-motion";
import { MarcoOrnamental } from "./MarcoOrnamental";

interface ModalBaseProps {
  titulo: string;
  onCerrar: () => void;
  children: ReactNode;
  maxWidthClassName?: string;
}

export function ModalBase({ titulo, onCerrar, children, maxWidthClassName = "sm:max-w-lg" }: ModalBaseProps) {
  const contenedorRef = useRef<HTMLDivElement>(null);

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

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-0 sm:p-6"
      onClick={onCerrar}
    >
      <motion.div
        ref={contenedorRef}
        role="dialog"
        aria-modal="true"
        aria-label={titulo}
        tabIndex={-1}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.15 }}
        onClick={(e) => e.stopPropagation()}
        className={`panel-pergamino flex h-full w-full flex-col overflow-hidden p-6 outline-none sm:h-auto sm:max-h-[80vh] sm:w-full ${maxWidthClassName}`}
      >
        <MarcoOrnamental />
        <div className="flex items-center justify-between">
          <h3 className="font-display text-3xl text-oro">{titulo}</h3>
          <button
            type="button"
            onClick={onCerrar}
            className="font-technical text-sm text-bronce hover:text-oro"
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>
        {children}
      </motion.div>
    </div>
  );
}
