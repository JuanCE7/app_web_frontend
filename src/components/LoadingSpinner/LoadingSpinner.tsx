"use client";

import React from "react";
import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  /** Texto a mostrar bajo el spinner. Por defecto "Cargando…". */
  label?: string;
  /** Tamaño del icono en px. */
  size?: number;
  /** Ocupa toda la pantalla (centrado vertical + horizontal). */
  fullScreen?: boolean;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  label = "Cargando…",
  size = 32,
  fullScreen = false,
}) => {
  return (
    <div
      role="status"
      aria-live="polite"
      className={`flex flex-col items-center justify-center gap-3 text-muted-foreground ${
        fullScreen ? "min-h-[60vh]" : "py-8"
      }`}
    >
      <Loader2
        className="animate-spin text-primary"
        style={{ width: size, height: size }}
      />
      {label && <span className="text-sm font-medium">{label}</span>}
    </div>
  );
};
