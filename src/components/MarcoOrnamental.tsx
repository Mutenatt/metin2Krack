function Esquina({ className }: { className: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      className={`pointer-events-none absolute h-4 w-4 text-bronce ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M1 9 V1 H9" />
    </svg>
  );
}

export function MarcoOrnamental() {
  return (
    <>
      <Esquina className="-left-px -top-px" />
      <Esquina className="-right-px -top-px rotate-90" />
      <Esquina className="-bottom-px -right-px rotate-180" />
      <Esquina className="-bottom-px -left-px -rotate-90" />
    </>
  );
}
