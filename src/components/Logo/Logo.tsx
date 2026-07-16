"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface LogoProps {
  /** Oculta el wordmark y deja solo el ícono. */
  iconOnly?: boolean;
  /** Variante para fondos oscuros/teal (caja blanca + texto blanco). */
  onDark?: boolean;
  /** Clases extra para el contenedor. */
  className?: string;
}

export function Logo({ iconOnly = false, onDark = false, className }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span
        className={cn(
          "flex h-8 w-8 items-center justify-center rounded-lg shadow-sm",
          onDark ? "bg-white text-primary" : "bg-primary text-primary-foreground"
        )}
      >
        <Check className="h-5 w-5" strokeWidth={3} />
      </span>
      {!iconOnly && (
        <span
          className={cn(
            "text-lg font-bold tracking-tight",
            onDark ? "text-white" : "text-foreground"
          )}
        >
          TestCaseCraft
        </span>
      )}
    </div>
  );
}
