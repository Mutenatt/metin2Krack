"use client";

import { useEffect, useState } from "react";
import { useMotionValue, useSpring } from "framer-motion";

interface NumeroAnimadoProps {
  valor: number;
  className?: string;
}

export function NumeroAnimado({ valor, className }: NumeroAnimadoProps) {
  const motionValue = useMotionValue(valor);
  const spring = useSpring(motionValue, { stiffness: 120, damping: 20 });
  const [display, setDisplay] = useState(valor);

  useEffect(() => {
    motionValue.set(valor);
  }, [valor, motionValue]);

  useEffect(() => {
    return spring.on("change", (latest) => setDisplay(Math.round(latest)));
  }, [spring]);

  return <span className={className}>{display.toLocaleString("es-AR")}</span>;
}
